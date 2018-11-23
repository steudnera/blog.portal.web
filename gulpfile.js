const gulp = require('gulp');
const minifyCss = require('gulp-clean-css');
const jshint = require('gulp-eslint');
const uglify = require('gulp-uglify');
const clean = require('gulp-clean');
const rev = require('gulp-rev');
const revReplace = require('gulp-rev-replace');
const revCollector = require('gulp-rev-collector');
const less = require('gulp-less');
     
/**
 * 清空文件夹 避免资源冗余
 */
gulp.task('clean', () => {
    return gulp.src('dist',{ read: false }).pipe(clean())
})

/**
 * css文件压缩 更改版本号 并通过rev.manifest将对应的版本号用json表示出来
 */
gulp.task('build-css', () => {
    return gulp.src('less/**/*.less')
        .pipe(less())
        .pipe(rev())
        .pipe(gulp.dest('dist/app/styles/'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('dist/rev/css'))
})
 
/**
 * js文件压缩 更改版本号
 */
gulp.task('build-js', () => {
    return gulp.src('js/**/*.js')
        .pipe(jshint())
        .pipe(uglify())
        .pipe(rev())
        .pipe(gulp.dest('dist/app/scripts/'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('dist/rev/js'))
})

/**
 * 压缩css
 */
gulp.task('compress-js', () => {
    return gulp.src('**/*.js')
        .pipe(jshint())
        .pipe(uglify())
        .pipe(rev())
        .pipe(gulp.dest('dist/app/scripts/'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('dist/rev/js'))
})

/**
 * 压缩js
 */
gulp.task('uglify-js', () => {
    return gulp.src('**/*.js')
        .pipe(rev())
        .pipe(gulp.dest('dist/app/styles/'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('dist/rev/css'))
})
 
/**
 * 通过hash来精确定位到html模板
 */
gulp.task('rev', () => {
    return gulp.src(['dist/rev/**/*.json','app/pages/*.html'])
        .pipe(revCollector())
        .pipe(gulp.dest('dist/app/pages/'))
})
 
/**
 * 合并html页面内引用的静态资源文件
 */
gulp.task('html', () => {
    return gulp.src('html/**/*.html')
        .pipe(useref())
        .pipe(rev())
        .pipe(revReplace())
        .pipe(gulp.dest('html/'))
})

/**
 * web服务器
 */
gulp.task('webserver', () => {
    gulp.src(['./html'. './dist'])             // 服务器目录
        .pipe(webserver({                      // 运行gulp-webserver
            port: 8080,                        // 端口，默认8000
            livereload: true,                  // 启用LiveReload
            open: true,                        // 服务器启动时自动打开网页
            directoryListing: {
                enable: true,
                path: './www'
            },
        }))
})

/**
 * 开发环境文件监听
 */
const js_watcher = gulp.watch(['./js'], ['clean', 'build-js', 'reload'])
const less_watcher = gulp.watch(['./less'], ['clean', 'build-less', 'reload'])

js_watcher.on('change', (event) => {
  console.log('File ' + event.path + ' was ' + event.type + ', running tasks...')
})

less_watcher.on('change', (event) => {
  console.log('File ' + event.path + ' was ' + event.type + ', running tasks...')
})
