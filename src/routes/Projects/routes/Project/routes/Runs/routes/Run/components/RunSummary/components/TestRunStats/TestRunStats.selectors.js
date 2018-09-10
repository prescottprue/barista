import { createSelector } from 'reselect'
import { getProjectRunMeta } from 'selectors'
import {
  formatDateTime,
  strictDistanceInWords,
  formatTimeInterval,
  addDurationToNow,
  getDifferenceInMilliseconds
} from 'utils/formatters'
import { get } from 'lodash'

function getNow(state, props) {
  return Date.now()
}

export const getRequestCreated = createSelector([getProjectRunMeta], meta => {
  const requestTime = get(meta, 'createdAt', false)
  if (requestTime) {
    return formatDateTime(requestTime, false)
  }
  return '-'
})

export const getTestEnd = createSelector([getProjectRunMeta], meta => {
  const completedTime = get(meta, 'stats.end', false)
  if (completedTime) {
    return formatDateTime(completedTime, false)
  }
  return '-'
})

export const getCompletedAtOrNow = createSelector(
  [getTestEnd, getNow],
  (end, now) => {
    if (end !== '-') {
      return end
    }
    return now
  }
)
export const getRunRequestDurationInWords = createSelector(
  [getProjectRunMeta, getCompletedAtOrNow],
  (meta, now) => {
    const started = get(meta, 'createdAt', false)
    const completed = get(meta, 'stats.end', false)
    if (!started && !completed) {
      return '-'
    }
    if (started && !completed) {
      return strictDistanceInWords(started, now)
    }
    return strictDistanceInWords(started, completed)
  }
)

export const getRunRequestDuration = createSelector(
  [getProjectRunMeta, getCompletedAtOrNow],
  (meta, now) => {
    const started = get(meta, 'createdAt', false)
    const completed = get(meta, 'stats.end', false)
    if (!completed) {
      return '-'
    }
    // if (started && !completed) {
    //   return formatTimeInterval(
    //     addDurationToNow(getDifferenceInMilliseconds(now, started)),
    //     false
    //   )
    // }
    return formatTimeInterval(
      getDifferenceInMilliseconds(completed, started),
      false
    )
  }
)
