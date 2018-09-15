'use strict'

require('./build/check-versions')();

const gulp = require('gulp');
var del = require('del');
var shelljs = require('shelljs');

process.env.NODE_ENV = 'production';

const ora = require('ora');
const rm = require('rimraf');
const path = require('path');
const chalk = require('chalk');
const webpack = require('webpack');
const config = require(process.cwd() + '/config');
const webpackConfig = require(process.cwd() + '/build/webpack.prod.conf');

const minimist = require('minimist');
const gutil = require('gulp-util');
const src = process.cwd() + '/src';
const assets = process.cwd() + '/dist';

gulp.task('pack', function () {
    console.info(config.build);
    let spinner = ora('正在打包，请稍后...');
    //执行清楚文件操作
    shelljs.exec('gulp copy');
    spinner.start();
    
    rm(path.join(config.build.assetsRoot, config.build.assetsSubDirectory), err => {
        if (err) throw err;
        webpack(webpackConfig, (err, stats) => {
            spinner.stop();
            if (err) throw err;
            process.stdout.write(stats.toString({
                    colors: true,
                    modules: false,
                    children: false, // If you are using ts-loader, setting this to true will make TypeScript errors show up during build.
                    chunks: false,
                    chunkModules: false
                }) + '\n\n');
            
            if (stats.hasErrors()) {
                console.log(chalk.red('  Build failed with errors.\n'));
                process.exit(1);
            }
            
            console.log(chalk.cyan('  Build complete.\n'));
            console.log(chalk.yellow(
                '  Tip: built files are meant to be served over an HTTP server.\n' +
                '  Opening index.html over file:// won\'t work.\n'
            ))
            
            //↑↑↑上面的基本上都是build.js文件里的内容
            console.info('开始打包APP，请稍后...');
            shelljs.cd('./dist');
            shelljs.exec('cordova run android');
            shelljs.cd(__dirname);
        })
    })
});
//清空dist文件夹
gulp.task('clean', function () {
    return del([
        './dist/*'
    ]);
});
//复制cordova文件夹到dist文件夹
gulp.task('copy', ['clean'], function () {
    return gulp
        .src('cordova/**/*')
        .pipe(gulp.dest('dist'));
});