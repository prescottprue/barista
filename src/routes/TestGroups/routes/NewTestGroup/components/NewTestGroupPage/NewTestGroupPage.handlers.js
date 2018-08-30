import { TEST_GROUPS_DATA_PATH, TEST_GROUPS_PATH } from 'constants'

/**
 * Handler for starting test run. Works by pushing to requests/callRunner
 * which triggers the callRunner function.
 * @param  {Object} props - Component props
 * @return {Function} Function which accepts form values and starts test run
 */
export function createNewTestGroup({ firestore, uid, projectId, router }) {
  return values => {
    if (!uid) {
      console.error('UID is required to create tag group') // eslint-disable-line no-console
      return
    }
    // If no projects provided, mark as global
    if (!values.projects) {
      values.global = true
    }
    return firestore
      .add(TEST_GROUPS_DATA_PATH, {
        ...values,
        createdBy: uid,
        createdAt: firestore.FieldValue.serverTimestamp()
      })
      .then(() => router.push(TEST_GROUPS_PATH))
  }
}
