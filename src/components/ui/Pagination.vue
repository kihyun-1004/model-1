<script setup lang="ts">
import { computed } from 'vue';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-vue-next';

const props = withDefaults(
  defineProps<{
    /** 현재 페이지 번호 (1부터 시작) */
    currentPage: number;
    /** 전체 페이지 수 */
    totalPages: number;
    /** 전체 결과 수 */
    totalItems?: number;
    /** 페이지당 항목 수 */
    pageSize?: number;
  }>(),
  {
    totalItems: 0,
    pageSize: 12,
  },
);

const emit = defineEmits<{
  'update:currentPage': [page: number];
}>();

// 표시할 페이지 번호 목록 계산
const visiblePages = computed(() => {
  const pages: (number | '...')[] = [];
  const total = props.totalPages;
  const current = props.currentPage;

  if (total <= 5) {
    // 총 5페이지 이하면 모두 표시
    for (let i = 1; i <= total; i++) pages.push(i);
  } else {
    // 항상 1페이지 표시
    pages.push(1);

    if (current > 3) pages.push('...');

    // 현재 페이지 주변
    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);
    for (let i = start; i <= end; i++) pages.push(i);

    if (current < total - 2) pages.push('...');

    // 항상 마지막 페이지 표시
    pages.push(total);
  }

  return pages;
});

// 결과 문자열 (예: "Showing 1 to 12 of 120 results")
const resultText = computed(() => {
  if (!props.totalItems) return '';
  const start = (props.currentPage - 1) * props.pageSize + 1;
  const end = Math.min(props.currentPage * props.pageSize, props.totalItems);
  return `Showing ${start} to ${end} of ${props.totalItems} results`;
});

function goToPage(page: number) {
  if (page >= 1 && page <= props.totalPages && page !== props.currentPage) {
    emit('update:currentPage', page);
  }
}
</script>

<template>
  <div
    :class="
      cn(
        'bg-slate-50 px-6 py-4 dark:bg-slate-800/50',
        'border-t border-slate-200 dark:border-slate-800',
        'flex items-center justify-between',
      )
    "
  >
    <!-- 결과 텍스트 -->
    <p :class="cn('text-sm text-slate-500')">
      {{ resultText }}
    </p>

    <!-- 페이지 버튼 -->
    <div :class="cn('flex items-center gap-2')">
      <!-- 이전 버튼 -->
      <button
        :class="
          cn(
            'rounded-lg border border-slate-200 p-1 dark:border-slate-700',
            'transition-colors hover:bg-white dark:hover:bg-slate-700',
            'disabled:cursor-not-allowed disabled:opacity-50',
          )
        "
        :disabled="currentPage <= 1"
        @click="goToPage(currentPage - 1)"
      >
        <ChevronLeft :class="cn('size-5')" />
      </button>

      <!-- 페이지 번호들 -->
      <template v-for="(page, index) in visiblePages" :key="index">
        <!-- 생략 부호 -->
        <span
          v-if="page === '...'"
          :class="cn('rounded-lg px-3 py-1 text-sm font-medium text-slate-600 dark:text-slate-400')"
        >
          ...
        </span>

        <!-- 페이지 번호 버튼 -->
        <button
          v-else
          :class="
            cn(
              'rounded-lg px-3 py-1 text-sm font-medium transition-colors',
              page === currentPage
                ? 'bg-primary text-white'
                : 'text-slate-600 hover:bg-white dark:text-slate-400 dark:hover:bg-slate-700',
            )
          "
          @click="goToPage(page)"
        >
          {{ page }}
        </button>
      </template>

      <!-- 다음 버튼 -->
      <button
        :class="
          cn(
            'rounded-lg border border-slate-200 p-1 dark:border-slate-700',
            'transition-colors hover:bg-white dark:hover:bg-slate-700',
            'disabled:cursor-not-allowed disabled:opacity-50',
          )
        "
        :disabled="currentPage >= totalPages"
        @click="goToPage(currentPage + 1)"
      >
        <ChevronRight :class="cn('size-5')" />
      </button>
    </div>
  </div>
</template>
