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

function minifyWidget() {
    return src([
            'widget/JS/app.js'
        ])
        .pipe(sourcemaps.init())
        .pipe(concat('main.js'))
        .pipe(terser({
            toplevel: true
        }))
        .pipe(sourcemaps.write('./'))
        .pipe(dest('dist/widget'));
}

function minifyCommonW() {
    return src(
            [
                'widget/common/models/product.js',
                'widget/common/models/language.js',
                'widget/common/models/introduction.js',
                'widget/common/controllers/product.js',
                'widget/common/controllers/language.js',
                'widget/common/controllers/introduction.js',
                'widget/common/helper/constants.js',
                'widget/common/helper/enum.js',
                'widget/common/helper/ui.js',
                'widget/common/repository/analytics.js',
                'widget/common/repository/localnotification.js',
                'widget/common/repository/pushnotification.js',
                'widget/common/repository/strings.js',
                'widget/common/repository/stringsConfig.js'
            ])
        .pipe(sourcemaps.init())
        .pipe(concat('main.js'))
        .pipe(terser({
            toplevel: true
        }))
        .pipe(sourcemaps.write('./'))
        .pipe(dest('dist/widget/common'));
}

function watchChanges() {
    watch('control/content/JS/*.js', minifyContent);
    watch('control/introduction/app.js', minifyIntro);
    watch('control/strings/JS/*.js', minifyStrings);
    watch('widget/JS/app.js', minifyWidget);
    watch([
        'widget/common/models/product.js',
        'widget/common/models/language.js',
        'widget/common/models/introduction.js',
        'widget/common/controllers/product.js',
        'widget/common/controllers/language.js',
        'widget/common/controllers/introduction.js',
        'widget/common/helper/constants.js',
        'widget/common/helper/enum.js',
        'widget/common/helper/ui.js',
        'widget/common/repository/analytics.js',
        'widget/common/repository/localnotification.js',
        'widget/common/repository/pushnotification.js',
        'widget/common/repository/strings.js',
        'widget/common/repository/stringsConfig.js'
    ], minifyCommonW);
}

exports.default = series([
    minifyContent,
    minifyIntro,
    minifyStrings,
    minifyWidget,
    minifyCommonW,
    watchChanges
]);