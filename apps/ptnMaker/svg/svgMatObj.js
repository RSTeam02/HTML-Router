/**
 * @sakaijun
 * SVG DOM
 */


export class SVGMatObject {

	svgShape(led, shape) {

		let svgLed = document.createElementNS("http://www.w3.org/2000/svg", shape);
		if (shape === "circle") {
			svgLed.setAttribute("cx", 10);
			svgLed.setAttribute("cy", 10);
			svgLed.setAttribute("r", 10);
		} else {
			svgLed.setAttribute("width", 20);
			svgLed.setAttribute("height", 20);

		}
		svgLed.setAttribute("fill-opacity", led.activity.opacity);
		svgLed.setAttribute("fill", `url(${led.activity.color})`);
		svgLed.setAttribute("class", "mat");
		svgLed.setAttribute("id", led.id);
		svgLed.setAttribute("transform", `translate(${led.xAxis} ${led.yAxis})`);
		document.getElementById("ledDisplay").appendChild(svgLed);

	}
}
