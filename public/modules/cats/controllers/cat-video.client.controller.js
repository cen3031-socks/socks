'use strict';
angular.module('core', [
    "ngSanitize",
    "com.2fdevs.videogular"
    ]
)
    .controller('CatVideoController',
    ['$scope', '$stateParams', 'Authentication', 'Cats', '$modal', '$location', '$rootScope', 'Contacts', 'Dialogs', '$sce',
        function($scope, $stateParams, Authentication, Cats, $modal, $location, $rootScope, Contacts, Dialogs, $sce) {

            $scope.config = {
                preload: "none",
                sources: [
                    {src: $sce.trustAsResourceUrl("http://static.videogular.com/assets/videos/videogular.mp4"), type: "video/mp4"},
                    {src: $sce.trustAsResourceUrl("http://static.videogular.com/assets/videos/videogular.webm"), type: "video/webm"},
                    {src: $sce.trustAsResourceUrl("http://static.videogular.com/assets/videos/videogular.ogg"), type: "video/ogg"}
                ],
                tracks: [
                    {
                        src: "http://www.videogular.com/assets/subs/pale-blue-dot.vtt",
                        kind: "subtitles",
                        srclang: "en",
                        label: "English",
                        default: ""
                    }
                ],
                theme: "bower_components/videogular-themes-default/videogular.css"

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
        }]
);

