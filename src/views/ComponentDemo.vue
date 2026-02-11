<script setup lang="ts">
import { ref } from 'vue';
import { cn } from '@/lib/utils';

// Phase 1: Atomic 컴포넌트
import AppButton from '@/components/ui/AppButton.vue';
import AppBadge from '@/components/ui/AppBadge.vue';
import AppAvatar from '@/components/ui/AppAvatar.vue';
import AppCheckbox from '@/components/ui/AppCheckbox.vue';
import AppInput from '@/components/ui/AppInput.vue';
import AppSelect from '@/components/ui/AppSelect.vue';

// Phase 2: Molecule 컴포넌트
import Breadcrumb from '@/components/ui/Breadcrumb.vue';
import type { BreadcrumbItem } from '@/components/ui/Breadcrumb.vue';
import PageHeader from '@/components/ui/PageHeader.vue';
import Pagination from '@/components/ui/Pagination.vue';
import FilterPanel from '@/components/ui/FilterPanel.vue';
import BulkActionBar from '@/components/ui/BulkActionBar.vue';

// lucide-vue-next 아이콘
import {
  Plus,
  Search,
  ListFilter,
  Pencil,
  Trash2,
  RefreshCw,
  Download,
  Calendar,
  ArrowUpDown,
} from 'lucide-vue-next';

// ===== 데모 상태 =====
const checked1 = ref(true);
const checked2 = ref(false);
const indeterminate = ref(false);
const searchValue = ref('');
const dateValue = ref('');
const selectValue = ref('');
const currentPage = ref(1);
const selectedCount = ref(2);

const statusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'pending', label: 'Pending' },
  { value: 'completed', label: 'Completed' },
];

const breadcrumbItems: BreadcrumbItem[] = [
  { label: 'Dashboard', href: '#' },
  { label: 'Users', href: '#' },
  { label: 'All Users' },
];
</script>

<template>
  <main
    :class="
      cn(
        'min-h-screen bg-background-light dark:bg-background-dark p-8 space-y-10',
      )
    "
  >
    <h1 :class="cn('text-3xl font-bold text-slate-900 dark:text-white')">
      UI 컴포넌트 데모
    </h1>

    <!-- ============================================ -->
    <!-- Phase 1: Atomic 컴포넌트 -->
    <!-- ============================================ -->
    <div :class="cn('space-y-10')">
      <h2
        :class="
          cn(
            'text-lg font-bold text-primary border-b border-primary/30 pb-2',
          )
        "
      >
        Phase 1: Atomic 컴포넌트
      </h2>

      <!-- 버튼 -->
      <section :class="cn('space-y-4')">
        <h3
          :class="cn('text-xl font-semibold text-slate-800 dark:text-white')"
        >
          AppButton
        </h3>
        <div :class="cn('flex flex-wrap items-center gap-3')">
          <AppButton variant="primary">
            <Plus :class="cn('size-4')" />
            <span>Add New User</span>
          </AppButton>
          <AppButton variant="secondary">
            <ListFilter :class="cn('size-4')" />
            <span>Filter</span>
          </AppButton>
          <AppButton variant="ghost">
            <Download :class="cn('size-4')" />
            <span>Export</span>
          </AppButton>
          <AppButton variant="danger">
            <Trash2 :class="cn('size-4')" />
            <span>Delete Selected</span>
          </AppButton>
          <AppButton variant="icon">
            <Pencil :class="cn('size-4')" />
          </AppButton>
          <AppButton variant="icon">
            <Trash2 :class="cn('size-4')" />
          </AppButton>
          <AppButton variant="primary" size="sm">Small</AppButton>
          <AppButton variant="primary" size="lg">Large</AppButton>
          <AppButton variant="primary" disabled>Disabled</AppButton>
        </div>
      </section>

      <!-- 배지 -->
      <section :class="cn('space-y-4')">
        <h3
          :class="cn('text-xl font-semibold text-slate-800 dark:text-white')"
        >
          AppBadge
        </h3>
        <div :class="cn('flex items-center gap-3')">
          <AppBadge variant="success">ACTIVE</AppBadge>
          <AppBadge variant="default">INACTIVE</AppBadge>
          <AppBadge variant="warning">PENDING</AppBadge>
        </div>
      </section>

      <!-- 아바타 -->
      <section :class="cn('space-y-4')">
        <h3
          :class="cn('text-xl font-semibold text-slate-800 dark:text-white')"
        >
          AppAvatar
        </h3>
        <div :class="cn('flex items-center gap-3')">
          <AppAvatar initials="JS" color="blue" />
          <AppAvatar initials="ER" color="slate" />
          <AppAvatar initials="MK" color="purple" />
          <AppAvatar initials="SL" color="orange" />
          <AppAvatar initials="RJ" color="teal" />
          <AppAvatar initials="AM" color="indigo" />
          <AppAvatar initials="DW" color="red" />
          <AppAvatar initials="EP" color="cyan" />
          <AppAvatar initials="TC" color="pink" />
          <AppAvatar initials="LB" color="lime" />
        </div>
        <div :class="cn('flex items-end gap-3')">
          <AppAvatar initials="SM" color="blue" size="sm" />
          <AppAvatar initials="MD" color="purple" size="md" />
          <AppAvatar initials="LG" color="teal" size="lg" />
        </div>
      </section>

      <!-- 체크박스 -->
      <section :class="cn('space-y-4')">
        <h3
          :class="cn('text-xl font-semibold text-slate-800 dark:text-white')"
        >
          AppCheckbox
        </h3>
        <div :class="cn('flex items-center gap-6')">
          <label
            :class="
              cn(
                'flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300',
              )
            "
          >
            <AppCheckbox v-model="checked1" />
            체크됨: {{ checked1 }}
          </label>
          <label
            :class="
              cn(
                'flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300',
              )
            "
          >
            <AppCheckbox v-model="checked2" />
            미체크: {{ checked2 }}
          </label>
          <label
            :class="
              cn(
                'flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300',
              )
            "
          >
            <AppCheckbox v-model="indeterminate" :indeterminate="true" />
            Indeterminate
          </label>
        </div>
      </section>

      <!-- 입력 필드 -->
      <section :class="cn('space-y-4')">
        <h3
          :class="cn('text-xl font-semibold text-slate-800 dark:text-white')"
        >
          AppInput
        </h3>
        <div
          :class="
            cn('flex flex-col md:flex-row items-start gap-4 max-w-2xl')
          "
        >
          <AppInput
            v-model="searchValue"
            placeholder="Search..."
            :icon="Search"
          />
          <AppInput
            v-model="dateValue"
            placeholder="Select Range"
            :icon="Calendar"
          />
          <AppInput placeholder="아이콘 없는 입력" />
        </div>
      </section>

      <!-- 셀렉트 -->
      <section :class="cn('space-y-4')">
        <h3
          :class="cn('text-xl font-semibold text-slate-800 dark:text-white')"
        >
          AppSelect
        </h3>
        <div :class="cn('max-w-xs')">
          <AppSelect
            v-model="selectValue"
            :options="statusOptions"
            placeholder="All Status"
          />
          <p :class="cn('mt-2 text-sm text-slate-500')">
            선택된 값: {{ selectValue || '없음' }}
          </p>
        </div>
      </section>
    </div>

    <!-- ============================================ -->
    <!-- Phase 2: Molecule 컴포넌트 -->
    <!-- ============================================ -->
    <div :class="cn('space-y-10')">
      <h2
        :class="
          cn(
            'text-lg font-bold text-primary border-b border-primary/30 pb-2',
          )
        "
      >
        Phase 2: Molecule 컴포넌트
      </h2>

      <!-- 브레드크럼 + 페이지 헤더 -->
      <section :class="cn('space-y-4')">
        <h3
          :class="cn('text-xl font-semibold text-slate-800 dark:text-white')"
        >
          Breadcrumb + PageHeader
        </h3>
        <div
          :class="
            cn(
              'bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800',
            )
          "
        >
          <PageHeader title="User Management">
            <template #breadcrumb>
              <Breadcrumb :items="breadcrumbItems" />
            </template>
            <template #actions>
              <AppButton variant="primary">
                <Plus :class="cn('size-4')" />
                <span>Add New User</span>
              </AppButton>
            </template>
          </PageHeader>
        </div>
      </section>

      <!-- 필터 패널 -->
      <section :class="cn('space-y-4')">
        <h3
          :class="cn('text-xl font-semibold text-slate-800 dark:text-white')"
        >
          FilterPanel
        </h3>
        <FilterPanel>
          <div
            :class="cn('flex flex-col md:flex-row items-end gap-4 w-full')"
          >
            <div :class="cn('flex flex-col w-full md:w-64 gap-1.5')">
              <label
                :class="
                  cn(
                    'text-xs font-bold text-slate-700 dark:text-slate-300 ml-1',
                  )
                "
              >
                Search
              </label>
              <AppInput
                v-model="searchValue"
                placeholder="Search..."
                :icon="Search"
              />
            </div>
            <div :class="cn('flex flex-col w-full md:w-48 gap-1.5')">
              <label
                :class="
                  cn(
                    'text-xs font-bold text-slate-700 dark:text-slate-300 ml-1',
                  )
                "
              >
                Date Range
              </label>
              <AppInput
                v-model="dateValue"
                placeholder="Select Range"
                :icon="Calendar"
              />
            </div>
            <div :class="cn('flex flex-col w-full md:w-40 gap-1.5')">
              <label
                :class="
                  cn(
                    'text-xs font-bold text-slate-700 dark:text-slate-300 ml-1',
                  )
                "
              >
                Status
              </label>
              <AppSelect
                v-model="selectValue"
                :options="statusOptions"
                placeholder="All Status"
              />
            </div>
            <div :class="cn('ml-auto flex items-center gap-2')">
              <AppButton variant="icon" size="lg">
                <RefreshCw :class="cn('size-5')" />
              </AppButton>
              <AppButton variant="secondary">
                <ListFilter :class="cn('size-4')" />
                <span>Filter</span>
              </AppButton>
            </div>
          </div>
        </FilterPanel>
      </section>

      <!-- 벌크 액션 바 -->
      <section :class="cn('space-y-4')">
        <h3
          :class="cn('text-xl font-semibold text-slate-800 dark:text-white')"
        >
          BulkActionBar
        </h3>
        <BulkActionBar
          :selected-count="selectedCount"
          @delete="selectedCount = 0"
        >
          <template #actions>
            <AppButton variant="ghost">
              <Download :class="cn('size-4')" />
              <span>Export</span>
            </AppButton>
            <AppButton variant="ghost">
              <ArrowUpDown :class="cn('size-4')" />
              <span>Change Status</span>
            </AppButton>
          </template>
        </BulkActionBar>
      </section>

      <!-- 페이지네이션 -->
      <section :class="cn('space-y-4')">
        <h3
          :class="cn('text-xl font-semibold text-slate-800 dark:text-white')"
        >
          Pagination
        </h3>
        <div
          :class="
            cn(
              'bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden',
            )
          "
        >
          <Pagination
            v-model:current-page="currentPage"
            :total-pages="10"
            :total-items="120"
            :page-size="12"
          />
        </div>
        <p :class="cn('text-sm text-slate-500')">
          현재 페이지: {{ currentPage }}
        </p>
      </section>
    </div>
  </main>
</template>
