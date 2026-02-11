<script setup lang="ts">
import DashboardLayout from '@/components/layout/DashboardLayout.vue';
</script>

<template>
  <DashboardLayout>
    <!-- 가운데 Main은 빈 상태로 유지 -->
    <div
      class="flex h-full items-center justify-center text-slate-400 dark:text-slate-600"
    >
      <div class="text-center">
        <p class="text-lg font-medium">Main Content Area</p>
        <p class="text-sm">(Empty)</p>
      </div>
    </div>
  </DashboardLayout>
</template>
