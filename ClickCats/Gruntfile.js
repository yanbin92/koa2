//Grunt is a command line tool — I’m just a designer
//Remember Grunt is a task runner.


module.exports = function(grunt) {

    require('load-grunt-tasks')(grunt);
  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat:{
        dist:{
            src: [
                'js/libs/*.js', // All JS in the libs folder
                'js/cat.js'  // This specific file
            ],
            dest: 'js/build/production.js'
        }
    },
    uglify: {
        build: {
            src: 'js/build/production.js',
            dest: 'js/build/production.min.js'
        }
    },
    imagemin: {
        dynamic: {
            files: [{
                expand: true,
                cwd: 'images/',
                src: ['*.{png,jpg,gif}'],
                dest: 'images/build/'
            }]
        }
    },
    watch:{
        //chrome 添加插件 livereload 页面修改不需要手动刷新
        options: {
            livereload: true,
        },
        scripts: {
                files: ['js/*.js'],
                tasks: ['concat', 'uglify'],
                options: {
                    spawn: false,
                },
            },
        css: {
            files: ['css/*.scss'],
            tasks: ['sass'],
            options: {
                spawn: false,
            }
        },
     
        images: {
            expand: true,
            files: 'images/build/*.{jpg,gif,png}',
            tasks: 'responsive_images'
      }

    },
    sass: {
        dist: {
            options: {
                style: 'compressed'
            },
            files: {
                'css/build/global.css': 'css/*.scss'
            }
        } 
    },
     responsive_images: {
        dev: {
            options: {
                sizes: [{
                            name: 'small',
                            width: 320,
                            height: 240
                        },{
                            name: 'medium',
                            width: 640
                        },{
                            name: "large",
                            width: 1024,
                            separator: "-",
                            suffix: "_x2",
                            quality: 60
                        }]
            },
            files: [{
                expand: true,
                cwd: 'images/build',
                src: ['*.{gif,jpg,png}'],
                dest: 'dist/'
                }]

        }
    }
    ,
    // respimg: {
    //     nooptim: {
    //         options: {
    //             optimize: false
    //         },
    //         files: [{
    //             expand: true,
    //             cwd: 'path/to/input',
    //             src: ['raster/**.{jpg,gif,png,svg,pdf}'],
    //             dest: 'path/to/output'
    //         }]
    //     }
    // },
    pagespeed: {
        options: {
            nokey: true,
            url: "https://developers.google.com"
        },
        prod: {
            options: {
            url: "https://developers.google.com/speed/docs/insights/v1/getting_started",
            locale: "en_GB",
            strategy: "desktop",
            threshold: 80
            }
        },
        paths: {
            options: {
            paths: ["/speed/docs/insights/v1/getting_started", "/speed/docs/about"],
            locale: "en_GB",
            strategy: "desktop",
            threshold: 80
            }
        }
    }

  });
    grunt.loadNpmTasks('grunt-contrib-concat');

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-imagemin');

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-responsive-images');
    grunt.loadNpmTasks('grunt-pagespeed');

    /**
     * watch 必须放在最后
     */
    grunt.registerTask('default', ['concat','uglify',
    'imagemin','sass','responsive_images','watch'
    ]);

};