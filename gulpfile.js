var gulp = require('gulp');
var plumber = require('gulp-plumber');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var pump = require('pump');
var autoprefixer = require('gulp-autoprefixer');
var nunjucksRender = require('gulp-nunjucks-render');
var sourcemaps = require('gulp-sourcemaps');
var browserSync = require("browser-sync");

var onError = function (err) {
  console.log(err);
  this.emit('end');
};

// browsersync
gulp.task("browserSync", function() {
  browserSync({
    server: {
      baseDir: "dist/pages"
    }
  })
})

gulp.task('sass', function() {
    return gulp.src('app/theme/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(plumber({
      errorHandler: onError
    }))
    .pipe(sass({ style: 'expanded' }))
    .pipe(sourcemaps.write())
    .pipe(autoprefixer({browsers: ['last 3 versions']}))
    .pipe(gulp.dest('dist'))
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task('nunjucks', function() {
  return gulp.src('app/theme/pages/**/*.+(html|njk|nunjucks)')
  .pipe(nunjucksRender({
      path: ['app/theme/templates']
    }))
  .pipe(gulp.dest('dist/pages'))
  .pipe(browserSync.reload({
    stream: true
  }))
});

gulp.task('concat-scripts', function() {
  return gulp.src('app/theme/scripts/*.js')
    .pipe(concat('scripts.js'))
    .pipe(gulp.dest('./dist/scripts/'))
    .pipe(browserSync.reload({
      stream: true
    }))
});

gulp.task('copy-fonts', function() {
    gulp.src('app/theme/fonts/**/*.*')
    .pipe(gulp.dest('dist/fonts/'))
    .pipe(browserSync.reload({
      stream: true
    }))
});

gulp.task('copy-images', function() {
    gulp.src('app/theme/img/**/*.*')
    .pipe(gulp.dest('dist/img/'))
    .pipe(browserSync.reload({
      stream: true
    }))
});

gulp.task('copy-bootstrap', function() {
    gulp.src('app/bootstrap/dist/**/*.*')
    .pipe(gulp.dest('dist/pages/bootstrap/'))
    .pipe(browserSync.reload({
      stream: true
    }))
});

gulp.task('watch', function() {
    gulp.watch('app/theme/theme/scss/**/*.*', { interval: 500 }, ['sass']);
    gulp.watch('app/theme/scripts/**/*.*', { interval: 500 }, ['concat-scripts']);
    gulp.watch('app/theme/pages/**/*.+(html|nunjucks)', { interval: 500 }, ['nunjucks']);
    gulp.watch("app/theme/*.html", browserSync.reload);
    gulp.watch("app/theme/js/**/*.js", browserSync.reload);
});

gulp.task('default', ['sass', 'nunjucks', 'concat-scripts', 'copy-fonts', 'copy-images', 'copy-bootstrap','watch', 'browserSync']);
