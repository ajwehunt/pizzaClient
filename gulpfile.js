const gulp = require('gulp');
const concat = require('gulp-concat');
const babel = require('gulp-babel');
const sass = require('gulp-sass');

gulp.task('concat', function(){
  gulp.src(['./public/js/app.js', './public/js/services/*.js', './public/js/*.js'])
  .pipe(concat('all.js'))
  .pipe(babel({
    presets: ['es2015']
  }))
  .pipe(gulp.dest('./public/dist'))
})

gulp.task('sass', function(){
  gulp.src(['./public/styles/base/reset.css', './public/styles/base/normalize.css', './public/styles/fonts/fonts.css', './public/styles/views/*{.scss,.css}'])
  .pipe(concat('all.css'))
  .pipe(sass().on('error', sass.logError))
  .pipe(gulp.dest('./public/dist'))
})

gulp.task('default', ['concat', 'sass'])
gulp.watch(['./public/js/**/*.js'], ['concat'])
gulp.watch(['./public/styles/**/*{.scss,.css}'], ['sass'])
