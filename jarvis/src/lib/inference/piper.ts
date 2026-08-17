import net from "net";

import { inferenceConfig } from "./config";

type WyomingHeader = {
  type: string;
  version?: string;
  data_length?: number;
  payload_length?: number;
};

type WyomingData = {
  text?: string;
  message?: string;
  rate?: number;
  width?: number;
  channels?: number;
  timestamp?: number | null;
};

function parseWyomingUrl(url: string): { host: string; port: number } {
  const tcp = url.match(/^tcp:\/\/([^:/]+):(\d+)$/);
  if (tcp) {
    return { host: tcp[1], port: Number(tcp[2]) };
  }
  throw new Error("PIPER_WYOMING_URL must be tcp://host:port");
}

function pcmToWav(
  pcm: Buffer,
  sampleRate: number,
  channels: number,
  bitsPerSample: number,
): Buffer {
  const byteRate = (sampleRate * channels * bitsPerSample) / 8;
  const blockAlign = (channels * bitsPerSample) / 8;
  const header = Buffer.alloc(44);

  header.write("RIFF", 0);
  header.writeUInt32LE(36 + pcm.length, 4);
  header.write("WAVE", 8);
  header.write("fmt ", 12);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20);
  header.writeUInt16LE(channels, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(byteRate, 28);
  header.writeUInt16LE(blockAlign, 32);
  header.writeUInt16LE(bitsPerSample, 34);
  header.write("data", 36);
  header.writeUInt32LE(pcm.length, 40);

  return Buffer.concat([header, pcm]);
}

function writeWyomingEvent(
  socket: net.Socket,
  type: string,
  data: WyomingData,
  payload?: Buffer,
) {
  const dataJson = Buffer.from(JSON.stringify(data), "utf8");
  const header = {
    type,
    version: "1.0.0",
    data_length: dataJson.length,
    payload_length: payload?.length ?? 0,
  };
  socket.write(`${JSON.stringify(header)}\n`);
  socket.write(dataJson);
  if (payload && payload.length > 0) {
    socket.write(payload);
  }
}

async function readWyomingEvents(
  socket: net.Socket,
  onEvent: (
    header: WyomingHeader,
    data: WyomingData,
    payload: Buffer | null,
  ) => "continue" | "done",
): Promise<void> {
  let buffer = Buffer.alloc(0);

  return new Promise((resolve, reject) => {
    const processBuffer = () => {
      while (true) {
        const newlineIdx = buffer.indexOf("\n");
        if (newlineIdx === -1) return;

        const headerLine = buffer.subarray(0, newlineIdx).toString("utf8");
        buffer = buffer.subarray(newlineIdx + 1);

        let header: WyomingHeader;
        try {
          header = JSON.parse(headerLine) as WyomingHeader;
        } catch {
          return reject(new Error(`Invalid Wyoming header: ${headerLine}`));
        }

        const dataLen = header.data_length ?? 0;
        const payloadLen = header.payload_length ?? 0;
        const needed = dataLen + payloadLen;

        if (buffer.length < needed) {
          buffer = Buffer.concat([
            Buffer.from(headerLine + "\n"),
            buffer,
          ]);
          return;
        }

        const dataJson = buffer.subarray(0, dataLen).toString("utf8");
        const payload =
          payloadLen > 0 ? buffer.subarray(dataLen, dataLen + payloadLen) : null;
        buffer = buffer.subarray(needed);

        let data: WyomingData = {};
        if (dataLen > 0) {
          try {
            data = JSON.parse(dataJson) as WyomingData;
          } catch {
            return reject(new Error(`Invalid Wyoming data for ${header.type}`));
          }
        }

        const status = onEvent(header, data, payload);
        if (status === "done") {
          resolve();
          return;
        }
      }
    };

    socket.on("data", (chunk) => {
      buffer = Buffer.concat([buffer, chunk]);
      try {
        processBuffer();
      } catch (err) {
        reject(err);
      }
    });

    socket.on("error", reject);
    socket.on("close", () => resolve());
  });
}

export async function synthesizeSpeech(text: string): Promise<Buffer> {
  const { host, port } = parseWyomingUrl(inferenceConfig.piperWyomingUrl);

  return new Promise((resolve, reject) => {
    const socket = net.connect({ host, port });
    const chunks: Buffer[] = [];
    const state = { sampleRate: 22050, channels: 1, width: 16 };
    let finished = false;

    const timeout = setTimeout(() => {
      socket.destroy();
      reject(new Error("Piper TTS timed out"));
    }, 45_000);

    socket.on("connect", () => {
      writeWyomingEvent(socket, "synthesize", { text });
    });

    readWyomingEvents(socket, (header, data, payload) => {
      if (header.type === "audio-start") {
        if (data.rate) state.sampleRate = data.rate;
        if (data.channels) state.channels = data.channels;
        if (data.width) state.width = data.width * 8;
      }

      if (header.type === "audio-chunk" && payload) {
        chunks.push(payload);
        if (data.rate) state.sampleRate = data.rate;
        if (data.channels) state.channels = data.channels;
        if (data.width) state.width = data.width * 8;
      }

      if (header.type === "audio-stop") {
        finished = true;
        clearTimeout(timeout);
        socket.end();
        const pcm = Buffer.concat(chunks);
        if (pcm.length === 0) {
          reject(new Error("Piper returned empty audio"));
        } else {
          resolve(
            pcmToWav(pcm, state.sampleRate, state.channels, state.width),
          );
        }
        return "done";
      }

      if (header.type === "error") {
        clearTimeout(timeout);
        socket.destroy();
        reject(new Error(data.message ?? "Piper synthesis error"));
        return "done";
      }

      return "continue";
    }).catch((err) => {
      if (!finished) {
        clearTimeout(timeout);
        reject(err);
      }
    });

    socket.on("close", () => {
      clearTimeout(timeout);
      if (!finished && chunks.length > 0) {
        finished = true;
        resolve(
          pcmToWav(
            Buffer.concat(chunks),
            state.sampleRate,
            state.channels,
            state.width,
          ),
        );
      }
    });
  });
}

export async function checkPiperHealth(): Promise<boolean> {
  const { host, port } = parseWyomingUrl(inferenceConfig.piperWyomingUrl);

  return new Promise((resolve) => {
    const socket = net.connect({ host, port });
    const timeout = setTimeout(() => {
      socket.destroy();
      resolve(false);
    }, 3_000);

    socket.on("connect", () => {
      clearTimeout(timeout);
      socket.end();
      resolve(true);
    });

    socket.on("error", () => {
      clearTimeout(timeout);
      resolve(false);
    });
  });
}
