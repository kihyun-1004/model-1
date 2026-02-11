<script setup lang="ts">
import { ref, computed, type Component } from 'vue';
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
  icon?: Component; // Lucide icon component
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
  {
    id: 1,
    code: 'ADM',
    name: 'Admin',
    description: 'Full system access and management capabilities.',
    sortOrder: 1,
    status: 'active',
  },
  {
    id: 2,
    code: 'EDT',
    name: 'Editor',
    description: 'Can edit content but cannot manage users.',
    sortOrder: 2,
    status: 'active',
  },
  {
    id: 3,
    code: 'VIW',
    name: 'Viewer',
    description: 'Read-only access to all content.',
    sortOrder: 3,
    status: 'active',
  },
  {
    id: 4,
    code: 'GST',
    name: 'Guest',
    description: 'Limited access to public content.',
    sortOrder: 4,
    status: 'inactive',
  },
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
    permissions: { read: true, create: false, update: false, delete: false, export: true },
  },
  {
    id: 'analytics',
    name: 'Analytics Overview',
    level: 1,
    hasChildren: true, // 트리 구조 시각화용
    expanded: true,
    permissions: { read: true, create: false, update: false, delete: false, export: true },
  },
  {
    id: 'users',
    name: 'Users Management',
    icon: Users,
    level: 0,
    hasChildren: true,
    expanded: true,
    permissions: { read: true, create: true, update: true, delete: true, export: true },
  },
  {
    id: 'users_list',
    name: 'All Users List',
    level: 1,
    hasChildren: false,
    permissions: { read: true, create: true, update: true, delete: true, export: true },
  },
  {
    id: 'roles',
    name: 'Role Management',
    level: 1,
    hasChildren: false,
    permissions: { read: true, create: true, update: true, delete: true, export: true },
  },
  {
    id: 'audit',
    name: 'Permissions Audit',
    level: 1,
    hasChildren: false,
    permissions: { read: true, create: false, update: false, delete: false, export: true },
  },
  {
    id: 'settings',
    name: 'System Settings',
    icon: Settings,
    level: 0,
    hasChildren: false,
    permissions: { read: true, create: false, update: true, delete: false, export: false },
  },
  {
    id: 'reports',
    name: 'Reports Center',
    icon: BarChart,
    level: 0,
    hasChildren: false,
    permissions: { read: true, create: true, update: false, delete: false, export: true },
  },
]);

// ===== Computed =====
const filteredRoles = computed(() => {
  if (!searchQuery.value) return roles.value;
  const query = searchQuery.value.toLowerCase();
  return roles.value.filter(
    (role) => role.name.toLowerCase().includes(query) || role.code.toLowerCase().includes(query),
  );
});

const selectedRole = computed(() => {
  return roles.value.find((r) => r.id === selectedRoleId.value);
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
  <div :class="cn('bg-background-light dark:bg-background-dark flex min-h-0 flex-1 flex-col')">
    <!-- 헤더 영역 -->
    <div :class="cn('shrink-0 px-6 pt-6 pb-2')">
      <PageHeader title="Role Management">
        <template #breadcrumb>
          <Breadcrumb :items="breadcrumbItems" />
        </template>
        <template #actions>
          <AppButton
            variant="outline"
            class="border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-800"
          >
            <FileDown :class="cn('mr-2 size-4')" />
            <span>Export</span>
          </AppButton>
          <AppButton
            variant="outline"
            class="border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-800"
          >
            <Copy :class="cn('mr-2 size-4')" />
            <span>Copy Role</span>
          </AppButton>
        </template>
      </PageHeader>
    </div>

    <!-- 메인 컨텐츠 (좌우 분할) -->
    <div :class="cn('flex flex-1 gap-6 overflow-hidden px-6 pb-6')">
      <!-- 좌측 패널: 역할 목록 -->
      <div
        :class="
          cn(
            'flex w-[30%] min-w-[300px] flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900',
          )
        "
      >
        <!-- 검색 -->
        <div
          :class="
            cn(
              'border-b border-slate-200 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-800/20',
            )
          "
        >
          <div :class="cn('relative')">
            <Search :class="cn('absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400')" />
            <input
              v-model="searchQuery"
              :class="
                cn(
                  'focus:ring-primary focus:border-primary w-full rounded-lg border border-slate-300 bg-white py-2 pr-4 pl-9 text-sm shadow-sm outline-none focus:ring-1 dark:border-slate-700 dark:bg-slate-900',
                )
              "
              placeholder="Search roles..."
              type="text"
            />
          </div>
        </div>

        <!-- 목록 -->
        <div :class="cn('flex-1 overflow-y-auto')">
          <table :class="cn('w-full text-sm')">
            <thead
              :class="
                cn(
                  'sticky top-0 z-10 bg-slate-100 text-xs font-bold tracking-wider text-slate-500 uppercase dark:bg-slate-800',
                )
              "
            >
              <tr>
                <th
                  :class="
                    cn(
                      'w-10 border-r border-slate-200 bg-slate-200/50 px-3 py-2 text-center dark:border-slate-700 dark:bg-slate-800/80',
                    )
                  "
                >
                  #
                </th>
                <th
                  :class="
                    cn(
                      'border-r border-slate-200 bg-slate-200/50 px-3 py-2 text-left dark:border-slate-700 dark:bg-slate-800/80',
                    )
                  "
                >
                  Code
                </th>
                <th :class="cn('bg-slate-200/50 px-3 py-2 text-left dark:bg-slate-800/80')">
                  Name
                </th>
                <th :class="cn('w-20 bg-slate-200/50 px-3 py-2 text-center dark:bg-slate-800/80')">
                  Status
                </th>
              </tr>
            </thead>
            <tbody :class="cn('divide-y divide-slate-100 dark:divide-slate-800')">
              <tr
                v-for="(role, index) in filteredRoles"
                :key="role.id"
                @click="selectRole(role.id)"
                :class="
                  cn(
                    'cursor-pointer border-l-2 transition-colors',
                    selectedRoleId === role.id
                      ? 'bg-primary/5 border-l-primary'
                      : 'border-l-transparent hover:bg-slate-50 dark:hover:bg-slate-800',
                  )
                "
              >
                <td :class="cn('px-3 py-3 text-center text-slate-500')">{{ index + 1 }}</td>
                <td
                  :class="
                    cn('px-3 py-3 font-mono text-xs font-bold text-slate-600 dark:text-slate-400')
                  "
                >
                  {{ role.code }}
                </td>
                <td :class="cn('px-3 py-3 font-medium text-slate-900 dark:text-white')">
                  {{ role.name }}
                </td>
                <td :class="cn('px-3 py-3 text-center')">
                  <AppBadge
                    :variant="getStatusBadgeVariant(role.status)"
                    :class="cn('px-1.5 py-0.5 text-[10px]')"
                  >
                    {{ role.status.toUpperCase() }}
                  </AppBadge>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- 하단 추가 버튼 -->
        <div
          :class="
            cn(
              'border-t border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/50',
            )
          "
        >
          <button
            @click="handleAddRole"
            :class="
              cn(
                'hover:border-primary hover:text-primary flex w-full items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm transition-all dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300',
              )
            "
          >
            <Plus :class="cn('size-4')" />
            <span>New Role</span>
          </button>
        </div>
      </div>

      <!-- 우측 패널: 상세 정보 및 권한 매핑 -->
      <div
        :class="
          cn(
            'relative flex flex-1 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900',
          )
        "
      >
        <div v-if="selectedRole" :class="cn('shrink-0 p-6 pb-0')">
          <!-- 타이틀 및 액션 -->
          <div :class="cn('mb-6 flex items-center justify-between')">
            <h2
              :class="
                cn('flex items-center gap-2 text-lg font-bold text-slate-800 dark:text-white')
              "
            >
              <Shield :class="cn('text-primary size-5')" />
              Role Details: {{ selectedRole.name }}
            </h2>
            <button
              :class="
                cn(
                  'flex items-center gap-2 rounded-lg border border-transparent bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:border-slate-300 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-slate-600',
                )
              "
            >
              <Copy :class="cn('size-3.5')" />
              Copy Permissions
            </button>
          </div>

          <!-- 폼 그리드 -->
          <div :class="cn('mb-8 grid grid-cols-1 gap-6 md:grid-cols-2')">
            <div>
              <label
                :class="cn('mb-1.5 block text-sm font-bold text-slate-700 dark:text-slate-300')"
                >Role Name</label
              >
              <input
                v-model="selectedRole.name"
                type="text"
                :class="
                  cn(
                    'focus:ring-primary focus:border-primary w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm transition-colors outline-none focus:ring-1 dark:border-slate-700 dark:bg-slate-900',
                  )
                "
              />
            </div>
            <div>
              <label
                :class="cn('mb-1.5 block text-sm font-bold text-slate-700 dark:text-slate-300')"
                >Role Code</label
              >
              <input
                v-model="selectedRole.code"
                type="text"
                :class="
                  cn(
                    'w-full cursor-not-allowed rounded-lg border border-slate-200 bg-slate-100 px-3 py-2 font-mono text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-800',
                  )
                "
                readonly
              />
            </div>
            <div :class="cn('md:col-span-2')">
              <label
                :class="cn('mb-1.5 block text-sm font-bold text-slate-700 dark:text-slate-300')"
                >Description</label
              >
              <textarea
                v-model="selectedRole.description"
                rows="2"
                :class="
                  cn(
                    'focus:ring-primary focus:border-primary w-full resize-none rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm transition-colors outline-none focus:ring-1 dark:border-slate-700 dark:bg-slate-900',
                  )
                "
              ></textarea>
            </div>
          </div>
          <div class="flex flex-col gap-1.5">
            <label class="text-xs font-bold text-slate-500 uppercase">Status</label>
            <label class="mt-1 inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                :checked="selectedRole.status === 'active'"
                class="peer sr-only"
              />
              <div
                class="peer peer-checked:bg-primary relative h-6 w-11 rounded-full bg-slate-200 peer-focus:outline-none after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white rtl:peer-checked:after:-translate-x-full dark:border-gray-600 dark:bg-slate-700"
              ></div>
              <span class="ms-3 text-sm font-medium text-slate-700 dark:text-slate-300">
                {{ selectedRole.status === 'active' ? 'Active' : 'Inactive' }}
              </span>
            </label>
          </div>
          <div class="col-span-4 flex flex-col gap-1.5">
            <label class="text-xs font-bold text-slate-500 uppercase">Description</label>
            <textarea
              :value="selectedRole.description"
              class="focus:ring-primary focus:border-primary w-full resize-none rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm outline-none focus:ring-1 dark:border-slate-700 dark:bg-slate-800"
              rows="2"
            ></textarea>
          </div>
        </div>
      </div>

      <!-- 메뉴 권한 테이블 -->
      <div :class="cn('flex flex-1 flex-col overflow-hidden px-6 pb-20')">
        <div
          :class="
            cn(
              'flex h-full flex-col overflow-hidden rounded-lg border border-slate-200 shadow-sm dark:border-slate-700',
            )
          "
        >
          <!-- 테이블 헤더 -->
          <div
            :class="
              cn(
                'flex shrink-0 items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-800/50',
              )
            "
          >
            <h3 class="text-sm font-bold text-slate-700 dark:text-slate-200">
              Menu Permissions Mapping
            </h3>
            <div class="flex items-center gap-4 text-xs font-bold text-slate-400">
              <span class="flex items-center gap-1"
                ><span class="h-2 w-2 rounded-full bg-blue-500"></span> R: Read</span
              >
              <span class="flex items-center gap-1"
                ><span class="h-2 w-2 rounded-full bg-blue-500"></span> C: Create</span
              >
              <span class="flex items-center gap-1"
                ><span class="h-2 w-2 rounded-full bg-blue-500"></span> U: Update</span
              >
              <span class="flex items-center gap-1"
                ><span class="h-2 w-2 rounded-full bg-blue-500"></span> D: Delete</span
              >
              <span class="flex items-center gap-1"
                ><span class="h-2 w-2 rounded-full bg-blue-500"></span> E: Excel</span
              >
            </div>
          </div>

          <!-- 스크롤 가능한 테이블 영역 -->
          <div class="flex-1 overflow-y-auto">
            <table class="w-full border-separate border-spacing-0 text-sm">
              <thead class="sticky top-0 z-10 bg-slate-100 dark:bg-slate-800">
                <tr>
                  <th
                    class="border-b border-slate-200 bg-slate-200/50 px-4 py-2 text-left font-bold text-slate-600 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-400"
                  >
                    Menu Name
                  </th>
                  <!-- 권한 체크박스 헤더 (전체 선택용) -->
                  <th
                    v-for="type in ['read', 'create', 'update', 'delete', 'export']"
                    :key="type"
                    class="w-16 border-b border-slate-200 bg-slate-200/50 px-2 py-2 text-center text-[10px] font-bold text-slate-600 uppercase dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-400"
                  >
                    {{ type.charAt(0) }}
                    <!-- 헤더 체크박스 생략 (구현 복잡도 완화) -->
                  </th>
                </tr>
              </thead>
              <tbody
                class="divide-y divide-slate-100 bg-white dark:divide-slate-800 dark:bg-slate-900"
              >
                <tr
                  v-for="menu in menuPermissions"
                  :key="menu.id"
                  :class="
                    cn(
                      'transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/40',
                      menu.level === 0 ? 'bg-slate-50/50 dark:bg-slate-800/20' : '',
                    )
                  "
                >
                  <!-- 메뉴 이름 (트리 구조) -->
                  <td class="px-4 py-2">
                    <div
                      class="flex h-full items-center"
                      :style="{ paddingLeft: `${menu.level * 20}px` }"
                    >
                      <!-- 트리 라인 (가상) - 아이콘으로 대체 -->
                      <component
                        v-if="menu.icon"
                        :is="menu.icon"
                        :class="cn('text-primary mr-2 size-4', menu.level > 0 && 'opacity-70')"
                      />
                      <div v-else :class="cn('mr-2 flex size-4 items-center justify-center')">
                        <div
                          :class="cn('h-1.5 w-1.5 rounded-full bg-slate-300 dark:bg-slate-600')"
                        ></div>
                      </div>

                      <span
                        :class="
                          cn(
                            'text-slate-700 dark:text-slate-300',
                            menu.level === 0 ? 'font-bold' : 'font-normal',
                          )
                        "
                      >
                        {{ menu.name }}
                      </span>
                    </div>
                  </td>
                  <!-- 권한 체크박스들 -->
                  <td :class="cn('px-2 py-2 text-center')">
                    <input
                      type="checkbox"
                      v-model="menu.permissions.read"
                      :class="cn('text-primary focus:ring-primary size-4 rounded border-slate-300')"
                    />
                  </td>
                  <td :class="cn('px-2 py-2 text-center')">
                    <input
                      type="checkbox"
                      v-model="menu.permissions.create"
                      :class="cn('text-primary focus:ring-primary size-4 rounded border-slate-300')"
                    />
                  </td>
                  <td :class="cn('px-2 py-2 text-center')">
                    <input
                      type="checkbox"
                      v-model="menu.permissions.update"
                      :class="cn('text-primary focus:ring-primary size-4 rounded border-slate-300')"
                    />
                  </td>
                  <td :class="cn('px-2 py-2 text-center')">
                    <input
                      type="checkbox"
                      v-model="menu.permissions.delete"
                      :class="cn('text-primary focus:ring-primary size-4 rounded border-slate-300')"
                    />
                  </td>
                  <td :class="cn('px-2 py-2 text-center')">
                    <input
                      type="checkbox"
                      v-model="menu.permissions.export"
                      :class="cn('text-primary focus:ring-primary size-4 rounded border-slate-300')"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- 하단 액션 바 (Floating) -->
      <div
        :class="
          cn(
            'pointer-events-none absolute right-0 bottom-0 left-0 z-20 rounded-b-xl bg-linear-to-t from-white via-white/95 to-transparent p-6 dark:from-slate-900 dark:via-slate-900/95',
          )
        "
      >
        <div :class="cn('pointer-events-auto flex justify-end gap-3')">
          <button
            :class="
              cn(
                'rounded-lg border border-slate-300 bg-white px-6 py-2 text-sm font-medium text-slate-600 transition-all hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800',
              )
            "
          >
            Cancel
          </button>
          <button
            @click="handleSave"
            :class="
              cn(
                'bg-primary hover:bg-primary/90 shadow-primary/20 flex items-center gap-2 rounded-lg px-8 py-2 text-sm font-bold text-white shadow-lg transition-all',
              )
            "
          >
            <Save :class="cn('size-4')" />
            <span>Save Changes</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 커스텀 스크롤바 등 필요 시 추가 */
</style>
