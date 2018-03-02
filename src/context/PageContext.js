/**
 * PageContext is a page level cache. Once url changed the cache must be clear.
 * @module PageContext
 */
module.exports = {

	data: new Map(),

	/**
	* Cache object . when duplicate key a warning will show console.
	* @param  {string} key  - set cache key
	* @param  {object} value  - set cache object
	* @example 
	* import {PageContext} from 'rainbow-foundation-cache'
	* const key = 'objectKey';
	* const value = new Object();
	* PageContext.put(key,value);
	*/
	put: function (key, value) {
		if (this.data.has(key)) {
			console.warn(key + "is duplicate");
		}
		this.data.set(key, value);
	},

	/**
	* Get cache object .
	* @param  {string} key  - get cache key
	* @example 
	* import {PageContext} from 'rainbow-foundation-cache'
	* const key = 'objectKey';
	* const object = PageContext.get(key);
	*/
	get: function (key) {
		return this.data.get(key);
	},

	/**
     * Remove a cache object .
     * @param  {string} key  - remove cache key
     * @example 
	 * import {PageContext} from 'rainbow-foundation-cache'
     * const key = 'objectKey';
	 * PageContext.remove(key);
     */
	remove: function (key) {
		this.data.delete(key);
	},

	/**
     * Remove all cache object .
     * @example 
	 * import {PageContext} from 'rainbow-foundation-cache'
	 * PageContext.clear();
     */
	clear: function () {
		this.data.clear();
	},

	/**
     * Get all cache keys.
     * @example 
	 * import {PageContext} from 'rainbow-foundation-cache'
	 * const keys = PageContext.keys();
     */
	keys: function () {
		return this.data.keys();
	},
	/**
     * Get all cache values.
     * @example 
	 * import {PageContext} from 'rainbow-foundation-cache'
	 * const values = PageContext.values();
     */
	values: function () {
		return this.data.values();
	},
	/**
     * Get all cache entries.
     * @example 
	 * import {PageContext} from 'rainbow-foundation-cache'
	 * const entries = PageContext.entries();
     */
	entries: function () {
		return this.data.entries();
	}

};

