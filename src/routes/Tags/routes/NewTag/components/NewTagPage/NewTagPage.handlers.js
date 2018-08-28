import { TAG_DATA_PATH, TAGS_PATH } from 'constants'

/**
 * Handler for starting test run. Works by pushing to requests/callRunner
 * which triggers the callRunner function.
 * @param  {Object} props - Component props
 * @return {Function} Function which accepts form values and starts test run
 */
export function createNewTag({ firebase, projectId, router }) {
  return values => {
    return firebase
      .pushWithMeta(TAG_DATA_PATH, {
        ...values,
        project: projectId
      })
      .then(() => router.push(TAGS_PATH))
  }
}
