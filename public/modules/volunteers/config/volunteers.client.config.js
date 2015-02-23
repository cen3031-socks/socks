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