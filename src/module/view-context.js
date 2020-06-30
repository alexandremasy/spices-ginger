const GingerViewContext = {};
export default GingerViewContext

/**
 * @type {Number}
 */
GingerViewContext.ROUTE = 0b00001

/**
 * @type {Number}
 */
GingerViewContext.POPIN = 0x00010

/**
 * @type {Array.<Number>}
 */
GingerViewContext.ALL = [
  GingerViewContext.ROUTE,
  GingerViewContext.POPIN
];

/**
 * @type {Number}
 */
GingerViewContext.SUM = GingerViewContext.ALL.reduce( (a, c) => a + c );