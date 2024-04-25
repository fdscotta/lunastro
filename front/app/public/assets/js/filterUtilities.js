$(document).ready(function () {
    //filter link click start
    $(document).on('click', '.filter-link', function (e) {
        var advFilter = advFiltersFunction();
        var categoryFilter = categoryFilterFunction($(this));
        e.preventDefault();
        var url = document.location.protocol + '//' + document.location.host + document.location.pathname + advFilter;
        if (advFilter != '' || categoryFilter != '') {
            document.location = '?' + advFilter + '&' + categoryFilter;
        } else {
            document.location = '?' + categoryFilter;
        }
    });

    $('#searchByString').on('click', function (e) {
        e.preventDefault();
        searchByString($('#searchString').val());
    });

    $('#searchString').on('keypress', function (e) {
        if (e.which == 13) {
            searchByString($('#searchString').val());
        }
    });

    if ($('#advFilters').val()) {
        var checkedboxes = $('#advFilters').val().split(',').filter(r => r !== '');
        initAdvFilters(checkedboxes);
    }
    $("input[name='advFCheckbox']").click(function () {
        var checkedboxes = $('#advFilters').val().split(',').filter(r => r !== '');
        if ($(this).is(":checked")) {
            var item_value = $(this).val();
            var item_text = $(this).next("label").text();
            console.log("Checkbox " + item_value + " is checked.");
            checkedboxes.push(item_value);
            var buttonfilterhtml = `<span id="childitem-${item_value}" class="filter-active"> ` +
                ` ${item_text}<button class="filter-remove" ` +
                ` onClick="removeAdvFilter('${item_value}')"></button></span> `;

            //$('#selectedfilters').append(buttonfilterhtml);
        } else if ($(this).is(":not(:checked)")) {
            console.log("Checkbox " + $(this).val() + " is unchecked.");
            var item = $(this).val();

            var index = checkedboxes.indexOf(item);
            $('span#childitem-' + item).remove();
            delete checkedboxes[index];
        }
        $('#advFilters').val(checkedboxes.join(','));
    });
});


function searchByString (searchString) {
    if (typeof searchString !== "undefined") {
        removeActiveFromCategories();
        var url = document.location.protocol + '//' + document.location.host + document.location.pathname;
        url += "?title=" + searchString;
        document.location = url;
    }
}

function removeActiveFromCategories () {
    $('.filters-box a').children().each(function () {
        if ($(this).hasClass("active")) {
            $(".filter-link").removeClass("active");
        }
    })
}
$('.filters-table input:checkbox').each(function () {
    $(this).on('change', function () {
        var atLeastOneIsChecked = false;
        $('.filters-table input:checkbox').each(function () {
            if ($(this).is(':checked')) {
                atLeastOneIsChecked = true;
            }
        });
    })
})

$(document).on('click', '#apply-filters', function (e) {
    applyAdvFilters();
});

function applyAdvFilters () {
    var advFilter = advFiltersFunction();
    var categoryFilter = categoryFilterFunction($(this));
    var url = document.location.protocol + '//' + document.location.host + document.location.pathname + advFilter;
    if (advFilter != '' || categoryFilter != '') {
        document.location = '?' + advFilter + '&' + categoryFilter;
    } else {
        document.location = '?' + advFilter;
    }
}

function advFiltersFunction () {
    var advFilters = $('#advFilters').val();

    if (advFilters) {
        return "advanced-filters=" + advFilters;
    } else {
        return '';
    }
}

function categoryFilterFunction (elemento) {
    var category = elemento.data('category');

    if (typeof category == "undefined") {
        category = $('#categoryFilter').val();
        category = $(`button[data-category-name='${category}']`)
    } else {
        category = elemento;
    }

    if (category) {
        categoryName = category.data('category-name');

        if (category.hasClass("active")) {
            $(".filter-link").removeClass("active");
        }
        // Else, the element doesn't have the active class, so we remove it from every element before applying it to the element that was clicked
        else {
            $(".filter-link").removeClass("active");
            category.addClass("active");
        }

        var url = document.location.protocol + '//' + document.location.host + document.location.pathname;
        if (categoryName != 'All') {
            return "category=" + categoryName;
        } else {
            return '';
        }
    }
}

function initAdvFilters (advFilters) {
    $('.filters-table input:checkbox').each(function () {
        if (advFilters.find(x => x == $(this).val())) {
            $(this).prop('checked', true);
            var filterVal = $(this).val();
            var filterName = $(this).data('advfiltername');

            var buttonfilterhtml = `<span id="childitem-${filterVal}" class="filter-active">` +
                ` ${filterName}<button class="filter-remove" ` +
                `onClick="removeAdvFilter('${filterVal}')"></button></span>`;
            $('#selectedfilters').append(buttonfilterhtml);
        }
    });
}

function removeAdvFilter (advFilter) {
    var checkedboxes = $('#advFilters').val().split(',').filter(r => r !== '');
    var index = checkedboxes.indexOf(advFilter);
    delete checkedboxes[index];
    $('#advFilters').val(checkedboxes.join(','));
    applyAdvFilters();
}

$("#sort_order").on('change', function () {
    var sort_order = $('#sort_order').select().val();
    var category = $('#categoryFilter').val();
    var advFilters = $('#advFilters').val();
    var extraFilters = '';

    if (sort_order) {
        sort_order = "?sort=" + sort_order;
    }

    if (category !== '' && category !== 'All' && category !== undefined) {
        extraFilters += "&category=" + category;
    }

    if (advFilters && advFilters !== '') {
        extraFilters += "&advanced-filters=" + advFilters;
    }

    var url = document.location.protocol + '//' + document.location.host + document.location.pathname + sort_order + extraFilters;
    document.location = url;
});