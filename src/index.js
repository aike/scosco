
import { Renderer, Stave, StaveNote, StaveConnector, Formatter } from 'vexflow';

// DOMにdiv作成
const div = document.createElement('div');
document.body.appendChild(div);

// SVGレンダラ
const renderer = new Renderer(div, Renderer.Backends.SVG);
renderer.resize(200, 250);
const context = renderer.getContext();
const svgContainer = context.svg; // SVG DOM取得

// === MIDI番号に変換する関数 ===
function noteToMidi(noteStr) {
  const [noteRaw, octaveStr] = noteStr.toLowerCase().split('/');
  const noteNames = { c: 0, d: 2, e: 4, f: 5, g: 7, a: 9, b: 11 };
  const step = noteRaw[0];
  const accidental = noteRaw.slice(1);
  const semitone = noteNames[step] + (accidental === '#' ? 1 : accidental === 'b' ? -1 : 0);
  const octave = parseInt(octaveStr);
  return 12 * (octave + 1) + semitone;
}

function midiToNote(noteNo) {
  const noteStrings = ['c', 'c#', 'd', 'd#', 'e', 'f', 'f#', 'g', 'g#', 'a', 'a#', 'b'];
  const rounded = Math.round(noteNo);
  const note = noteStrings[rounded % 12];
  const octave = Math.floor(rounded / 12) - 1;
  return note + '/' + octave;
}

function drawNotes(noteName) {
  console.log(noteName);
  const noteNo = noteToMidi(noteName);

  // SVG内をすべて消す（音符・五線譜すべて）
  while (svgContainer.firstChild) {
    svgContainer.removeChild(svgContainer.firstChild);
  }

  // 五線譜再作成
  const stave = new Stave(10, 40, 100);
  stave.addClef('treble').setContext(context).draw();

  // === ヘ音記号 五線 ===
  const bassStave = new Stave(10, 120, 100);
  bassStave.addClef('bass').setContext(context).draw();

  // 括線（ピアノ譜っぽく）
  //new StaveConnector(stave, bassStave).setType(3).setContext(context).draw(); // BRACE
  //new StaveConnector(stave, bassStave).setType(1).setContext(context).draw(); // SINGLE

  // 新しい音符を描画
  const note = new StaveNote({ keys: [noteName], duration: 'w' });

  if (noteNo >= noteToMidi("c/4")) {
    Formatter.FormatAndDraw(context, stave, [note]);
  } else {
    console.log("notename=" + noteName);
    const newNoteName = midiToNote(noteNo + 21);
    console.log("newnotename=" + newNoteName);
    const bnote = new StaveNote({ keys: [newNoteName], duration: 'w' });
    Formatter.FormatAndDraw(context, bassStave, [bnote]);
  }
}

// 初期描画（C4〜F4）
drawNotes('c/4');

// 3秒後に音符を差し替え（G4〜B4）
setInterval(() => {
  // 音階からランダムに1つ選ぶ
  const pitches = ['c/3', 'd/3', 'e/3', 'f/3', 'g/3', 'a/3', 'b/3',
                   'c/4', 'd/4', 'e/4', 'f/4', 'g/4', 'a/4', 'b/4', 'c/5'];
  const pitch = pitches[Math.floor(Math.random() * pitches.length)];
  drawNotes(pitch);
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