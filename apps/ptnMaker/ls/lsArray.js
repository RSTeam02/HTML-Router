/**
 * @rsTeam02
 * Localstorage Element as array (getter-setter => store, remove, retrieve) 
 */
export class LSArray {

	constructor() {

		this.private = {
			lsName: () => {
				return lsName = "";
			},

			arrItem: () => {
				return arrItem = [];
			}
		};
	}

	setLSName(name) {
		this.private.lsName = name;
	}


	getLSName() {
		return this.private.lsName;
	}

	setLSArr(arrItem) {

		this.private.arrItem = arrItem;
		localStorage.setItem(this.private.lsName, JSON.stringify(this.private.arrItem));
	}

	retrieveLSArr(lsName = "") {

		if (lsName !== "") {
			this.private.lsName = lsName;
		}
		return JSON.parse(localStorage.getItem(this.private.lsName));
	}


	removeLSElement(arrIdx) {
		var arrItem = JSON.parse(localStorage[this.private.lsName]);
		for (let i = 0; i < arrItem.length; i++) {
			if (i === arrIdx) {
				arrItem.splice(i, 1);
			}
		}
		localStorage[this.private.lsName] = JSON.stringify(arrItem);
	}

	removeAllElement() {
		localStorage.removeItem(this.private.lsName);
	}

}
