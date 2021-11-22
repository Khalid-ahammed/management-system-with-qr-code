class SetUpUi {
    searchList = [];
    displayData(infos, dataContainer, settings) {
            dataContainer.innerHTML = infos.map((data, index) => {
                        this.searchList.push({ title: data.name, code: data.code })
                        return `<tr class="per-data" data-id=${data.code}>
            <td><b>${index < 9 ? `0${index + 1}` : index + 1}</b></td>
            <td class="database-name">
                <div class="database-per-img">
                    <img src="#" alt="image">
                </div>
                <div class="database-per-name">
                    <b id="perName">${data.name}</b>
                    <br>
                    <div class="links">
                        <a href="mailto:${data.email}">
                            <i class="fas fa-envelope"></i>
                        </a>
                    </div>
                </div>
            </td>
            <td><span id="perIns">${data.institute}</span> <br> class:
                <b class="database-class">${data.class}</b>
            </td>
            <td class="database-events">${this.getStatusBtns(data.events, settings)}</td>
            <td><b>${data.code}</b></td>
        </tr>`
        }).join('');
    }

    getStatusBtns(status, settings) {
        let statusString = '';
        for (let item in status) {
            statusString += `<button class="status-btn ${item} ${status[item] == 1 ? ` delivered` : ` green`}${item === settings.activeEvent ? ' activated-status' : ''}${(settings.checkMode === 'manual' && settings.activeEvent === item) ? ' enabled' : ' disabled'}" data-id="${item}" ${(settings.checkMode === 'manual' && settings.activeEvent === item) ? '' : ' disabled'}>${item}</button> `;
        }

        return statusString;
    }
    static checkSearch(dataContainer) {
        if (dataContainer.querySelector('.highlightTarget')) {
            dataContainer.querySelector('.highlightTarget').classList.remove('highlightTarget');
        }
    }
    static findPerson(id, allPersons) {
        return allPersons.find(person => person.dataset.id.toLowerCase() === id)
    }
    static currentEventCount(settings, eventCountText, eventCountNumber) {
        settings.activeEvent ? eventCountText.textContent = settings.activeEvent : eventCountText.textContent = 'Not Selected';
        settings.activeEvent ? eventCountNumber.textContent = document.querySelectorAll(`.${settings.activeEvent}`).length : eventCountNumber.textContent = 'Not Selected';
    }
    static currentScannedCount(settings, scannedCount) {
        settings.activeEvent ? scannedCount.textContent = document.querySelectorAll(`.${settings.activeEvent}.delivered`).length : scannedCount.textContent = 'Not Selected';
    }
    static settingEventLabelDisplay(settingEventLabel, settings) {
        settings.activeEvent ? settingEventLabel.innerHTML = settings.activeEvent : settingEventLabel.innerHTML = `Select an event in the setting`;
    }
    static alertMessage(text, color) {
        const alertMessageCon = document.querySelector('.alert-container');
        alertMessageCon.style.display = 'inline-block';
        alertMessageCon.style.backgroundColor = color;
        document.getElementById('alert-message').innerText = text;
        setTimeout(_ => {
            alertMessageCon.style.display = 'none';
            document.getElementById('alert-message').innerText = '';
        }, 1500)
    }
}

export default SetUpUi;