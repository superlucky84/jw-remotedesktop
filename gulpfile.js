/* jshint node: true */
var path = require('path'),
 
    gulp = require('gulp'),
    util = require('gulp-util'),
 
    broSync = require('browser-sync').create(),
    webpack = require('gulp-webpack'),
    webpackConfig = require('./webpack.config.js'),
 
    paths = {
        src: path.resolve(__dirname, './src'),
        view: path.resolve(__dirname, './views'),
        dest: path.resolve(__dirname, './dist/javascripts')
    },
 
    production = util.env.stage === 'production' ? true : false;
 
gulp.task('js', function() {
    return gulp.src(paths.src + '/*.js')
        .pipe(webpack(webpackConfig))
        .pipe(gulp.dest(paths.dest));
});

/* gulp.task('watch', ['js', 'css', 'icons'], function() { */

gulp.task('watch', ['js'], function() {
 
  /*
  //server: { baseDir: "./" }, 
  broSync.init({
    proxy: '0.0.0.0:3000',   // rails server 
    port: 7000               // cloud9 proxied port to 80
  });
  */

  gulp.watch(paths.view + '/**/*.ejs', ['js'])
      .on('change', broSync.reload);


  gulp.watch(paths.src + '/**/*.js', ['js']);
 
});
