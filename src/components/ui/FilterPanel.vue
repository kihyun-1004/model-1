<script setup lang="ts">
import { ref } from 'vue';
import { cn } from '@/lib/utils';
import { Filter, ChevronUp } from 'lucide-vue-next';

withDefaults(
  defineProps<{
    /** 패널 제목 */
    title?: string;
    /** 초기 접힘 상태 */
    defaultCollapsed?: boolean;
  }>(),
  {
    title: 'Filters',
    defaultCollapsed: false,
  },
);

const isCollapsed = ref(false);

function toggle() {
  isCollapsed.value = !isCollapsed.value;
}
</script>

<template>
  <div
    :class="
      cn(
        'rounded-xl bg-white dark:bg-slate-900',
        'overflow-hidden border border-slate-200 shadow-sm dark:border-slate-800',
      )
    "
  >
    <!-- 헤더 -->
    <div
      :class="
        cn(
          'border-b border-slate-200 px-4 py-3 dark:border-slate-800',
          'flex items-center justify-between',
          'bg-slate-50 dark:bg-slate-800/50',
        )
      "
    >
      <h2
        :class="
          cn('text-sm font-semibold text-slate-700 dark:text-slate-200', 'flex items-center gap-2')
        "
      >
        <Filter :class="cn('text-primary size-4')" />
        {{ title }}
      </h2>

      <button
        :class="
          cn(
            'text-slate-500 hover:text-slate-700',
            'dark:text-slate-400 dark:hover:text-slate-200',
            'flex items-center gap-1 text-sm font-medium',
            'cursor-pointer focus:outline-none',
          )
        "
        @click="toggle"
      >
        <span>Toggle Filters</span>
        <ChevronUp
          :class="cn('size-4 transition-transform duration-300', isCollapsed && 'rotate-180')"
        />
      </button>
    </div>

    <!-- 필터 콘텐츠 (접기/펼치기) -->
    <div
      :class="
        cn(
          'overflow-hidden transition-all duration-300',
          isCollapsed ? 'max-h-0 py-0 opacity-0' : 'max-h-[500px] p-4 opacity-100',
        )
      "
    >
      <!-- 필터 내용 슬롯 -->
      <slot />
    </div>
  </div>
</template>
