<script setup lang="ts">
import { ref, computed, markRaw, type Component } from 'vue';
import { cn } from '@/lib/utils';
import {
  Search,
  Plus,
  Save,
  Folder,
  FolderOpen,
  FileText,
  Settings,
  LayoutDashboard,
  Users,
  BarChart,
  ChevronRight,
  ChevronDown,
  GripVertical,
} from 'lucide-vue-next';

// 컴포넌트 import
import AppButton from '@/components/ui/AppButton.vue';
import AppBadge from '@/components/ui/AppBadge.vue';
import AppBreadcrumb, { type BreadcrumbItem } from '@/components/ui/AppBreadcrumb.vue';
import AppPageHeader from '@/components/ui/AppPageHeader.vue';
import IconPickerModal from '@/components/ui/IconPickerModal.vue';
import { iconMap } from '@/utils/icons';

// ===== 타입 정의 =====
interface MenuItem {
  id: string;
  parentId: string | null;
  name: string;
  code: string;
  path: string;
  component: string;
  icon?: Component;
  iconName?: string; // 아이콘 이름 (저장용)
  sortOrder: number;
  status: 'active' | 'inactive';
  visible: boolean; // 사이드바 표시 여부
  expanded?: boolean; // 트리 펼침 상태
  children?: MenuItem[]; // 계층 구조용
  level?: number; // UI 들여쓰기용
}

// ===== 브레드크럼 =====
const breadcrumbItems: BreadcrumbItem[] = [
  { label: 'Dashboard', href: '/' },
  { label: 'System', href: '#' },
  { label: 'Menu Management' },
];

// ===== 상태 관리 =====
const searchQuery = ref('');
const selectedMenuId = ref<string>('sys-menu');

// ===== Mock Data: 메뉴 목록 (Flat 구조로 관리 후 필요 시 Tree 변환, 여기서는 UI 편의상 Flat+Level로 모의) =====
// 실제로는 API에서 트리 데이터를 받아오거나 Flat 데이터를 받아 트리로 변환함.
// 여기서는 "화면에 보여줄 리스트"를 직접 구성하여 트리 뷰를 시뮬레이션.
const rawMenus = ref<MenuItem[]>([
  {
    id: 'dashboard',
    parentId: null,
    name: 'Dashboard',
    code: 'sys:dashboard',
    path: '/dashboard',
    component: 'views/dashboard/index',
    icon: LayoutDashboard,
    iconName: 'LayoutDashboard',
    sortOrder: 1,
    status: 'active',
    visible: true,
    expanded: false,
    level: 0,
    children: [],
  },
  {
    id: 'system',
    parentId: null,
    name: 'System Management',
    code: 'sys:manage',
    path: '/system',
    component: 'Layout',
    icon: Settings,
    iconName: 'Settings',
    sortOrder: 2,
    status: 'active',
    visible: true,
    expanded: true,
    level: 0,
    children: [], // 런타임에 채워짐 (데모용 정적 리스트에서는 아래 항목들이 자식 개념)
  },
  {
    id: 'sys-users',
    parentId: 'system',
    name: 'User Management',
    code: 'sys:user:list',
    path: '/system/users',
    component: 'views/system/user/index',
    icon: Users,
    iconName: 'Users',
    sortOrder: 1,
    status: 'active',
    visible: true,
    expanded: false,
    level: 1,
    children: [],
  },
  {
    id: 'sys-roles',
    parentId: 'system',
    name: 'Role Management',
    code: 'sys:role:list',
    path: '/system/roles',
    component: 'views/system/role/index',
    icon: FileText, // 임시 아이콘
    iconName: 'FileText',
    sortOrder: 2,
    status: 'active',
    visible: true,
    expanded: false,
    level: 1,
    children: [],
  },
  {
    id: 'sys-menu',
    parentId: 'system',
    name: 'Menu Management',
    code: 'sys:menu:list',
    path: '/system/menus',
    component: 'views/system/menu/index',
    icon: FileText,
    iconName: 'FileText',
    sortOrder: 3,
    status: 'active',
    visible: true,
    expanded: false,
    level: 1,
    children: [],
  },
  {
    id: 'reports',
    parentId: null,
    name: 'Reports',
    code: 'sys:report',
    path: '/reports',
    component: 'views/reports/index',
    icon: BarChart,
    iconName: 'BarChart',
    sortOrder: 3,
    status: 'inactive',
    visible: false,
    expanded: false,
    level: 0,
    children: [],
  },
]);

// ===== Computed: 트리 뷰 렌더링용 리스트 =====
// 실제 구현에서는 재귀 컴포넌트나 트리 유틸리티를 사용하지만,
// 여기서는 간단히 `expanded` 상태에 따라 필터링하고 검색어에 따라 필터링하는 로직을 구현.

const visibleMenuItems = computed(() => {
  const items = [...rawMenus.value];

  // 1. 검색 필터링
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    // 검색어가 있으면 트리 구조 무시하고 매칭되는 항목만 플랫하게 보여줄 수도 있고,
    // 부모를 포함해서 보여줄 수도 있음. 여기서는 단순히 매칭되는 것만 보여줌.
    return items.filter(
      (item) => item.name.toLowerCase().includes(query) || item.code.toLowerCase().includes(query),
    );
  }

  // 2. 트리 펼침/접기 필터링
  // 레벨 1 이상의 항목은 부모가 expanded 상태여야 보임.
  // 이 로직은 flat list구조에서 parentId를 참조하여 부모를 찾고 그 부모의 expanded를 확인해야 함.
  // 성능상 Map을 만드는게 좋음.
  const itemMap = new Map(items.map((i) => [i.id, i]));

  return items.filter((item) => {
    if (item.level === 0) return true; // 루트는 항상 보임

    // 부모를 찾아서 부모가 expanded인지 확인
    let parent = itemMap.get(item.parentId || '');
    while (parent) {
      if (!parent.expanded) return false; // 부모 중 하나라도 접혀있으면 안보임
      if (parent.level === 0) break; // 루트까지 도달
      parent = itemMap.get(parent.parentId || '');
    }
    return true;
  });
});

const selectedMenu = computed(() => {
  return rawMenus.value.find((m) => m.id === selectedMenuId.value);
});

const selectedParentMenu = computed(() => {
  if (!selectedMenu.value?.parentId) return null;
  return rawMenus.value.find((m) => m.id === selectedMenu.value?.parentId);
});

// ===== 메서드 =====
function toggleExpand(id: string) {
  const item = rawMenus.value.find((m) => m.id === id);
  if (item) {
    item.expanded = !item.expanded;
  }
}

function selectMenu(id: string) {
  selectedMenuId.value = id;
}

function handleExpandAll() {
  rawMenus.value.forEach((m) => (m.expanded = true));
}

function handleCollapseAll() {
  rawMenus.value.forEach((m) => (m.expanded = false));
}

function handleSave() {
  alert(`Changes saved for menu: ${selectedMenu.value?.name}`);
}

function hasChildren(id: string) {
  return rawMenus.value.some((m) => m.parentId === id);
}

// ===== 아이콘 선택 모달 =====
const isIconPickerOpen = ref(false);
const tempIconName = ref('');

function openIconPicker() {
  tempIconName.value = selectedMenu.value?.iconName || '';
  isIconPickerOpen.value = true;
}

function handleIconSelected(iconName: string) {
  if (selectedMenu.value) {
    selectedMenu.value.iconName = iconName;
    // iconMap에서 컴포넌트 참조를 가져와서 icon에 할당
    const iconComp = iconMap[iconName];
    if (iconComp) {
      selectedMenu.value.icon = markRaw(iconComp);
    }
  }
}
</script>

<template>
  <div :class="cn('bg-background-light dark:bg-background-dark flex min-h-0 flex-1 flex-col')">
    <!-- 헤더 영역 -->
    <div :class="cn('shrink-0 px-6 pt-6 pb-2')">
      <AppPageHeader title="Menu Management">
        <template #breadcrumb>
          <AppBreadcrumb :items="breadcrumbItems" />
        </template>
      </AppPageHeader>
    </div>

    <!-- 메인 컨텐츠 (좌우 분할) -->
    <div :class="cn('flex flex-1 gap-6 overflow-hidden px-6 pb-6')">
      <!-- 좌측 패널: 메뉴 트리 -->
      <aside
        :class="
          cn(
            'relative z-10 flex w-[40%] min-w-[320px] flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900',
          )
        "
      >
        <!-- 트리 헤더 & 컨트롤 -->
        <div
          :class="
            cn(
              'sticky top-0 z-20 border-b border-slate-200 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-800/20',
            )
          "
        >
          <h2 :class="cn('mb-3 text-sm font-bold text-slate-800 dark:text-white')">
            Menu Hierarchy
          </h2>

          <!-- 검색 -->
          <div :class="cn('relative mb-3')">
            <Search :class="cn('absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400')" />
            <input
              v-model="searchQuery"
              :class="
                cn(
                  'focus:ring-primary focus:border-primary w-full rounded-lg border border-slate-300 bg-white py-2 pr-3 pl-9 text-sm shadow-sm transition-all outline-none focus:ring-2 dark:border-slate-700 dark:bg-slate-900',
                )
              "
              placeholder="Search menu items..."
              type="text"
            />
          </div>

          <!-- 액션 버튼 -->
          <div :class="cn('flex gap-2')">
            <button
              @click="handleExpandAll"
              :class="
                cn(
                  'flex items-center gap-1 rounded-lg border border-transparent bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:border-slate-300 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-slate-600 dark:hover:bg-slate-700',
                )
              "
            >
              <ChevronDown :class="cn('size-3')" /> Expand All
            </button>
            <button
              @click="handleCollapseAll"
              :class="
                cn(
                  'flex items-center gap-1 rounded-lg border border-transparent bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:border-slate-300 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-slate-600 dark:hover:bg-slate-700',
                )
              "
            >
              <ChevronRight :class="cn('size-3')" /> Collapse All
            </button>
          </div>
        </div>

        <!-- 트리 리스트 -->
        <div :class="cn('flex-1 overflow-y-auto p-2 pb-20')">
          <ul :class="cn('space-y-1 select-none')">
            <li v-for="menu in visibleMenuItems" :key="menu.id" :class="cn('group')">
              <div
                @click="selectMenu(menu.id)"
                :class="
                  cn(
                    'relative flex cursor-pointer items-center gap-2 rounded-lg p-2 transition-colors',
                    selectedMenuId === menu.id
                      ? 'bg-primary/10 border-primary/20 border'
                      : 'border border-transparent hover:bg-slate-50 dark:hover:bg-slate-800/50',
                  )
                "
                :style="{ paddingLeft: `${(menu.level || 0) * 16 + 8}px` }"
              >
                <!-- 들여쓰기 가이드 라인 (옵션) -->

                <!-- 드래그 핸들 (Hover 시 표시) -->
                <GripVertical
                  :class="
                    cn(
                      'size-4 cursor-move text-slate-400 opacity-0 transition-opacity group-hover:opacity-100',
                      selectedMenuId === menu.id && 'text-primary opacity-50',
                    )
                  "
                />

                <!-- 펼치기/접기 아이콘 (자식 있을 때만) -->
                <div
                  v-if="hasChildren(menu.id)"
                  @click.stop="toggleExpand(menu.id)"
                  :class="
                    cn(
                      'cursor-pointer rounded p-0.5 transition-colors hover:bg-slate-200 dark:hover:bg-slate-700',
                    )
                  "
                >
                  <component
                    :is="menu.expanded ? ChevronDown : ChevronRight"
                    :class="cn('size-4 text-slate-400')"
                  />
                </div>
                <div v-else :class="cn('w-5')"></div>
                <!-- Spacer -->

                <!-- 폴더/파일 아이콘 -->
                <component
                  :is="
                    menu.icon ||
                    (hasChildren(menu.id) ? (menu.expanded ? FolderOpen : Folder) : FileText)
                  "
                  :class="
                    cn('size-5', selectedMenuId === menu.id ? 'text-primary' : 'text-slate-400')
                  "
                />

                <!-- 메뉴명 -->
                <span
                  :class="
                    cn(
                      'text-sm font-medium',
                      selectedMenuId === menu.id
                        ? 'text-primary'
                        : 'text-slate-700 dark:text-slate-200',
                    )
                  "
                >
                  {{ menu.name }}
                </span>

                <!-- 활성 인디케이터 (선택된 항목) -->
                <div v-if="selectedMenuId === menu.id" :class="cn('ml-auto')">
                  <span :class="cn('bg-primary block h-1.5 w-1.5 rounded-full')"></span>
                </div>
              </div>
            </li>
          </ul>
        </div>

        <!-- 하단 추가 버튼 (Sticky) -->
        <div
          :class="
            cn(
              'absolute bottom-0 w-full border-t border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900',
            )
          "
        >
          <button
            :class="
              cn(
                'bg-primary hover:bg-primary/90 flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white shadow-sm transition-all',
              )
            "
          >
            <Plus :class="cn('size-4')" /> Add Root Menu
          </button>
        </div>
      </aside>

      <!-- 우측 패널: 상세 정보 폼 -->
      <main
        v-if="selectedMenu"
        :class="
          cn(
            'relative flex flex-1 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900',
          )
        "
      >
        <!-- 헤더 -->
        <div
          :class="
            cn(
              'flex shrink-0 items-center justify-between border-b border-slate-200 bg-slate-50/30 px-8 py-6 dark:border-slate-800 dark:bg-slate-800/20',
            )
          "
        >
          <div>
            <h1
              :class="
                cn('flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-white')
              "
            >
              Edit Menu Item
            </h1>
            <p :class="cn('mt-1 text-xs text-slate-500 dark:text-slate-400')">
              Configure details for "{{ selectedMenu.name }}"
            </p>
          </div>
          <div :class="cn('flex items-center gap-2')">
            <AppBadge :variant="selectedMenu.status === 'active' ? 'success' : 'default'">
              {{ selectedMenu.status.toUpperCase() }}
            </AppBadge>
            <AppBadge
              v-if="selectedMenu.visible"
              variant="outline"
              :class="
                cn(
                  'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
                )
              "
            >
              SIDEBAR
            </AppBadge>
          </div>
        </div>

        <!-- 폼 컨텐츠 (스크롤 가능) -->
        <div class="flex-1 overflow-y-auto px-8 py-8 pb-24">
          <div class="mx-auto max-w-3xl space-y-8">
            <!-- 섹션 1: 기본 정보 -->
            <section :class="cn('space-y-6')">
              <h3
                :class="
                  cn(
                    'text-xs font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400',
                  )
                "
              >
                Basic Information
              </h3>
              <div :class="cn('grid grid-cols-1 gap-6')">
                <!-- 상위 메뉴 (Read Only) -->
                <div>
                  <label
                    :class="cn('mb-1.5 block text-sm font-bold text-slate-700 dark:text-slate-300')"
                    >Parent Menu</label
                  >
                  <div
                    :class="
                      cn(
                        'flex cursor-not-allowed items-center gap-2 rounded-lg border border-slate-200 bg-slate-100 px-3 py-2.5 text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400',
                      )
                    "
                  >
                    <FolderOpen v-if="selectedParentMenu" :class="cn('size-4 text-amber-400')" />
                    <span :class="cn('text-sm')">{{
                      selectedParentMenu ? selectedParentMenu.name : 'Root (No Parent)'
                    }}</span>
                  </div>
                </div>

                <div :class="cn('grid grid-cols-2 gap-6')">
                  <!-- 메뉴 코드 -->
                  <div>
                    <label
                      :class="
                        cn('mb-1.5 block text-sm font-bold text-slate-700 dark:text-slate-300')
                      "
                    >
                      Menu Code <span :class="cn('text-red-500')">*</span>
                    </label>
                    <input
                      v-model="selectedMenu.code"
                      type="text"
                      :class="
                        cn(
                          'focus:ring-primary focus:border-primary w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-mono text-sm transition-colors outline-none focus:ring-1 dark:border-slate-700 dark:bg-slate-900',
                        )
                      "
                      placeholder="e.g. sys:menu:list"
                    />
                  </div>
                  <!-- 메뉴 이름 -->
                  <div>
                    <label
                      :class="
                        cn('mb-1.5 block text-sm font-bold text-slate-700 dark:text-slate-300')
                      "
                    >
                      Menu Name <span :class="cn('text-red-500')">*</span>
                    </label>
                    <input
                      v-model="selectedMenu.name"
                      type="text"
                      :class="
                        cn(
                          'focus:ring-primary focus:border-primary w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm transition-colors outline-none focus:ring-1 dark:border-slate-700 dark:bg-slate-900',
                        )
                      "
                      placeholder="Enter menu name"
                    />
                  </div>
                </div>
              </div>
            </section>

            <hr :class="cn('border-slate-100 dark:border-slate-800')" />

            <!-- 섹션 2: 라우팅 및 외관 -->
            <section :class="cn('space-y-6')">
              <h3
                :class="
                  cn(
                    'text-xs font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400',
                  )
                "
              >
                Routing & Appearance
              </h3>

              <div :class="cn('grid grid-cols-1 gap-6')">
                <div :class="cn('grid grid-cols-2 gap-6')">
                  <!-- URL -->
                  <div>
                    <label
                      :class="
                        cn('mb-1.5 block text-sm font-bold text-slate-700 dark:text-slate-300')
                      "
                      >Menu URL</label
                    >
                    <div :class="cn('relative')">
                      <span
                        :class="
                          cn(
                            'pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-sm text-slate-400',
                          )
                        "
                        >/</span
                      >
                      <input
                        v-model="selectedMenu.path"
                        type="text"
                        :class="
                          cn(
                            'focus:ring-primary focus:border-primary w-full rounded-lg border border-slate-300 bg-white px-3 py-2 pl-6 font-mono text-sm transition-colors outline-none focus:ring-1 dark:border-slate-700 dark:bg-slate-900',
                          )
                        "
                        placeholder="path/to/resource"
                      />
                    </div>
                  </div>
                  <!-- Component Path -->
                  <div>
                    <label
                      :class="
                        cn('mb-1.5 block text-sm font-bold text-slate-700 dark:text-slate-300')
                      "
                      >Component Path</label
                    >
                    <input
                      v-model="selectedMenu.component"
                      type="text"
                      :class="
                        cn(
                          'focus:ring-primary focus:border-primary w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-mono text-sm transition-colors outline-none focus:ring-1 dark:border-slate-700 dark:bg-slate-900',
                        )
                      "
                      placeholder="src/views/..."
                    />
                  </div>
                </div>

                <div :class="cn('grid grid-cols-2 gap-6')">
                  <!-- Icon Selector -->
                  <div>
                    <label
                      :class="
                        cn('mb-1.5 block text-sm font-bold text-slate-700 dark:text-slate-300')
                      "
                      >Menu Icon</label
                    >
                    <button
                      :class="
                        cn(
                          'flex w-full items-center justify-between rounded-lg border border-slate-300 bg-white px-3 py-2 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800',
                        )
                      "
                      @click="openIconPicker"
                    >
                      <div :class="cn('flex items-center gap-3')">
                        <div
                          :class="
                            cn(
                              'bg-primary/10 text-primary flex size-6 items-center justify-center rounded',
                            )
                          "
                        >
                          <component :is="selectedMenu.icon || FileText" :class="cn('size-4')" />
                        </div>
                        <span :class="cn('text-sm text-slate-700 dark:text-slate-200')">{{
                          selectedMenu.iconName || 'Select Icon'
                        }}</span>
                      </div>
                      <span :class="cn('text-primary text-xs font-medium')">Change</span>
                    </button>
                  </div>
                  <!-- Sort Order -->
                  <div>
                    <label
                      :class="
                        cn('mb-1.5 block text-sm font-bold text-slate-700 dark:text-slate-300')
                      "
                      >Sort Order</label
                    >
                    <input
                      v-model="selectedMenu.sortOrder"
                      type="number"
                      :class="
                        cn(
                          'focus:ring-primary focus:border-primary w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm transition-colors outline-none focus:ring-1 dark:border-slate-700 dark:bg-slate-900',
                        )
                      "
                    />
                  </div>
                </div>
              </div>
            </section>

            <hr :class="cn('border-slate-100 dark:border-slate-800')" />

            <!-- 섹션 3: 설정 -->
            <section :class="cn('space-y-6')">
              <h3
                :class="
                  cn(
                    'text-xs font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400',
                  )
                "
              >
                Settings
              </h3>
              <div :class="cn('grid grid-cols-1 gap-6 md:grid-cols-2')">
                <!-- Sidebar Toggle -->
                <div
                  :class="
                    cn(
                      'flex items-center justify-between rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900/50',
                    )
                  "
                >
                  <div>
                    <label
                      :class="cn('mb-0.5 block text-sm font-bold text-slate-900 dark:text-white')"
                      >Display in Sidebar</label
                    >
                    <p :class="cn('text-xs text-slate-500')">
                      Show this item in the main navigation sidebar.
                    </p>
                  </div>
                  <label :class="cn('relative inline-flex cursor-pointer items-center')">
                    <input
                      type="checkbox"
                      v-model="selectedMenu.visible"
                      :class="cn('peer sr-only')"
                    />
                    <div
                      :class="
                        cn(
                          'peer peer-checked:bg-primary h-6 w-11 rounded-full bg-slate-200 peer-focus:outline-none after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[\'\'] peer-checked:after:translate-x-full peer-checked:after:border-white rtl:peer-checked:after:-translate-x-full dark:border-gray-600 dark:bg-slate-700',
                        )
                      "
                    ></div>
                  </label>
                </div>

                <!-- Active Status Toggle -->
                <div
                  :class="
                    cn(
                      'flex items-center justify-between rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900/50',
                    )
                  "
                >
                  <div>
                    <label
                      :class="cn('mb-0.5 block text-sm font-bold text-slate-900 dark:text-white')"
                      >Active Status</label
                    >
                    <p :class="cn('text-xs text-slate-500')">
                      Enable or disable this menu item globally.
                    </p>
                  </div>
                  <label :class="cn('relative inline-flex cursor-pointer items-center')">
                    <input
                      type="checkbox"
                      :checked="selectedMenu.status === 'active'"
                      @change="
                        selectedMenu.status = ($event.target as HTMLInputElement).checked
                          ? 'active'
                          : 'inactive'
                      "
                      :class="cn('peer sr-only')"
                    />
                    <div
                      :class="
                        cn(
                          'peer peer-checked:bg-primary h-6 w-11 rounded-full bg-slate-200 peer-focus:outline-none after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[\'\'] peer-checked:after:translate-x-full peer-checked:after:border-white rtl:peer-checked:after:-translate-x-full dark:border-gray-600 dark:bg-slate-700',
                        )
                      "
                    ></div>
                  </label>
                </div>
              </div>
            </section>
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
            <AppButton
              variant="outline"
              :class="cn('border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-900')"
            >
              Cancel
            </AppButton>
            <AppButton @click="handleSave">
              <Save :class="cn('mr-2 size-4')" />
              <span>Save Changes</span>
            </AppButton>
          </div>
        </div>
      </main>

      <!-- 선택된 메뉴 없을 때 Empty State -->
      <div
        v-else
        :class="
          cn(
            'flex flex-1 flex-col items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-400 dark:border-slate-800 dark:bg-slate-900',
          )
        "
      >
        <Settings :class="cn('mb-4 size-16 opacity-20')" />
        <p>Select a menu item to edit details</p>
      </div>
    </div>

    <!-- 아이콘 선택 모달 -->
    <IconPickerModal
      v-model:open="isIconPickerOpen"
      v-model:icon="tempIconName"
      @update:icon="handleIconSelected"
    />
  </div>
</template>
