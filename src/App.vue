<script setup lang="ts">
import { onMounted } from 'vue';
import { useTheme } from '@/composables/useTheme';
import { cn } from '@/lib/utils';

const { initTheme } = useTheme();

onMounted(() => {
  initTheme();
});
</script>

<template>
  <div
    :class="
      cn(
        'bg-background-light dark:bg-background-dark min-h-screen font-sans text-slate-900 antialiased dark:text-slate-50',
      )
    "
  >
    <RouterView />
  </div>
</template>

<style scoped></style>
