const { src, dest } = require('gulp');

exports.default = function() {
    return src('src/index.html')
        .pipe(dest('dist/'));
}
