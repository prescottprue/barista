import { reduce, get } from 'lodash'
import { createSelector } from 'reselect'

const EMPTY_ARRAY = []

function getSuiteData(state, props) {
  return get(props, 'suiteData', EMPTY_ARRAY)
}
export const getSuiteDurationInWords = createSelector(
  [getSuiteData],
  suiteData => {
    const { sum } = reduce(
      suiteData,
      (acc, test) => {
        if (
          Number.isNaN(acc.sum) ||
          !Number.isInteger(test.duration) ||
          acc.invalid
        ) {
          return { sum: 0, invalid: true }
        }
        return { ...acc, sum: (acc.sum += test.duration) }
      },
      { sum: 0, invalid: false }
    )
    return sum
  }
)

export const getSuiteFailures = createSelector([getSuiteData], suiteData =>
  reduce(
    suiteData,
    (sum, test) => {
      if (test.state === 'failed') {
        return (sum += 1)
      }
      return sum
    },
    0
  )
)
