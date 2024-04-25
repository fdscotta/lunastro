function revealMarkers(step) {
    let mColor = '';
    if (step == 's1') { mColor = 'blue' }
    else if (step == 's2') { mColor = 'purple' }
    else if (step == 's3') { mColor = 'fuchsia' }
    else if (step == 's4') { mColor = 'pink' }

    $('.markers .marker').each(function () {
        var stepsAttr = $(this).attr('steps');
        if (typeof stepsAttr !== 'undefined' && stepsAttr.includes(step)) {
            $(this).attr('color', mColor);
        } else {
            $(this).attr('color', '');
        }
    });
}

function toggleCk() {
    let ck = $('#marker-ck');
    let toggleCkBtn = $('#toggleCkBtn');
    let mColor = 'yellow';
    if (ck.attr('color') !== 'yellow') {
        ck.attr('color', mColor);
        toggleCkBtn.parent().parent().addClass('disabled')
    } else {
        ck.attr('color', '');
        toggleCkBtn.parent().parent().removeClass('disabled')
    }
}

function addMarker() {
    const newMarkerName = $('#newMarkerName');

    let col = '';
    let max = false;

    if (newMarkerName.val() !== '') {
        const markerMarkup = '<div class="marker new order-2" color><span>' + newMarkerName.val() + '</span><button class="rounded filled closed" onclick="removeMarker(this);"></button></div>';
        newMarkerName.val('');

        let newMarkersL = $('.col-2:nth-child(1).markers-new .marker.new').length;
        let newMarkersR = $('.col-2:nth-child(2).markers-new .marker.new').length;
        let newMarkers = newMarkersL + newMarkersR;

        if (newMarkersR < 3) {
            col = $('.col-2:nth-child(2).markers-new');
        } else if (newMarkersL < 4) {
            col = $('.col-2:nth-child(1).markers-new');
        }

        col.prepend(markerMarkup);
        setTimeout(() => {
            $('.marker.new').attr('color', 'green');
        }, 100);

        if (newMarkers == 6) {
            max = true;
            newMarkerName.prop('disabled', true);
            newMarkerName.parent().parent().parent().addClass('disabled');
        } else {
            newMarkerName.focus();
        }
    }
}

function removeMarker(el) {
    const newMarkerName = $('#newMarkerName');
    const removedMarker = $(el).parent();
    const removedMarkerParent = removedMarker.parent();
    const isFirstColumn = removedMarkerParent.is('.col-2:nth-child(1).markers-new');

    newMarkerName.prop('disabled', false);
    newMarkerName.parent().parent().parent().removeClass('disabled');

    removedMarker.attr('color', '');
    setTimeout(() => {
        removedMarker.remove();
    }, 1000);
    if (!isFirstColumn) {
        const firstColumn = $('.col-2:nth-child(1).markers-new');
        const markerToMove = firstColumn.find('.marker.new').last();
        if (markerToMove.length) {
            markerToMove.attr('color', '');
            setTimeout(() => {
                markerToMove.prependTo(removedMarkerParent);
                setTimeout(() => {
                    markerToMove.attr('color', 'green');
                }, 100);
            }, 1000);
        }
    }
}

$(window).on('load resize', function () {
    const items = $('.panel-item:not(.active)');

    if (window.matchMedia('(max-width: 991px)').matches) {
        items.slideUp();
        $('.panel-item p').slideDown();
    } else {
        items.slideDown();
        $('.panel-item:not(.active) p').slideUp();
    }
});

$(window).on('load', function () {
    const items = $('.panel-item');
    const up = $('.panel-nav button.up');
    const down = $('.panel-nav button.down');

    items.on('click', function () {
        // ITEMS
        if (!$(this).hasClass('active')) {
            if (window.matchMedia('(max-width: 991px)').matches) {
                $('.panel-item.active').slideUp();
                $(this).slideDown();
            } else {
                $('.panel-item.active p').slideUp();
                $('p', this).slideDown();
            }
            items.removeClass('active');
            $(this).addClass('active');
        }
        // NEXT
        if ($(this).is(':last-child')) {
            down.prop('disabled', true)
        } else {
            down.prop('disabled', false)
        }
        // PREV
        if ($(this).is(':first-child')) {
            up.prop('disabled', true)
        } else {
            up.prop('disabled', false)
        }
    })

    // NAVIGATION
    $('.panel-nav button').on('click', function () {
        if ($(this).hasClass('up')) {
            $('.panel-item.active').prev().click()
        }
        if ($(this).hasClass('down')) {
            $('.panel-item.active').next().click()
        }
    })

    // Input enter
    $('#newMarkerName').on('focus', function () {
        $(this).on('keypress', function (event) {
            if (event.which == 13) {
                addMarker();
            }
        });
    });

    // LIGHT / DARK MODE
    $('#colorMode').change(function () {
        $('html').toggleClass('dark');
        $('.nav-home-acf').toggleClass('btn-light btn-dark');
        $('.main-navbar').toggleClass('navbar-light  navbar-dark');
        $('header.hero-minerva').toggleClass('hero');
    });

    // DEFAULT DARK ON MINERVA
    if ($('header.hero').length != 0) {
        $('header.hero-minerva').toggleClass('hero');
        $('#colorMode').prop('checked', false).change();
    }
})

/*------------------------
    SEND PANEL FORM
------------------------*/
function sendPanel() {
    let aaurl = $('#aaurl').val();
    let email = $("#emailAddress");
    $('.loader-box').addClass('loading');

    html2canvas(document.querySelector("#capture")).then((canvas) => {
        var data = canvas.toDataURL();
        jQuery.ajax({
            url: aaurl,
            type: 'post',
            data: "action=send_panel&email=" + email.val().trim() + "&content=" + encodeURIComponent(data),
            success: function () {
                $('#requestInfo').slideUp();
                $('#thankyoupage').slideDown();
                $('.loader-box').removeClass('loading');
            }
        });
    });
}

function validateAndSubmitForm() {
    const emailAddress = $("#emailAddress");
    const emailValue = emailAddress.val().trim();
    const badEmail = $("#badEmail");
    const emptyEmail = $("#emptyEmail");
    const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;

    badEmail.slideUp();
    emptyEmail.slideUp();

    if (emailValue === "") {
        emptyEmail.slideDown();
        return;
    }

    if (!emailRegex.test(emailValue)) {
        badEmail.slideDown();
        return;
    }
    badEmail.slideUp();
    emptyEmail.slideUp();

    sendEmail();
}

function sendEmail() {
    sendPanel();
}

$(document).ready(function () {
    $("#emailAddress").on("keypress", function (event) {
        if (event.which == 13) {
            event.preventDefault();
            validateAndSubmitForm();
        }
    });
});

$('#sendPanel').on('shown.bs.modal', function () {
    $('#emailAddress').focus();
});
