$(document).ready(function () {
    $(".like-btn").each((e, btn) => {
        $(btn).click(() => {
            love(btn.dataset.id);
        });
    });
    $(".unlike-btn").each((e, btn) => {
        $(btn).click(() => {
            unlove(btn.dataset.id);
        });
    });
    $(".prod-favorite-btn").each((e, span) => {
        $(span).click(() => {
            fav(span.dataset.id);
        });
    });
    $(".prod-unfavorite-btn").each((e, span) => {
        $(span).click(() => {
            unfav(span.dataset.id);
        });
    });
    $(".remove-from-prod-btn").each((e, btn) => {
        $(btn).click(() => {
            deleteItemFromProd(btn.dataset.id);
        });
    });
    $(".add-from-prod-btn").each((e, btn) => {
        $(btn).click(() => {
            AddToCartFromProd(btn.dataset.id);
        });
    });
    $(".imgs").each((e, img) => {
        $(img).click(() => {
            $('#product-img').attr('src', $(img).attr('src'));
        });
    });
});

async function love(prod_id) {
    await $.ajax({
        type: "POST",
        url: `http://localhost:3000/products/like?prod_id=${prod_id}`,
        success: function (response) {
            $(`#love-btn-${prod_id}`).replaceWith(`<span id="unlove-btn-${prod_id}" class="love-btn unlike-btn"> <i class="fa-solid fa-heart"></i></span>`);
            $(`#unlove-btn-${prod_id}`).click(() => {
                unlove(prod_id);
            });
            setTimeout(() => {
                $(`#likes-${prod_id}`).text(parseInt($(`#likes-${prod_id}`).text()) + 1);
            }, 200);
        },
        error: function (err) {
            window.location.reload();
        }
    });
}
async function unlove(prod_id) {
    await $.ajax({
        type: "DELETE",
        url: `http://localhost:3000/products/unlike?prod_id=${prod_id}`,
        success: function (response) {
            $(`#unlove-btn-${prod_id}`).replaceWith(`<span id="love-btn-${prod_id}" data-id=${prod_id} class="love-btn like-btn"> <i class="fa-regular fa-heart"></i></span>`);
            $(`#love-btn-${prod_id}`).click(() => {
                love(prod_id);
            })
            setTimeout(() => {
                $(`#likes-${prod_id}`).text(parseInt($(`#likes-${prod_id}`).text()) - 1);
            }, 200);
        },
        error: function (err) {
            window.location.reload();
        }
    });
}

async function deleteItemFromProd(prod_id) {
    await $.ajax({
        type: "DELETE",
        url: `http://localhost:3000/products/delete?product_id=${prod_id}`,
        success: function (response) {
            $(`#remBtn-${prod_id}`).replaceWith(`<span id="addBtn-${prod_id}" data-id=${prod_id}
            class="bn632-hover btn-warning btn-sm my-3 add-from-prod-btn"
            style="width: 10%;" title="Add This Product To Shopping Cart"><i
                class="fa-solid fa-cart-shopping fa-1x"></i></span>`);
            $(`#addBtn-${prod_id}`).click(() => {
                AddToCartFromProd(prod_id);
            })
            setTimeout(() => {
                $("#lblCartCount").text(parseInt($("#lblCartCount").text()) - 1);
            }, 200);
        },
        error: function (err) {
            window.location.reload();
        }
    });
}
async function AddToCartFromProd(prod_id) {
    await $.ajax({
        type: "POST",
        url: `http://localhost:3000/products/addToCart?product_id=${prod_id}`,
        success: function (response) {
            $(`#addBtn-${prod_id}`).replaceWith(`<span id="remBtn-${prod_id}" data-id=${prod_id}
                                                class="bn632-hover btn-warning btn-sm my-3 remove-from-prod-btn"
                                                style="width:10%!important;" title="Click To Remove Item From Shopping Cart"><i
                                                class="fa-solid fa-check"></i></span>`);
            $(`#remBtn-${prod_id}`).click(() => {
                deleteItemFromProd(prod_id);
            });
            setTimeout(() => {
                $("#lblCartCount").text(parseInt($("#lblCartCount").text()) + 1);
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
            $(`#favBtn-${prod_id}`).replaceWith(`
                                                <span id="unFavBtn-${prod_id}"
                                                data-id=${prod_id}
                                                class="btn btn-sm my-3 prod-unfavorite-btn fav-btn"
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
            $(`#unFavBtn-${prod_id}`).replaceWith(`
                                                <span class="btn btn-sm my-3 prod-favorite-btn fav-btn"
                                                data-id=${prod_id}
                                                id="favBtn-${prod_id}">
                                                <i class="fa-regular fa-star"></i></span>`);
            $(`#favBtn-${prod_id}`).click(() => {
                fav(prod_id);
            });
        },
        error: function (err) {
            window.location.reload();
        }
    });
}