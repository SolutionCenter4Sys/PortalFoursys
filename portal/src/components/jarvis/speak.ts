import { playDataUrl, stopJarvisAudio, unlockJarvisAudio } from './audio-out'

function speakBrowser(text: string, lang: 'pt' | 'en'): Promise<void> {
  return new Promise((resolve) => {
    if (!window.speechSynthesis) {
      resolve()
      return
    }
    window.speechSynthesis.cancel()
    const u = new SpeechSynthesisUtterance(text)
    u.lang = lang === 'en' ? 'en-US' : 'pt-BR'
    u.rate = 1
    u.volume = 1
    u.onend = () => resolve()
    u.onerror = () => resolve()
    window.speechSynthesis.speak(u)
  })
}

/** TTS cloud via proxy /api/voice/speak → Web Audio (gesto já desbloqueado). */
export async function speakJarvis(text: string, lang: 'pt' | 'en'): Promise<void> {
  const clean = text.trim()
  if (!clean) return
  await unlockJarvisAudio()

  try {
    const res = await fetch('/api/voice/speak', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: clean.slice(0, 1200) }),
    })
    if (res.ok) {
      const data = (await res.json()) as {
        audioBase64?: string
        audioMimeType?: string
      }
      if (data.audioBase64 && data.audioMimeType) {
        const src = `data:${data.audioMimeType};base64,${data.audioBase64}`
        await playDataUrl(src)
        return
      }
    }
  } catch (err) {
    console.warn('[jarvis] cloud TTS play failed', err)
  }

  await speakBrowser(clean, lang)
}

export function stopSpeech() {
  stopJarvisAudio()
}

export { unlockJarvisAudio }
