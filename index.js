const setAll = function (all){
  window.sessionStorage.setItem(VueSession.key,JSON.stringify(all));
}

const VueSession = {
  key: 'vue-session-key',
  install(Vue, options) {
    Vue.prototype.$session = {
      getAll: function(){
        var all = JSON.parse(window.sessionStorage.getItem(VueSession.key));
        return all || {};
      },
      set: function(key,value){
        if(key == 'session-id') return false;
        var all = this.getAll();

        if(!('session-id' in all)){
          this.start();
          all = this.getAll();
        }

        all[key] = value;

        setAll(all);
      },
      get: function(key){
        var all = this.getAll();
        return all[key];
      },
      start: function(){
        var all = this.getAll();
        all['session-id'] = 'sess:'+Date.now();

        setAll(all);
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

        setAll(all);
      },
      clear: function(){
        var all = this.getAll();

        setAll({'session-id': all['session-id']});
      },
      destroy: function(){
        setAll({});
      },
      id: function(){
        return this.get('session-id');
      }
    }
  },
};

module.exports = VueSession;
