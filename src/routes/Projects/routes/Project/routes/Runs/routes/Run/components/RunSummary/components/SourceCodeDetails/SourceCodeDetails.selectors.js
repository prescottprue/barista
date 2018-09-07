import { get } from 'lodash'
import { createSelector } from 'reselect'

export const getCommitSha = (state, props) =>
  get(props, 'buildData.commitSha', '')

export const getShortCommitSha = createSelector([getCommitSha], sha => {
  if (sha && sha.length > 5) {
    return sha.substring(sha.length - 5)
  }
  return sha
})
