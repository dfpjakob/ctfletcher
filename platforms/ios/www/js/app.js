'use strict';

function successHandler (result) {
  var strResult = "";
  if(typeof result === 'object') {
    strResult = JSON.stringify(result);
  } else {
    strResult = result;
  }
  alert("SUCCESS: \r\n"+strResult );
}

function errorHandler (error) {
  alert("ERROR: \r\n"+error );
}

// fastclick interfering with slider
/*
window.addEventListener('load', function() {
  FastClick.attach(document.body);
}, false);
*/

// Declare app level module which depends on filters, and services
angular.module('myApp', [
  'ngRoute',
  'ui.slider',
  'myApp.filters',
  'myApp.services',
  'myApp.directives',
  'myApp.controllers',
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/testslider', {templateUrl: 'partials/testslider.html', controller:'TestSlider'});
//  $routeProvider.when('/home', {templateUrl: 'partials/home.html', controller: 'Home' });

  $routeProvider.when('/home', {templateUrl: 'partials/home.html', controller: 'Home', 
       resolve: {
          myApp: function(IAP) {
              return IAP.init();
          }
       }
  });

  $routeProvider.when('/motivation', {templateUrl: 'partials/motivation.html', controller: 'Home'});
  $routeProvider.when('/tips', {templateUrl: 'partials/tips.html', controller: 'Tips'});
  $routeProvider.when('/tips/:nthTip', {templateUrl: 'partials/tips.html', controller: 'Tips'});
  $routeProvider.when('/workouts', {templateUrl: 'partials/workouts.html', controller: 'Workout'});
  $routeProvider.when('/workouts/powerlifting', {templateUrl: 'partials/workouts/powerlifting.html', controller: 'Workout'});
  $routeProvider.when('/workouts/bodybuilding', {templateUrl: 'partials/workouts/bodybuilding.html', controller: 'Workout'});
  $routeProvider.when('/workouts/psycho_rep', {templateUrl: 'partials/workouts/psycho_rep.html', controller: 'Workout'});
  $routeProvider.when('/workouts/rest', {templateUrl: 'partials/workouts/rest.html', controller: 'Workout'});
  $routeProvider.when('/workouts/powerlifting/chest', {templateUrl: 'partials/workouts/powerlifting/chest.html', controller: 'Workout'});
  $routeProvider.when('/workouts/powerlifting/chest-ct', {templateUrl: 'partials/workouts/powerlifting/chest-ct.html', controller: 'Workout'});
  $routeProvider.when('/workouts/powerlifting/back', {templateUrl: 'partials/workouts/powerlifting/back.html', controller: 'Workout'});
  $routeProvider.when('/workouts/powerlifting/back-ct', {templateUrl: 'partials/workouts/powerlifting/back-ct.html', controller: 'Workout'});
  $routeProvider.when('/workouts/powerlifting/legs', {templateUrl: 'partials/workouts/powerlifting/legs.html', controller: 'Workout'});
  $routeProvider.when('/workouts/powerlifting/legs-ct', {templateUrl: 'partials/workouts/powerlifting/legs-ct.html', controller: 'Workout'});
  $routeProvider.otherwise({redirectTo: '/home'});

}]);



