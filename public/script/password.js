'use strict'
$("#chngBtn").click(async () => {
    const old_password = $("input[name=old_password]").val();
    const new_password = $("input[name=new_password]").val();
    const new_password_confirm = $("input[name=new_password_confirm]").val();
    if (!(/^(?!\s*$).+/gm.test(old_password)) || !(/^(?!\s*$).+/gm.test(new_password)) || !(/^(?!\s*$).+/gm.test(new_password_confirm))) {
        $("#passNote").text(`Every Field Is Required.`).removeClass('d-none');
    } else {
        if (new_password !== new_password_confirm) {
            $("#passNote").text(`Password Don't Match.`).removeClass('d-none');
        } else if (/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/.test(new_password)) {//passNote
            await $.ajax({
                type: "PUT",
                url: `http://localhost:3000/users/change-password`,
                data: { old_password: old_password, password: new_password },
                success: function (response) {
                    console.log(response.status);
                    if (response.status == 200) {
                        $("#passNote")
                            .text('Password Has Been Saved Successfully.')
                            .removeClass('d-none')
                            .addClass('alert-success').
                            removeClass('alert-warning');
                    } else {
                        $("#passNote").text(response.responseText).removeClass('d-none');
                    }
                },
                error: function (err) {
                    window.location.reload();
                }
            });
        } else {
            $("#passNote").text('Please Choose More Difficult Password.').removeClass('d-none');
        }
    }
});