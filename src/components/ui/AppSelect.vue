<script setup lang="ts">
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-vue-next';

export interface SelectOption {
  /** 옵션 값 */
  value: string;
  /** 표시 텍스트 */
  label: string;
}

withDefaults(
  defineProps<{
    /** v-model 바인딩 값 */
    modelValue?: string;
    /** 선택 옵션 목록 */
    options: SelectOption[];
    /** 기본 플레이스홀더 텍스트 */
    placeholder?: string;
    /** 비활성화 여부 */
    disabled?: boolean;
  }>(),
  {
    modelValue: '',
    placeholder: '선택하세요',
    disabled: false,
  },
);

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

function handleChange(event: Event) {
  const target = event.target as HTMLSelectElement;
  emit('update:modelValue', target.value);
}
</script>

<template>
  <div class="relative w-full">
    <select
      :value="modelValue"
      :disabled="disabled"
      :class="
        cn(
          'w-full pl-3 pr-10 py-2 bg-white dark:bg-slate-900',
          'text-slate-900 dark:text-white',
          'border border-slate-300 dark:border-slate-700',
          'focus:border-primary focus:ring-1 focus:ring-primary',
          'rounded-lg text-sm transition-all shadow-sm',
          'appearance-none cursor-pointer',
          'disabled:opacity-50 disabled:cursor-not-allowed',
        )
      "
      @change="handleChange"
    >
      <option value="">{{ placeholder }}</option>
      <option
        v-for="option in options"
        :key="option.value"
        :value="option.value"
      >
        {{ option.label }}
      </option>
    </select>

    <!-- 커스텀 드롭다운 화살표 아이콘 -->
    <ChevronDown
      :class="
        cn(
          'absolute right-3 top-1/2 -translate-y-1/2',
          'text-slate-400 pointer-events-none size-4',
        )
      "
    />
  </div>
</template>
