function getAppleSku(genericSku) {
  for (var i=0; i<features.length; i++) {
    if (features[i].sku == genericSku) {
      return features[i].apple_sku;
    }
  }
  for (var i=0; i<motivationTracks.length; i++) {
    if (motivationTracks[i].sku == genericSku) {
      return motivationTracks[i].apple_sku;
    }
  }
  console.log('no apple sku found for generic sku = ' + genericSku);
}
function getGenericSkuFromAppleSku(appleSku) {
  for (var i=0; i<features.length; i++) {
    if (features[i].apple_sku == appleSku) {
      return features[i].sku;
    }
  }
  for (var i=0; i<motivationTracks.length; i++) {
    if (motivationTracks[i].apple_sku == appleSku) {
      return motivationTracks[i].sku;
    }
  }
  console.log('no generic sku found for apple sku = ' + appleSku);
 
}
var features = [
  {
    sku: 'feature_tips',
    apple_sku: 'com.deepfriedproductions.ctfletcher.feature_tips'
  },
  {
    sku: 'feature_workouts',
    apple_sku: 'com.deepfriedproductions.ctfletcher.feature_workouts'
  }
];

var motivationTracks = [

    {
    localFile: 'training.mp3',
    downloadUrl: 'https://s3-us-west-2.amazonaws.com/ctfletcher/motivational/training.mp3',
    title: 'Training',
    sku: 'motivational_training',
    apple_sku: 'com.deepfriedproductions.ctfletcher.training',
    price: '2.99'
  },

  {
    localFile: 'goliath.mp3',
    downloadUrl: 'https://s3-us-west-2.amazonaws.com/ctfletcher/motivational/goliath.mp3',
    title: 'Goliath the Lion',
    sku: 'motivational_goliath',
    apple_sku: 'com.deepfriedproductions.ctfletcher.goliath',
    price: '2.99'
  },
      {
    localFile: 'why.mp3',
    downloadUrl: 'https://s3-us-west-2.amazonaws.com/ctfletcher/motivational/why.mp3',
    title: 'Why?',
    sku: 'motivational_why',
    apple_sku: 'com.deepfriedproductions.ctfletcher.why',
    price: '1.99'
  },
  {
    localFile: 'muscleville.mp3',
    downloadUrl: 'https://s3-us-west-2.amazonaws.com/ctfletcher/motivational/muscleville.mp3',
    title: 'Muscleville',
    sku: 'motivational_muscleville',
    apple_sku: 'com.deepfriedproductions.ctfletcher.muscleville',
    price: '0.99'
  },
  {
    localFile: 'war.mp3',
    downloadUrl: 'https://s3-us-west-2.amazonaws.com/ctfletcher/motivational/war.mp3',
    title: 'War',
    sku: 'motivational_war',
    apple_sku: 'com.deepfriedproductions.ctfletcher.war',
    price: '0.99'
  },
  {
    localFile: 'effort.mp3',
    downloadUrl: 'https://s3-us-west-2.amazonaws.com/ctfletcher/motivational/effort.mp3',
    title: 'Effort',
    sku: 'motivational_effort',
    apple_sku: 'com.deepfriedproductions.ctfletcher.effort',
    price: '0.99'
  },
  {
    //localFile: 'wipe them tears.mp3',
    localFile: 'wipe_them_tears.mp3',
    downloadUrl: 'https://s3-us-west-2.amazonaws.com/ctfletcher/motivational/wipe+them+tears.mp3',
    title: 'Wipe Them Tears',
    price: 0
  },
  {
    localFile: 'squat day.mp3',
    downloadUrl: 'https://s3-us-west-2.amazonaws.com/ctfletcher/motivational/squat+day.mp3',
    title: 'Squat Day',
    price: 0
  },
  {
    src: 'audio/motivation/i_am_the_one.mp3',
    title: 'I am the one'
  },
  {
    src: 'audio/motivation/unchain_your_mind.mp3',
    title: 'Unchain your mind'
  },
  {
    src: 'audio/motivation/i_command_you_to_grow.mp3',
    title: 'I command you to grow'
  },
  {
    src: 'audio/motivation/sick_mutha_fuckaz.mp3',
    title: 'Sick muthafuckaz'
  },
  {
    src: 'audio/motivation/command_some_shit.mp3',
    title: 'Command some shit'
  },
  {
    localFile: 'no mercy.mp3',
    downloadUrl: 'https://s3-us-west-2.amazonaws.com/ctfletcher/motivational/no+mercy.mp3',
    title: 'No Mercy',
    sku: 'motivational_nomercy',
    apple_sku: 'com.deepfriedproductions.ctfletcher.nomercy',
    price: '0.99'

  },
  {
    localFile: 'showstopper.mp3',
    downloadUrl: 'https://s3-us-west-2.amazonaws.com/ctfletcher/motivational/showstopper.mp3',
    title: 'Showstopper',
    sku: 'motivational_showstopper',
    apple_sku: 'com.deepfriedproductions.ctfletcher.showstopper',
    price: '0.99'

  },
  {
    localFile: 'superman.mp3',
    downloadUrl: 'https://s3-us-west-2.amazonaws.com/ctfletcher/motivational/superman.mp3',
    title: 'Superman',
    sku: 'motivational_superman',
    apple_sku: 'com.deepfriedproductions.ctfletcher.superman',
    price: '0.99'

  },
  {
    localFile: 'beast or bitch.mp3',
    downloadUrl: 'https://s3-us-west-2.amazonaws.com/ctfletcher/motivational/beast+or+bitch.mp3',
    title: 'Beast or Bitch',
    sku: 'motivational_beast_or_bitch',
    apple_sku: 'com.deepfriedproductions.ctfletcher.beast_or_bitch',
    price: '0.99'
  },
  {
    localFile: 'mad man.mp3',
    downloadUrl: 'https://s3-us-west-2.amazonaws.com/ctfletcher/motivational/mad+man.mp3',
    title: 'Mad Man',
    sku: 'motivational_mad_man',
    apple_sku: 'com.deepfriedproductions.ctfletcher.mad_man',
    price: '0.99'
  },
  {
    localFile: 'the secret.mp3',
    downloadUrl: 'https://s3-us-west-2.amazonaws.com/ctfletcher/motivational/the+secret.mp3',
    title: 'The Secret',
    sku: 'motivational_the_secret',
    apple_sku: 'com.deepfriedproductions.ctfletcher.the_secret',
    price: '0.99'
  },
  {
    localFile: 'training methods.mp3',
    downloadUrl: 'https://s3-us-west-2.amazonaws.com/ctfletcher/motivational/training+methods.mp3',
    title: 'Training Methods',
    sku: 'motivational_training_methods',
    apple_sku: 'com.deepfriedproductions.ctfletcher.training_methods',
    price: '0.99'
  },
  /*{
    localFile: 'ct-fletcher_alarm_1_no-buzzer.mp3',
    downloadUrl: 'https://s3-us-west-2.amazonaws.com/ctfletcher/test81/ct-fletcher_alarm_1_no-buzzer.mp3',
    title: 'Alarm Ringtone 1',
    sku: 'alarm1'
  },
  {
    localFile: 'ct-fletcher_alarm_2_no-buzzer.mp3',
    downloadUrl: 'https://s3-us-west-2.amazonaws.com/ctfletcher/test81/ct-fletcher_alarm_2_no-buzzer.mp3',
    title: 'Alarm Ringtone 2',
    sku: 'alarm2'
  },
  {
    localFile: 'ct-fletcher_alarm_3_no-buzzer.mp3',
    downloadUrl: 'https://s3-us-west-2.amazonaws.com/ctfletcher/test81/ct-fletcher_alarm_3_no-buzzer.mp3',
    title: 'Alarm Ringtone 3',
    sku: 'alarm3'
  }
*/];
