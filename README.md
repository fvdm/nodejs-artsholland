nodejs-artsholland
==================

Unofficial API module for Arts Holland

Docs: <http://dev.artsholland.com/documentation/restapi>


# Usage


## event ( callback )

Lists and describes all events.

```js
app.event( console.log )
```


## event ( cidn, callback )

Describe event with `cidn`.

```js
app.event( 123, console.log )
```

## event ( cidn )

Returns an object with the following functions:

### event().venue( callback )

Lists and describes all venues in which event with `cidn` takes place.

```js
app.event( 123 ).venue( console.log )
```
