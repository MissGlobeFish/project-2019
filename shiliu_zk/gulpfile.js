var fileinclude = require('gulp-file-include'),
  gulp = require('gulp'),
  gulpsass = require('gulp-sass'),
  connect = require('gulp-connect');
 
  gulp.task('html', ()=> {
    return gulp.src(['./*.html'])
      .pipe(fileinclude({
        prefix: '@@',
        basepath: '@file'
      }))
      .pipe(gulp.dest('./'));
  });
 // 搭建服务器
gulp.task('connect', ()=> {
  connect.server({
    // 这一步是定义刷新页面最先出来什么页面
    root: './',
    host:'localhost',
    port: 8888,
    path:'./',
    livereload: true
  });
});


// sass编译
gulp.task('sass', ()=>{
  return gulp.src('./scss/style.scss')
    .pipe(gulpsass())
    .pipe(gulp.dest('./'))
});

// 监听sass更改刷新页面
gulp.task('watch', function() {
  gulp.watch('./scss/style.scss',gulp.series('sass')); // 第一个参数是要监听的目录和文件，第二个参数是监听的目录和文件只要有改动，那么就执行名为sass的task任务
});　

gulp.task('default', gulp.series('html',gulp.parallel('connect','watch')))
