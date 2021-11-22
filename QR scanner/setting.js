class SettingFunc {
    displayPassEnter(parentContainer, passClass, text) {
        parentContainer.innerHTML = `<form class="${passClass}">
        <label for="password">${text}</label>
        <input type="password" placeholder="Enter Password" id="adminPass" required>
        <p id="passMessage"></p>
        <button type="submit" id="enter-pass" class="btn">Enter</button>
    </form>`
    }

    generalSettingDisplay(settingFormCon, settings, settingEvents) {
        settingFormCon.innerHTML = `<form id="setting-inner" class="general-settings inner-set">
        <h4 class="user-mode">User Mode</h4>
        <div class="setting-field mode-setting">
            <div class="sub-field">
                <input type="radio" value="auto" id="autoSetting" name="set-radio" ${settings.checkMode === 'auto' ? 'checked' : ''}>
                <label for="autoSetting">auto</label>
            </div>
            <div class="sub-field">
                <input type="radio" value="manual" id="manualSetting" name="set-radio" ${settings.checkMode === 'manual' ? 'checked' : ''}>
                <label for="manualSetting">manual</label>
            </div>
        </div>
        <h4 class="checkingStatus">Target Status</h4>
        <div class="setting-field checking-setting">${this.checkEventsDisplayer(settingEvents, settings)}</div>
        <button type="submit" class="btn setting-sub-btn" id="generalSetBtn">Save</button>
    </form>`
    }

    checkEventsDisplayer(events, settings) {
        return events.map(event => {
            return `<div class="sub-field">
            <input type="radio" value="${event.id}" name="check-radio" ${settings.activeEvent === event.id ? 'checked' : ''}>
            <label for="${event.id}">${event.title}</label>
        </div>`;
        }).join('');
    }

    settingDisplay(mode, btnMode, settingOverlay) {
        settingOverlay.innerHTML = `<aside class="popup-settings">
        <div class="settings-header">
            <span id="setting-mode">${mode}</span>
            <div class="setting-header-ext">
                <button class="btn" id="${btnMode}Set">${btnMode}</button>
                <button class="btn" id="closeSet">Close</button>
            </div>
        </div>
        <div class="formContainer"></div>
    </aside>`;
        document.getElementById('closeSet').addEventListener('click', _ => SettingFunc.closingSetting(settingOverlay))
    }

    static manipulationgDOMChecked(activatedBtns, targetStatus) {
        if (activatedBtns.length > 0) {
            if (activatedBtns[0].dataset.id !== targetStatus) {
                activatedBtns.forEach(status => status.classList.remove('activated-status'))
                document.querySelectorAll(`.${targetStatus}`).forEach(status => status.classList.add('activated-status'))
            }
        } else {
            document.querySelectorAll(`.${targetStatus}`).forEach(status => status.classList.add('activated-status'))
        }
    }

    static manipulatingCheckedMode(allbtns, targetMode) {
        if (allbtns.length > 0) {
            if (!allbtns[0].disabled && targetMode === 'auto') {
                allbtns.forEach(btn => {
                    btn.classList.remove('enabled')
                    btn.classList.add('disabled')
                    btn.disabled = true;
                })
            } else if (allbtns[0].disabled && targetMode === 'manual') {
                allbtns.forEach(btn => {
                    btn.classList.remove('disabled')
                    btn.classList.add('enabled')
                    btn.disabled = false;
                })
            }
        }
    }

    static closingSetting(settingOverlay) {
        settingOverlay.innerHTML = ``;
        settingOverlay.style.display = "none";
    }

    static passEnterValidation(correctPass, adminPassInput) {
        if (adminPassInput.value !== '') {
            if (adminPassInput.value === correctPass) {
                return true;
            } else {
                document.getElementById('passMessage').textContent = `wrong password entered`;
                adminPassInput.value = '';
            }
        } else {
            document.getElementById('passMessage').textContent = `please enter the admin password`;
        }
    }

}

class AdvancedSetting extends SettingFunc {
    advancedSettingDisplay(settingFormContainer, events, callbackMessage) {
        //taking the alert message as a call back function from setup ui class
        this.alertMessageCall = callbackMessage;

        super.displayPassEnter(settingFormContainer, `developer-pass`, `Enter the developer Password`);
        const passForm = document.querySelector('.developer-pass');
        passForm.addEventListener('submit', e => {
            e.preventDefault();
            if (SettingFunc.passEnterValidation(this.getPassword(`developer`), document.getElementById('adminPass'))) {
                super.settingDisplay(`Advanced Setting`, `general`, document.querySelector('.settings-overlay'));
                const advancedFormContainer = document.querySelector('.formContainer');
                this.advancedInner(advancedFormContainer, events);
                this.developerFuntionality();
            }
        })
    }
    advancedInner(advancedFormContainer, events) {
            advancedFormContainer.innerHTML = `<form id="developerMode" class="advanced-setting inner-set">
            <h4 class="user-mode">User Mode <span style="font-size: .8rem;">(to activate all status btns)</span></h4>
            <div class="sub-field" style="margin-bottom: 20px;">
                <select name="modeOp" id="modeOp">
                    <option value="auto">auto</option>
                    <option value="manual">manual</option>
                </select>
            </div>
            <button type="submit" class="btn developer-btn">Apply</button>
        </form>

        <form id="eventClear" class="advanced-setting inner-set">
            <h4 class="user-mode">Target on the whole event</h4>
            <div class="setting-field">
                <div class="sub-field">
                    <select name="eventsOp" id="eventsOp">
                    ${events.map(data => {
            return `<option value="${data.id}">${data.title}</option>`
        })}
                    </select>
                </div>
                <div class=" ub-field">
                    <select name="checkOp" id="checkOp">
                        <option value="1">Checked</option>
                        <option value="0">Unchecked</option>
                    </select>
                </div>
            </div>
            <button type="submit" class="btn developer-btn">Apply</button>
        </form>

        <button class="btn developer-btn" id="allClear" style="text-transform: none; margin-top: 35px;">Clear All Checked from all events</button>`
    }

    mainOverlay = document.querySelector('.settings-overlay');
    developerFuntionality() {
        document.getElementById('developerMode').addEventListener('submit', e => {
            e.preventDefault();
            SettingFunc.manipulatingCheckedMode(document.querySelectorAll('.status-btn'), document.querySelector('#developerMode #modeOp').value);
            SettingFunc.closingSetting(this.mainOverlay)
        })

        document.getElementById('eventClear').addEventListener('submit', e => {
            e.preventDefault();
            this.targetStatus = document.getElementById('eventsOp').value;
            //checktype gives 0 or 1
            this.checkType = document.getElementById('checkOp').value;
            //go to database check and update the event status 0 or 1 ..here is only a demo function for now using asyncronus
            this.eventBasedDatabaseUpdate(this.targetStatus, parseInt(this.checkType)).then(_ => {
                this.alertMessageCall(`Database Updated`, `green`)
                document.location.reload(true)
            })
        })

        document.getElementById('allClear').addEventListener('click', _ => {

            this.securedElement = document.createElement('div');
            this.securedElement.className = 'mainSecuredPass';
            super.displayPassEnter(this.securedElement, 'mostSecured', `Enter the special security password`);
            console.log(this.securedElement);
            document.querySelector('.formContainer').appendChild(this.securedElement);
            this.securedForm = document.querySelector('.mostSecured');
            this.securedForm.addEventListener('submit', e => {
                e.preventDefault();
                if (SettingFunc.passEnterValidation(this.getPassword('secured'), document.getElementById('adminPass'))) {
                    //make every status value to 0 ... here is only a demo using asyncronas
                    this.clearAllCheckedData().then(_ => {
                        this.alertMessageCall(`Database Updated`, `green`)
                        document.location.reload(true)
                    });
                }
            })
        })
    }

    getPassword(needFor) {
        if (needFor === 'user')
            return 'admininit2'
        else if (needFor === 'developer')
            return 'khalid01'
        else if (needFor === 'secured')
            return 'nfs'
    }

    //update Database by event
    async eventBasedDatabaseUpdate(status, checkType) {
        this.parList = this.getLocalStorage();
        this.parList = this.parList.map(per => {
            if (Object.getOwnPropertyNames(per.events).includes(status)) {
                per.events[`${status}`] = checkType;
            }
            return per;
        })
        localStorage.setItem('parList', JSON.stringify(this.parList));
    }

    //uncheck every single status of the database
    async clearAllCheckedData() {
        this.parList = this.getLocalStorage();
        this.parList = this.parList.map(per => {
            for (let status in per.events) {
                per.events[status] = 0;
            }
            return per;
        })
        localStorage.setItem('parList', JSON.stringify(this.parList));
    }

    //update Database per call by btn or scanner
    async updateDatabase(targetCode, activeid, editType) {
        this.parList = this.getLocalStorage();
        this.parList = this.parList.map(per => {
            if (per.code == targetCode) {
                per.events[`${activeid}`] = editType;
            }
            return per;
        })
        localStorage.setItem('parList', JSON.stringify(this.parList));
    }

    getLocalStorage() {
        return localStorage.getItem('parList') ? JSON.parse(localStorage.getItem('parList')) : [];
    }
}

export { SettingFunc, AdvancedSetting };