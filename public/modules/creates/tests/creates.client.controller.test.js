'use strict';

(function() {
	// Creates Controller Spec
	describe('Creates Controller Tests', function() {
		// Initialize global variables
		var CreatesController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Creates controller.
			CreatesController = $controller('CreatesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Create object fetched from XHR', inject(function(Creates) {
			// Create sample Create using the Creates service
			var sampleCreate = new Creates({
				name: 'New Create'
			});

			// Create a sample Creates array that includes the new Create
			var sampleCreates = [sampleCreate];

			// Set GET response
			$httpBackend.expectGET('creates').respond(sampleCreates);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.creates).toEqualData(sampleCreates);
		}));

		it('$scope.findOne() should create an array with one Create object fetched from XHR using a createId URL parameter', inject(function(Creates) {
			// Define a sample Create object
			var sampleCreate = new Creates({
				name: 'New Create'
			});

			// Set the URL parameter
			$stateParams.createId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/creates\/([0-9a-fA-F]{24})$/).respond(sampleCreate);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.create).toEqualData(sampleCreate);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Creates) {
			// Create a sample Create object
			var sampleCreatePostData = new Creates({
				name: 'New Create'
			});

			// Create a sample Create response
			var sampleCreateResponse = new Creates({
				_id: '525cf20451979dea2c000001',
				name: 'New Create'
			});

			// Fixture mock form input values
			scope.name = 'New Create';

			// Set POST response
			$httpBackend.expectPOST('creates', sampleCreatePostData).respond(sampleCreateResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Create was created
			expect($location.path()).toBe('/creates/' + sampleCreateResponse._id);
		}));

		it('$scope.update() should update a valid Create', inject(function(Creates) {
			// Define a sample Create put data
			var sampleCreatePutData = new Creates({
				_id: '525cf20451979dea2c000001',
				name: 'New Create'
			});

			// Mock Create in scope
			scope.create = sampleCreatePutData;

			// Set PUT response
			$httpBackend.expectPUT(/creates\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/creates/' + sampleCreatePutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid createId and remove the Create from the scope', inject(function(Creates) {
			// Create new Create object
			var sampleCreate = new Creates({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Creates array and include the Create
			scope.creates = [sampleCreate];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/creates\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleCreate);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.creates.length).toBe(0);
		}));
	});
}());