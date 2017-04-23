module.exports = function(grunt) {
  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),

    watch: {
      browserify: {
        files: ["src/**/*.js*"],
        tasks: ["browserify"]
      }
    },

    browserify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
        transform: [
          [
            "babelify",
            {
              presets: ["es2015", "react", "stage-0"]
            }
          ]
        ],
        watch: true,
        keepAlive: true,
        browserifyOptions: {
          extensions: [".js", ".jsx"],
          debug: true,
          insertGlobals: true
        }
      },
      dist: {
        files: {
          "client/public/bundle.js": ["client/src/**/*.js*"]
        }
      }
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks("grunt-browserify");
  grunt.loadNpmTasks("grunt-contrib-watch");

  // Default task(s).
  grunt.registerTask("default", ["browserify"]);
};
