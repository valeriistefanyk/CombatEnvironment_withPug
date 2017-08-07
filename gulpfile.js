const gulp = require("gulp");
const broserSync = require("browser-sync").create();
const pug = require("gulp-pug");
const sass = require("gulp-sass");
const rename = require("gulp-rename");
const rimraf = require("rimraf");
const spritesmith = require("gulp.spritesmith");
const sourcemaps = require("gulp-sourcemaps");
const uglify = require("gulp-uglify");
const concat = require("gulp-concat");

/* ----- SERVER -----*/
gulp.task('server', function() {
    broserSync.init({
        server: {
            baseDir: "build"
        },
        notify: false
    });
    gulp.watch("build/**/*.*").on('change', broserSync.reload);
});

/* ----- JS ----- */
gulp.task('js', function() {
    return gulp.src(["source/js/main.js"])
        .pipe(sourcemaps.init())
        .pipe(concat('main.min.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest("build/js"))
});

/* ----- PUG Compile -----*/
gulp.task('template:compile', function() {
    return gulp.src("source/templates/index.pug")
        .pipe(pug({ pretty: true }))
        .pipe(gulp.dest("build"));
});

/* ----- SASS Compile ----- */
gulp.task('styles:compile', function() {
    return gulp.src("source/styles/main.scss")
        .pipe(sass({ outputStyle: "compressed" }).on('error', sass.logError))
        .pipe(rename("main.min.css"))
        .pipe(gulp.dest("build/css"));
});

/* ----- SPRITE ----- */
gulp.task('sprite', function(cb) {
    const spriteData = gulp.src('source/images/icons/*.png').pipe(spritesmith({
        imgName: 'sprite.png',
        imgPath: '../images/sprite.png',
        cssName: 'sprite.scss'
    }));
    spriteData.img.pipe(gulp.dest('build/images/'));
    spriteData.css.pipe(gulp.dest('source/styles/global/'));
    cb();
});

/* ----- Delete -----*/
gulp.task('clean', function del(cb) {
    return rimraf('build', cb);
});

/* ----- Copy images -----*/
gulp.task('copy:images', function() {
    return gulp.src('source/images/**/*.*')
        .pipe(gulp.dest('build/images'));
});

/* ----- Copy fonts ------*/
gulp.task('copy:fonts', function() {
    return gulp.src('source/fonts/**/*.*')
        .pipe(gulp.dest('build/fonts'));
}); 

/* ----- Copy images and fonts -----*/
gulp.task('copy', gulp.parallel('copy:fonts', 'copy:images'));


/* ----- WATCHERS ----- */
gulp.task('watch', function() {
    gulp.watch('source/templates/**/*.pug', gulp.series('template:compile'));
    gulp.watch('source/styles/**/*.scss', gulp.series('styles:compile'));
    gulp.watch('source/js/**/*.js', gulp.series('js'))
});

/* ----- DEFAULT ----- */
gulp.task('default', gulp.series(
    'clean',
    gulp.parallel('template:compile', 'styles:compile', 'js', 'sprite', 'copy'),
    gulp.parallel('watch', 'server')
));