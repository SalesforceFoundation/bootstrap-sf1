module.exports = function(grunt) {

  var vendor = grunt.file.readJSON('.bowerrc').directory;
  var helpers = require('handlebars-helpers');
  var mapping = grunt.file.readYAML('templates/_data/mapping.yml');
  var generateIconsData = require('./grunt/generate-icons.js');
  grunt.initConfig({

    // Project metadata
    pkg: grunt.file.readJSON('package.json'),
    site: grunt.file.readYAML('_config.yml'),
    vendor: vendor,

    bowerDirectory: require('bower').config.directory,
    less: {
      options: {
        compress: false,
        paths: ['less', 'tmp', '<%= bowerDirectory %>/bootstrap/less']
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
        tasks: ['copy', 'less:compile', 'less:namespaced', 'clean:tmp'],
        options: {
          livereload: true
        }
      },
      icons: {
        files: ['less/s1-icons.less'],
        tasks: ['build-icons-data', 'copy', 'less:compile', 'clean:tmp', 'assemble'],
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
            cwd: '<%= bowerDirectory %>/bootstrap/less',
            src: ['bootstrap.less'],
            dest: 'tmp/'
          }, {
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
            src: ['**/*_120.png'],
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
      }
    },
    clean: {
      tmp: ['tmp'],
      pages: ['pages']
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

  grunt.registerTask('build-icons-data', function () { generateIconsData.call(this, grunt, mapping); });
  
  grunt.registerTask('default', ['copy', 'less:compile', 'less:namespaced', 'recess', 'cssmin', 'clean:pages', 'build-icons-data', 'assemble', 'clean:tmp']);
  grunt.registerTask('serve', ['connect', 'watch']);
};