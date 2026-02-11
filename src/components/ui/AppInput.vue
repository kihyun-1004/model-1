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
    /** 접근성 ID */
    id?: string;
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
      :class="cn('absolute top-1/2 left-3 -translate-y-1/2 text-slate-400', 'size-4')"
    />

    <input
      :id="id"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :class="
        cn(
          'w-full bg-white py-2 dark:bg-slate-900',
          'text-slate-900 dark:text-white',
          'border border-slate-300 dark:border-slate-700',
          'focus:border-primary focus:ring-primary focus:ring-1',
          'rounded-lg text-sm shadow-xs transition-all',
          'disabled:cursor-not-allowed disabled:opacity-50',
          hasIcon ? 'pl-9' : 'pl-4',
          $slots.suffix ? 'pr-9' : 'pr-4',
        )
      "
      @input="handleInput"
    />

    <!-- 오른쪽 슬롯 (아이콘/버튼 등) -->
    <div
      v-if="$slots.suffix"
      :class="
        cn(
          'absolute top-1/2 right-3 -translate-y-1/2 text-slate-400',
          'flex items-center justify-center',
        )
      "
    >
      <slot name="suffix" />
    </div>
  </div>
</template>
