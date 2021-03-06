var SLIDES = [];
var selectedAnswer = 'Heeeeeeeeeee';

function Slideshow(config){

	var self = this;
	self.config = config;

	// DOM
	self.dom = config.dom;

	// Slide information
	self.slides = config.slides;

	// Reset: INITIAL VARIABLES
	self.reset = function(){

		// On End?
		if(self.currentSlide){
			if(self.currentSlide.onend) self.currentSlide.onend(self);
			unlisten(_); // hax
		}

		// CLEAR
		if(self.clear) self.clear();

		// Reset
		self.dom.innerHTML = "";
		self.slideIndex = -1;
		self.currentSlide = null;
		self.objects = {};

	};
	self.reset();

	//////////////////////////////////////////////////
	/////////////// GO TO NEXT SLIDE /////////////////
	//////////////////////////////////////////////////
			if (!String.prototype.includes) {
  String.prototype.includes = function(search, start) {
    'use strict';
    if (typeof start !== 'number') {
      start = 0;
    }
    
    if (start + search.length > this.length) {
      return false;
    } else {
      return this.indexOf(search, start) !== -1;
    }
  };
}
	
	// Go to next slide
	self.nextSlide = function(){

		// On End?
		if(self.currentSlide && self.currentSlide.onend){
			self.currentSlide.onend(self);
		}

		// Update the information
		if(self.slideIndex >= self.slides.length-1) return;
		self.slideIndex++;
		self.currentSlide = self.slides[self.slideIndex];

		// On Start
		if(self.currentSlide.onstart){
			self.currentSlide.onstart(self);
		}

		// Send out message!
		publish("slideshow/slideChange", [self.currentSlide.id]);

	};

	// Go to next slide if correct answer is selected:
	self.customizedNextSlide = function(){

		// On End?
		if(self.currentSlide && self.currentSlide.onend){
			self.currentSlide.onend(self);
		}
		console.log('selectedAnswer is: '+selectedAnswer);
		console.log('self.slideIndex is: '+self.slideIndex);

		//if (selectedAnswer == "COOPERATE" || selectedAnswer == "CHEAT")
		self.slideIndex = 3;
		if (selectedAnswer=="oneoff2-CHEAT" || selectedAnswer == "oneoff2-COOPERATE" || selectedAnswer == "oneoff2-CORRECT")
			self.slideIndex = 6;
		else if (selectedAnswer=="oneoff3-CHEAT" || selectedAnswer == "oneoff3-COOPERATE" || selectedAnswer == "oneoff3-CORRECT")
				self.slideIndex = 9;
		else if (selectedAnswer=="oneoff4-CHEAT" || selectedAnswer == "oneoff4-COOPERATE" || selectedAnswer == "oneoff4-CORRECT")
						self.slideIndex = 12;
		//else if (selectedAnswer=="oneoff5-CHEAT" || selectedAnswer == "oneoff5-COOPERATE" || selectedAnswer == "oneoff5-CORRECT")
									//self.slideIndex = 16;
		// Update the information
		if(self.slideIndex >= self.slides.length-1) return;
		if(selectedAnswer.includes("CORRECT")) 
			self.slideIndex++;
		self.currentSlide = self.slides[self.slideIndex];
	
		// On Start
		if(self.currentSlide.onstart){
			console.log('chkpt 1');
			self.currentSlide.onstart(self);
			console.log('chkpt 2');
		}

		// Send out message!
		publish("slideshow/slideChange", [self.currentSlide.id]);

	};

	// Subscribe to "next slide" message...
	subscribe("slideshow/next", function(){
		self.nextSlide();
	});

	// Subscribe to "customized next slide" message...
	subscribe("slideshow/customizedNext", function(){
		self.customizedNextSlide();
	});


	//////////////////////////////////////////////////
	///////////// SLIDESHOW OBJECTS //////////////////
	//////////////////////////////////////////////////

	// Objects!
	self.objects = {};

	// Add Object
	self.add = function(objectConfig){

		// Create object
		var Classname = window[objectConfig.type];
		objectConfig.slideshow = self;
		var obj = new Classname(objectConfig);
		obj.slideshow = self;

		// Remember it
		self.objects[objectConfig.id] = obj;

		// Add it for real!
		return obj.add();

	};

	// Remove Object
	self.remove = function(objectID){

		// Find it...
		var obj = self.objects[objectID];

		// Remove from memory & DOM
		delete self.objects[objectID];
		return obj.remove();

	};

	// Clear: Remove ALL objects
	self.clear = function(){
		for(var id in self.objects) self.remove(id);
	};


	//////////////////////////////////////////////////
	///////////// FORCE GO TO SLIDE //////////////////
	//////////////////////////////////////////////////

	// FORCE go to a certain slide
	self.gotoSlide = function(id){

		// RESET IT ALL.
		self.reset();

		// Slide & SlideIndex
		self.currentSlide = self.slides.find(function(slide){
			return slide.id==id;
		});
		self.slideIndex = self.slides.indexOf(self.currentSlide);

		// On JUMP & on Start
		if(self.currentSlide.onjump) self.currentSlide.onjump(self);
		if(self.currentSlide.onstart) self.currentSlide.onstart(self);

		// Send out message!
		publish("slideshow/slideChange", [self.currentSlide.id]);

	};

	// Subscribe to the "force goto" message...
	subscribe("slideshow/goto", function(id){
		self.gotoSlide(id);
	});

}
