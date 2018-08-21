import { get } from 'lodash'
import { paths, TEST_RUNS_META_PATH } from 'constants'

export function goBack({ router, projectId }) {
  return () => {
    router.push(`${paths.list}/${projectId}/${paths.runs}`)
  }
}

export function startTestRun({ firebase, projectId, router }) {
  return values => {
    const environment = get(values, 'environment', '')
    const instanceTemplateName = `test-${projectId}-${environment}`
    const pushRef = firebase.pushWithMeta(TEST_RUNS_META_PATH, {
      environment,
      status: 'pending',
      instanceTemplateName
    })
    const pushKey = pushRef.key
    return firebase
      .push('requests/callRunner', {
        jobRunKey: pushKey,
        environment,
        baristaProject: projectId,
        instanceTemplateName
      })
      .then(() => {
        return router.push(`/${paths.list}/${projectId}/runs/${pushKey}`)
      })
  }
}
