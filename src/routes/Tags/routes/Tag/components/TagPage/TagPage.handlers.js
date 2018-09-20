import { TAGS_DATA_PATH } from 'constants'

/**
 * Handler for starting test run. Works by pushing to requests/callRunner
 * which triggers the callRunner function.
 * @param  {Object} props - Component props
 * @return {Function} Function which accepts form values and starts test run
 */
export function onSubmit({ firestore, uid, projectId, testGroupId, router }) {
  return values => {
    return firestore
      .collection(TAGS_DATA_PATH)
      .doc(testGroupId)
      .update({
        ...values,
        updatedAt: firestore.FieldValue.serverTimestamp()
      })
  }
}
