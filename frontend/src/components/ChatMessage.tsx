import { useState } from 'react';

export default function ChatMessage({ role, content }) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const renderContent = () => {
    const codeRegex = /```(\w+)?\n([\s\S]*?)```/g;
    const parts = [];
    let lastIndex = 0;
    let match;
    let codeIndex = 0;

    while ((match = codeRegex.exec(content)) !== null) {
      const before = content.slice(lastIndex, match.index).trim();
      if (before) parts.push(<p key={`text-${lastIndex}`}>{before}</p>);

      const lang = match[1] || '';
      const code = match[2];
      parts.push(
        <pre key={`code-${codeIndex}`}>
          <button
            className="copy-btn"
            onClick={() => {
              navigator.clipboard.writeText(code);
              setCopiedIndex(codeIndex);
              setTimeout(() => setCopiedIndex(null), 1500);
            }}
          >
            {copiedIndex === codeIndex ? 'Copied!' : 'Copy'}
          </button>
          <code className={`language-${lang}`}>{code}</code>
        </pre>
      );
      lastIndex = match.index + match[0].length;
      codeIndex++;
    }

    const after = content.slice(lastIndex).trim();
    if (after) parts.push(<p key="after">{after}</p>);
    return parts;
  };

  return (
    <div className={`msg ${role}`}>
      <div className="bubble">{renderContent()}</div>
    </div>
  );
}