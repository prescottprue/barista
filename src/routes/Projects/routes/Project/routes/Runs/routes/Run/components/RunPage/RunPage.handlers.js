import { firebase as fbConfig } from 'config'

function createRequestBody({ projectId, cloudZone }) {
  return {
    kind: 'compute#instance',
    name: 'instance-from-client',
    zone: `projects/${projectId}/zones/${cloudZone}`,
    machineType: `projects/${projectId}/zones/${cloudZone}/machineTypes/g1-small`,
    metadata: {
      kind: 'compute#metadata',
      items: [
        {
          key: 'gce-container-declaration',
          value: `spec:\n  containers:\n    - name: barback-template\n      image: gcr.io/${projectId}/barback\n      stdin: false\n      tty: false\n  restartPolicy: Never\n\n# This container declaration format is not public API and may change without notice. Please\n# use gcloud command-line tool or Google Cloud Console to run Containers on Google Compute Engine.`
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
        deviceName: 'barback-template-1',
        initializeParams: {
          sourceImage:
            'projects/cos-cloud/global/images/cos-stable-67-10575-55-0',
          diskType:
            'projects/barista-836b4/zones/us-west1-b/diskTypes/pd-standard',
          diskSizeGb: '10'
        }
      }
    ],
    canIpForward: false,
    networkInterfaces: [
      {
        kind: 'compute#networkInterface',
        subnetwork:
          'projects/barista-836b4/regions/us-west1/subnetworks/default',
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
        email: 'functions-dev-2@barista-836b4.iam.gserviceaccount.com',
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

export function startTestRun({ firebase }) {
  const instanceTemplateName = 'barback-template'
  const cloudZone = 'us-west1-b'
  const cloudProjectId = fbConfig.projectId
  const baristaProjectId = 'EJrWyFiygj6y3g2FfZh7'
  const baristaEnvironment = 'B2rKSXXOtyF5JBzXeI6k'
  const requestBody = createRequestBody({ cloudProjectId, cloudZone })
  return () => {
    firebase.push('requests/callGoogleApi', {
      api: 'compute',
      method: 'POST',
      suffix: `projects/${cloudProjectId}/zones/${cloudZone}/instances?souceInstanceTemplate=global/instanceTemplates/${instanceTemplateName}`,
      projectId: baristaProjectId,
      environment: baristaEnvironment,
      body: requestBody
    })
  }
}
