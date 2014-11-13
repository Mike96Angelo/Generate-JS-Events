Generate-JS-Events
==================

Event emitter inheritance 


#EventEmitter

**Inherits from**

* [Generator](../generate-js)

**Functions**

* [on(event, listener)](#on)
* [once(event, listener)](#once)
* [off(event, listener)](#off)
* [emit(event, data)](#emit)
 
<a name="on"></a>
#on(event, listener)
Adds a 'listener' on 'event' to this EventEmitter instance.

**Params**

- event `String` - Name of event.  
- listener `function` - Event handler function.  

**Returns**: `EventEmitter` - This EventEmitter instance.  
<a name="once"></a>
#once(event, listener)
Adds a 'listener' on 'event' to this EventEmitter instance which is removed after one 'event'.

**Params**

- event `String` - Name of event.  
- listener `function` - Event handler function.  

**Returns**: `EventEmitter` - This EventEmitter instance.  
<a name="off"></a>
#off(event, listener)
Removes a 'listener' on 'event', or all listeners on 'event', or all listeners from this EventEmitter instance.

**Params**

- event `String` - Name of event.  
- listener `function` - Event handler function.  

**Returns**: `EventEmitter` - This EventEmitter instance.  
<a name="emit"></a>
#emit(event, data)
Emits an 'event' containing 'data' on this EventEmitter instance.

**Params**

- event `String` - Name of event.  
- data `Object` - Event handler function.  

**Returns**: `EventEmitter` - This EventEmitter instance.  
