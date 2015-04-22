'use strict';

// Init the application configuration module for AngularJS application
var ApplicationConfiguration = (function() {
	// Init module configuration options
	var applicationModuleName = 'mean';
	var applicationModuleVendorDependencies = ['angularFileUpload', 'ngResource', 'ngAnimate', 'ui.router', 'ui.bootstrap', 'ui.utils'];

	// Add a new vertical module
	var registerModule = function(moduleName, dependencies) {
		// Create angular module
		angular.module(moduleName, dependencies || []);

		// Add the module to the AngularJS configuration file
		angular.module(applicationModuleName).requires.push(moduleName);
	};

	return {
		applicationModuleName: applicationModuleName,
		applicationModuleVendorDependencies: applicationModuleVendorDependencies,
		registerModule: registerModule
	};
})();

'use strict';

//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);

// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config(['$locationProvider',
	function($locationProvider) {
		$locationProvider.hashPrefix('!');
	}
]);

//Then define the init function for starting up the application
angular.element(document).ready(function() {
	//Fixing facebook bug with redirect
	if (window.location.hash === '#_=_') window.location.hash = '#!';

	//Then init the app
	angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('contacts');

'use strict';

// Use Application configuration module to register a new module
ApplicationConfiguration.registerModule('core');

'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('donations', ['infinite-scroll']);

'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('employees');
'use strict';
ApplicationConfiguration.registerModule('images', ['ui.router', 'angularFileUpload']);

'use strict';

ApplicationConfiguration.registerModule('reports');

'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('stats', ['google']);

'use strict';

// Use Application configuration module to register a new module
ApplicationConfiguration.registerModule('users');
'use strict';
// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('volunteers');

'use strict';
angular.module('core').controller('CatEditController',
    ['$scope', '$stateParams', 'Authentication', 'Cats', '$modal', '$location', '$rootScope', 'Contacts', 'Dialogs',
        function($scope, $stateParams, Authentication, Cats, $modal, $location, $rootScope, Contacts, Dialogs) {
            $scope.authentication = Authentication;
            $scope.dateOfArrival = Date.now();

            $scope.getAge = function(cat) {
                if (cat.dateOfBirth === undefined) {
                    return 'Unknown';
                }
                var dob = Date.parse(cat.dateOfBirth.toString());
                var value = (new Date() - dob) / (1000 * 60 * 60 * 24);
                if (value < 30) {
                    return Math.round(value) + ' days';
                } else if (value / 30 < 24) {
                    return Math.round(value/30) + ' months';
                } else return Math.round(value/365.25) + ' years';
            };

            $scope.getCat = function() {
                var self = this;
                self.cat = Cats.get({catId: $stateParams.catId},
                    function() {
                        self.isFound = true;
                        for (var i in self.cat.adoptions) {
                            self.cat.adoptions[i].eventType = 'adoption';
                        }
                        var cat = self.cat;

                        self.dateOfBirth = cat.dateOfBirth;
                        self.dateOfBirthEstimated = cat.dateOfBirthEstimated;
                        self.name = cat.name;
                        self.sex = cat.sex;
                        self.vet = cat.vet ? [cat.vet] : [];
                        self.dateOfArrival = cat.dateOfArrival;
                        self.breed = cat.breed;
                        self.color = cat.color;
                        self.description = cat.description;
                        self.temperament = cat.temperament;
                        console.log(cat);
                        if (cat.origin) {
                            console.log(!!cat.origin.person);
                            self.originAddress = cat.origin.address;
                            self.originPerson = cat.origin.person ? [cat.origin.person] : [];
                            self.originOrg = cat.origin.organization;
                        }
                        self.location = cat.currentLocation;
                        console.log(self);
                    });

            };
            $scope.getCat();

            $scope.open = function($event) {
                $event.preventDefault();
                $event.stopPropagation();
                $scope.opened = true;
            };
            $scope.openArrival = function($event) {
                $event.preventDefault();
                $event.stopPropagation();
                $scope.arrivalDateOpened = true;
            };

            $scope.submit = function() {
                console.log(this);
                var cat = this.cat;
                cat.dateOfBirth = this.dateOfBirth;
                console.log(cat.dateOfBirthEstimated);
                cat.name = this.name;
                cat.vet = this.vet && this.vet.length === 1 ? this.vet[0]._id : undefined;
                cat.dateOfArrival = this.dateOfArrival;
                cat.breed = this.breed;
                cat.color = this.color;
                cat.description = this.description;
                cat.temperament = this.temperament;
                cat.origin = {
                    address: this.originAddress,
                    person: this.originPerson && this.originPerson.length === 1 ? this.originPerson[0]._id : undefined,
                    organization: this.originOrg
                },
                cat.currentLocation = this.location;
                if (this.profileImage) {
                    cat.profileImage = this.profileImage._id;
                }

                return this.cat.$save(function(response) {
                    $location.path('cats/' + response._id);
                }, function(errorResponse) {
                    $scope.error = errorResponse.data.message;
                });
            };
        }]
);


'use strict';
angular.module('core')
    .controller('CatVideoController',
    ['$scope', '$stateParams', 'Authentication', 'Cats', '$modal', '$location', '$rootScope', 'Contacts', 'Dialogs', '$sce',
        function($scope, $stateParams, Authentication, Cats, $modal, $location, $rootScope, Contacts, Dialogs, $sce) {

            $scope.$watch(
                function() {
                    return $stateParams.videoId;
                }, function() {
                if ($stateParams.videoId) {
                    $scope.source = $sce.trustAsResourceUrl('/videos/' + $stateParams.videoId + '/get');
                }
            });
        }]
);


'use strict';

var possibleShots = [
    'FVRCP-1',
    'FVRCP-2',
    'FVRCP-3',
    'Worm',
    'FIP-1',
    'FIP-2',
    'Rabies',
    'Rabies Booster'
];

var adoptionController = ["cat", "Cats", "$scope", "$modalInstance", function(cat, Cats, $scope, $modalInstance) {
    $scope.adoptCat = function() {
        Cats.adopt({catId: cat._id}, {
            adopter: $scope.adopter[0]._id,
            donation: $scope.donationId,
            date: $scope.adoptionDate,
            adoptionType: $scope.adoptionType
        }, function() {
            $modalInstance.close(true);
        });
    };
    $scope.unadoptCat = function() {
        Cats.unadopt({catId: cat._id, adoptionId: cat.currentAdoption._id}, {
            endDate: $scope.returnDate,
            reason: $scope.reason
        }, function() {
            $modalInstance.close(true);
        });
    };
    $scope.open = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.opened = true;
    };
}];

angular.module('core').controller('CatViewController',
    ['$scope', '$stateParams', 'Authentication', 'Cats', '$modal', '$location', '$rootScope', 'Contacts', 'Dialogs',
        function($scope, $stateParams, Authentication, Cats, $modal, $location, $rootScope, Contacts, Dialogs) {
            // This provides Authentication context.
            $scope.authentication = Authentication;
            $scope.possibleShots = possibleShots;

            $scope.eventLimit = 3;
            $scope.showMore = function() {
                $scope.eventLimit += 5;
            };
            $scope.isFound = false;

            $scope.getCat = function() {
                $scope.cat = Cats.get({catId: $stateParams.catId},
                    function() {
                        $scope.isFound = true;
                        for (var i in $scope.cat.adoptions) {
                            $scope.cat.adoptions[i].eventType = 'adoption';
                        }
                        $scope.cat.events = $scope.cat.events.concat($scope.cat.adoptions);
                        console.log($scope.cat);
                    });
            };

            $scope.getCat();

            $scope.unadopt = function() {
                $modal.open({
                    templateUrl: '/modules/cats/views/unadopt-cat.client.modal.html',
                    controller: adoptionController,
                    resolve: {
                        cat: function() {
                            return $scope.cat;
                        }
                    }
                }).result.then(function() {
                        $scope.getCat();
                    });
            };

            $scope.adopt = function() {
                $modal.open({
                    templateUrl: '/modules/cats/views/adopt-cat.client.modal.html',
                    controller: adoptionController,
                    resolve: {
                        cat: function() {
                            return $scope.cat;
                        }
                    }
                }).result.then(function() {
                        $scope.getCat();
                    });
            };

            $scope.addEvent = function() {
                $modal.open({
                    templateUrl: '/modules/cats/views/add-event.client.modal.html',
                    controller: ["cat", "Cats", "$scope", "$modalInstance", function(cat, Cats, $scope, $modalInstance) {
                        $scope.possibleShots = possibleShots;
                        $scope.operations = [];
                        $scope.getIcon = function() {
                            return 'glyphicon-pushpin';
                        };
                        $scope.createEvent = function() {

                            console.log($scope);
                            console.log($scope.operations);

                            Cats.addEvent({catId: cat._id}, {
                                eventType: $scope.eventType,
                                detail: $scope.detail,
                                label: $scope.label,
                                date: $scope.date,
                                icon: $scope.getIcon(),
                                data: {
                                    operations: $scope.operations
                                }
                            }, function() {
                                    $modalInstance.close(true);
                            });
                        };
                    }],
                    resolve: {
                        cat: function() {
                            return $scope.cat;
                        }
                    }
                }).result.then(function() {
                        $scope.getCat();
                    });
            };

            $scope.onRouteChangeOff = $scope.$on('$locationChangeStart', function(event, newState, oldState) {
                if (($scope.newNote || '') !== '') {
                    Dialogs
                        .confirm('You have unsaved data entered on this page. Do you want to leave without saving?')
                        .then(function(result) {
                            if (result) {
                                $scope.onRouteChangeOff();
                                $location.path(newState);
                            }
                        });
                    event.preventDefault();
                }
            });

            $scope.deleteEvent = function(event) {
                Dialogs
                    .confirm('Are you sure you want to delete this event?')
                    .then(function(result) {
                        if (result) {
                            Cats.deleteEvent({catId: $scope.cat._id, eventId: event._id}, $scope.getCat);
                        }
                    });
            };

            $scope.contacts = Contacts.query();

            $scope.convertSex = function(sexNumber) {
                if (sexNumber === 0) {
                    return 'Unknown';
                }
                else if (sexNumber === 1) {
                    return 'Male';
                }
                else if (sexNumber === 2) {
                    return 'Female';
                }
                else if (sexNumber === 9) {
                    return 'N/A';
                }
            };

            $scope.getSpayDate = function(cat) {
                if (cat.events === undefined) return;
                for (var i = 0; i < cat.events.length; ++i) {
                    var thisEvent = cat.events[i];
                    if (thisEvent && thisEvent.eventType === 'vet') {
                        var operations = thisEvent.data.operations;
                        for (var j = 0; j < operations.length; ++j) {
                            if (operations[j].type === 'Spay/Neuter') {
                                return thisEvent.date;
                            }
                        }
                    }
                }
            };

            $scope.getProcedureDates = function(cat, type) {
                var dates = [];
                if (cat.events) {
                    for (var i = 0; i < cat.events.length; ++i) {
                        var thisEvent = cat.events[i];
                        if (thisEvent && thisEvent.data && thisEvent.eventType === 'vet') {
                            var operations = thisEvent.data.operations;
                            for (var j = 0; j < operations.length; ++j) {
                                if (operations[j].type === type) {
                                    dates.push(thisEvent.date);
                                    break;
                                }
                            }
                        }
                    }
                }
                return dates;
            }

            $scope.edit = function() {
                $location.path('/cats/' + $scope.cat._id + '/edit');
            };

        }]
);


'use strict';

var cats = angular.module('core');
cats.controller('CatsSelectorController', ['$stateParams', 'Cats', '$modal', '$scope', '$rootScope',
    function($stateParams, Cats, $modal, $scope, $rootScope) {
        console.log('cat selector');
        $scope.selectedCats = $scope.selectedCats || [];

        if ($scope.max === undefined) {
            $scope.max = Infinity;
        }

        $scope.showModal = function() {
            if ($scope.max === undefined) {
                $scope.max = Infinity;
            }

            // if we've already got enough cats selected, don't show the modal.
            if ($scope.selectedCats.length >= $scope.max) {
                return;
            }

            // set the parameters used inside the modal
            var modalScope = $rootScope.$new();
            modalScope.title = $scope.title || 'Find a Cat';
            modalScope.hideUntil = $scope.hideUntil || 3;
            modalScope.selectText = $scope.selectText || 'Select a cat';

            var modalInstance = $modal.open({
                scope: modalScope,
                templateUrl: '/modules/cats/views/select-cat-list.client.template.html',
                controller: ["$scope", "$modalInstance", "Cats", "$modal", function($scope, $modalInstance, Cats, $modal) {
                    $scope.cats = Cats.query();
                    $scope.cancel = function () {
                        $modalInstance.dismiss('cancel');
                    };
                    $scope.select = function(cat) {
                        $modalInstance.close(cat);
                    };
                    $scope.createCat = function() {
                        var createModal = $modal.open({
                            templateUrl: '/modules/cats/views/create-cats.client.view.html',
                            size: 'lg',
                            controller: ''
                        });
                        // stop route changes to /cats/:catId so the create-cat view doesn't take you
                        // off the page.
                        var onRouteChangeOff = $scope.$on('$locationChangeStart', function(event, newState, oldState) {
                            if (newState.match(/\/cats\/[\w\d]{24}$/)) {
                                onRouteChangeOff();
                                createModal.dismiss();
                                $modalInstance.close(Cats.get({catId: newState.match(/[\w\d]{24}$/)}));
                                event.preventDefault();
                            }
                        });
                    };
                }],
                size: 'md'
            });
            modalInstance.result.then($scope.select);
        };

        $scope.select = function(cat) {
            if ($scope.selectedCats.indexOf(cat) !== -1) {
                $scope.selectedCats.splice($scope.selectedCats.indexOf(cat), 1);
            }
            $scope.selectedCats.push(cat);
        };

        $scope.unselect = function(cat, index) {
            $scope.selectedCats.splice(index, 1);
        };
    }]);
/**
 * Creates a directive cats-selector, which acts like a form input.
 * It allows the user to select a number of cats. Sets its ng-model
 * to be an array of the selected cats
 *
 * Attributes:
 *      max         the maximum allowable number of cats
 *      title       the text to show at the top of the selector
 *      hide-until  the number of characters to require to be typed before showing any cats in the list
 */
cats.directive('catsSelector', function() {
    return {
        restrict: 'E',
        controller: 'CatsSelectorController',
        scope: { maxCats: '=max', selectedCats: '=?ngModel', title: '=?title', hideUntil: '=?hideUntil', selectText: '=?selectText' },
        templateUrl: '/modules/cats/views/cat-selector.client.template.html',
        link: function(scope, element, attrs, ctrl) { }
    };
});

/**
 * Creates a directive cat-link that makes it easy to make a link to a cat from a
 * cat id.
 */
cats.directive('catLink', ['Cats', function(Cats) {
    return {
        restrict: 'E',
        controller: 'CatLinkController',

        template: '<a href="#!/cats/{{cat._id}}">{{cat.name}}</a>',
        scope: { catId: '=catId' },
        link: function(scope, element, attrs, ctrl) { }
    };
}]);

cats.controller('CatLinkController', [ '$scope', 'Cats', function($scope, Cats) {
    $scope.$watch('catId', function() {
        if ($scope.catId !== undefined) {
            $scope.cat = Cats.get({catId: $scope.catId});
        } else {
            $scope.cat = undefined;
        }
    });
}]);

'use strict';

angular.module('core').factory('Cats', ['$resource',
	function($resource) {
		return $resource('cats/:catId', {
			catId: '@_id'
		}, {
			update: {
				method: 'POST'
			},
			addEvent: { 
				method: 'POST',
				url: 'cats/:catId/events'
			},
			editEvent: {
				method: 'PUT',
				url: 'cats/:catId/events/:eventId'
			},
			deleteEvent: { 
				method: 'DELETE',
				url: 'cats/:catId/events/:eventId'
			},
			adopt: {
				method: 'POST',
				url: 'cats/:catId/adoptions'
			},
			unadopt: {
				method: 'PUT',
				url: 'cats/:catId/adoptions/:adoptionId'
			},
            addNote: {
                method: 'PUT',
                url: 'cats/:catId/notes'
            },
            deleteNote: {
                method: 'DELETE',
                url: 'cats/:catId/notes/:noteId'
            }
		});
	}
]);

'use strict';

// Configuring the Articles module
angular.module('contacts').run(['Menus',
    function(Menus) {
        // Set top bar menu items
        Menus.addMenuItem('topbar', 'Contacts', 'contacts', 'dropdown', '/contacts(/create)?');
        Menus.addSubMenuItem('topbar', 'contacts', 'List Contacts', 'contacts');
        Menus.addSubMenuItem('topbar', 'contacts', 'New Contact', 'contacts/create');
    }
]);

'use strict';

//Setting up route
angular.module('contacts', ['ui.router']).config(['$stateProvider',
	function($stateProvider) {
		// Contacts state routing
		$stateProvider.
		state('listContacts', {
			url: '/contacts',
			templateUrl: 'modules/contacts/views/list-contacts.client.view.html'
		}).
		state('createContact', {
			url: '/contacts/create',
			templateUrl: 'modules/contacts/views/create-contacts.client.view.html'
		}).
		state('viewContact', {
			url: '/contacts/:contactId',
			templateUrl: 'modules/contacts/views/view-contacts.client.view.html'
		}).
		state('editContact', {
			url: '/contacts/:contactId/edit',
			templateUrl: 'modules/contacts/views/edit-contacts.client.view.html'
		}).
            state('deleteContact', {
                url: '/contacts/:contactId/edit/delete',
                templateUrl: 'modules/contacts/views/delete-confirm.client.view.html'
            }).
            state('adoptedCats', {
                url: '/contacts/:contactID/adoptedCats',
                templateUrl: 'modules/contacts/views/adopted-cats.client.view.html'
            }).
            state('listContactsWithHours', {
			url: '/contactsHours',
			templateUrl: 'modules/contacts/views/list-contacts-with-hours.client.view.html'
		});
	}
]);

'use strict';

var contacts = angular.module('contacts');
contacts.controller('ContactsSelectorController', ['$stateParams', 'Contacts', '$modal', '$scope', '$rootScope',
    function($stateParams, Contacts, $modal, $scope, $rootScope) {
        $scope.selectedContacts = $scope.selectedContacts || [];

        $scope.showModal = function() {
            if ($scope.max === undefined) {
                $scope.max = -1;
            }

            // if we've already got enough contacts selected, don't show the modal.
            if ($scope.selectedContacts.length >= $scope.max && $scope.max !== -1) {
                return;
            }

            // set the parameters used inside the modal
            var modalScope = $rootScope.$new();
            modalScope.title = $scope.title || 'Find a Contact';
            modalScope.hideUntil = $scope.hideUntil || 3;

            var modalInstance = $modal.open({
                scope: modalScope,
                templateUrl: '/modules/contacts/views/select-contact-list.client.template.html',
                controller: ["$scope", "$modalInstance", "Contacts", "$modal", function($scope, $modalInstance, Contacts, $modal) {
                    $scope.contacts = Contacts.query();
                    $scope.cancel = function () {
                        $modalInstance.dismiss('cancel');
                    };
                    $scope.select = function(contact) {
                        $modalInstance.close(contact);
                    };
                    $scope.createContact = function() {
                        var createModal = $modal.open({
                            templateUrl: '/modules/contacts/views/create-contacts.client.view.html',
                            size: 'lg',
                            controller: ''
                        });
                        // stop route changes to /contacts/:contactId so the create-contact view doesn't take you
                        // off the page.
                        var onRouteChangeOff = $scope.$on('$locationChangeStart', function(event, newState, oldState) {
                            if (newState.match(/\/contacts\/[\w\d]{24}$/)) {
                                onRouteChangeOff();
                                createModal.dismiss();
                                $modalInstance.close(Contacts.get({contactId: newState.match(/[\w\d]{24}$/)}));
                                event.preventDefault();
                            }
                        });
                    };
                }],
                size: 'md'
            });
            modalInstance.result.then($scope.select);
        };

        $scope.select = function(contact) {
            if ($scope.selectedContacts.indexOf(contact) !== -1) {
                $scope.selectedContacts.splice($scope.selectedContacts.indexOf(contact), 1);
            }
            $scope.selectedContacts.push(contact);
        };

        $scope.unselect = function(contact, index) {
            $scope.selectedContacts.splice(index, 1);
        };
    }]);
/**
 * Creates a directive contacts-selector, which acts like a form input.
 * It allows the user to select a number of contacts. Sets its ng-model
 * to be an array of the selected contacts
 *
 * Attributes:
 *      max         the maximum allowable number of contacts
 *      title       the text to show at the top of the selector
 *      hide-until  the number of characters to require to be typed before showing any contacts in the list
 */
contacts.directive('contactsSelector', function() {
    return {
        restrict: 'E',
        controller: 'ContactsSelectorController',
        scope: { maxContacts: '=max', selectedContacts: '=?ngModel', title: '=?title', hideUntil: '=?hideUntil' },
        templateUrl: '/modules/contacts/views/contact-selector.client.template.html',
        link: function(scope, element, attrs, ctrl) { }
    };
});

/**
 * Creates a directive contact-link that makes it easy to make a link to a contact from a
 * contact id.
 */
contacts.directive('contactLink', ['Contacts', function(Contacts) {
    return {
        restrict: 'E',
        controller: 'ContactLinkController',

        template: '<a href="#!/contacts/{{contact._id}}">{{contact.firstName}} {{contact.surname}}</a>',
        scope: { contactId: '=contactId' },
        link: function(scope, element, attrs, ctrl) { }
    };
}]);

contacts.controller('ContactLinkController', [ '$scope', 'Contacts', function($scope, Contacts) {
    $scope.$watch('contactId', function() {
        if ($scope.contactId !== undefined) {
            $scope.contact = Contacts.get({contactId: $scope.contactId});
        } else {
            $scope.contact = undefined;
        }
    });
}]);

'use strict';
var contactsApp = angular.module('contacts');

contactsApp.controller('ContactsController', ['$scope', '$stateParams', 'Authentication', 'Contacts', '$modal', '$log', '$location', 'Dialogs',
    function ($scope, $stateParams, Authentication, Contacts, $modal, $log, $location, Dialogs) {

        $scope.formatPhoneNumber = function (phone) {
            if (!phone) return '';
            var newPhone = '';
            if (phone.length === 12) {
                newPhone += '+'+phone[0]+phone[1]+' ('+phone[2]+phone[3]+phone[4]+') '+phone[5]+phone[6]+phone[7]+
                '-'+phone[8]+phone[9]+phone[10]+phone[11];
            }
            else if (phone.length === 11) {
                newPhone += '+'+phone[0]+' ('+phone[1]+phone[2]+phone[3]+') '+phone[4]+phone[5]+phone[6]+
                '-'+phone[7]+phone[8]+phone[9]+phone[10];
            }
            else if (phone.length === 10) {
                newPhone += '('+phone[0]+phone[1]+phone[2]+') '+phone[3]+phone[4]+phone[5]+
                '-'+phone[8]+phone[7]+phone[8]+phone[9];
            }
            else {
                return;
            }
            return newPhone;
        };

        $scope.formatZipCode = function (zipCode) {
            if (!zipCode) return '';
            var newZipCode = '';
            if (zipCode.length === 5) {
                newZipCode += zipCode[0]+zipCode[1]+zipCode[2]+zipCode[3]+zipCode[4];
            }
            else if (zipCode.length === 9) {
                newZipCode += +zipCode[0]+zipCode[1]+zipCode[2]+zipCode[3]+zipCode[4]+
                '-'+zipCode[5]+zipCode[6]+zipCode[7]+zipCode[8];
            }
            else {
                return;
            }
            return newZipCode;
        };

        this.authentication = Authentication;
        $scope.getDetails = function (contact) {
            $location.path('contacts/' + contact._id);
        };

        $scope.find = function () {
            $scope.contacts = Contacts.query();
        };
        this.modalUpdate = function (size, selectedContact) {

            var modalInstance = $modal.open({
                templateUrl: 'modules/contacts/views/edit-contacts.client.view.html',
                controller: ["$scope", "$modalInstance", "contact", function ($scope, $modalInstance, contact) {
                    $scope.contact = contact;
                }],
                size: size,
                resolve: {
                    contact: function () {
                        return selectedContact;
                    }
                }
            });

            modalInstance.result.then(function (selectedItem) {
                $scope.selected = selectedItem;
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };
        $scope.getMinutes = function (date1, date2) {
            minutesWorked()
        }
    }


]);

contactsApp.controller('ContactsCreateController', ['$scope', 'Contacts', '$location',
    function ($scope, Contacts, $location) {
        // Create new Contact

        $scope.create = function () {
            // Create new Contact object
            var contact = new Contacts({
                firstName: $scope.firstName,
                surname: $scope.surname,
                address: $scope.address,
                state: $scope.state,
                zipCode: $scope.zipCode,
                email: $scope.email,
                phone: $scope.phone,
                is_volunteer: $scope.is_volunteer,
                city: $scope.city
            });

            // Redirect after save
            contact.$save(function (response) {
                $location.path('contacts/' + response._id);

                // Clear form fields
                $scope.firstName = undefined;
                $scope.surname = undefined;
                $scope.address = undefined;
                $scope.state = undefined;
                $scope.zipCode = undefined;
                $scope.email = undefined;
                $scope.phone = undefined;
                $scope.is_volunteer = undefined;
                $scope.city = undefined;
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
                console.log(errorResponse);
            });
        };
    }
]);

contactsApp.controller('ContactsUpdateController', ['$scope', 'Contacts', '$stateParams', '$modal', 'Dialogs',
    function ($scope, Contacts, $stateParams, $modal, Dialogs) {

    }
]);

contactsApp.controller('ContactsViewController', ['$scope', 'Contacts', '$stateParams', '$modal', 'Authentication', '$location', 'Volunteers', 'Dialogs', '$log',
    function ($scope, Contacts, $stateParams, $modal, Authentication, $location, Volunteers, Dialogs, $log) {

        $scope.isVolunteer = function () {
            var currDate = new Date();
            var oldDate = new Date();
            oldDate.setFullYear(2000);
            //If statement should call minutes worked from volunteers.server.controller.js
            var minutes_worked = Volunteers.minutesWorked({
                startDate: oldDate,
                endDate: currDate,
                contactId: $scope.contact._id
            }, function () {
                $scope.contact.hasVolunteered = (minutes_worked > 0);
                if (isNaN(minutes_worked)) {
                    minutes_worked = 0;
                }
                $scope.contact.minutes_worked = minutes_worked;
            });
        };

        $scope.findOne = function () {
            $scope.contact = Contacts.get({
                contactId: $stateParams.contactId
            });
            var adoptions = Contacts.findAdoptedCats({contactId: $stateParams.contactId}, function () {
                $scope.contact.isAdopter = adoptions.length > 0;
            });
            var vets = Contacts.findCatsWithVets({contactId: $stateParams.contactId}, function () {
                $scope.contact.isVet = vets.length > 0;
            });
            var fosterers = Contacts.findFosteredCats({contactId: $stateParams.contactId}, function () {
                $scope.contact.isFosterer = fosterers.length > 0;
            });
            var donations = Contacts.findDonations({contactId: $stateParams.contactId}, function () {
                $scope.contact.isDonator = donations.length > 0;
            });
            var volunteers = Contacts.findVolunteerHours({contactId: $stateParams.contactId}, function () {
                $scope.contact.isVolunteer2 = volunteers.length > 0;
            });
            var employees = Contacts.findEmployees({contactId: $stateParams.contactId}, function () {
                $scope.contact.isEmployee = employees.length > 0;
            });
            var admins = Contacts.findAdmins({contactId: $stateParams.contactId}, function () {
                $scope.contact.isAdministrator = admins.length > 0;
            });
        };

        $scope.formatPhoneNumber = function (phone) {
            if (!phone) return '';
            var newPhone = '';
            if (phone.length === 12) {
                newPhone += '+' + phone[0] + phone[1] + ' (' + phone[2] + phone[3] + phone[4] + ') ' + phone[5] + phone[6] + phone[7] +
                '-' + phone[8] + phone[9] + phone[10] + phone[11];
            }
            else if (phone.length === 11) {
                newPhone += '+' + phone[0] + ' (' + phone[1] + phone[2] + phone[3] + ') ' + phone[4] + phone[5] + phone[6] +
                '-' + phone[7] + phone[8] + phone[9] + phone[10];
            }
            else if (phone.length === 10) {
                newPhone += '(' + phone[0] + phone[1] + phone[2] + ') ' + phone[3] + phone[4] + phone[5] +
                '-' + phone[8] + phone[7] + phone[8] + phone[9];
            }
            else {
                return;
            }
            return newPhone;
        };

        $scope.formatZipCode = function (zipCode) {
            if (!zipCode) return '';
            var newZipCode = '';
            if (zipCode.length === 5) {
                newZipCode += zipCode[0] + zipCode[1] + zipCode[2] + zipCode[3] + zipCode[4];
            }
            else if (zipCode.length === 9) {
                newZipCode += +zipCode[0] + zipCode[1] + zipCode[2] + zipCode[3] + zipCode[4] +
                '-' + zipCode[5] + zipCode[6] + zipCode[7] + zipCode[8];
            }
            else {
                return;
            }
            return newZipCode;
        };

        $scope.deleteNote = function (note, index) {
            Dialogs
                .confirm('Are you sure you want to delete this note?')
                .then(function (result) {
                    if (result) {
                        Contacts.deleteNote({contactId: $scope.contact._id, noteId: note._id}, $scope.findOne);
                    }
                });
        };

        $scope.canAddNote = function () {
            return $scope.authentication && $scope.authentication.user && $scope.authentication.user.contact && $scope.newNote !== '';
        };

        $scope.addNote = function () {
            if (!$scope.canAddNote()) return;
            Contacts.addNote({contactId: $scope.contact._id}, {
                message: $scope.newNote,
                date: Date.now(),
                sender: $scope.authentication.user.contact._id
            }, function () {
                $scope.findOne();
                $scope.newNote = '';
            });
        };

        // Open a modal window to Update a single contact record
        this.modalUpdate = function (size, selectedContact) {

            var modalInstance = $modal.open({
                templateUrl: 'modules/contacts/views/edit-contacts.client.view.html',
                controller: ["$scope", "$modalInstance", "contact", "Dialogs", "$location", function ($scope, $modalInstance, contact, Dialogs, $location) {
                    $scope.contact = contact;

                $scope.ok = function () {
                    if (document.updateContactForm.$valid){
                        $modalInstance.close($scope.contact);
                    }
                    $modalInstance.dismiss('cancel');
                };

                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };
                $scope.update = function(updatedContact) {
                    var contact = updatedContact;

                    contact.$update(function() {
                    }, function(errorResponse) {
                        $scope.error = errorResponse.data.message;
                    });
                };

                $scope.deleteContact = function(contact) {
                    Dialogs
                        .confirm('Delete Contact?')
                        .then(function(result) {
                            if (contact && result) {

                                contact.$remove(function() {
                                    $modalInstance.dismiss('deleted');
                                    $location.path('/contacts');
                                });
                            }
                        });
                };
                //$scope.deleteContact = function(contact, index) {
                //    Dialogs
                //        .confirm('Delete Contact?')
                //        .then(function(result) {
                //            if (result) {
                //                contact.deleted_contact = true;
                //                $scope.update(contact);
                //                $modalInstance.dismiss('deleted');
                //                $location.path('/contacts');
                //            }
                //        });
                //};
                $scope.addToDoNotAdoptList = function(contact, index) {
                    Dialogs
                        .confirm('Add contact to the "Do not adopt" list?')
                        .then(function(result) {
                            if (result) {
                                contact.do_not_adopt = true;
                                $scope.update(contact);
                                $modalInstance.dismiss('Added to "Do not adopt" list');
                                // $location.path('/contacts');
                            }
                        });
                    };

                    $scope.deleteContact = function (contact) {
                        Dialogs
                            .confirm('Delete Contact?')
                            .then(function (result) {
                                if (contact && result) {

                                    contact.$remove(function () {
                                        $modalInstance.dismiss('deleted');
                                        $location.path('/contacts');
                                    });

                                }
                            });
                    };
                    //$scope.deleteContact = function(contact, index) {
                    //    Dialogs
                    //        .confirm('Delete Contact?')
                    //        .then(function(result) {
                    //            if (result) {
                    //                contact.deleted_contact = true;
                    //                $scope.update(contact);
                    //                $modalInstance.dismiss('deleted');
                    //                $location.path('/contacts');
                    //            }
                    //        });
                    //};
                    $scope.addToDoNotAdoptList = function (contact, index) {
                        Dialogs
                            .confirm('Add contact to the "Do not adopt" list?')
                            .then(function (result) {
                                if (result) {
                                    contact.do_not_adopt = true;
                                    $scope.update(contact);
                                    $modalInstance.dismiss('Added to "Do not adopt" list');
                                    // $location.path('/contacts');
                                }
                            });
                    };
                    $scope.removeFromDoNotAdoptList = function (contact, index) {
                        Dialogs
                            .confirm('Remove contact from the "Do not adopt" list?')
                            .then(function (result) {
                                if (result) {
                                    contact.do_not_adopt = false;
                                    $scope.update(contact);
                                    $modalInstance.dismiss('Removed from "Do not adopt" list');
                                    // $location.path('/contacts');
                                }
                            });
                    };
                }],
                size: size,
                resolve: {
                    contact: function () {
                        return selectedContact;
                    }
                }
            });

            modalInstance.result.then(function () {
                $scope.findOne();
            }, function () {
            });
        };

        // Open a modal window to view a contact's adopted cats
        this.modalAdoptedCatsView = function (size, selectedContact) {

            var modalInstance = $modal.open({
                templateUrl: 'modules/contacts/views/adopted-cats.client.view.html',
                controller: ["$scope", "$modalInstance", "contact", function ($scope, $modalInstance, contact) {
                    $scope.contact = contact;

                    $scope.adoptions = Contacts.findAdoptedCats({contactId: contact._id});

                    $scope.cancel = function () {
                        $modalInstance.dismiss('cancel');
                    };
                }],
                size: size,
                resolve: {
                    contact: function () {
                        return selectedContact;
                    }
                }
            });

            modalInstance.result.then(function (selectedItem) {
                $scope.selected = selectedItem;
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };

        // Open a modal window to view a contact's fostered cats
        this.modalFosteredCatsView = function (size, selectedContact) {

            var modalInstance = $modal.open({
                templateUrl: 'modules/contacts/views/fostered-cats.client.view.html',
                controller: ["$scope", "$modalInstance", "contact", function ($scope, $modalInstance, contact) {
                    $scope.contact = contact;

                    $scope.adoptions = Contacts.findFosteredCats({contactId: contact._id});

                    $scope.cancel = function () {
                        $modalInstance.dismiss('cancel');
                    };
                }],
                size: size,
                resolve: {
                    contact: function () {
                        return selectedContact;
                    }
                }
            });

            modalInstance.result.then(function (selectedItem) {
                $scope.selected = selectedItem;
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };

        // Open a modal window to view the cats of a certain vet
        this.modalVetCatsView = function (size, selectedContact) {

            var modalInstance = $modal.open({
                templateUrl: 'modules/contacts/views/vet-cats.client.view.html',
                controller: ["$scope", "$modalInstance", "contact", function ($scope, $modalInstance, contact) {
                    $scope.contact = contact;

                    $scope.vetcats = Contacts.findCatsWithVets({contactId: contact._id});

                    $scope.cancel = function () {
                        $modalInstance.dismiss('cancel');
                    };
                }],
                size: size,
                resolve: {
                    contact: function () {
                        return selectedContact;
                    }
                }
            });

            modalInstance.result.then(function (selectedItem) {
                $scope.selected = selectedItem;
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };


        // Open a modal window to view a contact's donations
        this.modalDonationsView = function (size, selectedContact) {
            var modalInstance = $modal.open({
                templateUrl: 'modules/contacts/views/donations-per-contact.view.html',
                controller: ["$scope", "$modalInstance", "contact", function ($scope, $modalInstance, contact) {
                    $scope.contact = contact;
                    $scope.donations = Contacts.findDonations({contactId: contact._id});
                    $scope.cancel = function () {
                        $modalInstance.dismiss('cancel');
                    };
                    $scope.linkToDonation = function (donation) {
                        $location.path('donations/' + donation._id);
                    };
                }],
                size: size,
                resolve: {
                    contact: function () {
                        return selectedContact;
                    }
                }
            });
            modalInstance.result.then(function (selectedItem) {
                $scope.selected = selectedItem;
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };

        // Open a modal window to view a contact's volunteer hours
        this.modalVolunteerHoursView = function (size, selectedContact) {

            var modalInstance = $modal.open({
                templateUrl: 'modules/contacts/views/volunteer-modal.client.view.html',
                controller: ["$scope", "$modalInstance", "contact", function ($scope, $modalInstance, contact) {
                    $scope.contact = contact;

                    $scope.volunteers = Contacts.findVolunteerHours({contactId: contact._id});

                    $scope.cancel = function () {
                        $modalInstance.dismiss('cancel');
                    };
                    $scope.getMinutesWorked = function () {
                        console.log('minutes worked');
                        $scope.minutesWorked = Volunteers.minutesWorked({
                            startDate: +$scope.startDate,
                            endDate: +$scope.endDate,
                            contactId: $scope.contact._id
                        });
                    };

                    $scope.getHours = function (minutes) {
                        var result = Math.round(Math.floor(minutes / 60));
                        if (isNaN(result)) {
                            return '...';
                        }
                        else return result + '';
                    };
                    $scope.getMinutes = function (minutes) {
                        var result = Math.round(minutes - (Math.floor(minutes / 60)) * 60);
                        if (isNaN(result)) {
                            return '...';
                        }
                        else return result + '';
                    };

                    $scope.$watch('contact', $scope.getMinutesWorked);
                    $scope.$watch('startDate', $scope.getMinutesWorked);
                    $scope.$watch('endDate', $scope.getMinutesWorked);
                }],
                size: size,
                resolve: {
                    contact: function () {
                        return selectedContact;
                    }
                }
            });

            modalInstance.result.then(function (selectedItem) {
                $scope.selected = selectedItem;
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };
    }]);

contactsApp.directive('contactList', [function () {
    return {
        restrict: 'E',
        transclude: true,
        templateURL: 'modules/contacts/views/view-contacts.client.view.html',
        link: function (scope, element, attrs) {

        }
    };
}]);

'use strict';
var contactsApp = angular.module('contacts');


contactsApp.filter('orderObjectBy', function() {
  return function(items, field, reverse) {
    var filtered = [];
    angular.forEach(items, function(item) {
      filtered.push(item);
    });
    filtered.sort(function (a, b) {
      return (a[field] > b[field] ? 1 : -1);
    });
    if(reverse) filtered.reverse();
    return filtered;
  };
})

contactsApp.controller('ContactsHoursController', ['$scope', '$stateParams', 'Authentication', 'Contacts', '$modal', '$log', '$location', 'Dialogs', 'Volunteers',
    function($scope, $stateParams, Authentication, Contacts, $modal, $log, $location, Dialogs, Volunteers) {

    	$scope.makeName = function(firstname, surname) {
    		return firstname + ' ' + surname;
    	};

        $scope.find = function() {
            $scope.contacts = Contacts.query(function() {
        		var contacts = $scope.contacts; 
        		for (var idx = 0; idx < contacts.length; ++idx) {
        			(function(i) { 
        				console.log(contacts[i]);
	        			if (contacts[i]) {
	        				var currDate = new Date();
					        var oldDate = new Date();
					        oldDate.setFullYear(2000);
					        //If statement should call minutes worked from volunteers.server.controller.js
					        var minutes_worked = Volunteers.minutesWorked(
					        	{
					        		startDate: +oldDate, 
					        		endDate: +currDate, 
					        		contactId: contacts[i]._id
					        	}, 
					        	function() {
						            contacts[i].minutes_worked = minutes_worked.minutes;
						        });
		        		}
		        	}(idx));
        		}
        	});
        };
        $scope.getDetails = function(contact) {
            $location.path('contacts/' + contact._id);
        };
        
    }
]);

'use strict';
//Contacts service used to communicate Contacts REST endpoints
angular.module('contacts').factory('Contacts', ['$resource',
	function($resource) {
		return $resource('contacts/:contactId', { contactId: '@_id'
		}, {
			update: {
				method: 'PUT'
			},
            findAdoptedCats: {
                method: 'GET',
                url: 'contacts/:contactId/adoptions',
                isArray: true
            },
            getAllAdopters: {
                method: 'GET',
                url: 'adopters',
                isArray: true
            },
            findFosteredCats: {
                method: 'GET',
                url: 'contacts/:contactId/fosters',
                isArray: true
            },
            findCatsWithVets: {
                method: 'GET',
                url: '/contacts/:contactId/vets',
                isArray: true
            },
            findDonations: {
                method: 'GET',
                url: 'contacts/:contactId/donations',
                isArray: true
            },
            findVolunteerHours: {
                method: 'GET',
                url: 'contacts/:contactId/volunteers',
                isArray: true
            },
            findEmployees: {
                method: 'GET',
                url: 'contacts/:contactId/employees',
                isArray: true
            },
            findAdmins: {
                method: 'GET',
                url: 'contacts/:contactId/admins',
                isArray: true
            },
            addNote: {
                method: 'PUT',
                url: 'contacts/:contactId/notes'
            },
            deleteNote: {
                method: 'DELETE',
                url: 'contacts/:contactId/notes/:noteId'
            }
		});
	}
]);

'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		// Redirect to home view when route not found
		$urlRouterProvider.otherwise('/');

		// Home state routing
		$stateProvider.
		state('home', {
			url: '/',
			templateUrl: 'modules/core/views/home.client.view.html'
		})
		.state('create', {
		      url: '/create',
		      templateUrl: 'modules/core/views/create.client.view.html'
		})
		.state('addemployee', {
		      url: '/addemployee',
		      templateUrl: 'modules/core/views/addemployee.client.view.html'
		})
        .state('createCat', {
            url: '/cats/create',
            templateUrl: 'modules/cats/views/create-cat.client.view.html'
        })
        .state('viewCat', {
            url: '/cats/:catId',
            templateUrl: 'modules/cats/views/view-cat.client.view.html'
        })
        .state('editCat', {
            url:'/cats/:catId/edit',
            templateUrl: 'modules/cats/views/cat-edit.client.view.html'
        })
       .state('catVideos', {
            url: '/videos/:videoId',
            templateUrl: 'modules/cats/views/cat-videos.client.view.html'
        });

	}
]);

'use strict';
angular.module('core').controller('ActivationController', ['$scope', '$http', 'Dialogs',
		function($scope, $http, Dialogs) {
			$scope.create = function() {
                var admin = {
                    firstName: this.firstName,
                    surname: this.lastName,
                    password: this.password,
                    username: this.username
                };
                $http.post('/create-admin', admin).success(function() {
                    Dialogs.notify('Admin account successfully created')
                        .then(function() {
                            window.location.href = '/';
                        });
                });
			};
		}
]);

'use strict';

angular.module('core').controller('CreateController', ['$scope', 'Authentication',
	function($scope, Authentication) {
		$scope.authentication = Authentication;
	}	
]);

angular.module('core').directive('customDatepicker', function() {
    return {
        restrict: 'E',
        controller: ["$scope", function ($scope) {
            $scope.isOpen = false;
            $scope.toggle = function($event) {
                $event.preventDefault();
                $event.stopPropagation();
                $scope.isOpen = !$scope.isOpen;
            }
        }],
        templateUrl: '/modules/core/views/datepicker-popup-easy.html',
        scope: {
            selectedDate: '=?ngModel',
            unselectedText:'=?unselectedText',
            inline: '=?inline'
        }
    };
})

'use strict';

angular.module('core').controller('HeaderController', ['$scope', 'Authentication', 'Menus',
	function($scope, Authentication, Menus) {
		$scope.authentication = Authentication;
		$scope.isCollapsed = false;
		$scope.menu = Menus.getMenu('topbar');

		$scope.toggleCollapsibleMenu = function() {
			$scope.isCollapsed = !$scope.isCollapsed;
		};

		// Collapsing the menu after navigation
		$scope.$on('$stateChangeSuccess', function() {
			$scope.isCollapsed = false;
		});
	}
]);

'use strict';

angular.module('core').controller('HomeController', ['$scope', '$location', 'Authentication', 'Cats',
		function($scope, $location, Authentication, Cats) {
			$scope.authentication = Authentication;
			$scope.dateOfArrival = Date.now();

			$scope.getAge = function(cat) {
				if (cat.dateOfBirth === undefined) {
					return 'Unknown';
				}
				var dob = Date.parse(cat.dateOfBirth.toString());
				var value = (new Date() - dob) / (1000 * 60 * 60 * 24);
				if (value < 30) {
					return Math.round(value) + ' days';
				} else if (value / 30 < 24) {
					return Math.round(value/30) + ' months';
				} else return Math.round(value/365.25) + ' years';
			};

			$scope.cats = Cats.query();

			$scope.open = function($event) {
				$event.preventDefault();
				$event.stopPropagation();
				$scope.opened = true;
			};
			$scope.openArrival = function($event) {
				$event.preventDefault();
				$event.stopPropagation();
				$scope.arrivalDateOpened = true;
			};

			$scope.create = function() {
                if (this.originPerson.length !== 1) {
                    $scope.error = 'You must select an origin person';
                }
				var cat = new Cats({
					dateOfBirth: $scope.dateOfBirth,
                    dateOfBirthEstimated: $scope.dateOfBirthEstimated,
					name: $scope.name,
					sex: $scope.sex,
					vet: $scope.vet._id,
					dateOfArrival: $scope.dateOfArrival,
					breed: $scope.breed,
					color: $scope.color,
					description: $scope.description,
					temperament: $scope.temperament,
					origin: {
						address: $scope.originAddress,
						person: $scope.originPerson.length === 1 ? $scope.originPerson[0]._id : undefined,
                        organization: $scope.originOrg
					},
					currentLocation: $scope.location
				});
				return cat.$save(function(response) {
					$location.path('cats/' + response._id);
				}, function(errorResponse) {
					$scope.error = errorResponse.data.message;
				});
			};
		}
]);

var core = angular.module('core');

core.directive('notes', function() {
    return {
        restrict: 'E',
        controller: 'NotesController',
        scope: { about: '=about' },
        templateUrl: '/modules/core/views/notes.client.directive.html',
        link: function(scope, element, attrs, ctrl) { }
    };
});

core.controller('NotesController', ['$scope', 'Notes', 'Dialogs', 'Authentication',
    function($scope, Notes, Dialogs, Authentication) {

        $scope.authentication = Authentication;

        $scope.deleteNote = function(note) {
            Dialogs
                .confirm('Are you sure you want to delete this note?')
                .then(function(result) {
                    if (result) {
                        Notes.deleteNote({aboutId: $scope.about, noteId: note._id}, $scope.getNotes);
                    }
                });
        };

        $scope.getNotes = function() {
            $scope.notes = Notes.getAboutId({aboutId: $scope.about}, function(res) { console.log(res); }, function(res) { console.log(res); });
        };

        $scope.canAddNote = function() {
            return $scope.authentication && $scope.authentication.user && $scope.authentication.user.contact && $scope.newNote != '';
        };

        $scope.addNote = function() {
            if (!$scope.canAddNote()) return;
            Notes.create({aboutId: $scope.about}, {
                message: $scope.newNote,
                date: Date.now(),
                sender: $scope.authentication.user.contact
            }, function() {
                $scope.getNotes();
                $scope.newNote = '';
            });
        };

        $scope.$watch(function() { return $scope.about; }, $scope.getNotes);
    }]);

'use strict';

angular.module('core').service('Dialogs', [ '$modal', '$rootScope',
    function($modal, $rootScope) {
        /**
         * Pop up a modal asking the user to confirm or deny an action with a prompt.
         *
         * Example:
         *
         * <pre>
         *      Dialogs.confirm('Do you want to delete foo?')
         *             .then(function(result) {
         *                 if (result) {
         *                      deleteTheFoo();
         *                 }
         *             });
         * </pre>
         *
         * @param {String} message   the message to show
         * @param {Object} [options] optional object with additional options for the dialog. possible options:
         *                    trueText         the text to show in the button which corresponds to true. Default 'Yes'
         *                    falseText        the text to show in the button which corresponds to false. Default 'No'
         *                    trueButtonType   the CSS class to apply to the true button. Default 'btn-danger'
         *                    falseButtonType  the CSS class to apply to the true button. Default 'btn-success'
         *                    title            the title to show at the top of the dialog. Default 'Confirm'
         *
         * @returns a promise, with the value when resolved true iff the user clicks the 'Yes' button
         */
        this.confirm = function(message, options) {
            options = options || {};
            var modalScope = $rootScope.$new();
            modalScope.trueText = options.trueText || 'Yes';
            modalScope.falseText = options.falseText || 'No';
            modalScope.trueButtonType = options.trueButtonType || 'btn-danger';
            modalScope.falseButtonType = options.trueButtonType || 'btn-success';
            modalScope.title = options.title || 'Confirm';
            modalScope.message = message;
            return $modal.open({
                templateUrl: '/modules/core/views/confirm-dialog.client.modal.html',
                scope: modalScope
            }).result;
        };

        this.getText = function(message, options) {
            options = options || {};
            var modalScope = $rootScope.$new();
            modalScope.trueText = options.trueText || 'OK';
            modalScope.falseText = options.falseText || 'Cancel';
            modalScope.trueButtonType = options.trueButtonType || 'btn-success';
            modalScope.falseButtonType = options.trueButtonType || 'btn-default';
            modalScope.title = options.title || 'Confirm';
            modalScope.placeholder = options.placeholder || '';
            modalScope.message = message;
            return $modal.open({
                templateUrl: '/modules/core/views/dialog-get-text.client.modal.html',
                scope: modalScope
            }).result;
        };

        this.notify = function(title, message, options) {
            options = options || {};
            var modalScope = $rootScope.$new();
            modalScope.title = title || 'Notification';
            modalScope.message = message;
            return $modal.open({
                template: '<h2>{{title}}</h2><p>{{message}}</p><button type="button" class="btn btn-lg btn-success" ng-click="$close(true)">Dismiss</button>',
                scope: modalScope
            }).result;
        };
        return this;
    }
]);

var googlejs = angular.module('google', []);

googlejs.factory('googleService', ['$document', '$q', '$rootScope', '$window',
    function($document, $q, $rootScope, $window) {
        var d = $q.defer();

        var scriptTag = $document[0].createElement('script');
        scriptTag.type = 'text/javascript';
        scriptTag.async = true;
        scriptTag.src = 'https://maps.googleapis.com/maps/api/js?sensor=false&callback=googleMapsCallback';

        $window.googleMapsCallback = function() {
            $rootScope.$apply(function() { d.resolve(google); });
        }

        var s = $document[0].getElementsByTagName('body')[0];
        s.appendChild(scriptTag);

        return {
            google: function() { return d.promise; }
        };
    }]);

'use strict';

//Menu service used for managing  menus
angular.module('core').service('Menus', [

	function() {
		// Define a set of default roles
		this.defaultRoles = ['*'];

		// Define the menus object
		this.menus = {};

		// A private function for rendering decision 
		var shouldRender = function(user) {
			if (user) {
				if (!!~this.roles.indexOf('*')) {
					return true;
				} else {
					for (var userRoleIndex in user.roles) {
						for (var roleIndex in this.roles) {
							if (this.roles[roleIndex] === user.roles[userRoleIndex]) {
								return true;
							}
						}
					}
				}
			} else {
				return this.isPublic;
			}

			return false;
		};

		// Validate menu existance
		this.validateMenuExistance = function(menuId) {
			if (menuId && menuId.length) {
				if (this.menus[menuId]) {
					return true;
				} else {
					throw new Error('Menu does not exists');
				}
			} else {
				throw new Error('MenuId was not provided');
			}

			return false;
		};

		// Get the menu object by menu id
		this.getMenu = function(menuId) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Return the menu object
			return this.menus[menuId];
		};

		// Add new menu object by menu id
		this.addMenu = function(menuId, isPublic, roles) {
			// Create the new menu
			this.menus[menuId] = {
				isPublic: isPublic || false,
				roles: roles || this.defaultRoles,
				items: [],
				shouldRender: shouldRender
			};

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeMenu = function(menuId) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Return the menu object
			delete this.menus[menuId];
		};

		// Add menu item object
		this.addMenuItem = function(menuId, menuItemTitle, menuItemURL, menuItemType, menuItemUIRoute, isPublic, roles, position) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Push new menu item
			this.menus[menuId].items.push({
				title: menuItemTitle,
				link: menuItemURL,
				menuItemType: menuItemType || 'item',
				menuItemClass: menuItemType,
				uiRoute: menuItemUIRoute || ('/' + menuItemURL),
				isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].isPublic : isPublic),
				roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].roles : roles),
				position: position || 0,
				items: [],
				shouldRender: shouldRender
			});

			// Return the menu object
			return this.menus[menuId];
		};

		// Add submenu item object
		this.addSubMenuItem = function(menuId, rootMenuItemURL, menuItemTitle, menuItemURL, menuItemUIRoute, isPublic, roles, position) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item
			for (var itemIndex in this.menus[menuId].items) {
				if (this.menus[menuId].items[itemIndex].link === rootMenuItemURL) {
					// Push new submenu item
					this.menus[menuId].items[itemIndex].items.push({
						title: menuItemTitle,
						link: menuItemURL,
						uiRoute: menuItemUIRoute || ('/' + menuItemURL),
						isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].items[itemIndex].isPublic : isPublic),
						roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].items[itemIndex].roles : roles),
						position: position || 0,
						shouldRender: shouldRender
					});
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeMenuItem = function(menuId, menuItemURL) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item to remove
			for (var itemIndex in this.menus[menuId].items) {
				if (this.menus[menuId].items[itemIndex].link === menuItemURL) {
					this.menus[menuId].items.splice(itemIndex, 1);
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeSubMenuItem = function(menuId, submenuItemURL) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item to remove
			for (var itemIndex in this.menus[menuId].items) {
				for (var subitemIndex in this.menus[menuId].items[itemIndex].items) {
					if (this.menus[menuId].items[itemIndex].items[subitemIndex].link === submenuItemURL) {
						this.menus[menuId].items[itemIndex].items.splice(subitemIndex, 1);
					}
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		//Adding the topbar menu
		this.addMenu('topbar');
	}
]);

'use strict';

angular.module('core').factory('Notes', ['$resource',
	function($resource) {
		return $resource('notes/:aboutId/:noteId', {
			noteId: '@_id'
		}, {
            create: {
                method: 'POST',
                url: 'notes/:aboutId'
            },
            deleteNote: {
                method: 'DELETE',
                url: 'notes/:aboutId/:noteId'
            },
            getAboutId: {
                method: 'GET',
                url: 'notes/:aboutId',
                isArray: true
            }
		});
	}
]);

'use strict';

//Setting up route
angular.module('donations').config(['$stateProvider',
	function($stateProvider) {
		// Donations state routing
		$stateProvider.
		state('listDonations', {
			url: '/donations',
			templateUrl: 'modules/donations/views/list-donations.client.view.html'
		}).
		state('createDonation', {
			url: '/donations/create',
			templateUrl: 'modules/donations/views/create-donation.client.view.html'
		}).
		state('viewDonation', {
			url: '/donations/:donationId',
			templateUrl: 'modules/donations/views/view-donation.client.view.html'
		}).
		state('editDonation', {
			url: '/donations/:donationId/edit',
			templateUrl: 'modules/donations/views/edit-donation.client.view.html'
		});
	}
]);
'use strict';

// Donations controller
angular.module('donations').controller('DonationsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Donations', 'Dialogs', 
	function($scope, $stateParams, $location, Authentication, Donations, Dialogs) {
		$scope.authentication = Authentication;
		$scope.items=[{}];
        $scope.donations=[];

		// Create new Donation
		$scope.create = function() {
			// Create new Donation object
			var donation = new Donations ({
				//donor: this.contacts[0]._id,
                donor: $scope.donors[0]._id,                //this.donor?
                created: this.created,
                icon: $scope.icon,
                items: this.items
			});

            console.log('inside create');
			// Redirect after save
			donation.$save(function(response) {
				$location.path('donations/' + response._id);

				// Clear form fields
				$scope.name = '';
                $scope.dollarAmount = '';
                $scope.donationType = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
                console.log($scope.error);
			});
		};

		//load more elements in donations infinte scroll
		$scope.loadMore = function() {
			var nextEnd = $scope.donations.length+10;
			for(var i=$scope.donations.length; i<nextEnd; i++)
			{
				$scope.donations.push($scope.allDonations[i]);
			}
		};

		// Remove existing Donation
		$scope.remove = function(donation) {
			if ( donation ) { 
				donation.$remove();

				for (var i in $scope.donations) {
					if ($scope.donations [i] === donation) {
						$scope.donations.splice(i, 1);
					}
				}
			} else {
				$scope.donation.$remove(function() {
					$location.path('donations');
				});
			}
		};

		// Update existing Donation
		$scope.update = function() {
			var donation = $scope.donation;

			donation.$update(function() {
				$location.path('donations/' + donation._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Donations
		$scope.find = function() {
			
			$scope.allDonations = Donations.query(function(){
				$scope.donations=[];
				$scope.loadMore();
			});
		};

		// Find existing Donation
		$scope.findOne = function() {
			$scope.donation = Donations.get({ 
				donationId: $stateParams.donationId
			});
		};

		$scope.expandItems=function($thisDonation) {
			$thisDonation.isExpanded=!$thisDonation.isExpanded;
		};

		$scope.open = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.opened = true;
    	};
        
        $scope.deleteDonation = function(donation) {
                Dialogs
                        .confirm('Delete Donation?')
                        .then(function(result) {
                            if (donation && result) {

                                donation.$remove(function() {
                                    $location.path('/donations');
                                    $scope.donations = Donations.query();
                                });

                            }
                        });
                };
        
        $scope.getIcon=function(item) {
            if(item.name === 'Monetary')
            {
                item.icon='glyphicon glyphicon-usd';
                return 'glyphicon-usd';
            }
            else if(item.name === 'Food')
            {
                item.icon='glyphicon glyphicon-heart';
                return 'glyphicon-heart';
            }
            else if(item.name === 'Supplies')
            {
                item.icon='glyphicon glyphicon-wrench';
                return 'glyphicon-wrench';
            }
            else
            {
                item.icon='glyphicon glyphicon-briefcase';
                return 'glyphicon-briefcase';
            }
                
	   };
    }
]);

'use strict';

//Donations service used to communicate Donations REST endpoints
angular.module('donations').factory('Donations', ['$resource',
	function($resource) {
		return $resource('donations/:donationId', { donationId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
'use strict';

//Setting up route
angular.module('employees').config(['$stateProvider',
	function($stateProvider) {
		// Creates state routing
		$stateProvider.
		state('createEmployee', {
			url: '/employees/create',
			templateUrl: 'modules/employees/views/create-employee.client.view.html'
		}).
		state('viewEmployee', {
			url: '/employees/:employeeId',
			templateUrl: 'modules/employees/views/view-employee.client.view.html'
		}).
		state('editEmployee', {
			url: '/employees/:employeeId/edit',
			templateUrl: 'modules/employees/views/edit-employee.client.view.html'
		});
	}
]);
'use strict';

// Creates controller
angular.module('employees').controller('EmployeesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Employees',
	function($scope, $stateParams, $location, Authentication, Employees) {
		$scope.authentication = Authentication;

		// Create new Create
		$scope.create = function() {
			// Create new employee object
			//console.log(this.password);
			var employee = new Employees ({
				firstName: this.firstName,
				surname: this.surname,
				email: this.email,
				phone: this.phone,
				isAdmin: this.isAdmin,
				permissionLevel:this.permissionLevel,
				password: this.password
			});

			//console.log(employee.password);
			// Redirec after save
			employee.$save(function(response) {
				$location.path('contacts/' + user.contact);
				// Clear form fields
				$scope.firstName = '';
				$scope.surname = '';
				$scope.email = '';
				$scope.phone = '';
				$scope.isAdmin = '';

			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Create
		$scope.remove = function(employee) {
			if ( employee ) { 
				employee.$remove();

				for (var i in $scope.employees) {
					if ($scope.employees [i] === employee) {
						$scope.employees.splice(i, 1);
					}
				}
			} else {
				$scope.employee.$remove(function() {
					$location.path('employees');
				});
			}
		};

		// Update existing Create
		$scope.update = function() {
			var employee = $scope.employee;
			console.log(employee);
			employee.$update(function() {
				$location.path('employees/' + employee._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Creates
		$scope.find = function() {
			$scope.employees = Employees.query();
		};

		// Find existing Create
		$scope.findOne = function() {
			$scope.employee = Employees.get({ 
				employeeId: $stateParams.employeeId
			});
		};
	}
]);

'use strict';

//Creates service used to communicate Creates REST endpoints
angular.module('employees').factory('Employees', ['$resource',
	function($resource) {
		return $resource('employees/:employeeId', { createId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
'use strict';

// Configuring the Articles module
angular.module('images').run(['Menus',
    function(Menus) { }
]);

'use strict';

//Setting up route
angular.module('images').config(['$stateProvider',
	function($stateProvider) {
        // Contacts state routing
        $stateProvider.
            state('imageGallery', {
                url: '/images',
                templateUrl: 'modules/images/views/image-gallery.client.view.html'
            }).
            state('uploadImage', {
                url: '/image-upload',
                templateUrl: 'modules/images/views/upload-image.client.view.html'
            }).
            state('uploadVideo', {
                url: '/video-upload',
                templateUrl: 'modules/images/views/upload-video.client.view.html'
            }).
            state('editImage', {
                url: '/images/:imageId',
                templateUrl: 'modules/images/views/edit-image.client.view.html'
            }).
            state('videoGallery', {
                url: '/videos',
                templateUrl: 'modules/images/views/video-gallery.client.view.html'
            });
	}
]);

var images = angular.module('images');

images.controller('EditImageController', [
    '$scope', 'Images', '$stateParams',
    function($scope, Images, $stateParams) {
        $scope.$watch(
            function() { return $stateParams.imageId; },
            function() {
                if ($stateParams.imageId) {
                    console.log($stateParams.imageId);
                    Images.find($stateParams.imageId)
                        .then(function (response) {
                            $scope.image = response.data;
                            $scope.addSource();
                        });
                }
            });

        $scope.addSource = function() {
            var image = $scope.image;
            image.thumbnailSrc = '/images/' + image._id + '/thumbnail';
            image.originalSrc = '/images/' + image._id + '/original';
            image.largeSrc = '/images/' + image._id + '/large';
        };

        $scope.save = function() {
            Images.
                update($scope.image).
                then(function(response) {
                    $scope.image = response.data;
                },
                function(response) {
                    Dialogs.notify('Something went wrong: ' + response.data.message);
                });

        };
    }
]);


var images = angular.module('images');

images.controller('ImageGalleryController', [
    '$scope', 'Images', '$location',
    function($scope, Images, $location) {
        $scope.selectedImages = $scope.selectedImages || [];
        $scope.selectedImage = $scope.selectedImage || undefined;

        $scope.$watch('imageId', function() {
            if ($scope.imageId) {
                Images.find($scope.imageId).then(function (response) {
                    // if given a single image id then just show that id
                    $scope.images = [response.data];
                    $scope.addSources();
                });
            }
        });

        $scope.$watch('catId', function() {
            if ($scope.catId) {
                Images.forCat($scope.catId).then(function (response) {
                    // if given a cat ID only show images for that cat
                    $scope.images = response.data;
                    $scope.addSources();
                });
            }
        });

        $scope.$watch('showAll', function() {
            if ($scope.showAll) {
                Images.list().then(function (response) {
                    $scope.images = response.data;
                    $scope.addSources();
                });
            }
        });

        $scope.imageClicked = function(image) {
            if ($scope.selectMode === 'single') {
                if ($scope.selectedImage || image.selected) {
                    $scope.selectedImage.selected = false;
                }
                $scope.selectedImage = image;
                image.selected = true;
            } else if ($scope.selectMode) {
                var index = $scope.selectedImages.indexOf(image);
                if (index === -1) {
                    $scope.selectedImages.push(image);
                    image.selected = true;
                } else {
                    $scope.selectedImages.splice(index, 1);
                    image.selected = false;
                }
            } else {
                $location.path('/images/' + image._id);
            }
        };

        $scope.$watch('selectMode', function() {
            if (!$scope.selectMode) {
                for (var i = 0; i < $scope.selectedImages.length; ++i) {
                    $scope.selectedImages[i].selected = false;
                }
                $scope.selectedImages = [];
                if ($scope.selectedImage) {
                    $scope.selectedImage.selected = false;
                    $scope.selectedImage = undefined;
                }
            }
        })

        $scope.addSources = function() {
            var images = $scope.images;
            for (var i = 0; i < images.length; ++i) {
                var image = images[i];
                image.thumbnailSrc = '/images/' + image._id + '/thumbnail';
                image.originalSrc = '/images/' + image._id + '/original';
                image.largeSrc = '/images/' + image._id + '/large';
            }
        };
    }
]);

images.directive('imageGallery', [
    function() {
        return {
            restrict: 'E',
            controller: 'ImageGalleryController',
            scope: {
                imageId: '=?id',
                catId: '=?forCat',
                max: '=?max',
                selectMode: '=?selectMode',
                selectedImages: '=?selectedImages',
                selectedImage: '=?selectedImage',
                showAll: '=?showAll'
            },
            templateUrl: '/modules/images/views/image-gallery.client.directive.html',
            link: function(scope, element, attrs, ctrl) { }
        };
    }]);

var images = angular.module('images');

images.controller('ImageGalleryPageController',
    ['$scope', 'Images', 'Dialogs', function($scope, Images, Dialogs) {
        $scope.selectMode = false;
        $scope.selectedImages = [];

        $scope.toggleSelect = function() {
            $scope.selectMode = !$scope.selectMode;
        };

        $scope.deleteSelected = function() {
            Dialogs.confirm('Are you sure you want to delete ' + $scope.selectedImages.length + ' images?')
                .then(function(response) {
                    if (response) {
                        Images.deleteAll($scope.selectedImages).
                            then(function(response) {
                                console.log('got response from server');
                                window.location.reload();
                            });
                    }
                }, function(response) {
                    Dialogs.notify('Error', 'Something went wrong: ' + response.data.message);
                });
        };
    }]);

var images = angular.module('images');

images.controller('ImageUploadController',
    ['$scope', 'Images', '$http', '$location', '$upload',
        function($scope, Images, $http, $location, $upload) {

            $scope.$watch('files', function () {
                $scope.upload($scope.files);
            });

            $scope.completedUploads = 0;
            $scope.failedUploads = [];
            $scope.uploads = [];
            $scope.upload = function(files) {
                if (files && files.length) {
                    for (var i = 0; i < files.length; i++) {
                        (function(uploadIndex) {
                            var file = files[i];
                            $scope.uploads.push({
                                progress: undefined,
                                filename: file.name
                            });
                            var oldCompleted = $scope.completedUploads || 0;
                            $scope.completedUploads = 0;
                            $scope.completedUploads = oldCompleted;
                            $upload.upload({
                                url: '/upload-image',
                                fields: {},
                                file: file
                            }).progress(function (evt) {
                                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                                $scope.uploads[uploadIndex].progress = progressPercentage;
                                $scope.uploads[uploadIndex].status = 'default';
                            }).success(function (data, status, headers, config) {
                                $scope.uploads[uploadIndex].progress = 100;
                                $scope.uploads[uploadIndex].status = 'success';
                                $scope.completedUploads++;
                            }).error(function(data, status, headers, config) {
                                $scope.uploads[uploadIndex].status = 'danger';
                                $scope.failedUploads.push($scope.uploads[uploadIndex]);
                            });
                        }($scope.uploads.length));
                    }
                }
            };
        }]);

var videos = angular.module('images');

videos.controller('VideoUploadController',
    ['$scope', '$http', '$location', '$upload',
        function($scope, $http, $location, $upload) {

            $scope.$watch('files', function () {
                $scope.upload($scope.files);
            });

            $scope.completedUploads = 0;
            $scope.failedUploads = [];
            $scope.uploads = [];
            $scope.upload = function(files) {
                if (files && files.length) {
                    for (var i = 0; i < files.length; i++) {
                        (function(uploadIndex) {
                            var file = files[i];
                            $scope.uploads.push({
                                progress: undefined,
                                filename: file.name
                            });
                            var oldCompleted = $scope.completedUploads || 0;
                            $scope.completedUploads = 0;
                            $scope.completedUploads = oldCompleted;
                            $upload.upload({
                                url: '/upload-video',
                                fields: {},
                                file: file
                            }).progress(function (evt) {
                                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                                $scope.uploads[uploadIndex].progress = progressPercentage;
                                $scope.uploads[uploadIndex].status = 'default';
                            }).success(function (data, status, headers, config) {
                                $scope.uploads[uploadIndex].progress = 100;
                                $scope.uploads[uploadIndex].status = 'success';
                                $scope.completedUploads++;
                            }).error(function(data, status, headers, config) {
                                $scope.uploads[uploadIndex].status = 'danger';
                                $scope.failedUploads.push($scope.uploads[uploadIndex]);
                            });
                        }($scope.uploads.length));
                    }
                }
            };
        }]);

var videos = angular.module('images');

videos.controller('VideoGalleryController', [
    '$scope', 'Videos', '$location',
    function($scope, Videos, $location) {
        $scope.selectedVideos = $scope.selectedVideos || [];

        $scope.$watch('showAll', function() {
            if ($scope.showAll) {
                Videos.list().then(function (response) {
                    $scope.videos = response.data;
                    $scope.addSources();
                });
            }
        });

        $scope.videoClicked = function(video) {
            if ($scope.selectMode) {
                var index = $scope.selectedVideos.indexOf(video);
                if (index === -1) {
                    $scope.selectedVideos.push(video);
                    video.selected = true;
                } else {
                    $scope.selectedVideos.splice(index, 1);
                    video.selected = false;
                }
            } else {
                $location.path('/videos/' + video._id);
            }
            console.log($scope.selectedVideos);
        };

        $scope.$watch('selectMode', function() {
            if (!$scope.selectMode) {
                for (var i = 0; i < $scope.selectedVideos.length; ++i) {
                    $scope.selectedVideos[i].selected = false;
                }
                $scope.selectedVideos = [];
                if ($scope.selectedVideo) {
                    $scope.selectedVideo.selected = false;
                    $scope.selectedVideo = undefined;
                }
            }
        })
    }
]);

videos.directive('videoGallery', [
    function() {
        return {
            restrict: 'E',
            controller: 'VideoGalleryController',
            scope: {
                max: '=?max',
                selectMode: '=?selectMode',
                selectedVideos: '=?selectedVideos',
                showAll: '=?showAll'
            },
            templateUrl: '/modules/images/views/video-gallery.client.directive.html',
            link: function(scope, element, attrs, ctrl) { }
        };
    }]);

var images = angular.module('images');

images.controller('VideoGalleryPageController',
    ['$scope', 'Videos', 'Dialogs', function($scope, Videos, Dialogs) {
        $scope.selectMode = false;
        $scope.selectedVideos = [];

        $scope.toggleSelect = function() {
            $scope.selectMode = !$scope.selectMode;
        };

        $scope.deleteSelected = function() {
            Dialogs.confirm('Are you sure you want to delete ' + $scope.selectedVideos.length + ' videos?')
                .then(function(response) {
                    if (response) {
                        Videos.deleteAll($scope.selectedVideos).
                            then(function(response) {
                                console.log('got response from server');
                                window.location.reload();
                            });
                    }
                }, function(response) {
                    Dialogs.notify('Error', 'Something went wrong: ' + response.data.message);
                });
        };
    }]);

'use strict';

//Creates service used to communicate Creates REST endpoints
angular.module('images')
    .factory('Images', ['$http', function($http) {
        return {
            list: function() {
                return $http.get('/images');
            },
            create: function(image) {
                return $http.post('/images', image);
            },
            find: function(imageId) {
                return $http.get('/images/' + imageId);
            },
            update: function(image) {
                return $http.put('/images/' + image._id, image);
            },
            forCat: function(catId) {
                return $http.get('/cats/' + catId + '/images');
            },
            deleteAll: function(images) {
                return $http.post('/delete-images', { images: images });
            }
        };
    }
    ]);


'use strict';

//Creates service used to communicate Creates REST endpoints
angular.module('images')
    .factory('Videos', ['$http', function($http) {
        return {
            list: function() {
                return $http.get('/videos');
            },
            create: function(image) {
                return $http.post('/videos', image);
            },
            find: function(imageId) {
                return $http.get('/videos/' + imageId);
            },
            update: function(image) {
                return $http.put('/videos/' + image._id, image);
            },
            forCat: function(catId) {
                return $http.get('/cats/' + catId + '/videos');
            },
            deleteAll: function(videos) {
                console.log(videos);
                return $http.post('/delete-videos', { images: videos });
            }
        };
    }
    ]);


'use strict';

angular.module('reports').run(['Menus',
    function(Menus) {
        // Set top bar menu items
    }
]);

'use strict';

//Setting up route
angular.module('reports', ['ui.router']).config(['$stateProvider',
	function($stateProvider) {
		// Contacts state routing
		$stateProvider.state('exportIndex', {
			url: '/export',
			templateUrl: 'modules/reports/views/export-index.client.view.html'
		});
        $stateProvider.state('catSearch', {
            url: '/search/cats',
            templateUrl: 'modules/reports/views/cat-search.client.view.html'
        });
        $stateProvider.state('savedCatSearch', {
            url: '/search/cats/:reportId',
            templateUrl: 'modules/reports/views/cat-search.client.view.html'
        });
	}
]);

var reports = angular.module('reports');
reports.controller('ExportIndexController',
    ['$scope', 'Dialogs', 'Reports',
        function($scope, Dialogs, Reports) {

            Reports.list()
                .success(function(reports) {
                    $scope.searches = reports;
                });
        }
    ]);

var app = angular.module('reports');

app.controller('CatSearchController', ['$scope', 'Cats', 'Reports', 'Dialogs', '$stateParams',
    function($scope, Cats, Reports, Dialogs, $stateParams) {
        $scope.possibleShots = possibleShots;
        $scope.searchResults = [];
        $scope.search = {
            filters: [],
            matchType: 'all',
            resultType: 'Cat'
        };

        if ($stateParams.reportId) {
            Reports.find($stateParams.reportId)
                .success(function(report) {
                    $scope.search = report;
                })
                .error(function(error) {
                    Dialogs.notify('Error', error.message);
                });
        }

        $scope.invertValues = [{value: false, text: 'Include only'}, {value: true, text: 'Exclude all'}];

        $scope.getResult = function() {
            Reports.resultOfImmediate($scope.search)
                .success(function(result) {
                    $scope.searchResults = result;
                })
                .error(function(error) {
                    Dialogs.notify('Error', error.message);
                });
        };

        $scope.saveDialog = function() {
            Dialogs.getText('Enter a name to save the report with.')
                .then(function(result) {
                    if (result) {
                        $scope.save(result);
                    }
                });
        };

        $scope.save = function(name) {
            $scope.search.name = name;
            if ($scope.search._id) {
                Reports.update($scope.search);
            } else {
                Reports.create($scope.search);
            }
        };

        $scope.export = function() {
            if ($scope.search._id) {
                window.location.href = '/reports/' + $scope.search._id + '/result.csv';
            } else {

            }
        };
    }]);

'use strict';

//Creates service used to communicate Creates REST endpoints
angular.module('reports')
    .factory('Reports', ['$http', function($http) {
		return {
            list: function() {
                return $http.get('/reports');
            },
            create: function(report) {
                return $http.post('/reports', report);
            },
            resultOfImmediate: function(report) {
                return $http.post('/reports/result-of', report);
            },
            resultOf: function(reportId) {
                return $http.get('/reports/' + reportId + '/result');
            },
            find: function(reportId) {
                return $http.get('/reports/' + reportId);
            },
            update: function(report) {
                return $http.put('/reports/' + report._id, report);
            }
        };
	}
]);

'use strict';

//Setting up route
angular.module('stats').config(['$stateProvider',
	function($stateProvider) {
		$stateProvider.
		state('listStats', {
			url: '/stats',
			templateUrl: 'modules/stats/views/list-stats.client.view.html'
		}).
		state('catOriginMapStats', {
			url: '/stats/originMap',
			templateUrl: 'modules/stats/views/cat-origins-map.client.view.html'
		}).
		state('mapStats', {
			url: '/stats/map',
			templateUrl: 'modules/stats/views/stats-map.client.view.html'
		});
	}
]);

'use strict';
angular.module('stats').directive('adopterMap', ["Contacts", "googleService", function(Contacts, googleService) {
    var addresses = [];
    var latlong = [];
    var adopterWithAddress = [];
    var streets = [];
    var citiesStatesZipCodes = [];
    // directive link function
    var link = function(scope, element, attrs) {
        googleService.google().then(function(google) {
            console.log(google);
            var geocoder = new google.maps.Geocoder();
            var map, infoWindow;
            var markers = [];

            // map config
            var mapOptions = {
                center: new google.maps.LatLng(30, -78),
                zoom: 4,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                scrollwheel: false
            };

            // init the map
            function initMap() {
                var adopters = Contacts.getAllAdopters(function() {
                    var i;
                    for(i = 0; i < adopters.length; i++) {
                        adopterWithAddress.push(adopters[i].firstName + ' ' + adopters[i].surname);
                        streets.push(adopters[i].address);
                        citiesStatesZipCodes.push(adopters[i].city + ', ' + adopters[i].state + ' ' + adopters[i].zipCode);
                        addresses.push(adopters[i]. address + ', ' + adopters[i].city + ', ' + adopters[i].state + ' ' + adopters[i].zipCode);
                    }
                    i = 0;
                    for(var j = 0; j < addresses.length; j++) {
                        console.log('5');
                        codeAddress(addresses[j], i);
                        i = i + 1;
                    }

                });

                if (map === void 0) {
                    map = new google.maps.Map(element[0], mapOptions);
                }
            }

            // place a marker
            function setMarker(map, position, title, content) {
                googleService.google().then(function(google) {
                    var marker;
                    var markerOptions = {
                        position: position,
                        map: map,
                        title: title,
                        icon: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png'
                    };

                    marker = new google.maps.Marker(markerOptions);
                    markers.push(marker); // add marker to array

                    google.maps.event.addListener(marker, 'click', function () {
                        // close window if not undefined
                        if (infoWindow !== void 0) {
                            infoWindow.close();
                        }
                        // create new window
                        var infoWindowOptions = {
                            content: content
                        };
                        infoWindow = new google.maps.InfoWindow(infoWindowOptions);
                        infoWindow.open(map, marker);
                    });
                });
            }
            function codeAddress(address, i) {
                geocoder.geocode( { 'address': address}, function(results, status) {
                    if (status === google.maps.GeocoderStatus.OK) {
                        var p = results[0].geometry.location;
                        setMarker(map, p, '', adopterWithAddress[i] + '<br/>' + streets[i] + '<br/>' + citiesStatesZipCodes[i]);
                    } else {
                        alert('Geocode was not successful for the following reason: ' + status);
                    }
                });
            }

            // show the map and place some markers
            initMap();
        });
    };

    return {
        restrict: 'A',
        template: '<div id="gmaps"></div>',
        replace: true,
        link: link
    };
}]);

angular.module('stats').directive('originsMap', ["Cats", "googleService", function(Cats, googleService) {
    var addresses = [];
    var latlong = [];
    var catWithAddress = [];
    // directive link function
    var link = function(scope, element, attrs) {
        var map, infoWindow;
        var markers = [];

        googleService.google().then(function(google) {
        var geocoder = new google.maps.Geocoder();
            // map config
            var mapOptions = {
                center: new google.maps.LatLng(30, -78),
                zoom: 4,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                scrollwheel: false
            };

            // init the map
            function initMap() {
                var cats = Cats.query(function() {
                    var i = 0;
                    for (i = 0; i < cats.length; i++) {
                        catWithAddress.push(cats[i].name);
                        addresses.push(cats[i].origin.address);
                    }
                    i = 0;
                    for (var j = 0; j < addresses.length; j++) {
                        console.log('5');
                        codeAddress(addresses[j], i);
                        i = i + 1;
                    }

                });
                console.log('ADDRESSES: ' + addresses.length + addresses[0]);
                if (map === void 0) {
                    map = new google.maps.Map(element[0], mapOptions);
                }
            }

            // place a marker
            function setMarker(map, position, title, content) {

                var marker;
                var markerOptions = {
                    position: position,
                    map: map,
                    title: title,
                    icon: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png'
                };

                marker = new google.maps.Marker(markerOptions);
                markers.push(marker); // add marker to array

                google.maps.event.addListener(marker, 'click', function () {
                    // close window if not undefined
                    if (infoWindow !== void 0) {
                        infoWindow.close();
                    }
                    // create new window
                    var infoWindowOptions = {
                        content: content
                    };
                    infoWindow = new google.maps.InfoWindow(infoWindowOptions);
                    infoWindow.open(map, marker);
                });
            }
            function codeAddress(address, i) {
                geocoder.geocode( { 'address': address}, function(results, status) {
                    if (status === google.maps.GeocoderStatus.OK) {
                        var p = results[0].geometry.location;
                        setMarker(map, p, '', catWithAddress[i] + '<br/>' + addresses[i]);
                    } else {
                        alert('Geocode was not successful for the following reason: ' + status);
                    }
                });
            }

            // show the map and place some markers
            initMap();
        });
    };

    return {
        restrict: 'A',
        template: '<div id="gmaps"></div>',
        replace: true,
        link: link
    };
}]);

'use strict';

// Config HTTP Error Handling
angular.module('users').config(['$httpProvider',
	function($httpProvider) {
		// Set the httpProvider "not authorized" interceptor
		$httpProvider.interceptors.push(['$q', '$location', 'Authentication',
			function($q, $location, Authentication) {
				return {
					responseError: function(rejection) {
						switch (rejection.status) {
							case 401:
								// Deauthenticate the global user
								Authentication.user = null;

								// Redirect to signin page
								$location.path('signin');
								break;
							case 403:
								// Add unauthorized behaviour 
								break;
						}

						return $q.reject(rejection);
					}
				};
			}
		]);
	}
]);
'use strict';

// Setting up route
angular.module('users').config(['$stateProvider',
	function($stateProvider) {
		// Users state routing
		$stateProvider.
		state('password', {
			url: '/settings/password',
			templateUrl: 'modules/users/views/settings/change-password.client.view.html'
		}).
		state('signin', {
			url: '/signin',
			templateUrl: 'modules/users/views/authentication/signin.client.view.html'
		}).
		state('forgot', {
			url: '/password/forgot',
			templateUrl: 'modules/users/views/password/forgot-password.client.view.html'
		}).
		state('reset-invalid', {
			url: '/password/reset/invalid',
			templateUrl: 'modules/users/views/password/reset-password-invalid.client.view.html'
		}).
		state('reset-success', {
			url: '/password/reset/success',
			templateUrl: 'modules/users/views/password/reset-password-success.client.view.html'
		}).
		state('reset', {
			url: '/password/reset/:token',
			templateUrl: 'modules/users/views/password/reset-password.client.view.html'
		});
	}
]);
'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$http', '$location', 'Authentication',
	function($scope, $http, $location, Authentication) {
		$scope.authentication = Authentication;

		// If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');
		$scope.signin = function() {
			$http.post('/auth/signin', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

angular.module('users').controller('PasswordController', ['$scope', '$stateParams', '$http', '$location', 'Authentication',
	function($scope, $stateParams, $http, $location, Authentication) {
		$scope.authentication = Authentication;

		//If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		// Submit forgotten password account id
		$scope.askForPasswordReset = function() {
			$scope.success = $scope.error = null;

			$http.post('/auth/forgot', $scope.credentials).success(function(response) {
				// Show user success message and clear form
				$scope.credentials = null;
				$scope.success = response.message;

			}).error(function(response) {
				// Show user error message and clear form
				$scope.credentials = null;
				$scope.error = response.message;
			});
		};

		// Change user password
		$scope.resetUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/auth/reset/' + $stateParams.token, $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.passwordDetails = null;

				// Attach user profile
				Authentication.user = response;

				// And redirect to the index page
				$location.path('/password/reset/success');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

angular.module('users').controller('SettingsController', ['$scope', '$http', '$location', 'Users', 'Authentication',
	function($scope, $http, $location, Users, Authentication) {
		$scope.user = Authentication.user;

		// If user is not signed in then redirect back home
		if (!$scope.user) $location.path('/');

		// Update a user profile
		/*
		possible extra code, should be deletable, commented out for saftey.

		$scope.updateUserProfile = function(isValid) {
			if (isValid) {
				$scope.success = $scope.error = null;
				var user = new Users($scope.user);

				user.$update(function(response) {
					$scope.success = true;
					Authentication.user = response;
				}, function(response) {
					$scope.error = response.data.message;
				});
			} else {
				$scope.submitted = true;
			}
		};*/

		// Change user password
		$scope.changeUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/users/password', $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.passwordDetails = null;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

// Authentication service for user variables
angular.module('users').factory('Authentication', [
	function() {
		var _this = this;

		_this._data = {
			user: window.user
		};

		return _this._data;
	}
]);
'use strict';

// Users service used for communicating with the users REST endpoint
angular.module('users').factory('Users', ['$resource',
	function($resource) {
		return $resource('users', {}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
'use strict';

// Configuring the Articles module
angular.module('volunteers').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Volunteers', 'volunteers', 'dropdown', '/volunteers(/create)?');
		Menus.addSubMenuItem('topbar', 'volunteers', 'List Volunteers', 'volunteers');
		Menus.addSubMenuItem('topbar', 'volunteers', 'New Volunteer', 'volunteers/create');
	}
]);
'use strict';

//Setting up route
angular.module('volunteers').config(['$stateProvider',
	function($stateProvider) {
		// Volunteers state routing
		$stateProvider.
		state('listVolunteers', {
			url: '/allvolunteers',
			templateUrl: 'modules/volunteers/views/all-volunteers.client.view.html'
		});
	}
]);


'use strict';
// Volunteers controller
angular.module('volunteers').controller('VolunteerHours', ['$scope', '$stateParams', '$location', 'Authentication', 'Volunteers' ,
    function($scope, $stateParams, $location, Authentication, Volunteers) {
        $scope.authentication = Authentication;
        /*
        *code below gives errors when uncommented
        *
        *
        
        $scope.getMinutesWorked(firstDate, lastDate){
            return volunteer.minutesWorked(firstDate, lastDate);
        }
        */

    }
]);


'use strict';
angular.module('volunteers').controller('VolunteersController', ['$scope', '$stateParams', '$location', 'Authentication', 'Volunteers', '$modal', '$log' ,
    function($scope, $stateParams, $location, Authentication, Volunteers, $modal, $log) {
        $scope.authentication = Authentication;
        $scope.Math = Math;
        $scope.modalUpdate = function (size, selectedVolunteer) {
            $scope.selectedVolunteer = selectedVolunteer;
            var modalInstance = $modal.open({
                templateUrl: 'modules/volunteers/views/view-volunteer.client.view.html',
                controller: ["$scope", "$modalInstance", "volunteer", function ($scope, $modalInstance, volunteer) {
                    $scope.volunteer = volunteer;
                    $scope.contact = volunteer.contact;
                    $scope.currTime = new Date();
                    setTimeout($modalInstance.dismiss, 4000);
                }] ,
                size: size,
                resolve: {
                    volunteer: function () {
                        return $scope.selectedVolunteer;
                    }
                }
            });
            modalInstance.result.then(function (selectedItem) {
                $scope.selected = selectedItem;
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };
        $scope.sign = function() {
            var correctVolunteer = Volunteers.getByName({contactId:$scope.contact[0]._id}, function(){
                console.log(correctVolunteer);

                if (correctVolunteer.length === 0) {
                    console.log('Creating new volunteer session');
                    //create new volunteer
                    var volunteer = new Volunteers( {
                        contact: $scope.contact[0]._id,
                        timeIn: Date.now()
                    });
                    volunteer.$save(function(response) {
                        $scope.contact = [];
                        $scope.modalUpdate('lg', volunteer);
                    }, function(errorResponse) {
                        $scope.error = errorResponse.data.message;
                        //console.log(errorResponse);
                    });
                } else {
                    console.log('Ending existing volunteer session');
                    correctVolunteer[0].timeOut = Date.now();
                    correctVolunteer[0].$update(function(response) {
                        $scope.modalUpdate('lg', correctVolunteer[0]);
                        $scope.contact = [];
                    }, function(errorResponse) {
                        $scope.error = errorResponse.data.message;
                        //console.log(errorResponse);
                    });
                }
            });
        };
        $scope.remove = function(volunteer) {
            if ( volunteer ) {
                volunteer.$remove();
                for (var i in $scope.volunteers) {
                    if ($scope.volunteers [i] === volunteer) {
                        $scope.volunteers.splice(i, 1);
                    }
                }
            } else {
                $scope.volunteer.$remove(function() {
                    $location.path('volunteers');
                });
            }
        };
        $scope.update = function() {
            var volunteer = $scope.volunteer;
            volunteer.$update(function() {
                $location.path('volunteers/' + volunteer._id);
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };
        $scope.find = function() {
            $scope.volunteers = Volunteers.query();
        };
        $scope.makeName = function(firstname, surname) {
            return firstname + ' ' + surname;
        };
        this.modalConfirm = function (size, volunteerName) {
            var modalInstance = $modal.open({
                templateUrl: 'modules/volunteers/views/edit-volunteer.client.view.html',
                controller: 'ModalInstanceCtrl',
                size: size,
                resolve: {
                    items: function () {
                        return $scope.items;
                    }
                }
            });
            modalInstance.result.then(function (selectedItem) {
                $scope.selected = selectedItem;
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };
        $scope.findOne = function() {
            $scope.volunteer = Volunteers.get({
                volunteerId: $stateParams.volunteerId
            });
        };
        $scope.date = new Date();
    }
]);


'use strict';

//Volunteers service used to communicate Volunteers REST endpoints
angular.module('volunteers').factory('Volunteers', ['$resource',
	function($resource) {
		return $resource('volunteers/:volunteerId', { volunteerId: '@_id'
		}, {
			update: {
				method: 'PUT'
			},

            getByName: {
                method: 'GET',
                url: '/volunteers/by-name/:contactId',
                isArray: true
            },
            minutesWorked: {
                method: 'GET',
                url: '/volunteers/get-minutes/:contactId/:startDate/:endDate',
                isArray: false
            }
		});
	}
]);
