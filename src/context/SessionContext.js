/**
* SessionContext is a session level cache. Once brower closed the cache must be clear.
* @module SessionContext
*/
module.exports = {
    
        cache: Object.create(null),
        /**
       * Cache object in session level. when duplicate key a warning will show console.
        * return put value
       * @param  {string} key  - set cache key.
       * @param  {object} value  - set cache object.
       * @example 
       * import {SessionContext} from 'rainbow-foundation-cache'
       * const key = 'objectKey';
       * const value = new Object();
       * SessionContext.put(key,value);
       */
        put: function (key, value,flag) {
            this.cache[key] = value;
            if(flag){
                sessionStorage.setItem(key, JSON.stringify(value));
            }
            return value;
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
                    if (window.sessionStorage.hasOwnProperty(item)) {
                        size += window.sessionStorage.getItem(item).length;
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
         * Deletes a key, returns a boolean specifying whether or not the key was deleted.
         * @param  {string} key  - remove cache key
         * @example 
        * import {SessionContext} from 'rainbow-foundation-cache'
         * const key = 'objectKey';
        * SessionContext.remove(key);
         */
        remove: function (key) {
            delete this.cache[key];
            sessionStorage.removeItem(key);
        },
    
        /**
         * Remove all cache object .
         * @example 
        * import {SessionContext} from 'rainbow-foundation-cache'
        * SessionContext.clear();
         */
        clear: function () {
            this.cache = Object.create(null);
            sessionStorage.clear();
        },
    
        /**
        * Retrieves a value for a given key If value isn't cached, returns null
       * @param  {string} key  - get cache key
       * @example 
       * import {SessionContext} from 'rainbow-foundation-cache'
       * const key = 'objectKey';
       * const object = SessionContext.get(key);
       */
        get: function (key, flag=true) {
            var data = this.cache[key];
            var sessionStorgeData = sessionStorage.getItem(key);
            if (data) {
                return data;
            } else if (sessionStorgeData&&sessionStorgeData!="undefined"&&flag) {
                return JSON.parse(sessionStorgeData);
            } else if (sessionStorgeData&&sessionStorgeData!="undefined"&&flag==false){
                return sessionStorgeData;
            }
            return null;
        },
        /**
         * Get all cache keys.
         * @example 
        * import {SessionContext} from 'rainbow-foundation-cache'
        * const keys = SessionContext.keys();
         */
        keys: function () {
            return Object.keys(this.cache);
        },
    
        isJson: function (obj) {
            var isjson = typeof (obj) == "object" && Object.prototype.toString.call(obj).toLowerCase() == "[object object]" && !obj.length;
            return isjson;
        }
    
    };