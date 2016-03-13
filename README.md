# Make sure you've committed and pushed to Github first

This will update all packge.json and bower.json dependencies which may break the project you're working on. This should be done often for security because of packages like express and passport and whatever else could pose a security risk.

## You will need the following global npm packages

`npm install -g npm-check-updates bower gulp gulp-cli mocha stylus`

## Next , in the project directory:

`ncu -u`
which will check for package.json updates and update the package.json dependencies with newer versions

`ncu -m bower`
which will check for bower.json updates and update the bower.json dependencies with newer versions

## Lastly, still in the project directory:

`npm install`
to install all of the updated dependencies

`bower install`
to install all of the updated dependencies

## This template includes testing the backed with mocha using chai and chai-http

Check out the tests folder at /server/tests and write some tests, I've included some (that won't work, but it's a nice example). If you'd like to write your own tests check out the docs for [Mocha](https://mochajs.org/), [Chai](http://chaijs.com/), and [Chai-HTTP](https://github.com/chaijs/chai-http).

If you're not using tests remove the gulp-mocha task from gulp and delete the tests folder. Also feel free to remove the mocha, chai, and chai-http dependencies from the packages.json files and you global npm install.

## You'll notice an override in the bower.json file

This is for files that are server specific like [Bluebird Promise](http://bluebirdjs.com/docs/api-reference.html). I like to replace the Mongoose Promises with [Bluebird Promise](http://bluebirdjs.com/docs/api-reference.html) because they have many useful features that Mongoose Promises lack. If you install any dependencies with bower that are server specific be sure to add overrides for them so they won't be concatenated to your lib.min.js files in the /dist folder. 

### If you feel like the project could use anything else, make a pull request

This is a template I made so I don't have to set up gulp, testing, file structure, npm, bower, etc. every time I start a project. If you think anything could be done better or is missing please make a pull request or send me an email.
