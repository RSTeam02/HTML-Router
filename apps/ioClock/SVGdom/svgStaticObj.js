export class SVGStaticObj {

    svgTitle(text) {
        let txt = document.createElementNS("http://www.w3.org/2000/svg", "text");
        $(txt).attr("fill-opacity", .7);
        $(txt).attr("fill", "white");
        $(txt).attr("font-family", "'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif");
        $(txt).attr("font-size", "14px");
        txt.textContent = text;
        $("#svgTitle").append(txt);
    }

}
