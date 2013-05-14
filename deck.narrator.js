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

  var audio,
      segments = [],
      segmentEnd = 0;

  function checkTime () {
      if (audio.currentTime >= segmentEnd) {
          audio.pause();
      }
  }

  function changeSlides (e, from, to) {
    if(audio) {
      audio.pause();

      audio.currentTime = segments[to][0];
      segmentEnd = segments[to][1];

      audio.play();
    }
  }

  $d.bind('deck.init', function() {
    var opts = $[deck]('getOptions');
    audio = $(opts.selectors.narratorAudio).get(0);

    audio.addEventListener('timeupdate', checkTime, false);

    // build audio stops
    var slides = $[deck]('getSlides');
    $currentSlide = $[deck]('getSlide');
    var position = 0;
    var currentIndex = 0;

    $.each(slides, function(i, $el) {
      var duration = $el.data('narrator-duration');

      if ($currentSlide == $el) {
        currentIndex = i;
      }

      segments.push([position, position + duration]);
      position += duration;
    });


    // initialize first segment end and play
    audio.addEventListener('canplay', function(){
        audio.currentTime = segments[currentIndex][0];
    });
    segmentEnd = segments[currentIndex][1];
  })
  /* Update audio location, play till end of slide */
  .bind('deck.change', changeSlides);

})(jQuery, 'deck');

