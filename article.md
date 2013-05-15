# Add Narration to your Slide Deck with HTML5 Audio

**A good speaker knows to share their slide deck on the web after their presentation. But many times what's in the slides is only a shell of the real talk. Fortunately, with HTML5 audio, we can add our voice back to the slides to recreate the full presentation.**

## Audio on the Web

Back when the web was just taking off, it was common (bad) practice to include audio on your page. I'm not talking about a Flash-based music player, but rather the more primitive audio solution: <bgsound>. For those who were programming back when HTML 3.2 came out, they'll be familiar with this oft-forgotten tag. 

Luckily for us, <bgsound> isn't the end of the story. According to [the latest W3C spec](http://www.w3.org/wiki/HTML/Elements/bgsound), <bgsound> has a much friendlier HTML5 alternative that you've likely heard of: the <audio> tag. 

So what benefits does <audio> bring us? Well, <bgsound> was a IE only property. <audio> on the other hand has wide support, with only IE 7 & 8 lacking functionality. <audio> also gives up API access, so that we can control playback, seek through the sound clip, and even audio manipulation with the [MediaStream API](https://developer.mozilla.org/en-US/docs/WebRTC/MediaStream_API). Plus, the <audio> tag allows native controls or the ability to provide your own customized controls. 

## File formats
Before getting in to the details on how we're going to use the <audio> tag, we need to talk a little about file formats. The MP3 format has gained tremendous popularity over the last decade and a half, but unfortunately due to licensing requirements, relying on MP3's for our audio is a messy situation. 

Luckily for us, the <audio> tag supports multiple formats gracefully. This means we can create a patchwork of audio file formats to gain full browser support. And we'll need a patch work because no format is supported across all browsers. 

For our needs, we'll create two files: an AAC file and an OggVorbis file. 

### Creating those files

## How to use it?

## Starting/Stopping

## Seeking

## Captioning

## Support


## Resources
https://www.scirra.com/blog/44/on-html5-audio-formats-aac-and-ogg