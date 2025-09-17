// src/api.ts
export type Message = {
    role: 'user' | 'assistant';
    content: string;
    images?: { url: string; alt?: string }[];
  };
  
  
  const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8787';
  
  export async function streamChat(body: any, onToken: (chunk: string) => void) {
    const res = await fetch(`${API_BASE}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const reader = res.body?.getReader();
    const decoder = new TextDecoder();
    while (reader) {
      const { value, done } = await reader.read();
      if (done) break;
      const text = decoder.decode(value, { stream: true });
      onToken(text);
    }
  }
  
  export async function uploadAndAsk(form: FormData) {
    const res = await fetch(`${API_BASE}/file/analyze`, { method: 'POST', body: form });
    return res.json();
  }
  
  export async function transcribeAudio(blob: Blob) {
    const form = new FormData();
    form.append('audio', blob, 'voice.webm');
    const res = await fetch(`${API_BASE}/voice/transcribe`, { method: 'POST', body: form });
    const data = await res.json();
    return data.text as string;
  }
  
  export async function ttsSpeak(text: string) {
    const res = await fetch(`${API_BASE}/voice/tts`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });
    const buf = await res.arrayBuffer();
    const audio = new Audio(URL.createObjectURL(new Blob([buf], { type: 'audio/mpeg' })));
    await audio.play();
  }
  
  export async function generateImage(prompt: string) {
    const res = await fetch(`${API_BASE}/image`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });
    return res.json(); // { url }
  }