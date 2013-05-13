/*!
Deck JS - deck.narrator
Copyright (c) 2013 Kevin Lamping
Dual licensed under the MIT license and GPL license.
https://github.com/imakewebthings/deck.js/blob/master/MIT-license.txt
https://github.com/imakewebthings/deck.js/blob/master/GPL-license.txt

// TODO hook up with https://github.com/cgiffard/Captionator/
*/

/*
This module adds a audio narration to slides
*/
(function($, deck, undefined) {
	var $d = $(document);


  /*
  Extends defaults/options.

  options.selectors.narratorAudio
    The element that matches this selector is the audio tag for the soundtrack
  */
  $.extend(true, $[deck].defaults, {
    selectors: {
      narratorAudio: '#narrator-audio'
    }
  });

  var $audio,
      segmentEnd = 0;

  function checkRan () {
      if (typeof segmentEnd !== 0 && $audio.currentTime >= segmentEnd) {
          $audio.pause();
      }
  }
  $d.bind('deck.init', function() {
    var opts = $[deck]('getOptions');
    $audio = $(opts.selectors.narratorAudio)[0];

    $audio.addEventListener('timeupdate', checkRan, false);

    // initialize first segement end and play
    segmentEnd = $[deck]('getSlide', 0).data('narrator-duration');

    $audio.play();
  })
  /* Update audio location, play till end of slide */
  .bind('deck.change', function(e, from, to) {
    var fromDuration = $[deck]('getSlide', from).data('narrator-duration');
    var toDuration = $[deck]('getSlide', to).data('narrator-duration');
    if($audio) {
      $audio.pause();
      if (from > to) { // were moving backwards
        $audio.currentTime = segmentEnd - (toDuration + fromDuration);
        segmentEnd = toDuration;
      } else { // were moving forwards
        $audio.currentTime = segmentEnd; // move current time ahead
        segmentEnd = toDuration + $audio.currentTime;
      }
      $audio.play();
    }
  });

})(jQuery, 'deck');

