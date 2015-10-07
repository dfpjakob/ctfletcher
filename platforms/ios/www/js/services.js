'use strict';

/* Services */

angular.module('myApp.services', [])
  .factory('TipsService', function() {
    var serviceInstance = {};
    serviceInstance.getTip = function(nthTip) {
      if (nthTip < 0 || nthTip > tips.length) {
        nthTip = 0;
      }
      return tips[nthTip];
    }
    serviceInstance.numTips = function() {
      return tips.length;
    }
    return serviceInstance;
  })
  .factory('LogService', function() {
    var serviceInstance = {};
    serviceInstance.log = function(result) {
      var strResult = "";
      if(typeof result === 'object') {
        strResult = JSON.stringify(result);
      } else {
        strResult = result;
      }
      console.log(strResult);
    };
    return serviceInstance;
  }) 
  .factory('MyService', function() {
    var serviceInstance = {unlocked:[]};
    serviceInstance.isUnlocked = function(id) {
console.log(id);
console.log(window.localStorage.getItem("unlocked_"+id) || false);
      return window.localStorage.getItem("unlocked_"+id) || false;
    };

    serviceInstance.unlock = function(id) {
      window.localStorage.setItem("unlocked_"+id, 'true');
console.log('unlocked');
console.log('unlocked_'+id);
    };
    return serviceInstance;
  })
    .factory('phonegapReady', function ($rootScope) {
      return function (fn) {
        var queue = [];

        var impl = function () {
          console.log('ARGS:'+JSON.stringify(arguments));
          queue.push(Array.prototype.slice.call(arguments));
        };

        document.addEventListener('deviceready', function () {
          queue.forEach(function (args) {
            fn.apply(this, args);
          });
          impl = fn;
        }, false);
        
        return function () {
          return impl.apply(this, arguments);
        };
      };
    })

    .factory('MotivationTracks', ['$rootScope', 'phonegapReady', 'LogService',
      function ($rootScope, phonegapReady, LogService) {
        return {
          query: function() {
            return motivationTracks;
          },
          get: function(index) {
            return motivationTracks[index];
          },
          getBySKU: function(sku) {
            var len = motivationTracks.length;
            for (var i = 0; i<len; i++) {
              if (motivationTracks[i].sku === sku) {
                return motivationTracks[i];
              }
            }
            return null;
          },
          check: phonegapReady(function(onSuccess) {

            window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
              var len = motivationTracks.length;
              //alert('reading directory');
              for (var i = 0; i<len; i++) {
                var track = motivationTracks[i];

                (function(track) {
                  if (track.downloadUrl) {

                    //if (track.owned) {
                      //track.owned = true;
console.log('before filesystemroot');
//FIXME:  added / infront of ctfletcher
                      fileSystem.root.getFile("/ctfletcher/"+track.localFile, null, function(stuff){
LogService.log(stuff);
                        track.ready = true;
console.log('getFile track.ready set to true');
                        $rootScope.$apply();
                      }, function(failResult) { LogService.log('fail rootgetfile'); LogService.log(failResult); }  );

                    //}

                  } else {
                    track.ready = true;
                    track.owned = true;
                    $rootScope.$apply();
                  }

                })(track);

              }

              onSuccess();
            });
          })
        };
      }
    ])
    .factory('IAP', ['$q', '$rootScope','phonegapReady','MotivationTracks',
      function ($q, $rootScope, phonegapReady, MotivationTracks) {
        return {
          init: function() {
            var defer = $q.defer();
var that = this;
            document.addEventListener('deviceready', function () {
              if (device.platform == 'Android') {
              inappbilling.init(function() {
                inappbilling.getPurchases(function(items) {

                  var itemLen = items.length;
                  for (var i = 0; i<itemLen; i++) {
                    var track = MotivationTracks.getBySKU(items[i].productId);
                    if (track !== null) {
                      track.owned = true;
                      $rootScope.$apply();
                    }
                  }
                  MotivationTracks.check(function() {
                    defer.resolve();
                  });

                }, function() {
                  defer.resolve();
                });
                /*inappbilling.getAvailableProducts(successHandler, errorHandler);*/
              }, function(){
                defer.resolve();
              }, {showLog:true});  
            } else {
// temp for ios platform until billing is fixed
console.log('1');
console.log('2');
that.iosLoad(function() { defer.resolve(); });
//that.bar();
//defer.resolve();
            }
            }, false);
            

            return defer.promise;
          },
bar: function() {
console.log('bar');
},
//TODO get rid of motivationPacks references, not necessary
          get: function(index) {
            return motivationPacks[index];
          },
          getBySKU: function(sku) {
            var len = motivationPacks.length;
            for (var i = 0; i<len; i++) {
              if (motivationPacks[i].sku === sku) {
                return motivationPacks[i];
              }
            }
            return null;
          },

          iosLoad: phonegapReady(function(onSuccess) {
var that = this;
            // Check availability of the storekit plugin
console.log('here1');

            if (!window.storekit) {
              console.log("In-App Purchases not available");
              return;
            }

console.log('here2');

            // Initialize
            storekit.init({
              debug:    true, // Enable IAP messages on the console
              ready:    that.iosOnReady,
              purchase: that.iosOnPurchase,
              restore:  that.iosOnRestore,
              error:    that.iosOnError
            });
/*testing
*/
            onSuccess();
          }),

          // StoreKit's callbacks 
          iosOnReady: function () {

var motivationTracks = MotivationTracks.query();
var len = motivationTracks.length;
for (var i = 0; i<len; i++) {
  motivationTracks[i].owned = true;
  if (motivationTracks[i].downloadUrl) {
    console.log('ios init , url = ' + motivationTracks[i].downloadUrl);
  } else {
    motivationTracks[i].ready = true;
  }
}

          },
          iosOnPurchase: function () {},
          iosOnRestore: function () {},
          iosOnError: function () {}

        };
      }
    ])
    .factory('AudioPlayer', ['$rootScope', 'LogService', function($rootScope, LogService) {
      var player = {
        current: {},
        playing: false,
        media: null,
        mediatimer: null,
        currentTime: 0,
        duration: 0,
        pause: function() {
console.log('pause called');
console.log('media = ' + this.media);
          if (this.media != null) {
            this.media.pause();
            this.playing = false;
console.log('this.media.pause()');
          }
        },
        play: function(track) {

          var self = this;
          self.stop();
          this.current = track;

          var trackPath;

          if (device.platform == 'Android') {
            trackPath = "file:///android_asset/www/" + track.src;
          } else {
            trackPath = track.src;
          }

          var fail = function(error) {
            console.log(error);
          };

          var playTrack = function(path) {
            self.duration = -1;
            self.currentTime = -1;
            track.playback = 0;

            self.media = new Media(path, 
              function() {
              }, 
              function(error){
                LogService.log(error);
              },
              function(status) {
                if (status === Media.MEDIA_STOPPED) {
                  self.playing = false;
                  self.current = {};
                }
              }
            );
            self.media.play();
            self.playing = true;

            clearInterval(self.mediatimer);
            
            self.mediatimer = setInterval(function() {
              self.duration = self.media.getDuration();
              self.media.getCurrentPosition(
                // success callback
                function(position) {
                  if (position > -1) {
                    self.currentTime = position;
                    track.playback = position/self.duration;
                    //console.log('duration: '+self.duration+', time:'+position+', percent: '+track.playback+'%');
                    //console.log('track: '+track.playback);
                    $rootScope.$apply();
                  }
                },
                // error callback
                function(e) {
                  console.log("Error getting pos=" + e);
                }
              );
            }, 500);
          };

          var loadTrack = function(dirEntry) {
            var localFileName = track.localFile;
            dirEntry.getFile(localFileName, {create: true, exclusive: false}, function(fileEntry) {
              var localPath = fileEntry.fullPath;
              if (device.platform === "Android" && localPath.indexOf("file://") === 0) {
                  localPath = localPath.substring(7);
              }
              playTrack(localPath);
            }, fail);
          };

          if(typeof Media !== "undefined") {
            if (track.localFile) {
              window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
                fileSystem.root.getDirectory("ctfletcher", {create: true, exclusive: false},
                    loadTrack, function (error) {
                       console.log(error.code);
                    }
                );
              }, fail); 
            } else {
              playTrack(trackPath);
            }
                        
          } else {
            alert('no audio support');
          }
          
        },
        stop: function(){
          // comented out to allow resuming of last played trakc this.current = {};

          if (this.media) {
            this.media.stop();
          }
        }
      };

      return player;
    }])


  .value('version', '0.1');
