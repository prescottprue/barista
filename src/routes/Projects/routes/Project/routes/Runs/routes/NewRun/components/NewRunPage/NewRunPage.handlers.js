import { get, reduce, isArray, compact, trim } from 'lodash'
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
  return (values = {}) => {
    const { appEnvironment, testCodeBranch, testGroups = [] } = values
    const selectedTestGroups = testGroups.map(testGroupKey =>
      get(testGroups, testGroupKey, testGroupKey)
    )
    // Get list of file names as a string from all selected groups
    const fileNamesStr = reduce(
      selectedTestGroups,
      (acc, selectedTestGroup) => {
        if (
          !selectedTestGroup ||
          !selectedTestGroup.filePaths ||
          !isArray(selectedTestGroup.filePaths)
        ) {
          return acc
        }
        // File paths is a valid array
        return compact(selectedTestGroup.filePaths)
          .map(trim)
          .join(',')
      },
      ''
    )
    // Create Test Command option and value for use in test command
    const fileNamesArg = `-s ${fileNamesStr}`
    const instanceTemplateName = `test-${projectId}`
    const pushRef = firebase.pushWithMeta(
      `${TEST_RUNS_META_PATH}/${projectId}`,
      {
        appEnvironment,
        status: 'pending',
        instanceTemplateName
      }
    )
    const pushKey = pushRef.key
    return firebase
      .push(CALL_RUNNER_REQUEST_PATH, {
        jobRunKey: pushKey,
        appEnvironment,
        testCodeBranch,
        commandArgsStr: fileNamesArg,
        baristaProject: projectId,
        instanceTemplateName,
        buildId
      })
      .then(() => {
        return router.push(`${runsPagePath}/${pushKey}`)
      })
  }
}
