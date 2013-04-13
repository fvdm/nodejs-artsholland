/*
Name:     nodejs-artsholland
Source:   https://github.com/fvdm/nodejs-artsholland
Feedback: https://github.com/fvdm/nodejs-artsholland/issues
License:  Unlicense / Public Domain
*/

var http = require('http'),
    querystring = require('querystring')


// API key
module.exports.apikey = ''


// Event
module.exports.event = function( one, two, three ) {
	
	if( typeof one == 'function' ) {
		
		// event( oneCallback )
		talk( 'event', one )
		
	} else if( typeof one == 'object' && typeof two == 'function' ) {
		
		// event( oneFilter, twoCallback )
		talk( 'event', one, two )
		
		
	} else if( typeof one == 'string' && typeof two == 'function' ) {
		
		// event( oneCIDN, twoCallback )
		talk( 'event/'+ one, two )
		
	} else if( typeof one == 'string' && two == undefined ) {
		
		// var event = event( oneCIDN )
		return {
			
			// event( oneCIDN ).venue( fourCallback )
			venue: function( four ) {
				talk( 'event/'+ one +'/venue', four )
			},
			
			// event( oneCIDN ).production( fourCallback )
			production: function( four ) {
				talk( 'event/'+ one +'/production', four )
			},
			
			// event( oneCIDN ).room( fourCallback )
			room: function( four ) {
				talk( 'event/'+ one +'/room', four )
			},
			
			// event( oneCIDN ).attachment( fourCallback )
			attachment: function( four ) {
				talk( 'event/'+ one +'/attachment', four )
			},
			
			offering: function( four ) {
				if( typeof four == 'function' ) {
					
					// event( oneCIDN ).offering( fourCallback )
					talk( 'event/'+ one +'/offering', four )
					
				} else if( typeof four == 'string' ) {
					return {
						
						// event( oneCIDN ).offering( fourName ).price( fiveCallback )
						price: function( fcb ) {
							talk( 'event/'+ one +'/offering/'+ four +'/price', five )
						}
						
					}
				}
			}
		}
	}
}

// Venue
module.exports.venue = function( one, two, three ) {
	
	if( typeof one == 'function' ) {
		
		// venue( oneCallback )
		talk( 'venue', one )
		
	} else if( typeof one == 'object' && typeof two == 'function' ) {
		
		// venue( oneFilter, twoCallback )
		talk( 'venue', one, two )
		
		
	} else if( typeof one == 'string' && typeof two == 'function' ) {
		
		// venue( oneCIDN, twoCallback )
		talk( 'venue/'+ one, two )
		
	} else if( typeof one == 'string' && two == undefined ) {
		
		// var venue = venue( oneCIDN )
		return {
			
			// venue( oneCIDN ).event( fourCallback )
			event: function( four ) {
				talk( 'venue/'+ one +'/event', four )
			},
			
			// venue( oneCIDN ).production( fourCallback )
			production: function( four ) {
				talk( 'venue/'+ one +'/production', four )
			},
			
			// venue( oneCIDN ).room( fourCallback )
			room: function( four ) {
				talk( 'venue/'+ one +'/room', four )
			},
			
			// venue( oneCIDN ).attachment( fourCallback )
			attachment: function( four ) {
				talk( 'venue/'+ one +'/attachment', four )
			}
			
		}
	}
}

// Production
module.exports.production = function( one, two, three ) {
	
	if( typeof one == 'function' ) {
		
		// production( oneCallback )
		talk( 'production', one )
		
	} else if( typeof one == 'object' && typeof two == 'function' ) {
		
		// production( oneFilter, twoCallback )
		talk( 'production', one, two )
		
		
	} else if( typeof one == 'string' && typeof two == 'function' ) {
		
		// production( oneCIDN, twoCallback )
		talk( 'production/'+ one, two )
		
	} else if( typeof one == 'string' && two == undefined ) {
		
		// var production = production( oneCIDN )
		return {
			
			// production( oneCIDN ).event( fourCallback )
			event: function( four ) {
				talk( 'production/'+ one +'/event', four )
			},
			
			// production( oneCIDN ).production( fourCallback )
			venue: function( four ) {
				talk( 'production/'+ one +'/venue', four )
			}
			
		}
	}
},

module.exports.genre = function( filters, cb ) {
	talk( 'genre', filters, cb )
}

module.exports.venuetype = function( filters, cb ) {
	talk( 'venuetype', filters, cb )
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
	fields.apiKey = module.exports.apikey
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
