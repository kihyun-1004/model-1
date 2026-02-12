
export type RoleStatus = 'active' | 'inactive';

export interface CodeRole {
  id: number;
  code: string;
  name: string;
  description: string;
  sortOrder: number;
  status: RoleStatus;
}

export interface MenuPermission {
  id: string; // Menu ID
  name: string; // Menu Name
  level: number;
  hasChildren: boolean;
  expanded?: boolean;
  permissions: {
    read: boolean;
    create: boolean;
    update: boolean;
    delete: boolean;
    export: boolean;
  };
}
