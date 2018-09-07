import { createSelector } from 'reselect'
import { get } from 'lodash'
import { getProjectRunMeta } from 'selectors'

export const getGoogleComputInstanceId = createSelector(
  [getProjectRunMeta],
  runMeta => get(runMeta, 'instanceMeta.googleInstanceId', null)
)
