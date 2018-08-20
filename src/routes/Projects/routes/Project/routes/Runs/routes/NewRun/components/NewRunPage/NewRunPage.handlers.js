import { get } from 'lodash'
import { paths } from 'constants'

export function goBack({ router, projectId }) {
  return () => {
    router.push(`${paths.list}/${projectId}/${paths.runs}`)
  }
}

export function startTestRun({ firebase, projectId }) {
  return values => {
    const environment = get(values, 'environment', '')
    const instanceTemplateName = `test-${projectId}-${environment}`
    const pushRef = firebase.pushWithMeta('test_runs_meta', {
      environment,
      instanceTemplateName
    })
    const pushKey = pushRef.key
    return firebase.push('requests/callRunner', {
      jobRunKey: pushKey,
      environment,
      baristaProject: projectId,
      instanceTemplateName
    })
  }
}
