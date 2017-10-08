export class Clock {


    //switch AM/PM or 24h mode
    timeDate(format, cb) {

        var optionsDate = {
            year: "2-digit", month: "2-digit", day: "2-digit"
        };

        var dateSplit = [];
        var apm = "";
        var date = new Date();
        var dateFormat = "";
        var hMode = 0;
        var hour12_24 = "";

        if (format) {
            hMode = 24;
            dateFormat = "en-GB";
            $("#ampm").html("AM/PM");
        } else {
            hMode = 12;
            dateFormat = "en-US";
            apm = (date.getHours() >= 0 && date.getHours() < 12) ? "AM" : "PM";
            $("#ampm").html(apm);
        }

        dateSplit = date.toLocaleDateString(dateFormat, optionsDate).split('/');
        hour12_24 = (0 === date.getHours() % hMode && !format) ? 12 : ("0" + date.getHours() % hMode).slice(-2);

        var timeDate = {
            hour: hour12_24,
            min: ("0" + date.getMinutes()).slice(-2),
            sec: ("0" + date.getSeconds()).slice(-2),
            day: ("0" + dateSplit[0]).slice(-2),
            month: ("0" + dateSplit[1]).slice(-2),
            year: ("0" + dateSplit[2]).slice(-2)
        };

        cb(timeDate);
    }

}
