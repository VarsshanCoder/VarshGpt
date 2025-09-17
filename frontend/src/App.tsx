// src/App.tsx
import { useEffect, useRef, useState } from 'react';
import './styles/theme.css';
import './styles/chat.css';
import Header from './components/Header';
import ChatMessage from './components/ChatMessage';
import TypingIndicator from './components/TypingIndicator';
import InputBar from './components/InputBar';
import { streamChat, uploadAndAsk } from './api'; 

const username = 'I"m Varsh ';

export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [typing, setTyping] = useState(false);
  const [recording, setRecording] = useState(false);
  const mediaRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, typing]);

  async function handleSend(text: string, files: File[]) {
    // Image prompt fast path
    if (/^\/image\s+/i.test(text)) {
      const prompt = text.replace(/^\/image\s+/i, '');
      setMessages(prev => [...prev, { role: 'user', content: text }]);
      setTyping(true);
      const { url } = await generateImage(prompt);
      setTyping(false);
      setMessages(prev => [...prev, { role: 'assistant', content: `Here’s your image for: "${prompt}"`, images: [{ url }] }]);
      return;
    }

    // File analysis path
    if (files.length) {
      const form = new FormData();
      files.forEach(f => form.append('files', f));
      form.append('prompt', text || 'Analyze these files.');
      setMessages(prev => [...prev, { role: 'user', content: text || '(files attached)' }]);
      setTyping(true);
      const { answer } = await uploadAndAsk(form);
      setTyping(false);
      setMessages(prev => [...prev, { role: 'assistant', content: answer }]);
      await ttsSpeak(answer);
      return;
    }

    // Standard chat stream
    const userMsg: Message = { role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setTyping(true);
    let acc = '';
    await streamChat({ messages: [...messages, userMsg] }, (chunk) => {
      acc += chunk;
      setMessages(prev => {
        const base = prev.filter(m => m.role !== 'assistant' || m.content !== '__PENDING__');
        return [...base, { role: 'assistant', content: acc || '__PENDING__' }];
      });
    });
    setTyping(false);
    await ttsSpeak(acc);
  }

  async function handleVoiceStart() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mr = new MediaRecorder(stream, { mimeType: 'audio/webm' });
    mediaRef.current = mr;
    chunksRef.current = [];
    mr.ondataavailable = (e) => chunksRef.current.push(e.data);
    mr.onstop = async () => {
      const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
      const text = await transcribeAudio(blob);
      await handleSend(text, []);
    };
    mr.start();
    setRecording(true);
  }
  async function handleVoiceStop() {
    mediaRef.current?.stop();
    setRecording(false);
  }

  const idle = messages.length === 0 && !typing;

  return (
    <div className="container">
      <Header />

      {idle ? (
        <div className="greeting">
          <h1>Hello{username ? `, ${username}` : ''}. How can I help you today?</h1>
          <p>Ready to assist—from quick answers to generating images. Let’s get started.</p>
        </div>
      ) : null}

      <div className="chat" ref={chatRef} aria-live="polite">
        {messages.map((m, i) => (
          <ChatMessage key={i} role={m.role} content={m.content} images={m.images} />
        ))}
        {typing && (
          <div className="msg assistant">
            <div className="avatar" />
            <div className="bubble"><TypingIndicator /></div>
          </div>
        )}
      </div>

      <InputBar
        onSend={handleSend}
        onVoiceStart={handleVoiceStart}
        onVoiceStop={handleVoiceStop}
        isRecording={recording}
      />
    </div>
  );
}