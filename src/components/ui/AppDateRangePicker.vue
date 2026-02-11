<script setup lang="ts">
import { computed } from 'vue';
import { DatePicker } from 'v-calendar';
import 'v-calendar/style.css';
import { Calendar as CalendarIcon } from 'lucide-vue-next';
import { format, addDays } from 'date-fns';
import { cn } from '@/lib/utils';
import { useTheme } from '@/composables/useTheme';
import AppButton from '@/components/ui/AppButton.vue';

const props = withDefaults(
  defineProps<{
    modelValue?: { start: Date; end: Date };
  }>(),
  {
    modelValue: () => ({
      start: new Date(),
      end: addDays(new Date(), 7),
    }),
  },
);

const { isDark } = useTheme();

const emit = defineEmits<{
  'update:modelValue': [value: { start: Date; end: Date }];
}>();

const dateRange = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

const formattedDate = computed(() => {
  if (!dateRange.value?.start) return 'Pick a date';
  if (!dateRange.value.end) return format(dateRange.value.start, 'LLL dd, y');
  return `${format(dateRange.value.start, 'LLL dd, y')} - ${format(dateRange.value.end, 'LLL dd, y')}`;
});

const popoverOptions = {
  visibility: 'click',
  placement: 'bottom-start',
  positionFixed: true,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} as any;
</script>

<template>
  <div class="grid gap-2">
    <DatePicker
      v-model.range="dateRange"
      :columns="2"
      v-bind="$attrs"
      :is-dark="isDark"
      :popover="popoverOptions"
    >
      <template #default="{ togglePopover }">
        <AppButton
          variant="outline"
          :class="
            cn(
              'w-full justify-start text-left font-normal',
              !dateRange && 'text-muted-foreground',
              'focus:border-primary focus:ring-primary focus:ring-1 focus-visible:outline-none', // Match AppInput focus style
            )
          "
          @click="togglePopover"
        >
          <CalendarIcon class="mr-2 h-4 w-4" />
          {{ formattedDate }}
        </AppButton>
      </template>
    </DatePicker>
  </div>
</template>

<style>
/* Custom overrides to match shadcn/ui if needed */
.vc-container {
  border-radius: 0.5rem;
  font-family: inherit;
}

/* Force high z-index for popover when using positionFixed */
.vc-popover-content-wrapper {
  z-index: 9999 !important;
}
</style>
