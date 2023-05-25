'use strict';

async function AddToCart(prod_id) {
    await $.ajax({
        type: "POST",
        url: `http://localhost:3000/products/addToCart?product_id=${prod_id}`,
        success: async function (response) {
            // $(`#addBtn-${prod_id}`).replaceWith(`<span id="remBtn-${prod_id}" class="remove-btn" data-id=${prod_id}
            //     title="Click To Remove Item From Shopping Cart"><i
            //     class="fa-solid fa-check fa-2x w-75"></i></span>`);
            $(`#addBtn-${prod_id}`).replaceWith(`<div class="lds-ring" id="loader-${prod_id}"><div>`)
            function loader() {
                return new Promise((resolve, reject) => {
                    setTimeout(() => {
                        $(`#loader-${prod_id}`).replaceWith(`<span id="remBtn-${prod_id}" class="remove-btn" data-id=${prod_id}
                                 title="Click To Remove Item From Shopping Cart"><i
                                 class="fa-solid fa-check fa-2x w-75"></i></span>`);
                        $(`#remBtn-${prod_id}`).click(() => {
                            deleteItem(prod_id);
                        });
                    }, 450);
                    setTimeout(() => {
                        $("#lblCartCount").text(parseInt($("#lblCartCount").text()) + 1);
                    }, 250);
                    true ? resolve() : reject();
                });
            }
            await loader();
        },
        error: function (err) {
            window.location.reload();
        }
    });
}

async function deleteItem(prod_id) {
    await $.ajax({
        type: "DELETE",
        url: `http://localhost:3000/products/delete?product_id=${prod_id}`,
        success: function (response) {
            $(`#remBtn-${prod_id}`).replaceWith(`<span id="addBtn-${prod_id}" class="add-btn" data-id="${prod_id}"
                                                title="Add to shopping cart"><i
                                                class="fa-solid fa-cart-shopping fa-2x w-75"></i></span>`);
            $(`#addBtn-${prod_id}`).click(() => {
                AddToCart(prod_id);
            });
            setTimeout(() => {
                $("#lblCartCount").text(parseInt($("#lblCartCount").text()) - 1);
            }, 200);
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
            $(`#favBtn-${prod_id}`).replaceWith(`<span id="unFavBtn-${prod_id}"
                                                  data-id="${prod_id}"
                                                  class="btn btn-sm fav-btn unfavorite-btn"
                                                  title="Click To Remove Product From Favorites List"><i
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
            $(`#unFavBtn-${prod_id}`).replaceWith(`<span class="btn btn-sm fav-btn favorite-btn"
                                                    id="favBtn-${prod_id}"
                                                    data-id="${prod_id}"><i
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
async function unfavFromFavorites(prod_id) {
    await $.ajax({
        type: "DELETE",
        url: `http://localhost:3000/products/deleteFromFavorites?product_id=${prod_id}`,
        success: function (response) {
            $(`#prod${prod_id}`).remove();
        },
        error: function (err) {
            window.location.reload();
        }
    });
}

$(document).ready(() => {
    let old_body = $("#search-products").html();
    $("#srch_btn").click(() => {
        if ($("input[name=search_input]").val().trim().length > 0) {
            $("form[name=srch_form]").submit();
        }
    });
    $("#search-bar").keydown(async () => {
        if ($("#search-bar").val().trim().length >= 2) {
            await $.ajax({
                type: "GET",
                url: `http://localhost:3000/products/search/specific?title=${$("#search-bar").val().trim()}`,
                success: function (response) {
                    if (response != "Couldn't Find Something Matches Your Search.") {
                        let body = '';
                        response[0].forEach((product) => {
                            body += `
                            <div class="item new col-md-4">
                                <a href="../product/${product.product_id}">
                                    <div class="featured-item">
                                        <img src="../images/${product.img_src}" alt="">
                                        <h3 class="text-black">
                                        ${product.product_title}
                                        </h3>

                                        <div class="d-flex justify-content-between" style="margin-top: 30px;">
                                            <h5>
                                            ${product.product_price}
                                            </h5></a>
                            `;
                            if (!response[1].session) {
                                body += `
                                <span class="btn btn-light" title="Add to shopping cart"><i
                                class="fa-solid fa-cart-shopping fa-1x"></i></span>
                                <span class="btn btn-sm fav-btn""><i
                                class="fa-regular fa-star"></i></span>`;
                            } else {
                                if (response[2].alreadyInCart.includes(product.product_id)) {
                                    body += `
                                    <span id="remBtn-${product.product_id}" class="remove-btn"
                                     data-id=${product.product_id}
                                    title="Click To Remove Item From Shopping Cart">
                                    <i class="fa-solid fa-check fa-2x w-75"></i></span>`;
                                } else {
                                    body += `
                                    <span id="addBtn-${product.product_id}"
                                     class="add-btn" data-id="${product.product_id}"
                                    title="Add to shopping cart">
                                    <i class="fa-solid fa-cart-shopping fa-2x w-75"></i></span>`;
                                }
                                if (response[3].alreadyInFav.includes(product.product_id)) {
                                    body += `
                                    <span id="unFavBtn-${product.product_id}"
                                    
                                    data-id=${product.product_id}
                                    class="btn btn-sm fav-btn unfavorite-btn"
                                    title="Click To Remove Product From Favorites List">
                                    <i class="fa-solid fa-star"></i></span>`;
                                } else {
                                    body += `
                                    <span class="btn btn-sm fav-btn favorite-btn"
                                    id="favBtn-${product.product_id}" data-id=${product.product_id}
                                    >
                                    <i class="fa-regular fa-star"></i></span>`;
                                }
                            }
                            body += '</div></div></div>';
                        });
                        $("#search-products").html(body);
                    } else {
                        $("#search-products").html(response);
                    }
                    assignButtons();
                },
                error: function () {
                    $("#search-products").html("Couldn't Find Your Request.");
                }
            });
        } else {
            $("#search-products").html(old_body);
            assignButtons();
        }
    });
    $("#search-bar").hover(() => {
        if ($("#search-bar").val() == '' || $("#search-bar").val() == ' ') {
            $("#search-products").html(old_body);
            assignButtons();
        }
    });
    function assignButtons() {
        $(".add-btn").each((e, span) => {
            $(span).click(() => {
                AddToCart(span.dataset.id);
            });
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
        $(".unfav-btn").each((e, span) => {
            $(span).click(() => {
                unfavFromFavorites(span.dataset.id);
            });
        });
    }
    assignButtons();








});

