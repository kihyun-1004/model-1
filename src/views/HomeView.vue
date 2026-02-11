<script setup lang="ts">
import { cn } from '@/lib/utils';

import DataTable from '@/components/DataTable.vue';
import { createColumnHelper } from '@tanstack/vue-table';

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
};

const columnHelper = createColumnHelper<User>();

const columns = [
  columnHelper.accessor('name', {
    header: '이름',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('email', {
    header: '이메일',
  }),
  columnHelper.accessor('role', {
    header: '권한',
    cell: (info) => info.getValue().toUpperCase(),
  }),
];

const data: User[] = [
  { id: 1, name: '김민수', email: 'minsu@example.com', role: 'admin' },
  { id: 2, name: '이영희', email: 'younghi@example.com', role: 'user' },
];
</script>

<template>
  <main>
    <h1 :class="cn('text-3xl font-bold underline')">Home</h1>
    <div :class="cn('p-8')">
      <h1 :class="cn('mb-4 text-2xl font-bold')">사용자 목록</h1>
      <DataTable :columns="columns" :data="data" />
    </div>
  </main>
</template>
