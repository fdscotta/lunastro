$(window).on('load', function () {
    $('.video-preview').on('click', function(){
        //$('#input_45_18').val($(this).find('img')[0].attributes.alt.value);
        $('#input_45_18').val($(this).parents('.item-video').find('.video-title')[0].value);
    });
    $("button[data-plyr='play']").on('click', function(){
        var entryID = getCookie('wordpress_unrestrict_webinar_entry_id');
        var videoName = $(this).parents('.item-video').find('.video-title')[0].value;
        jQuery.ajax({
			url : wpAjax.ajaxUrl,
			type: 'post',
			data: "action=update-bm-entry&entryID=" + entryID + "&videoName=" + videoName,
			success: function(){
				 console.log('updeteado');
			}

		});
    });     
}) 