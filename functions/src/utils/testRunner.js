import { rtdbRef, waitForValue } from './rtdb'
import { getLocalServiceAccount, getFirebaseConfig } from './firebaseFunctions'
import { to } from './async'
import { REQUESTS_PATH, RESPONSES_PATH, CALL_GOOGLE_API_PATH } from 'constants'

/**
 * Create body of request to create a VM on Google Compute Engine
 * @param  {String} [cloudZone='us-west1-b'] [description]
 * @param  {Object} [meta=null] - Object of extra metadata to pass to request
 * @return {Object} Body to be used in Google API Request
 */
function createRunRequest({
  cloudZone = 'us-west1-b',
  instanceTemplateName,
  createdBy,
  meta = null
}) {
  const cloudProjectId = getFirebaseConfig('projectId')
  // NOTE: requestId can not be used in name since it does not conform to
  // name field standards with Compute's API. Instead the requestId is used
  // as a tag. Error caused looked like so:
  // 'Invalid value for field \'resource.name\':
  // 'Must be a match of regex \'(?:[a-z](?:[-a-z0-9]{0,61}[a-z0-9])?)\'' }
  const name = `barback-instance-${Date.now()}`
  const { client_email: serviceAccountEmail } = getLocalServiceAccount()
  const body = {
    kind: 'compute#instance',
    name,
    zone: `projects/${cloudProjectId}/zones/${cloudZone}`,
    machineType: `projects/${cloudProjectId}/zones/${cloudZone}/machineTypes/g1-small`,
    metadata: {
      kind: 'compute#metadata',
      items: [
        {
          key: 'gce-container-declaration',
          value: `spec:\n  containers:\n    - name: test-barista-stage\n      image: gcr.io/${cloudProjectId}/test-barista\n      stdin: false\n      tty: false\n  restartPolicy: Never\n\n# This container declaration format is not public API and may change without notice. Please\n# use gcloud command-line tool or Google Cloud Console to run Containers on Google Compute Engine.`
        }
      ]
    },
    tags: {
      items: []
    },
    disks: [
      {
        kind: 'compute#attachedDisk',
        type: 'PERSISTENT',
        boot: true,
        mode: 'READ_WRITE',
        autoDelete: true,
        deviceName: `${name}-storage`,
        initializeParams: {
          sourceImage:
            'projects/cos-cloud/global/images/cos-stable-67-10575-55-0',
          diskType: `projects/${cloudProjectId}/zones/${cloudZone}/diskTypes/pd-standard`,
          diskSizeGb: '10'
        }
      }
    ],
    canIpForward: false,
    networkInterfaces: [
      {
        kind: 'compute#networkInterface',
        // DO NOT ADD ZONE HERE - IT IS DIFFERENT
        subnetwork: `projects/${cloudProjectId}/regions/us-west1/subnetworks/default`,
        accessConfigs: [
          {
            kind: 'compute#accessConfig',
            name: 'External NAT',
            type: 'ONE_TO_ONE_NAT',
            networkTier: 'PREMIUM'
          }
        ],
        aliasIpRanges: []
      }
    ],
    description: '',
    labels: {
      'container-vm': 'cos-stable-67-10575-55-0'
    },
    scheduling: {
      preemptible: true,
      onHostMaintenance: 'TERMINATE',
      automaticRestart: false
    },
    deletionProtection: false,
    serviceAccounts: [
      {
        email: serviceAccountEmail,
        scopes: [
          'https://www.googleapis.com/auth/devstorage.read_only',
          'https://www.googleapis.com/auth/logging.write',
          'https://www.googleapis.com/auth/monitoring.write',
          'https://www.googleapis.com/auth/servicecontrol',
          'https://www.googleapis.com/auth/service.management.readonly',
          'https://www.googleapis.com/auth/trace.append'
        ]
      }
    ]
  }

  return {
    api: 'compute',
    createdBy,
    method: 'POST',
    meta,
    suffix: `projects/${cloudProjectId}/zones/${cloudZone}/instances?souceInstanceTemplate=global/instanceTemplates/${instanceTemplateName}`,
    body
  }
}

/**
 * Start test run with specified template by creating request to callGoogleApi
 * function.
 * @param  {String} requestId - id of original
 * @param  {String} createdBy - UID of request creator
 * @param  {String} [instanceTemplateName='test-barista-stage'}] [description]
 * @return {Promise}
 */
export async function callTestRunner({
  meta,
  createdBy,
  instanceTemplateName = 'test-brawndo-stage'
}) {
  const requestRef = rtdbRef(`${REQUESTS_PATH}/${CALL_GOOGLE_API_PATH}`).push()
  const responseRef = rtdbRef(
    `${RESPONSES_PATH}/${CALL_GOOGLE_API_PATH}/${requestRef.key}`
  )
  const runRequest = createRunRequest({ instanceTemplateName, createdBy, meta })
  // Push request to call google api function (set used since push is used
  // syncrounously earlier to create key)
  const [requestErr] = await to(requestRef.set(runRequest))
  // Handle errors writing request to RTDB
  if (requestErr) {
    console.error(
      `Error writing request to RTDB: ${requestErr.message || ''}`,
      requestErr
    )
    throw requestErr
  }
  const [responseErr, responseSnap] = await to(waitForValue(responseRef))
  // Handle errors waiting for response from RTDB
  if (responseErr) {
    console.error(
      `Error waiting for response from test run start: ${responseErr.message ||
        ''}`,
      responseErr
    )
    throw responseErr
  }
  return responseSnap
}
