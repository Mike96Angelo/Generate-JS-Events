/**
 * @name events.js
 * @author Michaelangelo Jong
 */

// Dependences:
var Generator = require('generate-js');

// Generator
var EventEmitter = Generator.generate(
    /**
     * Create method.
     */
    function EventEmitter() {

        this.defineProperties(
            {
                configurable: false,
                enumerable: false,
                writable: false
            },
            {
                __events: Object.create(null)
            }
        );
    }
);

// Prototype
EventEmitter.definePrototype(
    {
        configurable: false,
        enumerable: false,
        writable: false
    },
    {
        /**
         * Adds a 'listener' on 'event' to this EventEmitter instance.
         * @param  {String} event      Name of event.
         * @param  {Function} listener Event handler function.
         * @param  {Object} observer Object reference for binding.
         * @return {EventEmitter}      This EventEmitter instance.
         */
        on: function on(event, listener, observer) {
            var _ = this,
                listeners = _.__events[event];

            observer = typeof observer === 'object' ? observer : null;

            if (typeof event === 'string' && typeof listener === 'function') {
                if (!(listeners instanceof Array)) {
                    listeners = _.__events[event] = [];
                }

                listeners.push({
                    listener: listener,
                    observer: observer
                });
            }

            return _;
        },

        /**
         * Adds a 'listener' on 'event' to this EventEmitter instance which is removed after one 'event'.
         * @param  {String} event      Name of event.
         * @param  {Function} listener Event handler function.
         * @param  {Object} observer Object reference for binding.
         * @return {EventEmitter}      This EventEmitter instance.
         */
        once: function once(event, listener, observer) {
            var _ = this;
            var onceListener = function onceListener() {
                _.off(event, onceListener);
                listener.apply(_, arguments);
            };

            _.on(event, onceListener, observer);

            return _;
        },

        /**
         * Removes a 'listener' on 'event', or all listeners on 'event', or all listeners from this EventEmitter instance.
         * @param  {String} event      Name of event.
         * @param  {Function} listener Event handler function.
         * @param  {Object} observer Object reference for binding.
         * @return {EventEmitter}      This EventEmitter instance.
         */
        off: function off() {
            var _ = this,
                listeners,
                i,
                key,

                event = (typeof arguments[0] === 'string') ?
                    arguments[0] :
                    false,

                listener = (typeof arguments[0] === 'function') ?
                    arguments[0] :
                    (typeof arguments[1] === 'function') ?
                        arguments[1] :
                        false,

                observer = (typeof arguments[0] === 'object') ?
                    arguments[0] :
                    (typeof arguments[1] === 'object') ?
                        arguments[1] :
                        (typeof arguments[2] === 'object') ?
                            arguments[2] :
                            false;

            if (typeof event === 'string') {
                listeners = _.__events[event];

                if (typeof listener === 'function' && typeof observer === 'object') {
                    for (i = listeners.length - 1; i >= 0; i--) {
                        if (listeners[i].listener === listener && listeners[i].observer === observer) {
                            listeners.splice(i, 1);
                        }
                    }
                } else if (typeof listener === 'function' || typeof observer === 'object') {
                    for (i = listeners.length - 1; i >= 0; i--) {
                        if (listeners[i].listener === listener || listeners[i].observer === observer) {
                            listeners.splice(i, 1);
                        }
                    }
                } else {
                    delete _.__events[event];
                }
            } else if (typeof listener === 'function' || typeof observer === 'object') {
                for (key in _.__events) {
                    listeners = _.__events[key];
                    for (i = listeners.length - 1; i >= 0; i--) {
                        if (listeners[i].listener === listener || listeners[i].observer === observer) {
                            listeners.splice(i, 1);
                        }
                    }
                }
            } else {
                for (key in _.__events) {
                    delete _.__events[key];
                }
            }

            return _;
        },

        /**
         * Emits an 'event' with 'args' on this EventEmitter instance.
         * @param  {String} event      Name of event.
         * @param  {Arguments} args    Event handler function.
         * @return {EventEmitter}      This EventEmitter instance.
         */
        emit: function emit(event) {
            var _ = this,
                args = Array.prototype.slice.call(arguments, 1),
                i,
                length,
                listener,
                listeners;
            /**
             * Creates a closure around the listener 'func' and 'args'.
             * @param  {Function} func A listener.
             * @return {Function}      Closure function.
             */
            function emitOnFunc(func) {
                return function () {
                    func.apply(null, args);
                };
            }

            listeners = _.__events[event];
            window.listeners = listeners;

            if (event === 'error' && !listeners && typeof _.onerror !== 'function') {
                if (args[0] instanceof Error){
                    throw args[0];
                } else {
                    throw args;
                }
            }

            if (typeof _['on' + event] === 'function') {
                setTimeout(emitOnFunc(_['on' + event]), 0);
            }

            if (listeners instanceof Array) {
                length = listeners.length;

                for (i = 0; i < length; i++) {
                    listener = listeners[i].listener;
                    setTimeout(emitOnFunc(listener), 0);
                }
            }
            return _;
        },

        /**
         * Emits an event object containing 'eventObject' on this EventEmitter instance.
         * @param  {String} event Name of event.
         * @param  {Object} eventObject  Event object sent to all on handlers.
         * @return {EventEmitter} This EventEmitter instance.
         */
        emitEvent: function emitEvent(event, eventObject) {
            var _ = this,
                timestamp = Date.now();

            eventObject = typeof eventObject === 'object' ? eventObject : { data: eventObject };

            eventObject.type = event;
            eventObject.timestamp = eventObject.timeStamp || eventObject.timestamp || timestamp;

            _.emit(event, eventObject);
            return _;
        }
    }
);

// Exports
module.exports = EventEmitter;
