'use strict';

/*
 * Express Dependencies
 */
var express = require('express');
var app = express();
var port = 3000;

/*
 * Use Handlebars for templating
 */
var exphbs = require('express3-handlebars');

// For gzip compression
app.use(express.compress());
app.use(express.bodyParser());
app.use(express.query());

/*
 * Config for Production and Development
 */
if (process.env.NODE_ENV === 'production') {
  // Set the default layout and locate layouts and partials
  app.engine('handlebars', exphbs({
    defaultLayout: 'main',
    layoutsDir: 'dist/views/layouts/',
    partialsDir: 'dist/views/partials/'
  }));

  // Locate the views
  app.set('views', __dirname + '/dist/views');

  // Locate the assets
  app.use(express.static(__dirname + '/dist/assets'));

} else {
  app.engine('handlebars', exphbs({
    // Default Layout and locate layouts and partials
    defaultLayout: 'main',
    layoutsDir: 'views/layouts/',
    partialsDir: 'views/partials/'
  }));

  // Locate the views
  app.set('views', __dirname + '/views');

  // Locate the assets
  app.use(express.static(__dirname + '/assets'));
}

// Set Handlebars
app.set('view engine', 'handlebars');


/*
 * Routes
 */
// Index Page
app.get('/', function (request, response) {
  response.render('index');
});

app.post('/prequeue', function (req, res) {
  setTimeout(function () {
    var body = req.body || {};
    body.chat = body.chat || {};
    body.chat.person = body.chat.person || {};
    body.chat.person.contact = body.chat.person.contact || {};
    body.chat.person.contact.name = body.chat.person.contact.name || {first: 'Bob'};
    var zip = body.chat.person.contact.zip;
    var name = body.chat.person.contact.name;

    var response;

    if (zip && zip.toString().length === 5 && name.first === 'James') {
      response = {
        decision: {
          strategy: 'default',
          message: 'queue chat'
        }
      };
    } else {
      response = {
        decision: {
          strategy: 'none',
          message: 'custom_noservice'
        }
      };
    }
    console.log(JSON.stringify(body));
    console.log(response);
    res.send(response);
  }, 1000);
});


/*
 * Start it up
 */
app.listen(process.env.PORT || port);
console.log('Express started on port ' + port);