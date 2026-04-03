import { useState, useEffect, useRef, useCallback } from 'react';
import type { InventoryItem, ItemCategory } from '../types';
import { generateId } from '../storage';

interface AddItemModalProps {
  onClose: () => void;
  onSave: (item: InventoryItem) => void;
}

const CATEGORIES: { id: ItemCategory; label: string }[] = [
  { id: 'dairy', label: '🥛 Dairy' },
  { id: 'grains', label: '🌾 Grains' },
  { id: 'veggies', label: '🥬 Veggies' },
  { id: 'kitchen', label: '🫙 Kitchen' },
  { id: 'home', label: '🧴 Home' },
  { id: 'other', label: '📦 Other' },
];

const UNITS = ['kg', 'g', 'L', 'ml', 'packets', 'pieces', 'bottles', 'dozen'];

const CATEGORY_ICONS: Record<ItemCategory, string> = {
  dairy: '🥛',
  grains: '🌾',
  veggies: '🥬',
  kitchen: '🫙',
  home: '🧴',
  other: '📦',
};

const CATEGORY_COLORS: Record<ItemCategory, string> = {
  dairy: '#D4E8C8',
  grains: '#C8D8E8',
  veggies: '#D4E8C8',
  kitchen: '#E8DFC8',
  home: '#D4E8C8',
  other: '#E8E0C8',
};

function parseSpeech(text: string): { name: string; qty: number; unit: string } {
  const lower = text.toLowerCase();
  const numMap: Record<string, number> = {
    ek: 1, do: 2, teen: 3, char: 4, paanch: 5,
    one: 1, two: 2, three: 3, four: 4, five: 5,
    six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
  };
  let qty = 1;
  let unit = 'kg';
  let name = text;

  const numMatch = lower.match(/\b(\d+(?:\.\d+)?)\b/);
  if (numMatch) qty = parseFloat(numMatch[1]);
  else {
    for (const [word, val] of Object.entries(numMap)) {
      if (lower.includes(word)) { qty = val; break; }
    }
  }

  const unitMap: Record<string, string> = {
    kilo: 'kg', kilogram: 'kg', kilograms: 'kg', kg: 'kg',
    gram: 'g', grams: 'g',
    litre: 'L', liter: 'L', litres: 'L', liters: 'L',
    ml: 'ml', millilitre: 'ml',
    packet: 'packets', packets: 'packets', pack: 'packets',
    piece: 'pieces', pieces: 'pieces',
    bottle: 'bottles', bottles: 'bottles',
  };

  for (const [word, u] of Object.entries(unitMap)) {
    if (lower.includes(word)) { unit = u; break; }
  }

  name = text
    .replace(/\b\d+(?:\.\d+)?\b/g, '')
    .replace(new RegExp(`\\b(${Object.keys({ ...numMap, ...unitMap }).join('|')})\\b`, 'gi'), '')
    .replace(/\s+/g, ' ')
    .trim();

  if (!name) name = 'New Item';
  return { name: name.charAt(0).toUpperCase() + name.slice(1), qty, unit };
}

export default function AddItemModal({ onClose, onSave }: AddItemModalProps) {
  const [name, setName] = useState('');
  const [qty, setQty] = useState(1);
  const [unit, setUnit] = useState('kg');
  const [category, setCategory] = useState<ItemCategory>('other');
  const [listening, setListening] = useState(false);
  const [speechText, setSpeechText] = useState('');
  const [qtyBumping, setQtyBumping] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);

  const bumpQty = useCallback((newQty: number) => {
    setQty(newQty);
    setQtyBumping(true);
    setTimeout(() => setQtyBumping(false), 200);
  }, []);

  useEffect(() => {
    return () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (recognitionRef.current as any)?.stop();
    };
  }, []);

  const handleMic = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) {
      alert('Voice input is not supported in this browser. Please use Chrome.');
      return;
    }

    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }

    const rec = new SR();
    rec.lang = 'hi-IN';
    rec.interimResults = false;
    rec.maxAlternatives = 1;
    recognitionRef.current = rec;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rec.onresult = (e: any) => {
      const transcript = e.results[0][0].transcript;
      setSpeechText(transcript);
      const parsed = parseSpeech(transcript);
      setName(parsed.name);
      setQty(parsed.qty);
      setUnit(parsed.unit);
    };

    rec.onerror = () => setListening(false);
    rec.onend = () => setListening(false);

    rec.start();
    setListening(true);
  };

  const handleSave = () => {
    if (!name.trim()) {
      alert('Kripya item ka naam darj karein / Please enter item name');
      return;
    }

    const status = qty === 0 ? 'finished' : qty < 1 ? 'low' : 'available';
    const newItem: InventoryItem = {
      id: generateId(),
      name: name.trim(),
      hindi: name.trim(),
      icon: CATEGORY_ICONS[category],
      iconBg: CATEGORY_COLORS[category],
      qty,
      unit,
      status,
      inShoppingList: status === 'finished' || status === 'low',
      category,
      bought: false,
      addedAt: new Date().toISOString(),
    };

    onSave(newItem);
  };

  return (
    <div
      className="modal-overlay"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="modal-sheet">
        <div className="modal-header">
          <button className="modal-close" onClick={onClose}>✕</button>
          <span className="modal-title">Add Item / Item Add Karein</span>
          <div style={{ width: 36 }} />
        </div>

        <div className="modal-body">
          {/* Voice Section */}
          <div className="mic-section">
            <button
              className={`mic-btn ${listening ? 'listening' : ''}`}
              onClick={handleMic}
              aria-label="Voice input"
            >
              🎤
            </button>
            <p className="mic-label">Speak to Add / Bol kar Add Karein</p>
            <p className="mic-hint">"2 kilos of Basmati Rice" or "Do kilo chawal"</p>
            {speechText && (
              <div className="speech-result">
                🎙️ "{speechText}"
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="modal-divider">
            <div className="modal-divider-line" />
            <span className="modal-divider-text">Ya Manually Bharein / Or Type Manually</span>
            <div className="modal-divider-line" />
          </div>

          {/* Item Name */}
          <div className="form-group">
            <label className="form-label">Item Name / Item ka Naam</label>
            <input
              className="form-input"
              placeholder="Enter item name..."
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>

          {/* Quantity Selector */}
          <div className="qty-card">
            <p className="qty-label">Set Quantity / Maatra Chunein</p>
            <div className="qty-controls">
              <button
                className="qty-btn"
                onClick={() => bumpQty(Math.max(0, parseFloat((qty - 0.5).toFixed(1))))}
              >
                −
              </button>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span className={`qty-display ${qtyBumping ? 'bump' : ''}`}>{qty}</span>
                <select
                  className="unit-select"
                  value={unit}
                  onChange={e => setUnit(e.target.value)}
                >
                  {UNITS.map(u => <option key={u} value={u}>{u} ▾</option>)}
                </select>
              </div>
              <button
                className="qty-btn"
                onClick={() => bumpQty(parseFloat((qty + 0.5).toFixed(1)))}
              >
                +
              </button>
            </div>
          </div>

          {/* Category */}
          <div className="form-group">
            <label className="form-label">Category / Vibhaag</label>
            <div className="category-scroll">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  className={`category-chip ${category === cat.id ? 'active' : ''}`}
                  onClick={() => setCategory(cat.id)}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Decorative Banner */}
          <div style={{
            background: 'linear-gradient(135deg, #D4E8C8 0%, #B8D8A8 100%)',
            borderRadius: 16,
            padding: '14px 16px',
            marginBottom: 16,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}>
            <span style={{ fontSize: 28 }}>🛒</span>
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: '#2D5016' }}>Ghar ka Saamaan</p>
              <p style={{ fontSize: 12, color: '#5A7040' }}>Track & never run out again!</p>
            </div>
          </div>

          {/* Save Button */}
          <button className="save-btn" onClick={handleSave}>
            ✅ Save / Save Karein
          </button>
        </div>
      </div>
    </div>
  );
}
