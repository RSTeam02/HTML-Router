/**
 *
 * class for converting string input into plain text/csv, create download link
 * 
 */

export class FileWriter {

    constructor() {
        this.private = {
            link: document.getElementById("download")
        }

    }

    setContent(input) {
        this.blob = new Blob([input], { type: 'text/plain' });
    }

    createFile(fileName) {
        this.private.link.download = fileName;
        this.private.link.innerHTML = `Download ${fileName}`;
        this.private.link.href = window.URL.createObjectURL(this.blob);
        document.getElementById("ahref").appendChild(this.private.link);
    }
}
