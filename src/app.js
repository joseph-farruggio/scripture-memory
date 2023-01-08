import Alpine from "alpinejs";
// import persist from "@alpinejs/persist";
// Alpine.plugin(persist);

import verses from "./verses.json";


Alpine.data('app', function () {
	return {
		verses: [],
		currentVerse: null,
		
		getCurrentVerse() {
			const today = new Date().setHours(0,0,0,0);

			return this.verses.reduce((acc, obj) => {
				const date = new Date(obj.date);
				if (date >= today && (!acc || date < new Date(acc.date))) {
					return obj;
				}
				return acc;
			}, null);
		},
		
		init() {
			this.verses = verses;
			this.currentVerse = this.getCurrentVerse();
		}
	}	
});

window.Alpine = Alpine;

Alpine.start();
