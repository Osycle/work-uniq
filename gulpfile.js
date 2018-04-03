


var gulp 					= require('gulp'),
		del							= require('del'),
		browserSync 		= require('browser-sync'),
		sass 						= require('gulp-sass'),
		concat					= require('gulp-concat'),
		uglify					= require('gulp-uglifyjs'),
		cssnano					= require('gulp-cssnano'),
		rename					= require('gulp-rename'),
		imagemin				= require('gulp-imagemin'),
		cache						= require('gulp-cache'),
		autoprefixer		= require('gulp-autoprefixer');
		
var app = "app";

// OPTI-IMAGES
gulp.task('img', () =>
	gulp.src(app+'/img/**/*/')
		.pipe( cache(imagemin([
						imagemin.gifsicle({interlaced: true}),
						imagemin.jpegtran({progressive: true}),
						imagemin.optipng({optimizationLevel: 5}),
						imagemin.svgo({plugins: [{removeViewBox: true}]})
					])) )
		.pipe( gulp.dest('dist/img') )
);




// SASS
gulp.task('sass', () =>
	{
	return gulp.src( app+'/scss/**/*.+(scss|sass)' )
			.pipe( sass().on('error', sass.logError) )
			.pipe( autoprefixer( {browsers: 'last 15 versions', cascade: false} ) )
			.pipe( gulp.dest(app+'/css/') ) //css default
			.pipe( browserSync.reload({stream:true}) );
	}
);



// SCRIPTS
gulp.task('scripts', () =>
	{	
	return gulp.src([
			app+'/js/jquery.min.js',
			app+'/js/smoothscroll.js',
			app+'/js/bootstrap.min.js',
			//app+'/js/TweenMax.min.js',
			//app+'/js/EasePack.min.js',
			//app+'/js/TextPlugin.min.js',
			//app+'/js/konva.min.js',
			//app+'/js/KonvaPlugin.js',
			//app+'/js/jquery.fractionslider.js',
			app+'/js/aos.js',
			app+'/js/wow.js',
			//app+'/js/skrollr.min.js',
			//app+'/js/owl.carousel.min.js',
			app+'/js/jquery.fancybox.js',
			app+'/js/jquery.jcarousel.js',
			app+'/js/classie.js',
			app+'/js/masonry.pkgd.min.js',
			//app+'/js/jquery.elevateZoom.min.js',
			app+'/js/jquery.mmenu.all.js',
			app+'/js/flickity.js'
		])
		.pipe( concat('scripts.min.js') )
		.pipe( uglify() )
		.pipe( gulp.dest(app+'/js/') ); //js default
	}
);

// STYLES
gulp.task('cssnano', ['sass'], () =>
	{
		return gulp.src(app+'/css/main.css')
		.pipe( cssnano({ reduceIdents :  false }) )
		.pipe(rename({suffix: '.min'}) )
		.pipe( gulp.dest(app+'/css/') ); //css default
	}
);

// RELOADER BROWSER
gulp.task('browser-sync', () =>
	{
		browserSync({
			server: {baseDir: app+''},
			//proxy: "http://",
			notify: false
		});
	}
);

// CLEAN DIR
gulp.task('clean', () =>
	{ return del.sync( 'dist/' ); }
);
// CLEAR
gulp.task('clear', () => 
	{
		return cache.clearAll();
	} 
)

// WATCHING
gulp.task('watch', ['browser-sync', 'cssnano', 'scripts'], () =>
	{
		gulp.watch(app+'/scss/**/*.+(scss|sass)', ['sass']);
		gulp.watch(app+'/*.html', browserSync.reload);
		gulp.watch(app+'/**/*.php', browserSync.reload);
		gulp.watch(app+'/templates/**/*.tpl', browserSync.reload);
		gulp.watch(app+'/js/**/*.js', browserSync.reload);
	}
);



// PROD-BUILD
// this.array -> 'img' default
gulp.task('build', ['clean', 'cssnano', 'sass', 'scripts'], () =>

	{
		var css 	= gulp.src(app+'/css/main.min.css').pipe( gulp.dest( 'dist/css/' ) );
		var fonts 	= gulp.src(app+'/fonts/**/*').pipe( gulp.dest('dist/fonts/') );
		var js  	= gulp.src([app+'/js/scripts.min.js', app+'/js/main.js']).pipe( gulp.dest('dist/js/') );
		var html 	= gulp.src(app+'/*.+(html|php)').pipe( gulp.dest('dist/') );
	}

);