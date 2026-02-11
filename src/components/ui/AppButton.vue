<script setup lang="ts">
import { computed } from 'vue';
import { cn } from '@/lib/utils';

const props = withDefaults(
  defineProps<{
    /** 버튼 변형 스타일 */
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'icon' | 'outline';
    /** 버튼 크기 */
    size?: 'sm' | 'md' | 'lg';
    /** 비활성화 여부 */
    disabled?: boolean;
  }>(),
  {
    variant: 'primary',
    size: 'md',
    disabled: false,
  },
);

defineEmits<{
  click: [event: MouseEvent];
}>();

// 변형별 스타일 매핑
const variantClasses = computed(() => {
  const map: Record<string, string> = {
    primary:
      'bg-primary hover:bg-primary/90 text-white shadow-sm',
    secondary:
      'bg-slate-800 dark:bg-slate-700 hover:bg-slate-700 dark:hover:bg-slate-600 text-white shadow-sm',
    ghost:
      'text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700',
    danger:
      'bg-red-600 hover:bg-red-700 text-white shadow-sm',
    icon:
      'text-slate-400 hover:text-primary hover:bg-slate-200 dark:hover:bg-slate-700 rounded',
    outline:
      'bg-transparent border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-sm',
  };
  return map[props.variant] || map.primary;
});

// 크기별 스타일 매핑
const sizeClasses = computed(() => {
  if (props.variant === 'icon') {
    const map: Record<string, string> = {
      sm: 'p-0.5',
      md: 'p-1',
      lg: 'p-2',
    };
    return map[props.size] || map.md;
  }
  const map: Record<string, string> = {
    sm: 'px-3 py-1.5 text-xs gap-1',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-5 py-2.5 text-base gap-2',
  };
  return map[props.size] || map.md;
});

const classes = computed(() =>
  cn(
    'inline-flex items-center font-medium rounded-lg transition-all cursor-pointer',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    variantClasses.value,
    sizeClasses.value,
  ),
);
</script>

<template>
  <button
    :class="classes"
    :disabled="disabled"
    @click="$emit('click', $event)"
  >
    <slot />
  </button>
</template>
