import { rtdbRef, waitForValue } from './rtdb'
import { getLocalServiceAccount } from './firebaseFunctions'
import { to } from './async'

/**
 * Create body of request to create a VM on Google Compute Engine
 * @param  {String} cloudProjectId [description]
 * @param  {String} cloudZone      [description]
 * @return {Object}                [description]
 */
function createRequestBody({ cloudProjectId, cloudZone, requestId }) {
  // NOTE: requestId can not be used in name since it does not conform to
  // name field standards with Compute's API. Instead the requestId is used
  // as a tag. Error caused looked like so:
  // 'Invalid value for field \'resource.name\':
  // 'Must be a match of regex \'(?:[a-z](?:[-a-z0-9]{0,61}[a-z0-9])?)\'' }
  const name = `barback-instance-${Date.now()}`
  const { client_email: serviceAccountEmail } = getLocalServiceAccount()
  return {
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
}

/**
 * Run tests by invoking barback container within Google Cloud Compute Engine
 * @param req - Express HTTP Request
 * @param res - Express HTTP Response
 */
export async function startTestRun({
  environment: baristaEnvironment,
  projectId: baristaProjectId,
  requestId,
  createdBy
}) {
  const instanceTemplateName = 'test-barista-stage'
  const cloudProjectId = process.env.GCLOUD_PROJECT || 'barista-836b4'
  const cloudZone = 'us-west1-b'
  const body = createRequestBody({ cloudProjectId, cloudZone, requestId })
  console.log('Calling with body:', body)
  const requestRef = rtdbRef(`requests/callGoogleApi`).push()
  const responseRef = rtdbRef(`responses/callGoogleApi/${requestRef.key}`)
  // Push request to call google api function
  const [requestErr] = await to(
    requestRef.set({
      api: 'compute',
      createdBy,
      method: 'POST',
      suffix: `projects/${cloudProjectId}/zones/${cloudZone}/instances?souceInstanceTemplate=global/instanceTemplates/${instanceTemplateName}`,
      projectId: baristaProjectId,
      environment: baristaEnvironment,
      body
    })
  )
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
