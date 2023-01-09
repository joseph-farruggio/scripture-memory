import Alpine from "alpinejs";
// import persist from "@alpinejs/persist";
// Alpine.plugin(persist);

import verses from "./verses.json";


Alpine.data('app', function () {
	return {
		tab: "memory",
		context: {
			verses: [],	
			get todaysVerse() {
				const today = new Date().setHours(0,0,0,0);
				console.log(today);
				return this.verses.reduce((acc, obj) => {
					console.log(acc);
					console.log(obj);

					const date = new Date(obj.date);
					if (date >= today && (!acc || date < new Date(acc.date))) {
						return obj;
					}
					return acc;
				}, null);
			},

			get currentVerseIndex() {
				this.verses.sort((a,b) => {
					const dateA = new Date(a.date);
					const dateB = new Date(b.date);
					return dateB - dateA;
				})

				const currentDate = new Date().setHours(0,0,0,0); // get the current date
				const currentVerse = this.verses.find(verse => Date.parse(verse.date) <= currentDate);

				return this.verses.indexOf(currentVerse);
			},

			get nextVerse() {
				const nextIndex = this.currentVerseIndex + 1;
				return this.verses[nextIndex];
			},

			get previousVerse() {
				const previousIndex = this.currentVerseIndex - 1;
				return this.verses[previousIndex];
			}
		},

		get todaysDate() {
			const today = new Date();
			const options = { year: 'numeric', month: 'long', day: 'numeric' };
			const dateString = today.toLocaleDateString('en-US', options);
			return dateString;
		},
		
		
		init() {
			this.context.verses = verses;
		}
	}	
});

window.Alpine = Alpine;

Alpine.start();
