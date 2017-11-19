const fs = require('fs-extra');
const _ = require('lodash');

function fileSyncDB(file) {
  this._file = file;
}

fileSyncDB.prototype=Object.create({

  get: function(){
    if(fs.existsSync(this._file)){
      const buffer = fs.readFileSync(this._file);
      if(buffer){
        return JSON.parse(buffer.toString());
      }
    }
    return {};
  },

  merge: function(obj){
    let oldValue = this.get();
    let newValue = _.merge(oldValue,obj,function(dest, src){
      if(_.isArray(dest) && _.isArray(src)){
        return dest.concat(src);
      }
    });
    fs.writeFileSync(this._file,  JSON.stringify(newValue||{},null,2));
    // fs.appendFileSync(this._file+'.log', 'Merge: '+JSON.stringify(obj,null,2))
    return this;
  },

  init: function (obj) {
    fs.writeFileSync(this._file,  JSON.stringify(obj||{},null,2));
    // fs.appendFileSync(this._file+'.log', 'Init: '+JSON.stringify(obj,null,2))
    return this;
  },

  clean: function () {
    fs.removeSync(this._file);
  }
})


module.exports = {
  fileSyncDB:fileSyncDB,
}
