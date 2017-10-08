/**
 * @rsTeam02
 * View as SVG => dom
 */

import {BinaryConverter} from './binaryConverter.js';

export class Raster extends BinaryConverter{
    //raster display decimal or circle dots
    drawRaster(strategy, binArr = {}) {
        let y = 0;
        let ledArr = [];       
        let ledObj = {};
        let binConv = super.convert(binArr);
        let ledNo = (binConv.length * binConv[0].length) - 1;

        for (let i = binConv.length - 1; i >= 0; i--) {
            ledArr[i] = [];
            let x = 0;
            for (let j = 0; j < binConv[i].length; j++) {
                strategy.executeStrategy(ledObj = {
                    onState: ((binConv[i][j] === "1") ? true : false), absX: x, absY: y, id: ledNo
                });
                ledNo--;
                //next row
                x += 35;
            }
            //next column
            y += 85
        }
    }

}
