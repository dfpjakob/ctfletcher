'use strict';

/* Controllers */

angular.module('myApp.controllers', [])
  
  .controller('Home', ['$scope', '$rootScope', '$location', 'MyService', 'MotivationTracks', 'AudioPlayer', 'LogService', 'IAP', function($scope, $rootScope, $location, MyService, MotivationTracks, AudioPlayer, LogService, IAP) {
    $scope.isUnlockedTips = MyService.isUnlocked('feature_tips');
    $scope.isUnlockedWorkouts = MyService.isUnlocked('feature_workouts');
    $scope.tipsUrl = 'partials/locked_tips.html'; // default to locked 
    $scope.workoutsUrl = 'partials/locked_workouts.html';
    $scope.tipsUrl = $scope.isUnlockedTips ? 'partials/unlocked_tips.html' : 'partials/locked_tips.html';
    $scope.workoutsUrl = $scope.isUnlockedWorkouts ? 'partials/unlocked_workouts.html' : 'partials/locked_workouts.html';


    $scope.modalShown = false;
    $scope.toggleModal = function() {
      $scope.modalShown = !$scope.modalShown;
      console.log('modal toggled');
    };

    $scope.modalShown2 = false;
    $scope.toggleModal2 = function() {
      $scope.modalShown2 = !$scope.modalShown2;
      console.log('modal2 toggled');
    };

    $scope.modalShown3 = false;
    $scope.toggleModal3 = function() {
      $scope.modalShown3 = !$scope.modalShown3;
      $scope.restorePurchasesCompleted = '';
    };

// start in app purchase logic
    $scope.logResult = function(result) {
      var strResult = "";
      if(typeof result === 'object') {
        strResult = JSON.stringify(result);
      } else {
        strResult = result;
      }
      console.log(strResult);
    };
    $scope.refreshPurchaseStatus = function() {
      $scope.tipsUrl = MyService.isUnlocked('feature_tips') ? 'partials/unlocked_tips.html' : 'partials/locked_tips.html';  // changes to this variable are automatically watched by a partial
      $scope.workoutsUrl = MyService.isUnlocked('feature_workouts') ? 'partials/unlocked_workouts.html' : 'partials/locked_workouts.html';
    }
    $scope.successGetPurchases = function(result) {
      console.log('getpurchases strresult');
      $scope.logResult(result);
      for(var i=0;i<result.length;i++) {
        if (result[i].productId) { 
          MyService.unlock(result[i].productId);
        }
      }
      $scope.restorePurchasesCompleted = 'Completed restoring purchases.';
      // refresh status of purchases for ui changes
      $scope.refreshPurchaseStatus();
    };
    $scope.onIosRestoreSuccess = function(result) {
      console.log('onIosRestoreSuccess, result=' + result);
      var genericSku = getGenericSkuFromAppleSku(result);
      MyService.unlock(genericSku);

      // set already purchased motivation tracks to owned 
for (var i=0; i<motivationTracks.length; i++) {

  if (motivationTracks[i].sku == genericSku) {
    motivationTracks[i].owned = true;
  }
}
      $scope.restorePurchasesCompleted = 'Completed restoring purchases.';
      // refresh status of purchases for ui changes
      $scope.refreshPurchaseStatus();
      $scope.$apply(); // for some reason, angular digest not working properly on ios.  have to force apply.

    };
    $scope.failGetPurchases = function(result) {
      console.log('getpurchases fail = ');
      $scope.logResult(result);
    };
    $scope.restorePurchases = function() {
      if (device.platform == 'Android') {
        inappbilling.getPurchases($scope.successGetPurchases, $scope.failGetPurchases);
      } else {
        IAP.iosRestore($scope.onIosRestoreSuccess, $scope.failGetPurchases);
      }
    };

    $scope.unlockFeature = function(id) {
      if (device.platform == 'Android') {
        inappbilling.buy($scope.buySuccess, $scope.errorHandler, id);
      } else {
console.log('before controller iosbuy');
        IAP.iosBuy($scope.buySuccess, $scope.errorHandler, getAppleSku(id)); // using custom wrapper for ios purchase
console.log('after controller iosbuy');
      }
    }   
    $scope.buySuccess = function(result) {
console.log('buysuccess, result='+result);
      if (device.platform == 'Android') {
        MyService.unlock(result);
      } else {
        MyService.unlock(getGenericSkuFromAppleSku(result));
      }
      if (result.indexOf("feature_tips") != -1) {
        $location.path("/tips");
        $scope.$apply(); // for some reason, angular digest not working properly on ios.  have to force apply.
      } else if (result.indexOf("feature_workouts") != -1) {
        $location.path('/workouts');
        $scope.$apply();
      }
    }
    $scope.errorHandler = function(result) {
      console.log(result);
    }
    $scope.getAvailable = function() {
      inappbilling.getAvailableProducts(
        function(result) { console.log('success');console.log(result);}, function(result) {console.log('fail'); console.log(result);});
    }
// end in app purchase logic

// start logic for motivation tracks        

    $scope.player = AudioPlayer;
    $scope.tracks = MotivationTracks.query();
    $scope.$on("$locationChangeStart", function(event){
      // stop audio player if playing
      $scope.player.stop();
    })

    // slider logic
$scope.sliderExample3 = 10;

$scope.slider = {
'options': {
start: function (event, ui) { console.log('Slider start'); },
stop: function (event, ui) { 

  $scope.player.media.seekTo($scope.sliderExample3 * 1000);
 
}
}
};

$scope.$on('sliderPositionChanged', function(evt, pos) {
  $scope.$apply(function() {
    $scope.sliderExample3 = pos; 
  }); 
}); 
$scope.seekPosition = function(seconds) {
      if ($scope.player.media === null)
         return;

      $scope.player.media.seekTo(seconds * 1000);
      $scope.updateSliderPosition(seconds);
   };
$scope.updateSliderPosition = function(seconds) {
      var val = Math.round(seconds);
      $rootScope.$broadcast('sliderPositionChanged', val);
   };

$scope.setMediaTimer = function() {
        $scope.mediaTimer = setInterval(                                                                          
            function() {
               $scope.player.media.getCurrentPosition(                                                                    
                  function(position) {
                     if (position > -1)
                     {
                       // $('#media-played').text(Utility.formatTime(position));                                     
                       $scope.updateSliderPosition(position);
                       $('#musicSlider').slider("option","max", Math.round($scope.player.duration)); // note, cannot immediately get duration after calling play
                     }                                                                                             
                  },                                                                                               
                  function(error) {
                     console.log('Unable to retrieve media position: ' + error.code);
                     //$('#media-played').text(Utility.formatTime(0));
                  }
               );
            },
            1000                                                                                                   
         );
}

    $scope.playMedia = function() {
      if (! $scope.player.playing) {
        $scope.player.media.play();
        $scope.setMediaTimer(); // update slider
      }
    }

    $scope.pauseMedia = function() {
      $scope.player.pause();
      clearInterval($scope.mediaTimer);
    }
    $scope.stopMedia = function() {
      $scope.player.stop();
      clearInterval($scope.mediaTimer);
      $scope.sliderExample3 = 0; // already in angular apply context, dont call sliderPositionChanged
    }
    // end slider logic
$scope.changePlayButton = function(imageName) {
      var background = $('#player-play')
      .css('background-image')
      .replace('url(', '')
      .replace(')', '');
      
      $('#player-play').css(
         'background-image',
         'url(' + background.replace(/img\/.*\.png$/, 'img/' + imageName + '.png') + ')'
      );
console.log($('#player-play').css('background-image'));
   }

 
    $scope.trackTitle = "";
    $scope.TrackStatus = function(track) {
        //{playing: track == player.current, downloading: track.downloading > 0, ready: track.ready, available: track.owned && !track.ready && !track.downloading, locked: !track.owned}
        if ($scope.player.current.title && (track.title == $scope.player.current.title)) {
          return 'playing';
        } else if (track.downloading > 0) {
          return 'downloading';
        } else if (track.ready) {
          return 'ready';
        } else if (track.downloadUrl && (track.owned || !track.sku)) {
          return 'available';
        } else if (track.sku) {
          return 'locked';
        }
      }

    $scope.Toggle = function(track) {
$scope.player.debug = 'scopetoggle';
LogService.log('in scope toggle');
LogService.log(track);
        if (track.ready) {
console.log('scope player current src = ' + $scope.player.current.src);
console.log('track src = ' + track.src);
console.log('this.current.title = ' + $scope.player.current.title);
          if ($scope.player.current.title == track.title) {
            console.log('stopping');
            $scope.stopMedia();
          } else {
            console.log('playing');
            $scope.player.play(track);  
            $scope.trackTitle = track.title; 
            $scope.setMediaTimer(); // update slider
          }
        } else if (!!track.sku && !track.owned) {
          $scope.Buy(track);
        } else if (!track.ready) {
console.log('downloading, track title = ' + track.title);
          $scope.Download(track)
        }
      };

      $scope.Buy = function(track) {
        var unlockTrack = function() {
          track.owned = true;
          $scope.$apply();
          $scope.Download(track);
        };
        if (device.platform == 'Android') {
        inappbilling.buy(unlockTrack, function() { 
            console.log('Buy canceled');
          }, track.sku
        );
        } else {
          IAP.iosBuy(unlockTrack, $scope.errorHandler, getAppleSku(track.sku));
        }  
      };

     $scope.Download = function(track, onSuccess) {
        var uri = encodeURI(track.downloadUrl);
        var remoteFile = track.downloadUrl;
        var callback = onSuccess;
        var localFileName = track.localFile;
console.log('in Download, track.localFile=');
console.log(track.localFile);
        
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
          var saveTrack = function(dirEntry) {
            dirEntry.getFile(localFileName, {create: true, exclusive: false}, function(fileEntry) {
              var localPath = fileEntry.fullPath;
console.log('in direntry callback, localPath = ' + localPath);
              if (device.platform === "Android" && localPath.indexOf("file://") === 0) {
console.log('beforesubstringlocalpath = ' + localPath);
                  //FIXME trying to get rid of file:/// localPath = localPath.substring(7);
                  //localPath = localPath.substring(8); // to get rid of file:///   (notice the third /)
                  localPath = localPath.substring(7); //FIXME dh, trying to fix track always redownloading on other android devices 7/8/14
              } 
/*
else {
//FIXME
                localPath = localPath.substring(1); // to get rid of leading /
              }
*/

console.log('localPath = ' + localPath);
              var ft = new FileTransfer();
              ft.onprogress = function(progressEvent) {
                  if (progressEvent.lengthComputable) {
                      var percent = (progressEvent.loaded )/progressEvent.total;
                      //percent allways equal 2, than more 2x size of real file (dh: undid this hack, seems unnecessary due to progress bar stopping halfway)
                      track.downloading = percent;                          
                  }  else {
                    track.downloading = 0;
                  }
                  $scope.$apply();
              };
              // ft.download(remoteFile, localPath, function(entry)   // FIXME legacy code, doesn't work on nexus s, nor on htc
/***** FIXME works on nexus s, not on htc or other devices
var rootdir = fileSystem.root;
var fp = rootdir.fullPath; // Returns Fulpath of local directory
fp = fp+fileEntry.fullPath;
              ft.download(remoteFile, "file:///storage/sdcard0/"+fileEntry.fullPath, function(entry)   // FIXME works on nexus s, doesnt work on htc
              
*****/
              ft.download(remoteFile, fileEntry.toURL(), function(entry) {  // using toURL for file transfer plugin 3.0
                  // Do what you want with successful file downloaded and then 
                  // call the method again to get the next file
console.log('fileentry tourl = ' + fileEntry.toURL());
console.log('entry tourl = ' + entry.toURL());
track.iosPath = entry.toURL();
                  track.downloading = false;
                  track.ready = true;
                  $scope.$apply();
                  downloadQueue();
              }, fail);

            }, fail);
          };

          fileSystem.root.getDirectory("ctfletcher", {create: true, exclusive: false},
              saveTrack, function (error) {
                 //alert(error.code);
console.log('here getdirectory error');
LogService.log(error);
              }
          );
        }, fail); 
      };

      var remoteFiles = [];
      var fail = function(error) {
        //alert(error);
console.log('fail');
        LogService.log(error);
      };

      var downloadQueue = function() {
          // No files left, stop downloading
          if (remoteFiles.length === 0) {
              return;
          }
          
          var track = remoteFiles.shift();
          var remoteFile = track.downloadUrl;
          var localFileName = remoteFile.substring(remoteFile.lastIndexOf('/')+1);
          
          window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
            var saveTrack = function(dirEntry) {
              dirEntry.getFile(localFileName, {create: true, exclusive: false}, function(fileEntry) {
                var localPath = fileEntry.fullPath;
                if (device.platform === "Android" && localPath.indexOf("file://") === 0) {
                    localPath = localPath.substring(7);
                }
                var ft = new FileTransfer();
                ft.onprogress = function(progressEvent) {
                    if (progressEvent.lengthComputable) {
                        var percent = (progressEvent.loaded / 2)/progressEvent.total;
                        //percent allways equal 2, than more 2x size of real file 
                        track.downloading = percent;                          
                    }  else {
                      track.downloading = 0;
                    }
                    $scope.$apply();
                };
                ft.download(remoteFile, localPath, function(entry) { //FIXME should be using URI instead of localPath to support more devices
                    // Do what you want with successful file downloaded and then 
                    // call the method again to get the next file
                    track.downloading = false;
console.log('indownloadqueue , track.ready set to true, track title = ' + track.title);
                    track.ready = true;
                    $scope.$apply();
                    downloadQueue();
                }, fail);

              }, fail);
            };

            fileSystem.root.getDirectory("ctfletcher", {create: true, exclusive: false},
                saveTrack, function (error) {
                   //alert(error.code);
LogService.log(error);
                }
            );
          }, fail); 
      };


// end logic for motivation tracks

  }])
  .controller('Tips', ['$scope', '$routeParams', 'TipsService', function($scope,$routeParams,TipsService) {
    
    $scope.nextTip = (parseInt($routeParams.nthTip || 0) + 1) % TipsService.numTips();
    $scope.prevTip = parseInt($routeParams.nthTip || 0) - 1;
    if ($scope.prevTip <= 0) {
      $scope.prevTip = TipsService.numTips() - 1;
    }
    $scope.initDisplay = function() {
      var nthTip = $routeParams.nthTip || $scope.randomTipNumber(0,TipsService.numTips());
      $scope.tip = TipsService.getTip(nthTip);
console.log('tip='+$scope.tip);     
      /* always show prev and next, loop tips
      $scope.showPrev = !($scope.prevTip < 0);
      $scope.showNext = !($scope.nextTip >= TipsService.numTips()); 
      */
      $scope.showPrev = $scope.showNext = true;
    }
    $scope.$on('$viewContentLoaded', $scope.initDisplay);

    $scope.randomTipNumber = function(min,max) {
      return Math.floor(Math.random()*(max-min+1)+min);
    }
  }])
  .controller('Workout', ['$scope', function($scope) {

  }])
  .controller('TestSlider', ['$scope', function($scope) {
$scope.sliderExample3 = 10;
$scope.sliderStop = function(event, ui) {
console.log($scope.sliderExample3);
}


	$scope.demoVals = {
sliderExample3: 14,
sliderExample4: 14,
sliderExample5: 50,
sliderExample8: 0.34,
sliderExample9: [-0.52, 0.54],
sliderExample10: -0.37
};

  }])
  ;
