<script setup lang="ts" generic="TData, TValue">
import { useVueTable, getCoreRowModel, FlexRender, type ColumnDef } from '@tanstack/vue-table';
import { cn } from '@/lib/utils';

const props = defineProps<{
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}>();

const table = useVueTable({
  get data() {
    return props.data;
  },
  get columns() {
    return props.columns;
  },
  getCoreRowModel: getCoreRowModel(),
});
</script>

<template>
  <div :class="cn('w-full overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-800')">
    <table :class="cn('w-full text-left text-sm')">
      <thead :class="cn('bg-gray-50 text-gray-700 uppercase dark:bg-gray-900 dark:text-gray-300')">
        <tr v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
          <th
            v-for="header in headerGroup.headers"
            :key="header.id"
            :class="cn('px-6 py-3 font-semibold')"
          >
            <FlexRender
              v-if="!header.isPlaceholder"
              :render="header.column.columnDef.header"
              :props="header.getContext()"
            />
          </th>
        </tr>
      </thead>

      <tbody :class="cn('divide-y divide-gray-200 dark:divide-gray-800')">
        <tr
          v-for="row in table.getRowModel().rows"
          :key="row.id"
          :class="cn('transition-colors hover:bg-gray-50 dark:hover:bg-gray-900/50')"
        >
          <td v-for="cell in row.getVisibleCells()" :key="cell.id" :class="cn('px-6 py-4')">
            <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
