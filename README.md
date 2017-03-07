To install it to your Vue project, do the following:

`import VueSession from 'vue-session'`
`Vue.use(VueSession)`

To use it, use the $session property.

`this.$session.init();`

`this.$session.getAll()`, returns all data stored in the Session.
`this.$session.set(key,value)`, sets a single value to the Session.
`this.$session.get(key)`, returns the value attributed to the given key.
`this.$session.start()`, initializes a session with a 'session-id'. If you attempt to save a value without having started a new session, the plugin will automatically starts a new session.
`this.$session.exists()`, checks whether a session has been initialized or not.
`this.$session.has(key)`, checks whether the key exists in the Session
`this.$session.remove(key)`, removes the given key from the Session
`this.$session.clear()`, clear all keys in the Session, except for 'session-id', keeping the Session alive
`this.$session.destroy()`, destroys the Session
`this.$session.id()`, returns the 'session-id'
