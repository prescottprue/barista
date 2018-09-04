import { get, reduce, isArray, compact, trim, uniq } from 'lodash'
import { TEST_RUNS_META_PATH, CALL_RUNNER_REQUEST_PATH } from 'constants'

function createCommandArgs({ testGroups, selectedTestGroupKeys }) {
  // Get list of file names as a string from all selected groups
  const fileNamesStr = reduce(
    selectedTestGroupKeys,
    (acc, selectedTestGroupKey) => {
      const filePaths = get(testGroups, `${selectedTestGroupKey}.filePaths`)
      if (!isArray(filePaths)) {
        return acc
      }
      // File paths is a valid array
      const cleanedPaths = compact(filePaths).map(trim)
      // Join into string removing duplicates
      return uniq(cleanedPaths).join(',')
    },
    ''
  )
  // Create Test Command option and value for use in test command
  const finalCommand = `${fileNamesStr.length ? `-s ${fileNamesStr}` : ''}`
  return finalCommand.length ? finalCommand : ''
}

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
    const {
      environment,
      testCodeBranch,
      testGroups: selectedTestGroupKeys
    } = values
    const commandArgsStr = createCommandArgs({
      selectedTestGroupKeys,
      testGroups
    })
    const instanceTemplateName = `test-${projectId}`
    // Push pending status to meta path
    const metaRef = firebase.pushWithMeta(
      `${TEST_RUNS_META_PATH}/${projectId}`,
      {
        environment,
        status: 'pending',
        instanceTemplateName
      }
    )
    const pushKey = metaRef.key
    // Push request to callRunner Cloud Function with the key from metaRef
    return firebase
      .pushWithMeta(CALL_RUNNER_REQUEST_PATH, {
        jobRunKey: pushKey,
        environment,
        testCodeBranch,
        commandArgsStr,
        baristaProject: projectId,
        instanceTemplateName,
        buildId
      })
      .then(() => {
        // Go to new job detail page
        return router.push(`${runsPagePath}/${pushKey}`)
      })
  }
}
