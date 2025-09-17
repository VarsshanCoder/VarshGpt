// src/components/InputBar.tsx
import { useEffect, useRef, useState } from 'react';
import Suggestions from './Suggestions';

type Props = {
  onSend: (text: string, files: File[]) => void;
  onVoiceStart: () => void;
  onVoiceStop: () => void;
  isRecording: boolean;
};

export default function InputBar({ onSend, onVoiceStart, onVoiceStop, isRecording }: Props) {
  const [value, setValue] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const taRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const ta = taRef.current;
    if (!ta) return;
    ta.style.height = '0px';
    ta.style.height = Math.min(180, ta.scrollHeight) + 'px';
  }, [value]);

  return (
    <div className="inputDock">
      <div className="inputWrap">
        <button
          className="iconBtn"
          title={isRecording ? 'Stop voice' : 'Voice'}
          onClick={() => (isRecording ? onVoiceStop() : onVoiceStart())}
        >
          {isRecording ? '■' : '🎙️'}
        </button>

        <button className="iconBtn" title="Insert image" onClick={() => document.getElementById('image-input')?.click()}>
          🖼️
        </button>
        <input id="image-input" type="file" accept="image/*" hidden onChange={(e) => {
          if (e.target.files) setFiles(prev => [...prev, ...Array.from(e.target.files!)]);
        }} />

        <button className="iconBtn" title="Attach files" onClick={() => document.getElementById('file-input')?.click()}>
          📎
        </button>
        <input id="file-input" type="file" multiple hidden onChange={(e) => {
          if (e.target.files) setFiles(prev => [...prev, ...Array.from(e.target.files!)]);
        }} />

        <textarea
          ref={taRef}
          className="textarea"
          placeholder="Ask me anything..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              if (value.trim() || files.length) {
                onSend(value.trim(), files);
                setValue(''); setFiles([]);
              }
            }
          }}
        />

        <button
          className="iconBtn primary"
          title="Send"
          onClick={() => {
            if (value.trim() || files.length) {
              onSend(value.trim(), files);
              setValue(''); setFiles([]);
            }
          }}
        >
          ➤
        </button>
      </div>
      <Suggestions prefix={value} onPick={(s) => {
        const parts = value.trim().split(/\s+/).filter(Boolean);
        const base = parts.length ? parts[0] : '';
        const merged = [base, s].filter(Boolean).join(' ') + ' ';
        // If no base, just append suggestion
        const final = base ? merged : (s + ' ');
        // Set value
        // @ts-ignore
        setValue(final);
      }} />
    </div>
  );
}