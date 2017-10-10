import {Controller} from './ioClock/msvc/controller.js';
import { SettingsLS } from './settingsLS.js';

window.onload = function() { 
    let setLS = new SettingsLS();
    new Controller(setLS);    
}