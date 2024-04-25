function getResults (category = 'All', seachString = '', sort = 'no') {
    jQuery.ajax({
        url: wpAjax.ajaxUrl,
        type: 'get',
        data: "action=resource_center_filter_results&category=" + category + "&serachBox=" + seachString + "&sort=" + sort,
        success: function (res) {
            $('#resultsBlock').html(res.data);
            $('#resultContainer').toggleClass('loading');
            loadMoreLink();
        }
    });
}

function getParamFromUrl (paramName) {
    var search = window.location.search.substring(1);
    var params = new URLSearchParams(search);
    return params.get(paramName);
}

$(document).ready(function () {
    let category = (getParamFromUrl('category')) ? getParamFromUrl('category') : 'All';
    let searchBox = (getParamFromUrl('title')) ? getParamFromUrl('title') : '';
    let sort = (getParamFromUrl('sort')) ? getParamFromUrl('sort') : 'no';
    getResults(category, searchBox, sort);

    $('#searchByString').on('click', function (e) {
        e.preventDefault();
        searchByString($('#searchString').val());
    });

    $('#searchString').on('keypress', function (e) {
        if (e.which == 13) {
            searchByString($('#searchString').val());
        }
    });

    $("input[name='advFCheckbox']").click(function () {
        var checkedboxes = advFiltersFunction();
        if ($(this).is(":checked")) {
            var item_value = $(this).val();
            var item_text = $(this).next("label").text().trim();
            let category = $('.resource-filter-link.active').data('categorySlug');
            console.log("Checkbox " + item_value + " is checked.");
            checkedboxes.push(item_value);
            var buttonfilterhtml = `<span id="childitem-${item_value}" class="filter-active"> ` +
                ` ${item_text}<button class="filter-remove" ` +
                ` onClick="removeAdvFilter('${item_value}')"></button></span> `;

            $('#selectedfilters').prepend(buttonfilterhtml);
            $('#advFilters').val(checkedboxes.join(','));
            reFilterResults(category, checkedboxes);
        } else if ($(this).is(":not(:checked)")) {
            console.log("Checkbox " + $(this).val() + " is unchecked.");
            var item = $(this).val();
            removeAdvFilter(item);
        }
    });

    function reorderItems (sort_order = 'no', orderAttribute = 'data') {
        var resultsBlock = $('#resultsBlock');
        var divs = resultsBlock.children('div');

        divs.sort(function (a, b) {
            if (sort_order == 'no' || sort_order == 'on') {
                var valueA = $(a).data(orderAttribute);
                var valueB = $(b).data(orderAttribute);
            } else {
                var valueA = $(a).find('.h6')[0].innerText;
                var valueB = $(b).find('.h6')[0].innerText;
            }

            if (sort_order == 'on' || sort_order == 'az') {
                return valueA.localeCompare(valueB);
            } else {
                return valueB.localeCompare(valueA);
            }

        });

        resultsBlock.html(divs);
        resultsBlock.append('<button class="btn btn-link lighter-line" onClick="showMoreResults()" id="LoadMore_UpcomingEvents" style="display:none;">View more resources</button>');
    }

    $("#sort_order").on('change', function () {
        let category = $('.resource-filter-link.active').data('categorySlug');
        let advFilter = advFiltersFunction();

        let sort_order = $('#sort_order').val();
        let orderAttribute = 'date';

        switch (sort_order) {
            case 'no':
                orderAttribute = 'date';
                break;
            case 'on':
                orderAttribute = 'date';
                break;
            case 'az':
                orderAttribute = 'title';
                break;
            case 'za':
                orderAttribute = 'title';
                break;
            default:
                sort_order = 'no';
                orderAttribute = 'date';
                break;
        }

        reorderItems(sort_order, orderAttribute);
        setTimeout(function () {
            reFilterResults(category, advFilter);
        }, 1000);
    });

    $("#selectedfilters").on('DOMSubtreeModified', function () {
        if ($('#selectedfilters').children().length > 1) {
            $('.filter-remove-all').show()
        } else {
            $('.filter-remove-all').hide()
        }
    });

    reorderFilters()
});

$(document).on('click', '.resource-filter-link', function (e) {
    let category = e.target.dataset.categorySlug;
    let advFilter = advFiltersFunction();
    $('.resource-filter-link').removeClass('active');
    $(e.target).toggleClass('active');

    reFilterResults(category, advFilter);
});

function reFilterResults (category = 'all', advFilter = []) {
    $('#resultContainer').toggleClass('loading');
    $('#resultsBlock > div').hide();
    $("#emptyResults").slideUp();
    $('#resultsBlock > div').each(function () {
        var currentItem = $(this);

        var dataCategory = currentItem.data('category');
        var dataFilter = currentItem.data('filters');
        var matched = false;

        if (dataCategory == category || category == 'all') {
            // Check if at least one filter matches
            if (advFilter.length > 0 && advFilter[0] !== undefined) {
                if (advFilter.some(val => dataFilter.split(', ').some(x => x == val))) {
                    matched = true;
                }
            } else {
                matched = true;
            }
        }

        if (matched) {
            currentItem.slideDown();
        }
    });

    if ($('#searchString').val() !== "" && $('#searchString').val() !== undefined) {
        searchByString($('#searchString').val());
    }

    setTimeout(function () {
        loadMoreLink();
        $('#resultContainer').toggleClass('loading');
    }, 1000);

}

function loadMoreLink () {
    if ($('#resultsBlock > div:visible').length > 12) {
        $('#resultsBlock > div:visible:gt(11)').slideUp();
        $('#LoadMore_UpcomingEvents').show();
    } else {
        $('#LoadMore_UpcomingEvents').hide();
    }
    if ($('#resultsBlock > div:visible').length == 0) {
        $("#emptyResults").slideDown();
    }
}

function removeActiveFromCategories () {
    $('.filters-box a').children().each(function () {
        if ($(this).hasClass("active")) {
            $(".resource-filter-link").removeClass("active");
        }
    })
}

function advFiltersFunction () {
    var advFilters = $('#advFilters').val().split(',').filter(r => r !== '');

    if (advFilters) {
        return advFilters;
    } else {
        return '';
    }
}

function removeAdvFilter (advFilter) {
    var checkedboxes = advFiltersFunction();
    let category = $('.resource-filter-link.active').data('categorySlug');
    var index = checkedboxes.indexOf(advFilter);

    $('input:checkbox[value="' + advFilter + '"]')[0].checked = false;
    checkedboxes.splice(index, 1);

    $('#advFilters').val(checkedboxes.join(','));
    initSelectedAdvFilters(checkedboxes);
    reFilterResults(category, checkedboxes);
}

function initSelectedAdvFilters (advFilters) {
    $('#selectedfilters [id^="childitem-"]').remove();
    $('input:checkbox[name="advFCheckbox"]').each(function () {
        if (advFilters.find(x => x == $(this).val())) {
            $(this).prop('checked', true);
            var filterVal = $(this).val();
            var filterName = $(this).data('advfiltername');

            var buttonfilterhtml = `<span id="childitem-${filterVal}" class="filter-active">` +
                ` ${filterName}<button class="filter-remove" ` +
                `onClick="removeAdvFilter('${filterVal}')"></button></span>`;
            $('#selectedfilters').prepend(buttonfilterhtml);
        }
    });
}

function searchByString (searchString) {
    var checkedboxes = advFiltersFunction();
    let category = $('.resource-filter-link.active').data('categorySlug');
    if (typeof searchString !== "undefined" && searchString !== "") {
        removeActiveFromCategories();
        $('#resultsBlock > div:visible').each(function () {
            var currentItem = $(this);

            var dataValue = $(currentItem).find('.h6')[0].innerText;

            if (dataValue.toLowerCase().indexOf(searchString) == -1) {
                currentItem.slideUp();
            }
        });
        loadMoreLink();
    } else {
        reFilterResults(category, checkedboxes);
    }
}

function showMoreResults () {
    let activeCategory = $('.resource-filter-link.active').data('categorySlug');
    let checkedboxes = advFiltersFunction();

    if (activeCategory == 'all' && checkedboxes.length == 0) {
        $('#resultsBlock > div:hidden').slideDown();
    }
    if (activeCategory != 'all' && checkedboxes.length == 0) {
        $('#resultsBlock > div[data-category="' + activeCategory + '"]:hidden').slideDown();
    }

    if (activeCategory == 'all' && checkedboxes.length > 0) {
        checkedboxes.forEach(function (val) {
            $('#resultsBlock > div').filter(function () {
                var filters = $(this).attr('data-filters');
                var regex = new RegExp('(?<!-)' + val + '(?!-)', 'i');
                return regex.test(filters);
            }).slideDown()
        });
    }
    $('#LoadMore_UpcomingEvents').slideUp();
}

function removeAllFilters () {
    let activeCategory = $('.resource-filter-link.active').data('categorySlug');
    $('input:checkbox[name="advFCheckbox"]').prop('checked', false);
    advFilters = [];

    $('#advFilters').val(advFilters.join(','));
    initSelectedAdvFilters(advFilters);
    reFilterResults(activeCategory, advFilters);
}

function reorderFilters () {
    var cardFilters = $(".card-filters");

    $(cardFilters).each(function () {
        var cardBody = $(this).find(".card-body");
        var filterTitle = $(this).find("h6")[0].innerText;
        var collapseElement = $(this).find(".collapse");

        cardBody.detach();

        if (filterTitle == 'Plex Level') {
            cardBody.children('.custom-control').sort(function (a, b) {
                var valueA = $(a).find('.custom-control-label').text().match(/\d+/);
                var valueB = $(b).find('.custom-control-label').text().match(/\d+/);

                valueA = valueA ? parseInt(valueA, 10) : 0;
                valueB = valueB ? parseInt(valueB, 10) : 0;

                return valueA - valueB;
            }).appendTo(cardBody);
        } else {
            cardBody.children('.custom-control').sort(function (a, b) {
                var valueA = $(a).find('.custom-control-label').text();
                var valueB = $(b).find('.custom-control-label').text();

                return valueA.localeCompare(valueB);
            }).appendTo(cardBody);
        }


        collapseElement.append(cardBody);
    });
}