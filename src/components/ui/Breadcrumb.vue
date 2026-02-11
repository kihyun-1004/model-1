<script setup lang="ts">
import { cn } from '@/lib/utils';

export interface BreadcrumbItem {
  /** 표시 텍스트 */
  label: string;
  /** 링크 URL (마지막 항목은 생략 가능) */
  href?: string;
}

defineProps<{
  /** 브레드크럼 항목 목록 */
  items: BreadcrumbItem[];
}>();
</script>

<template>
  <nav :class="cn('mb-2 flex text-sm text-slate-500')">
    <template v-for="(item, index) in items" :key="index">
      <!-- 구분자 -->
      <span v-if="index > 0" :class="cn('mx-2 text-slate-300 dark:text-slate-600')"> / </span>

      <!-- 링크 항목 (마지막이 아닌 경우) -->
      <a
        v-if="item.href && index < items.length - 1"
        :href="item.href"
        :class="cn('hover:text-primary transition-colors')"
      >
        {{ item.label }}
      </a>

      <!-- 현재 페이지 (마지막 항목) -->
      <span
        v-else
        :class="
          cn(
            index === items.length - 1
              ? 'font-medium text-slate-900 dark:text-white'
              : 'hover:text-primary cursor-pointer transition-colors',
          )
        "
      >
        {{ item.label }}
      </span>
    </template>
  </nav>
</template>
