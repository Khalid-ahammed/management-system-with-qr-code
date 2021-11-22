const loginForm = document.getElementById('logInForm');
const nameBox = document.getElementById('adminName');
const passBox = document.getElementById('addminPass');
const formMessage = document.querySelector('.form-message');
const adminInfo = {
    adminName: `Admin101`,
    password: `admininit2`
}

const displaMessage = (text) => {
    formMessage.innerText = text;
    setTimeout(_ => { formMessage.innerText = '' }, 1200)
}

loginForm.addEventListener('submit', e => {
    e.preventDefault();
    if (nameBox.value === '' || passBox.value === '') {
        displaMessage(`Please Enter the name or password properly`)
    } else if (nameBox.value !== adminInfo.adminName || passBox.value !== adminInfo.password) {
        displaMessage(`Invalid admin name or password entered`)
    } else if (nameBox.value === adminInfo.adminName && passBox.value === adminInfo.password) {
        window.location.replace("QR scanner/QRscanner.html")
    }
})