<script setup lang="ts">
import { computed, type Component } from 'vue';
import { cn } from '@/lib/utils';

const props = withDefaults(
  defineProps<{
    /** v-model 바인딩 값 */
    modelValue?: string;
    /** 플레이스홀더 텍스트 */
    placeholder?: string;
    /** 입력 타입 */
    type?: string;
    /** 왼쪽 아이콘 (lucide-vue-next 컴포넌트) */
    icon?: Component;
    /** 비활성화 여부 */
    disabled?: boolean;
  }>(),
  {
    modelValue: '',
    placeholder: '',
    type: 'text',
    disabled: false,
  },
);

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

const hasIcon = computed(() => !!props.icon);

function handleInput(event: Event) {
  const target = event.target as HTMLInputElement;
  emit('update:modelValue', target.value);
}
</script>

<template>
  <div class="relative w-full">
    <!-- 왼쪽 아이콘 -->
    <component
      :is="icon"
      v-if="hasIcon"
      :class="
        cn(
          'absolute left-3 top-1/2 -translate-y-1/2 text-slate-400',
          'size-4',
        )
      "
    />

    <input
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :class="
        cn(
          'w-full py-2 bg-white dark:bg-slate-900',
          'text-slate-900 dark:text-white',
          'border border-slate-300 dark:border-slate-700',
          'focus:border-primary focus:ring-1 focus:ring-primary',
          'rounded-lg text-sm transition-all shadow-sm',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          hasIcon ? 'pl-9 pr-4' : 'px-4',
        )
      "
      @input="handleInput"
    />
  </div>
</template>
