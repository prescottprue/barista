import { get } from 'lodash'
import { TEST_RUNS_META_PATH, CALL_RUNNER_REQUEST_PATH } from 'constants'

/**
 * Handler for going back to runs page
 * @param  {Object} props - Component props
 * @return {Function} Function which accepts form values and starts test run
 */
export function goBack({ runsPagePath, router }) {
  return () => {
    router.push(runsPagePath)
  }
}

/**
 * Handler for starting test run. Works by pushing to requests/callRunner
 * which triggers the callRunner function.
 * @param  {Object} props - Component props
 * @return {Function} Function which accepts form values and starts test run
 */
export function startTestRun({ firebase, projectId, router, runsPagePath }) {
  return values => {
    const environment = get(values, 'environment', '')
    const instanceTemplateName = `test-${projectId}-${environment}`
    const pushRef = firebase.pushWithMeta(
      `${TEST_RUNS_META_PATH}/${projectId}`,
      {
        environment,
        status: 'pending',
        instanceTemplateName
      }
    )
    const pushKey = pushRef.key
    return firebase
      .push(CALL_RUNNER_REQUEST_PATH, {
        jobRunKey: pushKey,
        environment,
        baristaProject: projectId,
        instanceTemplateName
      })
      .then(() => {
        return router.push(`${runsPagePath}/${pushKey}`)
      })
  }
}
