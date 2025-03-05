import {clearFields, generateWarning} from "./common-functions.ts";

declare const window: any;

window.validateUser = function (): void {
    const email = document.getElementById("email") as HTMLInputElement
    const password = document.getElementById("pass") as HTMLInputElement
    const warningSpan = document.getElementById("loginWarning") as HTMLInputElement
    if (!email.value || !password.value) {
        warningSpan.innerText = 'fill the details';
        setTimeout(() => {
            warningSpan.innerText = '';
        }, 1000)
        return;
    }
    const arr = {
        email: email.value.toString().trim(),
        password: password.value.toString().trim(),
    }
    const fetchData = async (): Promise<void> => {
        try {
            const getData = await fetch('http://localhost:5000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(arr)
            })
            const response = await getData.json();
            localStorage.setItem("token", response.token);
            localStorage.setItem("name", response.name);
            localStorage.setItem("id", response.id);
            const role = response.role;
            if (role === 'admin') {
                window.location.href = '../../src/Pages/Admin-Dashboard.html';
            } else if (role === 'employee') {
                window.location.href = "../../src/Pages/User-Dashboard.html";
            } else {
                warningSpan.innerText = 'Invalid Credentials';
                setTimeout(() => {
                    warningSpan.innerText = '';
                }, 1000)
            }
        } catch (err) {
            warningSpan.innerText = 'Invalid Credentials';
            setTimeout(() => {
                warningSpan.innerText = '';
            }, 1000)
        }
    }
    fetchData();
}

window.openPasswordDialog = function (id: string, id1: string) {
    const dialog = document.getElementById(id) as HTMLDialogElement;
    const backdrop = document.getElementById(id1) as HTMLDialogElement;
    dialog.style.display = 'flex'
    backdrop.style.display = 'block'
}

window.closePasswordDialog = function (id: string, id1: string) {
    const dialog = document.getElementById(id) as HTMLDialogElement;
    const backdrop = document.getElementById(id1) as HTMLDialogElement;
    dialog.style.display = 'none'
    backdrop.style.display = 'none'
}

window.sendLink = async function () {
    const email = document.getElementById("email1") as HTMLInputElement;
    if (!email.value) {
        generateWarning('warning')
        return;
    }
    const data = {email: email.value};
    const sendRequest = await fetch('http://localhost:5000/users/send-mail', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    if (sendRequest.status === 200) {
        const warning = document.getElementById('warning') as HTMLSpanElement
        warning.innerText = 'OTP sent successfully'
        setTimeout(() => {
            warning.innerText = ''
        }, 2000)
        await sendRequest.json()
    } else {
        const warning = document.getElementById('warning') as HTMLSpanElement
        warning.innerText = 'failed to sent OTP'
        setTimeout(() => {
            warning.innerText = ''
        }, 2000)
    }
}

window.verifyOTP = async function () {
    const otp = document.getElementById("otp") as HTMLInputElement;
    const email = document.getElementById("email1") as HTMLInputElement;
    const body = {email: email.value, otp: otp.value};
    const getData = await fetch('http://localhost:5000/users/verify-otp', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    })
    await getData.json();
    if (getData.status === 200) {
        const newPassDiv = document.getElementById('newPassDiv') as HTMLElement;
        newPassDiv.style.display = 'flex';
    } else {
        const warning = document.getElementById('warning') as HTMLSpanElement
        warning.innerText = 'Wrong Otp'
        setTimeout(() => {
            warning.innerText = ''
        }, 2000)
    }
}

window.updatePassword = async function () {
    const email = document.getElementById("email1") as HTMLInputElement;
    const password = document.getElementById("newPass") as HTMLInputElement;
    const cnfrmPass = document.getElementById('cnfrmNewPass') as HTMLInputElement;
    if (password.value !== cnfrmPass.value) {
        const warning = document.getElementById('warning') as HTMLSpanElement
        warning.innerText = 'Please match the password'
        setTimeout(() => {
            warning.innerText = ''
        }, 2000)
        return;
    }
    const body = {email: email.value, password: password.value}
    const getData = await fetch('http://localhost:5000/users/update-password', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    })
    await getData.json();
    if (getData.status === 200) {
        const warning = document.getElementById('warning') as HTMLSpanElement
        warning.innerText = 'Password Updated Successfully'
        setTimeout(() => {
            warning.innerText = ''
            clearFields('forgot-password')
            window.closePasswordDialog('forgot-password', 'backdrop')
        }, 2000)
    } else {
        const warning = document.getElementById('warning') as HTMLSpanElement
        warning.innerText = 'Please try later'
        setTimeout(() => {
            warning.innerText = ''
        }, 2000)
    }
}




