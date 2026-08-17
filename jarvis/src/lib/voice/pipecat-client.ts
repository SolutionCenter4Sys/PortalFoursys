/**
 * Cliente Pipecat WebSocket — E3 Fase B (streaming full-duplex).
 *
 * ⚠️ EXPERIMENTAL. Assume que o servidor Pipecat usa serializer de ÁUDIO RAW
 * (PCM16 mono 16 kHz binário). Se o bot.py usar ProtobufFrameSerializer,
 * este cliente precisa adotar o mesmo protobuf — ver PIPECAT-SPIKE-BRIEF.md.
 *
 * Fluxo:
 *   mic → AudioWorklet (PCM16 16kHz) → WS binário → Pipecat
 *   Pipecat → WS binário (PCM16) → AudioContext playback
 *
 * Barge-in: quando o usuário fala durante o playback do bot, o Pipecat
 * (enable_interruptions) para de enviar áudio; o callback onInterruption dispara.
 */

const SAMPLE_RATE = 16_000;

export type PipecatClientState =
  | "idle"
  | "connecting"
  | "listening"
  | "bot-speaking"
  | "error"
  | "closed";

export type PipecatClientCallbacks = {
  onStateChange?: (state: PipecatClientState) => void;
  onInterruption?: () => void;
  onError?: (err: Error) => void;
  onClose?: () => void;
};

export class PipecatClient {
  private ws: WebSocket | null = null;
  private audioCtx: AudioContext | null = null;
  private micStream: MediaStream | null = null;
  private workletNode: AudioWorkletNode | null = null;
  private playbackTime = 0;
  private botSpeaking = false;
  private state: PipecatClientState = "idle";

  constructor(
    private readonly url: string,
    private readonly cb: PipecatClientCallbacks = {},
  ) {}

  private setState(s: PipecatClientState) {
    this.state = s;
    this.cb.onStateChange?.(s);
  }

  getState(): PipecatClientState {
    return this.state;
  }

  async connect(): Promise<void> {
    this.setState("connecting");

    this.audioCtx = new AudioContext({ sampleRate: SAMPLE_RATE });
    await this.audioCtx.audioWorklet.addModule("/pipecat-audio-worklet.js");

    this.micStream = await navigator.mediaDevices.getUserMedia({
      audio: {
        channelCount: 1,
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
      },
    });

    this.ws = new WebSocket(this.url);
    this.ws.binaryType = "arraybuffer";

    this.ws.onopen = () => {
      this.startCapture();
      this.setState("listening");
    };

    this.ws.onmessage = (event) => {
      if (event.data instanceof ArrayBuffer) {
        this.handleBotAudio(event.data);
      }
    };

    this.ws.onerror = () => {
      const err = new Error("Erro na conexão Pipecat WebSocket");
      this.cb.onError?.(err);
      this.setState("error");
    };

    this.ws.onclose = () => {
      this.setState("closed");
      this.cb.onClose?.();
    };
  }

  private startCapture() {
    if (!this.audioCtx || !this.micStream) return;
    const source = this.audioCtx.createMediaStreamSource(this.micStream);
    this.workletNode = new AudioWorkletNode(this.audioCtx, "pcm-capture-processor");

    this.workletNode.port.onmessage = (e: MessageEvent<ArrayBuffer>) => {
      // Barge-in: usuário falou enquanto bot falava
      if (this.botSpeaking) {
        this.botSpeaking = false;
        this.cb.onInterruption?.();
        this.setState("listening");
      }
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.ws.send(e.data);
      }
    };

    source.connect(this.workletNode);
    // Não conecta ao destino — evita eco local
  }

  private handleBotAudio(data: ArrayBuffer) {
    if (!this.audioCtx) return;
    if (!this.botSpeaking) {
      this.botSpeaking = true;
      this.setState("bot-speaking");
    }

    const pcm = new Int16Array(data);
    const float = new Float32Array(pcm.length);
    for (let i = 0; i < pcm.length; i++) {
      float[i] = pcm[i] / 0x8000;
    }

    const buffer = this.audioCtx.createBuffer(1, float.length, SAMPLE_RATE);
    buffer.copyToChannel(float, 0);

    const src = this.audioCtx.createBufferSource();
    src.buffer = buffer;
    src.connect(this.audioCtx.destination);

    const now = this.audioCtx.currentTime;
    if (this.playbackTime < now) this.playbackTime = now;
    src.start(this.playbackTime);
    this.playbackTime += buffer.duration;

    src.onended = () => {
      if (this.playbackTime <= (this.audioCtx?.currentTime ?? 0) + 0.05) {
        this.botSpeaking = false;
        if (this.state === "bot-speaking") this.setState("listening");
      }
    };
  }

  disconnect() {
    this.workletNode?.port.close();
    this.workletNode?.disconnect();
    this.workletNode = null;

    this.micStream?.getTracks().forEach((t) => t.stop());
    this.micStream = null;

    if (this.ws && this.ws.readyState <= WebSocket.OPEN) this.ws.close();
    this.ws = null;

    void this.audioCtx?.close();
    this.audioCtx = null;

    this.setState("closed");
  }
}
