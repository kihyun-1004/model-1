<script setup lang="ts">
import { cn } from '@/lib/utils';

defineProps<{
  /** 페이지 제목 */
  title: string;
}>();
</script>

<template>
  <div :class="cn('mb-6')">
    <!-- 브레드크럼 슬롯 -->
    <slot name="breadcrumb" />

    <div :class="cn('flex items-center justify-between')">
      <h1 :class="cn('text-2xl font-bold text-slate-900 dark:text-white')">
        {{ title }}
      </h1>

      <!-- 우측 액션 슬롯 (예: "Add New User" 버튼) -->
      <div :class="cn('flex items-center gap-2')">
        <slot name="actions" />
      </div>
    </div>
  </div>
</template>
