<script setup lang="ts">
import { computed } from 'vue';
import { cn } from '@/lib/utils';

const props = withDefaults(
  defineProps<{
    /** 버튼 변형 스타일 */
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'icon' | 'outline';
    /** 버튼 크기 */
    size?: 'sm' | 'md' | 'lg' | 'icon';
    /** 비활성화 여부 */
    disabled?: boolean;
    /** 추가 클래스 */
    class?: string;
  }>(),
  {
    variant: 'primary',
    size: 'md',
    disabled: false,
    class: '',
  },
);

defineEmits<{
  click: [event: MouseEvent];
}>();

// 변형별 스타일 매핑
const variantClasses = computed(() => {
  const map: Record<string, string> = {
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm',
    secondary:
      'bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-sm',
    ghost:
      'hover:bg-accent hover:text-accent-foreground',
    danger: 'bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm',
    icon: 'hover:bg-accent hover:text-accent-foreground rounded',
    outline:
      'border border-input bg-transparent shadow-sm hover:bg-accent hover:text-accent-foreground',
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
    icon: 'h-9 w-9 p-0',
  };
  return map[props.size] || map.md;
});

const classes = computed(() =>
  cn(
    'inline-flex cursor-pointer items-center justify-center rounded-lg font-medium transition-all',
    'disabled:cursor-not-allowed disabled:opacity-50',
    variantClasses.value,
    sizeClasses.value,
    props.class,
  ),
);
</script>

<template>
  <button :class="classes" :disabled="disabled" @click="$emit('click', $event)">
    <slot />
  </button>
</template>
