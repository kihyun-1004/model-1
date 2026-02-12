
export type UserStatus = 'active' | 'inactive' | 'pending';

export type AvatarColor =
  | 'blue'
  | 'slate'
  | 'purple'
  | 'orange'
  | 'teal'
  | 'indigo'
  | 'red'
  | 'cyan'
  | 'pink'
  | 'lime'
  | 'gray'
  | 'amber';

export interface User {
  id: string;
  name: string;
  initials: string;
  avatarColor: AvatarColor;
  role: string;
  status: UserStatus;
  lastActive: string;
}
