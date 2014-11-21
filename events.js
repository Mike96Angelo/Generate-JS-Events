/**
 * @name generate.js
 * @author Michaelangelo Jong
 */

// Dependences:
var Generator = require('generate-js');

// Constructor
var EventEmitter = Generator.generate(
    null,

    /**
     * Inits for inheritance.
     */
    function () {
        // init
        Object.defineProperties(this, {
            __events: {
                value: {}
            },
            __onces: {
                value: {}
            }
        });
    }
);

// Prototype
EventEmitter.definePrototypeMethods([
    /**
     * Adds a 'listener' on 'event' to this EventEmitter instance.
     * @param  {String} event      Name of event.
     * @param  {Function} listener Event handler function.
     * @return {EventEmitter}      This EventEmitter instance.
     */
    function on(event, listener) {
        var _ = this,
            listeners = _.__events[event];
        if (typeof event === 'string' && listener instanceof Function) {
            if (!(listeners instanceof Array)) {
                listeners = _.__events[event] = [];
            }
            listeners.push(listener);
        }
        return _;
    },
    /**
     * Adds a 'listener' on 'event' to this EventEmitter instance which is removed after one 'event'.
     * @param  {String} event      Name of event.
     * @param  {Function} listener Event handler function.
     * @return {EventEmitter}      This EventEmitter instance.
     */
    function once(event, listener) {
        var _ = this,
            listeners = _.__onces[event];
        if (typeof event === 'string' && listener instanceof Function) {
            if (!(listeners instanceof Array)) {
                listeners = _.__onces[event] = [];
            }
            listeners.push(listener);
        }
        return _;
    },
    /**
     * Removes a 'listener' on 'event', or all listeners on 'event', or all listeners from this EventEmitter instance.
     * @param  {String} event      Name of event.
     * @param  {Function} listener Event handler function.
     * @return {EventEmitter}      This EventEmitter instance.
     */
    function off(event, listener) {
        var _ = this,
            listeners,
            length,
            i,
            key;
        if (typeof event === 'string' && listener instanceof Function) {
            listeners = _.__events[event];
            if (listeners instanceof Array) {
                length = listeners.length;
                for (i = 0; i < length; i++) {
                    if (listeners[i] === listener) {
                        listeners.splice(i, 1);
                        i--;
                    }
                }
            }
            listeners = _.__onces[event];
            if (listeners instanceof Array) {
                length = listeners.length;
                for (i = 0; i < length; i++) {
                    if (listeners[i] === listener) {
                        listeners.splice(i, 1);
                        i--;
                    }
                }
            }
        } else if (typeof event === 'string') {
            delete _.__events[event];
            delete _.__onces[event];
        } else {
            listeners = _.__events;
            for (key in listeners) {
                delete listeners[key];
            }
            listeners = _.__onces;
            for (key in listeners) {
                delete listeners[key];
            }
        }
        return _;
    },
    /**
     * Emits an 'event' containing 'data' on this EventEmitter instance.
     * @param  {String} event Name of event.
     * @param  {Object} data  Event handler function.
     * @return {EventEmitter} This EventEmitter instance.
     */
    function emit(event, data) {
        var _ = this,
            i,
            timeStamp = Date.now(),
            length,
            listener,
            listeners;
        data = typeof data === 'object' ? data : {data:data};

        data.type = event;
        data.timestamp = data.timeStamp = data.timeStamp || data.timestamp || timeStamp;

        /**
         * Creates a closure around the listener 'func' and 'data'.
         * @param  {Function} func A listener.
         * @return {Function}      Closure function.
         */
        function emitOnFunc(func) {
            return function () {
                func(data);
            };
        }

        listeners = _.__events[event];

        if (event === 'error' && !listeners && !(_.onerror instanceof Function)) {
            if (data instanceof Error){
                throw data;
            } else {
                throw new Error(data.message || data.data || JSON.stringify(data));
            }
        }

        if (_['on' + event] instanceof Function) {
            setTimeout(emitOnFunc(_['on' + event]), 0);
        }

        if (listeners instanceof Array) {
            length = listeners.length;
            for (i = 0; i < length; i++) {
                listener = listeners[i];
                setTimeout(emitOnFunc(listener), 0);
            }
        }

        listeners = _.__onces[event];

        delete _.__onces[event];

        if (listeners instanceof Array) {
            length = listeners.length;
            for (i = 0; i < length; i++) {
                listener = listeners[i];
                setTimeout(emitOnFunc(listener), 0);
            }
        }
        return _;
    }
]);

// Exports
module.exports = EventEmitter;
