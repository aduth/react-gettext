var gulp = require( 'gulp' ),
	gutil = require( 'gulp-util' ),
	browserify = require( 'gulp-browserify' ),
	rename = require( 'gulp-rename' );

gulp.task('build', function() {
	gulp.src( './src/react-gettext.jsx', { read: false } )
		.pipe( browserify({
			transform: [ 'reactify' ],
			shim: {
				jed: {
					exports: 'Jed',
					path: './node_modules/jed/jed.js'
				},
				react: {
					exports: 'React',
					path: './node_modules/react/react.js'
				}
			},
			standalone: 'React.i18n'
		}) )
			.on( 'error' , gutil.log ).on( 'error' , gutil.beep )
			.on( 'prebundle', function( bundle ) {
				bundle.external( 'jed' );
				bundle.external( 'react' );
			})
		.pipe( rename( 'react-gettext.js' ) )
		.pipe( gulp.dest('./') );
});

gulp.task( 'watch', function() {
	gulp.watch( './src/*.jsx', [ 'build' ] );
});

gulp.task( 'default', [ 'build', 'watch' ] );