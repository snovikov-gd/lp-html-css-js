$(function() {
    $("#slider-range").slider({
        range: true,
        min: 0,
        max: 5,
        values: [0, 2],
        slide: function(event, ui) {
            setTimeout(function () {
                var leftMargin = $('#slider-range .ui-slider-handle.ui-corner-all.ui-state-default')[0].style.left,
                    rightMargin = $('#slider-range .ui-slider-handle.ui-corner-all.ui-state-default')[1].style.left;

                $('#slider-rating-left')
                    .css('left', leftMargin)
                    .text($("#slider-range")
                        .slider("values", 0));

                $('#slider-rating-right')
                    .css('left', rightMargin)
                    .text($("#slider-range")
                        .slider("values", 1));
            }, 0)
        }
    });

    $('#slider-rating-left')
        .css('left', $('#slider-range .ui-slider-handle.ui-corner-all.ui-state-default')[0].style.left)
        .text($("#slider-range")
            .slider("values", 0));

    $('#slider-rating-right')
        .css('left', $('#slider-range .ui-slider-handle.ui-corner-all.ui-state-default')[1].style.left)
        .text($("#slider-range")
            .slider("values", 1));



    $("#slider-price").slider({
        range: true,
        min: 0,
        max: 1000,
        values: [275, 822],
        slide: function(event, ui) {
            var leftMargin = $('#slider-price .ui-slider-handle.ui-corner-all.ui-state-default')[0].style.left,
                rightMargin = $('#slider-price .ui-slider-handle.ui-corner-all.ui-state-default')[1].style.left;

            $('#slider-price-left')
                .css('left', leftMargin)
                .text($("#slider-price")
                    .slider("values", 0));

            $('#slider-price-right')
                .css('left', rightMargin)
                .text($("#slider-price")
                    .slider("values", 1));
        }
    });

    $('#slider-price-left')
        .css('left', $('#slider-price .ui-slider-handle.ui-corner-all.ui-state-default')[0].style.left)
        .text($("#slider-price")
            .slider("values", 0));

    $('#slider-price-right')
        .css('left', $('#slider-price .ui-slider-handle.ui-corner-all.ui-state-default')[1].style.left)
        .text($("#slider-price")
            .slider("values", 1));
});