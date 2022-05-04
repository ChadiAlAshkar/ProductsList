const {
    src,
    dest,
    watch,
    series
} = require('gulp');

const replace = require('gulp-replace');

const htmlReplace = require('gulp-html-replace');
const minHTML = require('gulp-htmlmin');
const minCSS = require('gulp-csso');

const destinationFolder = releaseFolder();

function releaseFolder() {
    var arr = __dirname.split("/");
    var fldr = arr.pop();
    arr.push(fldr + "/release");
    return arr.join("/");
}

const sourcemaps = require('gulp-sourcemaps');
const terser = require('gulp-terser');
const concat = require('gulp-concat');

function minifyContent() {
    console.log(destinationFolder)
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
        .pipe(dest(destinationFolder + '/control/content'));
}

function minifyIntro() {
    return src('control/introduction/app.js')
        .pipe(sourcemaps.init())
        .pipe(concat('main.js'))
        .pipe(terser({
            toplevel: true
        }))
        .pipe(sourcemaps.write('./'))
        .pipe(dest(destinationFolder + '/control/introduction'));
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
        .pipe(dest(destinationFolder + '/control/strings'));
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
        .pipe(dest(destinationFolder + '/widget'));
}

function minifyCSS(){
    return src(['control/content/*.css','control/introduction/*.css','control/strings/*.css', 'widget/*.css'], {
        base: '.'
    })

    /// minify the CSS contents
        .pipe(minCSS())

        ///merge
        // .pipe(concat('styles.min.css'))

        /// write result to the 'build' folder
        .pipe(dest(destinationFolder))
};

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
        .pipe(dest(destinationFolder + '/widget/common'));
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

function minifyHTML(){
    return src(['control/content/*.html','control/introduction/*.html','control/strings/*.html', 'widget/*.html'],{base: '.'})
    /// replace all the <!-- build:bundleJSFiles  --> comment bodies
    /// with scripts.min.js with cache buster
        .pipe(htmlReplace({
            bundleJSFiles:"scripts.min.js?v=" + (new Date().getTime())
            ,bundleCSSFiles:"styles.min.css?v=" + (new Date().getTime())
        }))
        .pipe(replace('../../release', '../../../release'))
        .pipe(replace('src="../release', 'src="../../release'))
        /// then strip the html from any comments
        .pipe(minHTML({removeComments:true,collapseWhitespace:true}))
        /// write results to the 'build' folder
        .pipe(dest(destinationFolder));
};

function watchJS() {
    watch([
        'control/content/JS/*.js',
        'control/introduction/app.js',
        'control/strings/JS/*.js',
        'widget/JS/app.js',
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
    ], minifyJS);
}

exports.default = series([
    minifyContent,
    minifyIntro,
    minifyStrings,
    minifyWidget,
    minifyCommonW,
    minifyHTML,
    minifyCSS,
    watchChanges
]);