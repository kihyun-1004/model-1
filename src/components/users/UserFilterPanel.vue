<script setup lang="ts">
import { cn } from '@/lib/utils';
import { Search, RotateCw } from 'lucide-vue-next';
import AppFilterPanel from '@/components/ui/AppFilterPanel.vue';
import AppInput from '@/components/ui/AppInput.vue';
import AppDateRangePicker from '@/components/ui/AppDateRangePicker.vue';
import AppSelect from '@/components/ui/AppSelect.vue';
import AppButton from '@/components/ui/AppButton.vue';

interface Props {
  searchValue: string;
  dateValue: { start: Date; end: Date } | undefined;
  statusFilter: string;
  statusOptions: { value: string; label: string }[];
}

interface Emits {
  (e: 'update:searchValue', value: string): void;
  (e: 'update:dateValue', value: { start: Date; end: Date } | undefined): void;
  (e: 'update:statusFilter', value: string): void;
  (e: 'refresh'): void;
  (e: 'search'): void;
}

defineProps<Props>();
const emit = defineEmits<Emits>();
</script>

<template>
  <div :class="cn('mb-6')">
    <AppFilterPanel>
      <div :class="cn('flex w-full flex-col items-end gap-4 md:flex-row')">
        <!-- 검색 입력 -->
        <div :class="cn('flex w-full flex-col gap-1.5 md:w-64')">
          <label :class="cn('ml-1 text-xs font-bold text-slate-700 dark:text-slate-300')">
            Search
          </label>
          <AppInput
            :model-value="searchValue"
            @update:model-value="emit('update:searchValue', $event as string)"
            placeholder="Search..."
            :icon="Search"
          />
        </div>
        <!-- 날짜 필터 (Mock) -->
        <div :class="cn('flex w-full flex-col gap-1.5 md:w-72')">
          <label :class="cn('ml-1 text-xs font-bold text-slate-700 dark:text-slate-300')">
            Date Range
          </label>
          <AppDateRangePicker
            :model-value="dateValue"
            @update:model-value="emit('update:dateValue', $event)"
          />
        </div>
        <!-- 상태 필터 -->
        <div :class="cn('flex w-full flex-col gap-1.5 md:w-40')">
          <label :class="cn('ml-1 text-xs font-bold text-slate-700 dark:text-slate-300')">
            Status
          </label>
          <AppSelect
            :model-value="statusFilter"
            @update:model-value="emit('update:statusFilter', $event as string)"
            :options="statusOptions"
            placeholder="All Status"
          />
        </div>

        <!-- 우측 아이콘 버튼 그룹 (Refresh, Search) -->
        <div :class="cn('ml-auto flex items-center gap-1 pb-1')">
          <AppButton
            variant="primary"
            size="icon"
            class="h-11 w-11"
            title="Search"
            @click="emit('search')"
          >
            <Search :class="cn('size-7')" />
          </AppButton>
          <AppButton
            variant="primary"
            size="icon"
            class="h-11 w-11"
            title="Refresh"
            @click="emit('refresh')"
          >
            <RotateCw :class="cn('size-7')" />
          </AppButton>
        </div>
      </div>
    </AppFilterPanel>
  </div>
</template>
