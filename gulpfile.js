var gulp = require( 'gulp' ),
	gutil = require( 'gulp-util' ),
	browserify = require( 'browserify' ),
	source = require( 'vinyl-source-stream' );

gulp.task('build', function() {
	browserify( './src/react-gettext.js' )
		.transform( 'browserify-shim' )
		.bundle({ standalone: 'React.i18n' })
		.on( 'error' , gutil.log ).on( 'error' , gutil.beep )
		.pipe( source( 'react-gettext.js' ) )
		.pipe( gulp.dest( './' ) );
});

gulp.task( 'watch', function() {
	gulp.watch( './src/*.jsx', [ 'build' ] );
});

gulp.task( 'default', [ 'build', 'watch' ] );