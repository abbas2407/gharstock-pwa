export type ItemStatus = 'available' | 'low' | 'finished';
export type ItemCategory = 'dairy' | 'grains' | 'veggies' | 'kitchen' | 'home' | 'other';
export type TabId = 'home' | 'list' | 'reminders' | 'family';

export interface InventoryItem {
  id: string;
  name: string;
  hindi: string;
  icon: string;
  iconBg: string;
  qty: number;
  unit: string;
  status: ItemStatus;
  inShoppingList: boolean;
  category: ItemCategory;
  bought: boolean;
  addedAt: string;
}

export interface FamilyMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
  status: 'admin' | 'joined' | 'pending';
  lastActive: string;
  isYou?: boolean;
}

export interface Reminder {
  id: string;
  type: 'urgent' | 'soon' | 'health' | 'smart';
  title: string;
  body: string;
  icon: string;
  done: boolean;
  urgency: 'urgent' | 'soon';
}

export interface ActivityEntry {
  id: string;
  memberName: string;
  memberAvatar: string;
  action: string;
  time: string;
}

export interface AppState {
  items: InventoryItem[];
  familyMembers: FamilyMember[];
  reminders: Reminder[];
  activity: ActivityEntry[];
  settings: {
    householdName: string;
    notificationsEnabled: boolean;
  };
}
