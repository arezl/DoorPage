const gulp = require("gulp");
const browserify = require("browserify");
const source = require('vinyl-source-stream');
const tsify = require("tsify");
const watchify = require("watchify");
const gutil = require("gulp-util");
var less = require('gulp-less')
const paths = {
    pages: ['src/*.html']
};

const watchedBrowserify = watchify(browserify({
    basedir: '.',
    debug: true,
    entries: ['src/main.ts'],
    cache: {},
    packageCache: {}
}).plugin(tsify));

gulp.task("copy-html", function () {
    return gulp.src(paths.pages)
        .pipe(gulp.dest("dist"));
})

function browserifyBundle() {
    return watchedBrowserify
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(gulp.dest("dist"));
}

gulp.task("browserify", function () {
    return browserifyBundle();
})

function compileLess() {
    return gulp.src('src/**.less')
        // 2. 编译为css
        .pipe(less())
        // 3. 另存文件
        .pipe(gulp.dest('dist/css'));
}
// 编译less
// 在命令行输入 gulp images 启动此任务
gulp.task('less', function () {
    // 1. 找到 less 文件
    compileLess();
});
// 在命令行使用 gulp auto 启动此任务
gulp.task('auto', function () {
    gulp.watch('src/**.html', gulp.series('copy-html'));
    // 监听文件修改，当文件被修改则执行 images 任务
 return   gulp.watch('src/**.less', gulp.series(compileLess));
})
//https://stackoverflow.com/questions/52095228/gulp-v4-watch-task
//https://gist.github.com/jeromecoupe/0b807b0c1050647eb340360902c3203a
gulp.task("default", gulp.parallel('auto'
    , gulp.series('copy-html', 'browserify')));//https://www.jianshu.com/p/c30ff8592421
// gulp.task("default",gulp.series('copy-html', 'browserify'));
watchedBrowserify.on("update", browserifyBundle);
watchedBrowserify.on("log", gutil.log);


