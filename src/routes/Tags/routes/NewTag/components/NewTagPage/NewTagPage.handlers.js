import { TAGS_DATA_PATH, TAGS_PATH } from 'constants'

/**
 * Handler for starting test run. Works by pushing to requests/callRunner
 * which triggers the callRunner function.
 * @param  {Object} props - Component props
 * @return {Function} Function which accepts form values and starts test run
 */
export function createNewTag({ firestore, router, uid }) {
  return values => {
    if (!uid) {
      console.error('UID is required to create tag') // eslint-disable-line no-console
      return
    }
    return firestore
      .add(TAGS_DATA_PATH, {
        ...values,
        createdBy: uid,
        createdAt: firestore.FieldValue.serverTimestamp()
      })
      .then(() => router.push(TAGS_PATH))
  }
}
