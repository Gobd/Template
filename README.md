## You will need the following global npm packages

`npm install -g npm-check-updates bower gulp gulp-cli mocha stylus jeet`

## Next, in the project directory:

`ncu -u`
which will check for package.json updates and update the package.json dependencies with newer versions

`ncu -m bower`
which will check for bower.json updates and update the bower.json dependencies with newer versions

## Lastly, still in the project directory:

`npm install`
to install all of the updated dependencies

`bower install`
to install all of the updated dependencies

### The proceeding sets of commands, `ncu`, `npm install`, and `bower install` should be run regularly but make sure you've committed and pushed to Github first

They will update all packge.json and bower.json dependencies which may break the project you're working on. This should be done often for security because of packages like express and passport and whatever else could pose a security risk.

## This template includes testing the backend with mocha using chai and chai-http

Check out the tests folder at /server/tests and write some tests, I've included some tests although they won't pass since the functions they're testing don't exist, but it's a nice example. If you'd like to write your own tests check out the docs for [Mocha](https://mochajs.org/), [Chai](http://chaijs.com/), and [Chai-HTTP](https://github.com/chaijs/chai-http).

If you're not using tests remove the gulp-mocha task from gulp and delete the tests folder. Also feel free to remove the mocha, chai, and chai-http dependencies from the packages.json files and you global npm install.

## I've included Lodash and Bluebird in the endpoints file

I like to replace the Mongoose Promises with [Bluebird Promise](http://bluebirdjs.com/docs/api-reference.html) because they have many useful features that Mongoose Promises lack. Also, [Lodash](https://lodash.com/docs) has tons of useful functions that are faster than the built in function like forEach that would be good to use instead of the built ins, check the API for anything you're having trouble with and maybe there is something that would make it easier.

## I've included Stylus and Jeet as CSS replacements

Stylus lets you write less, and Jeet is a flexible grid system. There is also Autoprefixer so make sure you're not writing any prefixes in you css.

### If you feel like the project could use anything else, make a pull request

This is a template I made so I don't have to set up gulp, testing, file structure, npm, bower, etc. every time I start a project. If you think anything could be done better or is missing please make a pull request or send me an email.
