'use strict';
var mongoose   = require('mongoose');
module.exports = function(grunt) {
	// Unified Watch Object
	var watchFiles = {
		serverViews: ['app/views/**/*.*'],
		serverJS: ['gruntfile.js', 'server.js', 'config/**/*.js', 'app/**/*.js', '!app/tests/'],
		clientViews: ['public/modules/**/views/**/*.html'],
		clientJS: ['public/js/*.js', 'public/modules/**/*.js'],
		clientCSS: ['public/modules/**/*.css'],
		mochaTests: ['app/tests/**/*.js']
	};

	grunt.loadNpmTasks('grunt-githooks');
	grunt.loadNpmTasks('grunt-auto-install');

	// Project Configuration
	grunt.initConfig({
		auto_install: { local: {} },
		githooks: {
			all: {
				'pre-commit': 'jshint test:client test:server',
				// any time we check out a new branch, make sure we've got the right dependencies
				'post-checkout': 'auto_install',
				'post-merge': 'auto_install'
			}
		},
		pkg: grunt.file.readJSON('package.json'),
		watch: {
			serverViews: {
				files: watchFiles.serverViews,
				options: {
					livereload: true
				}
			},
			serverJS: {
				files: watchFiles.serverJS,
				tasks: ['jshint'],
				options: {
					livereload: true
				}
			},
			clientViews: {
				files: watchFiles.clientViews,
				options: {
					livereload: true
				}
			},
			clientJS: {
				files: watchFiles.clientJS,
				tasks: ['jshint'],
				options: {
					livereload: true
				}
			},
			clientCSS: {
				files: watchFiles.clientCSS,
				tasks: ['csslint'],
				options: {
					livereload: true
				}
			},
			mochaTests: {
				files: watchFiles.mochaTests,
				tasks: ['test:server'],
			}
		},
		jshint: {
			all: {
				src: watchFiles.clientJS.concat(watchFiles.serverJS),
				options: {
					jshintrc: true
				}
			}
		},
		csslint: {
			options: {
				csslintrc: '.csslintrc'
			},
			all: {
				src: watchFiles.clientCSS
			}
		},
		uglify: {
			production: {
				options: {
					mangle: false
				},
				files: {
					'public/dist/application.min.js': 'public/dist/application.js'
				}
			}
		},
		cssmin: {
			combine: {
				files: {
					'public/dist/application.min.css': '<%= applicationCSSFiles %>'
				}
			}
		},
		nodemon: {
			dev: {
				script: 'server.js',
				options: {
					nodeArgs: ['--debug'],
					ext: 'js,html',
					watch: watchFiles.serverViews.concat(watchFiles.serverJS)
				}
			}
		},
		'node-inspector': {
			custom: {
				options: {
					'web-port': 1337,
					'web-host': 'localhost',
					'debug-port': 5858,
					'save-live-edit': true,
					'no-preload': true,
					'stack-trace-limit': 50,
					'hidden': []
				}
			}
		},
		ngAnnotate: {
			production: {
				files: {
					'public/dist/application.js': '<%= applicationJavaScriptFiles %>'
				}
			}
		},
		concurrent: {
			default: ['nodemon', 'watch'],
			debug: ['nodemon', 'watch', 'node-inspector'],
			options: {
				logConcurrentOutput: true,
				limit: 10
			}
		},
		env: {
			test: {
				NODE_ENV: 'test'
			},
			secure: {
				NODE_ENV: 'secure'
			}
		},
		mochaTest: {
			src: watchFiles.mochaTests,
			options: {
				reporter: 'spec',
				require: 'server.js'
			}
		},
		karma: {
			unit: {
				configFile: 'karma.conf.js'
			}
		},
		protractor: {
			options: {
				configFile: 'end-to-end-tests/config.js', // Default config file
				keepAlive: true, // If false, the grunt process stops when the test fails.
				noColor: false, // If true, protractor will not use colors in its output.
				args: {
					// Arguments passed to the command
				}
			},
			all: {   // Grunt requires at least one target to run so you can simply put 'all: {}' here too.
				options: {
					configFile: 'end-to-end-tests/config.js', // Target-specific config file
					args: {} // Target-specific arguments
				}
			},
			cats: {
				options: {
					configFile: 'end-to-end-tests/cats/config.js',
					args: {}
				}
			},
			contacts: {
				options: {
					configFile: 'end-to-end-tests/contacts/config.js',
					args: {}
				}
			},
			volunteers: {
				options: {
					configFile: 'end-to-end-tests/volunteers/config.js',
					args: {}
				}
			}
		},
		shell: {
			mongodb: {
				command: 'mongod --dbpath ./data/db',
				options: {
					async: true,
					stdout: false,
					stderr: true,
					failOnError: true,
					execOptions: {
						cwd: '.'
					}
				}
			},
			'generate-data': {
				command: './generate-data.sh n', 
				options: {
					async: false,
					execOptions: {
						cwd: './scripts/',
						stdout: true,
						stderr: true,
						failOnError: true
					}
				}
			}
		}
	});

	// Load NPM tasks
	require('load-grunt-tasks')(grunt);

	// Making grunt default to force in order not to break the project.
	grunt.option('force', false);

	// A Task for loading the configuration object
	grunt.task.registerTask('loadConfig', 'Task that loads the config into a grunt option.', function() {
		var init = require('./config/init')();
		var config = require('./config/config');

		grunt.config.set('applicationJavaScriptFiles', config.assets.js);
		grunt.config.set('applicationCSSFiles', config.assets.css);
	});

	// Default task(s).
	grunt.registerTask('default', ['githooks', 'lint', 'concurrent:default']);

	// Debug task.
	grunt.registerTask('debug', ['lint', 'concurrent:debug']);

	// Secure task(s).
	grunt.registerTask('secure', ['env:secure', 'lint', 'concurrent:default']);

	// Lint task(s).
	grunt.registerTask('lint', ['jshint', 'csslint']);

	// Build task(s).
	grunt.registerTask('build', ['lint', 'loadConfig', 'ngAnnotate', 'uglify', 'cssmin']);

	// Test task.
	grunt.registerTask('test', ['test:client', 'test:e2e']);
	grunt.registerTask('test:server', ['env:test', 'mochaTest']);
	grunt.registerTask('test:client', ['env:test', 'karma:unit']);
	grunt.registerTask('test:e2e', ['clean-db', 'protractor:all']);
	grunt.registerTask('test:headless', ['force-off', 'test:server', 'test:client']);
	grunt.registerTask('force-off', function() { grunt.option('force', false); });

	grunt.registerTask('generate-data', ['clean-db', 'shell:generate-data']);

	grunt.registerTask('clean-db', 'drop the database', function() {
		var done = this.async();

		mongoose.connection.on('open', function () {
			mongoose.connection.db.executeDbCommand({dropDatabase:1},function(err) {
				if(err) {
					console.log(err);
				} else {
					console.log('Successfully dropped db');
				}
				mongoose.connection.close(done);
			});
		});
		if (mongoose.connection.readyState !== 0) {
			mongoose.connection.close(function() {
				mongoose.connect('mongodb://localhost/mean-dev');
			});
		} else {
			mongoose.connect('mongodb://localhost/mean-dev');
		}
	});
};
