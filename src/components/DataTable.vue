<script setup lang="ts" generic="TData, TValue">
import {
  useVueTable,
  getCoreRowModel,
  getSortedRowModel,
  FlexRender,
  type ColumnDef,
  type SortingState,
  type RowSelectionState,
} from '@tanstack/vue-table';
import { ref, computed, h } from 'vue';
import { cn } from '@/lib/utils';
import { ArrowUpDown } from 'lucide-vue-next';
import AppCheckbox from '@/components/ui/AppCheckbox.vue';

/**
 * DataTable Component
 * @tanstack/vue-table 기반의 강력한 데이터 테이블
 */
const props = withDefaults(
  defineProps<{
    /** 컬럼 정의 (TanStack Table ColumnDef) */
    columns: ColumnDef<TData, TValue>[];
    /** 표시할 데이터 배열 */
    data: TData[];
    /** 행 선택(체크박스) 활성화 여부 */
    enableSelection?: boolean;
  }>(),
  {
    enableSelection: false,
  },
);

const emit = defineEmits<{
  /** 행 선택 변경 시 발생하는 이벤트 */
  selectionChange: [selectedRows: TData[]];
}>();

// 정렬 상태 관리
const sorting = ref<SortingState>([]);

// 행 선택 상태 관리 ({ rowId: boolean })
const rowSelection = ref<RowSelectionState>({});

// 선택 컬럼 (체크박스) 정의
// enableSelection이 true일 때 맨 앞에 자동으로 추가됨
const selectionColumn: ColumnDef<TData, unknown> = {
  id: 'select',
  // 헤더 체크박스 (전체 선택/해제)
  header: ({ table }) =>
    h(AppCheckbox, {
      modelValue: table.getIsAllRowsSelected(),
      indeterminate: table.getIsSomeRowsSelected(),
      'onUpdate:modelValue': (value: boolean) =>
        table.toggleAllRowsSelected(value),
    }),
  // 셀 체크박스 (개별 선택/해제)
  cell: ({ row }) =>
    h(AppCheckbox, {
      modelValue: row.getIsSelected(),
      'onUpdate:modelValue': (value: boolean) => row.toggleSelected(value),
    }),
  size: 40,
  enableSorting: false,
};

// 최종 컬럼 목록 구성 (선택 컬럼 추가)
const allColumns = computed(() => {
  if (props.enableSelection) {
    return [selectionColumn, ...props.columns] as ColumnDef<TData, TValue>[];
  }
  return props.columns;
});

// TanStack Table 인스턴스 생성
const table = useVueTable({
  get data() {
    return props.data;
  },
  get columns() {
    return allColumns.value;
  },
  state: {
    get sorting() {
      return sorting.value;
    },
    get rowSelection() {
      return rowSelection.value;
    },
  },
  // 정렬 변경 핸들러
  onSortingChange: (updater) => {
    sorting.value =
      typeof updater === 'function' ? updater(sorting.value) : updater;
  },
  // 행 선택 변경 핸들러
  onRowSelectionChange: (updater) => {
    rowSelection.value =
      typeof updater === 'function' ? updater(rowSelection.value) : updater;
    // 부모 컴포넌트에 선택된 데이터 전달
    const selectedRows = table
      .getSelectedRowModel()
      .rows.map((row) => row.original);
    emit('selectionChange', selectedRows);
  },
  getCoreRowModel: getCoreRowModel(), // 기본 행 모델
  getSortedRowModel: getSortedRowModel(), // 정렬된 행 모델
  enableRowSelection: props.enableSelection, // 행 선택 활성화
});

// 선택된 행 수 (Computed)
const selectedRowCount = computed(
  () => Object.keys(rowSelection.value).length,
);

// 외부에서 접근 가능한 API 노출
defineExpose({
  selectedRowCount,
  table,
});
</script>

<template>
  <div
    :class="
      cn(
        'bg-white dark:bg-slate-900',
        'border border-slate-300 dark:border-slate-700 shadow-sm',
        'flex flex-col h-full rounded-sm overflow-hidden',
      )
    "
  >
    <!-- 테이블 스크롤 영역 -->
    <div :class="cn('overflow-y-auto flex-1')">
      <table
        :class="
          cn('w-full text-left border-collapse excel-table text-sm')
        "
      >
        <!-- 헤더 -->
        <thead :class="cn('sticky top-0 z-20 bg-slate-100 dark:bg-slate-800')">
          <tr
            v-for="headerGroup in table.getHeaderGroups()"
            :key="headerGroup.id"
          >
            <th
              v-for="header in headerGroup.headers"
              :key="header.id"
              :class="
                cn(
                  'px-3 py-2 text-xs font-bold text-slate-600 dark:text-slate-300',
                  'uppercase tracking-wider bg-slate-200/60 dark:bg-slate-800',
                  header.id === 'select' && 'w-10 text-center',
                )
              "
              :style="
                header.column.getSize() !== 150
                  ? { width: `${header.column.getSize()}px` }
                  : undefined
              "
            >
              <!-- 체크박스 헤더 (select 컬럼) -->
              <template v-if="header.id === 'select'">
                <div :class="cn('flex items-center justify-center')">
                  <FlexRender
                    v-if="!header.isPlaceholder"
                    :render="header.column.columnDef.header"
                    :props="header.getContext()"
                  />
                </div>
              </template>

              <!-- 정렬 가능한 일반 헤더 -->
              <template v-else-if="header.column.getCanSort()">
                <div
                  :class="
                    cn(
                      'flex items-center justify-between gap-1',
                      'cursor-pointer hover:text-primary select-none',
                    )
                  "
                  @click="header.column.getToggleSortingHandler()?.($event)"
                >
                  <FlexRender
                    v-if="!header.isPlaceholder"
                    :render="header.column.columnDef.header"
                    :props="header.getContext()"
                  />
                  <ArrowUpDown :class="cn('size-3 opacity-50')" />
                </div>
              </template>

              <!-- 정렬 불가 헤더 -->
              <template v-else>
                <FlexRender
                  v-if="!header.isPlaceholder"
                  :render="header.column.columnDef.header"
                  :props="header.getContext()"
                />
              </template>
            </th>
          </tr>
        </thead>

        <!-- 바디 -->
        <tbody
          :class="
            cn(
              'divide-y divide-slate-300 dark:divide-slate-700',
              'bg-white dark:bg-slate-900',
            )
          "
        >
          <tr
            v-for="row in table.getRowModel().rows"
            :key="row.id"
            :class="
              cn(
                'hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group',
                row.getIsSelected() && 'bg-primary/5',
              )
            "
          >
            <td
              v-for="cell in row.getVisibleCells()"
              :key="cell.id"
              :class="
                cn(
                  'px-3 py-2',
                  cell.column.id === 'select' && 'text-center',
                  row.getIsSelected() && 'bg-primary/5',
                )
              "
            >
              <FlexRender
                :render="cell.column.columnDef.cell"
                :props="cell.getContext()"
              />
            </td>
          </tr>

          <!-- 데이터 없을 때 -->
          <tr v-if="table.getRowModel().rows.length === 0">
            <td
              :colspan="table.getAllColumns().length"
              :class="cn('px-6 py-12 text-center text-slate-400')"
            >
              데이터가 없습니다
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 하단 슬롯 (페이지네이션 등) -->
    <slot name="footer" />
  </div>
</template>
