<script setup lang="ts">
import { cn } from '@/lib/utils';
import { Menu, Search, Bell, Moon, Sun } from 'lucide-vue-next';
import { useTheme } from '@/composables/useTheme';
import { useSidebar } from '@/composables/useSidebar';

// 전역 상태 Composable 사용
const { isDark, toggleTheme } = useTheme();
const { toggleSidebar } = useSidebar();
</script>

<template>
  <header
    :class="
      cn(
        'h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800',
        'flex items-center justify-between px-6 shrink-0 relative z-20',
      )
    "
  >
    <!-- 좌측: 메뉴 토글 & 검색 -->
    <div :class="cn('flex items-center gap-4 flex-1')">
      <!--
        사이드바 토글 버튼
        클릭 시 useSidebar의 toggleSidebar 함수 호출
      -->
      <button
        @click="toggleSidebar"
        :class="
          cn(
            'p-2 -ml-2 text-slate-500 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors',
          )
        "
      >
        <Menu :class="cn('size-6')" />
      </button>

      <!-- 검색 입력창 (데스크탑 전용) -->
      <div :class="cn('max-w-xl w-full hidden md:block')">
        <div :class="cn('relative')">
          <Search
            :class="
              cn(
                'absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 size-5',
              )
            "
          />
          <input
            type="text"
            placeholder="Search data, users, or reports..."
            :class="
              cn(
                'w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800',
                'border-transparent focus:border-primary focus:ring-0',
                'rounded-lg text-sm transition-all focus:bg-white dark:focus:bg-slate-900',
                'placeholder:text-slate-400 dark:placeholder:text-slate-500',
                'text-slate-900 dark:text-white',
              )
            "
          />
        </div>
      </div>
    </div>

    <!-- 우측: 액션 버튼들 -->
    <div :class="cn('flex items-center gap-2 sm:gap-4')">
      <!-- 알림 버튼 (뱃지 포함) -->
      <button
        :class="
          cn(
            'relative p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors',
          )
        "
      >
        <Bell :class="cn('size-5')" />
        <span
          :class="
            cn(
              'absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900',
            )
          "
        ></span>
      </button>

      <!-- 구분선 -->
      <div :class="cn('h-6 w-px bg-slate-200 dark:bg-slate-700 mx-1')"></div>

      <!-- 다크모드/라이트모드 토글 버튼 -->
      <button
        @click="toggleTheme"
        :class="
          cn(
            'p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors',
          )
        "
      >
        <!-- isDark 상태에 따라 아이콘 변경 -->
        <Moon v-if="!isDark" :class="cn('size-5')" />
        <Sun v-else :class="cn('size-5')" />
      </button>

      <!-- 프로필 (퍼블리싱엔 없었지만 일반적인 패턴으로 추가 가능, 일단 생략 또는 공간 확보) -->
    </div>
  </header>
</template>
