<script setup lang="ts">
import { computed } from 'vue';
import { cn } from '@/lib/utils';

const props = withDefaults(
  defineProps<{
    /** 표시할 이니셜 (예: "JS", "ER") */
    initials: string;
    /** 색상 테마 */
    color?:
      | 'blue'
      | 'slate'
      | 'purple'
      | 'orange'
      | 'teal'
      | 'indigo'
      | 'red'
      | 'cyan'
      | 'pink'
      | 'lime'
      | 'gray'
      | 'amber';
    /** 아바타 크기 */
    size?: 'sm' | 'md' | 'lg';
  }>(),
  {
    color: 'blue',
    size: 'sm',
  },
);

// 색상별 배경/텍스트/테두리 매핑
const colorClasses = computed(() => {
  const map: Record<string, string> = {
    blue: 'bg-blue-100 text-primary border-blue-200',
    slate: 'bg-slate-100 text-slate-500 border-slate-200',
    purple: 'bg-purple-100 text-purple-600 border-purple-200',
    orange: 'bg-orange-100 text-orange-600 border-orange-200',
    teal: 'bg-teal-100 text-teal-600 border-teal-200',
    indigo: 'bg-indigo-100 text-indigo-600 border-indigo-200',
    red: 'bg-red-100 text-red-600 border-red-200',
    cyan: 'bg-cyan-100 text-cyan-600 border-cyan-200',
    pink: 'bg-pink-100 text-pink-600 border-pink-200',
    lime: 'bg-lime-100 text-lime-600 border-lime-200',
    gray: 'bg-gray-100 text-gray-600 border-gray-200',
    amber: 'bg-amber-100 text-amber-600 border-amber-200',
  };
  return map[props.color] || map.blue;
});

// 크기별 스타일 매핑
const sizeClasses = computed(() => {
  const map: Record<string, string> = {
    sm: 'w-6 h-6 text-[10px]',
    md: 'w-8 h-8 text-xs',
    lg: 'w-10 h-10 text-sm',
  };
  return map[props.size] || map.sm;
});

const classes = computed(() =>
  cn(
    'flex shrink-0 items-center justify-center rounded-full border font-bold',
    colorClasses.value,
    sizeClasses.value,
  ),
);
</script>

<template>
  <div :class="classes">
    {{ initials }}
  </div>
</template>
