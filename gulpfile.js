/**
 * gulp 配置
 * @atuhor Philip
 */
const fs = require('fs')

// gulp 插件
const gulp = require('gulp')
const rev = require('gulp-rev')
const less = require('gulp-less')
const clean = require('gulp-clean')
const eslint = require('gulp-eslint')
const uglify = require('gulp-uglify')
const cleanCSS = require('gulp-clean-css')
const template = require('gulp-template')
const template = require('gulp-template')

/**
 * 清空文件夹 避免资源冗余
 */
gulp.task('clean', () => {
    return gulp.src('dist', { read: false }).pipe(clean())
})

/**
 * css文件压缩 更改版本号
 */
gulp.task('build-css', () => {
    return gulp.src('less/**/*.less')
        .pipe(less())
        .pipe(gulp.dest('dist'))
})

/**
 * 压缩 css
 */
gulp.task('compress-css', () => {
    return gulp.src('dist/**/*.css')
        .pipe(cleanCSS({ compatibility: 'ie9' }))
        .pipe(rev())
        .pipe(gulp.dest('dist/'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('dist'))
})

/**
 * 压缩 js
 */
gulp.task('compress-js', () => {
    return gulp.src('dist/**/*.js')
        .pipe(rev())
        .pipe(gulp.dest('dist/'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('dist'))
})

/**
 * 构建开发环境模板
 */
gulp.task('build-template-prod', () => {
    const manifest = JSON.parse(fs.readFileSync('dist/manifest.json'))
     
    return gulp.src('html/**/*.html')
         .pipe(template({
             env: 'dev',
         }))
         .pipe(gulp.dest('dist'))
})

/**
 * 构建生产环境模板
 */
gulp.task('build-template-prod', () => {
    const manifest = JSON.parse(fs.readFileSync('dist/manifest.json'))
     
    return gulp.src('html/**/*.html')
        .pipe(template({
            manifest,
            env: 'prod',
        }))
        .pipe(gulp.dest('dist'))
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
const jsWatcher = gulp.watch(['./js'], ['clean', 'build-js'])
const lessWatcher = gulp.watch(['./less'], ['clean', 'build-less'])

jsWatcher.on('change', (event) => {
     console.log('File ' + event.path + ' was ' + event.type + ', running tasks...')
})

lessWatcher.on('change', (event) => {
     console.log('File ' + event.path + ' was ' + event.type + ', running tasks...')
})
