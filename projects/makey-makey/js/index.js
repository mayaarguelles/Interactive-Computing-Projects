$(document).ready(function() {
    $('.slidergallery').each(function() {
        $(this).slick({
            prevArrow: '<button type="button" class="slick-prev">&larr;</button>',
            nextArrow: '<button type="button" class="slick-next">&rarr;</button>',
            infinite: true,
            cssEase: 'cubic-bezier(.85,.01,.33,1)',
            speed: 800,
        });
    });
});