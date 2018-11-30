/**
 * gulp 配置
 * @atuhor Philip
 */
const fs = require('fs')

// gulp 插件
const gulp = require('gulp')
const runSequence = require('run-sequence')
const rev = require('gulp-rev')
const less = require('gulp-less')
const clean = require('gulp-clean')
const uglify = require('gulp-uglify')
const cleanCSS = require('gulp-clean-css')
const template = require('gulp-template')
const webserver = require('gulp-webserver')

/**
 * 清空文件夹 避免资源冗余
 */
gulp.task('clean', () => {
    return gulp.src('dist', { read: false }).pipe(clean())
})

/**
 * less 文件编译
 */
gulp.task('build-css', () => {
    return gulp.src('less/**/*.less')
        .pipe(less())
        .pipe(gulp.dest('dist'))
})

/**
 * js 文件编译
 */
gulp.task('build-js', () => {
    return gulp.src('js/**/*.js')
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
gulp.task('build-template-dev', () => {
    return gulp.src('html/**/*.html')
         .pipe(template({
            cssRainbowBlender: './rainbow-blender.css',
            cssForgetPassword: './forget-password.css',
            cssRegister: './register.css',
            cssLogin: './login.css',
            cssResetPassword: './reset-password.css',
            jsRainbowBlender: './rainbow-blender.js',
            jsForgetPassword: './forget-password.js',
            jsRegister: './register.js',
            jsLogin: './login.js',
            jsResetPassword: './reset-password.js',
         }))
         .pipe(gulp.dest('dist'))
})

/**
 * 构建生产环境模板
 */
gulp.task('build-template-prod', () => {
    const manifest = JSON.parse(fs.readFileSync('dist/rev-manifest.json'))
    
    console.log(manifest);

    return gulp.src('html/**/*.html')
        .pipe(template({
            cssRainbowBlender: manifest['rainbow-blender.css'],
            cssForgetPassword: manifest['forget-password.css'],
            cssRegister: manifest['register.css'],
            cssLogin: manifest['login.css'],
            cssResetPassword: manifest['reset-password.css'],
            jsRainbowBlender: manifest['rainbow-blender.js'],
            jsForgetPassword: manifest['forget-password.js'],
            jsRegister: manifest['register.js'],
            jsLogin: manifest['login.js'],
            jsResetPassword: manifest['reset-password.js'],
        }))
        .pipe(gulp.dest('dist'))
})

/**
 * web服务器
 */
gulp.task('webserver', () => {
    gulp.src(['./dist'])             // 服务器目录
        .pipe(webserver({                      // 运行gulp-webserver
            port: 8080,                        // 端口，默认8000
            livereload: true,                  // 启用LiveReload
            open: true,                        // 服务器启动时自动打开网页
            directoryListing: {
                enable: true,
                path: './www'
            }
        }))
})

/**
 * 开发环境文件监听
 */
const jsWatcher = gulp.watch(['js/**/*.js'], ['build-js'])
const lessWatcher = gulp.watch(['less/**/*.less'], ['build-css'])
const htmlWatcher = gulp.watch(['html/**/*.html'], ['build-template-dev'])

gulp.task('watch', () => {
    jsWatcher.on('change', (event) => {
        console.info('File ' + event.path + ' was ' + event.type + ', running tasks...')
    })

    lessWatcher.on('change', (event) => {
        console.info('File ' + event.path + ' was ' + event.type + ', running tasks...')
    })

    htmlWatcher.on('change', (event) => {
        console.info('File ' + event.path + ' was ' + event.type + ', running tasks...')
    })
})

/**
 * 开发环境
 */
gulp.task('dev', (callback) => {
    runSequence('clean', ['build-css', 'build-js', 'build-template-dev'], 'webserver', 'watch', callback)
})

/**
 * 生产环境代码构建
 */
gulp.task('build', (callback) => {
    runSequence('clean', ['build-css', 'build-js'], ['compress-css', 'compress-js'], 'build-template-prod', callback)
})
