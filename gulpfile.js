const {
    src,
    dest,
    watch,
    series
} = require('gulp');

const sourcemaps = require('gulp-sourcemaps');
const terser = require('gulp-terser');
const concat = require('gulp-concat');

function minifyContent() {
    return src(
            [
                'control/content/JS/search-table-config.js',
                'control/content/JS/dummy-data.js',
                'control/content/JS/search-table-helper.js',
                'control/content/JS/app.js'
            ])
        .pipe(sourcemaps.init())
        .pipe(concat('main.js'))
        .pipe(terser({
            toplevel: true
        }))
        .pipe(sourcemaps.write('./'))
        .pipe(dest('dist/control/content'));
}

function minifyIntro() {
    return src('control/introduction/app.js')
        .pipe(sourcemaps.init())
        .pipe(concat('main.js'))
        .pipe(terser({
            toplevel: true
        }))
        .pipe(sourcemaps.write('./'))
        .pipe(dest('dist/control/introduction'));
}

function minifyStrings() {
    return src([
            'control/strings/JS/stringsUI.js',
            'control/strings/JS/app.js'
        ])
        .pipe(sourcemaps.init())
        .pipe(concat('main.js'))
        .pipe(terser({
            toplevel: true
        }))
        .pipe(sourcemaps.write('./'))
        .pipe(dest('dist/control/strings'));
}

function watchChanges() {
    watch('control/content/JS/*.js', minifyContent)
    watch('control/introduction/app.js', minifyIntro)
    watch('control/strings/JS/*.js', minifyStrings)
}

exports.default = series([
    minifyContent,
    minifyIntro,
    minifyStrings,
    watchChanges
]);