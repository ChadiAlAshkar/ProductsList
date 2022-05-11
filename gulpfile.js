const {
    src,
    dest,
    watch,
    series
} = require('gulp');

const gzip = require('gulp-gzip');

const replace = require('gulp-replace');

const htmlReplace = require('gulp-html-replace');
const minHTML = require('gulp-htmlmin');
const minCSS = require('gulp-csso');
const imagemin = require('gulp-imagemin');

const destinationFolder = releaseFolder();

function releaseFolder() {
    var arr = __dirname.split("/");
    var fldr = arr.pop();
    arr.push(fldr + "_release");
    return arr.join("/");
}

const sourcemaps = require('gulp-sourcemaps');
const terser = require('gulp-terser');
const concat = require('gulp-concat');


const eslint = require('gulp-eslint');

function lint(){
    return src(['widget/**/*.js', 'control/**/*.js'])
    .pipe(eslint({
        "env": {
            "browser": true,
            "es6": true,
        },
        "parser": "@babel/eslint-parser",
        "extends": "eslint:recommended",
        "parserOptions": {
            "requireConfigFile": false,
            "sourceType": "module",
        },
        "rules": {
            "no-console": [
                "off"
            ]
        }
    }))
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
}

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

function minifyCSS() {
    return src(['control/content/*.css', 'control/introduction/*.css', 'control/strings/*.css', 'widget/*.css'], {
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
                'widget/common/repository/analytics.js',
                'widget/common/controllers/product.js',
                'widget/common/controllers/language.js',
                'widget/common/controllers/introduction.js',
                'widget/common/helper/constants.js',
                'widget/common/helper/enum.js',
                'widget/common/helper/ui.js',
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
    watch([,
        'control/content/*.html',
        'control/introduction/*.html',
        'control/strings/*.html',
        'widget/*.html'
    ], minifyHTML);
    watch([,
        'control/content/*.css',
        'control/introduction/*.css',
        'control/strings/*.css',
        'widget/*.css'
    ], minifyCSS);
    watch([
        'resources/*', 
        'plugin.json'
    ], AddCommonFiles);
}

function minifyHTML() {
    return src(['control/content/*.html', 'control/introduction/*.html', 'control/strings/*.html', 'widget/*.html'], {
            base: '.'
        })
        /// replace all the <!-- build:bundleJSFiles  --> comment bodies
        /// with scripts.min.js with cache buster
        .pipe(htmlReplace({
            bundleJSFiles: "scripts.min.js?v=" + (new Date().getTime()),
            bundleCSSFiles: "styles.min.css?v=" + (new Date().getTime())
        }))
        .pipe(replace('src="../../../productsList_release/control/content/', 'src="./'))
        .pipe(replace('src="../../../productsList_release/control/introduction/', 'src="./'))
        .pipe(replace('src="../../../productsList_release/control/strings/', 'src="./'))
        .pipe(replace('src="../../productsList_release/widget/common', 'src="./common'))
        .pipe(replace('src="../../productsList_release/widget/main.js', 'src="./main.js'))
        .pipe(replace('src="../../../productsList_release/widget/common/', 'src="../../widget/common/'))
        /// then strip the html from any comments
        .pipe(minHTML({
            removeComments: true,
            collapseWhitespace: true
        }))
        /// write results to the 'build' folder

        .pipe(dest(destinationFolder));
};

function AddCommonFiles() {
    return src(['resources/*', 'plugin.json'], {
            base: '.'
        })
        .pipe(dest(destinationFolder));
};

function AddImages() {
    return src(['**/.images/**'], {
            base: '.'
        })
        .pipe(imagemin())
        .pipe(dest(destinationFolder));
}

exports.default = series([
    lint,
    minifyContent,
    minifyIntro,
    minifyStrings,
    minifyWidget,
    minifyCommonW,
    minifyHTML,
    minifyCSS,
    AddCommonFiles,
    AddImages,
    watchChanges
]);