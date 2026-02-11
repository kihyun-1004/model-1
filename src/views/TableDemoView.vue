<script setup lang="ts">
/**
 * TanStack Table 데모 페이지
 * 초보 개발자를 위한 8가지 사용 예제
 */
import { ref, computed, h } from 'vue';
import { cn } from '@/lib/utils';
import {
  useVueTable,
  createColumnHelper,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getExpandedRowModel,
  getFacetedUniqueValues,
  FlexRender,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
  type RowSelectionState,
  type VisibilityState,
  type ExpandedState,
  type PaginationState,
} from '@tanstack/vue-table';
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronRight,
  ChevronDown,
  Search,
  Check,
} from 'lucide-vue-next';
import AppCheckbox from '@/components/ui/AppCheckbox.vue';
import AppBadge from '@/components/ui/AppBadge.vue';

// ===== 공통 샘플 데이터 타입 =====
type ProductStatus = 'in_stock' | 'low_stock' | 'out_of_stock';

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: ProductStatus;
}

// ===== 공통 샘플 데이터 =====
const sampleProducts: Product[] = [
  { id: 1, name: '무선 마우스', category: '주변기기', price: 29900, stock: 150, status: 'in_stock' },
  { id: 2, name: '기계식 키보드', category: '주변기기', price: 89000, stock: 5, status: 'low_stock' },
  { id: 3, name: '27인치 모니터', category: '디스플레이', price: 349000, stock: 0, status: 'out_of_stock' },
  { id: 4, name: 'USB-C 허브', category: '주변기기', price: 45000, stock: 80, status: 'in_stock' },
  { id: 5, name: '웹캠 HD', category: '영상장비', price: 59000, stock: 3, status: 'low_stock' },
  { id: 6, name: '노이즈캔슬링 헤드셋', category: '음향', price: 199000, stock: 25, status: 'in_stock' },
  { id: 7, name: 'SSD 1TB', category: '저장장치', price: 89000, stock: 0, status: 'out_of_stock' },
  { id: 8, name: '그래픽 태블릿', category: '입력장치', price: 159000, stock: 12, status: 'in_stock' },
  { id: 9, name: 'LED 데스크 램프', category: '액세서리', price: 35000, stock: 45, status: 'in_stock' },
  { id: 10, name: '모니터 암', category: '액세서리', price: 65000, stock: 8, status: 'low_stock' },
  { id: 11, name: '블루투스 스피커', category: '음향', price: 42000, stock: 60, status: 'in_stock' },
  { id: 12, name: '외장 하드 2TB', category: '저장장치', price: 79000, stock: 0, status: 'out_of_stock' },
  { id: 13, name: '무선 충전 패드', category: '액세서리', price: 25000, stock: 100, status: 'in_stock' },
  { id: 14, name: '게이밍 마우스패드', category: '주변기기', price: 19000, stock: 200, status: 'in_stock' },
  { id: 15, name: '4K 캡처 보드', category: '영상장비', price: 189000, stock: 2, status: 'low_stock' },
];

// 상태별 뱃지 매핑
const statusMap: Record<ProductStatus, { label: string; variant: 'success' | 'warning' | 'default' }> = {
  in_stock: { label: '재고있음', variant: 'success' },
  low_stock: { label: '재고부족', variant: 'warning' },
  out_of_stock: { label: '품절', variant: 'default' },
};

// 가격 포맷터
function formatPrice(value: number) {
  return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(value);
}

const columnHelper = createColumnHelper<Product>();

// ============================================================
// Demo 1: 기본 테이블
// ============================================================
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const basicColumns: ColumnDef<Product, any>[] = [
  columnHelper.accessor('id', { header: 'ID', size: 60 }),
  columnHelper.accessor('name', { header: '상품명' }),
  columnHelper.accessor('category', { header: '카테고리', size: 100 }),
  columnHelper.accessor('price', {
    header: '가격',
    cell: (info) => formatPrice(info.getValue()),
    size: 120,
  }),
  columnHelper.accessor('stock', { header: '재고', size: 70 }),
];

const basicTable = useVueTable({
  data: sampleProducts,
  columns: basicColumns,
  getCoreRowModel: getCoreRowModel(),
});

// ============================================================
// Demo 2: 정렬
// ============================================================
const sortingState = ref<SortingState>([]);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const sortColumns: ColumnDef<Product, any>[] = [
  columnHelper.accessor('id', { header: 'ID', size: 60 }),
  columnHelper.accessor('name', { header: '상품명' }),
  columnHelper.accessor('category', { header: '카테고리', size: 100 }),
  columnHelper.accessor('price', {
    header: '가격',
    cell: (info) => formatPrice(info.getValue()),
    size: 120,
  }),
  columnHelper.accessor('stock', { header: '재고', size: 70 }),
];

const sortTable = useVueTable({
  data: sampleProducts,
  columns: sortColumns,
  state: {
    get sorting() { return sortingState.value; },
  },
  onSortingChange: (updater) => {
    sortingState.value = typeof updater === 'function' ? updater(sortingState.value) : updater;
  },
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
});

// ============================================================
// Demo 3: 글로벌 필터
// ============================================================
const globalFilterValue = ref('');

const globalFilterTable = useVueTable({
  data: sampleProducts,
  columns: basicColumns,
  state: {
    get globalFilter() { return globalFilterValue.value; },
  },
  onGlobalFilterChange: (updater) => {
    globalFilterValue.value = typeof updater === 'function' ? updater(globalFilterValue.value) : updater;
  },
  getCoreRowModel: getCoreRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
});

// ============================================================
// Demo 4: 컬럼별 필터
// ============================================================
const colFilterState = ref<ColumnFiltersState>([]);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const colFilterColumns: ColumnDef<Product, any>[] = [
  columnHelper.accessor('id', { header: 'ID', size: 60 }),
  columnHelper.accessor('name', { header: '상품명' }),
  columnHelper.accessor('category', { header: '카테고리', size: 120 }),
  columnHelper.accessor('price', {
    header: '가격',
    cell: (info) => formatPrice(info.getValue()),
    size: 120,
    enableColumnFilter: false,
  }),
  columnHelper.accessor('stock', { header: '재고', size: 70, enableColumnFilter: false }),
];

const colFilterTable = useVueTable({
  data: sampleProducts,
  columns: colFilterColumns,
  state: {
    get columnFilters() { return colFilterState.value; },
  },
  onColumnFiltersChange: (updater) => {
    colFilterState.value = typeof updater === 'function' ? updater(colFilterState.value) : updater;
  },
  getCoreRowModel: getCoreRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  getFacetedUniqueValues: getFacetedUniqueValues(),
});

// ============================================================
// Demo 5: 페이지네이션
// ============================================================
const paginationState = ref<PaginationState>({ pageIndex: 0, pageSize: 5 });

const paginationTable = useVueTable({
  data: sampleProducts,
  columns: basicColumns,
  state: {
    get pagination() { return paginationState.value; },
  },
  onPaginationChange: (updater) => {
    paginationState.value = typeof updater === 'function' ? updater(paginationState.value) : updater;
  },
  getCoreRowModel: getCoreRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
});

// ============================================================
// Demo 6: 행 선택
// ============================================================
const rowSelectionState = ref<RowSelectionState>({});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const selectionColumns: ColumnDef<Product, any>[] = [
  {
    id: 'select',
    header: ({ table }) => h(AppCheckbox, {
      modelValue: table.getIsAllRowsSelected(),
      indeterminate: table.getIsSomeRowsSelected(),
      'onUpdate:modelValue': (v: boolean) => table.toggleAllRowsSelected(v),
    }),
    cell: ({ row }) => h(AppCheckbox, {
      modelValue: row.getIsSelected(),
      'onUpdate:modelValue': (v: boolean) => row.toggleSelected(v),
    }),
    size: 40,
    enableSorting: false,
  },
  columnHelper.accessor('id', { header: 'ID', size: 60 }),
  columnHelper.accessor('name', { header: '상품명' }),
  columnHelper.accessor('category', { header: '카테고리', size: 100 }),
  columnHelper.accessor('price', {
    header: '가격',
    cell: (info) => formatPrice(info.getValue()),
    size: 120,
  }),
];

const selectionTable = useVueTable({
  data: sampleProducts,
  columns: selectionColumns,
  state: {
    get rowSelection() { return rowSelectionState.value; },
  },
  onRowSelectionChange: (updater) => {
    rowSelectionState.value = typeof updater === 'function' ? updater(rowSelectionState.value) : updater;
  },
  getCoreRowModel: getCoreRowModel(),
  enableRowSelection: true,
});

const selectedCount = computed(() => Object.keys(rowSelectionState.value).length);

// ============================================================
// Demo 7: 컬럼 가시성
// ============================================================
const visibilityState = ref<VisibilityState>({});

const visibilityTable = useVueTable({
  data: sampleProducts,
  columns: basicColumns,
  state: {
    get columnVisibility() { return visibilityState.value; },
  },
  onColumnVisibilityChange: (updater) => {
    visibilityState.value = typeof updater === 'function' ? updater(visibilityState.value) : updater;
  },
  getCoreRowModel: getCoreRowModel(),
});

// ============================================================
// Demo 8: 행 확장
// ============================================================
const expandedState = ref<ExpandedState>({});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const expandColumns: ColumnDef<Product, any>[] = [
  {
    id: 'expander',
    header: () => null,
    cell: ({ row }) => h('button', {
      onClick: row.getToggleExpandedHandler(),
      class: 'cursor-pointer p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors',
    }, [
      h(row.getIsExpanded() ? ChevronDown : ChevronRight, { class: 'size-4' }),
    ]),
    size: 40,
  },
  columnHelper.accessor('id', { header: 'ID', size: 60 }),
  columnHelper.accessor('name', { header: '상품명' }),
  columnHelper.accessor('category', { header: '카테고리', size: 100 }),
  columnHelper.accessor('status', {
    header: '상태',
    cell: (info) => {
      const status = info.getValue() as ProductStatus;
      const s = statusMap[status];
      return h(AppBadge, { variant: s.variant }, () => s.label);
    },
    size: 100,
  }),
];

const expandTable = useVueTable({
  data: sampleProducts,
  columns: expandColumns,
  state: {
    get expanded() { return expandedState.value; },
  },
  onExpandedChange: (updater) => {
    expandedState.value = typeof updater === 'function' ? updater(expandedState.value) : updater;
  },
  getRowCanExpand: () => true,
  getCoreRowModel: getCoreRowModel(),
  getExpandedRowModel: getExpandedRowModel(),
});

// ===== 현재 활성 탭 =====
const activeTab = ref(0);
const tabs = [
  { label: '1. 기본', desc: 'useVueTable + getCoreRowModel' },
  { label: '2. 정렬', desc: 'getSortedRowModel + SortingState' },
  { label: '3. 글로벌 필터', desc: 'getFilteredRowModel + globalFilter' },
  { label: '4. 컬럼 필터', desc: 'ColumnFiltersState + getFacetedUniqueValues' },
  { label: '5. 페이지네이션', desc: 'getPaginationRowModel + PaginationState' },
  { label: '6. 행 선택', desc: 'RowSelectionState + enableRowSelection' },
  { label: '7. 컬럼 가시성', desc: 'ColumnVisibilityState' },
  { label: '8. 행 확장', desc: 'getExpandedRowModel + ExpandedState' },
];
</script>

<template>
  <main
    :class="cn('min-h-screen bg-slate-50 dark:bg-slate-950')"
  >
    <!-- 헤더 -->
    <div :class="cn('bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30')">
      <div :class="cn('max-w-7xl mx-auto px-6 py-5')">
        <h1 :class="cn('text-2xl font-bold text-slate-900 dark:text-white')">
          📊 TanStack Table 데모
        </h1>
        <p :class="cn('text-sm text-slate-500 dark:text-slate-400 mt-1')">
          초보 개발자를 위한 @tanstack/vue-table 사용법 가이드
        </p>
      </div>
      <!-- 탭 네비게이션 -->
      <div :class="cn('max-w-7xl mx-auto px-6')">
        <nav :class="cn('flex gap-1 overflow-x-auto pb-0 -mb-px')">
          <button
            v-for="(tab, idx) in tabs"
            :key="idx"
            :class="cn(
              'px-3 py-2 text-xs font-medium whitespace-nowrap border-b-2 transition-colors',
              activeTab === idx
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300',
            )"
            @click="activeTab = idx"
          >
            {{ tab.label }}
          </button>
        </nav>
      </div>
    </div>

    <!-- 콘텐츠 영역 -->
    <div :class="cn('max-w-7xl mx-auto px-6 py-8')">
      <!-- API 태그 -->
      <div :class="cn('mb-4 flex items-center gap-2')">
        <span :class="cn('text-xs font-mono bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded')">
          {{ tabs[activeTab]?.desc ?? '' }}
        </span>
      </div>

      <!-- ============================================ -->
      <!-- Demo 1: 기본 테이블 -->
      <!-- ============================================ -->
      <section v-if="activeTab === 0" :class="cn('space-y-4')">
        <div :class="cn('bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 text-sm text-amber-800 dark:text-amber-200 space-y-2')">
          <p><strong>💡 핵심:</strong> <code>useVueTable</code>에 <code>data</code>, <code>columns</code>, <code>getCoreRowModel()</code>만 전달하면 테이블이 렌더링됩니다.</p>
          <p><strong>📌 필수 import:</strong> <code>useVueTable</code>, <code>getCoreRowModel</code>, <code>FlexRender</code>, <code>createColumnHelper</code></p>
          <p><strong>🔧 주요 함수:</strong></p>
          <ul :class="cn('list-disc pl-5 space-y-0.5 text-xs')">
            <li><code>createColumnHelper&lt;T&gt;()</code> — 타입 안전한 컬럼 정의 헬퍼 생성</li>
            <li><code>columnHelper.accessor('key', { header, cell, size })</code> — 데이터 접근자 컬럼</li>
            <li><code>table.getHeaderGroups()</code> — 헤더 행 배열 반환 (v-for 반복용)</li>
            <li><code>table.getRowModel().rows</code> — 현재 보이는 행 배열 반환</li>
            <li><code>row.getVisibleCells()</code> — 행의 보이는 셀 배열</li>
          </ul>
          <p :class="cn('text-xs')"><strong>⚠️ 주의:</strong> <code>cell</code> 옵션에서 Vue 컴포넌트를 렌더링하려면 <code>h()</code> 함수를 사용합니다. 예: <code>cell: (info) =&gt; h('span', { class: 'font-bold' }, info.getValue())</code></p>
        </div>
        <div :class="cn('bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden shadow-sm')">
          <table :class="cn('w-full text-sm text-left')">
            <thead :class="cn('bg-slate-100 dark:bg-slate-800')">
              <tr v-for="hg in basicTable.getHeaderGroups()" :key="hg.id">
                <th
                  v-for="header in hg.headers"
                  :key="header.id"
                  :class="cn('px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300')"
                  :style="header.column.getSize() !== 150 ? { width: `${header.column.getSize()}px` } : undefined"
                >
                  <FlexRender v-if="!header.isPlaceholder" :render="header.column.columnDef.header" :props="header.getContext()" />
                </th>
              </tr>
            </thead>
            <tbody :class="cn('divide-y divide-slate-200 dark:divide-slate-700')">
              <tr v-for="row in basicTable.getRowModel().rows" :key="row.id" :class="cn('hover:bg-slate-50 dark:hover:bg-slate-800/50')">
                <td v-for="cell in row.getVisibleCells()" :key="cell.id" :class="cn('px-4 py-2.5')">
                  <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- ============================================ -->
      <!-- Demo 2: 정렬 -->
      <!-- ============================================ -->
      <section v-if="activeTab === 1" :class="cn('space-y-4')">
        <div :class="cn('bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 text-sm text-amber-800 dark:text-amber-200 space-y-2')">
          <p><strong>💡 핵심:</strong> <code>getSortedRowModel()</code>을 추가하고, <code>SortingState</code>를 관리하면 헤더 클릭으로 정렬됩니다.</p>
          <p><strong>🔧 주요 함수:</strong></p>
          <ul :class="cn('list-disc pl-5 space-y-0.5 text-xs')">
            <li><code>header.column.getCanSort()</code> — 정렬 가능 여부 확인</li>
            <li><code>header.column.getToggleSortingHandler()</code> — 클릭 핸들러 반환 (asc→desc→none 순환)</li>
            <li><code>header.column.getIsSorted()</code> — 현재 정렬 방향 (<code>'asc'</code> | <code>'desc'</code> | <code>false</code>)</li>
            <li><code>onSortingChange: (updater) =&gt; ...</code> — updater 패턴: 함수면 이전값 전달, 아니면 직접 교체</li>
          </ul>
          <p :class="cn('text-xs')"><strong>⚠️ 실무 팁:</strong> 특정 컬럼의 정렬을 비활성화하려면 <code>enableSorting: false</code>를 컬럼 정의에 추가하세요. 서버사이드 정렬은 <code>manualSorting: true</code>를 설정하고 <code>onSortingChange</code>에서 API 호출하세요.</p>
        </div>
        <div :class="cn('text-xs text-slate-500 mb-2')">
          현재 정렬: {{ sortingState.length && sortingState[0] ? `${sortingState[0].id} (${sortingState[0].desc ? '내림차순' : '오름차순'})` : '없음' }}
        </div>
        <div :class="cn('bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden shadow-sm')">
          <table :class="cn('w-full text-sm text-left')">
            <thead :class="cn('bg-slate-100 dark:bg-slate-800')">
              <tr v-for="hg in sortTable.getHeaderGroups()" :key="hg.id">
                <th
                  v-for="header in hg.headers"
                  :key="header.id"
                  :class="cn('px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300',
                    header.column.getCanSort() && 'cursor-pointer select-none hover:text-blue-600')"
                  :style="header.column.getSize() !== 150 ? { width: `${header.column.getSize()}px` } : undefined"
                  @click="header.column.getToggleSortingHandler()?.($event)"
                >
                  <div :class="cn('flex items-center gap-1')">
                    <FlexRender v-if="!header.isPlaceholder" :render="header.column.columnDef.header" :props="header.getContext()" />
                    <component
                      :is="header.column.getIsSorted() === 'asc' ? ArrowUp : header.column.getIsSorted() === 'desc' ? ArrowDown : ArrowUpDown"
                      v-if="header.column.getCanSort()"
                      :class="cn('size-3', !header.column.getIsSorted() && 'opacity-30')"
                    />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody :class="cn('divide-y divide-slate-200 dark:divide-slate-700')">
              <tr v-for="row in sortTable.getRowModel().rows" :key="row.id" :class="cn('hover:bg-slate-50 dark:hover:bg-slate-800/50')">
                <td v-for="cell in row.getVisibleCells()" :key="cell.id" :class="cn('px-4 py-2.5')">
                  <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- ============================================ -->
      <!-- Demo 3: 글로벌 필터 -->
      <!-- ============================================ -->
      <section v-if="activeTab === 2" :class="cn('space-y-4')">
        <div :class="cn('bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 text-sm text-amber-800 dark:text-amber-200 space-y-2')">
          <p><strong>💡 핵심:</strong> <code>getFilteredRowModel()</code> + <code>globalFilter</code> 상태로 모든 컬럼을 대상으로 텍스트 검색합니다.</p>
          <p><strong>🔧 주요 함수:</strong></p>
          <ul :class="cn('list-disc pl-5 space-y-0.5 text-xs')">
            <li><code>onGlobalFilterChange</code> — 글로벌 필터 값 변경 콜백 (updater 패턴)</li>
            <li><code>table.setGlobalFilter(value)</code> — 프로그래밍 방식으로 글로벌 필터 설정</li>
            <li><code>table.getRowModel().rows.length</code> — 필터링 후 결과 건수 확인</li>
          </ul>
          <p :class="cn('text-xs')"><strong>⚠️ 실무 팁:</strong> 검색 성능을 위해 <code>debounce</code>를 적용하세요. 커스텀 필터 함수는 <code>globalFilterFn</code> 옵션으로 정의 가능합니다. 예: <code>globalFilterFn: (row, columnId, filterValue) =&gt; ...</code></p>
        </div>
        <div :class="cn('relative max-w-sm')">
          <Search :class="cn('absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400')" />
          <input
            v-model="globalFilterValue"
            :class="cn('w-full pl-9 pr-4 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none')"
            placeholder="전체 검색... (예: 마우스, 주변기기)"
          />
        </div>
        <div :class="cn('text-xs text-slate-500')">검색 결과: {{ globalFilterTable.getRowModel().rows.length }}건</div>
        <div :class="cn('bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden shadow-sm')">
          <table :class="cn('w-full text-sm text-left')">
            <thead :class="cn('bg-slate-100 dark:bg-slate-800')">
              <tr v-for="hg in globalFilterTable.getHeaderGroups()" :key="hg.id">
                <th v-for="header in hg.headers" :key="header.id" :class="cn('px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300')">
                  <FlexRender v-if="!header.isPlaceholder" :render="header.column.columnDef.header" :props="header.getContext()" />
                </th>
              </tr>
            </thead>
            <tbody :class="cn('divide-y divide-slate-200 dark:divide-slate-700')">
              <tr v-for="row in globalFilterTable.getRowModel().rows" :key="row.id" :class="cn('hover:bg-slate-50 dark:hover:bg-slate-800/50')">
                <td v-for="cell in row.getVisibleCells()" :key="cell.id" :class="cn('px-4 py-2.5')">
                  <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
                </td>
              </tr>
              <tr v-if="globalFilterTable.getRowModel().rows.length === 0">
                <td :colspan="5" :class="cn('px-4 py-8 text-center text-slate-400')">검색 결과가 없습니다</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- ============================================ -->
      <!-- Demo 4: 컬럼별 필터 -->
      <!-- ============================================ -->
      <section v-if="activeTab === 3" :class="cn('space-y-4')">
        <div :class="cn('bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 text-sm text-amber-800 dark:text-amber-200 space-y-2')">
          <p><strong>💡 핵심:</strong> 각 컬럼에 <code>column.setFilterValue()</code>를 호출하여 개별 필터를 적용합니다.</p>
          <p><strong>🔧 주요 함수:</strong></p>
          <ul :class="cn('list-disc pl-5 space-y-0.5 text-xs')">
            <li><code>header.column.getCanFilter()</code> — 필터 가능 여부 (<code>enableColumnFilter: false</code>면 false)</li>
            <li><code>header.column.setFilterValue(value)</code> — 컬럼 필터 값 설정</li>
            <li><code>header.column.getFilterValue()</code> — 현재 필터 값 조회</li>
            <li><code>getFacetedUniqueValues()</code> — 드롭다운 필터에 사용할 고유 값 목록 제공</li>
          </ul>
          <p :class="cn('text-xs')"><strong>⚠️ 실무 팁:</strong> 숫자 범위 필터는 <code>filterFn: 'inNumberRange'</code>, 정확 일치는 <code>filterFn: 'equals'</code>를 사용합니다. 커스텀 필터 함수도 정의 가능합니다.</p>
        </div>
        <div :class="cn('bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden shadow-sm')">
          <table :class="cn('w-full text-sm text-left')">
            <thead :class="cn('bg-slate-100 dark:bg-slate-800')">
              <tr v-for="hg in colFilterTable.getHeaderGroups()" :key="hg.id">
                <th v-for="header in hg.headers" :key="header.id" :class="cn('px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300')">
                  <FlexRender v-if="!header.isPlaceholder" :render="header.column.columnDef.header" :props="header.getContext()" />
                  <input
                    v-if="header.column.getCanFilter()"
                    :value="(header.column.getFilterValue() as string) ?? ''"
                    @input="header.column.setFilterValue(($event.target as HTMLInputElement).value)"
                    :class="cn('mt-1 w-full px-2 py-1 text-xs font-normal normal-case border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-slate-900 dark:text-white outline-none focus:ring-1 focus:ring-blue-500')"
                    :placeholder="`${header.column.columnDef.header} 검색...`"
                  />
                </th>
              </tr>
            </thead>
            <tbody :class="cn('divide-y divide-slate-200 dark:divide-slate-700')">
              <tr v-for="row in colFilterTable.getRowModel().rows" :key="row.id" :class="cn('hover:bg-slate-50 dark:hover:bg-slate-800/50')">
                <td v-for="cell in row.getVisibleCells()" :key="cell.id" :class="cn('px-4 py-2.5')">
                  <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
                </td>
              </tr>
              <tr v-if="colFilterTable.getRowModel().rows.length === 0">
                <td :colspan="5" :class="cn('px-4 py-8 text-center text-slate-400')">검색 결과가 없습니다</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- ============================================ -->
      <!-- Demo 5: 페이지네이션 -->
      <!-- ============================================ -->
      <section v-if="activeTab === 4" :class="cn('space-y-4')">
        <div :class="cn('bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 text-sm text-amber-800 dark:text-amber-200 space-y-2')">
          <p><strong>💡 핵심:</strong> <code>getPaginationRowModel()</code>과 <code>PaginationState</code>(pageIndex, pageSize)로 클라이언트 사이드 페이지네이션을 구현합니다.</p>
          <p><strong>🔧 주요 함수:</strong></p>
          <ul :class="cn('list-disc pl-5 space-y-0.5 text-xs')">
            <li><code>table.firstPage()</code> / <code>table.lastPage()</code> — 첫/마지막 페이지 이동</li>
            <li><code>table.previousPage()</code> / <code>table.nextPage()</code> — 이전/다음 페이지</li>
            <li><code>table.getCanPreviousPage()</code> / <code>table.getCanNextPage()</code> — 이동 가능 여부</li>
            <li><code>table.getPageCount()</code> — 총 페이지 수</li>
            <li><code>table.setPageSize(size)</code> — 페이지 크기 변경 (자동으로 pageIndex 0으로 리셋)</li>
            <li><code>table.setPageIndex(index)</code> — 특정 페이지로 직접 이동</li>
          </ul>
          <p :class="cn('text-xs')"><strong>⚠️ 실무 팁:</strong> 서버사이드 페이지네이션은 <code>manualPagination: true</code> + <code>pageCount</code> 옵션을 설정하고, <code>onPaginationChange</code>에서 API를 호출하세요.</p>
        </div>
        <div :class="cn('bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden shadow-sm')">
          <table :class="cn('w-full text-sm text-left')">
            <thead :class="cn('bg-slate-100 dark:bg-slate-800')">
              <tr v-for="hg in paginationTable.getHeaderGroups()" :key="hg.id">
                <th v-for="header in hg.headers" :key="header.id" :class="cn('px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300')">
                  <FlexRender v-if="!header.isPlaceholder" :render="header.column.columnDef.header" :props="header.getContext()" />
                </th>
              </tr>
            </thead>
            <tbody :class="cn('divide-y divide-slate-200 dark:divide-slate-700')">
              <tr v-for="row in paginationTable.getRowModel().rows" :key="row.id" :class="cn('hover:bg-slate-50 dark:hover:bg-slate-800/50')">
                <td v-for="cell in row.getVisibleCells()" :key="cell.id" :class="cn('px-4 py-2.5')">
                  <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
                </td>
              </tr>
            </tbody>
          </table>
          <!-- 페이지네이션 컨트롤 -->
          <div :class="cn('flex items-center justify-between px-4 py-3 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50')">
            <div :class="cn('text-xs text-slate-500')">
              총 {{ sampleProducts.length }}건 / 페이지
              {{ paginationState.pageIndex + 1 }} / {{ paginationTable.getPageCount() }}
            </div>
            <div :class="cn('flex items-center gap-1')">
              <button
                :disabled="!paginationTable.getCanPreviousPage()"
                @click="paginationTable.firstPage()"
                :class="cn('px-2 py-1 text-xs rounded border border-slate-300 dark:border-slate-600 disabled:opacity-30 hover:bg-slate-100 dark:hover:bg-slate-700')"
              >«</button>
              <button
                :disabled="!paginationTable.getCanPreviousPage()"
                @click="paginationTable.previousPage()"
                :class="cn('px-2 py-1 text-xs rounded border border-slate-300 dark:border-slate-600 disabled:opacity-30 hover:bg-slate-100 dark:hover:bg-slate-700')"
              >‹</button>
              <button
                :disabled="!paginationTable.getCanNextPage()"
                @click="paginationTable.nextPage()"
                :class="cn('px-2 py-1 text-xs rounded border border-slate-300 dark:border-slate-600 disabled:opacity-30 hover:bg-slate-100 dark:hover:bg-slate-700')"
              >›</button>
              <button
                :disabled="!paginationTable.getCanNextPage()"
                @click="paginationTable.lastPage()"
                :class="cn('px-2 py-1 text-xs rounded border border-slate-300 dark:border-slate-600 disabled:opacity-30 hover:bg-slate-100 dark:hover:bg-slate-700')"
              >»</button>
            </div>
            <select
              :value="paginationState.pageSize"
              @change="paginationTable.setPageSize(Number(($event.target as HTMLSelectElement).value))"
              :class="cn('text-xs border border-slate-300 dark:border-slate-600 rounded px-2 py-1 bg-white dark:bg-slate-700 text-slate-900 dark:text-white')"
            >
              <option v-for="size in [5, 10, 15]" :key="size" :value="size">{{ size }}건씩</option>
            </select>
          </div>
        </div>
      </section>

      <!-- ============================================ -->
      <!-- Demo 6: 행 선택 -->
      <!-- ============================================ -->
      <section v-if="activeTab === 5" :class="cn('space-y-4')">
        <div :class="cn('bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 text-sm text-amber-800 dark:text-amber-200 space-y-2')">
          <p><strong>💡 핵심:</strong> <code>enableRowSelection</code>을 활성화하고, <code>RowSelectionState</code>로 선택 상태를 관리합니다.</p>
          <p><strong>🔧 주요 함수:</strong></p>
          <ul :class="cn('list-disc pl-5 space-y-0.5 text-xs')">
            <li><code>table.getIsAllRowsSelected()</code> — 전체 선택 여부</li>
            <li><code>table.getIsSomeRowsSelected()</code> — 일부 선택 여부 (indeterminate 체크박스용)</li>
            <li><code>table.toggleAllRowsSelected(value)</code> — 전체 선택/해제 토글</li>
            <li><code>row.getIsSelected()</code> / <code>row.toggleSelected(value)</code> — 개별 행 선택</li>
            <li><code>table.getSelectedRowModel().rows</code> — 선택된 행의 원본 데이터 접근</li>
          </ul>
          <p :class="cn('text-xs')"><strong>⚠️ 실무 팁:</strong> 선택된 데이터 추출: <code>table.getSelectedRowModel().rows.map(r =&gt; r.original)</code>. 조건부 선택은 <code>enableRowSelection: (row) =&gt; row.original.status !== 'inactive'</code>처럼 함수를 전달하세요.</p>
        </div>
        <div :class="cn('text-xs text-slate-500 flex items-center gap-2')">
          <Check :class="cn('size-3')" />
          선택된 행: <strong :class="cn('text-blue-600')">{{ selectedCount }}</strong>건
        </div>
        <div :class="cn('bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden shadow-sm')">
          <table :class="cn('w-full text-sm text-left')">
            <thead :class="cn('bg-slate-100 dark:bg-slate-800')">
              <tr v-for="hg in selectionTable.getHeaderGroups()" :key="hg.id">
                <th v-for="header in hg.headers" :key="header.id" :class="cn('px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300', header.id === 'select' && 'w-10 text-center')">
                  <FlexRender v-if="!header.isPlaceholder" :render="header.column.columnDef.header" :props="header.getContext()" />
                </th>
              </tr>
            </thead>
            <tbody :class="cn('divide-y divide-slate-200 dark:divide-slate-700')">
              <tr v-for="row in selectionTable.getRowModel().rows" :key="row.id" :class="cn('hover:bg-slate-50 dark:hover:bg-slate-800/50', row.getIsSelected() && 'bg-blue-50 dark:bg-blue-900/20')">
                <td v-for="cell in row.getVisibleCells()" :key="cell.id" :class="cn('px-4 py-2.5', cell.column.id === 'select' && 'text-center')">
                  <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- ============================================ -->
      <!-- Demo 7: 컬럼 가시성 -->
      <!-- ============================================ -->
      <section v-if="activeTab === 6" :class="cn('space-y-4')">
        <div :class="cn('bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 text-sm text-amber-800 dark:text-amber-200 space-y-2')">
          <p><strong>💡 핵심:</strong> <code>ColumnVisibilityState</code>로 각 컬럼의 표시/숨김을 <code>{ columnId: boolean }</code> 형태로 제어합니다.</p>
          <p><strong>🔧 주요 함수:</strong></p>
          <ul :class="cn('list-disc pl-5 space-y-0.5 text-xs')">
            <li><code>table.getAllLeafColumns()</code> — 모든 리프 컬럼 배열 (토글 UI 구성용)</li>
            <li><code>column.getIsVisible()</code> / <code>column.toggleVisibility()</code> — 개별 컬럼 가시성</li>
            <li><code>table.getIsAllColumnsVisible()</code> — 전체 표시 여부</li>
            <li><code>table.toggleAllColumnsVisible()</code> — 전체 토글</li>
          </ul>
          <p :class="cn('text-xs')"><strong>⚠️ 실무 팁:</strong> 초기 숨김 설정: <code>state: { columnVisibility: { price: false } }</code>. 사용자 설정을 <code>localStorage</code>에 저장하면 새로고침 후에도 유지됩니다.</p>
        </div>
        <!-- 컬럼 토글 UI -->
        <div :class="cn('flex flex-wrap gap-3 p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg')">
          <label :class="cn('text-xs font-bold text-slate-600 dark:text-slate-300 w-full mb-1')">표시할 컬럼 선택:</label>
          <label
            v-for="col in visibilityTable.getAllLeafColumns()"
            :key="col.id"
            :class="cn('flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300 cursor-pointer')"
          >
            <input
              type="checkbox"
              :checked="col.getIsVisible()"
              @change="col.toggleVisibility()"
              :class="cn('rounded border-slate-400')"
            />
            {{ col.columnDef.header }}
          </label>
        </div>
        <div :class="cn('bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden shadow-sm')">
          <table :class="cn('w-full text-sm text-left')">
            <thead :class="cn('bg-slate-100 dark:bg-slate-800')">
              <tr v-for="hg in visibilityTable.getHeaderGroups()" :key="hg.id">
                <th v-for="header in hg.headers" :key="header.id" :class="cn('px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300')">
                  <FlexRender v-if="!header.isPlaceholder" :render="header.column.columnDef.header" :props="header.getContext()" />
                </th>
              </tr>
            </thead>
            <tbody :class="cn('divide-y divide-slate-200 dark:divide-slate-700')">
              <tr v-for="row in visibilityTable.getRowModel().rows" :key="row.id" :class="cn('hover:bg-slate-50 dark:hover:bg-slate-800/50')">
                <td v-for="cell in row.getVisibleCells()" :key="cell.id" :class="cn('px-4 py-2.5')">
                  <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- ============================================ -->
      <!-- Demo 8: 행 확장 -->
      <!-- ============================================ -->
      <section v-if="activeTab === 7" :class="cn('space-y-4')">
        <div :class="cn('bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 text-sm text-amber-800 dark:text-amber-200 space-y-2')">
          <p><strong>💡 핵심:</strong> <code>getExpandedRowModel()</code>과 <code>getRowCanExpand</code>으로 행 확장을 활성화합니다.</p>
          <p><strong>🔧 주요 함수:</strong></p>
          <ul :class="cn('list-disc pl-5 space-y-0.5 text-xs')">
            <li><code>getRowCanExpand: () =&gt; true</code> — 모든 행 확장 허용 (조건부도 가능)</li>
            <li><code>row.getToggleExpandedHandler()</code> — 확장 토글 클릭 핸들러</li>
            <li><code>row.getIsExpanded()</code> — 확장 상태 확인 (조건부 렌더링에 사용)</li>
            <li><code>row.getAllCells().length</code> — colspan 계산에 활용</li>
            <li><code>row.original</code> — 원본 데이터 객체 접근 (확장 영역에서 상세 정보 표시)</li>
          </ul>
          <p :class="cn('text-xs')"><strong>⚠️ 실무 팁:</strong> 확장 영역에서 API 호출이 필요하면 <code>watch(() =&gt; expandedState.value, ...)</code>로 변경을 감지하세요. <code>&lt;template v-for&gt;</code>로 행과 확장 영역을 같은 루프에서 렌더링하는 것이 핵심 패턴입니다.</p>
        </div>
        <div :class="cn('bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden shadow-sm')">
          <table :class="cn('w-full text-sm text-left')">
            <thead :class="cn('bg-slate-100 dark:bg-slate-800')">
              <tr v-for="hg in expandTable.getHeaderGroups()" :key="hg.id">
                <th v-for="header in hg.headers" :key="header.id" :class="cn('px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300')">
                  <FlexRender v-if="!header.isPlaceholder" :render="header.column.columnDef.header" :props="header.getContext()" />
                </th>
              </tr>
            </thead>
            <tbody :class="cn('divide-y divide-slate-200 dark:divide-slate-700')">
              <template v-for="row in expandTable.getRowModel().rows" :key="row.id">
                <tr :class="cn('hover:bg-slate-50 dark:hover:bg-slate-800/50')">
                  <td v-for="cell in row.getVisibleCells()" :key="cell.id" :class="cn('px-4 py-2.5')">
                    <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
                  </td>
                </tr>
                <!-- 확장된 내용 -->
                <tr v-if="row.getIsExpanded()">
                  <td :colspan="row.getAllCells().length" :class="cn('bg-blue-50 dark:bg-blue-900/10 px-6 py-4')">
                    <div :class="cn('grid grid-cols-2 md:grid-cols-4 gap-4 text-xs')">
                      <div>
                        <span :class="cn('text-slate-500')">상품명</span>
                        <p :class="cn('font-medium text-slate-900 dark:text-white')">{{ row.original.name }}</p>
                      </div>
                      <div>
                        <span :class="cn('text-slate-500')">카테고리</span>
                        <p :class="cn('font-medium text-slate-900 dark:text-white')">{{ row.original.category }}</p>
                      </div>
                      <div>
                        <span :class="cn('text-slate-500')">가격</span>
                        <p :class="cn('font-medium text-slate-900 dark:text-white')">{{ formatPrice(row.original.price) }}</p>
                      </div>
                      <div>
                        <span :class="cn('text-slate-500')">재고</span>
                        <p :class="cn('font-medium text-slate-900 dark:text-white')">{{ row.original.stock }}개</p>
                      </div>
                    </div>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  </main>
</template>
