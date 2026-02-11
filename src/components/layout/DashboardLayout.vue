<script setup lang="ts">
import AppSidebar from './AppSidebar.vue';
import AppHeader from './AppHeader.vue';
import { cn } from '@/lib/utils';
</script>

<template>
  <!--
    DashboardLayout
    전체 애플리케이션의 레이아웃 셸
    Flexbox를 사용하여 Sidebar와 MainContent를 배치
  -->
  <div
    :class="
      cn(
        'flex h-screen overflow-hidden bg-background-light dark:bg-background-dark',
      )
    "
  >
    <!-- 사이드바 (Flex Item) -->
    <AppSidebar />

    <!-- 메인 컨텐츠 영역 (Flex-1: 남은 공간 모두 차지) -->
    <div :class="cn('flex-1 flex flex-col overflow-hidden transition-all')">
      <!-- 헤더 -->
      <AppHeader />

      <!--
        페이지 컨텐츠
        overflow-hidden을 통해 내부 스크롤을 자식 컴포넌트(DataTable 등)에 위임하거나
        필요 시 여기서 overflow-auto를 줄 수 있음.
        현재는 DataTable 내부 스크롤을 위해 overflow-hidden 유지.
      -->
      <main
        :class="
          cn(
            'flex-1 flex flex-col overflow-hidden bg-background-light dark:bg-background-dark relative',
          )
        "
      >
        <slot />
      </main>
    </div>
  </div>
</template>
