import { get } from 'lodash'

/**
 * @param {Object} state - Redux state (from connect)
 * @param {Object} props - Component props
 */
export function getOrderedProjects(state, props) {
  return get(state, 'firestore.ordered.projects')
}

/**
 * @param {Object} state - Redux state (from connect)
 * @param {Object} props - Component props
 */
export function getProjects(state, props) {
  return get(state, 'firestore.data.projects')
}
