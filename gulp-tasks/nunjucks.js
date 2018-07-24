var nunjucksRender = require('gulp-nunjucks-render');
var data = require("gulp-data");
var text = require('../app/text.json')

module.exports = function(gulp, plugins) {
    return function() {
        gulp.src('app/**/*.+(html|nunjucks)').pipe(data({
            data: text
        })).pipe(nunjucksRender({
            path: ['app/templates']
        })).pipe(plugins.removeCode({
            tmp: true,
            build: true
        })).pipe(gulp.dest('.tmp')).pipe(plugins.browserSync.reload({
            stream: true
        }))
    };
};
