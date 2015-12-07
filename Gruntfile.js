module.exports = function(grunt) {

  var vendor = grunt.file.readJSON('.bowerrc').directory;
  var helpers = require('handlebars-helpers');
  var mapping = grunt.file.readYAML('templates/_data/mapping.yml');
  var generateIconsData = require('./grunt/generate-icons.js');
  var terminal = require('child_process').exec;
  var fs = require('fs');
  var theo = require('theo');

  grunt.initConfig({

    // Project metadata
    pkg: grunt.file.readJSON('package.json'),
    site: grunt.file.readYAML('_config.yml'),
    vendor: vendor,

    bowerDirectory: require('bower').config.directory,
    less: {
      options: {
        compress: false,
        paths: ['less', 'bower_components/bootstrap/less']
      },
      compile: {
        files: {
          'dist/css/bootstrap.css': ['less/theme.less'],
          'dist/css/docs.css': ['less/docs.less']
        }
      },
      namespaced: {
        files: {
          'dist/css/bootstrap-namespaced.css': ['less/namespaced.less'],
        }
      }
    },
    recess: {
      dist: {
        options: {
          compile: true
        },
        files: {
          'dist/css/bootstrap.css': ['dist/css/bootstrap.css']
        }
      }
    },
    watch: {
      less: {
        files: ['less/*.less', '!less/s1-icons.less', '!less/mapped.less'],
        tasks: ['less:compile', 'less:namespaced'],
        options: {
          livereload: true
        }
      },
      icons: {
        files: ['less/s1-icons.less'],
        tasks: ['icons', 'assemble'],
        options: {
          livereload: true
        }
      },
      cssmin: {
        files: ['dist/css/bootstrap.css'],
        tasks: ['cssmin:minify']
      },
      assemble: {
        files: ['templates/**/*.hbs'],
        tasks: ['assemble']
      },
      readme: {
        files: ['README.md'],
        tasks: ['assemble']
      }
    },
    cssmin: {
      minify: {
        expand: true,
        cwd: 'dist/css',
        src: ['*.css', '!*.min.css'],
        dest: 'dist/css',
        ext: '.min.css'
      }
    },
    connect: {
      serve: {
        options: {
          port: grunt.option('port') || '8000',
          hostname: grunt.option('host') || 'localhost'
        }
      }
    },
    assemble: {
      pages: {
        options: {
          flatten: true,
          assets: '<%= site.assets %>',
          data: '<%= site.data %>/*.{json,yml}',

          // Metadata
          site: '<%= site %>',

          // Templates
          partials: '<%= site.partials %>',
          layoutdir: '<%= site.layouts %>',
          layout: '<%= site.layout %>',
        },
        files: {
          'index.html': ['templates/index.hbs'],
          'pages/': ['templates/*.hbs', '!templates/index.hbs']
        }
      }
    },
    copy: {
      bootstrap: {
        files: [
          {
            expand: true,
            cwd: '<%= bowerDirectory %>/bootstrap/fonts',
            src: ['*'],
            dest: 'dist/fonts'
          }
        ]
      },
      icons: {
        files: [
          {
            expand: true,
            cwd: 'icons',
            src: ['**/*.svg'],
            dest: 'dist/icons'
          }
        ]
      },
      fonts: {
        files: [
          {
            expand: true,
            cwd: 'fonts',
            src: ['ProximaNovaSoft-Medium.ttf', 'ProximaNovaSoft-Regular.ttf', 'icon-utility.*'],
            dest: 'dist/fonts'
          }
        ]
      },
      s1less: {
        files: [{
          expand: true,
          cwd: 'tmp',
          src: ['*.less'],
          dest: 'less/generated'
        }]
      }
    },
    clean: {
      tmp: ['tmp'],
      pages: ['pages']
    },

    bump: {
      options: {
        files: ['package.json', 'bower.json'],
        commit: false,
        push: false,
        createTag: false
      }
    }
  });
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-recess');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-text-replace');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('assemble');
  grunt.loadNpmTasks('grunt-bump');

  grunt.registerTask('build-icons-data', function () { generateIconsData.call(this, grunt, mapping); });

  grunt.registerTask('clone-s1vars', function() {
    fs.mkdir('tmp');
    theo.batch(['Less'], './node_modules/design-properties/variables', 'tmp')
  });

  grunt.registerTask('s1variables', ['clone-s1vars', 'copy:s1less', 'clean:tmp']);
  grunt.registerTask('icons', ['build-icons-data', 'copy', 'less:compile'])
  
  grunt.registerTask('default', ['s1variables', 'copy:bootstrap', 'copy:icons', 'copy:fonts', 'less:compile', 'less:namespaced', 'recess', 'cssmin', 'clean:pages', 'icons', 'assemble']);
  grunt.registerTask('serve', ['connect', 'watch']);

  grunt.registerTask('bump:gen', ['bump', 'assemble:pages']);
};