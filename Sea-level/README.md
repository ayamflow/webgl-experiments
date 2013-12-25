# Experiment Boilerplate

A HTML5 Boilerplate for creating JS/Canvas experiments.

It includes a set of useful libraries availables through Github or Google code, and some basic custom classes for handling window size or scene.

## Included
* [RequireJS](requirejs.org) Easily handle AMD modules
* [TinyColor](bgrins.github.io/TinyColor/) Convenient color manager (HSL, RGB, …)
* [requestAnimationFrame shim](https://gist.github.com/ozke/6209435) "for smart animating"
* [dat.gui](http://workshop.chromeexperiments.com/examples/gui/#1--Basic-Usage) A nice UI to live-edit variables
* [Stats.js](https://github.com/mrdoob/stats.js/) FPS/MS overlay
* [Pixi.js](https://github.com/GoodBoyDigital/pixi.js) If needed, for a simple WebGLRenderer
* [GruntJS](http://gruntjs.com) For starting a static server with `$ grunt connect`

## Helpers
* Resize.js A very simple helper to manage Window and access window size.
* Mouse.js Simple helper to keep track of Mouse current/previous positions and clicks number.
* LeapBridge.js Simple helper to keep track of current/previous positions of 10 fingers.
* Playground.js The global controller.
* MathHelper.js A set of classic math function such as distance or angle between 2 points.
* AudioHelper.js Helper to load song and play with AudioContext. Will be soon replaced with a better version using Howler.
* ColorHelper.js Some complentary functions to tinycolor, like creating color scales.
* ImageDataHelper.js Aim to simplify the management of canvas image data. Really alpha.

## Entities
* Particle.js A basic particle.
* Attractor.js A simple particle attractor based on Daniel Shiffman's Nature of Code.
* Pool.js A tiny object pool class. Untested and WIP.
* Vector.js A simple class for managing 2D vector. Might replace it with glMatrix in the future. Supposed to be efficient by not creating a lot of vector instances.

## Next to come
* Better Object Pool
* Basic Particle class
* More helpers (Renderers ?, Extend/Class, …)

## Changelog
* v0.3.3: Added/updated some helpers & entities from my last project, such as AudioHelper, BufferLoader, ColorHelper, ImageDataHelper, Attractor (for Particle), and a Vector class. They are all still in development though.
* v0.3.2: Removed Pixi.js for now, added GruntJS for quick static server, added Math, Mouse and LeapBridge helpers. Turned Resize to a singleton with a resizables array. Added a basic object pool.
* v0.3.1: Removed facebook/twitter/modernizr/html5shim. Added Pixi.js, moved to RequireJS/AMD modules. Added TinyColors, removed FlowUtils.
* Under 0.3: Basic boilerplate including facebook/twitter share buttons, Modernizr, html5shim.