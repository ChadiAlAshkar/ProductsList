const {
    src,
    dest,
    watch,
    series
} = require('gulp');

const replace = require('gulp-replace');
const htmlReplace = require('gulp-html-replace');
const minHTML = require('gulp-htmlmin');
const csso = require('gulp-csso');
const imagemin = require('gulp-imagemin');

const destinationFolder = releaseFolder();

const contentJs = [
    'control/content/JS/search-table-config.js',
    'control/content/JS/dummy-data.js',
    'control/content/JS/search-table-helper.js',
    'control/content/JS/app.js'
];
const introductionJs = ['control/introduction/app.js'];
const stringsJs = [
    'control/strings/JS/stringsUI.js',
    'control/strings/JS/app.js'
];
const settingsJs = [
    'control/settings/app.js'
];
const designJs = [
    'control/design/app.js'
]
const widgetJs = [
    'widget/JS/app.js'
]
const commonJs = [
    'widget/common/models/*.js',
    'widget/common/repository/*.js',
    'widget/common/controllers/*.js',
    'widget/common/helper/*.js'
]
const htmlViews = ['control/**/*.html', 'widget/*.html']
const cssStyles = ['control/**/*.css', 'widget/**/*.css']


function releaseFolder() {
    var arr = __dirname.split("/");
    var fldr = arr.pop();
    arr.push(fldr + "_release");
    return arr.join("/");
}
const commonFiles = ['resources/*', 'plugin.json']

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
            "semi": [
                "error",
                "always"
            ],
            "no-console": [
                "off"
            ]
        }
    }))
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
}


function minifyContent() {
    return src(contentJs)
        .pipe(sourcemaps.init())
        .pipe(concat('main.js'))
        .pipe(terser({
            toplevel: true
        }))
        .pipe(sourcemaps.write('./'))

        .pipe(dest(destinationFolder + '/control/content'));
}

function minifyIntro() {
    return src(introductionJs)
        .pipe(sourcemaps.init())
        .pipe(concat('main.js'))
        .pipe(terser({
            toplevel: true
        }))
        .pipe(sourcemaps.write('./'))

        .pipe(dest(destinationFolder + '/control/introduction'));
}

function minifyStrings() {
    return src(stringsJs)
        .pipe(sourcemaps.init())
        .pipe(concat('main.js'))
        .pipe(terser({
            toplevel: true
        }))
        .pipe(sourcemaps.write('./'))

        .pipe(dest(destinationFolder + '/control/strings'));
}

function minifySettings() {
    return src(settingsJs)
        .pipe(sourcemaps.init())
        .pipe(concat('main.js'))
        .pipe(terser({
            toplevel: true
        }))
        .pipe(sourcemaps.write('./'))

        .pipe(dest(destinationFolder + '/control/settings'));
}

function minifyDesign(){
    return src(designJs)
    .pipe(sourcemaps.init())
    .pipe(concat('main.js'))
    .pipe(terser({
        toplevel: true
    }))
    .pipe(sourcemaps.write('./'))

    .pipe(dest(destinationFolder + '/control/design'));
}

function minifyWidget() {
    return src(widgetJs)
        .pipe(sourcemaps.init())
        .pipe(concat('main.js'))
        .pipe(terser({
            toplevel: true
        }))
        .pipe(sourcemaps.write('./'))

        .pipe(dest(destinationFolder + '/widget'));
}

function minifyCommonW() {
    return src(commonJs)
        .pipe(sourcemaps.init())
        .pipe(concat('main.js'))
        .pipe(terser({
            toplevel: true
        }))
        .pipe(sourcemaps.write('./'))

        .pipe(dest(destinationFolder + '/widget/common'));
}

function minifyHTML() {
    return src(htmlViews, {
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
        .pipe(replace('src="../../../productsList_release/control/settings/', 'src="./'))
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

function minifyCSS() {
    return src(cssStyles, {
            base: '.'
        })
        .pipe(csso())
        .pipe(dest(destinationFolder))
};

function AddCommonFiles() {
    return src(commonFiles, {
            base: '.'
        })
        .pipe(dest(destinationFolder));
};

function AddCommonImages() {
    return src(['**/.images/**'], {
            base: '.'
        })
        .pipe(imagemin())
        .pipe(dest(destinationFolder));
}

function AddDesignImages(){
    return src(['control/design/images/**'], {
        base: '.'
    })
    .pipe(imagemin())
    .pipe(dest(destinationFolder));

}


function watchChanges() {
    watch(contentJs, minifyContent);
    watch(introductionJs, minifyIntro);
    watch(stringsJs, minifyStrings);
    watch(settingsJs, minifySettings);
    watch(designJs, minifyDesign);
    watch(widgetJs, minifyWidget);
    watch(commonJs, minifyCommonW);
    watch(htmlViews, minifyHTML);
    watch(cssStyles, minifyCSS);
    watch(commonFiles, AddCommonFiles);
}

exports.default = series([
    lint,
    minifyContent,
    minifyIntro,
    minifyStrings,
    minifyWidget,
    minifyCommonW,
    minifySettings,
    minifyDesign,
    minifyHTML,
    minifyCSS,
    AddCommonFiles,
    AddCommonImages,
    AddDesignImages,
    watchChanges
]);