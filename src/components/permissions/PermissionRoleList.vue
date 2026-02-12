<script setup lang="ts">
import { cn } from '@/lib/utils';
import { Search, Plus } from 'lucide-vue-next';
import AppBadge from '@/components/ui/AppBadge.vue';
import type { CodeRole, RoleStatus } from '@/types/role';

interface Props {
  roles: CodeRole[];
  selectedRoleId: number;
  searchQuery: string;
}

interface Emits {
  (e: 'update:searchQuery', value: string): void;
  (e: 'select', id: number): void;
  (e: 'add'): void;
}

defineProps<Props>();
const emit = defineEmits<Emits>();

function getStatusVariant(status: RoleStatus) {
  return status === 'active' ? 'success' : 'default';
}
</script>

<template>
  <div
    :class="
      cn(
        'flex w-[30%] min-w-[300px] flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900',
      )
    "
  >
    <!-- 검색 -->
    <div
      :class="
        cn(
          'border-b border-slate-200 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-800/20',
        )
      "
    >
      <div :class="cn('relative')">
        <Search :class="cn('absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400')" />
        <input
          :value="searchQuery"
          @input="emit('update:searchQuery', ($event.target as HTMLInputElement).value)"
          :class="
            cn(
              'focus:ring-primary focus:border-primary w-full rounded-lg border border-slate-300 bg-white py-2 pr-4 pl-9 text-sm shadow-sm outline-none focus:ring-1 dark:border-slate-700 dark:bg-slate-900',
            )
          "
          placeholder="Search roles..."
          type="text"
        />
      </div>
    </div>

    <!-- 목록 테이블 -->
    <div :class="cn('flex-1 overflow-y-auto')">
      <table :class="cn('w-full text-sm')">
        <thead
          :class="
            cn(
              'sticky top-0 z-10 bg-slate-100 text-xs font-bold tracking-wider text-slate-500 uppercase dark:bg-slate-800',
            )
          "
        >
          <tr>
            <th
              :class="
                cn(
                  'w-10 border-r border-slate-200 bg-slate-200/50 px-3 py-2 text-center dark:border-slate-700 dark:bg-slate-800/80',
                )
              "
            >
              #
            </th>
            <th
              :class="
                cn(
                  'border-r border-slate-200 bg-slate-200/50 px-3 py-2 text-left dark:border-slate-700 dark:bg-slate-800/80',
                )
              "
            >
              Code
            </th>
            <th :class="cn('bg-slate-200/50 px-3 py-2 text-left dark:bg-slate-800/80')">Name</th>
            <th :class="cn('w-20 bg-slate-200/50 px-3 py-2 text-center dark:bg-slate-800/80')">
              Status
            </th>
          </tr>
        </thead>
        <tbody :class="cn('divide-y divide-slate-100 dark:divide-slate-800')">
          <tr
            v-for="(role, index) in roles"
            :key="role.id"
            @click="emit('select', role.id)"
            :class="
              cn(
                'cursor-pointer border-l-2 transition-colors',
                selectedRoleId === role.id
                  ? 'bg-primary/5 border-l-primary'
                  : 'border-l-transparent hover:bg-slate-50 dark:hover:bg-slate-800',
              )
            "
          >
            <td :class="cn('px-3 py-3 text-center text-slate-500')">{{ index + 1 }}</td>
            <td
              :class="
                cn(
                  'px-3 py-3 font-mono text-xs font-bold',
                  selectedRoleId === role.id
                    ? 'text-primary'
                    : 'text-slate-600 dark:text-slate-400',
                )
              "
            >
              {{ role.code }}
            </td>
            <td :class="cn('px-3 py-3 font-medium text-slate-900 dark:text-white')">
              {{ role.name }}
            </td>
            <td :class="cn('px-3 py-3 text-center')">
              <AppBadge
                :variant="getStatusVariant(role.status)"
                :class="cn('px-1.5 py-0.5 text-[10px]')"
              >
                {{ role.status.toUpperCase() }}
              </AppBadge>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 하단 추가 버튼 -->
    <div
      :class="
        cn(
          'border-t border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/50',
        )
      "
    >
      <button
        @click="emit('add')"
        :class="
          cn(
            'hover:border-primary hover:text-primary flex w-full items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm transition-all dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300',
          )
        "
      >
        <Plus :class="cn('size-4')" />
        <span>New Role</span>
      </button>
    </div>
  </div>
</template>
