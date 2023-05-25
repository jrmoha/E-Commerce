$(".log-del-btn").each((e, span) => {
    $(span).click(function () {
        $(this).closest('.col-md-6').remove();
    });
});