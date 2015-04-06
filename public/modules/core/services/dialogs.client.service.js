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
            var options = options || {};
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

        this.notify = function(message, options) {
            var options = options || {};
            var modalScope = $rootScope.$new();
            modalScope.title = options.title || 'Notification';
            modalScope.message = message;
            return $modal.open({
                template: '<h2>{{title}}</h2><p>{{message}}</p><button type="button" class="btn btn-lg btn-success" ng-click="$close(true)">Dismiss</button>',
                scope: modalScope
            }).result;
        };
        return this;
    }
]);
