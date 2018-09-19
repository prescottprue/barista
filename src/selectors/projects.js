import { get, uniqBy } from 'lodash'
import { createSelector } from 'reselect'

/**
 * @param {Object} state - Redux state (from connect)
 * @param {Object} props - Component props
 */
function getOrderedMyProjects(state, props) {
  return get(state, 'firestore.ordered.myProjects')
}

/**
 * @param {Object} state - Redux state (from connect)
 * @param {Object} props - Component props
 */
function getOrderedCollabProjects(state, props) {
  return get(state, 'firestore.ordered.projects')
}

/**
 * @param {Object} state - Redux state (from connect)
 * @param {Object} props - Component props
 */
export const getOrderedProjects = createSelector(
  [getOrderedMyProjects, getOrderedCollabProjects],
  (myProjects, collabProjects) => {
    if (myProjects && myProjects.length) {
      return uniqBy(myProjects.concat(collabProjects), 'id')
    }
    return collabProjects
  }
)

/**
 * @param {Object} state - Redux state (from connect)
 * @param {Object} props - Component props
 */
export function getProjects(state, props) {
  return get(state, 'firestore.data.projects')
}
