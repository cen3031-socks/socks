/* global spyOn */
'use strict';

(function() {
	// Contacts Controller Spec
	describe('Contacts Controller Tests', function() {
		// Initialize global variables
		var ContactsController,
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
			this.scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Contacts controller.
			ContactsController = $controller('ContactsController', {
				$scope: this.scope
			});
		}));

		it('$scope.find() should create an array with at least one Contact object fetched from XHR', inject(function(Contacts) {
			// Create sample Contact using the Contacts service
			var sampleContact = new Contacts({
				name: 'New Contact'
			});

			// Create a sample Contacts array that includes the new Contact
			var sampleContacts = [sampleContact];

			// Set GET response
			$httpBackend.expectGET('contacts').respond(sampleContacts);

			// Run controller functionality
			this.scope.find();
			$httpBackend.flush();

			for (var i in this.scope.contacts) {
				// Test this.scope value
				expect(this.scope.contacts[0].name).toBe(sampleContacts[0].name);

			}
		}));

		/*xit('$scope.findOne() should create an array with one Contact object fetched from XHR using a contactId URL parameter', */
		/*inject(function(Contacts, $controller, $rootScope) {*/

		/*this.scope = $rootScope.$new();*/
		/*ContactsController = $controller('ContactsViewController', {*/
		/*$scope: this.scope*/
		/*});*/

		/*// Define a sample Contact object*/
		/*var sampleContact = new Contacts({*/
		/*name: 'New Contact'*/
		/*});*/

		/*// Set the URL parameter*/
		/*$stateParams.contactId = '525a8422f6d0f87f0e407a33';*/

		/*// Set GET response*/
		/*$httpBackend.expectGET(/contacts\/([0-9a-fA-F]{24})$/).respond(sampleContact);*/

		/*// Run controller functionality*/
		/*this.scope.findOne();*/
		/*$httpBackend.flush();*/

		/*// Test scope value*/
		/*expect(this.scope.contact.name).toBe(sampleContact.name);*/
		/*}));*/

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL',
		   inject(function(Contacts, $controller, $rootScope) {
			   this.scope = $rootScope.$new();
			   ContactsController = $controller('ContactsCreateController', {
				   $scope: this.scope
			   });
			   // Create a sample Contact object

			   var sampleContactPostData = new Contacts({
				   firstName: 'New Contact'
			   });

			   // Create a sample Contact response
			   var sampleContactResponse = new Contacts({
				   _id: '525cf20451979dea2c000001',
				   firstName: 'New Contact'
			   });

			   // Fixture mock form input values
			   this.scope.firstName = 'New Contact';

			   // Set POST response
			   $httpBackend.expectPOST('contacts', sampleContactPostData).respond(sampleContactResponse);

			   // Run controller functionality
			   this.scope.create();
			   $httpBackend.flush();

			   // Test form inputs are reset
			   expect(this.scope.firstName).toEqual(undefined);

			   // Test URL redirection after the Contact was created
			   expect($location.path()).toBe('/contacts/' + sampleContactResponse._id);
		   }));
		   it('$scope.create() with valid form data IN MULTIPLE FEILDS should send a POST request with the form input values and then locate to new object URL',
		 	  inject(function(Contacts, $controller, $rootScope) {
				  this.scope = $rootScope.$new();
				  ContactsController = $controller('ContactsCreateController', {
					  $scope: this.scope
				  });
				  // Create a sample Contact object

				  var sampleContactPostData = new Contacts({
					  firstName: 'New Contact',
					  surname: 'Last Name',
					  phone: ''
				  });

				  // Create a sample Contact response
				  var sampleContactResponse = new Contacts({
					  _id: '525cf20451979dea2c000001',
					  firstName: 'New Contact',
					  surname: 'Last Name',
					  phone: ''
				  });

				  // Fixture mock form input values
				  this.scope.firstName = 'New Contact';
				  this.scope.surname = 'Last Name';
				  this.scope.phone = '';

				  // Set POST response
				  $httpBackend.expectPOST('contacts', sampleContactPostData).respond(sampleContactResponse);

				  // Run controller functionality
				  this.scope.create();
				  $httpBackend.flush();

				  // Test form inputs are reset
				  expect(this.scope.firstName).toEqual(undefined);
				  expect(this.scope.surname).toEqual(undefined);
				  expect(this.scope.phone).toEqual(undefined);


				  // Test URL redirection after the Contact was created
				  expect($location.path()).toBe('/contacts/' + sampleContactResponse._id);
			  }));

			  it('$scope.create() Failure Emulation from httpBackend should get error',
		 		 inject(function(Contacts, $controller, $rootScope) {

					 this.scope = $rootScope.$new();
					 ContactsController = $controller('ContactsCreateController', {
						 $scope: this.scope
					 });
					 // Create a sample Contact object

					 var sampleContactPostData = new Contacts({
						 firstName: 'New Contact',
						 surname: 'Last Name',
						 phone: ''
					 });

					 // Create a sample Contact response

					 // Fixture mock form input values
					 this.scope.firstName = sampleContactPostData.firstName;
					 this.scope.surname = sampleContactPostData.surname;
					 this.scope.phone = sampleContactPostData.phone;

					 // Set POST response
					 $httpBackend.expectPOST('contacts', sampleContactPostData).respond(500, '');

					 // Run controller functionality
					 spyOn(console, 'log');
					 spyOn($location, 'path');
					 this.scope.create();
					 $httpBackend.flush();

					 // Test form inputs are reset
					 expect(this.scope.firstName).toEqual(sampleContactPostData.firstName);
					 expect(this.scope.surname).toEqual(sampleContactPostData.surname);
					 expect(this.scope.phone).toEqual(sampleContactPostData.phone);


					 // Test URL redirection after the Contact was created
					 expect($location.path).not.toHaveBeenCalled();
				 }));


				 /*xit('$scope.update() should update a valid Contact', inject(function(Contacts) {*/
				 /*// Define a sample Contact put data*/
				 /*var sampleContactPutData = new Contacts({*/
				 /*_id: '525cf20451979dea2c000001',*/
				 /*name: 'New Contact'*/
				 /*});*/

				 /*// Mock Contact in scope*/
				 /*scope.contact = sampleContactPutData;*/

				 /*// Set PUT response*/
				 /*$httpBackend.expectPUT(/contacts\/([0-9a-fA-F]{24})$/).respond();*/

				 /*// Run controller functionality*/
				 /*scope.update();*/
				 /*$httpBackend.flush();*/

				 /*// Test URL location to new object*/
				 /*expect($location.path()).toBe('/contacts/' + sampleContactPutData._id);*/
				 /*}));*/

				 /*xit('$scope.remove() should send a DELETE request with a valid contactId and remove the Contact from the scope', inject(function(Contacts) {*/
				 /*// Create new Contact object*/
				 /*var sampleContact = new Contacts({*/
				 /*_id: '525a8422f6d0f87f0e407a33'*/
				 /*});*/

				 /*// Create new Contacts array and include the Contact*/
				 /*scope.contacts = [sampleContact];*/

				 /*// Set expected DELETE response*/
				 /*$httpBackend.expectDELETE(/contacts\/([0-9a-fA-F]{24})$/).respond(204);*/

				 /*// Run controller functionality*/
				 /*scope.remove(sampleContact);*/
				 /*$httpBackend.flush();*/

				 /*// Test array after successful delete*/
				 /*expect(scope.contacts.length).toBe(0);*/
				 /*}));*/
	});
}());
