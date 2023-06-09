const gulp = require('gulp');
const concat = require('gulp-concat-css');
const plumber = require('gulp-plumber');
const del = require('del');
const browserSync = require('browser-sync').create();
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const mediaquery = require('postcss-combine-media-query');
const cssnano = require('cssnano');
const htmlMinify = require('html-minifier');
const gulpPug = require('gulp-pug');
const sass = require('gulp-sass')(require('sass'));

function serve() {
  browserSync.init({
    server: {
      baseDir: './dist'
    }
  });
}

function layoutsScss() {
  const plugins = [
      autoprefixer(),
      mediaquery(),
      cssnano()
  ];
  return gulp.src('src/layouts/**/*.scss')
        .pipe(sass())
        .pipe(concat('bundle.css'))
        .pipe(postcss(plugins))
        .pipe(gulp.dest('dist/'))
        .pipe(browserSync.reload({stream: true}));
}

function pagesScss() {
  const plugins = [
      autoprefixer(),
      mediaquery(),
      cssnano()
  ];
  return gulp.src('src/pages/**/*.scss')
        .pipe(sass())
        .pipe(postcss(plugins))
        .pipe(gulp.dest('dist/'))
        .pipe(browserSync.reload({stream: true}));
}

function pug() {
  return gulp.src('src/pages/**/*.pug')
        .pipe(gulpPug({
          pretty: true
        }))
        .pipe(gulp.dest('dist/'))
        .pipe(browserSync.reload({stream: true}));
}

function html() {
  const options = {
	  removeComments: true,
	  removeRedundantAttributes: true,
	  removeScriptTypeAttributes: true,
	  removeStyleLinkTypeAttributes: true,
	  sortClassName: true,
	  useShortDoctype: true,
	  collapseWhitespace: true,
		minifyCSS: true,
		keepClosingSlash: true
	};
  return gulp.src('src/**/*.html')
        .pipe(plumber())
        .on('data', function(file) {
		      const buferFile = Buffer.from(htmlMinify.minify(file.contents.toString(), options))
		      return file.contents = buferFile
		    })
				.pipe(gulp.dest('dist/'))
        .pipe(browserSync.reload({stream: true}));
}

function css() {
  const plugins = [
      autoprefixer(),
      mediaquery(),
      cssnano()
  ];
  return gulp.src('src/**/*.css')
        .pipe(plumber())
        .pipe(concat('bundle.css'))
        .pipe(postcss(plugins))
				.pipe(gulp.dest('dist/'))
        .pipe(browserSync.reload({stream: true}));
}

function images() {
  return gulp.src('src/**/*.{jpg,png,svg,gif,ico,webp,avif}')
    .pipe(gulp.dest('dist/images'))
    .pipe(browserSync.reload({stream: true}));
}

function clean() {
  return del('dist');
}

function watchFiles() {
  gulp.watch(['src/**/*.pug'], pug);
  gulp.watch(['src/**/*.html'], html);
  gulp.watch(['src/**/*.css'], css);
  gulp.watch(['src/layouts/**/*.scss'], layoutsScss);
  gulp.watch(['src/pages/**/*.scss'], pagesScss);
  gulp.watch(['src/**/*.{jpg,png,svg,gif,ico,webp,avif}'], images);
}

const build = gulp.series(clean, gulp.parallel(pug, layoutsScss, pagesScss, images));
const watchapp = gulp.parallel(build, watchFiles, serve);

exports.html = html;
exports.pug = pug;
exports.css = css;
exports.layoutsScss = layoutsScss;
exports.pagesScss = pagesScss;
exports.images = images;
exports.clean = clean;

exports.build = build;
exports.watchapp = watchapp;
exports.default = watchapp;