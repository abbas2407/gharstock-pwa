import type { Reminder } from '../types';

interface RemindersScreenProps {
  reminders: Reminder[];
  onToggleDone: (id: string) => void;
}

export default function RemindersScreen({ reminders, onToggleDone }: RemindersScreenProps) {
  const urgentItems = reminders.filter(r => r.urgency === 'urgent');
  const soonItems = reminders.filter(r => r.urgency === 'soon');

  return (
    <div className="screen">
      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title">Reminders / Yaad Dilaayein</h1>
        <p className="page-subtitle">Keeping your home running smoothly.</p>
      </div>

      {/* Smart Insight Card */}
      <div className="insight-card">
        <div className="insight-label">
          <span>✈️ SMART INSIGHT</span>
          <span style={{ fontSize: 16 }}>📍</span>
        </div>
        <p className="insight-text">
          You are near a store —<br />
          pick up onions and dal?
        </p>
        <div className="insight-actions">
          <button className="insight-btn-primary">◆ View Map</button>
          <button className="insight-btn-secondary">Ignore / Nahi</button>
        </div>
      </div>

      {/* Urgent Section */}
      {urgentItems.length > 0 && (
        <>
          <div className="section-header">
            <span className="section-title" style={{ color: '#D4380D' }}>
              Urgent / Jaldi
            </span>
            <span className="section-badge orange">{urgentItems.length} ITEMS</span>
          </div>

          {urgentItems.map(r => (
            <div key={r.id} className={`reminder-card urgent`}>
              <span className="reminder-icon">{r.icon}</span>
              <div className="reminder-content">
                <div className={`reminder-tag ${r.type === 'health' ? 'health' : 'urgent'}`}>
                  {r.title}
                </div>
                <p className="reminder-body">{r.body}</p>
              </div>
              <button
                className={`reminder-done-btn ${r.done ? 'done' : ''}`}
                onClick={() => onToggleDone(r.id)}
                aria-label="Mark done"
              >
                {r.done ? '✓' : ''}
              </button>
            </div>
          ))}
        </>
      )}

      {/* Soon Section */}
      {soonItems.length > 0 && (
        <>
          <div className="section-header" style={{ marginTop: 8 }}>
            <span className="section-title">
              Soon / Thodi Der Mein
            </span>
            <span className="section-badge blue">{soonItems.length} ITEM</span>
          </div>

          {soonItems.map(r => (
            <div key={r.id} className="reminder-card soon">
              <span className="reminder-icon">{r.icon}</span>
              <div className="reminder-content">
                <div className="reminder-tag soon">{r.title}</div>
                <p className="reminder-body">{r.body}</p>
              </div>
              <button
                className={`reminder-done-btn ${r.done ? 'done' : ''}`}
                onClick={() => onToggleDone(r.id)}
                aria-label="Mark done"
              >
                {r.done ? '✓' : ''}
              </button>
            </div>
          ))}
        </>
      )}

      {/* Bottom 2-col Grid */}
      <div className="grid-2" style={{ marginTop: 12 }}>
        {/* Nearby Store */}
        <div className="grid-card grid-card-map">
          <span className="grid-card-label">NEARBY STORE</span>
          <p className="grid-card-title">Organic Mandi</p>
          <p className="grid-card-sub">📍 0.4 km away</p>
          <div style={{
            marginTop: 'auto',
            fontSize: 11,
            fontWeight: 600,
            color: '#2D5016',
            background: 'rgba(255,255,255,0.6)',
            padding: '4px 8px',
            borderRadius: 8,
            display: 'inline-block',
          }}>
            Open Now ✓
          </div>
        </div>

        {/* Restock Card */}
        <div className="grid-card" style={{ background: '#E8F5E2' }}>
          <span style={{ fontSize: 28 }}>🛒</span>
          <p className="grid-card-title" style={{ color: '#2D5016' }}>
            Restock everything today?
          </p>
          <button style={{
            marginTop: 'auto',
            background: '#3D6B2E',
            color: '#fff',
            border: 'none',
            borderRadius: 10,
            padding: '6px 10px',
            fontSize: 12,
            fontWeight: 600,
            cursor: 'pointer',
            fontFamily: 'Poppins, sans-serif',
          }}>
            Start Shopping
          </button>
        </div>
      </div>

      {/* Notification permission card */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{ padding: '14px 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 44,
              height: 44,
              borderRadius: '50%',
              background: '#E8F5E2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 22,
              flexShrink: 0,
            }}>
              🔔
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 14, fontWeight: 600, color: '#2D5016' }}>
                Notifications Enable Karein
              </p>
              <p style={{ fontSize: 12, color: '#8B8680', marginTop: 2 }}>
                Jab saamaan khatam ho, hum batayenge!
              </p>
            </div>
            <button
              onClick={() => {
                if ('Notification' in window) {
                  Notification.requestPermission().then(perm => {
                    if (perm === 'granted') {
                      new Notification('⚠️ GharStock Alert', {
                        body: '🧅 Pyaj khatam ho gaya! Shopping list mein add kar diya.',
                      });
                    }
                  });
                }
              }}
              style={{
                background: '#3D6B2E',
                color: '#fff',
                border: 'none',
                borderRadius: 12,
                padding: '8px 14px',
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'Poppins, sans-serif',
                flexShrink: 0,
              }}
            >
              Enable
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
