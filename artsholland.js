var http = require('http'),
    querystring = require('querystring')

var app = {

	api: {
		host:	'api.artsholland.com',
		path:	'/rest/',
		key:	''
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