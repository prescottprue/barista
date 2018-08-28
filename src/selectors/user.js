import { get } from 'lodash'

/**
 * Get status of container image build
 * @param {Object} state - Redux state (from connect)
 * @param {Object} props - Component props
 */
export function getAuthUid(state) {
  return get(state, 'firebase.auth.uid')
}
