import { useEffect, useState } from 'react';

export interface ToastMessage {
  id: string;
  text: string;
  type: 'success' | 'error' | 'warning' | 'default';
}

interface ToastProps {
  messages: ToastMessage[];
  onRemove: (id: string) => void;
}

function ToastItem({ msg, onRemove }: { msg: ToastMessage; onRemove: (id: string) => void }) {
  const [removing, setRemoving] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setRemoving(true), 2700);
    const t2 = setTimeout(() => onRemove(msg.id), 3000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [msg.id, onRemove]);

  return (
    <div className={`toast ${msg.type !== 'default' ? msg.type : ''} ${removing ? 'removing' : ''}`}>
      {msg.text}
    </div>
  );
}

export default function Toast({ messages, onRemove }: ToastProps) {
  return (
    <div className="toast-container">
      {messages.map(msg => (
        <ToastItem key={msg.id} msg={msg} onRemove={onRemove} />
      ))}
    </div>
  );
}
