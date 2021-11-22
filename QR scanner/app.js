//import setting classes
import SetUpUi from './SetupUi.js';
import { SettingFunc, AdvancedSetting } from './setting.js';
const UiClass = new SetUpUi;
const settingClass = new SettingFunc();
const advancedSettingClass = new AdvancedSetting();

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

//settings setup
let settingEvents = [];
let foodEvents = [
    { "title": "lunch", "id": "lunch" },
    { "title": "snack", "id": "snack" },
]
let settings = {
    activeEvent: '',
    checkMode: 'auto'
}

// setting selectors
const settingDisBtn = document.getElementById('display-setting-btn');
const settingOverlay = document.querySelector('.settings-overlay');
const settingEventLabel = document.getElementById('settingTargetedEvent');
const beepSound = new Audio();
beepSound.src = 'beep.mp3';
//counter selectors
const allCount = document.getElementById('all-count');
const currCountText = document.querySelector('#cur-count span');
const currCountNumber = document.querySelector('#cur-count b');
const scannedCount = document.getElementById('scanned-count');
//system selectors related to data table
const header = document.querySelector('.header');
const parDataBase = document.querySelector('.par-database');
const dataContainer = document.getElementById('par-info-parent');
const finalStatus = document.getElementById('status');
const searchedItemsContainer = document.querySelector('.searched-items');
const searchForm = document.getElementById('search-form');
const searchBox = document.getElementById('searchBox');

//get data 
const getData = async() => {
    return localStorage.getItem('parList') ? JSON.parse(localStorage.getItem('parList')) : [];
}

document.addEventListener('DOMContentLoaded', _ => {
    settings = localStorage.getItem('setting') ? JSON.parse(localStorage.getItem('setting')) : settings;
    parDataBase.style.paddingTop = `${header.getBoundingClientRect().height}px`;

    //get Data from database
    getEventNames('../evnetNames.json').then(events => {
        settingEvents = [...events, ...foodEvents];
    });
    getData().then(data => {
        UiClass.displayData(data, dataContainer, settings);
    }).then(_ => {
        searchFuntion();
        allCount.textContent = dataContainer.querySelectorAll('.per-data').length;
        SetUpUi.currentEventCount(settings, currCountText, currCountNumber);
        SetUpUi.currentScannedCount(settings, scannedCount);
        SetUpUi.settingEventLabelDisplay(settingEventLabel, settings);
    })
})


//setting the document btns
dataContainer.addEventListener('click', e => {
    if (e.target.classList.contains('status-btn')) {
        const targetCode = e.target.parentElement.parentElement.dataset.id;
        if (e.target.classList.contains('green')) {
            e.target.classList.remove('green');
            e.target.classList.add('delivered')
            advancedSettingClass.updateDatabase(targetCode, e.target.dataset.id, 1).then(_ => SetUpUi.alertMessage(`Database Updated!!!`, `green`));

        } else if (e.target.classList.contains('delivered')) {
            e.target.classList.remove('delivered');
            e.target.classList.add('green')
            advancedSettingClass.updateDatabase(targetCode, e.target.dataset.id, 0).then(_ => SetUpUi.alertMessage(`Database Updated!!!`, `green`));
        }
        SetUpUi.currentScannedCount(settings, scannedCount);
    }
})


// Qr code scanner starts

document.querySelector('.scanner-on').addEventListener('click', e => {
    e.currentTarget.style.display = "none";
    QRscannerFunc();
})

const QRscannerFunc = () => {

    let scanner = new Instascan.Scanner({
        video: document.getElementById('preview')
    });
    scanner.addListener('scan', function(content) {
        codeFunction(content);
    });
    Instascan.Camera.getCameras().then(function(cameras) {
        if (cameras.length > 0) {
            scanner.start(cameras[0]);
        } else {
            console.error('No cameras found.');
            document.querySelector('.scanner-container').innerHTML = `Could not detect any camera`
        }
    }).catch(function(e) {
        console.error(e);
    });
}

const codeFunction = code => {
    beepSound.play();
    SetUpUi.checkSearch(dataContainer);

    document.getElementById('displayer').innerText = code;
    const allPersons = [...document.querySelectorAll('.per-data')];
    const targetPerson = SetUpUi.findPerson(code.toLowerCase(), allPersons)
        // allPersons.find(person => person.dataset.id.toLowerCase() === code.toLowerCase());
    if (targetPerson) {
        scrollFunction(targetPerson)
        const activatedBtn = targetPerson.querySelector('.activated-status');

        if (activatedBtn)
            displayInHeader(targetPerson, activatedBtn);
        if (activatedBtn && activatedBtn.classList.contains('delivered')) {
            statusDisplayer(`Already used the opportunity`, `red`)
        } else if (activatedBtn && activatedBtn.classList.contains('green')) {
            statusDisplayer(`Authorized to go`, `green`);
            activatedBtn.classList.remove('green');
            activatedBtn.classList.add('delivered');

            //updating database
            advancedSettingClass.updateDatabase(code, activatedBtn.dataset.id, 1).then(_ => SetUpUi.alertMessage(`Database Updated!!!`, `green`));

            SetUpUi.currentScannedCount(settings, scannedCount);
        } else {
            emptyHeader();
            const personName = targetPerson.querySelector('#perName').textContent;
            SetUpUi.alertMessage(`Please select the target status or this ${personName}'s status does not contains the target status`, `brown`);
        }
    } else {
        emptyHeader();
        statusDisplayer(`Unauthorized Person`, `red`);
    }
}
const emptyHeader = () => {
    document.getElementById('per-name').textContent = '';
    document.getElementById('per-college').textContent = '';
    document.getElementById('per-class').textContent = '';
    document.getElementById('per-events').innerHTML = '';
    document.querySelector('.per-info-img img').src = '';
    statusDisplayer(``, `green`)
}

const displayInHeader = (targetPerson, activatedBtn) => {
    document.getElementById('per-name').textContent = targetPerson.querySelector('#perName').textContent;
    document.getElementById('per-college').textContent = targetPerson.querySelector('#perIns').textContent;
    document.getElementById('per-class').textContent = targetPerson.querySelector('.database-class').textContent;
    document.getElementById('per-events').innerHTML = activatedBtn.textContent;
    document.querySelector('.per-info-img img').src = targetPerson.querySelector('.database-per-img img').src;
}

const statusDisplayer = (text, color) => {
    finalStatus.textContent = text;
    finalStatus.style.color = color;
}

const scrollFunction = targetPerson => {
    let scrollTopPosition = targetPerson.offsetTop + header.getBoundingClientRect().height - 200;
    window.scrollTo({
        top: scrollTopPosition,
        left: 0,
        behavior: 'instant',
    });
    targetPerson.classList.add('highlightTarget');
    console.log(targetPerson, targetPerson.offsetTop, targetPerson.offsetTop + header.getBoundingClientRect().height);
}


//search function starts
const searchFuntion = () => {
    searchBox.addEventListener('keyup', _ => {
        const searchValue = searchBox.value.toLowerCase();
        if (searchValue !== '') {
            const filtered = UiClass.searchList.filter(item => item.title.toLowerCase().includes(searchValue) || item.code.toLowerCase().includes(searchValue));

            displaySearched(filtered);
        } else {
            searchedItemsContainer.innerHTML = ``;
        }
    })

    searchForm.addEventListener('submit', e => {
        e.preventDefault();
        if (searchedItemsContainer.children.length > 0) {
            searchClickFunc(searchedItemsContainer.children[0])
        } else if (searchBox.value === '') {
            SetUpUi.alertMessage(`pleaser Enter any person's name or code`, `red`)
        } else {
            SetUpUi.alertMessage(`Couldn't found any name or code that includes ${searchBox.value}`, `red`)
            searchBox.value = '';
        }
    })
}

const displaySearched = (items) => {
    searchedItemsContainer.innerHTML = items.map(item => {
        return `<p data-id="${item.code}"><b class="searched-title">${item.title}</b><br><span class="searched-code">${item.code}</span></p>`
    }).join('');

    document.querySelectorAll('.searched-items p').forEach(item => {
        item.addEventListener('click', _ => {
            searchClickFunc(item);
        })
    })
}

const searchClickFunc = (item) => {
    const allPersons = [...document.querySelectorAll('.per-data')];
    searchBox.value = item.querySelector('.searched-title').textContent;
    SetUpUi.checkSearch(dataContainer)
    scrollFunction(SetUpUi.findPerson(item.dataset.id.toLowerCase(), allPersons))
    searchedItemsContainer.innerHTML = '';
    searchBox.value = '';
}



//user settings starts

settingOverlay.addEventListener('click', e => {
    if (e.target.classList.contains('settings-overlay'))
        SettingFunc.closingSetting(settingOverlay);
    else if (e.target.id === 'generalSet')
        settingManageMent();
})

const settingManageMent = () => {
    settingClass.settingDisplay(`General Setting`, `advanced`, settingOverlay);

    const settingFormContainer = document.querySelector('.formContainer');
    settingClass.generalSettingDisplay(settingFormContainer, settings, settingEvents);
    const generalsettingForm = document.querySelector('#setting-inner');

    //general settings func
    generalsettingForm.addEventListener('submit', e => {
        e.preventDefault();
        // modeSelectionFunc(`activated-status`,true)

        const modeStatus = [...document.querySelectorAll('.mode-setting input[type=radio]')];
        const checkingStatus = [...document.querySelectorAll('.checking-setting input[type=radio]')];
        const checked = checkingStatus.find(status => status.checked);
        const modeChecked = modeStatus.find(status => status.checked);

        if (checked) {
            settings = { activeEvent: checked.value, checkMode: modeChecked.value };
            localStorage.setItem('setting', JSON.stringify(settings));
            SettingFunc.manipulationgDOMChecked(document.querySelectorAll('.database-events .activated-status'), checked.value);
            SettingFunc.manipulatingCheckedMode(document.querySelectorAll('.database-events .activated-status'), modeChecked.value);
            //extra alerts funtions
            SetUpUi.currentEventCount(settings, currCountText, currCountNumber);
            SettingFunc.closingSetting(settingOverlay);
            SetUpUi.settingEventLabelDisplay(settingEventLabel, settings);
            SetUpUi.currentScannedCount(settings, scannedCount)
        } else {
            SetUpUi.alertMessage(`Please Select the target event first`, `brown`)
            alert()
        }
    })

    //advanced btn
    document.getElementById('advancedSet').addEventListener('click', _ => new AdvancedSetting().advancedSettingDisplay(settingFormContainer, settingEvents, SetUpUi.alertMessage))
}


settingDisBtn.addEventListener('click', _ => {
        settingOverlay.style.display = "grid";
        settingClass.displayPassEnter(settingOverlay, `admin-pass`, `Enter the admin password again for security`);

        //in form
        document.querySelector('.admin-pass').addEventListener('submit', e => {
            e.preventDefault();
            const adminPassInput = document.getElementById('adminPass');
            if (SettingFunc.passEnterValidation(advancedSettingClass.getPassword('user'), adminPassInput)) {
                settingManageMent();
            }
        })

    })
    //user settings ends