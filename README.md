[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][downloads-url]
[![Maintainability](https://api.codeclimate.com/v1/badges/e1c1668046beb46afcb4/maintainability)](https://codeclimate.com/github/getsimpleadmin/simpleadmin-nodejs/maintainability)


# [SimpleAdmin](http://getsimpleadmin.com)

SimpleAdmin provides builder for administrative dashboards, it's fit for Web / Mobile / API. Cloud or your own servers, depends on your choice and requirements.

All common admin dashboard tasks like content create / update / delete operations, charts, invite colleagues.

[Example Application][demo]

## Installation

![simple_admin](https://getsimpleadmin.com/assets/demo-b3f2234a3a7b9a269e0d12febc0e4fe45c4150457b98affa50d2ff9dbe3460c2.jpg)

Install SimpleAdmin to your application:

```javascript
npm install simpleadmin --save
```

## Configuration

Call method `mount` to mount simpleadmin built-in routes:

```javascript
// server.js
const simpleadmin = require('simpleadmin');
let mountAt = '/simpleadmin';

simpleadmin.mount(serverInstance, databaseConnection, mountAt);
```

Set environment variable to protect your data

```javascript
process.env.SIMPLE_ADMIN_SECRET_KEY = 'YOU_SECRET_KEY'
```

## Contributing

Bug reports and pull requests are welcome on GitHub at https://github.com/getsimpleadmin/simpleadmin-nodejs.

## License

The gem is available as open source under the terms of the [MIT License](http://opensource.org/licenses/MIT).

[demo]: https://getsimpleadmin.com/demo/admin/customer/resources

[npm-image]: https://img.shields.io/npm/v/simpleadmin.svg
[npm-url]: https://npmjs.org/package/simpleadmin

[downloads-image]: https://img.shields.io/npm/dm/simpleadmin.svg
[downloads-url]: https://npmjs.org/package/simpleadmin
