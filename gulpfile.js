const gulp = require('gulp');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const browserSync = require('browser-sync').create();
const gcmq = require('gulp-group-css-media-queries');
const preproc = require('gulp-stylus');
const rename = require('gulp-rename');
const type_utils = require('stylus-type-utils');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const svgSprite = require("gulp-svg-sprites");
const nib = require('nib');
const spritesmith = require('gulp.spritesmith');
const merge = require('merge-stream');

const config = {
    src: './src',
    css: {
        watch: '/precss/**/*.styl',
        src: '/precss/app.styl',
        dest: '/css'
    },
    js: {
        src: '/prejs/*.js',
        dest: '/js'
    },
    sprite: {
        img: '/sprites/*.*',
        outCss: '/precss',
        outImg: '/img'
    },
    spriteSvg: {
        img: '/icons-svg/*.svg',
        outCss: '/precss',
        outImg: '/img'
    },
    html: {
        src: '/*.html'
    }
};

gulp.task('build', function () {
    gulp.src(config.src + config.css.src)
            .pipe(preproc({
                use:[
                    nib(),
                    type_utils()
                ]
            }))
            .pipe(gcmq())
            .pipe(autoprefixer({
                browsers: ['> 0.1%'],
                cascade: true
            }))
            .pipe(cleanCSS())
            .pipe(rename({suffix: '.min'}))
            .pipe(gulp.dest(config.src + config.css.dest))
            .pipe(browserSync.reload({
                stream: true
            }));
});

gulp.task('js', function(){
    return gulp.src(config.src + config.js.src)
        // .pipe(babel({
        //     presets: ['@babel/env']
        // }))
        .pipe(concat("app.js"))
        .pipe(uglify())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(config.src + config.js.dest))
        .pipe(browserSync.reload({
            stream: true
        }));
});

gulp.task('watch', ['browserSync'], function () {
    gulp.watch(config.src + config.css.watch, ['build']);
    gulp.watch(config.src + config.js.src, ['js']);
    gulp.watch(config.src + config.html.src, browserSync.reload);
});

gulp.task('browserSync', function () {
    browserSync.init({
        server: {
            baseDir: config.src
        }
    });
});

gulp.task('sprites', function () {
    return gulp.src(config.src + config.spriteSvg.img)
        .pipe(svgSprite({
            mode: "symbols"
        }))
        .pipe(gulp.dest(config.src + config.spriteSvg.outCss));
});

gulp.task('sprite', function () {
    // Generate our spritesheet
    var spriteData = gulp.src(config.src + config.sprite.img).pipe(spritesmith({
        imgName: 'sprite.png',
        cssName: 'sprite.styl',
        padding: 10
    }));

    // Pipe image stream through image optimizer and onto disk
    var imgStream = spriteData.img
        .pipe(gulp.dest(config.src + config.sprite.outImg));

    // Pipe CSS stream through CSS optimizer and onto disk
    var stylStream = spriteData.css
        .pipe(gulp.dest(config.src + config.sprite.outCss));

    // Return a merged stream to handle both `end` events
    return merge(imgStream, stylStream);
});