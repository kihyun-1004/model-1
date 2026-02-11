<script setup lang="ts">
import { computed } from 'vue';
import { cn } from '@/lib/utils';

const props = withDefaults(
  defineProps<{
    /** 배지 변형: success(ACTIVE), default(INACTIVE), warning(PENDING) */
    variant?: 'success' | 'default' | 'warning' | 'outline';
    /** 배지 텍스트 (슬롯 대신 사용 가능) */
    label?: string;
  }>(),
  {
    variant: 'default',
  },
);

const variantClasses = computed(() => {
  const map: Record<string, string> = {
    success:
      'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800',
    default:
      'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700',
    warning:
      'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800',
    outline:
      'bg-transparent border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400',
  };
  return map[props.variant] || map.default;
});

const classes = computed(() =>
  cn(
    'inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold border',
    variantClasses.value,
  ),
);
</script>

<template>
  <span :class="classes">
    <slot>{{ label }}</slot>
  </span>
</template>
