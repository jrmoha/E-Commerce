'use strict'
const old = {
    credit_number: $("input[name=credit_number]").val(),
    credit_owner: $("input[name=owner_name]").val(),
    exp_date: $("input[name=expr_date]").val(),
    cvv: $("input[name=cvv]").val()
};
let upd_disabled = true;
let del_disabled = true;
let disabled_cnt = 0;
$(".credit-card-field").keyup(function () {
    if ($(this).val() != old[$(this).attr('name')]) {
        disabled_cnt++;
    } else {
        disabled_cnt--;
    }
    if (disabled_cnt > 0) {
        upd_disabled = false;
        $("#updatePaymentBtn").removeClass('disabled');
        $("#updatePaymentBtn").attr('disabled', false);
    } else {
        upd_disabled = true;
        $("#updatePaymentBtn").addClass('disabled');
        $("#updatePaymentBtn").attr('disabled', true);
    }
});

$("#updatePaymentBtn").click((e) => {
    const cvv_regex = /^[0-9]{3}$/gm;
    const exp_regex = /^[0-9]{1,2}\/20[0-9]{2}$/gm;
    const credit_number_regex = /^[0-9]{16,19}$/gm;
    const credit_number = $("input[name=credit_number]").val();
    const credit_owner = $("input[name=owner_name]").val();
    const exp_date = $("input[name=expr_date]").val();
    const cvv = $("input[name=cvv]").val();
    let cnt = 0;
    if (!credit_number_regex.test(credit_number)) {
        $("#num_err").removeClass('d-none');
        cnt++;
    } else {
        $("#num_err").addClass('d-none');
    }
    if (!credit_owner === "") {
        $("#name_err").removeClass('d-none');
        cnt++;
    } else {
        $("#name_err").addClass('d-none');
    }
    if (parseInt(exp_date.substr(0, 2)) < 0 || parseInt(exp_date.substr(0, 2)) > 12 || exp_date.substr(3) < new Date().getFullYear()) {
        $("#expr_err").removeClass('d-none');
    } else {
        $("#expr_err").addClass('d-none');
    }
    if (!exp_regex.test(exp_date)) {
        $("#date_err").removeClass('d-none');
        cnt++;
    } else {
        $("#date_err").addClass('d-none');
    }
    if (!cvv_regex.test(cvv)) {
        $("#cvv_err").removeClass('d-none');
        cnt++;
    } else {
        $("#cvv_err").addClass('d-none');
    }
    if (cnt == 0 && !upd_disabled) {
        console.log(true);
        //api request to be sent from here
    } else {
        console.error('An Error Occurred');
        e.preventDefault();
    }
});