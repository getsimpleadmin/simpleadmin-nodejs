# [SimpleAdmin](http://getsimpleadmin.com)

SimpleAdmin is a service for people with no special skills that enables a simple change of interface and decrease of your costs on a webpage development.

You do not need to waste your time on development and technical support. The Simple Admin team will help you pay focus on the key thing – your Product.

This is small API library to connect your application with SimpleAdmin service.

[Example Application][demo]

## Installation

![simple_admin](https://getsimpleadmin.com/assets/browser-60e23472a81b90d1de2caf52e02b982cba4d1db4215626352476670deed9dd25.png)

Install SimpleAdmin to your application:

```javascript
npm install simpleadmin
```

**NOTE**: If you want to test your local project you'll needing to install [ngrok][ngrok] and run following command:
```ruby
./ngrok http 3000
```

Copy your Forwadding URL (http://exampleapp.ngrok.io) and use it when you will be creating a project (column url).

## Configuration

Call method `mountSimpleAdmin` to mount simpleadmin built-in routes:

```javascript
// server.js
simpleAdmin.mountSimpleAdmin(server, db)
```

Set environment variable to protect your data

```javascript
process.env.SIMPLE_ADMIN_SECRET_KEY = 'YOU_SECRET_KEY'
```

## Contributing

Bug reports and pull requests are welcome on GitHub at https://github.com/getsimpleadmin/simpleadmin-nodejs.

## License

The gem is available as open source under the terms of the [MIT License](http://opensource.org/licenses/MIT).

[demo]: https://getsimpleadmin.com/en/demo/admin/resources?model_klass_name=Post
[ngrok]: https://ngrok.com/
