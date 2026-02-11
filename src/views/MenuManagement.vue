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
  GripVertical
} from 'lucide-vue-next';

// 컴포넌트 import
import AppButton from '@/components/ui/AppButton.vue';
import AppBadge from '@/components/ui/AppBadge.vue';
import Breadcrumb, { type BreadcrumbItem } from '@/components/ui/Breadcrumb.vue';
import PageHeader from '@/components/ui/PageHeader.vue';
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
    children: []
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
    children: [] // 런타임에 채워짐 (데모용 정적 리스트에서는 아래 항목들이 자식 개념)
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
    children: []
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
    children: []
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
    children: []
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
    children: []
  }
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
    return items.filter(item =>
      item.name.toLowerCase().includes(query) ||
      item.code.toLowerCase().includes(query)
    );
  }

  // 2. 트리 펼침/접기 필터링
  // 레벨 1 이상의 항목은 부모가 expanded 상태여야 보임.
  // 이 로직은 flat list구조에서 parentId를 참조하여 부모를 찾고 그 부모의 expanded를 확인해야 함.
  // 성능상 Map을 만드는게 좋음.
  const itemMap = new Map(items.map(i => [i.id, i]));

  return items.filter(item => {
    if (item.level === 0) return true; // 루트는 항상 보임

    // 부모를 찾아서 부모가 expanded인지 확인
    let parent = itemMap.get(item.parentId || '');
    while(parent) {
      if (!parent.expanded) return false; // 부모 중 하나라도 접혀있으면 안보임
      if (parent.level === 0) break; // 루트까지 도달
      parent = itemMap.get(parent.parentId || '');
    }
    return true;
  });
});

const selectedMenu = computed(() => {
  return rawMenus.value.find(m => m.id === selectedMenuId.value);
});

const selectedParentMenu = computed(() => {
  if (!selectedMenu.value?.parentId) return null;
  return rawMenus.value.find(m => m.id === selectedMenu.value?.parentId);
});

// ===== 메서드 =====
function toggleExpand(id: string) {
  const item = rawMenus.value.find(m => m.id === id);
  if (item) {
    item.expanded = !item.expanded;
  }
}

function selectMenu(id: string) {
  selectedMenuId.value = id;
}

function handleExpandAll() {
  rawMenus.value.forEach(m => m.expanded = true);
}

function handleCollapseAll() {
  rawMenus.value.forEach(m => m.expanded = false);
}

function handleSave() {
  alert(`Changes saved for menu: ${selectedMenu.value?.name}`);
}

function hasChildren(id: string) {
  return rawMenus.value.some(m => m.parentId === id);
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
  <div :class="cn('flex-1 flex flex-col min-h-0 bg-background-light dark:bg-background-dark')">
    <!-- 헤더 영역 -->
    <div :class="cn('px-6 pt-6 pb-2 shrink-0')">
      <PageHeader title="Menu Management">
        <template #breadcrumb>
          <Breadcrumb :items="breadcrumbItems" />
        </template>
      </PageHeader>
    </div>

    <!-- 메인 컨텐츠 (좌우 분할) -->
    <div :class="cn('flex-1 flex overflow-hidden px-6 pb-6 gap-6')">

      <!-- 좌측 패널: 메뉴 트리 -->
      <aside :class="cn('w-[40%] min-w-[320px] flex flex-col bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden z-10 relative')">
        <!-- 트리 헤더 & 컨트롤 -->
        <div :class="cn('p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 sticky top-0 z-20')">
          <h2 class="text-sm font-bold text-slate-800 dark:text-white mb-3">Menu Hierarchy</h2>

          <!-- 검색 -->
          <div class="relative mb-3">
            <Search :class="cn('absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 size-4')" />
            <input
              v-model="searchQuery"
              class="w-full pl-9 pr-3 py-2 text-sm rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-primary focus:border-primary transition-all shadow-sm outline-none"
              placeholder="Search menu items..."
              type="text"
            />
          </div>

          <!-- 액션 버튼 -->
          <div class="flex gap-2">
            <button
              @click="handleExpandAll"
              class="px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center gap-1 border border-transparent hover:border-slate-300 dark:hover:border-slate-600"
            >
              <ChevronDown :class="cn('size-3')" /> Expand All
            </button>
            <button
              @click="handleCollapseAll"
              class="px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center gap-1 border border-transparent hover:border-slate-300 dark:hover:border-slate-600"
            >
              <ChevronRight :class="cn('size-3')" /> Collapse All
            </button>
          </div>
        </div>

        <!-- 트리 리스트 -->
        <div class="flex-1 overflow-y-auto p-2 pb-20">
          <ul class="space-y-1 select-none">
            <li v-for="menu in visibleMenuItems" :key="menu.id" class="group">
              <div
                @click="selectMenu(menu.id)"
                :class="cn(
                  'flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors relative',
                  selectedMenuId === menu.id
                    ? 'bg-primary/10 border border-primary/20'
                    : 'hover:bg-slate-50 dark:hover:bg-slate-800/50 border border-transparent'
                )"
                :style="{ paddingLeft: `${(menu.level || 0) * 16 + 8}px` }"
              >
                <!-- 들여쓰기 가이드 라인 (옵션) -->

                <!-- 드래그 핸들 (Hover 시 표시) -->
                <GripVertical :class="cn('text-slate-400 size-4 opacity-0 group-hover:opacity-100 cursor-move transition-opacity', selectedMenuId === menu.id && 'opacity-50 text-primary')" />

                <!-- 펼치기/접기 아이콘 (자식 있을 때만) -->
                <div
                  v-if="hasChildren(menu.id)"
                  @click.stop="toggleExpand(menu.id)"
                  class="p-0.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                >
                  <component :is="menu.expanded ? ChevronDown : ChevronRight" :class="cn('size-4 text-slate-400')" />
                </div>
                <div v-else class="w-5"></div> <!-- Spacer -->

                <!-- 폴더/파일 아이콘 -->
                <component
                  :is="menu.icon || (hasChildren(menu.id) ? (menu.expanded ? FolderOpen : Folder) : FileText)"
                  :class="cn('size-5', selectedMenuId === menu.id ? 'text-primary' : 'text-slate-400')"
                />

                <!-- 메뉴명 -->
                <span :class="cn('text-sm font-medium', selectedMenuId === menu.id ? 'text-primary' : 'text-slate-700 dark:text-slate-200')">
                  {{ menu.name }}
                </span>

                <!-- 활성 인디케이터 (선택된 항목) -->
                <div v-if="selectedMenuId === menu.id" class="ml-auto">
                   <span class="w-1.5 h-1.5 rounded-full bg-primary block"></span>
                </div>
              </div>
            </li>
          </ul>
        </div>

        <!-- 하단 추가 버튼 (Sticky) -->
        <div :class="cn('p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 absolute bottom-0 w-full')">
          <button class="w-full flex items-center justify-center gap-2 py-2 px-4 bg-primary hover:bg-primary/90 text-white rounded-lg shadow-sm transition-all text-sm font-medium">
            <Plus :class="cn('size-4')" /> Add Root Menu
          </button>
        </div>
      </aside>

      <!-- 우측 패널: 상세 정보 폼 -->
      <main v-if="selectedMenu" :class="cn('flex-1 flex flex-col bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden relative')">
        <!-- 헤더 -->
        <div :class="cn('px-8 py-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-800/20 shrink-0 flex items-center justify-between')">
          <div>
            <h1 class="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              Edit Menu Item
            </h1>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Configure details for "{{ selectedMenu.name }}"</p>
          </div>
          <div class="flex items-center gap-2">
            <AppBadge :variant="selectedMenu.status === 'active' ? 'success' : 'default'">
              {{ selectedMenu.status.toUpperCase() }}
            </AppBadge>
            <AppBadge v-if="selectedMenu.visible" variant="outline" class="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800">
              SIDEBAR
            </AppBadge>
          </div>
        </div>

        <!-- 폼 컨텐츠 (스크롤 가능) -->
        <div class="flex-1 overflow-y-auto px-8 py-8 pb-24">
          <div class="max-w-3xl mx-auto space-y-8">

            <!-- 섹션 1: 기본 정보 -->
            <section class="space-y-6">
              <h3 class="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Basic Information</h3>
              <div class="grid grid-cols-1 gap-6">
                <!-- 상위 메뉴 (Read Only) -->
                <div>
                  <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">Parent Menu</label>
                  <div class="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 cursor-not-allowed">
                     <FolderOpen v-if="selectedParentMenu" class="size-4 text-amber-400" />
                     <span class="text-sm">{{ selectedParentMenu ? selectedParentMenu.name : 'Root (No Parent)' }}</span>
                  </div>
                </div>

                <div class="grid grid-cols-2 gap-6">
                  <!-- 메뉴 코드 -->
                  <div>
                    <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Menu Code <span class="text-red-500">*</span>
                    </label>
                    <input
                      v-model="selectedMenu.code"
                      type="text"
                      class="font-mono w-full px-3 py-2 text-sm rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-colors"
                      placeholder="e.g. sys:menu:list"
                    >
                  </div>
                  <!-- 메뉴 이름 -->
                  <div>
                    <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Menu Name <span class="text-red-500">*</span>
                    </label>
                    <input
                      v-model="selectedMenu.name"
                      type="text"
                      class="w-full px-3 py-2 text-sm rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-colors"
                      placeholder="Enter menu name"
                    >
                  </div>
                </div>
              </div>
            </section>

            <hr class="border-slate-100 dark:border-slate-800" />

            <!-- 섹션 2: 라우팅 및 외관 -->
            <section class="space-y-6">
              <h3 class="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Routing & Appearance</h3>

              <div class="grid grid-cols-1 gap-6">
                <div class="grid grid-cols-2 gap-6">
                  <!-- URL -->
                  <div>
                    <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">Menu URL</label>
                    <div class="relative">
                      <span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 text-sm">/</span>
                      <input
                        v-model="selectedMenu.path"
                        type="text"
                        class="pl-6 w-full px-3 py-2 text-sm font-mono rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-colors"
                        placeholder="path/to/resource"
                      >
                    </div>
                  </div>
                  <!-- Component Path -->
                  <div>
                    <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">Component Path</label>
                    <input
                      v-model="selectedMenu.component"
                      type="text"
                      class="w-full px-3 py-2 text-sm font-mono rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-colors"
                      placeholder="src/views/..."
                    >
                  </div>
                </div>

                <div class="grid grid-cols-2 gap-6">
                   <!-- Icon Selector -->
                   <div>
                    <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">Menu Icon</label>
                    <button
                      class="w-full flex items-center justify-between px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                      @click="openIconPicker"
                    >
                      <div class="flex items-center gap-3">
                        <div class="size-6 rounded bg-primary/10 flex items-center justify-center text-primary">
                          <component :is="selectedMenu.icon || FileText" class="size-4" />
                        </div>
                        <span class="text-sm text-slate-700 dark:text-slate-200">{{ selectedMenu.iconName || 'Select Icon' }}</span>
                      </div>
                      <span class="text-xs text-primary font-medium">Change</span>
                    </button>
                   </div>
                   <!-- Sort Order -->
                   <div>
                    <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">Sort Order</label>
                    <input
                      v-model="selectedMenu.sortOrder"
                      type="number"
                      class="w-full px-3 py-2 text-sm rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-colors"
                    >
                   </div>
                </div>
              </div>
            </section>

            <hr class="border-slate-100 dark:border-slate-800" />

            <!-- 섹션 3: 설정 -->
            <section class="space-y-6">
              <h3 class="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Settings</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Sidebar Toggle -->
                <div class="flex items-center justify-between p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50">
                   <div>
                     <label class="block text-sm font-bold text-slate-900 dark:text-white mb-0.5">Display in Sidebar</label>
                     <p class="text-xs text-slate-500">Show this item in the main navigation sidebar.</p>
                   </div>
                   <label class="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" v-model="selectedMenu.visible" class="sr-only peer">
                      <div class="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                   </label>
                </div>

                <!-- Active Status Toggle -->
                <div class="flex items-center justify-between p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50">
                  <div>
                    <label class="block text-sm font-bold text-slate-900 dark:text-white mb-0.5">Active Status</label>
                    <p class="text-xs text-slate-500">Enable or disable this menu item globally.</p>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer">
                     <input type="checkbox" :checked="selectedMenu.status === 'active'" @change="selectedMenu.status = ($event.target as HTMLInputElement).checked ? 'active' : 'inactive'" class="sr-only peer">
                     <div class="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                  </label>
               </div>
              </div>
            </section>
          </div>
        </div>

        <!-- 하단 액션 바 (Floating) -->
        <div :class="cn('absolute bottom-0 right-0 left-0 p-6 bg-linear-to-t from-white dark:from-slate-900 via-white/95 dark:via-slate-900/95 to-transparent pointer-events-none rounded-b-xl z-20')">
          <div class="flex justify-end gap-3 pointer-events-auto">
            <AppButton variant="outline" class="bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700">
               Cancel
            </AppButton>
            <AppButton @click="handleSave">
               <Save :class="cn('size-4 mr-2')" />
               <span>Save Changes</span>
            </AppButton>
          </div>
        </div>
      </main>

      <!-- 선택된 메뉴 없을 때 Empty State -->
      <div v-else :class="cn('flex-1 flex flex-col items-center justify-center bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-400')">
         <Settings class="size-16 mb-4 opacity-20" />
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
