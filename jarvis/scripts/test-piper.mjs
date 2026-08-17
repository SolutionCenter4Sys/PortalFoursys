import net from "net";

const url = process.argv[2] || "tcp://localhost:10200";
const text = process.argv[3] || "Olá Jarvis";
const [, host, port] = url.match(/^tcp:\/\/([^:]+):(\d+)$/) ?? [];

if (!host || !port) {
  console.error("Usage: node test-piper.mjs tcp://host:port [text]");
  process.exit(1);
}

const socket = net.connect(Number(port), host);
let buffer = "";
const sizes = [];

socket.on("connect", () => {
  console.log("connected tcp", host, port);
  socket.write(
    `${JSON.stringify({ type: "synthesize", version: "1.0", data: { text } })}\n`,
  );
});

socket.on("data", (data) => {
  buffer += data.toString();
  const lines = buffer.split("\n");
  buffer = lines.pop() ?? "";
  for (const line of lines) {
    if (!line.trim()) continue;
    const msg = JSON.parse(line);
    console.log("msg:", msg.type);
    if (msg.type === "audio-chunk" && msg.data?.audio) {
      sizes.push(Buffer.from(msg.data.audio, "base64").length);
    }
    if (msg.type === "audio-stop") {
      console.log("done bytes:", sizes.reduce((a, b) => a + b, 0));
      socket.end();
      process.exit(0);
    }
    if (msg.type === "error") {
      console.error(msg);
      process.exit(1);
    }
  }
});

socket.on("error", (e) => {
  console.error("tcp error", e.message);
  process.exit(1);
});

setTimeout(() => {
  console.error("timeout");
  process.exit(1);
}, 20000);
