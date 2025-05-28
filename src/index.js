
import { Renderer, Stave, StaveNote, StaveConnector, Formatter, Accidental } from 'vexflow';
import * as Pitchfinder from "pitchfinder";

// DOMにdiv作成
const div = document.querySelector("#score");
const textDiv1 = document.querySelector("#notename");
const textDiv2 = document.querySelector("#accidental");

// SVGレンダラ
const renderer = new Renderer(div, Renderer.Backends.SVG);
renderer.resize(200, 250);
const context = renderer.getContext();
const svgContainer = context.svg; // SVG DOM取得

function frequencyToNote(freq) {
  const noteStrings = ['c', 'c#', 'd', 'eb', 'e', 'f', 'f#', 'g', 'g#', 'a', 'bb', 'b'];
  const num = 12 * (Math.log(freq/440)/Math.log(2)) + 69;
  const r = Math.round(num);
  const note = noteStrings[r % 12];
  const octave = Math.floor(r/12) - 1;
  return `${note}/${octave}`;
}

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
  const noteStrings = ['c', 'c#', 'd', 'eb', 'e', 'f', 'f#', 'g', 'g#', 'a', 'bb', 'b'];
  const rounded = Math.round(noteNo);
  const note = noteStrings[rounded % 12];
  const octave = Math.floor(rounded / 12) - 1;
  return note + '/' + octave;
}

function drawNote(noteName) {
  const margin = { c: 10, d: 2, e: 0, f: 8, g: 15, a: 5, b: 0 };
  const accidentalMatch = noteName.match(/[a-g](#|b)/i);
  const accidental = accidentalMatch ? ((accidentalMatch[1] === "#") ? '♯' : '♭') : "";
  textDiv1.textContent = noteName[0].toUpperCase();
  textDiv2.style.paddingLeft = margin[noteName[0].toLowerCase()] + 'px';
  textDiv2.textContent = accidental;
}

function drawScore(noteName) {
  //console.log("drawScore:" + noteName);
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


  // === accidental（#やb）を検出 ===
  const accidentalMatch = noteName.match(/[a-g](#|b)/i);
  const accidental = accidentalMatch ? accidentalMatch[1] : "";

  //console.log("noteno: " + noteNo + ", " + noteToMidi("c/4"));
  
  if (noteNo < noteToMidi("c/4")) {
    let oct = parseInt(noteName.split('/')[1], 10);
    let note = "";
    switch (noteName[0]) {
      case 'c': note = 'a'; oct += 1; break;
      case 'd': note = 'b'; oct += 1; break;
      case 'e': note = 'c'; oct += 2; break;
      case 'f': note = 'd'; oct += 2; break;
      case 'g': note = 'e'; oct += 2; break;
      case 'a': note = 'f'; oct += 2; break;
      case 'b': note = 'g'; oct += 2; break;
      default: break;
    }
    // console.log("noteconv: " + noteName + " -> " + (note + accidental + '/' + oct));
    noteName = note + accidental + '/' + oct;
  }

  // 新しい音符を生成
  const note = new StaveNote({ keys: [noteName], duration: 'w' });
  // === 必要なら臨時記号を追加 ===
  if (accidental) {
    note.addModifier(new Accidental(accidental));
  }

  if (noteNo >= noteToMidi("c/4")) {
    Formatter.FormatAndDraw(context, stave, [note]);
  } else {
    Formatter.FormatAndDraw(context, bassStave, [note]);
  }
}

// 初期描画（C4〜F4）
//drawNotes('c/4');

// 3秒後に音符を差し替え（G4〜B4）
/*
setInterval(() => {
  // 音階からランダムに1つ選ぶ
  const pitches = ['c/3', 'c#/3', 'd/3', 'e/3', 'f/3', 'f#/3', 'g/3', 'a/3', 'bb/3','b/3',
                   'c/4', 'c#/4', 'd/4', 'e/4', 'f/4', 'f#/4', 'g/4', 'a/4', 'bb/4', 'b/4', 'c/5'];
  const pitch = pitches[Math.floor(Math.random() * pitches.length)];
  drawNotes(pitch);
}, 3000);
*/

let currentPitch = 0;
/*
setInterval(() => {
  // 音階からランダムに1つ選ぶ
  const pitches = ['c/3', 'c#/3', 'd/3', 'eb/3', 'e/3', 'f/3', 'f#/3', 'g/3', 'g#/3', 'a/3', 'bb/3','b/3',
                   'c/4', 'c#/4', 'd/4', 'eb/4', 'e/4', 'f/4', 'f#/4', 'g/4', 'g#/4', 'a/4', 'bb/4','b/4', 'c/5'];
  const pitch = pitches[currentPitch];
  currentPitch = (currentPitch + 1) % pitches.length;
  drawNote(pitch);
  drawScore(pitch);
}, 3000);
*/

/*
setInterval(() => {
  // 音階からランダムに1つ選ぶ
  const pitches = [130.81, 138.59, 146.83, 155.56, 164.81, 174.61, 184.99, 195.99, 207.65, 220.00, 233.08, 246.94, 
                   261.62, 277.18, 293.66, 311.12, 329.62, 349.22, 369.99, 391.99, 415.30, 440.00, 466.16, 493.88, 523.25];
  const pitch = pitches[currentPitch];
  currentPitch = (currentPitch + 1) % pitches.length;
  const noteName = frequencyToNote(pitch);
  console.log(pitch, noteName);
  drawNote(noteName);
  drawScore(noteName);
}, 3000);
*/

const detectPitch = Pitchfinder.AMDF();


let audioCtx, sourceNode, workletNode;
let currentBuffer = null;   // AudioBuffer
let writeIndex = 0;         // 次に書き込む位置
const BUFFER_SIZE = 4096;   // 固定長

async function startRecording() {
  document.getElementById('startBtn').style.display = 'none';

  audioCtx = new AudioContext();
  if (audioCtx.state === 'suspended') await audioCtx.resume();

  // AudioWorklet モジュールをロード
  await audioCtx.audioWorklet.addModule('recorder-processor.js');

  // マイク入力
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  sourceNode = audioCtx.createMediaStreamSource(stream);

  // WorkletNode セットアップ
  workletNode = new AudioWorkletNode(audioCtx, 'recorder-processor');
  workletNode.port.onmessage = (event) => {
    const chunk = event.data[0]; // [Float32Array, Float32Array, ...]

    // 初回受信で固定長バッファを作成
    if (!currentBuffer) {
      currentBuffer = audioCtx.createBuffer(
        1,
        BUFFER_SIZE,
        audioCtx.sampleRate
      );
      // 全体を 0 で初期化（念のため）
      const data = currentBuffer.getChannelData(0);
      data.fill(0);
      writeIndex = 0;
    }

    // 各チャンネルを循環書き込み
    const buf = currentBuffer.getChannelData(0);
    for (let i = 0; i < chunk.length; i++) {
      if (writeIndex + i >= BUFFER_SIZE) {
        break;
      }
      buf[writeIndex + i] = chunk[i];
    }
    writeIndex += chunk.length;
    if (writeIndex >= BUFFER_SIZE) {
      writeIndex = 0; // 循環書き込み
      const pitch = detectPitch(currentBuffer.getChannelData(0));
      //console.log(pitch);
      if (pitch) {
        const noteName = frequencyToNote(pitch);
        //console.log(pitch, noteName);
        drawNote(noteName);
        drawScore(noteName);
      }  
    }
  };

  // グラフ接続
  sourceNode.connect(workletNode);
  workletNode.connect(audioCtx.destination);
}

document.getElementById('startBtn').addEventListener('click', startRecording);

