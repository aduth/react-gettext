#!/usr/bin/env node
var XGettext = require( 'xgettext-js' ),
	parser;

parser = new XGettext({
	keywords: {
		'__': function( match ) {
			if ( typeof match.arguments[1].value === 'string' ) {
				return match.arguments[1].value;
			}
		},

		'_x': function( match ) {
			var context;

			for ( var p = 0, pl = match.arguments[0].properties.length; p < pl; p++ ) {
				var prop = match.arguments[0].properties[ p ];

				if ( prop.key.name.toLowerCase() === 'context' ) {
					context = prop.value.value;
				}
			}

			if ( context && typeof match.arguments[1].value === 'string' ) {
				return context + '\u0004' + match.arguments[1].value;
			}
		},

		'_n': function( match ) {
			var strings = [];

			for ( var p = 0, pl = match.arguments[0].properties.length; p < pl; p++ ) {
				var prop = match.arguments[0].properties[ p ],
					propKeyName = prop.key.name.toLowerCase();

				if ( propKeyName === 'single' || propKeyName === 'plural' ) {
					strings.push( prop.value.value );
				}
			}

			return strings;
		}
	}
});

var chunks = [];

process.stdin.setEncoding( 'utf8' );

process.stdin.on( 'data', function( chunk ) {
	chunks.push( chunk );
});

process.stdin.on( 'end', function() {
	var matches = parser.getMatches( chunks.join( '' ) );
	process.stdout.write( JSON.stringify( matches ) );
});