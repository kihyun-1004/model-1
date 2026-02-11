<script setup lang="ts">
import { ref, type Component } from 'vue';
import { useRoute } from 'vue-router';
import { cn } from '@/lib/utils';
import {
  Layers,
  LayoutDashboard,
  Users,
  ChevronDown,
  ChartPie,
  Package,
  Settings,
  HelpCircle,
} from 'lucide-vue-next';
import { useSidebar } from '@/composables/useSidebar';

// 사이드바 전역 상태 가져오기
const { isOpen } = useSidebar();

// 현재 라우트 정보 (Active 메뉴 표시용)
const route = useRoute();

/**
 * 메뉴 아이템 인터페이스 정의
 */
interface MenuItem {
  title: string;
  icon: Component; // Lucide 아이콘 컴포넌트 타입
  to?: string; // 이동할 경로 (서브메뉴가 없을 때)
  children?: { title: string; to: string }[]; // 서브메뉴 목록
}

/**
 * 메인 네비게이션 메뉴 데이터
 */
const menuItems: MenuItem[] = [
  {
    title: 'Dashboard',
    icon: LayoutDashboard,
    to: '/',
  },
  {
    title: 'Users',
    icon: Users,
    children: [
      { title: 'All Users', to: '/users' },
      { title: 'Roles & Permissions', to: '/permissions' },
      { title: 'Activity Logs', to: '#' },
    ],
  },
  {
    title: 'System',
    icon: Settings,
    children: [
      { title: 'Menu Management', to: '/menus' },
      { title: 'Settings', to: '#' },
    ],
  },
  {
    title: 'Analytics',
    icon: ChartPie,
    to: '#',
  },
  {
    title: 'Inventory',
    icon: Package,
    to: '#',
  },
];

/**
 * 하단 시스템 메뉴 데이터
 */
const systemMenuItems: MenuItem[] = [
  {
    title: 'Help Center',
    icon: HelpCircle,
    to: '#',
  },
];

// 서브메뉴 열림/닫힘 상태 관리 (기본적으로 Users는 열려있음)
// key: 메뉴 제목, value: 열림 여부
const openMenus = ref<Record<string, boolean>>({
  Users: true,
});

/**
 * 서브메뉴 토글 함수
 */
function toggleMenu(title: string) {
  openMenus.value[title] = !openMenus.value[title];
}

/**
 * 메뉴 활성 상태 확인 함수
 * - 현재 경로가 메뉴의 'to'와 일치하거나
 * - 자식 메뉴 중 일치하는 것이 있으면 true 반환
 */
function isActive(item: MenuItem) {
  if (item.to && item.to !== '#') {
    return route.path === item.to;
  }
  if (item.children) {
    return item.children.some((child) => route.path === child.to);
  }
  return false;
}

/**
 * 서브메뉴 항목 활성 상태 확인 함수
 */
function isChildActive(to: string) {
  return route.path === to;
}
</script>

<template>
  <aside
    :class="
      cn(
        'flex shrink-0 flex-col bg-white transition-all duration-300 dark:bg-slate-900',
        // isOpen 값에 따라 너비 조절 (w-64 <-> w-0)
        isOpen
          ? 'w-64 border-r border-slate-200 dark:border-slate-800'
          : 'w-0 overflow-hidden border-none opacity-0',
      )
    "
  >
    <!-- 로고 영역 -->
    <div :class="cn('flex h-16 items-center border-b border-slate-200 px-6 dark:border-slate-800')">
      <div :class="cn('flex items-center gap-2')">
        <div :class="cn('bg-primary flex h-8 w-8 items-center justify-center rounded-lg')">
          <Layers :class="cn('size-5 text-white')" />
        </div>
        <span :class="cn('text-xl font-bold tracking-tight text-slate-800 dark:text-white')">
          Nexus
        </span>
      </div>
    </div>

    <!-- 네비게이션 영역 -->
    <nav :class="cn('scrollbar-hide flex-1 space-y-1 overflow-y-auto px-4 py-6')">
      <template v-for="item in menuItems" :key="item.title">
        <!-- 단일 메뉴 (서브메뉴 없음) -->
        <RouterLink
          v-if="!item.children"
          :to="item.to || '#'"
          :class="
            cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 transition-colors',
              isActive(item)
                ? 'bg-primary/10 text-primary font-medium'
                : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800',
            )
          "
        >
          <component :is="item.icon" :class="cn('size-5')" />
          <span :class="cn('font-medium')">{{ item.title }}</span>
        </RouterLink>

        <!-- 서브메뉴가 있는 메뉴 (아코디언 형태) -->
        <div v-else>
          <button
            @click="toggleMenu(item.title)"
            :class="
              cn(
                'flex w-full items-center justify-between rounded-lg px-3 py-2 transition-colors',
                isActive(item)
                  ? 'bg-primary/10 text-primary font-medium'
                  : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800',
              )
            "
          >
            <div :class="cn('flex items-center gap-3')">
              <component :is="item.icon" :class="cn('size-5')" />
              <span :class="cn('font-medium')">{{ item.title }}</span>
            </div>
            <!-- 화살표 아이콘 (열림 상태에 따라 180도 회전) -->
            <ChevronDown
              :class="
                cn(
                  'size-4 transition-transform duration-200',
                  openMenus[item.title] ? 'rotate-180 transform' : '',
                )
              "
            />
          </button>

          <!-- 서브메뉴 목록 (조건부 렌더링) -->
          <div
            v-if="openMenus[item.title]"
            :class="cn('border-primary/20 mt-1 ml-9 space-y-1 border-l-2')"
          >
            <RouterLink
              v-for="child in item.children"
              :key="child.title"
              :to="child.to"
              :class="
                cn(
                  'block rounded-r-lg px-4 py-2 text-sm transition-colors',
                  isChildActive(child.to)
                    ? 'text-primary bg-primary/5 font-medium'
                    : 'hover:text-primary text-slate-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800/50',
                )
              "
            >
              {{ child.title }}
            </RouterLink>
          </div>
        </div>
      </template>

      <!-- 시스템 메뉴 구분선 -->
      <div :class="cn('pt-4 pb-2')">
        <p :class="cn('px-3 text-xs font-semibold tracking-wider text-slate-400 uppercase')">
          System
        </p>
      </div>

      <!-- 시스템 메뉴 -->
      <RouterLink
        v-for="item in systemMenuItems"
        :key="item.title"
        :to="item.to || '#'"
        :class="
          cn(
            'flex items-center gap-3 rounded-lg px-3 py-2 transition-colors',
            isActive(item)
              ? 'bg-primary/10 text-primary font-medium'
              : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800',
          )
        "
      >
        <component :is="item.icon" :class="cn('size-5')" />
        <span :class="cn('font-medium')">{{ item.title }}</span>
      </RouterLink>
    </nav>
  </aside>
</template>
