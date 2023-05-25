'use strict'

function calcPrice() {
    //products-price
    //shipping-price
    //tax-price
    //total-price
    let products_price = 0;
    $(".product-price").each(function (index, element) {
        products_price += parseFloat(element.innerText.substr(1));
    });
    let shipping_price = 2.5;
    let tax = (0.14 * products_price).toFixed(2);
    let total_price = parseFloat(products_price + shipping_price + parseFloat(tax)).toFixed(1);

    $("#products-price").text(`$${products_price.toFixed(2)}`);
    $("#shipping-price").text(`$${shipping_price}`);
    $("#tax-price").text(`$${tax}`);
    $("#total-price").text(`$${total_price}`);
}

async function deleteItem(prod_id) {
    await $.ajax({
        type: "DELETE",
        url: `http://localhost:3000/products/delete?product_id=${prod_id}`,
        success: function (response) {
            console.log('Deleted And All Is Good');
            $(`#prod${prod_id}`).remove();
            calcPrice();
        },
        error: function (err) {
            window.location.reload();
        }
    });
}
async function fav(prod_id) {
    await $.ajax({
        type: "POST",
        url: `http://localhost:3000/products/addToFavorites?product_id=${prod_id}`,
        success: function (response) {
            $(`#favBtn-${prod_id}`).replaceWith(`<span data-id=${prod_id} id="unFavBtn-${prod_id}"  class="my-2 unfavorite-btn" title="Click To Remove Product From Favorites List"><i
            class="fa-solid fa-star"></i></span>`);
            $(`#unFavBtn-${prod_id}`).click(() => {
                unfav(prod_id);
            });
        },
        error: function (err) {
            window.location.reload();
        }
    });
}
async function unfav(prod_id) {
    await $.ajax({
        type: "DELETE",
        url: `http://localhost:3000/products/deleteFromFavorites?product_id=${prod_id}`,
        success: function (response) {
            $(`#unFavBtn-${prod_id}`).replaceWith(`<span data-id=${prod_id} class="my-2 favorite-btn" id="favBtn-${prod_id}"><i
            class="fa-regular fa-star"></i></span>`);
            $(`#favBtn-${prod_id}`).click(() => {
                fav(prod_id);
            });
        },
        error: function (err) {
            window.location.reload();
        }
    });
}
$(document).ready(function () {
    calcPrice();
    $("#srch_btn").click(() => {
        if ($("input[name=search_input]").val().length > 0) {
            $("form[name=srch_form]").submit();
        }
    });
    $(".remove-btn").each((e, span) => {
        $(span).click(() => {
            deleteItem(span.dataset.id);
        });
    });
    $(".favorite-btn").each((e, span) => {
        $(span).click(() => {
            fav(span.dataset.id);
        });
    });
    $(".unfavorite-btn").each((e, span) => {
        $(span).click(() => {
            unfav(span.dataset.id);
        });
    });
    
});
