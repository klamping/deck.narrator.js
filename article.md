# Add Narration to your Slide Deck with HTML5 Audio (Part 1)

**A good presenter will share their slide deck on the web after their presentation. But many times the slides are only a shell of the real talk. Fortunately, with HTML5 audio, we can add our voice back to our slides and recreate the real presentation.**

## Sample Example

// TODO update link to html5hacks site
To show what we're trying to accomplish, I've created [a very basic slide deck with audio narration](...) which briefly describes the issue at hand. 

## Audio on the Web

Back when the web was just taking off, it was common (bad) practice to include audio on your page. I'm not talking about a Flash-based music player, but rather the more primitive audio solution: `<bgsound>`. Those who were programming back when HTML 3.2 came out will be familiar with this oft-forgotten tag. 

Luckily for us, `<bgsound>` isn't the end of the story. According to [the latest W3C spec](http://www.w3.org/wiki/HTML/Elements/bgsound), `<bgsound>` has a much friendlier HTML5 alternative that you've likely heard of: the `<audio>` tag. 

So what benefits does `<audio>` bring us? Well, `<bgsound>` was an IE only property. `<audio>` on the other hand has wide support, with only IE 7 & 8 lacking functionality. `<audio>` also allows API access so that we can control playback, seek through the audio, and even manipulate the data with the [MediaStream API](https://developer.mozilla.org/en-US/docs/WebRTC/MediaStream_API). Plus, the `<audio>` tag allows you to use native controls and/or provide your own customized controls. 

## File formats
Before getting in to the details on how we're going to use the `<audio>` tag, we need to talk a little about file formats. The MP3 format has gained tremendous popularity over the last decade and a half, but unfortunately due to licensing requirements, relying on MP3's for our audio is a messy situation. 

Luckily for us, the `<audio>` tag supports multiple formats gracefully. This means we can create a patchwork of audio file formats to gain full browser support. And we'll need a patch work because no one format is currently supported across all browsers. 

For our needs, we've created two files: an MP4/AAC file and an OggVorbis file. 

If you'd like to read more on the subject, I highly recommend [Ashley Gullen's post 'On HTML5 audio formats - AAC and Ogg'](https://www.scirra.com/blog/44/on-html5-audio-formats-aac-and-ogg).

## How to Use It?

Now that we've got our files created, let's put them to use. We can load our audio files by adding in two `<source>` tags with information about our two audio files inside of the `<audio>` tag:

    <audio controls>
      <source src="myAudio.m4a" type="audio/mp4" />
      <source src="myAudio.ogg" type="audio/ogg"  />
      Your browser does not support HTML5 audio.
    </audio>

There are two attributes for each `<source>` tag. The 'src' attribute, whose value is the path to the audio file, and the 'type' attribute, whose value is the MIME type of the file. 

Again, the browser will choose whichever file it supports without you having to do any detective work. Very nice. 

## Starting/Stopping

Okay, so now if we load this into a webpage we'll get a simple audio player that we can manually control. What's nice is that since we used the 'controls' attribute, the audio player controls are built for us by the browser. This makes allowing manual control of our audio very simple.

But for our needs, we want to control the playback of the audio programmatically.

To do this, we'll start by adding an ID to our `<audio>` tag so that we can grab it from our JavaScript:

    <audio controls id="myPlayer">...</audio>

Next, we'll add a script tag to the page and create a local reference to the audio tag:

    <script>
      var audioPlayer = document.getElementById('myPlayer');
    </script>

Now that we've got a reference to our audio tag, let's take a look at the API for starting and stopping playback. The element has two built-in methods for this, 'play' and 'pause':

    audioPlayer.play();
    audioPlayer.pause();

This will come in handy in a moment when we want to start playing our audio after we change slides.

## Seeking

The other part of the equation is the ability to seek to different locations in our audio. Again, this is very simple. Our element has a 'currentTime' property that can be both get and set (in seconds). 

    console.log(audioPlayer.currentTime); // returns 0 since we haven't started playing the audio yet
    audioPlayer.currentTime = 10; // move to 10 seconds into the audio
    console.log(audioPlayer.currentTime); // returns 10
    
    audioPlayer.play();
    
    setTimeout(function () {
      console.log(audioPlayer.currentTime); // returns 11
    }, 1000);
  
As you can see, getting and setting the current time is a trivial process. In the Part 2, we'll put this functionality to use by adding narration to slides.

## Browser Support

For the latest in browser support, check out [caniuse.com](http://caniuse.com/#feat=audio). Do note that just because a browser supports the HTML5 audio element, does not mean it supports a specific audio codec. 

-----------------------------

# Add Narration to your Slide Deck with HTML5 Audio (Part 2)

## Implementing Slide Narration

So now we've got the building blocks for implementing a slide narrator. To make things easier, we're going to use the fantastic ['Deck.js' project](http://imakewebthings.com/deck.js/) as our HTML slide framework. Deck.js supports extensions, which allows you to add functionality to your slides beyond what's already provided.

We'll be creating a new extension called Narrator. For brevity's sake, I won't get into the details of Deck.js or creating extensions, but you can check out the code in [the deck.narrator.js GitHub repo](https://github.com/klamping/deck.narrator.js).

Our extension boils down to one requirement: It should automatically play a defined section of audio on each slide. 

That might sound simple, but we need to figure out a couple of things first:

- How will we define what audio to play for each slide?
- How will we stop the audio after it gets to the end of the section

## Defining Audio Stops

There are a couple of ways to define what segment of the audio each slide plays. You could define a start time and a stop time for each slide, but that seems like too much work. Instead we'll just define how long each slide should play for, and then calculate the implied start and stop timestamps for each slide. 

To store our audio duration, we'll take advantage of [HTML5 data-* attributes](http://ejohn.org/blog/html-5-data-attributes/) by creating a custom 'data-narrator-duration' attribute. The value of this will be the number of seconds to play the audio for. Here's a sample slide element for a Deck.js HTML file.

    <section class="slide" data-narrator-duration="2">
      ...
    </section>

Then, upon page initialization, we'll loop through each slide element and calculate the proper start/stop timestamps for each slide. This is important in case our viewer wants to move through the slides in a non-linear fashion. Here's the basic code:

    // create an array for our segment timestamps 
    var segments = [];
    
    // create a placeholder for our audio element reference 
    var audio; 
    
    // we'll get to this variable later
    var segmentEnd = 0;

    function init () {
      // get the audio element we added to our page
      audio = document.getElementById('audioNarration');
      
      // use deck.js built-in functionality to get all slides and current slide
      var $slides = $[deck]('getSlides'); 
      var $currentSlide = $[deck]('getSlide');
      
      // set initial values for time position and index
      var position = 0;
      var currentIndex = 0;
        
      // now loop through each slide
      $.each($slides, function(i, $el) {
        // get the duration specified from the HTML element
        var duration = $el.data('narrator-duration');

        // this determines which slide the viewer loaded the page on
        if ($currentSlide == $el) {
          currentIndex = i;
        }

        // push the start time (previous position) and end time (position + duration) to an array of slides
        segments.push([position, position + duration]);

        // increment the position to the start of the next slide
        position += duration;
      });
    }

## Adding Playback Automatically on Slide Change

Now that we've got our segment timestamps defined, let's look at playing that audio on each slide transition. Deck.js fires a 'deck.change' event when the slide is changed, so we can hook into that and have it call our changeSlides function, which looks like this:

    function changeSlides (e, from, to) {
      // check to make sure audio element has been found
      if(audio) {
        // stop any audio that's playing from the previous slide
        audio.pause();

        // move the playback to our slides start
        audio.currentTime = segments[to][0];
        
        // define the end of our section
        segmentEnd = segments[to][1];

        // play the audio
        audio.play();
      }
    }
  
Most of the code makes sense, but I do want to talk about the 'segmentEnd' line and what it's doing. 

## Playing Segments of Audio

Unfortunately, you can't give the `play()` function an amount of time to play for. Once you start playing, it will keep going until it runs out of audio or you tell it to pause. Thankfully, the audio element emits a 'timeupdate' event which we can listen to in order to pause playback once our segment timestamp has been reached. We can add that listener just like any other event listener:

    audio.addEventListener('timeupdate', checkTime, false);
    
Our 'checkTime' function is very small. All it does is check to see if currentTime in the audio is greater than the segmentEnd time. If so, it pauses our audio:

    function checkTime () {
      if (audio.currentTime >= segmentEnd) {
        audio.pause();
      }
    }

## Automatically Moving Through Slides

Now that we've got our audio hooked up to our slides, we can take advantage of the other extensions already written for Deck.js. [https://github.com/rchampourlier/deck.automatic.js/‎](deck.automatic.js) is an extension that makes your slides run automatically. By including this extension with our presentation, we can recreate that 'presentation' feel to our slides. There's nothing to change in our code, since we already have the audio hooked up to our slide change event.

## Summing Up

That's the majority of the code. I left out a few details in relation to some deck.js configurations, so again check out [the GitHub repo for the full example](https://github.com/klamping/deck.narrator.js).