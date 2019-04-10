const { parallel, src, dest } = require('gulp');

function styles() {
    return src('src/css/app.css')
        .pipe(dest('dist/css'));
}
function html() {
    return src('src/index.html')
        .pipe(dest('dist/'));
}

exports.build = parallel(styles, html);
