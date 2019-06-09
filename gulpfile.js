const { series, parallel, src, dest } = require('gulp');
const less = require('gulp-less');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const postcss = require('gulp-postcss');
const htmlmin = require('gulp-htmlmin');
const replace = require('gulp-replace');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const del = require('del');
const fs = require('fs');

function styles() {
    let plugins = [
        autoprefixer(),
        cssnano()
    ];
    return src('src/css/app.less')
        .pipe(less())
        .pipe(postcss(plugins))
        .pipe(dest('dist/css'));
}
function html() {
    return src('src/index.html')
        .pipe(replace(/..\/node_modules\/vue\/dist\/vue.js/g, 'js/vue.min.js'))
        .pipe(replace(/..\/node_modules\/chain-timeout\/dist\/chain-timeout.min.js/g, 'js/chain-timeout.min.js'))
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
function copy_files() {
    return src([
        'src/_redirects',
        'src/manifest.json',
    ])
    .pipe(dest('dist/'));
}
function modules() {
    return src([
        'node_modules/vue/dist/vue.min.js',
        'node_modules/chain-timeout/dist/chain-timeout.min.js'
    ])
    .pipe(dest('dist/js'));
}

// ...

function clean_dist_before() { return del([ 'dist/**/*' ]) }
function clean_dist_after() {

    return del([
        'dist/css/',
        'dist/js/',
    ]);
}

function embed_external() {
    return src('dist/index.html')
    .pipe(replace(
        /<link rel="stylesheet" href="(.*?)">/g,
        (s, filename) => {
            let _css = fs.readFileSync(`dist/${filename}`, 'utf8');
            return `<style>${_css}</style>`;
        }
    ))
    .pipe(replace(
        /<script src="(.*?)"><\/script>/g,
        (s, filename) => {
            let _js = fs.readFileSync(`dist/${filename}`, 'utf8')
            return `<script>${_js}</script>`;
        }
    ))
    .pipe(dest('dist/'));
}

exports.prebuild = series(clean_dist_before);
exports.create = parallel(styles, html, scripts, copy_files, modules);
exports.embed = series(embed_external);
exports.postbuild = series(clean_dist_after);

exports.build = series(clean_dist_before, parallel(styles, html, scripts, copy_files, modules), embed_external, clean_dist_after);
