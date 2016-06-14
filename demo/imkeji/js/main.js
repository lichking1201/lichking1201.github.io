/*
* @Author: lichen
* @Date:   2016-06-10 14:55:39
* @Last Modified by:   lichen
* @Last Modified time: 2016-06-14 14:25:22
*/

'use strict';

$(document).ready(function() {
	var sectionOneStep = 0

	var sectionOneStepAdd = function() {
		if(sectionOneStep < 3) {
			sectionOneStep++
		} else {
			sectionOneStep = 2
		}
	}

	var sectionOneStepSub = function() {
		if(sectionOneStep > 0) {
			sectionOneStep--
		} else {
			sectionOneStep = 0
		}
	}

	var part1 = function() {

	}

  $('.s2-slick').slick({
    slidesToShow: 8,
    slidesToScroll: 8
  })
  $('.s3-slick').slick({
    slidesToShow: 5,
    slidesToScroll: 5,
    arrows: false,
    dots: true
  })
  $('.s2-slick-item').on('click', function(){

    var index = $(this).data('num')
    $('.s2-slick-show').fadeOut()
    $('.s2-slick-show').eq(index - 1).fadeIn()
  })

  $('.navbar-toggle').on('click', function(){
    $('.nav').toggleClass('open')
    var isOpen = $(this).hasClass('open')
    if(isOpen){
      $('.navbar-toggle.close').show()
      $('.navbar-toggle.open').hide()
    }else{
      $('.navbar-toggle.close').hide()
      $('.navbar-toggle.open').show()
    }
  })
  var padding = false
  $('#fullpage').fullpage({
  	onLeave: function(index, nextIndex, direction){
  		if(index == 1){
        setTimeout(function(){padding = false}, 1000)
        if(padding) return false
        padding = true
  			switch(sectionOneStep){
  				case 0:
  					$('.s1-img-blk').addClass('out')
						sectionOneStepAdd()
            $('.no1').addClass('in')
						return false
  					break
  				case 1:
  					$('.no1').removeClass('in')
            $('.no1').addClass('out')
            $('.no2').addClass('in')
            sectionOneStepAdd()
            return false
          case 2:
            sectionOneStep = 0
            $('.s1-img-blk, .no1, .no2').removeClass('in out')
            break
  				default: break
  			}
  		}

  		// if(nextIndex == 1 && direction == 'up'){
  		// 	switch(sectionOneStep){
  		// 		case 1:
  		// 			$('.s1-img').removeClass('out')
  		// 			break
  		// 		default: break
  		// 	}
  		// 	sectionOneStepSub()
  		// 	return false
  		// }
  	}
  })
})


$(document).ready(function(){
  var deg=0;
  /* Storing all the images into a variable */

  var images  = $('#stage img').removeClass('default').addClass('animationReady');
  var dim   = { width:images.width(),height:images.height()};

  var cnt = images.length;

  /* Finding the centers of the animation container: */
  var centerX = $('#stage').width()/2;
  var centerY = $('#stage').height()/2 - dim.height/2;

  function rotate(step,total){
    // This function loops through all the phone images, and rotates them
    // with "step" degrees (10 in this implementation) until total has reached 0

    /* Increment the degrees: */
    deg+=step;

    var eSin,eCos,newWidth,newHeight,q;

    /* Loop through all the images: */
    for(var i=0;i<cnt;i++){

      /* Calculate the sine and cosine for the i-th image */

      q = ((360/cnt)*i+deg)*Math.PI/180;
      eSin    = Math.sin(q);
      eCos    = Math.cos(q);

      /*
      / With the sine value, we can calculate the vertical movement, and the cosine
      / will give us the horizontal movement.
      */

      q = (0.6+eSin*0.4);
      newWidth  = q*dim.width;
      newHeight = q*dim.height;

      /*
      / We are using the calculated sine value (which is in the range of -1 to 1)
      / to calculate the opacity and z-index. The front image has a sine value
      / of 1, while the backmost one has a sine value of -1.
      */

      images.eq(i).css({
        top     : centerY+15*eSin,
        left    : centerX+200*eCos,
        opacity   : 0.8+eSin*0.2,
        marginLeft  : -newWidth/2,
        zIndex    : Math.round(80+eSin*20)
      }).width(newWidth).height(newHeight);
    }

    total-=Math.abs(step);
    if(total<=0) return false;

    // Setting the function to be run again in 40 seconds (equals to 25 frames per second):
    setTimeout(function(){rotate(step,total)},40);

  }

  // Running the animation once at load time (and moving the iPhone into view):
  rotate(10,360/cnt);

  $('#phoneCarousel .previous').click(function(){
    // 360/cnt lets us distribute the phones evenly in a circle
    rotate(-10,360/cnt);
  });

  $('#phoneCarousel .next').click(function(){
    rotate(10,360/cnt);
  });
  $('#phoneCarousel .previous,#phoneCarousel .next').hover(function(){
    clearInterval(timer);
    },function(){
    timer=setInterval(function(){rotate(10,360/cnt);},4000);
    });
  var timer=null;

    timer=setInterval(function(){rotate(10,360/cnt);},4000);
})

window.onload = function(){
  $(".loading").fadeOut()
}