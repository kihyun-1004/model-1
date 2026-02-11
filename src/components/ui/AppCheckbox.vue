<script setup lang="ts">
import { cn } from '@/lib/utils';

withDefaults(
  defineProps<{
    /** v-model 바인딩 값 */
    modelValue?: boolean;
    /** 부분 선택 상태 (전체 선택 체크박스에 사용) */
    indeterminate?: boolean;
  }>(),
  {
    modelValue: false,
    indeterminate: false,
  },
);

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
}>();

function handleChange(event: Event) {
  const target = event.target as HTMLInputElement;
  emit('update:modelValue', target.checked);
}
</script>

<template>
  <input
    type="checkbox"
    :checked="modelValue"
    :indeterminate="indeterminate"
    :class="
      cn('custom-checkbox text-primary focus:ring-primary h-4 w-4 rounded-sm border-slate-400')
    "
    @change="handleChange"
  />
</template>
