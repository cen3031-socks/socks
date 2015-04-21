'use strict';

(function() {
	// Creates Controller Spec
	describe('Employee Controller Tests', function() {
		// Initialize global variables
		var EmployeesController,
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
			EmployeesController = $controller('EmployeesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should employee an array with at least one Employee object fetched from XHR', inject(function(Employees) {
			// Create sample Create using the Creates service
			var sampleEmployee = new Employees({
				name: 'New Employee'
			});

			// Create a sample Creates array that includes the new Create
			var sampleEmployees = [sampleEmployee];

			// Set GET response
			$httpBackend.expectGET('employees').respond(sampleEmployees);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.employees).toEqualData(sampleEmployees);
		}));

		it('$scope.findOne() should employee an array with one Employee object fetched from XHR using a employeeId URL parameter', inject(function(Employees) {
			// Define a sample Create object
			var sampleEmployee = new Employees({
				name: 'New Employee'
			});

			// Set the URL parameter
			$stateParams.employeeId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/employees\/([0-9a-fA-F]{24})$/).respond(sampleEmployee);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.employee).toEqualData(sampleEmployee);
		}));

		/*xit('$scope.employee() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Employees) {*/
		/*// Create a sample Create object*/
		/*var sampleEmployeePostData = new Employees({*/
		/*name: 'New Employee'*/
		/*});*/

		/*// Create a sample Create response*/
		/*var sampleEmployeeResponse = new Employees({*/
		/*_id: '525cf20451979dea2c000001',*/
		/*name: 'New Employee'*/
		/*});*/

		/*// Fixture mock form input values*/
		/*scope.name = 'New Employee';*/

		/*// Set POST response*/
		/*$httpBackend.expectPOST('employees', sampleEmployeePostData).respond(sampleEmployeeResponse);*/

		/*// Run controller functionality*/
		/*scope.employee();*/
		/*$httpBackend.flush();*/

		/*// Test form inputs are reset*/
		/*expect(scope.name).toEqual('');*/

		/*// Test URL redirection after the Create was created*/
		/*expect($location.path()).toBe('/employees/' + sampleEmployeeResponse._id);*/
		/*}));*/

	});
}());
