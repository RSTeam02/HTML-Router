export class BinaryConverter {

    convert(unit) {
        let binArr = [];

        $.each(unit, function (k, v) {
            binArr.push(("000000" + parseInt(v).toString(2)).slice(-7));
        });

        return binArr;
    }
}
