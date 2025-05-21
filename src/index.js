
import { Renderer, Stave, StaveNote, Formatter } from 'vexflow';

// DOMにdiv作成
const div = document.createElement('div');
document.body.appendChild(div);

// SVGレンダラ
const renderer = new Renderer(div, Renderer.Backends.SVG);
renderer.resize(200, 250);
const context = renderer.getContext();
const svgContainer = context.svg; // SVG DOM取得

function drawNotes(noteNames) {
  // SVG内をすべて消す（音符・五線譜すべて）
  while (svgContainer.firstChild) {
    svgContainer.removeChild(svgContainer.firstChild);
  }

  // 五線譜再作成
  const stave = new Stave(10, 40, 100);
  stave.addClef('treble').setContext(context).draw();

  // === ヘ音記号 五線 ===
  const bassStave = new Stave(10, 140, 100);
  bassStave.addClef('bass').setContext(context).draw();

  // 新しい音符を描画
  const notes = noteNames.map(n =>
    new StaveNote({ keys: [n], duration: 'w' })
  );
  Formatter.FormatAndDraw(context, stave, notes);
  Formatter.FormatAndDraw(context, bassStave, []);
}

// 初期描画（C4〜F4）
drawNotes(['c/4']);

// 3秒後に音符を差し替え（G4〜B4）
setInterval(() => {
  // 音階からランダムに1つ選ぶ
  const pitches = ['c/4', 'd/4', 'e/4', 'f/4', 'g/4', 'a/4', 'b/4', 'c/5'];
  const pitch = pitches[Math.floor(Math.random() * pitches.length)];
  drawNotes([pitch]);
}, 3000);



/*
import { Renderer, Stave, StaveNote, Voice, Formatter } from 'vexflow';

// DOMにSVG描画領域を作成
const div = document.createElement('div');
document.body.appendChild(div);

// Create an SVG renderer and attach it to the DIV element named "output".
const renderer = new Renderer(div, Renderer.Backends.SVG);

// Configure the rendering context.
renderer.resize(500, 500);
const context = renderer.getContext();

// Create a stave of width 400 at position 10, 40 on the canvas.
const stave = new Stave(10, 40, 400);

// Add a clef and time signature.
stave.addClef("treble").addTimeSignature("4/4");

// Connect it to the rendering context and draw!
stave.setContext(context).draw();

// Create the notes
const notes = [
    // A quarter-note C.
    new StaveNote({ keys: ["c/4"], duration: "q" }),

    // A quarter-note D.
    new StaveNote({ keys: ["d/4"], duration: "q" }),

    // A quarter-note rest. Note that the key (b/4) specifies the vertical
    // position of the rest.
    new StaveNote({ keys: ["b/4"], duration: "qr" }),

    // A C-Major chord.
    new StaveNote({ keys: ["c/4", "e/4", "g/4"], duration: "q" }),
];

// Create a voice in 4/4 and add above notes
const voice = new Voice({ num_beats: 4, beat_value: 4 });
voice.addTickables(notes);

// Format and justify the notes to 400 pixels.
new Formatter().joinVoices([voice]).format([voice], 350);

// Render voice
voice.draw(context, stave);
*/
/*
const renderer = new Renderer(div, Renderer.Backends.SVG);
renderer.resize(500, 250);
const context = renderer.getContext();

// === ト音記号 五線 ===
const trebleStave = new Stave(10, 40, 200);
trebleStave.addClef('treble').setContext(context).draw();

// === ヘ音記号 五線 ===
const bassStave = new Stave(10, 140, 200);
bassStave.addClef('bass').setContext(context).draw();

// === ト音記号の音符 ===
const trebleNotes = [
  new StaveNote({ keys: ['c/4'], duration: 'q' }),
  new StaveNote({ keys: ['d/4'], duration: 'q' }),
];

// === ヘ音記号の音符 ===
const bassNotes = [
  new StaveNote({ keys: ['c/4'], duration: 'q' }),
  new StaveNote({ keys: ['d/4'], duration: 'q' }),
];

// === フォーマットして描画 ===
Formatter.FormatAndDraw(context, trebleStave, trebleNotes);
Formatter.FormatAndDraw(context, bassStave, bassNotes);
*/
/*
// === 括線（ピアノ譜らしさ） ===
const brace = new StaveConnector(trebleStave, bassStave);
brace.setType(StaveConnector.type.BRACE);
brace.setContext(context);
brace.draw();

// 左線（縦棒）
const lineLeft = new StaveConnector(trebleStave, bassStave);
lineLeft.setType(StaveConnector.type.SINGLE);
lineLeft.setContext(context);
lineLeft.draw();

// 小節線（右側）
const lineRight = new StaveConnector(trebleStave, bassStave);
lineRight.setType(StaveConnector.type.SINGLE_RIGHT);
lineRight.setContext(context);
lineRight.draw();
*/