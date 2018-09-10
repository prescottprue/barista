import { invoke, get } from 'lodash'
import {
  CALL_RUNNER_REQUEST_PATH,
  TEST_RUNS_META_PATH,
  LIST_PATH,
  RUNS_PATH
} from 'constants'

export function reRunJob({
  environment,
  instanceTemplateName,
  runnerRequestMeta,
  firebase,
  router,
  projectId
}) {
  return e => {
    invoke(e, 'preventDefault')
    invoke(e, 'stopPropagation')
    const requestId = get(runnerRequestMeta, 'requestId', false)
    const runsPagePath = `${LIST_PATH}/${projectId}/${RUNS_PATH}`
    if (requestId) {
      return firebase
        .ref(`${CALL_RUNNER_REQUEST_PATH}/${requestId}`)
        .once('value')
        .then(async copiedRequestSnap => {
          const newRunRef = await firebase.pushWithMeta(
            `${TEST_RUNS_META_PATH}/${projectId}`,
            {
              status: 'pending',
              instanceTemplateName,
              environment
            }
          )
          let newRequest = copiedRequestSnap.val()
          newRequest.parentJobRunKey = newRequest.jobRunKey
          newRequest.jobRunKey = newRunRef.key
          await firebase.pushWithMeta(CALL_RUNNER_REQUEST_PATH, newRequest)
          return newRunRef.key
        })
        .then(newRunKey => router.push(`${runsPagePath}/${newRunKey}`))
        .catch(err => {
          // eslint-disable-next-line no-console
          console.log(
            'There was a problem creating the new run job',
            err.message || err
          )
        })
    }
  }
}
