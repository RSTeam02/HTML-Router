import {Controller} from './puzzle/mvc/controller.js';
import { SettingsLS } from './settingsLS.js';

window.onload = function() {   
    //localStorage.clear();
    //console.log("pass")
    let setLS = new SettingsLS();
    new Controller(setLS);    
}