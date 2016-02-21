# Udacity FEND Project 5a: Neighborhood Map

Map-checklist of diners in Sunnyvale downtown. Find where to go for lunch today, get details from Yelp and keep track of placed you've been to.

Google Maps API, Google Places API JavaScript, Yelp API.
Knockout JS, JQuery, OAuth JS, Bootstrap.

## How to run

The project is deployed on GitHub Pages: http://falkoner.github.io/udacity-fend-p5-neighborhood-map/

If you want to run it locally, you have multiple options. Make sure to install all dependencies:

  $ npm install

After that use following command to 1) build code, 2) start server simulation via BrowserSync and 3) open application in Chrome

  $ npm install

## Development

All source files are located in __./source__ directory. When you run __gulp build__ or __gulp build_dev__ all source files are processed (minified, optimized etc) and copied to __./dest__ directory. The difference will be that when you develop, you don't want to have sources minified, so __gulp serve__ uses __gulp build_dev__ as dependency.

You should be able to open __./dest/index.html__ directly to see the app. To make JavaScript load resources without problems, open this file on local [python for ex.] server.
