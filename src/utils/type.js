/**
 * Whether or not the value is of type Array
 * 
 * @param {*} arg The value to check
 * @returns {Boolean}
 */
export function isArray(arg) {
  return Array.isArray(arg)
}

/**
 * Whether or not the value is of type Undefined
 *
 * @param {*} arg The value to check
 * @returns {Boolean}
 */
export function isUndefined(arg) {
  return typeof arg === 'undefined'
}

/**
 * Whether or not the value is of type Object
 *
 * @param {*} arg The value to check
 * @returns {Boolean}
 */
export function isObject(arg) {
  return typeof arg === 'object'
}

/**
 * Whether or not the value is of a pure Object
 *
 * @param {*} arg The value to check
 * @returns {Boolean}
 */
export function isPureObject(arg) {
  return typeof arg === 'object' && arg !== null
}

/**
 * Whether or not the value is of type Function
 *
 * @param {*} arg The value to check
 * @returns {Boolean}
 */
export function isFunction(arg) {
  return typeof arg === 'function'
}

/**
 * Whether or not the value is of type String
 *
 * @param {*} arg The value to check
 * @returns {Boolean}
 */
export function isString(arg) {
  return typeof arg === 'string'
}