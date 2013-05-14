deck.narrator.js
================

Module for deck.js to add audio narration to slides

## Usage

There are two steps to adding audio narration to your slides:

 1. **Add a 'data-narrator-duration' attribute to every slide with the value being how long the audio should play for on that slide.** Assume that the first slides starts at time position zero and every slide adds on after that. For example, if my first slide has a duration of 2, it will play the first two seconds of audio. If my next slide has a duration of five, it will play 0:02-0:07 in the audio.
 2. Add the `<audio>` tag to your page. Example:
        <audio controls class="deck-narrator-audio" id="narrator-audio">
          <source src="myAudio.mp3" type="audio/mpeg" />
          <source src="myAudio.ogg" type="audio/ogg"  />
          <track kind="caption" src="captions.vtt" srclang="en" label="English" />
        </audio>
