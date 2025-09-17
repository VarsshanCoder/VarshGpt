// src/components/TypingIndicator.tsx
export default function TypingIndicator() {
    return (
      <span className="typing" aria-live="polite" aria-label="Assistant is typing">
        <span className="dot" /><span className="dot" /><span className="dot" />
      </span>
    );
  }