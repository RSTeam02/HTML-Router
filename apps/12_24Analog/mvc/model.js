/*
 *@author sakaijun 
 */
export class Model {


	//return 0-59 as written strings
	num2word(x, numerals) {

		var res;

		for (var i = 0; i < numerals.length; i++) {
			if (i === parseInt(x)) {
				res = (numerals[i] === "zero") ? "twelve" : numerals[i];
				break;
			}
		}

		return res;
	}
	//distinguish between st, th, nd, rd
	nth(part) {
		var nDay;
		switch (parseInt(part[1])) {

			case 1:
			case 21:
			case 31:
				nDay = "st";
				break;
			case 2:
			case 22:
				nDay = "nd";
				break;
			case 3:
			case 23:
				nDay = "rd";
				break;
			default:
				nDay = "th";
				break;

		}
		return nDay;

	}

	//return phrases by checking if conditions
	buildPhrase(part, numerals) {

		var hour0_12 = 0, phrase = "";

		hour0_12 = (part.hour === 12) ? 0 : part.hour % 12;

		if (part.min === 0)
			phrase = `It's ${this.num2word((part.hour % 12), numerals)} o'clock`;
		else if (part.min === 15)
			phrase = `It's quarter past ${this.num2word((part.hour % 12), numerals)}`;
		else if (part.min < 30)
			phrase = `It's ${this.num2word(part.min, numerals)} ${this.minMins(part)} past ${this.num2word(part.hour % 12, numerals)}`;
		else if (part.min === 30)
			phrase = `It's half past ${this.num2word((part.hour % 12), numerals)}`;
		else if (part.min === 45)
			phrase = `It's quarter to ${this.num2word((parseInt(hour0_12) + 1), numerals)}`;
		else
			phrase = `It's ${this.num2word((60 - part.min), numerals)} ${this.minMins(part)} to ${this.num2word((1 + parseInt(hour0_12)), numerals)}`;

		return phrase;
	}


	//return state of day if it's morning, (after)noon, evening or (mid)night
	dayState(part) {

		var ampm = "";
		var phase;

		if (part.hour === 0) {
			part.hour = 24;
		}

		ampm = (part.hour >= 12 && part.hour < 24) ? "PM" : "AM";


		if (part.hour === 12 && part.min === 0 || part.hour === 24 && part.min === 0) {

			if (ampm === "AM")
				phase = "at midnight";
			else
				phase = "at noon";
		} else if (part.hour % 12 > 4 && part.hour % 12 <= 8) {
			if (ampm === "AM")
				phase = "in the morning";
			else
				phase = "in the evening";
		} else if (part.hour % 12 > 8 && part.hour % 12 < 12) {
			if (ampm === "AM")
				phase = "before noon";
			else
				phase = "in the evening";
		} else {
			if (ampm === "AM")
				phase = "at night";
			else
				phase = "in the afternoon";
		}

		return phase;
	}
	//except of 1 minute to or past, every other are minutes  
	minMins(part) {
		var minStr;
		minStr = (part.min !== 1 && part.min !== 59) ? "minutes" : "minute";
		return minStr;

	}

}

