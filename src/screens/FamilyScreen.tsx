import { useState } from 'react';
import type { FamilyMember, ActivityEntry } from '../types';

interface FamilyScreenProps {
  members: FamilyMember[];
  activity: ActivityEntry[];
  onInvite: (name: string) => void;
}

const FAMILY_CODE = 'GS-2025';

export default function FamilyScreen({ members, activity, onInvite }: FamilyScreenProps) {
  const [showInvite, setShowInvite] = useState(false);
  const [inviteName, setInviteName] = useState('');
  const [invitePhone, setInvitePhone] = useState('');
  const [showCode, setShowCode] = useState(false);

  const handleInvite = () => {
    if (!inviteName.trim()) return;
    onInvite(inviteName.trim());
    setInviteName('');
    setInvitePhone('');
    setShowCode(true);
  };

  const shareCode = () => {
    const text = `GharStock mein hamare ghar ke saamaan manage karo!\n\nFamily Code: ${FAMILY_CODE}\n\nApp download karein aur yeh code use karein.`;
    if (navigator.share) {
      navigator.share({ title: 'GharStock Family Invite', text });
    } else {
      const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
      window.open(url, '_blank');
    }
  };

  return (
    <div className="screen">
      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title">Family / Parivaar</h1>
        <p className="page-subtitle">Sab milkar ghar chalaayein.</p>
      </div>

      {/* Members Card */}
      <div className="card" style={{ marginBottom: 16 }}>
        {members.map((member, idx) => (
          <div
            key={member.id}
            className="family-member-card"
            style={{ borderBottom: idx < members.length - 1 ? '1px solid #F0EBE3' : 'none' }}
          >
            <span className="family-avatar">{member.avatar}</span>
            <div className="family-info">
              <div className="family-name">
                {member.name}
                {member.isYou && (
                  <span style={{
                    fontSize: 11,
                    fontWeight: 600,
                    background: '#E8F5E2',
                    color: '#2D8B1A',
                    padding: '2px 8px',
                    borderRadius: 10,
                  }}>
                    YOU
                  </span>
                )}
              </div>
              <div className="family-role">
                {member.status === 'admin' && '👑 Admin'}
                {member.status === 'joined' && `Last active: ${member.lastActive}`}
                {member.status === 'pending' && member.lastActive}
              </div>
            </div>
            <span className={`family-status-badge ${
              member.status === 'admin' ? 'you' :
              member.status === 'joined' ? 'joined' : 'pending'
            }`}>
              {member.status === 'admin' ? 'ADMIN' :
               member.status === 'joined' ? 'JOINED' : 'PENDING'}
            </span>
          </div>
        ))}
      </div>

      {/* Invite Section */}
      {showInvite ? (
        <div className="card" style={{ marginBottom: 16 }}>
          <div style={{ padding: '16px' }}>
            <p style={{
              fontFamily: 'Nunito, sans-serif',
              fontSize: 16,
              fontWeight: 700,
              color: '#2D5016',
              marginBottom: 12,
            }}>
              Invite Karein / Add Member
            </p>
            <div className="form-group">
              <label className="form-label">Name / Naam</label>
              <input
                className="form-input"
                placeholder="Parivaar ka naam..."
                value={inviteName}
                onChange={e => setInviteName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Phone / Mobile Number</label>
              <input
                className="form-input"
                placeholder="+91 XXXXX XXXXX"
                type="tel"
                value={invitePhone}
                onChange={e => setInvitePhone(e.target.value)}
              />
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                style={{
                  flex: 1,
                  padding: '13px',
                  background: '#F5F0E8',
                  color: '#8B8680',
                  border: 'none',
                  borderRadius: 14,
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontSize: 14,
                  fontFamily: 'Poppins, sans-serif',
                }}
                onClick={() => setShowInvite(false)}
              >
                Cancel
              </button>
              <button
                style={{
                  flex: 2,
                  padding: '13px',
                  background: '#3D6B2E',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 14,
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontSize: 14,
                  fontFamily: 'Nunito, sans-serif',
                }}
                onClick={handleInvite}
              >
                📨 Send Invite
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button className="invite-btn" onClick={() => setShowInvite(true)}>
          <span style={{ fontSize: 18 }}>+</span>
          Parivaar Mein Jodein
        </button>
      )}

      {/* Family Code Card */}
      {showCode && (
        <div className="family-code-card">
          <p style={{ fontSize: 13, color: '#8B8680', fontWeight: 500 }}>
            Yeh code share karein / Share this code
          </p>
          <div className="family-code">{FAMILY_CODE}</div>
          <p style={{ fontSize: 12, color: '#8B8680', marginBottom: 12 }}>
            Invite link 24 ghante valid rahega
          </p>
          <button
            onClick={shareCode}
            style={{
              background: '#25D366',
              color: '#fff',
              border: 'none',
              borderRadius: 12,
              padding: '10px 20px',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'Poppins, sans-serif',
            }}
          >
            📤 WhatsApp par Share Karein
          </button>
        </div>
      )}

      {/* Activity Feed */}
      <div className="section-header" style={{ marginTop: 8 }}>
        <span className="section-title" style={{ fontSize: 17 }}>
          Recent Activity / Haal Filhaal
        </span>
      </div>

      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{ padding: '4px 16px' }}>
          {activity.map(entry => (
            <div key={entry.id} className="activity-item">
              <span className="activity-avatar">{entry.memberAvatar}</span>
              <div className="activity-text">
                <strong>{entry.memberName}</strong> {entry.action}
              </div>
              <span className="activity-time">{entry.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Household Stats */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{ padding: '16px' }}>
          <p style={{
            fontFamily: 'Nunito, sans-serif',
            fontSize: 15,
            fontWeight: 700,
            color: '#2D5016',
            marginBottom: 12,
          }}>
            Ghar ki Jaankari / Household Info
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {[
              { label: 'Total Items', value: '10', icon: '📦' },
              { label: 'Members', value: `${members.length}`, icon: '👨‍👩‍👧' },
              { label: 'Low Stock', value: '3', icon: '⚠️' },
              { label: 'This Month', value: '₹4,200', icon: '💰' },
            ].map(stat => (
              <div key={stat.label} style={{
                background: '#F5F0E8',
                borderRadius: 14,
                padding: '12px',
                textAlign: 'center',
              }}>
                <div style={{ fontSize: 22, marginBottom: 4 }}>{stat.icon}</div>
                <div style={{
                  fontFamily: 'Nunito, sans-serif',
                  fontSize: 20,
                  fontWeight: 800,
                  color: '#2D5016',
                }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: 11, color: '#8B8680', fontWeight: 500 }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
