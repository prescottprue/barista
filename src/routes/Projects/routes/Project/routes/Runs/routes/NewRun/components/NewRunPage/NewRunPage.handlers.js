import { get, reduce } from 'lodash'
import { TEST_RUNS_META_PATH, CALL_RUNNER_REQUEST_PATH } from 'constants'

/**
 * Handler for starting test run. Works by pushing to requests/callRunner
 * which triggers the callRunner function.
 * @param  {Object} props - Component props
 * @return {Function} Function which accepts form values and starts test run
 */
export function startTestRun({
  firebase,
  projectId,
  testGroups,
  router,
  runsPagePath,
  buildId
}) {
  return values => {
    const environment = get(values, 'environment', '')
    const selectedTestGroups = get(values, 'testGroups', []).map(testGroupKey =>
      get(testGroups, testGroupKey, testGroupKey)
    )
    // Get list of file names as a string from all selected groups
    const fileNamesStr = reduce(
      selectedTestGroups,
      (acc, selectedTestGroup) => {
        if (!selectedTestGroup.filePaths) {
          return acc
        }
        return acc.concat(Object.keys(selectedTestGroup.filePaths).join(','))
      },
      ''
    )
    // Create Test Command option and value for use in test command
    const fileNamesArg = `-s ${fileNamesStr}`
    // Create test command out of combination of options
    const commandArgsStr = ` ${fileNamesArg}`
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
        commandArgsStr,
        baristaProject: projectId,
        instanceTemplateName,
        buildId
      })
      .then(() => {
        return router.push(`${runsPagePath}/${pushKey}`)
      })
  }
}
