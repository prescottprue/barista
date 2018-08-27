import { isDate, isObject, invoke } from 'lodash'
import { format } from 'date-fns'

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
export function formatDateTime(dateValue) {
  return format(getDateObject(dateValue), 'MM/DD/YY - h:mm:ss.SSS A')
}
