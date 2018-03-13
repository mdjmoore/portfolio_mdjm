const gutil = require('gulp-util');
const async = require('async');
const inquirer = require('inquirer');
const exec = require('child_process').spawn;
const PLUGIN_NAME = 'gulp-cf-push';

function cfLogin(options, cb) {
    var command = exec('cf login');
    command.stdout.on('data', function(data) {
        process.stdout.write(data);
    });
    command.stdout.on('end', function() {
        return cb();
    });
}

function cfPush(options, cb) {
    var questions = [{
        type: 'input',
        name: 'localSandbox',
        message: 'What\'s the name of your local sandbox?'
      },{
        type: 'input',
        name: 'env',
        message: 'What\'s the environment do you want to push?',
        default: 'develop'
    }];

    inquirer.prompt(questions).then(function(answers) {
        gutil.log(gutil.colors.bold.white.bgBlue('PUSHING TO CF: http://myprodesk-'+answers.localSandbox+'.apps-np.homedepot.com'));
        gutil.env.NODE_ENV = answers.env;
        var appConfig = generateConfig();
        var stream = gulp.src('manifest.yml.template')
            .pipe(rename('local.manifest.yml'))
            .pipe(replace('$appName', 'myprodesk-' + answers.localSandbox))
            .pipe(replace('$hostName', 'myprodesk-' + answers.localSandbox))
            .pipe(replace('$memory', appConfig.projectInfo.memory))
            .pipe(replace('$instances', appConfig.projectInfo.instances))
            .pipe(replace('$configJson', JSON.stringify(appConfig)))
            .pipe(gulp.dest('./'));
        stream.on('end', function() {
            var command = exec('cf push -f local.manifest.yml');
            command.stdout.on('data', function(data) {
                process.stdout.write(data);
            });
            command.stdout.on('end', function() {
                gutil.log(gutil.colors.bold.white.bgBlack('PUSHED TO: ') + gutil.colors.bold.white.bgBlue('http://myprodesk-'+answers.localSandbox+'.apps-np.homedepot.com'));
                return cb();
            });
        });
        stream.on('error', function() {
            gutil.log(gutil.colors.red.white.bgBlue('Run in the console: cf login -a https://api.run-np.homedepot.com'));
            return cb();
        });
    });
}

function init(options) {
    if (options === undefined) {
        throw new gutil.PluginError(PLUGIN_NAME, 'Options is required!');
    } else {
        if (typeof options === 'object') {
            async.series([
                function (cb) {
                    cfLogin(options, cb);
                },
                function (cb) {
                    cfPush(options, cb);
                }
            ]);
        } else {
            async.series([
                function (cb) {
                    cfLogin(options, cb);
                },
                function (cb) {
                    cfPush(options, cb);
                }
            ]);
        }
    }
}

module.exports = init;
