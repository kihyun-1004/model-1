<script setup lang="ts">
import { ref, computed, h } from 'vue';
import { cn } from '@/lib/utils';
import { createColumnHelper, type ColumnDef } from '@tanstack/vue-table';
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Download,
  ArrowUpDown,
  RotateCw,
} from 'lucide-vue-next';

// 컴포넌트 import
import AppDataTable from '@/components/AppDataTable.vue';
import AppButton from '@/components/ui/AppButton.vue';
import AppBadge from '@/components/ui/AppBadge.vue';
import AppAvatar from '@/components/ui/AppAvatar.vue';
import AppInput from '@/components/ui/AppInput.vue';
import AppDateRangePicker from '@/components/ui/AppDateRangePicker.vue';
import AppSelect from '@/components/ui/AppSelect.vue';
import AppBreadcrumb from '@/components/ui/AppBreadcrumb.vue';
import type { BreadcrumbItem } from '@/components/ui/AppBreadcrumb.vue';
import AppPageHeader from '@/components/ui/AppPageHeader.vue';
import AppPagination from '@/components/ui/AppPagination.vue';
import AppFilterPanel from '@/components/ui/AppFilterPanel.vue';
import AppBulkActionBar from '@/components/ui/AppBulkActionBar.vue';

// ===== 타입 정의 (Mock Data용) =====
type UserStatus = 'active' | 'inactive' | 'pending';

type AvatarColor =
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

interface User {
  id: string;
  name: string;
  initials: string;
  avatarColor: AvatarColor;
  role: string;
  status: UserStatus;
  lastActive: string;
}

// ===== 브레드크럼 데이터 =====
const breadcrumbItems: BreadcrumbItem[] = [
  { label: 'Dashboard', href: '#' },
  { label: 'Users', href: '#' },
  { label: 'All Users' },
];

// ===== 필터 상태 관리 =====
const searchValue = ref('');
const dateValue = ref<{ start: Date; end: Date } | undefined>();
const statusFilter = ref('');
const statusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'pending', label: 'Pending' },
  { value: 'inactive', label: 'Inactive' },
];

// ===== 페이지네이션 상태 =====
const currentPage = ref(1);

// ===== 행 선택 상태 =====
const selectedRows = ref<User[]>([]);

/**
 * 테이블 행 선택 변경 핸들러
 */
function handleSelectionChange(rows: User[]) {
  selectedRows.value = rows;
}

/**
 * 일괄 삭제 핸들러 (데모용)
 */
function handleBulkDelete() {
  selectedRows.value = [];
}

/**
 * 수정 핸들러 (Mock)
 */
function handleEdit() {
  const selectedUser = selectedRows.value[0];
  if (!selectedUser) return;
  alert(`Editing user: ${selectedUser.name}`);
}

/**
 * 추가 핸들러 (Mock)
 */
function handleAdd() {
  alert('Add New User Modal');
}

// ===== 상태별 뱃지 배리언트 매핑 =====
const statusVariantMap: Record<UserStatus, 'success' | 'default' | 'warning'> = {
  active: 'success',
  inactive: 'default',
  pending: 'warning',
};

// ===== TanStack Table 컬럼 정의 =====
const columnHelper = createColumnHelper<User>();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const columns: ColumnDef<User, any>[] = [
  // 1. ID 컬럼
  columnHelper.accessor('id', {
    header: 'ID',
    cell: (info) => h('span', { class: 'text-slate-500' }, info.getValue()),
    size: 120,
  }),
  // 2. 이름/아바타 컬럼 (커스텀 렌더링)
  columnHelper.accessor('name', {
    header: 'Name',
    cell: (info) => {
      const row = info.row.original;
      return h('div', { class: 'flex items-center gap-2' }, [
        h(AppAvatar, {
          initials: row.initials,
          color: row.avatarColor,
        }),
        h('div', { class: 'flex flex-col' }, [
          h(
            'span',
            {
              class: 'font-medium text-slate-900 dark:text-white leading-tight',
            },
            row.name,
          ),
        ]),
      ]);
    },
  }),
  // 3. 역할 컬럼
  columnHelper.accessor('role', {
    header: 'Role',
    cell: (info) => h('span', { class: 'text-slate-600 dark:text-slate-400' }, info.getValue()),
    size: 120,
  }),
  // 4. 상태 컬럼 (뱃지 사용)
  columnHelper.accessor('status', {
    header: 'Status',
    cell: (info) => {
      const status = info.getValue() as UserStatus;
      return h(AppBadge, { variant: statusVariantMap[status] }, () => status.toUpperCase());
    },
    size: 100,
  }),
  // 5. 마지막 활동 컬럼
  columnHelper.accessor('lastActive', {
    header: 'Last Active',
    cell: (info) => h('span', { class: 'text-slate-500 text-xs' }, info.getValue()),
    size: 130,
  }),
];

// ===== 샘플 데이터 (퍼블리싱 원본과 동일) =====
const users: User[] = [
  {
    id: '#USR-2941',
    name: 'Jordan Smith',
    initials: 'JS',
    avatarColor: 'blue',
    role: 'Editor',
    status: 'active',
    lastActive: '2 mins ago',
  },
  {
    id: '#USR-3012',
    name: 'Elena Rodriguez',
    initials: 'ER',
    avatarColor: 'slate',
    role: 'Viewer',
    status: 'inactive',
    lastActive: '1 day ago',
  },
  {
    id: '#USR-3045',
    name: 'Marcus Kim',
    initials: 'MK',
    avatarColor: 'purple',
    role: 'Admin',
    status: 'active',
    lastActive: '5 mins ago',
  },
  {
    id: '#USR-3120',
    name: 'Sarah Lee',
    initials: 'SL',
    avatarColor: 'orange',
    role: 'Editor',
    status: 'active',
    lastActive: '10 mins ago',
  },
  {
    id: '#USR-3156',
    name: 'Robert Jones',
    initials: 'RJ',
    avatarColor: 'teal',
    role: 'Viewer',
    status: 'pending',
    lastActive: '2 hours ago',
  },
  {
    id: '#USR-3201',
    name: 'Alice Miller',
    initials: 'AM',
    avatarColor: 'indigo',
    role: 'Admin',
    status: 'inactive',
    lastActive: '3 days ago',
  },
  {
    id: '#USR-3245',
    name: 'David Wilson',
    initials: 'DW',
    avatarColor: 'red',
    role: 'Editor',
    status: 'active',
    lastActive: '4 hours ago',
  },
  {
    id: '#USR-3298',
    name: 'Emma Parker',
    initials: 'EP',
    avatarColor: 'cyan',
    role: 'Viewer',
    status: 'active',
    lastActive: '1 hour ago',
  },
  {
    id: '#USR-3342',
    name: 'Thomas Clark',
    initials: 'TC',
    avatarColor: 'pink',
    role: 'Editor',
    status: 'pending',
    lastActive: '5 hours ago',
  },
  {
    id: '#USR-3401',
    name: 'Linda Brown',
    initials: 'LB',
    avatarColor: 'lime',
    role: 'Viewer',
    status: 'active',
    lastActive: '12 mins ago',
  },
  {
    id: '#USR-3450',
    name: 'Kevin Johnson',
    initials: 'KJ',
    avatarColor: 'gray',
    role: 'Admin',
    status: 'inactive',
    lastActive: '2 weeks ago',
  },
  {
    id: '#USR-3499',
    name: 'Maria Hernandez',
    initials: 'MH',
    avatarColor: 'amber',
    role: 'Viewer',
    status: 'active',
    lastActive: '15 mins ago',
  },
];

// ===== 필터링된 데이터 (Computed) =====
const filteredUsers = computed(() => {
  return users.filter((user) => {
    // 1. 검색 필터 (이름, ID)
    if (
      searchValue.value &&
      !user.name.toLowerCase().includes(searchValue.value.toLowerCase()) &&
      !user.id.toLowerCase().includes(searchValue.value.toLowerCase())
    ) {
      return false;
    }
    // 2. 상태 필터
    if (statusFilter.value && user.status !== statusFilter.value) {
      return false;
    }
    return true;
  });
});
</script>

<template>
  <div :class="cn('bg-background-light dark:bg-background-dark flex min-h-0 flex-1 flex-col')">
    <!-- 상단: 브레드크럼 + 헤더 + 필터 -->
    <div :class="cn('shrink-0 p-8 pb-0')">
      <!-- 페이지 헤더 -->
      <AppPageHeader title="User Management">
        <template #breadcrumb>
          <AppBreadcrumb :items="breadcrumbItems" />
        </template>

        <template #actions>
          <!-- 삭제 버튼 (선택 시 활성화) -->
          <AppButton
            variant="danger"
            :disabled="selectedRows.length === 0"
            @click="handleBulkDelete"
          >
            <Trash2 :class="cn('mr-1 size-4')" />
            <span>Delete</span>
          </AppButton>

          <!-- 수정 버튼 (1개 선택 시 활성화) -->
          <AppButton variant="secondary" :disabled="selectedRows.length !== 1" @click="handleEdit">
            <Pencil :class="cn('mr-1 size-4')" />
            <span>Edit</span>
          </AppButton>

          <!-- 추가 버튼 -->
          <AppButton variant="primary" @click="handleAdd">
            <Plus :class="cn('mr-1 size-4')" />
            <span>Add</span>
          </AppButton>
        </template>
      </AppPageHeader>

      <!-- 필터 패널 -->
      <div :class="cn('mb-6')">
        <AppFilterPanel>
          <div :class="cn('flex w-full flex-col items-end gap-4 md:flex-row')">
            <!-- 검색 입력 -->
            <div :class="cn('flex w-full flex-col gap-1.5 md:w-64')">
              <label :class="cn('ml-1 text-xs font-bold text-slate-700 dark:text-slate-300')">
                Search
              </label>
              <AppInput v-model="searchValue" placeholder="Search..." :icon="Search" />
            </div>
            <!-- 날짜 필터 (Mock) -->
            <div :class="cn('flex w-full flex-col gap-1.5 md:w-72')">
              <label :class="cn('ml-1 text-xs font-bold text-slate-700 dark:text-slate-300')">
                Date Range
              </label>
              <AppDateRangePicker v-model="dateValue" />
            </div>
            <!-- 상태 필터 -->
            <div :class="cn('flex w-full flex-col gap-1.5 md:w-40')">
              <label :class="cn('ml-1 text-xs font-bold text-slate-700 dark:text-slate-300')">
                Status
              </label>
              <AppSelect v-model="statusFilter" :options="statusOptions" placeholder="All Status" />
            </div>

            <!-- 우측 아이콘 버튼 그룹 (Refresh, Search) -->
            <div :class="cn('ml-auto flex items-center gap-1 pb-1')">
              <AppButton variant="primary" size="icon" class="h-11 w-11" title="Search">
                <Search :class="cn('size-7')" />
              </AppButton>
              <AppButton variant="primary" size="icon" class="h-11 w-11" title="Refresh">
                <RotateCw :class="cn('size-7')" />
              </AppButton>
            </div>
          </div>
        </AppFilterPanel>
      </div>

      <!-- 벌크 액션 바 (행 선택 시 활성화) -->
      <div :class="cn('mb-4')">
        <AppBulkActionBar :selected-count="selectedRows.length" @delete="handleBulkDelete">
          <template #actions>
            <AppButton variant="ghost">
              <Download :class="cn('size-4')" />
              <span>Export</span>
            </AppButton>
            <AppButton variant="ghost">
              <ArrowUpDown :class="cn('size-4')" />
              <span>Change Status</span>
            </AppButton>
          </template>
        </AppBulkActionBar>
      </div>
    </div>

    <!-- 테이블 영역 -->
    <div :class="cn('flex min-h-0 flex-1 flex-col overflow-hidden px-8 pb-4')">
      <AppDataTable
        :columns="columns"
        :data="filteredUsers"
        enable-selection
        @selection-change="handleSelectionChange"
      >
        <template #footer>
          <AppPagination
            v-model:current-page="currentPage"
            :total-pages="10"
            :total-items="120"
            :page-size="12"
          />
        </template>
      </AppDataTable>
    </div>
  </div>
</template>
