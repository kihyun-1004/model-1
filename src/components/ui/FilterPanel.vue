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
        'bg-white dark:bg-slate-900 rounded-xl',
        'border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden',
      )
    "
  >
    <!-- 헤더 -->
    <div
      :class="
        cn(
          'px-4 py-3 border-b border-slate-200 dark:border-slate-800',
          'flex items-center justify-between',
          'bg-slate-50 dark:bg-slate-800/50',
        )
      "
    >
      <h2
        :class="
          cn(
            'text-sm font-semibold text-slate-700 dark:text-slate-200',
            'flex items-center gap-2',
          )
        "
      >
        <Filter :class="cn('size-4 text-primary')" />
        {{ title }}
      </h2>

      <button
        :class="
          cn(
            'text-slate-500 hover:text-slate-700',
            'dark:text-slate-400 dark:hover:text-slate-200',
            'flex items-center gap-1 text-sm font-medium',
            'focus:outline-none cursor-pointer',
          )
        "
        @click="toggle"
      >
        <span>Toggle Filters</span>
        <ChevronUp
          :class="
            cn(
              'size-4 transition-transform duration-300',
              isCollapsed && 'rotate-180',
            )
          "
        />
      </button>
    </div>

    <!-- 필터 콘텐츠 (접기/펼치기) -->
    <div
      :class="
        cn(
          'transition-all duration-300 overflow-hidden',
          isCollapsed ? 'max-h-0 opacity-0 py-0' : 'max-h-[500px] opacity-100 p-4',
        )
      "
    >
      <!-- 필터 내용 슬롯 -->
      <slot />
    </div>
  </div>
</template>
