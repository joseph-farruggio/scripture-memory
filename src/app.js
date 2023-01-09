import { signInWithGoogle, signOut, getUser, getCompletedColumn, updateCompletedColumn } from './auth.js'

import Alpine from "alpinejs";
import persist from "@alpinejs/persist";
Alpine.plugin(persist);

import verses from "./verses.json";
import readings from "./reading.json";


Alpine.data('app', function () {
	return {
		menuOpen: false,
		tab: this.$persist("memory"),
		user: null,

		verses: {
			list: verses,	
			
			get todaysVerse() {
				const today = new Date().setHours(0,0,0,0);
				
				return this.list.reduce((acc, obj) => {
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
			completed: [],
			
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

			completeReading: (ID) => {
				const readings = this.$data.readings

				if (!readings.completed.includes(ID)) {
					readings.completed.push(ID);
				} else {
					readings.completed = readings.completed.filter(item => item !== ID);
				}

				readings.updateProgress(readings.completed);
			},

			isCompleted(ID) {
				return this.completed.includes(ID);
			},

			updateProgress: () => {
				if (!this.$data.user) return;
				updateCompletedColumn(this.$data.user, this.$data.readings.completed);
			},

			getProgress: () => {
				if (!this.$data.user) return;
				
				getCompletedColumn(this.$data.user).then(completed => {
					if (!completed) {
						this.$data.readings.completed = [];
						return;
					}
					this.$data.readings.completed = JSON.parse(completed);
				})
			},
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

		signIn() {
			signInWithGoogle();
		},	 

		signOut() {
			signOut()
			this.user = null;
			this.readings.completed = [];
		},
		
		

		init() {
			getUser().then(user => {
				this.user = user;
				this.readings.getProgress();
			})


			window.app = document.querySelector('[x-data]')._x_dataStack[0]
		}
	}	
});

window.Alpine = Alpine;

Alpine.start();
