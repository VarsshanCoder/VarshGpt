// src/components/Suggestions.tsx
type Props = { prefix: string; onPick: (s: string) => void };
const BANK = [
  'Creative',
  'Futuristic',
  'Image',
  'Summarize file',
  'Explain like I’m 5',
  'Brainstorm',
  'Write code',
  'Generate UI copy',
];

export default function Suggestions({ prefix, onPick }: Props) {
  const show = prefix.trim().length > 0;
  if (!show) return null;
  const first = prefix.trim().split(/\s+/)[0].toLowerCase();
  const filtered = BANK.filter(s =>
    s.toLowerCase().includes(first) || ['hello', 'create', 'make', 'design'].includes(first)
  ).slice(0, 6);
  return (
    <div className="suggestions">
      {filtered.map(s => (
        <button key={s} className="pill" onClick={() => onPick(s)}>{s}</button>
      ))}
    </div>
  );
}