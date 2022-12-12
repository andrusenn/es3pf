/**
 * 3ASF
 *
 * 3 armonografos sobre figuras
 *
 * Andrés Senn / Dec - 2022
 * fxhash.xyz project
 */

// Commons
let seed, cv;
//
let snoise,
	pends = [],
	pg1,
	pg2,
	h1,
	h2,
	h3,
	t1,
	t2,
	t3,
	pdist = 0,
	invert,
	renderFrames = 600,
	features = [],
	overlay;

function setup() {
	overlay = document.querySelector(".overlay");
	// Commons -----------------------
	seed = int(fxrand() * 9999999999);
	randomSeed(seed);
	snoise = createNoise3D(random);
	cv = createCanvas(1200, 1800);
	pg1 = createGraphics(width, height);
	pg2 = createGraphics(width, height);
	cv.id("_3ASF");
	cv.class("_3ASF");

	// Pixel density param ------------
	const uparams = getURLParams();
	if (uparams.pd) {
		pixelDensity(float(uparams.pd));
		pg1.pixelDensity(float(uparams.pd));
		pg2.pixelDensity(float(uparams.pd));
	} else {
		pixelDensity(1);
		pg1.pixelDensity(1);
		pg2.pixelDensity(1);
	}

	// --------------------------------
	noLoop();
	background(255);
	// Dist entre armonografos
	pdist = 350; //random(200, 400);

	// Canvas 1
	pg1.background(255);

	// Canvas 2
	pg2.background(255, 255, 255, 0);

	// Inversion B/N
	invert = random() < 0.5;

	// Fondo
	if (invert) {
		pg1.background(0);
	} else {
		pg1.background(255);
	}
	pg1.noStroke();

	// Relleno figuras Canvas 1
	if (invert) {
		pg1.fill(255);
	} else {
		pg1.fill(0);
	}

	// Dimensiones
	let w = random(100, 300);
	let h = random(400, 600);
	let r = Math.min(w, h);

	// Dibuja figuras Canvas 1
	pg1.push();
	pg1.translate(0, random(-400, 400));
	if (random() < 0.33) {
		// Rectangulo
		features["shape1"] = "Rectangle";
		pg1.rect(width / 2 - w, h, w * 2, height - h * 2);
	} else if (random() < 0.66) {
		// Circulo
		features["shape1"] = "Circle";
		pg1.circle(width / 2, height / 2, w * 4);
	} else {
		// Triangulo
		features["shape1"] = "Triangle";
		let a = random(100, 300);
		let b = random(200, 500);
		pg1.triangle(
			width / 2 - b,
			height / 2 + b,
			width / 2,
			height / 2 - a,
			width / 2 + b,
			height / 2 + b,
		);
	}
	pg1.pop();

	// Invierte tonalidad Canvas 1
	if (invert) {
		pg1.fill(0);
	} else {
		pg1.fill(360);
	}

	// Vuelve a dibujar figuras tono invertido
	// Canvas 1
	pg1.push();
	pg1.translate(0, random(-200, 200));
	if (random() < 0.33) {
		// Circulo
		features["shape2"] = "Circle";
		pg1.circle(width / 2, height / 2, r * 2);
	} else if (random() < 0.66) {
		// Rectangulo
		features["shape2"] = "Rectangle";
		pg1.rect(width / 2 - r, height / 2 - r, r * 2, r * 2);
	} else {
		// Triangulo
		features["shape2"] = "Triangle";
		let a = random(20, 150);
		let b = random(50, 150);
		pg1.triangle(
			width / 2 - b,
			height / 2 + b,
			width / 2,
			height / 2 - a,
			width / 2 + b,
			height / 2 + b,
		);
	}
	pg1.pop();

	// Crear pendulos
	for (let i = 0; i < 2; i++) {
		let p = new Pendulum(
			random(20, 300),
			random(20, 300),
			map(random(), 0, 1, -0.1, 0.1),
		);
		p.data.ns1 = random(0.00022, 0.002);
		p.data.ns2 = random(0.0002, 0.0022);
		pends.push(p);
	}
	// Agregar al armonografo
	h1 = new Harmonograph(pends);

	pends = [];
	for (let i = 0; i < 2; i++) {
		let p = new Pendulum(
			random(20, 300),
			random(20, 300),
			map(random(), 0, 1, -0.1, 0.1),
		);
		p.data.ns1 = random(0.001, 0.01);
		p.data.ns2 = random(0.001, 0.01);
		pends.push(p);
	}
	// Agregar al armonografo
	h2 = new Harmonograph(pends);

	pends = [];
	for (let i = 0; i < 2; i++) {
		let p = new Pendulum(
			random(20, 300),
			random(20, 300),
			map(random(), 0, 1, -0.1, 0.1),
		);
		p.data.ns1 = random(0.001, 0.01);
		p.data.ns2 = random(0.001, 0.01);
		pends.push(p);
	}
	// Agregar al armonografo
	h3 = new Harmonograph(pends);

	// Transporte eje X de la toma de brillo del fondo/figuras
	// para invertir el tono del armonografo
	t1 = 0;
	t2 = 0;
	t3 = 0;
	features["displacement"] = "None";
	if (random() < 0.3) {
		t1 = random(-300, 300);
		t2 = random(-300, 300);
		t3 = random(-300, 300);
		features["displacement"] = "Yes";
	}

	for (let i = 0; i < renderFrames; i++) {
		pg2.push();
		pg2.translate(width / 2, height / 2);
		h1.update((x, y, p) => {
			if (brightness(pg1.get(width / 2 + x + t1, height / 2 + y)) > 60) {
				pg2.fill(0, 40);
			} else {
				pg2.fill(360, 40);
			}
			pg2.noStroke();
			pg2.circle(x, y, 2);
			let n = snoise(
				x * h1.pendulums[1].data.ns1,
				y * h1.pendulums[1].data.ns2,
				0,
			);
			h1.pendulums[1].r1 = map(n, -1, 1, 20, 300);
		}, 300);
		pg2.pop();
	}

	for (let i = 0; i < renderFrames; i++) {
		pg2.push();
		pg2.translate(width / 2, height / 2 - pdist);
		h2.update((x, y) => {
			if (
				brightness(
					pg1.get(width / 2 + x + t2, height / 2 + y - pdist),
				) > 60
			) {
				pg2.fill(0, 40);
			} else {
				pg2.fill(360, 40);
			}
			pg2.noStroke();
			pg2.circle(x, y, 2);
			let n = snoise(
				x * h2.pendulums[1].data.ns1,
				y * h2.pendulums[1].data.ns2,
				0,
			);
			h2.pendulums[1].r1 = map(n, -1, 1, 20, 300);
		}, 300);
		pg2.pop();
	}

	for (let i = 0; i < renderFrames; i++) {
		pg2.push();
		pg2.translate(width / 2, height / 2 + pdist);
		h3.update((x, y) => {
			if (
				brightness(
					pg1.get(width / 2 + x + t3, height / 2 + y + pdist),
				) > 50
			) {
				pg2.fill(0, 40);
			} else {
				pg2.fill(360, 40);
			}
			pg2.noStroke();
			pg2.circle(x, y, 2);
			let n = snoise(
				x * h3.pendulums[1].data.ns1,
				y * h3.pendulums[1].data.ns2,
				0,
			);
			h3.pendulums[1].r1 = map(n, -1, 1, 20, 300);
		}, 300);
		pg2.pop();
	}

	// Imprime Canvas 1
	// Con desplazamiento vertical
	push();
	translate(0, random(-200, 200));
	image(pg1, 0, 0);
	pop();

	// Imprime Canvas 2
	push();
	image(pg2, 0, 0);
	pop();

	// Cortar
	noSmooth();
	let min = random(5, 50);
	let max = random(60, 250);
	let posx = random(max * 2, width - max * 2);
	let posy = random(max * 2, height - max * 2);
	for (let i = 0; i < 50; i++) {
		if (random() < 0.5) {
			let im = get(
				0,
				posy + round(height / 2 + random(-min, min)) / 2,
				width,
				round(random(min, max)),
			);
			set(0, posy + round(height / 2 + random(-min, min)) / 2, im);
		} else {
			let im = get(
				posx + round(width / 2 + random(-min, min)) / 2,
				0,
				round(random(20, 150)),
				height,
			);
			set(posx + round(width / 2 + random(-min, min)) / 2, 0, im);
		}
	}

	// Aplica simetrias
	smooth();
	if (random() < 0.4) {
		if (random() < 0.4) {
			mirrorY();
			features["symmetry"] = "Y";
		} else if (random() < 0.8) {
			mirrorX();
			features["symmetry"] = "X";
		} else {
			features["symmetry"] = "XY";
			mirrorY();
			mirrorX();
		}
	} else {
		features["symmetry"] = "None";
	}

	// Cortar 2
	features["dislocation"] = "Single";
	if (random() < 0.15) {
		features["dislocation"] = "extra";
		noSmooth();
		for (let i = 0; i < 100; i++) {
			let a = random(TAU);
			let r = random(50, 400);
			let x = width / 2 + cos(a) * r;
			let y = height / 2 + sin(a) * r;
			let cs = map(dist(width / 2, height / 2, x, y), 50, 400, 40, 4);
			let im = get(x, y, round(cs), round(cs));
			let n = snoise(x * 0.01, y * 0.012, 0);
			a = a + map(n, -1, 1, -PI, PI);
			x = width / 2 + cos(a) * r;
			y = height / 2 + sin(a) * r;
			set(round(x), round(y), im);
		}
	}

	// Print
	// Vuelve a imprimir rotado o no
	// con fondo negro para evitar transparencias
	const all = get(0, 0, width, height);
	let rot = floor(random(2)) * PI;
	features["rot"] = "No";
	if (rot > 0) {
		features["rot"] = "Yes";
	}
	push();
	noStroke();
	fill(0);
	rect(0, 0, width, height);
	translate(width / 2, height / 2);
	rotate(rot);
	translate(-width / 2, -height / 2);
	image(all, 0, 0);
	pop();

	// Features
	window.$fxhashFeatures = {
		"Shape 1": features["shape1"],
		"Shape 2": features["shape2"],
		Symmetry: features["symmetry"],
		"Upside Down": features["rot"],
		Displacement: features["displacement"],
		Dislocation: features["dislocation"],
	};

	// Preview
	fxpreview();

	// End
	overlay.classList.add("rendered");
	overlay.addEventListener("transitionend", () => {
		overlay.style.display = "none";
	});
	setTimeout(function () {
		overlay.style.display = "none";
	}, 20000);

	document.title = `3ASF | Andr\u00e9s Senn | Dec / 2022`;
	console.log(
		`%c3ASF | Andr\u00e9s Senn | Dec/2022 | Code: https://github.com/andrusenn/es3pf`,
		"background:#333;border-radius:10px;background-size:15%;color:#eee;padding:10px;font-size:15px;text-align:center;",
	);
}
function mirrorY() {
	// Eje y
	let imiy = get(width / 2, 0, width / 2, height);
	push();
	translate(width / 2, 0);
	scale(-1, 1);
	image(imiy, 0, 0);
	pop();
}
function mirrorX() {
	// Eje x
	let imix = get(0, height / 2, width, height / 2);
	push();
	translate(0, height / 2);
	scale(1, -1);
	image(imix, 0, 0);
	pop();
}
function keyReleased() {
	switch (key) {
		case "1":
			doPD("1");
			break;
		case "2":
			doPD("2");
			break;
		case "3":
			doPD("3");
			break;
	}
	if (key == "s" || key == "S") {
		grabImage();
	}
}

function doubleClicked() {
	grabImage();
}
function doPD(n) {
	if (window.location.href.includes("?")) {
		if (window.location.href.includes("pd")) {
			window.location.href = window.location.href.replace(
				/pd\=(.)+/gi,
				"pd=" + encodeURI(n),
			);
		} else {
			window.location.href = window.location.href + "&pd=" + encodeURI(n);
		}
	} else {
		window.location.href = window.location.href + "?pd=" + encodeURI(n);
	}
}
function grabImage() {
	let file =
		fxhash.slice(2, 5) +
		"_" +
		fxhash.slice(-3) +
		"_" +
		width * pixelDensity() +
		"x" +
		height * pixelDensity() +
		".png";
	console.log(
		`%c SAVING ${
			String.fromCodePoint(0x1f5a4) + String.fromCodePoint(0x1f90d)
		}`,
		"background: #000; color: #ccc;padding:5px;font-size:15px",
	);
	saveCanvas(file);
}

class Harmonograph {
	constructor(p) {
		this.pendulums = p;
	}
	update(fn, laps = 10) {
		for (let j = 0; j < laps; j++) {
			let px = 0;
			let py = 0;
			this.pendulums.forEach((p, i) => {
				if (this.pendulums.length == 1) {
					if (typeof fn === "function") {
						fn(p.x, p.y, p, i);
					}
				} else if (i == 0) {
					// Primero
					p.update();
					px = p.x;
					py = p.y;
				} else {
					// Los siguientes toman como referencia el anterior
					p.update(px, py);
					if (typeof fn === "function") {
						fn(p.x, p.y, p);
					}
					px = p.x;
					py = p.y;
				}
			});
		}
	}
	addPendulum(p) {
		this.pendulums.push(p);
	}
	addData(d) {
		this.data = {
			...d,
		};
	}
}

class Pendulum {
	constructor(r1, r2, av) {
		this.cx = 0;
		this.cy = 0;
		this.av = av;
		this.r1 = r1;
		this.r2 = r2;
		this.x = 0;
		this.x = 0;
		this.ang = 0;
		this.data = {};
	}
	update(cx = null, cy = null) {
		if (typeof cx !== "null" && typeof cy !== "null") {
			this.cx = cx;
			this.cy = cy;
		}
		this.x = this.cx + Math.cos(this.ang) * this.r1;
		this.y = this.cy + Math.sin(this.ang) * this.r2;

		this.ang += this.av;
	}
	addData(d) {
		this.data = {
			...d,
		};
	}
}
