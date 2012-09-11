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
	event: function( cidn, ccb ) {
		if( typeof cidn == 'function' ) {
			app.talk( 'event', cidn )
		} else if( typeof ccb == 'function' ) {
			app.talk( 'event/'+ cidn, ccb )
		} else {
			return {
				venue: function( fcb ) {
					app.talk( 'event/'+ cidn +'/venue', fcb )
				},
				production: function( fcb ) {
					app.talk( 'event/'+ cidn +'/production', fcb )
				},
				room: function( fcb ) {
					app.talk( 'event/'+ cidn +'/room', fcb )
				},
				attachment: function( fcb ) {
					app.talk( 'event/'+ cidn +'/attachment', fcb )
				},
				offering: function( name ) {
					if( typeof name == 'function' ) {
						app.talk( 'event/'+ cidn +'/offering', name )
					} else if( typeof name == 'string' ) {
						return {
							price: function( fcb ) {
								app.talk( 'event/'+ cidn +'/offering/'+ name +'/price', fcb )
							}
						}
					}
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
