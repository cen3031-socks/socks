'use strict';

(function() {
	// Volunteers Controller Spec
	describe('Volunteers Controller Tests', function() {
		// Initialize global variables
		var VolunteersController,
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

			// Initialize the Volunteers controller.
			VolunteersController = $controller('VolunteersController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Volunteer object fetched from XHR', inject(function(Volunteers) {
			// Create sample Volunteer using the Volunteers service
			var sampleVolunteer = new Volunteers({
				name: 'New Volunteer'
			});

			// Create a sample Volunteers array that includes the new Volunteer
			var sampleVolunteers = [sampleVolunteer];

			// Set GET response
			$httpBackend.expectGET('volunteers').respond(sampleVolunteers);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.volunteers).toEqualData(sampleVolunteers);
		}));

		it('$scope.findOne() should create an array with one Volunteer object fetched from XHR using a volunteerId URL parameter', inject(function(Volunteers) {
			// Define a sample Volunteer object
			var sampleVolunteer = new Volunteers({
				name: 'New Volunteer'
			});

			// Set the URL parameter
			$stateParams.volunteerId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/volunteers\/([0-9a-fA-F]{24})$/).respond(sampleVolunteer);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.volunteer).toEqualData(sampleVolunteer);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Volunteers) {
			// Create a sample Volunteer object
			var sampleVolunteerPostData = new Volunteers({
				name: 'New Volunteer'
			});

			// Create a sample Volunteer response
			var sampleVolunteerResponse = new Volunteers({
				_id: '525cf20451979dea2c000001',
				name: 'New Volunteer'
			});

			// Fixture mock form input values
			scope.name = 'New Volunteer';

			// Set POST response
			$httpBackend.expectPOST('volunteers', sampleVolunteerPostData).respond(sampleVolunteerResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Volunteer was created
			expect($location.path()).toBe('/volunteers/' + sampleVolunteerResponse._id);
		}));

		it('$scope.update() should update a valid Volunteer', inject(function(Volunteers) {
			// Define a sample Volunteer put data
			var sampleVolunteerPutData = new Volunteers({
				_id: '525cf20451979dea2c000001',
				name: 'New Volunteer'
			});

			// Mock Volunteer in scope
			scope.volunteer = sampleVolunteerPutData;

			// Set PUT response
			$httpBackend.expectPUT(/volunteers\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/volunteers/' + sampleVolunteerPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid volunteerId and remove the Volunteer from the scope', inject(function(Volunteers) {
			// Create new Volunteer object
			var sampleVolunteer = new Volunteers({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Volunteers array and include the Volunteer
			scope.volunteers = [sampleVolunteer];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/volunteers\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleVolunteer);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.volunteers.length).toBe(0);
		}));
	});
}());