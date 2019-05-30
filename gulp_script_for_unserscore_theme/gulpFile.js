let themename = 'humescores';
let ProjectURL = 'localhost/wordpress/humescores';
let ProjectPort = 8080; // your project port


let gulp = require( 'gulp' );
//prepare and optimize code etc
let autoprefixer = require('autoprefixer');
let browserSync = require( 'browser-sync' ).create();
let image = require('gulp-image');
let jshint = require('gulp-jshint');
let postcss = require('gulp-postcss');
let sass = require( 'gulp-sass' );
let sourcemaps = require( 'gulp-sourcemaps' );

//only work with new or updated files
let newer = require('gulp-newer');

// name of working theme folder
let themeRoot = '../'+themename+'/';
let scssRoot = themeRoot + 'sass/';
let jsRoot = themeRoot + 'js/' ;
let imgRoot = themeRoot + 'images/';
let languagesRoot = themeRoot + 'languages/';


// CSS via Sass and Autoprefixer
gulp.task('css',function(){
    return gulp.src(scssRoot + '{style.scss,rtl.scss}')
        .pipe(sourcemaps.init())
        .pipe(sass({
            outputStyle: 'expanded',
            indentType: 'tab',
            indentWidth: '1'
        }).on('error', sass.logError))
        .pipe(postcss([
            autoprefixer('last 2 versions', '> 1%')
        ]))
        .pipe(sourcemaps.write(scssRoot+'maps'))
        .pipe(gulp.dest(themeRoot));

});


// optimize images through gulp-image
gulp.task('images',function(){
    return gulp.src(imgRoot + 'RAW/**/*.(jpg,JPG,png)')
        .pipe(newer(img))
        .pipe(image())
        .pipe(gulp.dest(img));
});

// javascript
gulp.task('javascript',function(){
    return gulp.src([jsRoot + '*.js'])
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(gulp.dest(jsRoot));
});


// watch everyting
gulp.task('watch',function(){
        browserSync.init({
            open: 'external',
            proxy: ProjectURL,
            port: ProjectPort
        });
        gulp.watch([themeRoot + '**/*.css',themeRoot+ '**/*.scss'], ['css']);
        gulp.watch(jsRoot + '**/*.js', ['javascript']);
        gulp.watch(imgRoot + 'RAW/**/*.(jpg,JPG,png)', ['images']);
        gulp.watch(themeRoot+ '**/*').on('change',browserSync.reload);
});



// Default task (runs at initiation: gulp --verbose)
gulp.task('default',['watch']);
