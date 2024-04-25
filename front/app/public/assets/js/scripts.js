function setCookie (cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  let expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function unsetCookie (cname) {
  setCookie(cname, "", -1);
}

function getCookie (cname) {
  let name = cname + "=";
  let ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function saveLink (e) {
  setCookie("wordpress_redirectLink", jQuery(e).next().val(), 1);
}

function isMobile () {
  var isMobile = (/iphone|ipod|android|ie/).test
    (navigator.userAgent.toLowerCase());
  return isMobile;
}


function gformComplete () {
  var link = getCookie("wordpress_redirectLink");
  if (link) {
    link = decodeURIComponent(link);
    if (isMobile()) {
      window.open(link, "_self");
      setTimeout(function () {
        location.reload();
      }, 6000);
    } else {
      window.open(link, "_blanck");
      setTimeout(function () {
        location.reload();
      }, 2000);
    }
  }

  setCookie("wordpress_unrestrict", 1, 30);

  $(".modal.modal-side.fade.show[id^='gf_']:first > div > div").animate({
    scrollTop: (1)
  }, 500);

  setTimeout(function () {
    location.reload();
  }, 1000);
}

$(document).ready(function () {
  var paso = 400; // ajusta según tus necesidades

  $('.arrow-left').on('click', function () {
    $('#categoryFiltersBlock').animate({
      scrollLeft: '-=' + paso
    }, 500);
  });

  $('.arrow-right').on('click', function () {
    $('#categoryFiltersBlock').animate({
      scrollLeft: '+=' + paso
    }, 500);
  });

  checkOverflow();
  $(window).on('resize', checkOverflow);

  if ($('.hero button[data-toggle="modal"] > span:contains("Contact us")').length == 0) {
    if ($('.hero button[data-toggle="modal"] > span:contains("Contact Us")').length > 0) {
      setHandleCTAContactUsMenu();
    }
  } else {
    setHandleCTAContactUsMenu();
  }

  function setHandleCTAContactUsMenu () {
    if ($('.nav-link.btn-nav-link').text().toLowerCase().includes('contact us')) {
      var contactUsMenuCTA = $('a.btn-nav-link').filter(function () {
        return $(this).text().toLowerCase().includes("contact us");
      });
      contactUsMenuCTA.on('click', function (event) {
        event.preventDefault();
        var contactUsButton = $('.hero button[data-toggle="modal"]').filter(function () {
          return $(this).text().toLowerCase().includes("contact us");
        });

        if (contactUsButton.data() !== 'undefined' && contactUsButton.data().target.includes("hs")) {
          contactUsButton.click()
        } else {
          window.location.replace(this.href);
        }
      });
    }
  }

  $("a.btn.btn-primary[data-toggle='modal'][data-target^='#gf_']:first").on('click', function (e) {
    e.preventDefault();
  })

});

function checkOverflow () {
  var $categoryFiltersBlock = $('#categoryFiltersBlock');

  if ($categoryFiltersBlock.prop('scrollHeight') > $categoryFiltersBlock.prop('clientHeight') || $categoryFiltersBlock.prop('scrollWidth') > $categoryFiltersBlock.prop('clientWidth')) {
    $('.arrow-right, .arrow-left').slideDown()
  } else {
    $('.arrow-right, .arrow-left').slideUp()
  }
}
