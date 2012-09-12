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
	
	venue: function( cidn, ccb ) {
		if( typeof cidn == 'function' ) {
			app.talk( 'venue', cidn )
		} else if( typeof ccb == 'function' ) {
			app.talk( 'venue/'+ cidn, ccb )
		} else {
			return {
				event: function( fcb ) {
					app.talk( 'venue/'+ cidn +'/event', fcb )
				},
				production: function( fcb ) {
					app.talk( 'venue/'+ cidn +'/production', fcb )
				},
				room: function( fcb ) {
					app.talk( 'venue/'+ cidn +'/room', fcb )
				},
				attachment: function( fcb ) {
					app.talk( 'venue/'+ cidn +'/attachment', fcb )
				}
			}
		}
	},
	
	production: function( cidn, ccb ) {
		if( typeof cidn == 'function' ) {
			app.talk( 'production', cidn )
		} else if( typeof ccb == 'function' ) {
			app.talk( 'production/'+ cidn, ccb )
		} else {
			return {
				event: function( fcb ) {
					app.talk( 'production/'+ cidn +'/event', fcb )
				},
				venue: function( fcb ) {
					app.talk( 'production/'+ cidn +'/venue', fcb )
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
	
	talk: function( path, fields, cb ) {
		if( !cb && typeof fields == 'function' ) {
			var cb = fields
			var fields = {}
		}
		
		fields.apiKey = app.api.key
		fields = querystring.stringify( fields )
		
		var req = http.request(
			{
				host:	app.api.host,
				port:	80,
				path:	app.api.path + path +'?'+ fields,
				method:	'GET'
			},
			function( response ) {
				var len = response.headers['content-length'],
				    data = '',
				    done = false
				    
				response.on( 'data', function( chunk ) {
					data += chunk
					if( Buffer.byteLength( data ) == len ) {
						done = true
						cb( JSON.parse( data.toString('utf8') ) )
						req.end()
					}
				})
				
				response.on( 'end', function() {
					if( !done ) {
						cb( JSON.parse( data.toString('utf8') ) )
					}
				)}
			}
		)
	}
}

// export module
module.exports = app
