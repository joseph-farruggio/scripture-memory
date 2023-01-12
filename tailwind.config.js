module.exports = {
	content: ["index.html", "src/app.js"],
	theme: {
		fontFamily: {
			sans: ["sans-serif"],
			serif: ["Playfair Display", "serif"],
		},
		screens: {
			sm: "640px",
			// => @media (min-width: 640px) { ... }

			md: "768px",
			// => @media (min-width: 768px) { ... }

			lg: "1024px",
			// => @media (min-width: 1024px) { ... }

			xl: "1280px",
			// => @media (min-width: 1280px) { ... }

			"2xl": "1536px",
			// => @media (min-width: 1536px) { ... }
		},
		extend: {
			colors: {
				gold: "#BFB391"
			}
		},
	},
	daisyui: {
      themes: [
        {
          mytheme: {
			"primary": "#BFB391",
					
			"secondary": "#D926A9",
					
			"accent": "#1FB2A6",
					
			"neutral": "#191D24",
					
			"base-100": "#2A303C",
					
			"info": "#3ABFF8",
					
			"success": "#36D399",
					
			"warning": "#FBBD23",
					
			"error": "#F87272",
					},
					},
				],
				},
	plugins: [require("@tailwindcss/line-clamp"), require("daisyui")],
};
