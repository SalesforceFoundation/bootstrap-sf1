## Introduction

_**If you haven't seen it already, please check out the [Lightning Design System](https://www.lightningdesignsystem.com) as it may be more appropriate for your project.**_

This is a Bootstrap based theme developed by the Salesforce.com Foundation's Business Applications team. The aim is to provide a solid and complete theme for Bootstrap that matches the [SFDC Salesforce1 styleguide][sfdc-styles]. More information about the contents of this theme is available at the [Bootstrap-sf1 companion site][bootstrap-sf1].

The general look and feel is inspired by the [SFDC Styleguide][sfdc-styles]. There is some intention of building theme variations for different application contexts (visualforce, salesforce1, chatter), but this work has not been done at this time.

The Proxima Nova Soft fonts are not included in this repository. To match the SFDC styles you will need to include this font in your page.

## Getting Started

To use the theme you just need to include the `dist/` folder in your project and include `bootstrap.css` or `bootstrap.min.css` in your page. For use inside of a VisualForce page or Lightning Component you may need to use the namespaced CSS in `bootstrap-namespaced.css`.

You can download the theme using bower:

    bower install bootstrap-sf1

Or you can [download the zip][download].

## Development

You will need:

* Git
* [Node][node-download]
* [Bower][bower]
* [Grunt][grunt]

Things never to do:

* Edit any CSS files in `dist/` directly
* Edit any html page in `pages/` or the `index.html` file directly
* Edit any less file in the `less/generated` folder directly

These files are generated automatically and your changes will be overwritten. You have been warned.  :)

First clone the repo and navigate into the directory:

    git clone https://github.com/SalesforceFoundation/bootstrap-sf1.git
    cd bootstrap-sf1

Next

    npm install
    bower install

There are a number of files that are generated for you as you make changes to the less files. To facilitate this process start the grunt watch machinery with:

    grunt serve

This will also start up a local webserver at http://localhost:8000. As you edit Less files or templates Grunt will automatically compile the CSS and HTML for the docs so long as you have `grunt serve` running.

[sfdc-styles]: http://sfdc-styleguide.herokuapp.com/
[bootstrap-sf1]: http://developer.salesforcefoundation.org/bootstrap-sf1/index.html
[download]: https://github.com/SalesforceFoundation/bootstrap-sf1/archive/v0.1.0-beta.5.zip
[node-download]: http://nodejs.org/download/
[grunt]: http://gruntjs.com
[bower]: http://bower.io
