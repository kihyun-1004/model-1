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
        'bg-background min-h-screen font-sans text-foreground antialiased',
      )
    "
  >
    <RouterView />
  </div>
</template>

<style scoped></style>
