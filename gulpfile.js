// In a gulpfile this is a javascript thing that you run in your cmd line using node and this is what we are using compile and minify
// Initialize modules
// Here we are importing all of the npm pakages that we have installed via npm so that we can access them in any function
const { src, dest, watch, series } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const babel = require('gulp-babel');
const terser = require('gulp-terser');
const browsersync = require('browser-sync').create();

// Use dart-sass for @use
//sass.compiler = require('dart-sass');  // Setting sass compiler to use dart-sass

// Sass Task
function scssTask() {
  return src('app/scss/style.scss', { sourcemaps: true })  // Here sourcemaps are extra files that are generated which tells the original sass file and line number while testing in your browser and looking at the developers tools and inspect certain set of styles 
    .pipe(sass())                                       // .pipe is a gulp function to run them one after the other
    .pipe(postcss([autoprefixer(), cssnano()]))  // cssnano minify the css files
    .pipe(dest('dist', { sourcemaps: '.' }));
}

// JavaScript Task
function jsTask() {
  return src('app/js/script.js', { sourcemaps: true })
    .pipe(babel({ presets: ['@babel/preset-env'] }))  // babel is going to make any modern js to compile to any older version of browsers that they can support
    .pipe(terser())
    .pipe(dest('dist', { sourcemaps: '.' }));
}

// Browsersync
function browserSyncServe(cb) {  // browsersync will spin up a local server and sync it to your files and any time you make a change it gonna automatically reload to your local website
  browsersync.init({
    server: {
      baseDir: '.',
    },
    notify: {
      styles: {
        top: 'auto',
        bottom: '0',
      },
    },
  });
  cb();
}
function browserSyncReload(cb) { // Simply gonna reload our browsersync
  browsersync.reload();
  cb();
}

// Watch Task
function watchTask() {
  watch('*.html', browserSyncReload);  //watch our html file and if there is gonna be any changes it is gonna reload browsersync
  watch(
    ['app/scss/**/*.scss', 'app/**/*.js'], // watch our scss files and js files 
    series(scssTask, jsTask, browserSyncReload)
  );
}

// Default Gulp Task
exports.default = series(scssTask, jsTask, browserSyncServe, watchTask);

// Build Gulp Task
//exports.build = series(scssTask, jsTask);