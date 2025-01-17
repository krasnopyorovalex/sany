jQuery(document).ready(function() {

    var burgerMob = jQuery(".burger-mob");
    if(burgerMob.length) {
        var mobileMenu = jQuery(".mobile__menu"),
            closeMenuBtn = jQuery(".close-menu-btn");
        burgerMob.on("click", function () {
            return mobileMenu.addClass("is__opened") && mobileMenu.fadeIn("fast");
        });
        closeMenuBtn.on("click", function () {
            return mobileMenu.removeClass("is__opened") && mobileMenu.fadeOut();
        });
        mobileMenu.on("click", ".has__child > span", function (e) {
            e.preventDefault();
            var _this = jQuery(this);
            if( _this.next('ul').is(':hidden') ) {
                _this.next('ul').slideDown();
            } else {
                _this.next('ul').slideUp();
            }
            return false;
        });
    }

    var maskPhone = jQuery("form input.phone__mask");
    if (maskPhone.length) {
        maskPhone.mask('+0 (000) 000-00-00', {placeholder: "+_ (___) ___-__-__"});
    }

    var productGal = jQuery(".big__carousel");
    if (productGal.length) {
        productGal.owlCarousel({
            loop:false,
            margin:0,
            nav:true,
            dots:false,
            items: 1
        });

        productGal.on('changed.owl.carousel', function(event) {
            var index = event.item.index,
                items = thumbs.find(".owl-item");
            items.removeClass("current");
            return thumbs.trigger('to.owl.carousel', index) && items.eq(index).addClass("current");
        });

        var thumbs = jQuery(".thumbs__carousel");
        thumbs.owlCarousel({
            items: 6,
            margin:5,
            nav:true,
            dots:false,
            responsive : {
                0 : {
                    items: 3
                },
                480 : {
                    items: 3
                },
                768 : {
                    items: 5
                }
            }
        });
        thumbs.on('click', 'img', function() {
            var _this = jQuery(this),
                index = _this.attr("data-index");
            thumbs.find(".owl-item").removeClass("current");
            return _this.closest(".owl-item").addClass("current") && productGal.trigger('to.owl.carousel', index);
        });
        thumbs.find(".owl-item").eq(0).addClass("current");
    }

    var slider = jQuery('.main__slider');
    if (slider.length) {
        slider.owlCarousel({
            loop:true,
            margin:0,
            nav:false,
            dots:true,
            items: 1,
            autoplay: true,
            autoplayHoverPause: true,
            smartSpeed: 1500
        });
    }
    // var roomsSlider = jQuery('.rooms__slider');
    // if (roomsSlider.length) {
    //     roomsSlider.owlCarousel({
    //         loop:false,
    //         margin:10,
    //         nav:true,
    //         navText: ['<i class="prev-arrow"></i>','<i class="next-arrow"></i>'],
    //         dots:false,
    //         items: 4
    //     });
    // }

    var tabs = jQuery(".tabs");
    if(tabs.length){
        tabs.lightTabs();
    }

    jQuery(".loader, .loader__bg").delay(300).fadeOut('300', function() {
        return jQuery(this).fadeOut();
    });

    jQuery("#sticky").sticky({topSpacing:0, zIndex: 20});

    lightbox.option({
        'albumLabel': 'Изображение %1 из %2'
    });

    /*
    |-----------------------------------------------------------
    |   custom datepicker
    |-----------------------------------------------------------
    */
    var arrival_date = jQuery('input.date_in'),
        departure_date = jQuery('input.date_out'),
        tomorrow = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);

    departure_date.datepicker({
        'autoClose': true,
        'dateFormat': 'dd.mm.yyyy',
        'minDate': tomorrow,
        'position': 'bottom right'
    });

    arrival_date.datepicker({
        'autoClose': true,
        'dateFormat': 'dd.mm.yyyy',
        'minDate': new Date(),
        onSelect: function (fd, date) {
            if(date){
                var change_date = new Date(date.getTime()),
                    departure_date_val = departure_date.val().split('.');

                departure_date_val = new Date(
                    parseInt(departure_date_val[2]),
                    parseInt(departure_date_val[1]) - 1,
                    parseInt(departure_date_val[0])
                );
                departure_date.data('datepicker').update('minDate', new Date(date.getTime() + 24*60*60*1000));

                if(departure_date_val <= change_date){
                    return departure_date.val('');
                }
            }
            return true;
        }
    });

    var form = jQuery('form');
    form.on('click', '.icon__calendar', function () {
        return jQuery(this).closest('div').find('label').click();
    });

    var galleryFilter = jQuery('.gallery__filter'),
        galleryBox = jQuery('.gallery__box');
    if(galleryFilter.length) {
        galleryFilter.on('click', 'li', function () {
            var _this = jQuery(this),
                filter = _this.attr("data-filter");

            if (filter) {
                galleryBox.find("figure").hide().fadeIn().filter(":not(."+filter+")").hide();
            }

            return _this.addClass('active').siblings('li').removeClass('active') && _this.parent('ul').toggleClass('is__opened');
        });
    }
    /*
    |-----------------------------------------------------------
    |   notification
    |-----------------------------------------------------------
    */
    var Notification = {
        element: false,
        setElement: function (element) {
            return this.element = element;
        },
        notify: function (message) {
            if( ! this.element) {
                this.setElement(jQuery(".notify"));
            }
            return this.element.html('<div>' + message + '</div>') && this.element.fadeIn().delay(7000).fadeOut();
        }
    };

    formHandler("#check__order-recall", Notification, true);
    formHandler("#check__order-popup", Notification, true);
    formHandler("#check__order", Notification);
    formHandler("#check__guestbook", Notification);
});

function formHandler(selector, Notification, hide) {
    return jQuery(document).on("submit", selector, function(e){
        e.preventDefault();
        var _this = jQuery(this),
            url = _this.attr('action'),
            data = _this.serialize(),
            submitBlock = _this.find(".submit"),
            agree = _this.find(".i__agree input[type=checkbox]");
        if (agree.length && ! agree.prop("checked")) {
            agree.closest(".i__agree").find(".error").fadeIn().delay(3000).fadeOut();
            return false;
        }
        return jQuery.ajax({
            type: "POST",
            dataType: "json",
            url: url,
            data: data,
            beforeSend: function() {
                return submitBlock.addClass("is__sent");
            },
            success: function (data) {
                if(typeof hide !== "undefined" && hide) {
                    jQuery(".popup").fadeOut("slow") && jQuery(".popup__show-bg").fadeOut();
                }
                Notification.notify(data.message);
                return submitBlock.removeClass("is__sent") && _this.trigger("reset");
            }
        });
    });
}

jQuery(document).ajaxError(function () {
    return jQuery("form .submit").removeClass("is__sent") && jQuery('.notify').html('<div>Произошла ошибка =(</div>').fadeIn().delay(3000).fadeOut();
});
