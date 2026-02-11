<script setup lang="ts">
import { cn } from '@/lib/utils';
import { Trash2 } from 'lucide-vue-next';

defineProps<{
  /** 선택된 항목 수 */
  selectedCount: number;
}>();

defineEmits<{
  /** 선택 해제 또는 삭제 등의 액션 */
  delete: [];
}>();
</script>

<template>
  <div
    v-if="selectedCount > 0"
    :class="
      cn(
        'bg-primary/5 border-primary/20 rounded-xl border p-4',
        'flex items-center justify-between',
      )
    "
  >
    <div :class="cn('flex items-center gap-3')">
      <!-- 선택 개수 배지 -->
      <span
        :class="
          cn(
            'flex h-8 w-8 items-center justify-center',
            'bg-primary rounded-full text-sm font-bold text-white',
          )
        "
      >
        {{ selectedCount }}
      </span>
      <span :class="cn('text-sm font-medium text-slate-700 dark:text-slate-300')">
        items selected
      </span>

      <!-- 구분선 -->
      <div :class="cn('mx-2 h-4 w-[1px] bg-slate-300 dark:bg-slate-700')" />

      <!-- 좌측 액션 슬롯 (Export, Change Status 등) -->
      <slot name="actions" />
    </div>

    <!-- 우측: 삭제 버튼 -->
    <div>
      <button
        :class="
          cn(
            'flex items-center gap-1.5 px-3 py-1.5',
            'text-sm font-medium text-red-600',
            'hover:bg-red-50 dark:hover:bg-red-900/20',
            'cursor-pointer rounded-lg transition-colors',
          )
        "
        @click="$emit('delete')"
      >
        <Trash2 :class="cn('size-4')" />
        Delete Selected
      </button>
    </div>
  </div>
</template>
