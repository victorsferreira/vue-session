var VueSession = {
    key: 'vue-session-key',
    setAll: function(all){
        window.sessionStorage.setItem(VueSession.key,JSON.stringify(all));
    }
}

VueSession.install = function(Vue, options) {
    Vue.prototype.$session = {
        getAll: function(){
            var all = JSON.parse(window.sessionStorage.getItem(VueSession.key));
            return all || {};
        },
        set: function(key,value){
            if(key == 'session-id') return false;
            var all = this.getAll();

            if(!('session-id' in all)){
                this.init();
                all = this.getAll();
            }

            all[key] = value;

            this.setAll(all);
        },
        get: function(key){
            var all = this.getAll();
            return all[key];
        },
        start: function(){
            var all = this.getAll();
            all['session-id'] = 'sess:'+Date.now();

            this.setAll(all);
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

            this.setAll(all);
        },
        clear: function(){
            var all = this.getAll();

            this.setAll({'session-id': all['session-id']});
        },
        destroy: function(){
            this.setAll({});
        },
        id: function(){
            return this.get('session-id');
        }
    }
};

if(typeof window !== 'undefined' && window.Vue){
    window.VueSession = VueSession;
    window.Vue.use(VueSession);
}

export default VueSession;
