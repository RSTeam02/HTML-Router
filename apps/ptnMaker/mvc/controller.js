/**
 * @rsTeam02
 * Control unit 
 */
import { SVGMatObject } from '../svg/svgMatObj.js';
import { PatternSnapshot } from '../view/ptnSnapshot.js';
import { TextReader } from '../io/textreader.js';
import { FileWriter } from '../io/filewriter.js';
import { LSArray } from '../ls/lsArray.js';
import { Led } from '../mvc/led.js';



export class Controller extends SVGMatObject {

	constructor(setLS) {
		super();
		this.i = 0;
		this.setLS = setLS;
		this.ptnMakSet();
		this.txtReader = new TextReader();
		this.ledArr = [];
		
		this.ptnSnapshot = new PatternSnapshot();
		this.patternArr = [];


		this.lsArr = new LSArray();
		this.lsArr.setLSName("patternArr");


		(!localStorage[this.lsArr.getLSName()])
			? this.lsArr.setLSArr(this.patternArr)
			: this.patternArr = this.lsArr.retrieveLSArr(this.lsArr.getLSName());

		this.classRadio = document.getElementsByClassName("radioBtn");
		this.printSnapshot();
		this.saveListener();
		this.buttonListener();
		this.ptrnListener();
		
		if (this.setLS.loadSetting("ptnMakSet") !== null) {
			$("#row").val(this.setLS.loadSetting("ptnMakSet").row);
			$("#col").val(this.setLS.loadSetting("ptnMakSet").col);
			$(`#${this.setLS.loadSetting("ptnMakSet").color}`).prop('checked',true);
			$(`#${this.setLS.loadSetting("ptnMakSet").shape}`).prop('checked',true);
			$(`#${this.setLS.loadSetting("ptnMakSet").func}`).prop('checked',true);
			this.shape = this.setLS.loadSetting("ptnMakSet").shape;
			$("#slider").val(this.setLS.loadSetting("ptnMakSet").speed);
			this.initRefresh();			
			this.ledListener(this.lsArr.retrieveLSArr(this.lsArr.getLSName())[parseInt(this.setLS.loadSetting("ptnMakSet").id)]);
		}else{
			
			this.shape = $("input:radio[name='figure']:checked").val();
			this.color = this.colorChooser();
			this.ledListener();
		}
		
	}


	initRefresh() {

		let maximum = parseInt(document.getElementById("slider").max) + 50;
		let countDesc;
		clearInterval(this.interval);
		if ($("#slider").val() != 0) {
			let countDesc = maximum - $("#slider").val();
			$("#updateSlider").html(`Interval Slider, update every ${countDesc}ms (play):`);
			this.newMatrix(countDesc);
		} else {
			this.i--;
			$("#updateSlider").html(`Interval Slider, update every ${$("#slider").val()}ms (pause):`);

		}
	}

	//loop pattern array by interval
	newMatrix(update, loopCnt = 0) {
		let ledIO = this.lsArr.retrieveLSArr(this.lsArr.getLSName())
		this.interval = setInterval(() => {
			this.clearSVGMat();
			loopCnt = (this.i++) % ledIO.length;
			this.svgRaster(ledIO[loopCnt], this.shape, this.colorChooser());
		}, update);
	}
	//assign every ui setting in a json
	ptnMakSet() {

		let rc;
		return rc = {
			id: this.currentId,
			playId: this.i,
			shape: $("input:radio[name='figure']:checked").val(),
			row: $("#row").val(),
			col: $("#col").val(),
			rxc: $("#row").val() * $("#col").val(),
			color: $("input:radio[name='rgb']:checked").attr("id"),
			speed: $("#slider").val(),
			func: $("input:radio[name='mode']:checked").attr("id")
	
		}
	}

	saveListener(){
		$(".color, .shape, .func, .rc, .mkInput, .shape, .listElement").click(()=>{
			this.setLS.saveSetting("ptnMakSet", this.ptnMakSet());
		});
	}

	buttonListener() {	

		//set number of row and columns
		let rcSlider = document.getElementsByClassName("rc");
		for (var i = 0; i < rcSlider.length; i++) {
			rcSlider[i].addEventListener("input", () => {
				this.ledListener();				
				$("#info").html(`row: ${this.ptnMakSet().row}, col: ${this.ptnMakSet().col}, r*c: ${this.ptnMakSet().rxc}`);
			});
		}

		//read array input from textfile (json)
		$("#read").change(() => {
			//callback from reader
			this.txtReader.readFile((result) => {
				this.lsArr.removeAllElement();
				for (let i = 0; i < JSON.parse(result).length; i++) {
					this.patternArr.push(JSON.parse(result)[i]);
				}
				this.lsArr.setLSArr(this.patternArr);
				this.printSnapshot();

			});
		});

		//switch between patterns from 250 to 1000ms 
		$(".mkInput").on("input", () => {
			this.initRefresh();			
		});


		let radioShape = document.getElementsByClassName("shape");


		//draft mode      
		$("#draft").click(() => {
			this.ledListener();
			clearInterval(this.interval);
		});


		//select square or circle shape
		for (let i = 0; i < radioShape.length; i++) {
			$(radioShape[i]).click(() => {				
				this.shape = $("input:radio[name='figure']:checked").val();
			});
		}

		//clear raster
		$("#resetBtn").click(() => {
			this.ledListener();
			$("input:radio[name='mode']").val(["draft"]);
		});

		//edit and append or save pattern of current id 
		$(".updateList").click((event) => {
			console.log(event.currentTarget.id)
			if("saveBtn" === event.currentTarget.id){				
				this.patternArr[this.currentId] = this.savePattern();
				this.lsArr.setLSArr(this.patternArr);
			}else if("appendBtn" === event.currentTarget.id){
				this.patternArr.push(this.savePattern());
				this.lsArr.setLSArr(this.patternArr);
			}else{
				this.patternArr = [];
				this.lsArr.removeAllElement();
			}			
			
			this.printSnapshot();
		});
	}

	//insert, remove, edit pattern by selected id
	ptrnListener() {
		$(".listElement").click((event) => {
			this.currentId = parseInt(event.currentTarget.id);
			this.clearSVGMat();
			let ledIO = this.lsArr.retrieveLSArr(this.lsArr.getLSName())[this.currentId];
			if ($("input:radio[name='mode']:checked").val() === "remove") {
				this.lsArr.removeLSElement(this.currentId);
				this.patternArr.splice(event.currentTarget.id, 1);
				this.printSnapshot();
			} else if ($("input:radio[name='mode']:checked").val() === "insert") {
				this.ledListener();
				this.patternArr.splice(this.currentId + 1, 0, this.savePattern());
				this.lsArr.setLSArr(this.patternArr);
				this.printSnapshot();
			} else {
				this.ledListener(ledIO);
			}
			
		});
	}

	//update snapshot view
	printSnapshot() {
		$("#snapshot").empty();
		var ptrn = [];
		if (localStorage[this.lsArr.getLSName()]) {
			for (let i = 0; i < this.lsArr.retrieveLSArr(this.lsArr.getLSName()).length; i++) {
				ptrn[i] = this.lsArr.retrieveLSArr(this.lsArr.getLSName())[i];
				this.ptnSnapshot.insertPattern(i, ptrn[i])
			}
		}

		var json = JSON.stringify(this.lsArr.retrieveLSArr(this.lsArr.getLSName()));
		var fw = new FileWriter();
		fw.setContent(json);
		fw.createFile("pattern.json");
		this.ptrnListener();
	}

	//mxn listener
	ledListener(arr = undefined) {
		let x = 0;
		this.clearSVGMat();
		this.svgRaster(arr, this.shape, this.colorChooser());
		//handler/listener for each led
		for (let j = 0; j < this.ptnMakSet().rxc; j++) {
			(() => {
				let enabled = true;
				//access Matrix through handler
				let handler = () => {
					enabled = (enabled) ? false : true;
					this.ledActivity(document.getElementById(j), !enabled);
					this.savePattern();
				};
				document.getElementById(j).addEventListener("click", handler, false);
			})();
		}
	}

	//raster display rectangle or circle dots
	svgRaster(arr, shape, color) {
		let y = 0;
		let ledNo = 0;

		for (let i = 0; i < this.ptnMakSet().row; i++) {
			let x = 0;
			for (let j = 0; j < this.ptnMakSet().col; j++) {
				this.ledArr[ledNo] = new Led();
				this.ledArr[ledNo].setOn(1, `#${color}`);
				this.ledArr[ledNo].setOff(.2, "#RadialGradient2");
				let led = {
					activity: {},
					xAxis: x,
					yAxis: y,
					id: ledNo
				}

				if (arr !== undefined) {
					led.activity = (arr[i][j] === "1")
						? this.ledArr[ledNo].getOn()
						: this.ledArr[ledNo].getOff();
				} else {
					led.activity = this.ledArr[ledNo].getOff();
				}
				super.svgShape(led, shape, color);
				ledNo++;
				//next row
				x += 20;
			}
			//next column
			y += 20
		}
	}

	//clear SVG canvas
	clearSVGMat() {
		while (ledDisplay.firstChild) {
			ledDisplay.removeChild(ledDisplay.firstChild);
		}
	}

	//invoked when event occurs 
	ledActivity(led, enabled) {
		let ledAttr = (enabled) ? this.ledArr[led.id].getOn() : this.ledArr[led.id].getOff();
		led.setAttribute("fill", `url(${ledAttr.color})`);
		led.setAttribute("fill-opacity", ledAttr.opacity);
	}

	//random or checked letter color
	colorChooser() {
		let allColor = document.getElementsByClassName("color");
		let rndVal = Math.floor(Math.random() * (allColor.length - 1));
		let color= $("input:radio[name='rgb']:checked").attr("id");		
		let colorVal;

		if (color === "random") {
			colorVal = allColor[rndVal].value;
		}else{
			colorVal = $("input:radio[name='rgb']:checked").val();
		}
		
		return colorVal;
	}

	//save pattern as binary array string
	savePattern() {
		let bit = "";
		let bitStr = "";
		for (let i = 0; i < $(".mat").length; i++) {
			bit = (($(`#${i}`).attr("fill-opacity")) === "1") ? "1" : "0";
			bitStr += ((i + 1) % this.ptnMakSet().col === 0 && i !== $(".mat").length - 1) ? `${bit}\r\n` : `${bit}`;
		}

		return bitStr.split("\r\n");
	}
}
