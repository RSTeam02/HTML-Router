export class TextReader {

    readFile(callback) {
        let strOutput = document.querySelector('div');
        let file = document.querySelector('input[type=file]').files[0];
        let reader = new FileReader();
        reader.readAsText(file);
        reader.onerror = (e) => {
            console.log("Error", e);
        };
        reader.onload = () => {
            strOutput = reader.result;
            callback(strOutput);
        }

    }

}
