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
    |   custom datepicker
    |-----------------------------------------------------------
    */
    var arrival_date = jQuery('input.date_in'),
        departure_date = jQuery('input.date_out'),
        tomorrow = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);

    departure_date.datepicker({
        'autoClose': true,
        'dateFormat': 'dd.mm.yyyy',
        'minDate': tomorrow
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

    form.on('click', '.zmdi-calendar-note', function () {
        return jQuery(this).closest('div').find('label').click();
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
