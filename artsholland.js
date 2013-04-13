/*
Name:     nodejs-artsholland
Source:   https://github.com/fvdm/nodejs-artsholland
Feedback: https://github.com/fvdm/nodejs-artsholland/issues
License:  Unlicense / Public Domain
*/

var http = require('http'),
    querystring = require('querystring')

var app = {

	api: {
		key:	''
	},
	
	// Event
	event: function( one, two, three ) {
		
		if( typeof one == 'function' ) {
			
			// app.event( oneCallback )
			talk( 'event', one )
			
		} else if( typeof one == 'object' && typeof two == 'function' ) {
			
			// app.event( oneFilter, twoCallback )
			talk( 'event', one, two )
			
			
		} else if( typeof one == 'string' && typeof two == 'function' ) {
			
			// app.event( oneCIDN, twoCallback )
			talk( 'event/'+ one, two )
			
		} else if( typeof one == 'string' && two == undefined ) {
			
			// var event = app.event( oneCIDN )
			return {
				
				// app.event( oneCIDN ).venue( fourCallback )
				venue: function( four ) {
					talk( 'event/'+ one +'/venue', four )
				},
				
				// app.event( oneCIDN ).production( fourCallback )
				production: function( four ) {
					talk( 'event/'+ one +'/production', four )
				},
				
				// app.event( oneCIDN ).room( fourCallback )
				room: function( four ) {
					talk( 'event/'+ one +'/room', four )
				},
				
				// app.event( oneCIDN ).attachment( fourCallback )
				attachment: function( four ) {
					talk( 'event/'+ one +'/attachment', four )
				},
				
				offering: function( four ) {
					if( typeof four == 'function' ) {
						
						// app.event( oneCIDN ).offering( fourCallback )
						talk( 'event/'+ one +'/offering', four )
						
					} else if( typeof four == 'string' ) {
						return {
							
							// app.event( oneCIDN ).offering( fourName ).price( fiveCallback )
							price: function( fcb ) {
								talk( 'event/'+ one +'/offering/'+ four +'/price', five )
							}
							
						}
					}
				}
			}
		}
	},
	
	// Venue
	venue: function( one, two, three ) {
		
		if( typeof one == 'function' ) {
			
			// app.venue( oneCallback )
			talk( 'venue', one )
			
		} else if( typeof one == 'object' && typeof two == 'function' ) {
			
			// app.venue( oneFilter, twoCallback )
			talk( 'venue', one, two )
			
			
		} else if( typeof one == 'string' && typeof two == 'function' ) {
			
			// app.venue( oneCIDN, twoCallback )
			talk( 'venue/'+ one, two )
			
		} else if( typeof one == 'string' && two == undefined ) {
			
			// var venue = app.venue( oneCIDN )
			return {
				
				// app.venue( oneCIDN ).event( fourCallback )
				event: function( four ) {
					talk( 'venue/'+ one +'/event', four )
				},
				
				// app.venue( oneCIDN ).production( fourCallback )
				production: function( four ) {
					talk( 'venue/'+ one +'/production', four )
				},
				
				// app.venue( oneCIDN ).room( fourCallback )
				room: function( four ) {
					talk( 'venue/'+ one +'/room', four )
				},
				
				// app.venue( oneCIDN ).attachment( fourCallback )
				attachment: function( four ) {
					talk( 'venue/'+ one +'/attachment', four )
				}
				
			}
		}
	},
	
	// Production
	production: function( one, two, three ) {
		
		if( typeof one == 'function' ) {
			
			// app.production( oneCallback )
			talk( 'production', one )
			
		} else if( typeof one == 'object' && typeof two == 'function' ) {
			
			// app.production( oneFilter, twoCallback )
			talk( 'production', one, two )
			
			
		} else if( typeof one == 'string' && typeof two == 'function' ) {
			
			// app.production( oneCIDN, twoCallback )
			talk( 'production/'+ one, two )
			
		} else if( typeof one == 'string' && two == undefined ) {
			
			// var production = app.production( oneCIDN )
			return {
				
				// app.production( oneCIDN ).event( fourCallback )
				event: function( four ) {
					talk( 'production/'+ one +'/event', four )
				},
				
				// app.production( oneCIDN ).production( fourCallback )
				venue: function( four ) {
					talk( 'production/'+ one +'/venue', four )
				}
				
			}
		}
	},
	
	genre: function( filters, cb ) {
		talk( 'genre', filters, cb )
	},
	
	venuetype: function( filters, cb ) {
		talk( 'venuetype', filters, cb )
	}
}


// Communicate
function talk( path, fields, cb ) {
	if( !cb && typeof fields == 'function' ) {
		var cb = fields
		var fields = {}
	}
	
	// prevent multiple callbacks
	var complete = false
	var doCallback = function( err, data ) {
		if( ! complete ) {
			complete = true
			cb( err, data )
		}
	}
	
	// build request
	fields.apiKey = app.api.key
	fields = querystring.stringify( fields )
	
	var options = {
		host:	'api.artsholland.com',
		path:	'/rest/'+ path +'?'+ fields,
		method:	'GET',
		headers: {
			'User-Agent':	'artsholland.js (https://github.com/fvdm/nodejs-artsholland)',
			Accept:		'application/json'
		}
	}
	
	var request = http.request( options )
	
	// process response
	request.on( 'response', function( response ) {
		var data = []
		var size = 0
		
		response.on( 'data', function( chunk ) {
			data.push( chunk )
			size += chunk.length
		})
		
		response.on( 'end', function() {
			if( data.length >= 0 ) {
				var buf = new Buffer( size )
				var pos = 0;
				
				for( var d in data ) {
					data[d].copy( buf, pos )
					pos += data[d].length
				}
				
				data = buf.toString().trim()
				
				if( data.match( /^(\{.*\}|\[.*\])$/ ) ) {
					doCallback( null, JSON.parse( data ) )
				}
			}
		})
	})
	
	// request error
	request.on( 'error', function( error ) {
		var err = new Error('request error')
		err.requestError = error
		err.request = options
		doCallback( err )
	})
	
	// complete request
	request.end()
}


// export module
module.exports = app
