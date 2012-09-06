
all: simulator.jsx.js
	jsx --add-search-path ../lib --executable web --output hello.jsx.js hello.jsx
	jsx --add-search-path ../lib --executable web --output image.jsx.js image.jsx
	jsx --add-search-path ../lib --executable web --output scroll.jsx.js scroll.jsx

simulator.jsx.js: simulator.jsx
	jsx --executable web --output $@ $<
