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
      'bg-success text-success-foreground border-transparent',
    default:
      'bg-secondary text-secondary-foreground border-transparent',
    warning:
      'bg-warning text-warning-foreground border-transparent',
    outline:
      'text-foreground border-border',
  };
  return map[props.variant] || map.default;
});

const classes = computed(() =>
  cn(
    'inline-flex items-center rounded border px-1.5 py-0.5 text-[10px] font-semibold',
    variantClasses.value,
  ),
);
</script>

<template>
  <span :class="classes">
    <slot>{{ label }}</slot>
  </span>
</template>
