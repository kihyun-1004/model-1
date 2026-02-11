<script setup lang="ts">
import { ref, computed } from 'vue';
import { cn } from '@/lib/utils';
import {
  Search,
  Plus,
  Save,
  Copy,
  FileDown, // Export 대신 사용
  Shield,
  LayoutDashboard, // Dashboard icon
  Users, // Users icon
  Settings, // Settings icon
  BarChart, // Reports icon
} from 'lucide-vue-next';

// 컴포넌트 import
import AppButton from '@/components/ui/AppButton.vue';
import AppBadge from '@/components/ui/AppBadge.vue';
import Breadcrumb from '@/components/ui/Breadcrumb.vue';
import type { BreadcrumbItem } from '@/components/ui/Breadcrumb.vue';
import PageHeader from '@/components/ui/PageHeader.vue';

// ===== 타입 정의 =====
type RoleStatus = 'active' | 'inactive';

interface Role {
  id: number;
  code: string;
  name: string;
  description: string;
  sortOrder: number;
  status: RoleStatus;
}

interface MenuPermission {
  id: string;
  name: string;
  icon?: any; // Lucide icon component
  level: number; // 0: root, 1: child
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

// ===== 브레드크럼 =====
const breadcrumbItems: BreadcrumbItem[] = [
  { label: 'Dashboard', href: '/' },
  { label: 'Users', href: '#' },
  { label: 'Role Management' },
];

// ===== 상태 관리 =====
const searchQuery = ref('');
const selectedRoleId = ref<number>(1);

// ===== Mock Data: 역할 목록 =====
const roles = ref<Role[]>([
  { id: 1, code: 'ADM', name: 'Admin', description: 'Full system access and management capabilities.', sortOrder: 1, status: 'active' },
  { id: 2, code: 'EDT', name: 'Editor', description: 'Can edit content but cannot manage users.', sortOrder: 2, status: 'active' },
  { id: 3, code: 'VIW', name: 'Viewer', description: 'Read-only access to all content.', sortOrder: 3, status: 'active' },
  { id: 4, code: 'GST', name: 'Guest', description: 'Limited access to public content.', sortOrder: 4, status: 'inactive' },
]);

// ===== Mock Data: 메뉴 권한 구조 =====
// 실제로는 API에서 역할별 권한을 로드해야 함. 여기서는 데모용으로 정적 구조 사용.
const menuPermissions = ref<MenuPermission[]>([
  {
    id: 'dashboard',
    name: 'Dashboard',
    icon: LayoutDashboard,
    level: 0,
    hasChildren: false,
    permissions: { read: true, create: false, update: false, delete: false, export: true }
  },
  {
    id: 'analytics',
    name: 'Analytics Overview',
    level: 1,
    hasChildren: true, // 트리 구조 시각화용
    expanded: true,
    permissions: { read: true, create: false, update: false, delete: false, export: true }
  },
  {
    id: 'users',
    name: 'Users Management',
    icon: Users,
    level: 0,
    hasChildren: true,
    expanded: true,
    permissions: { read: true, create: true, update: true, delete: true, export: true }
  },
  {
    id: 'users_list',
    name: 'All Users List',
    level: 1,
    hasChildren: false,
    permissions: { read: true, create: true, update: true, delete: true, export: true }
  },
  {
    id: 'roles',
    name: 'Role Management',
    level: 1,
    hasChildren: false,
    permissions: { read: true, create: true, update: true, delete: true, export: true }
  },
  {
    id: 'audit',
    name: 'Permissions Audit',
    level: 1,
    hasChildren: false,
    permissions: { read: true, create: false, update: false, delete: false, export: true }
  },
  {
    id: 'settings',
    name: 'System Settings',
    icon: Settings,
    level: 0,
    hasChildren: false,
    permissions: { read: true, create: false, update: true, delete: false, export: false }
  },
  {
    id: 'reports',
    name: 'Reports Center',
    icon: BarChart,
    level: 0,
    hasChildren: false,
    permissions: { read: true, create: true, update: false, delete: false, export: true }
  }
]);

// ===== Computed =====
const filteredRoles = computed(() => {
  if (!searchQuery.value) return roles.value;
  const query = searchQuery.value.toLowerCase();
  return roles.value.filter(role =>
    role.name.toLowerCase().includes(query) ||
    role.code.toLowerCase().includes(query)
  );
});

const selectedRole = computed(() => {
  return roles.value.find(r => r.id === selectedRoleId.value);
});

// ===== 메서드 =====
function selectRole(id: number) {
  selectedRoleId.value = id;
  // TODO: 실제 구현 시 여기서 해당 역할의 권한 데이터를 API로 불러와야 함
  console.log(`Role ${id} selected. Fetching permissions...`);
}

function handleSave() {
  alert(`Changes saved for role: ${selectedRole.value?.name}`);
}

function handleAddRole() {
  alert('Create New Role Modal Open');
}

function getStatusBadgeVariant(status: RoleStatus) {
  return status === 'active' ? 'success' : 'default';
}
</script>

<template>
  <div :class="cn('flex-1 flex flex-col min-h-0 bg-background-light dark:bg-background-dark')">
    <!-- 헤더 영역 -->
    <div :class="cn('px-6 pt-6 pb-2 shrink-0')">
      <PageHeader title="Role Management">
        <template #breadcrumb>
          <Breadcrumb :items="breadcrumbItems" />
        </template>
        <template #actions>
          <AppButton variant="outline" class="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700">
            <FileDown :class="cn('size-4 mr-2')" />
            <span>Export</span>
          </AppButton>
          <AppButton variant="outline" class="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700">
            <Copy :class="cn('size-4 mr-2')" />
            <span>Copy Role</span>
          </AppButton>
        </template>
      </PageHeader>
    </div>

    <!-- 메인 컨텐츠 (좌우 분할) -->
    <div :class="cn('flex-1 flex overflow-hidden px-6 pb-6 gap-6')">

      <!-- 좌측 패널: 역할 목록 -->
      <div :class="cn('w-[30%] min-w-[300px] flex flex-col bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden')">
        <!-- 검색 -->
        <div :class="cn('p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20')">
          <div class="relative">
            <Search :class="cn('absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 size-4')" />
            <input
              v-model="searchQuery"
              class="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-sm focus:ring-1 focus:ring-primary focus:border-primary transition-all shadow-sm outline-none"
              placeholder="Search roles..."
              type="text"
            />
          </div>
        </div>

        <!-- 목록 -->
        <div class="flex-1 overflow-y-auto">
          <table class="w-full text-sm">
            <thead class="sticky top-0 z-10 bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-500 uppercase tracking-wider">
              <tr>
                <th class="px-3 py-2 text-center w-10 border-r border-slate-200 dark:border-slate-700 bg-slate-200/50 dark:bg-slate-800/80">#</th>
                <th class="px-3 py-2 text-left border-r border-slate-200 dark:border-slate-700 bg-slate-200/50 dark:bg-slate-800/80">Code</th>
                <th class="px-3 py-2 text-left bg-slate-200/50 dark:bg-slate-800/80">Name</th>
                <th class="px-3 py-2 text-center w-20 bg-slate-200/50 dark:bg-slate-800/80">Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
              <tr
                v-for="(role, index) in filteredRoles"
                :key="role.id"
                @click="selectRole(role.id)"
                :class="cn(
                  'cursor-pointer transition-colors border-l-2',
                  selectedRoleId === role.id
                    ? 'bg-primary/5 border-l-primary'
                    : 'hover:bg-slate-50 dark:hover:bg-slate-800 border-l-transparent'
                )"
              >
                <td class="px-3 py-3 text-center text-slate-500">{{ index + 1 }}</td>
                <td class="px-3 py-3 font-bold text-slate-600 dark:text-slate-400 font-mono text-xs">{{ role.code }}</td>
                <td class="px-3 py-3 font-medium text-slate-900 dark:text-white">{{ role.name }}</td>
                <td class="px-3 py-3 text-center">
                  <AppBadge :variant="getStatusBadgeVariant(role.status)" class="text-[10px] px-1.5 py-0.5">
                    {{ role.status.toUpperCase() }}
                  </AppBadge>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- 하단 추가 버튼 -->
        <div :class="cn('p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50')">
          <button
            @click="handleAddRole"
            class="w-full flex items-center justify-center gap-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 hover:border-primary hover:text-primary px-4 py-2 rounded-lg font-medium transition-all shadow-sm text-sm text-slate-600 dark:text-slate-300"
          >
            <Plus :class="cn('size-4')" />
            <span>New Role</span>
          </button>
        </div>
      </div>

      <!-- 우측 패널: 상세 정보 및 권한 매핑 -->
      <div :class="cn('flex-1 flex flex-col overflow-hidden relative rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm')">
        <div v-if="selectedRole" :class="cn('p-6 pb-0 shrink-0')">
          <!-- 타이틀 및 액션 -->
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <Shield :class="cn('size-5 text-primary')" />
              Role Details: {{ selectedRole.name }}
            </h2>
            <button
              class="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-lg transition-colors border border-transparent hover:border-slate-300 dark:hover:border-slate-600"
            >
              <Copy :class="cn('size-3.5')" />
              Copy Permissions
            </button>
          </div>

          <!-- 폼 그리드 -->
          <div class="grid grid-cols-4 gap-6 mb-6">
            <div class="flex flex-col gap-1.5">
              <label class="text-xs font-bold text-slate-500 uppercase">Role Code</label>
              <input
                :value="selectedRole.code"
                class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-sm font-mono focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                type="text"
              />
            </div>
            <div class="flex flex-col gap-1.5">
              <label class="text-xs font-bold text-slate-500 uppercase">Role Name</label>
              <input
                :value="selectedRole.name"
                class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                type="text"
              />
            </div>
            <div class="flex flex-col gap-1.5">
              <label class="text-xs font-bold text-slate-500 uppercase">Sort Order</label>
              <input
                :value="selectedRole.sortOrder"
                class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-sm font-mono focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                type="number"
              />
            </div>
            <div class="flex flex-col gap-1.5">
              <label class="text-xs font-bold text-slate-500 uppercase">Status</label>
              <label class="inline-flex items-center cursor-pointer mt-1">
                <input type="checkbox" :checked="selectedRole.status === 'active'" class="sr-only peer">
                <div class="relative w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                <span class="ms-3 text-sm font-medium text-slate-700 dark:text-slate-300">
                  {{ selectedRole.status === 'active' ? 'Active' : 'Inactive' }}
                </span>
              </label>
            </div>
            <div class="col-span-4 flex flex-col gap-1.5">
              <label class="text-xs font-bold text-slate-500 uppercase">Description</label>
              <textarea
                :value="selectedRole.description"
                class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none resize-none"
                rows="2"
              ></textarea>
            </div>
          </div>
        </div>

        <!-- 메뉴 권한 테이블 -->
        <div :class="cn('flex-1 overflow-hidden px-6 pb-20 flex flex-col')">
          <div :class="cn('border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col h-full rounded-lg overflow-hidden')">
            <!-- 테이블 헤더 -->
            <div :class="cn('px-4 py-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between shrink-0')">
              <h3 class="text-sm font-bold text-slate-700 dark:text-slate-200">Menu Permissions Mapping</h3>
              <div class="flex items-center gap-4 text-xs font-bold text-slate-400">
                <span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-blue-500"></span> R: Read</span>
                <span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-blue-500"></span> C: Create</span>
                <span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-blue-500"></span> U: Update</span>
                <span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-blue-500"></span> D: Delete</span>
                <span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-blue-500"></span> E: Excel</span>
              </div>
            </div>

            <!-- 스크롤 가능한 테이블 영역 -->
            <div class="overflow-y-auto flex-1">
              <table class="w-full text-sm border-separate border-spacing-0">
                <thead class="sticky top-0 z-10 bg-slate-100 dark:bg-slate-800">
                  <tr>
                    <th class="px-4 py-2 text-left font-bold text-slate-600 dark:text-slate-400 bg-slate-200/50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700">Menu Name</th>
                    <!-- 권한 체크박스 헤더 (전체 선택용) -->
                    <th v-for="type in ['read', 'create', 'update', 'delete', 'export']" :key="type" class="px-2 py-2 w-16 text-center font-bold text-slate-600 dark:text-slate-400 bg-slate-200/50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 uppercase text-[10px]">
                      {{ type.charAt(0) }}
                      <!-- 헤더 체크박스 생략 (구현 복잡도 완화) -->
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white dark:bg-slate-900 divide-y divide-slate-100 dark:divide-slate-800">
                  <tr
                    v-for="menu in menuPermissions"
                    :key="menu.id"
                    :class="cn(
                        'hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors',
                        menu.level === 0 ? 'bg-slate-50/50 dark:bg-slate-800/20' : ''
                    )"
                  >
                    <!-- 메뉴 이름 (트리 구조) -->
                    <td class="px-4 py-2">
                        <div class="flex items-center h-full" :style="{ paddingLeft: `${menu.level * 20}px` }">
                            <!-- 트리 라인 (가상) - 아이콘으로 대체 -->
                             <component
                                v-if="menu.icon"
                                :is="menu.icon"
                                :class="cn('size-4 text-primary mr-2', menu.level > 0 && 'opacity-70')"
                             />
                             <div v-else :class="cn('size-4 mr-2 flex items-center justify-center')">
                                 <div class="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600"></div>
                             </div>

                             <span :class="cn(
                                 'text-slate-700 dark:text-slate-300',
                                 menu.level === 0 ? 'font-bold' : 'font-normal'
                             )">
                                 {{ menu.name }}
                             </span>
                        </div>
                    </td>
                    <!-- 권한 체크박스들 -->
                    <td class="px-2 py-2 text-center">
                        <input type="checkbox" v-model="menu.permissions.read" class="rounded border-slate-300 text-primary focus:ring-primary size-4" />
                    </td>
                    <td class="px-2 py-2 text-center">
                        <input type="checkbox" v-model="menu.permissions.create" class="rounded border-slate-300 text-primary focus:ring-primary size-4" />
                    </td>
                    <td class="px-2 py-2 text-center">
                        <input type="checkbox" v-model="menu.permissions.update" class="rounded border-slate-300 text-primary focus:ring-primary size-4" />
                    </td>
                    <td class="px-2 py-2 text-center">
                        <input type="checkbox" v-model="menu.permissions.delete" class="rounded border-slate-300 text-primary focus:ring-primary size-4" />
                    </td>
                    <td class="px-2 py-2 text-center">
                        <input type="checkbox" v-model="menu.permissions.export" class="rounded border-slate-300 text-primary focus:ring-primary size-4" />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- 하단 액션 바 (Floating) -->
        <div :class="cn('absolute bottom-0 right-0 left-0 p-6 bg-linear-to-t from-white dark:from-slate-900 via-white/95 dark:via-slate-900/95 to-transparent pointer-events-none rounded-b-xl z-20')">
          <div class="flex justify-end gap-3 pointer-events-auto">
            <button class="px-6 py-2 rounded-lg border border-slate-300 dark:border-slate-700 font-medium text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-sm">
              Cancel
            </button>
            <button
              @click="handleSave"
              class="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-8 py-2 rounded-lg font-bold transition-all shadow-lg shadow-primary/20 text-sm"
            >
              <Save :class="cn('size-4')" />
              <span>Save Changes</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 커스텀 스크롤바 등 필요 시 추가 */
</style>
