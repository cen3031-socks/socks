'use strict';

(function() {
	// Donations Controller Spec
	describe('Donations Controller Tests', function() {
		// Initialize global variables
		var DonationsController,
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

			// Initialize the Donations controller.
			DonationsController = $controller('DonationsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Donation object fetched from XHR', inject(function(Donations) {
			// Create sample Donation using the Donations service
			var sampleDonation = new Donations({
				name: 'New Donation'
			});

			// Create a sample Donations array that includes the new Donation
			var sampleDonations = [sampleDonation];

			// Set GET response
			$httpBackend.expectGET('donations').respond(sampleDonations);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.donations).toEqualData(sampleDonations);
		}));

		it('$scope.findOne() should create an array with one Donation object fetched from XHR using a donationId URL parameter', inject(function(Donations) {
			// Define a sample Donation object
			var sampleDonation = new Donations({
				name: 'New Donation'
			});

			// Set the URL parameter
			$stateParams.donationId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/donations\/([0-9a-fA-F]{24})$/).respond(sampleDonation);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.donation).toEqualData(sampleDonation);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Donations) {
			// Create a sample Donation object
			var sampleDonationPostData = new Donations({
				name: 'New Donation'
			});

			// Create a sample Donation response
			var sampleDonationResponse = new Donations({
				_id: '525cf20451979dea2c000001',
				name: 'New Donation'
			});

			// Fixture mock form input values
			scope.name = 'New Donation';

			// Set POST response
			$httpBackend.expectPOST('donations', sampleDonationPostData).respond(sampleDonationResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Donation was created
			expect($location.path()).toBe('/donations/' + sampleDonationResponse._id);
		}));

		it('$scope.update() should update a valid Donation', inject(function(Donations) {
			// Define a sample Donation put data
			var sampleDonationPutData = new Donations({
				_id: '525cf20451979dea2c000001',
				name: 'New Donation'
			});

			// Mock Donation in scope
			scope.donation = sampleDonationPutData;

			// Set PUT response
			$httpBackend.expectPUT(/donations\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/donations/' + sampleDonationPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid donationId and remove the Donation from the scope', inject(function(Donations) {
			// Create new Donation object
			var sampleDonation = new Donations({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Donations array and include the Donation
			scope.donations = [sampleDonation];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/donations\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleDonation);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.donations.length).toBe(0);
		}));
	});
}());