jQuery(document).ready(function() {

    var maskPhone = jQuery("form input.phone__mask");
    if (maskPhone.length) {
        maskPhone.mask('+0 (000) 000-00-00', {placeholder: "+_ (___) ___-__-__"});
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

    var callPopup = jQuery(".call__popup");
    if(callPopup.length) {
        var popupBg = jQuery(".popup__show-bg");
        callPopup.on("click", function (e) {
            e.preventDefault();
            var _this = jQuery(this),
                popup = jQuery("#" + _this.attr("data-target")),
                service = _this.attr("data-service");
            if(typeof service !== 'undefined' && service.length){
                popup.find('input[name=service]').val(service);
            }

            return popup.fadeIn() && popupBg.show();
        });
        jQuery(".popup").on("click", ".close", function () {
            return jQuery(this).closest(".popup").fadeOut("slow") && popupBg.fadeOut();
        });
    }

    var tabs = jQuery(".tabs");
    if(tabs.length){
        tabs.lightTabs();
    }

    jQuery(".loader, .loader__bg").delay(300).fadeOut('300', function() {
        return jQuery(this).fadeOut();
    });

    //jQuery("#sticky").sticky({topSpacing:0, zIndex: 20});

    lightbox.option({
        'albumLabel': 'Изображение %1 из %2'
    });

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
