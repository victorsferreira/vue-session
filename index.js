var STORAGE = null;
var LIFE_SESSION = 1;
var INACTIVITY_SESSION = null;

var VueSession = {
    key: 'vue-session-key',
    flash_key: 'vue-session-flash-key',
    setAll: function(all){
        var timelife = new Date().getTime() + LIFE_SESSION * 60 * 1000;
        if(Object.keys(all).length > 0) all['timelife'] = timelife
        STORAGE.setItem(VueSession.key,JSON.stringify(all));
    }
}

var liveSession = function () {
    var off = INACTIVITY_SESSION * 60 * 1000; 
    var t;
    window.onload = resetTimer;
    // DOM Events
    document.onmousemove = resetTimer;
    document.onkeypress = resetTimer;

    function destroy() {
        var all = JSON.parse(STORAGE.getItem(VueSession.key));
        VueSession.setAll({'session-id': all['session-id'], 'timelife': all['timelife'] });
    }
    function refresh() {
        var all = JSON.parse(STORAGE.getItem(VueSession.key));
        var timelife = new Date().getTime() + LIFE_SESSION * 60 * 1000;
        all['timelife'] = timelife
        STORAGE.setItem(VueSession.key,JSON.stringify(all));
    }
    function resetTimer() {
        clearTimeout(t);
        refresh();
        if(INACTIVITY_SESSION!==null) t = setTimeout(destroy, off)        
        else t = setInterval(refresh, 1000)
    }
};
window.onload = liveSession;

VueSession.install = function(Vue, options) {
    if(options && 'persist' in options && options.persist) STORAGE = window.localStorage;
    else STORAGE = window.sessionStorage;

    if(options && 'life_session' in options && options.life_session) LIFE_SESSION = options.life_session;
    if(options && 'inactivity_session' in options && options.inactivity_session) INACTIVITY_SESSION = options.inactivity_session;

    Vue.prototype.$session = {
        flash: {
            parent: function(){
                return Vue.prototype.$session;
            },
            get: function(key){
                var all = this.parent().getAll();
                var all_flash = all[VueSession.flash_key] || {};

                var flash_value = all_flash[key];

                this.remove(key);

                return flash_value;
            },
            set: function(key, value){
                var all = this.parent().getAll();
                var all_flash = all[VueSession.flash_key] || {};

                all_flash[key] = value;
                all[VueSession.flash_key] = all_flash;

                VueSession.setAll(all);
            },
            remove: function(key){
                var all = this.parent().getAll();
                var all_flash = all[VueSession.flash_key] || {};

                delete all_flash[key];

                all[VueSession.flash_key] = all_flash;
                VueSession.setAll(all);
            }
        },
        getAll: function(){
            var all = JSON.parse(STORAGE.getItem(VueSession.key));
            var life = all['timelife'];
            if(new Date().getTime() < life){
                return all || {};
            }else{
                this.clear() ;
                return {};
            }    
        },
        set: function(key,value){
            if(key == 'session-id') return false;
            var all = this.getAll();

            if(!('session-id' in all)){
                this.start();
                all = this.getAll();
            }

            all[key] = value;

            VueSession.setAll(all);
        },
        get: function(key){
            var all = this.getAll();
            return all[key];
        },
        start: function(){
            var all = this.getAll();
            all['session-id'] = 'sess:'+Date.now();

            VueSession.setAll(all);
        },
        renew: function(sessionId){
            var all = this.getAll();
            all['session-id'] = 'sess:' + sessionId;
            VueSession.setAll(all);
        },
        exists: function(){
            var all = this.getAll();
            return 'session-id' in all;
        },
        has: function(key){
            var all = this.getAll();
            return key in all;
        },
        remove: function(key){
            var all = this.getAll();
            delete all[key];

            VueSession.setAll(all);
        },
        clear: function(){
            var all = this.getAll();

            VueSession.setAll({'session-id': all['session-id'], 'timelife': all['timelife'] });
        },
        destroy: function(){
            VueSession.setAll({});
        },
        id: function(){
            return this.get('session-id');
        }
    }
};

module.exports = VueSession;
