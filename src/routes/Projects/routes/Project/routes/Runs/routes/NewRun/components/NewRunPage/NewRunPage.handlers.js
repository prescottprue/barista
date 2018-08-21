import { get } from 'lodash'
import { paths } from 'constants'

export function goBack({ router, projectId }) {
  return () => {
    router.push(`${paths.list}/${projectId}/${paths.runs}`)
  }
}

export function startTestRun({ firebase, projectId, router }) {
  return values => {
    const environment = get(values, 'environment', '')
    const instanceTemplateName = `test-${projectId}-${environment}`
    const pushRef = firebase.pushWithMeta('test_runs_meta', {
      environment,
      status: 'pending',
      instanceTemplateName
    })
    const pushKey = pushRef.key
    firebase.push('requests/callRunner', {
      jobRunKey: pushKey,
      environment,
      baristaProject: projectId,
      instanceTemplateName
    })
    router.push(`/${paths.list}/${projectId}/runs/${pushKey}`)
  }
}
