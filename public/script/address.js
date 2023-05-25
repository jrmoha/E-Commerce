'use strict'
//updateBtn
//deleteLocationBtn
function old() { //old values of the info section
    const old = {
        country: "",
        city: "",
        postal_code: "",
        neighborhood: "",
        street: "",
        full_address: ""
    }
    let i = 0;
    for (const key in old) {
        old[key] = $($(".col-sm-9")[i]).text().trim();
        i++;
    }
    return old;
}
function form(old, new_bool) {//returns update form with values were in the info section
    let str = `
            <div id="add-form">
            `
    if (new_bool) {
        str += `
                <div class="mx-auto text-center no-address-field">
                                            <h2 class="text-black">You Have Not Added Address Yet</h2>
                                            <h5>Fill The Form And Add One</h5>
                                        </div>
                                        <hr class="sidebar-divider my-3 mb-3 w-75 bg-gradient-primary">
                `
    }
    str += `    
            <div class="alert alert-danger w-50 d-none mx-5" id="addressNote" role="alert">
            </div>
            <div class="row justify-content-center">
            <div class="col-9">
            <div class="form-group">
            <label for="country">Country.</label>
            <input type="text" name="country" value='${old.country ? old.country : ''}'
                class="form-control form-control-user location-fields border-0">
            <hr class="sidebar-divider my-0 bg-gradient-info">
            </div>
            <div class="form-group">
            <div class="row d-flex">
            <div class="col-6">
            <label for="city">City.</label>
            <input type="text" value='${old.city ? old.city : ''}' name="city" class="form-control form-control-user location-fields
                border-0">
            <hr class="sidebar-divider my-0 bg-gradient-info">
            </div>
            <div class="col-6">
            <label for="postal">Postal Code.</label>
            <input type="text" value='${old.postal_code ? old.postal_code : ''}' name="postal_code" class="form-control form-control-user location-fields
                border-0">
            <hr class="sidebar-divider my-0 bg-gradient-info">
            </div>
            </div>
            </div>
            <div class="form-group my-1">
            <label for="neigh">Neighborhood.</label>
            <input type="text" name="neighborhood" value='${old.neighborhood ? old.neighborhood : ''}'
                class="form-control form-control-user location-fields border-0">
            <hr class="sidebar-divider my-0 bg-gradient-info">
            <label for="street" class="my-1">Street</label>
            <input type="text" name="street" value='${old.street ? old.street : ''}'
                class="form-control form-control-user location-fields border-0">
            <hr class="sidebar-divider my-0 bg-gradient-info">
            </div>
            <div class="form-group my-1">
            <label for="full_address">Full Address.</label>
            <input type="text" name="full_address" value='${old.full_address ? old.full_address : ''}'
                class="form-control form-control-user location-fields border-0">
            <hr class="sidebar-divider my-0 bg-gradient-info">
            </div>
            <div class="form-group col-12 my-4 d-flex justify-content-between">
            <button class="btn btn-primary disabled" id="updateLocationBtn"
                disabled>Update
                Address</button>
            <button class="btn btn-outline-warning"
                id="cancelLocationBtn">Cancel</button>
            <div class="form-check d-flex flex-column">
                <input class="form-check-input" type="checkbox" 
                    id="flexCheckDefault">
                <label class="form-check-label" for="flexCheckDefault">
                    Automatic
                </label>
            </div>
            </div>
            </div>
            </div>
            </div>
`;
    return str;
}
function info_body(data) {
    return `
    <div id="add-info">
    <div class="alert alert-danger w-50 d-none mx-5" id="addressNote"
        role="alert">
    </div>
    <div class="col-md-8">
        <div class="card mb-3">
            <div class="card-body">
                <div class="row">
                    <div class="col-sm-3">
                        <h6 class="mb-0">Country</h6>
                    </div>
                    <div class="col-sm-9 text-secondary">
                        ${data.country}
                    </div>
                </div>
                <hr>
                <div class="row">
                    <div class="col-sm-3">
                        <h6 class="mb-0">City</h6>
                    </div>
                    <div class="col-sm-9 text-secondary">
                    ${data.city}
                    </div>
                </div>
                <hr>
                <div class="row">
                    <div class="col-sm-3">
                        <h6 class="mb-0">Postal Code</h6>
                    </div>
                    <div class="col-sm-9 text-secondary">
                    ${data.postal_code}
                    </div>
                </div>
                <hr>
                <div class="row">
                    <div class="col-sm-3">
                        <h6 class="mb-0">Neighborhood</h6>
                    </div>

                    <div class="col-sm-9 text-secondary">
                    ${data.neighborhood}
                    </div>
                </div>
                <hr>
                <div class="row">
                    <div class="col-sm-3">
                        <h6 class="mb-0">Street</h6>
                    </div>
                    <div class="col-sm-9 text-secondary">
                       ${data.street}
                    </div>
                </div>
                <hr>
                <div class="row">
                    <div class="col-sm-3">
                        <h6 class="mb-0">Full Adress</h6>
                    </div>
                    <div class="col-sm-9 text-secondary">
                    ${data.full_address}
                    </div>
                </div>
                <hr>
                <div
                    class="form-group col-12 my-4 d-flex justify-content-between">
                    <button class="btn btn-primary" id="updateBtn">Update
                        Address</button>
                    <button class="btn btn-danger"
                        id="deleteLocationBtn">Delete</button>
                </div>
            </div>
        </div>
    `
}
$("#updateBtn").click(() => {
    $("#add-info").replaceWith(form(old(), false));
    update();
});
function update() {
    const old_inputs = {
        country: $("input[name=country]").val(),
        city: $("input[name=city]").val(),
        postal_code: $("input[name=postal_code]").val(),
        full_address: $("input[name=full_address]").val(),
        street: $("input[name=street]").val(),
        neighborhood: $("input[name=neighborhood]").val(),
    };
    let upd_disabled = true;
    let disabled_cnt = 0;
    $(".location-fields").keyup(function () {
        if ($(this).val().trim() != old_inputs[$(this).attr('name')]) {
            disabled_cnt++;
        } else {
            disabled_cnt--;
        }
        if (disabled_cnt > 0) {
            undisable_btn();
        } else {
            disable_btn();
        }
    });
    $("#updateLocationBtn").click(async () => {
        let cnt = 0;
        if (!/^(?!\s*$).+/gm.test($("input[name=country]").val().trim())) {
            cnt++;
        }
        if (!/^(?!\s*$).+/gm.test($("input[name=city]").val().trim())) {
            cnt++;
        }
        // if (!/^(?!\s*$).+/gm.test($("input[name=postal_code]").val().trim())) {
        //     cnt++;
        // }
        if (!/^(?!\s*$).+/gm.test($("input[name=full_address]").val().trim())) {
            cnt++;
        }
        if (!/^(?!\s*$).+/gm.test($("input[name=street]").val().trim())) {
            cnt++;
        }
        // if (!/^(?!\s*$).+/gm.test($("input[name=neighborhood]").val().trim())) {
        //     cnt++;
        // }
        if (cnt == 0 && !upd_disabled) {
            const data = {};
            $(".location-fields").each((i, input) => {
                if ($(input).val() != old_inputs[$(input).attr('name')]) {
                    data[$(input).attr('name')] = $(input).val().trim();
                    old_inputs[$(input).attr('name')] = $(input).val().trim();
                }
            });
            if (Object.keys(data).length > 0) {
                await $.ajax({
                    type: "PUT",
                    url: `http://localhost:3000/users/address/edit`,
                    data: data,
                    success: function (response) {
                        $("#addressNote").text(response.responseText).removeClass('d-none').addClass('alert-success').removeClass('alert-danger');
                        setTimeout(() => {
                            $("#add-form").replaceWith(info_body(old_inputs));
                            $("#updateBtn").click(() => {
                                $("#add-info").replaceWith(form(old(), false));
                                update();
                            });
                            $("#deleteLocationBtn").click(() => {
                                deleteLocation();
                            });
                        }, 1200);
                    },
                    error: function () {
                        window.location.reload();
                    }
                });
            } else {
                window.location.reload();
            }
        } else {
            $("#addressNote").text('Every Field Is Required').removeClass('d-none').removeClass('alert-success').addClass('alert-warning');
        }
    });
    $("#flexCheckDefault").change(function () {
        if ($(this).is(":checked")) {
            $("#loc_err").addClass('d-none');
            const lookup = async (position) => {
                const { latitude, longitude } = position.coords;
                let result = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=ddedb13757b141d6a924a1fc275f9f2b`);
                result = await result.json();
                const loc = result.results[0].components;
                $("input[name=country]").val(loc.country);
                $("input[name=city]").val(loc.state);
                $("input[name=postal_code]").val(loc.postcode);
                $("input[name=full_address]").val(result.results[0].formatted);
                $("input[name=street]").val(loc.road);
                $("input[name=neighborhood]").val(loc.neighbourhood);
                undisable_btn();
            };
            function getLocation() {
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(lookup, rem);
                }
            }
            function rem() {
                $("#loc_err").removeClass('d-none');
                disable_btn();
            }
            getLocation();
        } else {
            $("input[name=country]").val(old_inputs['country']);
            $("input[name=city]").val(old_inputs['city']);
            $("input[name=postal_code]").val(old_inputs['postal_code']);
            $("input[name=full_address]").val(old_inputs['full_address']);
            $("input[name=street]").val(old_inputs['street']);
            $("input[name=neighborhood]").val(old_inputs['neighborhood']);
            disable_btn();
        }
    });
    $("#deleteLocationBtn").click(() => {
        deleteLocation();
    });
    function disable_btn() {
        upd_disabled = true;
        $("#updateLocationBtn").addClass('disabled');
        $("#updateLocationBtn").attr('disabled', true);
    }
    function undisable_btn() {
        upd_disabled = false;
        $("#updateLocationBtn").removeClass('disabled');
        $("#updateLocationBtn").attr('disabled', false);
    }
}
async function deleteLocation() {
    await $.ajax({
        type: "DELETE",
        url: `http://localhost:3000/users/address/delete`,
        success: function (response) {
            if (response.status == 200) {
                $("#addressNote").text(response.responseText).removeClass('d-none').removeClass('alert-success').addClass('alert-warning');
                setTimeout(() => {
                    $("#add-info").replaceWith(form({}, true));
                    update();
                }, 600);
            }
        },
        error: function () {
            window.location.reload();
        }
    });
}

$(".no-address-field").ready(() => {
    update();
});