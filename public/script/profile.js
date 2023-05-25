'use strict'

let OLD_VALUES = {
    "full_name": document.getElementsByClassName('col-sm-9')[0].innerHTML.trim(),
    "email": document.getElementsByClassName('col-sm-9')[1].innerHTML.trim(),
    "username": document.getElementsByClassName('col-sm-9')[2].innerHTML.trim(),
    "phone": document.getElementsByClassName('col-sm-9')[3].innerHTML.trim(),
    "address": document.getElementsByClassName('col-sm-9')[4].innerHTML.trim()
};

function OLD_BODY(OLD_VALUES) {
    return `
<div class="card-body" id="info">
                                <div class="row">
                                <div class="col-sm-3">
                                    <h6 class="mb-0">Full Name</h6>
                                </div>
                                <div class="col-sm-9 text-secondary">
                                    ${OLD_VALUES.full_name}
                                </div>
                                </div>
                                <hr>
                                       <div class="row">
                                           <div class="col-sm-3">
                                               <h6 class="mb-0">Email</h6>
                                           </div>
                                           <div class="col-sm-9 text-secondary">
                                           ${OLD_VALUES.email}
                                           </div>
                                       </div>
                                       <hr>
                                           <div class="row">
                                               <div class="col-sm-3">
                                                   <h6 class="mb-0">Username</h6>
                                               </div>
                                               <div class="col-sm-9 text-secondary">
                                               ${OLD_VALUES.username}
                                               </div>
                                           </div>
                                           <hr>
                                               <div class="row">
                                                   <div class="col-sm-3">
                                                       <h6 class="mb-0">Phone</h6>
                                                   </div>
                                                   <div class="col-sm-9 text-secondary">
                                                   ${OLD_VALUES.phone}
                                                   </div>
                                               </div>
                                               <hr>
                                                   <div class="row">
                                                       <div class="col-sm-3">
                                                           <h6 class="mb-0">Address</h6>
                                                       </div>
                                                       <div class="col-sm-9 text-secondary">
                                                       ${OLD_VALUES.address}
                                                       </div>
                                                   </div>
                                                   <hr>
                                                       <button class="btn btn-outline-info" id="editBtn">Edit Profile</button>
                                                   </div>
`;
}
function replaceWithForm() {
    const newBody = `
    <div class="card-body" id="update">
                                <div class="row">
                                    <div class="col-sm-3">
                                        <h6 class="mb-0 my-2">Full Name</h6>
                                    </div>
                                    <div class="col-sm-9 text-secondary">
                                        <input type="text" name="full_name" class="form-control border-0 profile-form" value='${OLD_VALUES.full_name}'>
                                        <hr class="sidebar-divider bg-gradient-info my-2">
                                    </div>
                                </div>
                                <hr>
                                <div class="row">
                                    <div class="col-sm-3">
                                        <h6 class="mb-0">Email</h6>
                                    </div>
                                    <div class="col-sm-9 text-secondary">
                                        <input type="text" name="email" class="form-control border-0 profile-form" value='${OLD_VALUES.email}'>
                                        <hr class="sidebar-divider bg-gradient-info my-2">
                                    </div>
                                </div>
                                <hr>
                                <div class="row">
                                    <div class="col-sm-3">
                                        <h6 class="mb-0">Username</h6>
                                    </div>
                                    <div class="col-sm-9 text-secondary">
                                        <input type="text" name="username" class="form-control border-0 profile-form" value='${OLD_VALUES.username}'>
                                        <hr class="sidebar-divider bg-gradient-info my-2">
                                    </div>
                                </div>
                                <hr>
                                <div class="row">
                                    <div class="col-sm-3">
                                        <h6 class="mb-0">Phone</h6>
                                    </div>
                                    <div class="col-sm-9 text-secondary">
                                        <input type="text" name="phone" class="form-control border-0 profile-form" value='${OLD_VALUES.phone}'>
                                        <hr class="sidebar-divider bg-gradient-info my-2">
                                    </div>
                                </div>
                                <hr>
                                <div class="row">
                                    <div class="col-sm-3">
                                        <h6 class="mb-0">Address</h6>
                                    </div>
                                    <div class="col-sm-9 text-secondary">
                                        <input type="text" name="address" class="form-control border-0 profile-form" value='${OLD_VALUES.address}'>
                                        <hr class="sidebar-divider bg-gradient-info my-2">
                                    </div>
                                </div>
                                <hr>
                                <button class="btn btn-outline-info mx-2" id="editBtn">Update</button>
                                <button class="btn btn-outline-primary mx-2" id="cancelBtn">Cancel</button>
                            </div>
`;
    $("#info").replaceWith(newBody);
    $("#cancelBtn").click(() => {
        restoreToInfo();
    });
    $("#editBtn").click(() => {
        updateProfile();
    });
}
async function updateProfile() {
    const data = {};
    for (let i = 0; i < $(".profile-form").length; i++) {
        if ($($(".profile-form")[i]).val().trim() != OLD_VALUES[$($(".profile-form")[i]).attr('name')]) {
            data[$($(".profile-form")[i]).attr('name')] = $($(".profile-form")[i]).val().trim();
        }
        if (!OLD_VALUES[$($(".profile-form")[i]).attr('name')] && data[$($(".profile-form")[i]).attr('name')]) {
            data[`${$($(".profile-form")[i]).attr('name')}_new`] = true;
        }
        OLD_VALUES[$($(".profile-form")[i]).attr('name')] = $($(".profile-form")[i]).val().trim();
    }
    let bool = true;
    for (const key in data) {
        if (key == "phone" || key == "address") {
            break;
        }
        if (!(/^(?!\s*$).+/gm.test(data[key]))) {
            console.log('wrong');
            bool = false;
            $("#profileNote").text("Basic Fields Are Required.").removeClass('d-none');
            break;
        }
    }
    console.log(data);
    if (bool) {
        await $.ajax({
            type: "PUT",
            url: "http://localhost:3000/users/update",
            data: data,
            success: function (response) {
                if (response.status == 200) {
                    // $("#profile_err").replaceWith('d-none').text(response.responseText);
                    setTimeout(() => {
                        restoreToInfo();
                    }, 200);
                } else {
                    $("#profileNote").text(response.responseText).removeClass('d-none');
                }
            },
            error: function (err) {
                $("#profileNote").text('Error Occurred').removeClass('d-none');
            }
        });

    }
}
function restoreToInfo() {
    $("#update").replaceWith(OLD_BODY(OLD_VALUES));
    $("#editBtn").click(() => {
        replaceWithForm();
    });
}
$("#editBtn").click(() => {
    replaceWithForm();
});

//img change
document.getElementById('chngBtn').addEventListener('click', function () {
    let inputTag = document.createElement('input');
    inputTag.type = "file";
    inputTag.name = "image";
    inputTag.accept = ".jpg, .jpeg, .png, .svg";
    inputTag.addEventListener('change', async function (e) {
        // console.log(e.target.files[0]);
        // let form = document.createElement('form');
        // form.setAttribute('action', '/users/profile/edit/image');
        // form.setAttribute('method', 'POST');
        // form.setAttribute('enctype', 'multipart/form-data');
        // form.setAttribute('hidden', true);
        // form.appendChild(inputTag);
        // document.body.appendChild(form);
        // const img_src = e.target.files[0].name;
        // document.querySelectorAll('.rounded-circle').forEach((img) => {
        //     img.setAttribute('src', `images/users/${img_src}`);
        // });
        //    form.submit();
        if ((e.target.files[0].size / 1000000) > 10) {
            $("#profileNote").text("Please Choose Smaller Image.").removeClass('d-none');
        } else {
            const formData = new FormData();
            formData.append("image", e.target.files[0]);
            const request = new XMLHttpRequest();
            request.open("POST", "http://localhost:3000/users/profile/edit/image");
            console.log(formData);
            request.send(formData);
            request.onload = (response) => {
                if (response.target.status == 201) {
                    $("#profileNote").addClass('d-none');
                    response = JSON.parse(response.target.responseText);
                    console.log(response);
                    console.log(response.responseText);
                    const img_src = response.img_src;
                    document.querySelectorAll('.rounded-circle').forEach((img) => {
                        img.setAttribute('src', `../../images/users/${img_src}`);
                    });
                } else {
                    $("#profileNote").text("Error Happend While Changing The Image.").removeClass('d-none');
                }
            };
        }

    });
    inputTag.click();
});
