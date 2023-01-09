import Alpine from "alpinejs";
import persist from "@alpinejs/persist";
Alpine.plugin(persist);

import verses from "./verses.json";
import readings from "./reading.json";


Alpine.data('app', function () {
	return {
		tab: this.$persist("memory"),
		verses: {
			list: verses,	
			
			get todaysVerse() {
				const today = new Date().setHours(0,0,0,0);
				
				return this.list.reduce((acc, obj) => {
					console.log(acc);
					console.log(obj);

					const date = new Date(obj.date);
					if (date >= today && (!acc || date < new Date(acc.date))) {
						return obj;
					}
					return acc;
				}, null);
			},

			get currentIndex() {
				this.list.sort((a,b) => {
					const dateA = new Date(a.date);
					const dateB = new Date(b.date);
					return dateB - dateA;
				})

				const currentDate = new Date().setHours(0,0,0,0); // get the current date
				const currentVerse = this.list.find(verse => Date.parse(verse.date) <= currentDate);

				return this.list.indexOf(currentVerse);
			}
		},

		readings: {
			list: readings,
			completed: this.$persist([]),

			get currentIndex() {
				this.list.sort((a,b) => {
					const dateA = new Date(a.week);
					const dateB = new Date(b.week);
					return dateB - dateA;
				})

				const currentDate = new Date().setHours(0,0,0,0); // get the current date
				const currentVerse = this.list.find(reading => Date.parse(reading.week) <= currentDate);

				return this.list.indexOf(currentVerse);
			},

			completedReading(ID) {
				if (this.completed.includes(ID)) {
					this.completed = this.completed.filter(item => item !== ID);
					return;
				}
				this.completed.push(ID);
			},

			isCompleted(ID) {
				return this.completed.includes(ID);
			}
		},

		get todaysDate() {
			const today = new Date();
			const options = { year: 'numeric', month: 'long', day: 'numeric' };
			const dateString = today.toLocaleDateString('en-US', options);
			return dateString;
		},

		get beginningOfCurrentWeek() {
			const today = new Date();
			const options = { month: 'long', day: 'numeric' };

			const dayOfWeek = today.getDay();
			const diff = today.getDate() - dayOfWeek + (dayOfWeek == 0 ? -6:1);
			return "Week of " + new Date(today.setDate(diff)).toLocaleDateString('en-US', options);
		},
		
		
		init() {
			window.app = document.querySelector('[x-data]')._x_dataStack[0]
		}
	}	
});

window.Alpine = Alpine;

Alpine.start();
