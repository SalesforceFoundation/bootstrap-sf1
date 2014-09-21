/*!
 * By Ryan Foster at Salesforce.org
 *
 */
'use strict';
var fs = require('fs');

module.exports = function generateIcons(grunt, mapping) {
  // Pass encoding, utf8, so `readFileSync` will return a string instead of a
  // buffer
  var iconsFile = fs.readFileSync('less/s1-icons.less', 'utf8');
  var iconsLines = iconsFile.split('\n');
  var iconsData = '# This file is generated via Grunt task. **Do not edit directly.**\n' +
                       '# See the \'build-icons-data\' task in Gruntfile.js.\n\nstandard:\n';

  var cardContextFile = 'less/generated/contexts.less'
  var cardContextData = '/* This file is generated via Grunt task. **Do not edit directly.** */\n';

  var iconsYml = 'templates/_data/icons.yml';

  // Build standard icon list
  // Use any line that starts with ".s1icon-s-" and capture the class name
  var iconClassName = /^\.(s1icon-s-[^\s]+)/;
  for (var i = 0, len = iconsLines.length; i < len; i++) {
    var match = iconsLines[i].match(iconClassName);

    if (match !== null) {
      iconsData += '- ' + match[1] + '\n';

      var contextName = match[1].replace('s1icon-s-', '');
      // cards
      cardContextData += '.card { \n  &.context-'+contextName+', .context-'+contextName+' > & { \n    .card-context-mixin(); \n    .card-heading:after { \n      .'+match[1]+'; \n    } \n  } \n} \n';
      // page header
      cardContextData += '.page-header.context-'+contextName+' {\n  h1:before {\n    .s1icon-s-'+contextName+';\n  }\n}\n';
    }
  }

  // Build custom icon list
  // Use any line that starts with ".s1icon-c-" and capture the class name
  iconsData += 'custom:\n';
  iconClassName = /^\.(s1icon-c-[^\s]+)/;
  for (i = 0, len = iconsLines.length; i < len; i++) {
    var match = iconsLines[i].match(iconClassName);

    if (match !== null) {
      iconsData += '- ' + match[1] + '\n';
    }
  }

  // Build utility icon list
  iconsData += 'utility:\n';
  iconClassName = /^\.@{utility-font-prefix}([a-z\-]+)/;
  for (i = 0, len = iconsLines.length; i < len; i++) {
    var match = iconsLines[i].match(iconClassName);

    if (match !== null) {
      iconsData += '- s1utility-' + match[1] + '\n';
    }
  }

  // Build custom mapped styles
  //
  var mappedData;
  var mappedFile;
  if (mapping) {
    mappedData = '/* This file is generated via Grunt task. **Do not edit directly.** */\n';
    mappedFile = 'less/generated/custom-icon-mapping.less';
    iconClassName = /^\.(s1icon-c-[^\s]+)/;
    iconsData += 'mapped:\n';
    for (i = 0, len = iconsLines.length; i < len; i++) {
      var match = iconsLines[i].match(iconClassName);

      if (match !== null) {
        for (var j = 0, map_len = mapping.length; j < map_len; j++) {
          if (mapping[j][0] == match[1]) {
            mappedData += '.s1icon-c-' + mapping[j][1] + ' { .' + match[1] + '; }\n';
            iconsData += '- s1icon-c-' + mapping[j][1] + '\n';
            // cards
            cardContextData += '.card { \n  &.context-c-'+ mapping[j][1] +', .context-c-'+mapping[j][1]+' > & { \n    .card-context-mixin(); \n    .card-heading:after { \n      .s1icon-c-'+mapping[j][1]+'; \n    } \n  } \n} \n';
            // page header
            cardContextData += '.page-header.context-c-'+mapping[j][1]+' {\n  h1:before {\n    .s1icon-c-'+mapping[j][1]+';\n  }\n}\n';
          }
        }
      }
    }
    try {
      fs.writeFileSync(mappedFile, mappedData);
    }
    catch (err) {
      grunt.fail.warn(err);
    }
    grunt.log.writeln('File ' + mappedFile.cyan + ' created.');
  }

  // Create the `_data` directory if it doesn't already exist
  if (!fs.existsSync('templates/_data')) {
    fs.mkdirSync('templates/_data');
  }

  // Write the card-contexts file
  try {
    fs.writeFileSync(cardContextFile, cardContextData);
  }
  catch (err) {
    grunt.fail.warn(err);
  }
  grunt.log.writeln('File ' + cardContextFile.cyan + ' created.');

  // write the icons data
  try {
    fs.writeFileSync(iconsYml, iconsData);
  }
  catch (err) {
    grunt.fail.warn(err);
  }
  grunt.log.writeln('File ' + iconsYml.cyan + ' created.');
};
