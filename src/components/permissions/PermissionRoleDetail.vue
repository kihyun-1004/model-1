<script setup lang="ts">
import { cn } from '@/lib/utils';
import {
  Shield,
  Copy,
  Save,
  ChevronRight,
  ChevronDown,
  LayoutDashboard,
  Users,
  Settings,
  BarChart,
} from 'lucide-vue-next';
import type { CodeRole, MenuPermission } from '@/types/role';

interface Props {
  role: CodeRole;
  permissions: MenuPermission[];
}

interface Emits {
  (e: 'save'): void;
  (e: 'copy'): void;
  (e: 'toggleExpand', menu: MenuPermission): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

// v-model을 위한 local state 동기화는 복잡하므로, props를 직접 mutatation 하는 대신
// 상위에서 객체 참조를 넘겨주므로 form 입력은 직접 바인딩됩니다.
// 단, anti-pattern일 수 있으나 여기서는 리팩토링 범위를 고려하여 기존 구조 유지.
// 더 좋은 방법은 local state를 만들고 watch로 동기화하거나 emit('update:role', val) 패턴 사용.
// 편의상 Role 객체는 반응형 객체이므로 직접 바인딩을 허용하는 패턴으로 작성 (기존 뷰와 동일)
</script>

<template>
  <div
    :class="
      cn(
        'relative flex flex-1 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900',
      )
    "
  >
    <!-- 상세 정보 폼 -->
    <div :class="cn('shrink-0 p-6 pb-0')">
      <div :class="cn('mb-6 flex items-center justify-between')">
        <h2
          :class="cn('flex items-center gap-2 text-lg font-bold text-slate-800 dark:text-white')"
        >
          <Shield :class="cn('text-primary size-5')" />
          Role Details: {{ role.name }}
        </h2>
        <button
          @click="emit('copy')"
          :class="
            cn(
              'flex items-center gap-2 rounded-lg border border-transparent bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:border-slate-300 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-slate-600',
            )
          "
        >
          <Copy :class="cn('size-3.5')" />
          Copy Permissions
        </button>
      </div>

      <div :class="cn('mb-6 grid grid-cols-4 gap-6')">
        <div :class="cn('flex flex-col gap-1.5')">
          <label :class="cn('text-xs font-bold text-slate-500 uppercase')">Role Code</label>
          <input
            v-model="role.code"
            type="text"
            readonly
            :class="
              cn(
                'w-full cursor-not-allowed rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 font-mono text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-800',
              )
            "
          />
        </div>
        <div :class="cn('flex flex-col gap-1.5')">
          <label :class="cn('text-xs font-bold text-slate-500 uppercase')">Role Name</label>
          <input
            v-model="role.name"
            type="text"
            :class="
              cn(
                'focus:ring-primary focus:border-primary w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm outline-none focus:ring-1 dark:border-slate-700 dark:bg-slate-800',
              )
            "
          />
        </div>
        <div :class="cn('flex flex-col gap-1.5')">
          <label :class="cn('text-xs font-bold text-slate-500 uppercase')">Sort Order</label>
          <input
            v-model="role.sortOrder"
            type="number"
            :class="
              cn(
                'focus:ring-primary focus:border-primary w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 font-mono text-sm outline-none focus:ring-1 dark:border-slate-700 dark:bg-slate-800',
              )
            "
          />
        </div>
        <div :class="cn('flex flex-col gap-1.5')">
          <label :class="cn('text-xs font-bold text-slate-500 uppercase')">Status</label>
          <label :class="cn('mt-1 inline-flex cursor-pointer items-center')">
            <input
              type="checkbox"
              :checked="role.status === 'active'"
              @change="
                role.status = ($event.target as HTMLInputElement).checked ? 'active' : 'inactive'
              "
              :class="cn('peer sr-only')"
            />
            <div
              :class="
                cn(
                  'peer peer-checked:bg-primary relative h-6 w-11 rounded-full bg-slate-200 peer-focus:outline-none after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[\'\'] peer-checked:after:translate-x-full peer-checked:after:border-white rtl:peer-checked:after:-translate-x-full dark:border-gray-600 dark:bg-slate-700',
                )
              "
            ></div>
            <span :class="cn('ms-3 text-sm font-medium text-slate-700 dark:text-slate-300')">
              {{ role.status === 'active' ? 'Active' : 'Inactive' }}
            </span>
          </label>
        </div>
        <div :class="cn('col-span-4 flex flex-col gap-1.5')">
          <label :class="cn('text-xs font-bold text-slate-500 uppercase')">Description</label>
          <textarea
            v-model="role.description"
            rows="2"
            :class="
              cn(
                'focus:ring-primary focus:border-primary w-full resize-none rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm outline-none focus:ring-1 dark:border-slate-700 dark:bg-slate-800',
              )
            "
          ></textarea>
        </div>
      </div>
    </div>

    <!-- 메뉴 권한 테이블 -->
    <div :class="cn('flex flex-1 flex-col overflow-hidden px-6 pb-20')">
      <div
        :class="
          cn(
            'flex h-full flex-col overflow-hidden rounded-lg border border-slate-200 shadow-sm dark:border-slate-700',
          )
        "
      >
        <!-- 테이블 헤더 -->
        <div
          :class="
            cn(
              'flex shrink-0 items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-800/50',
            )
          "
        >
          <h3 :class="cn('text-sm font-bold text-slate-700 dark:text-slate-200')">
            Menu Permissions Mapping
          </h3>
          <div :class="cn('flex items-center gap-4 text-xs font-bold text-slate-400')">
            <span :class="cn('flex items-center gap-1')"
              ><span :class="cn('bg-primary h-2 w-2 rounded-full')"></span> R: Read</span
            >
            <span :class="cn('flex items-center gap-1')"
              ><span :class="cn('bg-primary h-2 w-2 rounded-full')"></span> C: Create</span
            >
            <span :class="cn('flex items-center gap-1')"
              ><span :class="cn('bg-primary h-2 w-2 rounded-full')"></span> U: Update</span
            >
            <span :class="cn('flex items-center gap-1')"
              ><span :class="cn('bg-primary h-2 w-2 rounded-full')"></span> D: Delete</span
            >
            <span :class="cn('flex items-center gap-1')"
              ><span :class="cn('bg-primary h-2 w-2 rounded-full')"></span> E: Excel</span
            >
          </div>
        </div>

        <!-- 스크롤 가능한 테이블 영역 -->
        <div :class="cn('flex-1 overflow-y-auto')">
          <table :class="cn('w-full border-separate border-spacing-0 text-sm')">
            <thead :class="cn('sticky top-0 z-10 bg-slate-100 dark:bg-slate-800')">
              <tr>
                <th
                  :class="
                    cn(
                      'border-b border-slate-200 bg-slate-200/50 px-4 py-2 text-left font-bold text-slate-600 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-400',
                    )
                  "
                >
                  Menu Name
                </th>
                <th
                  v-for="h in ['R', 'C', 'U', 'D', 'E']"
                  :key="h"
                  :class="
                    cn(
                      'w-16 border-b border-slate-200 bg-slate-200/50 px-2 py-2 text-center font-bold text-slate-600 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-400',
                    )
                  "
                >
                  {{ h }}
                </th>
              </tr>
            </thead>
            <tbody
              :class="
                cn('divide-y divide-slate-100 bg-white dark:divide-slate-800 dark:bg-slate-900')
              "
            >
              <tr
                v-for="menu in permissions"
                :key="menu.id"
                :class="
                  cn(
                    'transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/40',
                    menu.level === 0 ? 'bg-slate-50/50 dark:bg-slate-800/20' : '',
                  )
                "
              >
                <!-- 트리 구조 이름 -->
                <td :class="cn('px-4 py-2')">
                  <div
                    :class="cn('flex h-full items-center')"
                    :style="{ paddingLeft: `${menu.level * 20}px` }"
                  >
                    <div
                      v-if="menu.hasChildren"
                      @click="emit('toggleExpand', menu)"
                      :class="
                        cn(
                          'mr-1 cursor-pointer rounded p-0.5 hover:bg-slate-200 dark:hover:bg-slate-700',
                        )
                      "
                    >
                      <component
                        :is="menu.expanded ? ChevronDown : ChevronRight"
                        :class="cn('size-4 text-slate-500')"
                      />
                    </div>
                    <div v-else :class="cn('mr-1 w-5')"></div>

                    <!-- 아이콘: Level 0일 때만 표시 -->
                    <component
                      v-if="menu.level === 0"
                      :is="
                        menu.id === 'dashboard'
                          ? LayoutDashboard
                          : menu.id === 'users'
                            ? Users
                            : menu.id === 'settings'
                              ? Settings
                              : menu.id === 'analytics'
                                ? BarChart
                                : Shield
                      "
                      :class="cn('text-primary mr-2 size-4')"
                    />
                    <div
                      v-else
                      :class="cn('mr-2 h-1.5 w-1.5 rounded-full bg-slate-300 dark:bg-slate-600')"
                    ></div>

                    <span
                      :class="
                        cn(
                          'text-slate-700 dark:text-slate-300',
                          menu.level === 0 ? 'font-bold' : 'font-normal',
                        )
                      "
                    >
                      {{ menu.name }}
                    </span>
                  </div>
                </td>

                <!-- 권한 체크박스들 -->
                <td :class="cn('bg-inherit text-center')">
                  <input
                    type="checkbox"
                    v-model="menu.permissions.read"
                    :class="cn('focus:ring-primary size-4 rounded border-slate-300 text-primary')"
                  />
                </td>
                <td :class="cn('bg-inherit text-center')">
                  <input
                    type="checkbox"
                    v-model="menu.permissions.create"
                    :class="cn('focus:ring-primary size-4 rounded border-slate-300 text-primary')"
                  />
                </td>
                <td :class="cn('bg-inherit text-center')">
                  <input
                    type="checkbox"
                    v-model="menu.permissions.update"
                    :class="cn('focus:ring-primary size-4 rounded border-slate-300 text-primary')"
                  />
                </td>
                <td :class="cn('bg-inherit text-center')">
                  <input
                    type="checkbox"
                    v-model="menu.permissions.delete"
                    :class="cn('focus:ring-primary size-4 rounded border-slate-300 text-primary')"
                  />
                </td>
                <td :class="cn('bg-inherit text-center')">
                  <input
                    type="checkbox"
                    v-model="menu.permissions.export"
                    :class="cn('focus:ring-primary size-4 rounded border-slate-300 text-primary')"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- 하단 액션 바 (Floating) -->
    <div
      :class="
        cn(
          'pointer-events-none absolute right-0 bottom-0 left-0 z-20 rounded-b-xl bg-linear-to-t from-white via-white/95 to-transparent p-6 dark:from-slate-900 dark:via-slate-900/95',
        )
      "
    >
      <div :class="cn('pointer-events-auto flex justify-end gap-3')">
        <button
          :class="
            cn(
              'rounded-lg border border-slate-300 bg-white px-6 py-2 text-sm font-medium text-slate-600 transition-all hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800',
            )
          "
        >
          Cancel
        </button>
        <button
          @click="emit('save')"
          :class="
            cn(
              'bg-primary hover:bg-primary/90 shadow-primary/20 flex items-center gap-2 rounded-lg px-8 py-2 text-sm font-bold text-white shadow-lg transition-all',
            )
          "
        >
          <Save :class="cn('size-4')" />
          <span>Save Changes</span>
        </button>
      </div>
    </div>
  </div>
</template>
