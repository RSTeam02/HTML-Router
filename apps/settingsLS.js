/**
 * Abstract base class (inherited by subcontrollers) to save last key inputs via LS
 *
 */

export class SettingsLS{

 	loadSetting(lastSetting) {      
        return JSON.parse(localStorage.getItem(lastSetting));
    }

	saveSetting(lastSetting, current) {
    	if (typeof (Storage) !== "undefined") {
            localStorage.setItem(lastSetting, JSON.stringify(current));
        } else {
            $("#showContent").html("localStorage not supported by browser.");
        }
    }

}
