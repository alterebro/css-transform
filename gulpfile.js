const { src, dest } = require('gulp');

exports.build = function() {
    return src('src/index.html')
        .pipe(dest('dist/'));
}
