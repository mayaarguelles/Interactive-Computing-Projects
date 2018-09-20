// Allows users without javascript to navigate through the content with native scroll functions
$('html').addClass('js');

// Animate in the project information
$('.project h2').hide();
$('.project h3').hide();
$('.project p').hide();
setTimeout(function() {
    $('.project').addClass('inactive');
    $('.project h2').show();
    $('.project h3').show();
    $('.project p').show();
}, 200);

setTimeout(function() {
    $('.project').eq(0).toggleClass('inactive');
}, 600);




var slide = 0;
var preventspam = true;
const numOfSlides = $('.project').length - 1;

$(document).ready(function() {
    $('.prev').hide();
});

$('.next').on('click', function() {
    if (preventspam) {
        preventspam = false;
        
        if (slide < numOfSlides) {
            slide++;
            $('.project').eq(slide-1).toggleClass('inactive');
            setTimeout(function() {
                $('.project').eq(slide).toggleClass('inactive');
                preventspam = true;
            }, 600);
        }

        if (slide > 0) {
            $('.prev').show();
        } if (slide == numOfSlides) {
            $('.next').hide();
        }

        console.log("Moving on to slide " + (slide+1));
        $(".container").css('left', (slide*-100)+"vw");
        
    }
});

$('.prev').on('click', function() {
    if (preventspam) {
        preventspam = false;
        
        
        if (slide > 0) {
            slide--;
            $('.project').eq(slide+1).toggleClass('inactive');
            setTimeout(function() {
                $('.project').eq(slide).toggleClass('inactive');
                preventspam = true;
            }, 600);
        }

        if (slide == 0) {
            $('.prev').hide();
        } if (slide < numOfSlides) {
            $('.next').show();
        }

        console.log("Moving on to slide " + (slide+1));
        $(".container").css('left', (slide*-100)+"vw");
    }
});


$('.hamburger').on('click', function() {
    $('.hamburger').toggleClass('open');
    $('.nav').toggleClass('open');
});

$('.nav li').on('click', function() {
    if (preventspam) {
        if (slide != $(this).index()) {
            $('.project').eq(slide).toggleClass('inactive');

            slide = $(this).index();

            setTimeout(function() {
                $('.project').eq(slide).toggleClass('inactive');
                preventspam = true;
            }, 600);

            if (slide == 0) {
                $('.prev').hide();
            } if (slide < numOfSlides) {
                $('.next').show();
            } if (slide > 0) {
                $('.prev').show();
            } if (slide == numOfSlides) {
                $('.next').hide();
            }

            console.log("Moving on to slide " + (slide+1));
            $(".container").css('left', (slide*-100)+"vw");
        }
    }
});

$('.project a').on('click', function(e) {
    console.log("HEELLOOO");
    var url = $(this).attr('href');
    e.preventDefault(); 

    $('body').addClass('exit');
    
    setTimeout(function(){
         window.location = url;
    },500);   
    
});
