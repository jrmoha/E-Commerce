'use strict';

$(document).ready(function () {
    const TIME_OUT = 40000;
    let loop = setInterval(async function () {
        // document.addEventListener('visibilitychange',async function () {
        // if (document.visibilityState == 'visible') {
        try {
            console.log('yeah science yeah');
            const isAuth_response = await fetch("http://localhost:3000/isAuth", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                },
            });
            const isAuth = await isAuth_response.json();
            if (isAuth[0]) {
                const update_response = await fetch(`http://localhost:3000/users/update/session?session_id=${isAuth[1]}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
                const update = await update_response.json();
                console.log(update);
            } else {
                console.log('not auth');
                window.location.href = 'http://localhost:3000/login';
            }
        } catch (error) {
            console.error(error);
            setTimeout(() => {
                window.location.reload();
            }, 500);
        }
        // await $.ajax({
        // type: "GET",
        // url: "http://localhost:3000/isAuth",
        // success: async function (response) {
        //     if (response[0]) {
        //         await $.ajax({
        //             type: "POST",
        //             url: `http://localhost:3000/users/update/session?session_id=${response[1]}`,
        //             success: function (response) {
        //                 console.log(response);
        //             },
        //             error: function (err) {
        //                 console.log(err);
        //                 setTimeout(() => {
        //                     window.location.reload();
        //                 }, 500);
        //             }
        //         });
        //     }
        // }
        // });

        // } else {
        //     console.log(new Date().getTime() - Date.parse(document.lastModified));
        // }
    }, TIME_OUT);
    window.addEventListener('beforeunload unload', () => {
        clearInterval(loop);
    });
    // });
});