<script setup lang="ts">
import { ref, computed } from 'vue';
import { cn } from '@/lib/utils';
import {
  Save,
  Search,
  Plus,
  Shield,
  Copy,
  FileDown,
  LayoutDashboard,
  Users,
  Settings,
  BarChart,
  ChevronRight,
  ChevronDown,
} from 'lucide-vue-next';

// 컴포넌트 import
import AppButton from '@/components/ui/AppButton.vue';
import AppBadge from '@/components/ui/AppBadge.vue';
import AppBreadcrumb from '@/components/ui/AppBreadcrumb.vue';
import type { BreadcrumbItem } from '@/components/ui/AppBreadcrumb.vue';
import AppPageHeader from '@/components/ui/AppPageHeader.vue';

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

// ===== 브레드크럼 =====
const breadcrumbItems: BreadcrumbItem[] = [
  { label: 'Dashboard', href: '/' },
  { label: 'Users', href: '#' },
  { label: 'Role Management' },
];

// ===== Data: Roles =====
const roles = ref<Role[]>([
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
]);

// ===== Data: Menu Permissions Structure (Template) =====
// 실제로는 선택된 Role에 따라 API에서 권한 목록을 로드해야 함.
// 여기서는 초기 mock 데이터를 정의하고, Role 선택 시 이를 복사하여 사용하는 방식 시뮬레이션.
const initialMenuPermissions: MenuPermission[] = [
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

// ===== State =====
const searchQuery = ref('');
const selectedRoleId = ref<number>(1);
// 선택된 역할의 권한 데이터 (Deep Copy로 독립성 유지)
const currentPermissions = ref<MenuPermission[]>(
  JSON.parse(JSON.stringify(initialMenuPermissions)),
);

// ===== Computed =====
const filteredRoles = computed(() => {
  if (!searchQuery.value) return roles.value;
  const query = searchQuery.value.toLowerCase();
  return roles.value.filter(
    (r) => r.name.toLowerCase().includes(query) || r.code.toLowerCase().includes(query),
  );
});

const selectedRole = computed(() => {
  return roles.value.find((r) => r.id === selectedRoleId.value);
});

// ===== Methods =====
function selectRole(id: number) {
  selectedRoleId.value = id;
  // Mock: Role 변경 시 권한 데이터 로드 (실제론 API 호출)
  // 여기서는 Admin이면 전부 True, 그 외는 랜덤/초기화 등으로 시뮬레이션
  console.log(`Loading permissions for Role ID: ${id}`);

  // 데이터 리셋 및 모의 로드
  const newPermissions = JSON.parse(JSON.stringify(initialMenuPermissions));
  if (id === 1) {
    // Admin: Full Access
    newPermissions.forEach((m: MenuPermission) => {
      m.permissions = { read: true, create: true, update: true, delete: true, export: true };
    });
  } else if (id === 3 || id === 4) {
    // Viewer/Guest: Read Only
    newPermissions.forEach((m: MenuPermission) => {
      m.permissions = {
        read: true,
        create: false,
        update: false,
        delete: false,
        export: id === 3,
      };
    });
  }
  currentPermissions.value = newPermissions;
}

function handleSave() {
  alert(`Permissions saved for ${selectedRole.value?.name}`);
}

function handleAddRole() {
  alert('Open Create Role Modal');
}

function getStatusVariant(status: RoleStatus) {
  return status === 'active' ? 'success' : 'default';
}

function toggleExpand(menu: MenuPermission) {
  if (menu.hasChildren) {
    menu.expanded = !menu.expanded;
  }
}

// 초기 로드 시 Admin 권한 세팅
selectRole(1);
</script>

<template>
  <div :class="cn('bg-background-light dark:bg-background-dark flex min-h-0 flex-1 flex-col')">
    <!-- 헤더 영역 -->
    <div :class="cn('shrink-0 px-6 pt-6 pb-2')">
      <AppPageHeader title="Role Management">
        <template #breadcrumb>
          <AppBreadcrumb :items="breadcrumbItems" />
        </template>
        <template #actions>
          <AppButton variant="outline">
            <FileDown :class="cn('mr-2 size-4')" />
            <span>Export</span>
          </AppButton>
          <AppButton variant="outline">
            <Copy :class="cn('mr-2 size-4')" />
            <span>Copy Role</span>
          </AppButton>
        </template>
      </AppPageHeader>
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
            <Search
              :class="cn('absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400')"
            />
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

        <!-- 목록 테이블 -->
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
                <th
                  :class="
                    cn('w-20 bg-slate-200/50 px-3 py-2 text-center dark:bg-slate-800/80')
                  "
                >
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
                    cn(
                      'px-3 py-3 font-mono text-xs font-bold',
                      selectedRoleId === role.id
                        ? 'text-primary'
                        : 'text-slate-600 dark:text-slate-400',
                    )
                  "
                >
                  {{ role.code }}
                </td>
                <td :class="cn('px-3 py-3 font-medium text-slate-900 dark:text-white')">
                  {{ role.name }}
                </td>
                <td :class="cn('px-3 py-3 text-center')">
                  <AppBadge
                    :variant="getStatusVariant(role.status)"
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
        v-if="selectedRole"
        :class="
          cn(
            'relative flex flex-1 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900',
          )
        "
      >
        <!-- 상세 정보 폼 -->
        <div :class="cn('shrink-0 p-6 pb-0')">
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

          <div :class="cn('mb-6 grid grid-cols-4 gap-6')">
            <div :class="cn('flex flex-col gap-1.5')">
              <label :class="cn('text-xs font-bold text-slate-500 uppercase')">Role Code</label>
              <input
                v-model="selectedRole.code"
                type="text"
                readonly
                :class="
                  cn(
                    'w-full cursor-not-allowed rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 font-mono text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-800',
                  )
                "
              />
            </div>
            <div :class="cn('flex flex-col gap-1.5')">
              <label :class="cn('text-xs font-bold text-slate-500 uppercase')">Role Name</label>
              <input
                v-model="selectedRole.name"
                type="text"
                :class="
                  cn(
                    'focus:ring-primary focus:border-primary w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm outline-none focus:ring-1 dark:border-slate-700 dark:bg-slate-800',
                  )
                "
              />
            </div>
            <div :class="cn('flex flex-col gap-1.5')">
              <label :class="cn('text-xs font-bold text-slate-500 uppercase')">Sort Order</label>
              <input
                v-model="selectedRole.sortOrder"
                type="number"
                :class="
                  cn(
                    'focus:ring-primary focus:border-primary w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 font-mono text-sm outline-none focus:ring-1 dark:border-slate-700 dark:bg-slate-800',
                  )
                "
              />
            </div>
            <div :class="cn('flex flex-col gap-1.5')">
              <label :class="cn('text-xs font-bold text-slate-500 uppercase')">Status</label>
              <label :class="cn('mt-1 inline-flex cursor-pointer items-center')">
                <input
                  type="checkbox"
                  :checked="selectedRole.status === 'active'"
                  @change="
                    selectedRole.status = ($event.target as HTMLInputElement).checked
                      ? 'active'
                      : 'inactive'
                  "
                  :class="cn('peer sr-only')"
                />
                <div
                  :class="
                    cn(
                      'peer peer-checked:bg-primary relative h-6 w-11 rounded-full bg-slate-200 peer-focus:outline-none after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[\'\'] peer-checked:after:translate-x-full peer-checked:after:border-white rtl:peer-checked:after:-translate-x-full dark:border-gray-600 dark:bg-slate-700',
                    )
                  "
                ></div>
                <span :class="cn('ms-3 text-sm font-medium text-slate-700 dark:text-slate-300')">
                  {{ selectedRole.status === 'active' ? 'Active' : 'Inactive' }}
                </span>
              </label>
            </div>
            <div :class="cn('col-span-4 flex flex-col gap-1.5')">
              <label :class="cn('text-xs font-bold text-slate-500 uppercase')">Description</label>
              <textarea
                v-model="selectedRole.description"
                rows="2"
                :class="
                  cn(
                    'focus:ring-primary focus:border-primary w-full resize-none rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm outline-none focus:ring-1 dark:border-slate-700 dark:bg-slate-800',
                  )
                "
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
              <h3 :class="cn('text-sm font-bold text-slate-700 dark:text-slate-200')">
                Menu Permissions Mapping
              </h3>
              <div :class="cn('flex items-center gap-4 text-xs font-bold text-slate-400')">
                <span :class="cn('flex items-center gap-1')"
                  ><span :class="cn('bg-primary h-2 w-2 rounded-full')"></span> R: Read</span
                >
                <span :class="cn('flex items-center gap-1')"
                  ><span :class="cn('bg-primary h-2 w-2 rounded-full')"></span> C: Create</span
                >
                <span :class="cn('flex items-center gap-1')"
                  ><span :class="cn('bg-primary h-2 w-2 rounded-full')"></span> U: Update</span
                >
                <span :class="cn('flex items-center gap-1')"
                  ><span :class="cn('bg-primary h-2 w-2 rounded-full')"></span> D: Delete</span
                >
                <span :class="cn('flex items-center gap-1')"
                  ><span :class="cn('bg-primary h-2 w-2 rounded-full')"></span> E: Excel</span
                >
              </div>
            </div>

            <!-- 스크롤 가능한 테이블 영역 -->
            <div :class="cn('flex-1 overflow-y-auto')">
              <table :class="cn('w-full border-separate border-spacing-0 text-sm')">
                <thead :class="cn('sticky top-0 z-10 bg-slate-100 dark:bg-slate-800')">
                  <tr>
                    <th
                      :class="
                        cn(
                          'border-b border-slate-200 bg-slate-200/50 px-4 py-2 text-left font-bold text-slate-600 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-400',
                        )
                      "
                    >
                      Menu Name
                    </th>
                    <th
                      v-for="h in ['R', 'C', 'U', 'D', 'E']"
                      :key="h"
                      :class="
                        cn(
                          'w-16 border-b border-slate-200 bg-slate-200/50 px-2 py-2 text-center font-bold text-slate-600 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-400',
                        )
                      "
                    >
                      {{ h }}
                    </th>
                  </tr>
                </thead>
                <tbody
                  :class="
                    cn('divide-y divide-slate-100 bg-white dark:divide-slate-800 dark:bg-slate-900')
                  "
                >
                  <tr
                    v-for="menu in currentPermissions"
                    :key="menu.id"
                    :class="
                      cn(
                        'transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/40',
                        menu.level === 0 ? 'bg-slate-50/50 dark:bg-slate-800/20' : '',
                      )
                    "
                  >
                    <!-- 트리 구조 이름 -->
                    <td :class="cn('px-4 py-2')">
                      <div
                        :class="cn('flex h-full items-center')"
                        :style="{ paddingLeft: `${menu.level * 20}px` }"
                      >
                        <div
                          v-if="menu.hasChildren"
                          @click="toggleExpand(menu)"
                          :class="
                            cn(
                              'mr-1 cursor-pointer rounded p-0.5 hover:bg-slate-200 dark:hover:bg-slate-700',
                            )
                          "
                        >
                          <component
                            :is="menu.expanded ? ChevronDown : ChevronRight"
                            :class="cn('size-4 text-slate-500')"
                          />
                        </div>
                        <div v-else :class="cn('mr-1 w-5')"></div>

                        <!-- 아이콘: Level 0일 때만 표시 -->
                        <component
                          v-if="menu.level === 0"
                          :is="
                            menu.id === 'dashboard'
                              ? LayoutDashboard
                              : menu.id === 'users'
                                ? Users
                                : menu.id === 'settings'
                                  ? Settings
                                  : menu.id === 'analytics'
                                    ? BarChart
                                    : Shield
                          "
                          :class="cn('text-primary mr-2 size-4')"
                        />
                        <div
                          v-else
                          :class="
                            cn('mr-2 h-1.5 w-1.5 rounded-full bg-slate-300 dark:bg-slate-600')
                          "
                        ></div>

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
                    <td :class="cn('bg-inherit text-center')">
                      <input
                        type="checkbox"
                        v-model="menu.permissions.read"
                        :class="
                          cn('focus:ring-primary size-4 rounded border-slate-300 text-primary')
                        "
                      />
                    </td>
                    <td :class="cn('bg-inherit text-center')">
                      <input
                        type="checkbox"
                        v-model="menu.permissions.create"
                        :class="
                          cn('focus:ring-primary size-4 rounded border-slate-300 text-primary')
                        "
                      />
                    </td>
                    <td :class="cn('bg-inherit text-center')">
                      <input
                        type="checkbox"
                        v-model="menu.permissions.update"
                        :class="
                          cn('focus:ring-primary size-4 rounded border-slate-300 text-primary')
                        "
                      />
                    </td>
                    <td :class="cn('bg-inherit text-center')">
                      <input
                        type="checkbox"
                        v-model="menu.permissions.delete"
                        :class="
                          cn('focus:ring-primary size-4 rounded border-slate-300 text-primary')
                        "
                      />
                    </td>
                    <td :class="cn('bg-inherit text-center')">
                      <input
                        type="checkbox"
                        v-model="menu.permissions.export"
                        :class="
                          cn('focus:ring-primary size-4 rounded border-slate-300 text-primary')
                        "
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
  </div>
</template>
