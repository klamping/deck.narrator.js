deck.narrator.js
================

Module for deck.js to add audio narration to slides. 

## Blog Post

This module is described in detail in the [Add Narration to Your Slide Deck With HTML5 Audio](http://html5hacks.com/blog/2013/06/17/add-narration-to-your-slide-deck-with-html5-audio/) post at html5hacks.com

## Usage

There are two steps to adding audio narration to your slides (aside from recording the audio):

 1. **Add a 'data-narrator-duration' attribute to every slide with the value being how long the audio should play for on that slide.** Assume that the first slides starts at time position zero and every slide adds on after that. For example, if my first slide has a duration of 2, it will play the first two seconds of audio. If my next slide has a duration of five, it will play 0:02-0:07 in the audio. Example:

        <section class="slide" data-narrator-duration="2">

 2. Add the `<audio>` tag to your page. Example:

        <audio controls class="deck-narrator-audio" id="narrator-audio">
          <source src="myAudio.acc" type="audio/acc" />
          <source src="myAudio.ogg" type="audio/ogg"  />
          <track kind="caption" src="captions.vtt" srclang="en" label="English" />
        </audio>
