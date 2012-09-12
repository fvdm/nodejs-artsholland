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
		host:	'api.artsholland.com',
		path:	'/rest/',
		key:	''
	},
	
	// Event
	event: function( one, two, three ) {
		
		if( typeof one == 'function' ) {
			
			// app.event( oneCallback )
			app.talk( 'event', one )
			
		} else if( typeof one == 'object' && typeof two == 'function' ) {
			
			// app.event( oneFilter, twoCallback )
			app.talk( 'event', one, two )
			
			
		} else if( typeof one == 'string' && typeof two == 'function' ) {
			
			// app.event( oneCIDN, twoCallback )
			app.talk( 'event/'+ one, two )
			
		} else if( typeof one == 'string' && two == undefined ) {
			
			// var event = app.event( oneCIDN )
			return {
				
				// app.event( oneCIDN ).venue( fourCallback )
				venue: function( four ) {
					app.talk( 'event/'+ one +'/venue', four )
				},
				
				// app.event( oneCIDN ).production( fourCallback )
				production: function( four ) {
					app.talk( 'event/'+ one +'/production', four )
				},
				
				// app.event( oneCIDN ).room( fourCallback )
				room: function( four ) {
					app.talk( 'event/'+ one +'/room', four )
				},
				
				// app.event( oneCIDN ).attachment( fourCallback )
				attachment: function( four ) {
					app.talk( 'event/'+ one +'/attachment', four )
				},
				
				offering: function( four ) {
					if( typeof four == 'function' ) {
						
						// app.event( oneCIDN ).offering( fourCallback )
						app.talk( 'event/'+ one +'/offering', four )
						
					} else if( typeof four == 'string' ) {
						return {
							
							// app.event( oneCIDN ).offering( fourName ).price( fiveCallback )
							price: function( fcb ) {
								app.talk( 'event/'+ one +'/offering/'+ four +'/price', five )
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
			app.talk( 'venue', one )
			
		} else if( typeof one == 'object' && typeof two == 'function' ) {
			
			// app.venue( oneFilter, twoCallback )
			app.talk( 'venue', one, two )
			
			
		} else if( typeof one == 'string' && typeof two == 'function' ) {
			
			// app.venue( oneCIDN, twoCallback )
			app.talk( 'venue/'+ one, two )
			
		} else if( typeof one == 'string' && two == undefined ) {
			
			// var venue = app.venue( oneCIDN )
			return {
				
				// app.venue( oneCIDN ).event( fourCallback )
				event: function( four ) {
					app.talk( 'venue/'+ one +'/event', four )
				},
				
				// app.venue( oneCIDN ).production( fourCallback )
				production: function( four ) {
					app.talk( 'venue/'+ one +'/production', four )
				},
				
				// app.venue( oneCIDN ).room( fourCallback )
				room: function( four ) {
					app.talk( 'venue/'+ one +'/room', four )
				},
				
				// app.venue( oneCIDN ).attachment( fourCallback )
				attachment: function( four ) {
					app.talk( 'venue/'+ one +'/attachment', four )
				}
				
			}
		}
	},
	
	// Production
	production: function( one, two, three ) {
		
		if( typeof one == 'function' ) {
			
			// app.production( oneCallback )
			app.talk( 'production', one )
			
		} else if( typeof one == 'object' && typeof two == 'function' ) {
			
			// app.production( oneFilter, twoCallback )
			app.talk( 'production', one, two )
			
			
		} else if( typeof one == 'string' && typeof two == 'function' ) {
			
			// app.production( oneCIDN, twoCallback )
			app.talk( 'production/'+ one, two )
			
		} else if( typeof one == 'string' && two == undefined ) {
			
			// var production = app.production( oneCIDN )
			return {
				
				// app.production( oneCIDN ).event( fourCallback )
				event: function( four ) {
					app.talk( 'production/'+ one +'/event', four )
				},
				
				// app.production( oneCIDN ).production( fourCallback )
				venue: function( four ) {
					app.talk( 'production/'+ one +'/venue', four )
				}
				
			}
		}
	},
	
	genre: function( cb ) {
		app.talk( 'genre', cb )
	},
	
	venuetype: function( cb ) {
		app.talk( 'venuetype', cb )
	},
	
	// Communicate
	talk: function( path, fields, cb ) {
		if( !cb && typeof fields == 'function' ) {
			var cb = fields
			var fields = {}
		}
		
		fields.apiKey = app.api.key
		fields = querystring.stringify( fields )
		
		http.request(
			{
				host:	app.api.host,
				port:	80,
				path:	app.api.path + path +'?'+ fields,
				method:	'GET',
				headers: {
					Accept:	'application/json'
				}
			},
			function( response ) {
				var data = ''
				response.on( 'data', function( chunk ) { data += chunk })
				response.on( 'end', function() {
					data = data.toString('utf8')
					if( data.match( /^(\{.*\}|\[.*\])$/ ) ) {
						cb( JSON.parse( data ) )
					}
				})
			}
		).end()
	}
}

// export module
module.exports = app
