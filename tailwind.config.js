/** Compiled with: npm run build:css — re-run after adding new utility classes in HTML/JS */
module.exports = {
  content: ["./*.html", "./*/index.html", "./blog/*/index.html", "./*.js"],
  theme: {
    extend: {
      colors: {
        "brand-orange": "#F0642E",
        "brand-teal": "#66C2C2",
        "brand-cream": "#FDF7F2",
        "brand-orange-light": "#FF7A4D",
        "brand-orange-dark": "#D54A1A",
        "brand-teal-light": "#7DD3D3",
        "brand-teal-dark": "#4A9A9A"
      }
    }
  }
};
