const GingerModuleCapacity = {};
export default GingerModuleCapacity

/**
 * @type {Number}
 */
GingerModuleCapacity.ROUTE = 0b00001

/**
 * @type {Number}
 */
GingerModuleCapacity.POPIN = 0x00010

/**
 * @type {Array.<Number>}
 */
GingerModuleCapacity.ALL = [
  GingerModuleCapacity.ROUTE,
  GingerModuleCapacity.POPIN
];

/**
 * @type {Number}
 */
GingerModuleCapacity.SUM = GingerModuleCapacity.ALL.reduce( (a, c) => a + c );