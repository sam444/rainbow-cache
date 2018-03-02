/**
 * LocalContext is a local level cache. Once clear brower cache, the LocalContext must be clear.
 * @module LocalContext
 */
module.exports = {
    
        /**
        * Cache object in local level. when duplicate key a warning will show console.
        * return put value
        * @param  {string} key  - set cache key.
        * @param  {object} value  - set cache object.
        * @example 
        * import {LocalContext} from 'rainbow-foundation-cache'
        * const key = 'objectKey';
        * const value = new Object();
        * LocalContext.put(key,value);
        */
        put: function (key, value) {
            if (this.debug) {
                console.log("caching: %s = %j (@%s)", key, value, time);
            }
    
            if (this.get(key)) {
                console.warn(key + "is duplicate");
            }
    
            localStorage.setItem(key, JSON.stringify(value));
            return value;
        },
    
        /**
         * Deletes a key, returns a boolean specifying whether or not the key was deleted.
         * @param  {string} key  - remove cache key
         * @example 
         * import {LocalContext} from 'rainbow-foundation-cache'
         * const key = 'objectKey';
         * LocalContext.remove(key);
         */
        remove: function (key) {
            localStorage.removeItem(key);
        },
    
        /**
         * Remove all cache object .
         * @example 
         * import {LocalContext} from 'rainbow-foundation-cache'
         * LocalContext.clear();
         */
        clear: function () {
            localStorage.clear();
        },
    
        /**
         * check localStorage size .
         * @example 
         * import {LocalContext} from 'rainbow-foundation-cache'
         * LocalContext.clear();
         */
        check: function (browerSize) {
            let size = 0;
            for (let item in window.localStorage) {
                if (window.localStorage.hasOwnProperty(item)) {
                    size += window.localStorage.getItem(item).length;
                }
            }
            size = (size / 1024).toFixed(2);
            if (browerSize*1024 - size > 0) {
                return true;
            } else {
                return false;
            }
        },
    
        /**
        * Retrieves a value for a given key If value isn't cached, returns null
        * @param  {string} key  - get cache key
        * @example 
        * import {LocalContext} from 'rainbow-foundation-cache'
        * const key = 'objectKey';
        * const object = LocalContext.get(key);
        */
        get: function (key) {
            var data = localStorage.getItem(key);
            if (data) {
                return JSON.parse(data);
            }
            return null;
        },
    };