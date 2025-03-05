"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function validateUser() {
    const email = document.getElementById("email");
    const password = document.getElementById("pass");
    const warningSpan = document.getElementById("pass");
    const arr = [
        {
            email: email.value.toString().trim(),
            password: password.value.toString().trim(),
        }
    ];
    const fetchData = () => __awaiter(this, void 0, void 0, function* () {
        try {
            const getData = yield fetch('http://localhost:5000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(arr)
            });
            const response = yield getData.json();
            console.log(response);
            // localStorage.setItem("token", response.data.token);
            // const role = response.data.role;
            // if (role === 'admin') {
            //     window.location.href = "../Pages/Admin-Dashboard.html";
            // } else {
            //     window.location.href = "../Pages/User-Dashboard.html";
            // }
        }
        catch (err) {
            warningSpan.innerText = 'Invalid Credentials';
            setTimeout(() => {
                warningSpan.innerText = '';
            }, 1000);
        }
    });
    fetchData();
}
