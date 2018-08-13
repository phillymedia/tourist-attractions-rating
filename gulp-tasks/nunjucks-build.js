var nunjucksRender = require('gulp-nunjucks-render');
var data = require("gulp-data");
var text = require('../app/text.json')
var photos = require('../app/photos.json')

var byPhotoTag = {};

photos.forEach(function(p){
    if(!byPhotoTag[p.keyword]) byPhotoTag[p.keyword] = [];
    byPhotoTag[p.keyword].push(p)
})


module.exports = function(gulp, plugins) {
    return function() {
        gulp.src('app/**/*.+(html|nunjucks)')
        .pipe(data({
            data: text,
            photos: byPhotoTag
        }))
        .pipe(nunjucksRender({
            path: ['app/templates']
        })).pipe(plugins.removeCode({
            tmp: true
        })).pipe(gulp.dest('.tmp')).pipe(plugins.browserSync.reload({
            stream: true
        }))
    };
};
