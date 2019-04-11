const { parallel, src, dest } = require('gulp');
const less = require('gulp-less');
const autoprefixer = require('gulp-autoprefixer');
const cssnano = require('gulp-cssnano');
const htmlmin = require('gulp-htmlmin');
const replace = require('gulp-replace');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');

function styles() {
    return src('src/css/app.less')
        .pipe(less())
        .pipe(autoprefixer({
            browsers: ['> 0.5%, last 2 versions, Firefox ESR, not dead']
        }))
        .pipe(cssnano())
        .pipe(dest('dist/css'));
}
function html() {
    return src('src/index.html')
        .pipe(replace(/..\/node_modules\/vue\/dist\/vue.js/g, 'js/vue.min.js'))
        .pipe(htmlmin({
            collapseWhitespace: true,
            removeComments: true
        }))
        .pipe(dest('dist/'));
}
function scripts() {
    return src('src/js/app.js')
    .pipe(babel({
        presets: ['@babel/preset-env']
    }))
    .pipe(uglify())
    .pipe(dest('dist/js'));
}
function redirects_file() {
    return src('_redirects')
    .pipe(dest('dist/'));
}
function vue_file() {
    return src('node_modules/vue/dist/vue.min.js')
    .pipe(dest('dist/js'));
}

exports.build = parallel(styles, html, scripts, redirects_file, vue_file);
