//fetch event names from database only concept
const getEventNames = async(link) => {
    try {
        let jsonData = await fetch(link);
        let data = await jsonData.json();
        return data;
    } catch (err) {
        alert('Error getting Event Names')
        console.log(err);
    }
}


const form = document.getElementById('registrationForm');
const inputName = document.getElementById('name');
const inputinstitute = document.getElementById('institute');
const inputemail = document.getElementById('email');
const inputClass = document.getElementById('class-selector');
let inputcheckBoxes;
const submitMessage = document.querySelector('.submit-message');
const eventBoxContainer = document.querySelector('.event-children');

const qrDataOverlay = document.querySelector('.parInfo-overlay');
const qrCodeContainer = document.querySelector('#qr-code-displayer');
const codeText = document.getElementById('code-text');
const qrCode = new QRCode(qrCodeContainer)
qrDataOverlay.addEventListener('click', e => {
    if (e.target.classList.contains('parInfo-overlay'))
        qrDataOverlay.style.display = 'none';
})

const generateQRcode = (code) => {
    qrDataOverlay.style.display = "grid";
    qrCode.makeCode(code);
    codeText.innerText = code;
}

const createCheckBoxes = (eventBoxContainer, eventNames) => {
    eventBoxContainer.innerHTML = eventNames.map(event => {
        return `<div class="check-field">
        <input type="checkbox" id=${event.id} value="${event.id}">
        <label for="${event.id}">${event.title}</label>
    </div>`
    }).join('');
    inputcheckBoxes = document.querySelectorAll('.event-children input[type=checkbox]');
}

document.addEventListener('DOMContentLoaded', _ => {
    getEventNames('../evnetNames.json').then(eventNames => {
        createCheckBoxes(eventBoxContainer, eventNames);
    })
})

const sameEmailMessage = () => {
    submitMessage.textContent = `Already registered with this email account`;
    submitMessage.style.color = "red";
    setTimeout(_ => {
        submitMessage.textContent = '';
        submitMessage.style.color = "green";
        setToDefault();
    }, 1000)
}

form.addEventListener('submit', e => {
    e.preventDefault();
    //checking data length and email comparing validation
    let storageItem = localStorage.getItem('parList') ? JSON.parse(localStorage.getItem('parList')) : [];

    const isAlreadyEmail = storageItem.find(item => item.email === inputemail.value);
    if (isAlreadyEmail)
        sameEmailMessage();
    else {
        let eventChecks = {};
        inputcheckBoxes.forEach(box => {
            if (box.checked) {
                eventChecks[box.value] = 0;
            }
        })
        const code = inputName.value.split(' ')[0] + `${storageItem.length + 1}`;
        const parData = {
            name: inputName.value,
            institute: inputinstitute.value,
            email: inputemail.value,
            class: inputClass.value,
            events: {
                ...eventChecks,
                snack: 0,
                lunch: 0
            },
            code: code,
        }

        storageItem.push(parData);
        localStorage.setItem('parList', JSON.stringify(storageItem));
        submitMessage.textContent = `Your data was successfully submitted`;
        setTimeout(_ => submitMessage.textContent = ``, 1000)
        generateQRcode(code);
        setToDefault();
    }
})

const setToDefault = () => {
    inputName.value = '';
    inputinstitute.value = '';
    inputemail.value = '';
    inputClass.value = '8';
    inputcheckBoxes.forEach(box => box.checked = false);
}