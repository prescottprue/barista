import { isDate, isObject, invoke } from 'lodash'
import { format, distanceInWordsStrict, addMilliseconds } from 'date-fns'

/**
 * Convert date string or object into date object
 * @param  {Object|Date} [dateValue=null] - Date value which to format
 * @return {Date} Formatted time
 */
export function getDateObject(dateValue = null) {
  if (isObject(dateValue) && dateValue.toDate) {
    return invoke(dateValue, 'toDate')
  }
  return isDate(dateValue) ? dateValue : new Date(dateValue)
}

/**
 * Format date to time with am/pm
 * @param  {Object|Date} dateValue - Date value which to format
 * @return {String} Formatted time
 */
export function formatTime(dateValue) {
  return format(getDateObject(dateValue), 'h:mm:ss.SSS A')
}

/**
 * Format date to string or object into date
 * @param  {Object|Date} dateValue - Date value which to format
 * @return {String} Formatted time
 */
export function formatTimeInterval(dateValue) {
  return format(getDateObject(dateValue), 'mm:ss')
}

/**
 * Format date string or object into date string with format 1/22/2018
 * @param  {Object|Date} dateValue - Date value which to format
 * @return {String} Formatted date
 */
export function formatDate(dateValue) {
  return format(getDateObject(dateValue), 'MM/DD/YY')
}

/**
 * Format date string or object into date string with format
 * 1/22/2018 - 3:30:25.123 AM
 * @param  {Object|Date} dateValue - Date value which to format
 * @return {String} Formatted date
 */
export function formatDateTime(dateValue, includeMilliseconds = false) {
  return format(
    getDateObject(dateValue),
    `MM/DD/YY - h:mm:ss${includeMilliseconds ? '.SSS' : ''} A`
  )
}

/**
 * Get a string representation of date math.  This is strict, so the number is more precise than other methods
 *
 * @export
 * @param {*} dateValue - The date that is being relative to now or later time
 * @param {*} [compareToDateValue=new Date()] - The later time dateValue being cmpared to
 * @returns {String} Relative time difference string
 */
export function strictDistanceInWords(
  dateValue,
  compareToDateValue = new Date()
) {
  return distanceInWordsStrict(
    getDateObject(dateValue),
    getDateObject(compareToDateValue)
  )
}

export function addDurationToNow(duration = 0, type = 'milli') {
  const now = new Date()
  switch (true) {
    case type === 'milli':
    default:
      return addMilliseconds(now, duration)
  }
}
