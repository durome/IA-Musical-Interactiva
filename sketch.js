let estados = ["calma", "contemplacion", "exploracion", "tension"];
let estadoActual = "calma";
let sonidos = [];
let filtro, delay, reverb;
let tiempoUltimoCambio = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  background(0);
  textAlign(CENTER, CENTER);
  textSize(22);
  fill(255);
  text("🌀 Cargando IA sonora emocional...", width/2, height/2);

  // Inicializar motor sonoro
  userStartAudio();

  filtro = new p5.LowPass();
  delay = new p5.Delay();
  reverb = new p5.Reverb();

  // Cargar varios osciladores como voces
  for (let i = 0; i < 5; i++) {
    let osc = new p5.Oscillator();
    osc.setType(random(["sine", "triangle", "sawtooth"]));
    osc.disconnect();
    osc.connect(filtro);
    osc.amp(0);
    osc.start();
    sonidos.push(osc);
  }

  delay.process(filtro, 0.4, 0.5, 2300);
  reverb.process(filtro, 6, 0.8);

  setInterval(generarExpresion, 800);
}

function draw() {
  background(0, 20);
  fill(map(frameCount % 360, 0, 360, 100, 255), 100, 255);
  ellipse(width/2, height/2, 200 + sin(frameCount * 0.02) * 100);
  fill(255);
  text(`🎶 Estado: ${estadoActual}`, width/2, height/2 + 200);
}

function generarExpresion() {
  if (millis() - tiempoUltimoCambio > random(10000, 20000)) {
    estadoActual = random(estados);
    tiempoUltimoCambio = millis();
  }

  let baseFreq = random([110, 220, 330, 440]);
  let escala = [];

  switch (estadoActual) {
    case "calma":
      escala = [0, 3, 7, 10, 12];
      filtro.freq(800);
      delay.feedback(0.3);
      break;
    case "contemplacion":
      escala = [0, 2, 5, 9, 12];
      filtro.freq(1200);
      delay.feedback(0.5);
      break;
    case "exploracion":
      escala = [0, 4, 7, 11, 14];
      filtro.freq(2500);
      delay.feedback(0.6);
      break;
    case "tension":
      escala = [0, 1, 5, 6, 10];
      filtro.freq(4000);
      delay.feedback(0.8);
      break;
  }

  // Acorde principal
  for (let i = 0; i < sonidos.length; i++) {
    let freq = baseFreq * pow(2, escala[i % escala.length] / 12);
    let amp = map(i, 0, sonidos.length, 0.2, 0.05);
    sonidos[i].freq(freq);
    sonidos[i].amp(amp, 0.5);
  }

  // Melodía espontánea
  let mel = new p5.Oscillator("triangle");
  mel.freq(baseFreq * pow(2, random(escala) / 12));
  mel.amp(random(0.05, 0.15));
  mel.disconnect();
  mel.connect(filtro);
  mel.start();
  mel.stop(random(0.5, 2));

  // Percusión suave (ruido con envolvente)
  if (random() > 0.6) {
    let noise = new p5.Noise("brown");
    let env = new p5.Envelope(0.01, 0.2, 0.1, 0.05);
    noise.disconnect();
    noise.connect(filtro);
    noise.start();
    env.play(noise);
    noise.stop(0.3);
  }
}

