var cfPush = require('./index.js');
var gulp = require('gulp');

/* Pivotal CloudFoundry - cf push **/
gulp.task('default', function(){
    cfPush('manifest.yml');
});
