
import type { CodeRole, MenuPermission } from '@/types/role';

export const roles: CodeRole[] = [
  { id: 1, code: 'ADM', name: 'Admin', description: 'Full system access.', sortOrder: 1, status: 'active' },
  {
    id: 2,
    code: 'EDT',
    name: 'Editor',
    description: 'Can edit content.',
    sortOrder: 2,
    status: 'active',
  },
  {
    id: 3,
    code: 'VIW',
    name: 'Viewer',
    description: 'Read-only access.',
    sortOrder: 3,
    status: 'active',
  },
  { id: 4, code: 'GST', name: 'Guest', description: 'Limited access.', sortOrder: 4, status: 'inactive' },
];

export const initialMenuPermissions: MenuPermission[] = [
  {
    id: 'dashboard',
    name: 'Dashboard',
    level: 0,
    hasChildren: false,
    permissions: { read: false, create: false, update: false, delete: false, export: false },
  },
  {
    id: 'analytics',
    name: 'Analytics Overview',
    level: 1,
    hasChildren: true,
    expanded: true,
    permissions: { read: false, create: false, update: false, delete: false, export: false },
  },
  {
    id: 'users',
    name: 'Users Management',
    level: 0,
    hasChildren: true,
    expanded: true,
    permissions: { read: false, create: false, update: false, delete: false, export: false },
  },
  {
    id: 'users_list',
    name: 'All Users List',
    level: 1,
    hasChildren: false,
    permissions: { read: false, create: false, update: false, delete: false, export: false },
  },
  {
    id: 'roles',
    name: 'Role Management',
    level: 1,
    hasChildren: false,
    permissions: { read: false, create: false, update: false, delete: false, export: false },
  },
  {
    id: 'audit',
    name: 'Permissions Audit',
    level: 1,
    hasChildren: false,
    permissions: { read: false, create: false, update: false, delete: false, export: false },
  },
  {
    id: 'settings',
    name: 'System Settings',
    level: 0,
    hasChildren: false,
    permissions: { read: false, create: false, update: false, delete: false, export: false },
  },
  {
    id: 'reports',
    name: 'Reports Center',
    level: 0,
    hasChildren: false,
    permissions: { read: false, create: false, update: false, delete: false, export: false },
  },
];
