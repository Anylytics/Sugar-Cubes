/* Sugar Animation Library */


/* Cube Handler */


  function cloneCube() {
    $('#sugar-cube-template').clone().attr('id', 'sugar-cube-'+cubeCounter).css('z-index',cubeCounter).appendTo('#sugar-container');
    var newCubeID = "#sugar-cube-"+cubeCounter;
    cubeCounter++;

    return newCubeID;
  }

  function destroyCubes() {
    if (cubeCounter>1) {
      for (var i = 1; i <= cubeCounter; i++) {
        $("#sugar-cube-"+i).remove();
      }
      cubeCounter = 1;
    }

  }

  function dropCubes(gramsSugar){

    if (cubeCounter>1) {
      for (var i = 1; i <= cubeCounter; i++) {
        $("#sugar-cube-"+i).remove();
      }
      cubeCounter = 1;
    }

    var randomNum = Math.floor(parseInt( gramsSugar , 10 )/2.7);
    console.log($("#numCubes").val() + "g of sugar is " + parseInt( gramsSugar , 10 )/2.7 + " sugar cubes")
    var delayTime = 0;
    var winHeight = $( window ).height();
    var currentTopOffset = -300 - winHeight+430;

    for (var c = 0; c<randomNum; c++) {
      var randomAnim = randomAnimationTime();
      var randDel = randomDelayTime()+cubeCounter*30;
      if (c==randomNum-1) {
        delayTime=delayTime+randDel;
      }
      $(cloneCube()).attr('title',randomAnim+" " +randDel).delay(delayTime).animate({bottom: currentTopOffset, left:randomOffset()}, randomAnim, "customBounceEase");
      $('#sugar-container').css('transform','translateY('+cubeCounter*1.5+'px)')
      $('#sugar-container').css('transition','all ' + delayTime*1.5 + 'ms');
      $('#scale-top').css('transform','translateY('+cubeCounter*0.5+'px)');
      $('#scale-top').css('transition','all ' + delayTime*2.5 + 'ms');
      $('#scale-bar').css('transform','translateY(-'+cubeCounter*3.5+'px)');
      $('#scale-bar').css('transition','all ' + delayTime + 'ms');
      delayTime = delayTime + randDel;
      currentTopOffset = currentTopOffset+37;
    }


  }




/* Animation settings + functions */


var cubeCounter = 1;
var delay     = $("#delay").val();
var delayOffset = $("#delayOff").val();
var speed     = $("#speed").val();
var speedOffset = $("#speedOff").val();



function randomOffset() {
  return 3-Math.floor((Math.random() * 10) + 1);
}

function randomAnimationTime() {
  //return 800+Math.floor(Math.random() * 200);
  return parseInt( $("#speed").val() , 10 ) +Math.floor(Math.random() * parseInt( $("#speedOff").val(), 10 ) ) ;
}

function randomDelayTime() {
  //return 60+Math.floor(Math.random() * 300);
  return parseInt( $("#delay").val() , 10 ) +Math.floor(Math.random() * parseInt( $("#delayOff").val(), 10 ) ) ;
}

function clearCube(cubeID) { 
  $(cubeID).removeAttr('style'); 
}


jQuery.extend( jQuery.easing, {
  easeOutBounceNew: function (x, t, b, c, d) {
  
        
        if ((t/=d) < 1/3){  //t is time over distance, (the x parameter is also t/d)
            return (9*x*x);
        }else if (t < .75){ //the bounce is determined by a quadratic equation
                            //can be changed to change the bounce height.
            var thing = (-17.34*x*x)+(14.351*x)-2.944;
            if (thing > 0){
               return c*(1 - thing) + b;
            }else{ return 1;}
        }
  }
});
$.extend($.easing, {
    customBounceEase : makeBounceFunction(.3)
});



/* WIP Remove cubes w/ animation

	var delayRemove = 50;

	if (cubeCounter>1) {
		for (var i = 1; i <= cubeCounter; i++) {
			animateSugarCube(i, delayRemove);
			delayRemove = delayRemove+50;
		}
		function removeSugarCube(i) {
			setTimeout(function() {
				$("#sugar-cube-"+i).remove();
			},10)
		}
		function animateSugarCube(i, delayRemoveVar) {
			setTimeout(function() {
				$("#sugar-cube-"+i).addClass("animated bounceOutRight");
				removeSugarCube(i);
			},delayRemoveVar)
		}
		var oldCubeCount = cubeCounter;
		cubeCounter = cubeCounter+1;
	}

	setTimeout(restOfFunction(), 50*oldCubeCount);

	function restOfFunction() {
		var randomNum = Math.floor(parseInt( $("#numCubes").val() , 10 )/2.7);
		//console.log($("#numCubes").val() + "g of sugar is " + parseInt( $("#numCubes").val() , 10 )/2.7 + " sugar cubes")
		var delayTime = 0;
		var currentTopOffset = 800;

		for (var c = 0; c<randomNum; c++) {
			var randomAnim = randomAnimationTime();
			var randDel = randomDelayTime();
			if (c==randomNum-1) {
				delayTime=delayTime+randDel;
			}
			$(cloneCube()).attr('title',randomAnim+" " +randDel).delay(delayTime).animate({top: currentTopOffset, left:randomOffset()}, randomAnim, "customBounceEase");
			delayTime = delayTime + randDel;
			currentTopOffset = currentTopOffset-45;
		}

	}
*/


/**  https://github.com/clark-pan/Bounce-Function/blob/master/bounce-function.js
* Creates a bounce easing function to be used with animation.
* @param {Number} timeBetweenBounces This parameter specifies how long it takes between when the object hits the 'ground' and bounces back up to its apex. It needs to be between 0 and 1, but keep in mind that as the number approaches 1, the number of bounces required to smoothly animate the object to a stop will increase, and thus the function will take longer to calculate. A value of .5 will return the same function that Robert Penner uses.
* @param {Number} bounceBackThreshold The value at which the function will consider the object to be at rest. I.E. a value of .5 would mean that the object will be considered at rest if its last bounce put it at .5 of its total 'height'. The lower this number, the more times the easing function will bounce the object, even if its not visually distinguishable.
* @returns An easing function that takes a value representing how far into the animation, and returns the easing value.
* @type Function
*/
  function makeBounceFunction(timeBetweenBounces, bounceBackThreshold) {
  "use strict";
  var numberOfBounces, howFarUpItWillBounce, i, totalTime,
    timeBreakPoints, timeHalfwayPoints, normalisingFactors, normalisingConstants, lastBreakPoint, timeHalf;
  //Set to .5 if timeBetweenBounces is not specified or is greater than or equal to 1
  //If timeBetweenBounces is greater than or equal to 1, then it would actually mean that the object is bouncing 'higher', and thus will never come to a rest.
  if (timeBetweenBounces === undefined || typeof timeBetweenBounces !== "number" || timeBetweenBounces >= 1) {
    timeBetweenBounces = 0.5;
  } else if (timeBetweenBounces < 0) {
    timeBetweenBounces = 0;
  }

  //Sets the default bounceBackThreshold
  if (!bounceBackThreshold || typeof timeBetweenBounces !== "number") {
    bounceBackThreshold = 0.01;
  }
  //Figuring out how many bounces are necessary for it to come to a stop
  howFarUpItWillBounce = 1;
  i = 0;
  while (howFarUpItWillBounce > bounceBackThreshold) {
    howFarUpItWillBounce = Math.pow(timeBetweenBounces, 2 * i);
    i += 1;
  }
  numberOfBounces = i;

  //Figuring out what the total portion of time is.
  totalTime = 1;
  for (i = 1; i <= numberOfBounces; i += 1) {
    totalTime += Math.pow(timeBetweenBounces, i) * 2;
  }

  //Precalculating values needed in the easing function
  timeBreakPoints = [1 / totalTime];
  timeHalfwayPoints = [0];
  normalisingFactors = [1 / ((1 / totalTime) * (1 / totalTime))];
  normalisingConstants = [0];
  lastBreakPoint = timeBreakPoints[0];
  for (i = 1; i <= numberOfBounces; i += 1) {
    lastBreakPoint += Math.pow(timeBetweenBounces, i) / totalTime * 2;
    timeBreakPoints.push(lastBreakPoint);
    timeHalf = (lastBreakPoint - timeBreakPoints[i - 1]) / 2;
    timeHalfwayPoints.push(timeHalf + timeBreakPoints[i - 1]);
    normalisingConstants.push(1 - Math.pow(timeBetweenBounces, 2 * i));
    normalisingFactors.push((1 - normalisingConstants[i]) / (timeHalf * timeHalf));
  }

  //The easing function. x is a value between 0 and 1 representing how far into the animation it is.
  return function (x) {
    var i;
    if (x === 1) {
      return 1;
    }
    for (i = 0; i <= numberOfBounces; i += 1) {
      if (x < timeBreakPoints[i]) {
        return normalisingFactors[i] * (x -= timeHalfwayPoints[i]) * x + normalisingConstants[i];
      }
    }
  };
}