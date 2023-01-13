import { signInWithGoogle, signOut, getUser, getCompletedColumn, updateCompletedColumn, getAccountability, addAccountabilityUser} from './auth.js'

import Alpine from "alpinejs";
import persist from "@alpinejs/persist";
Alpine.plugin(persist);

import verses from "./verses.json";
import readings from "./reading.json";

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://yzdgbejeciqskvyuldcx.supabase.co'
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl6ZGdiZWplY2lxc2t2eXVsZGN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzMyODI5OTEsImV4cCI6MTk4ODg1ODk5MX0.sbQyIiHTKuytcRqQo5uO8h9aXnwOtIZmx1jE9He5CcA"
const supabase = createClient(supabaseUrl, supabaseKey)


Alpine.data('app', function () {
	return {
		menuOpen: false,
		tab: this.$persist("memory"),
		user: null,
		accountabilityBoard: false,
		addedAccountabilityUser: this.$persist(false),

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

			getESVLinks: (verses) => {
				// split verses by ;
				const versesArray = verses.split(';');
				// create links for each verse
				const links = versesArray.map(verse => {
					let url = encodeURI(`https://www.esv.org/${verse.trim().replace(" ", "+")}/`);
					return `<a href="${url}" class="underline decoration-gold/50 underline-offset-4 first:ml-0 ml-2" target="_blank">${verse}</a>`
				})

				return links.join(';');
			}
		},

		get todaysDate() {
			const today = new Date();
			const options = { year: 'numeric', month: 'long', day: 'numeric' };
			const dateString = today.toLocaleDateString('en-US', options);
			return dateString;
		},

		beginningOfCurrentWeek(date, prefix = 'Week of ') {
			const today = date ? new Date(date) : new Date();
			const options = { month: 'long', day: 'numeric' };

			const dayOfWeek = today.getDay();
			const diff = today.getDate() - dayOfWeek + (dayOfWeek == 0 ? 0:1);
			return prefix + new Date(today.setDate(diff)).toLocaleDateString('en-US', options);
		},

		signIn() {
			signInWithGoogle();
		},	 

		signOut() {
			signOut()
			this.user = null;
			this.readings.completed = [];
		},

		setView(tab) {
			this.menuOpen = false

			this.tab = tab
		},

		async optInToAccountability() {
			if (!this.user) return
			this.accountabilityBoard = !this.accountabilityBoard

			if (this.accountabilityBoard || !this.addedAccountabilityUser) {
				this.accountabilityBoard = await addAccountabilityUser(this.user)
			}

			return await supabase
			.from('reading_progress')
			.upsert({'accountabilityBoard': this.accountabilityBoard, 'user_id': this.user.id })
			.eq('user_id', this.user.id )
		},
		
	
		init() {
			window.app = document.querySelector('[x-data]')._x_dataStack[0]

			getUser()
			.then(user => {
				this.user = user
				this.readings.getProgress()
			})
			.then(() => {
				if (!this.user) return
				getAccountability(this.user)
				.then(accountability => {
					this.accountabilityBoard = accountability
				})	
			})

			
		}
	}	
});

window.Alpine = Alpine;

Alpine.start();
