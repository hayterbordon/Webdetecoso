const gulp = require('gulp');
const sassCompiler = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const concatCss = require('gulp-concat-css');
const debug = require('gulp-debug'); // Opcional: para depuración

// Configuración de paths
const paths = {
  scss: {
    src: 'scss/style-saas-landing.scss',
    watch: 'scss/**/*.scss',
    dest: 'css/'
  },
  js: {
    src: [
      'bower_components/jquery/dist/jquery.min.js',
      'bootstrap/dist/js/bootstrap.min.js',
      'js/jquery.easing.min.js',
      'bower_components/wow/dist/wow.min.js',
      'js/jquery.preloader.min.js',
      'bower_components/magnific-popup/dist/jquery.magnific-popup.min.js',
      'bower_components/jquery-knob/dist/jquery.knob.min.js',
      'bower_components/owl.carousel/dist/owl.carousel.min.js',
      'bower_components/jarallax/dist/jarallax.min.js',
      'bower_components/jarallax/dist/jarallax-video.min.js',
      'js/smooth-scroll.min.js'
    ],
    dest: 'js/plugins/'
  },
  css: {
    src: [
      'bower_components/font-awesome/css/font-awesome.min.css',
      'css/animate.css',
      'bower_components/magnific-popup/dist/magnific-popup.css',
      'bower_components/owl.carousel/dist/assets/owl.carousel.min.css',
      'bower_components/owl.carousel/dist/assets/owl.theme.default.min.css',
      'bootstrap/dist/css/bootstrap.min.css'
    ],
    dest: 'css/plugins/'
  }
};

// Función mejorada para compilar SASS
function compileSass() {
  return gulp.src(paths.scss.src)
    .pipe(debug({title: 'Compilando SASS:'})) // Muestra qué archivo está procesando
    .pipe(sassCompiler({
      includePaths: ['scss', 'scss-saas-software'],
      outputStyle: 'compressed' // Minifica el CSS
    }).on('error', function(err) {
      console.error('Error en SASS:', err.message);
      this.emit('end'); // Permite que Gulp continúe
    }))
    .pipe(gulp.dest(paths.scss.dest))
    .on('end', () => console.log('SASS compilado correctamente'));
}

// Función para concatenar JS
function concatJs() {
  return gulp.src(paths.js.src, { allowEmpty: true })
    .pipe(debug({title: 'Concatenando JS:'}))
    .pipe(concat('plugins.js'))
    .pipe(gulp.dest(paths.js.dest));
}

// Función para concatenar CSS
function concatCssPlugins() {
  return gulp.src(paths.css.src, { allowEmpty: true })
    .pipe(debug({title: 'Concatenando CSS:'}))
    .pipe(concatCss('plugins.css', {
      rebaseUrls: false // Importante para evitar problemas con URLs de fuentes
    }))
    .pipe(gulp.dest(paths.css.dest));
}

// Tarea para limpiar archivos generados (opcional)
function clean(cb) {
  // Aquí podrías añadir código para limpiar archivos antiguos
  cb();
}

// Vigilar cambios
function watchFiles() {
  gulp.watch(paths.scss.watch, compileSass);
  gulp.watch(paths.js.src, concatJs);
  gulp.watch(paths.css.src, concatCssPlugins);
}

// Tareas públicas
exports.sass = compileSass;
exports.js = concatJs;
exports.css = concatCssPlugins;
exports.watch = watchFiles;
exports.clean = clean;

// Build completo
exports.build = gulp.series(clean, compileSass, concatJs, concatCssPlugins);
exports.default = exports.build;
