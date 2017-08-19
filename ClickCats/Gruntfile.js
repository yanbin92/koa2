//Grunt is a command line tool — I’m just a designer
//Remember Grunt is a task runner.
module.exports = function(grunt) {

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
                src: ['**/*.{png,jpg,gif}'],
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
    }   

  });
    grunt.loadNpmTasks('grunt-contrib-concat');

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-imagemin');

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.registerTask('default', ['concat','uglify','imagemin','watch','sass']);

};