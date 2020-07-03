/**
 * Ginger application create event
 * 
 * @event
 * @property {String}
 */
export const CREATE = 'ginger:create';

/////////////////////////////////////////////////////////////////////////////////

/**
 * Plugin install start
 * @event
 * @property {String}
 */
export const PLUGINS_START = 'ginger:plugins:start'

/**
 * Plugin install complete
 * @event
 * @property {String}
 */
export const PLUGINS_COMPLETE = 'ginger:plugins:complete'

/////////////////////////////////////////////////////////////////////////////////

/**
 * Middlewares install start
 * 
 * @event
 * @property {String}
 */
export const MIDDLEWARE_START = 'ginger:middleware:start'

/**
 * Middleware install complete.
 * 
 * @event
 * @property {String}
 */
export const MIDDLEWARE_COMPLETE = 'ginger:middleware:complete'

/////////////////////////////////////////////////////////////////////////////////

/**
 * Module register
 * @event
 * @property {String}
 */
export const MODULE_REGISTER = 'ginger:module:register'

/**
 * Module route registered
 * @event
 * @property {String}
 */
export const MODULE_ROUTES = 'ginger:module:routes'

/**
 * Module store registered
 * @event
 * @property {String}
 */
export const MODULE_STORES = 'ginger:module:stores'

/////////////////////////////////////////////////////////////////////////////////

/**
 * View created
 * @event
 * @property {String}
 */
export const VIEW_CREATED = 'ginger:view:created'

/**
 * Vue before loading
 * @event
 * @property {String}
 */
export const VIEW_BEFORE = 'ginger:view:before'

/**
 * View loading in progress
 * @event
 * @property {String}
 */
export const VIEW_PROGRESS = 'ginger:view:progress'

/**
 * View loaded
 * @event
 * @property {String}
 */
export const VIEW_LOAD = 'ginger:view:load'

/**
 * View mounted
 * 
 * @event
 * @property {String}
 */
export const VIEW_MOUNT = 'ginger:view:mount'

/**
 * View destroyed
 * 
 * @event
 * @property {String}
 */
export const VIEW_DESTROY = 'ginger:view:destroy'