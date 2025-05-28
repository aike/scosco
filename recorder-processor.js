// AudioWorkletProcessor 側のコード
class RecorderProcessor extends AudioWorkletProcessor {
  process(inputs) {
    const input = inputs[0];
    if (input.length > 0) {
      // 各チャンネルの Float32Array をコピーしてポスト
      const copied = input.map(channelData => new Float32Array(channelData));
      this.port.postMessage(copied);
    }
    // true を返すとノードを継続して処理
    return true;
  }
}

registerProcessor('recorder-processor', RecorderProcessor);
