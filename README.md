# Template

#H1 Make sure you've committed and pushed to Github first

This will update all packge.json and bower.json dependencies which may break the project you're working on. This should be done often for security because of packages like express and passport and whatever else could pose a security risk.

#H2 Install npm-check-updates globally
`npm install -g npm-check-updates`

#H2 Next , in the project directory:

`ncu -u`
which will check for package.json updates and update the package.json dependencies with newer versions

`ncu -m bower`
which will check for bower.json updates and update the bower.json dependencies with newer versions

#H2 Lastly, still in the project directory:

`npm install`
to install all of the updated dependencies

`bower install`
to install all of the updated dependencies

#H3 If you feel like the project could use anything else, make a pull request

This is a template I made so I don't have to set up gulp, testing, file structure, npm, bower, etc. every time I start a project. If you think anything could be done better or is missing please make a pull request or send me an email.
