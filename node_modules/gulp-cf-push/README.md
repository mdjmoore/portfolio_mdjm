# gulp-cf-push
Gulp plugin to push and app to Pivotal CloudFoundry

[![npm version](https://badge.fury.io/js/gulp-cf-push.svg)](https://badge.fury.io/js/gulp-cf-push)
[![Build Status](https://travis-ci.org/eduardogch/gulp-cf-push.svg?branch=master)](https://travis-ci.org/eduardogch/gulp-cf-push)

## Installation

In the terminal run the following command
- `npm install gulp-cf-push --save-dev`

## How to use

Import NPM module in gulpfile.js
```
var cfPush = require('gulp-cf-push');

/* Pivotal CloudFoundry - cf push **/
gulp.task('cf-push', function(done){
    cfPush('manifest.yml');
});
```
