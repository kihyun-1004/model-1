<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue';
import { cn } from '@/lib/utils';
import { iconList, iconCategories } from '@/utils/icons';
import { X, Check, Search } from 'lucide-vue-next';

// Props & Emits
const props = withDefaults(
  defineProps<{
    /** 모달 열림 여부 */
    open?: boolean;
    /** 현재 선택된 아이콘명 */
    icon?: string;
  }>(),
  {
    open: false,
    icon: '',
  },
);

const emit = defineEmits<{
  'update:open': [value: boolean];
  'update:icon': [value: string];
}>();

// 내부 상태
const searchQuery = ref('');
const selectedCategory = ref<string>('전체');
const tempSelectedIcon = ref<string>(props.icon);
const searchInputRef = ref<HTMLInputElement | null>(null);

// 모달 열릴 때 상태 초기화
watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      tempSelectedIcon.value = props.icon;
      searchQuery.value = '';
      selectedCategory.value = '전체';
      // 검색 입력란에 포커스
      nextTick(() => {
        searchInputRef.value?.focus();
      });
    }
  },
);

// 필터링된 아이콘 목록
const filteredIcons = computed(() => {
  let result = iconList;

  // 카테고리 필터
  if (selectedCategory.value !== '전체') {
    result = result.filter((icon) => icon.category === selectedCategory.value);
  }

  // 검색어 필터
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim();
    result = result.filter(
      (icon) =>
        icon.name.toLowerCase().includes(query) ||
        icon.label.toLowerCase().includes(query) ||
        icon.category.toLowerCase().includes(query),
    );
  }

  return result;
});

// 아이콘 선택 (임시)
function selectIcon(iconName: string) {
  tempSelectedIcon.value = iconName;
}

// 확인 버튼 클릭
function confirmSelection() {
  if (tempSelectedIcon.value) {
    emit('update:icon', tempSelectedIcon.value);
  }
  closeModal();
}

// 모달 닫기
function closeModal() {
  emit('update:open', false);
}

// ESC 키 핸들러
function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    closeModal();
  }
}
</script>

<template>
  <Teleport to="body">
    <!-- 오버레이 배경 -->
    <Transition name="modal-overlay">
      <div
        v-if="open"
        :class="
          cn(
            'fixed inset-0 z-50',
            'bg-gray-900/50 backdrop-blur-sm',
            'flex items-center justify-center p-4',
          )
        "
        @click.self="closeModal"
        @keydown="handleKeydown"
      >
        <!-- 모달 컨테이너 -->
        <Transition name="modal-content" appear>
          <div
            v-if="open"
            :class="
              cn(
                'bg-white dark:bg-slate-800',
                'w-full max-w-2xl rounded-xl',
                'shadow-2xl',
                'flex max-h-[85vh] flex-col',
              )
            "
            role="dialog"
            aria-modal="true"
            aria-labelledby="icon-picker-title"
          >
            <!-- 모달 헤더 -->
            <div
              :class="
                cn(
                  'flex items-center justify-between p-6',
                  'border-b border-slate-100 dark:border-slate-700',
                )
              "
            >
              <div>
                <h2
                  id="icon-picker-title"
                  :class="cn('text-xl font-semibold text-slate-900 dark:text-white')"
                >
                  아이콘 선택
                </h2>
                <p :class="cn('mt-1 text-sm text-slate-500 dark:text-slate-400')">
                  메뉴 항목에 사용할 아이콘을 선택하세요.
                </p>
              </div>
              <button
                :class="
                  cn(
                    'text-slate-400 hover:text-slate-600',
                    'dark:hover:text-slate-200',
                    'rounded-lg p-2 transition-colors',
                    'hover:bg-slate-100 dark:hover:bg-slate-700',
                    'focus:ring-primary/50 focus:ring-2 focus:outline-none',
                  )
                "
                @click="closeModal"
              >
                <X :size="20" />
              </button>
            </div>

            <!-- 모달 콘텐츠 영역 -->
            <div class="flex flex-1 flex-col overflow-hidden">
              <!-- 검색 바 -->
              <div class="px-6 pt-6 pb-4">
                <div class="relative">
                  <div
                    :class="
                      cn('absolute inset-y-0 left-0 pl-3', 'pointer-events-none flex items-center')
                    "
                  >
                    <Search :size="18" :class="cn('text-slate-400')" />
                  </div>
                  <input
                    ref="searchInputRef"
                    v-model="searchQuery"
                    type="text"
                    placeholder="아이콘 검색 (예: settings, user, home)..."
                    :class="
                      cn(
                        'block w-full py-2.5 pr-3 pl-10',
                        'border border-slate-300 dark:border-slate-600',
                        'rounded-lg leading-5',
                        'bg-white dark:bg-slate-900',
                        'placeholder-slate-400',
                        'focus:ring-primary focus:border-primary focus:ring-2 focus:outline-none',
                        'text-sm text-slate-900 dark:text-white',
                        'transition-shadow',
                      )
                    "
                  />
                </div>

                <!-- 카테고리 필터 -->
                <div :class="cn('scrollbar-hide mt-3 flex gap-2 overflow-x-auto pb-1')">
                  <button
                    v-for="category in iconCategories"
                    :key="category"
                    :class="
                      cn(
                        'rounded-full px-3 py-1 text-xs font-medium whitespace-nowrap transition-colors',
                        selectedCategory === category
                          ? 'text-primary bg-primary/10 border-primary/20 border'
                          : 'bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-900 dark:bg-slate-700 dark:text-slate-300 dark:hover:text-white',
                      )
                    "
                    @click="selectedCategory = category"
                  >
                    {{ category }}
                  </button>
                </div>
              </div>

              <!-- 아이콘 그리드 -->
              <div class="custom-scrollbar flex-1 overflow-y-auto px-6 pb-6">
                <!-- 결과 없음 표시 -->
                <div
                  v-if="filteredIcons.length === 0"
                  :class="
                    cn(
                      'flex flex-col items-center justify-center py-12',
                      'text-slate-400 dark:text-slate-500',
                    )
                  "
                >
                  <Search :size="40" class="mb-3 opacity-50" />
                  <p class="text-sm">검색 결과가 없습니다.</p>
                </div>

                <div
                  v-else
                  :class="cn('grid grid-cols-4 gap-3 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7')"
                >
                  <button
                    v-for="iconItem in filteredIcons"
                    :key="iconItem.name"
                    :class="
                      cn(
                        'group flex flex-col items-center justify-center',
                        'aspect-square rounded-lg transition-all',
                        'focus:ring-primary focus:ring-2 focus:ring-offset-2 focus:outline-none',
                        tempSelectedIcon === iconItem.name
                          ? 'border-primary bg-primary/10 dark:bg-primary/20 border-2'
                          : 'hover:border-primary/50 hover:bg-primary/5 dark:hover:bg-primary/10 border border-slate-200 dark:border-slate-700',
                      )
                    "
                    @click="selectIcon(iconItem.name)"
                    @dblclick="
                      selectIcon(iconItem.name);
                      confirmSelection();
                    "
                  >
                    <component
                      :is="iconItem.component"
                      :size="28"
                      :class="
                        cn(
                          'mb-1 transition-colors',
                          tempSelectedIcon === iconItem.name
                            ? 'text-primary'
                            : 'group-hover:text-primary text-slate-600 dark:text-slate-300',
                        )
                      "
                    />
                    <span
                      :class="
                        cn(
                          'w-full truncate px-1 text-center text-[10px] transition-colors',
                          tempSelectedIcon === iconItem.name
                            ? 'text-primary font-medium'
                            : 'group-hover:text-primary text-slate-500 dark:text-slate-400',
                        )
                      "
                    >
                      {{ iconItem.label }}
                    </span>
                  </button>
                </div>
              </div>
            </div>

            <!-- 모달 푸터 -->
            <div
              :class="
                cn(
                  'border-t border-slate-100 p-6 dark:border-slate-700',
                  'bg-slate-50 dark:bg-slate-900/50',
                  'flex justify-end gap-3 rounded-b-xl',
                )
              "
            >
              <button
                :class="
                  cn(
                    'rounded-lg px-5 py-2.5',
                    'border border-slate-300 dark:border-slate-600',
                    'text-sm font-medium',
                    'text-slate-700 dark:text-slate-300',
                    'hover:bg-slate-100 dark:hover:bg-slate-700',
                    'focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:outline-none',
                    'transition-colors',
                  )
                "
                @click="closeModal"
              >
                취소
              </button>
              <button
                :class="
                  cn(
                    'rounded-lg px-5 py-2.5',
                    'bg-primary hover:bg-primary/90',
                    'text-sm font-medium text-white',
                    'shadow-sm',
                    'focus:ring-primary focus:ring-2 focus:ring-offset-2 focus:outline-none',
                    'transition-colors',
                    'flex items-center gap-2',
                    'disabled:cursor-not-allowed disabled:opacity-50',
                  )
                "
                :disabled="!tempSelectedIcon"
                @click="confirmSelection"
              >
                <Check :size="16" />
                아이콘 선택
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* 오버레이 트랜지션 */
.modal-overlay-enter-active,
.modal-overlay-leave-active {
  transition: opacity 0.2s ease;
}

.modal-overlay-enter-from,
.modal-overlay-leave-to {
  opacity: 0;
}

/* 모달 콘텐츠 트랜지션 */
.modal-content-enter-active {
  transition: all 0.2s ease-out;
}

.modal-content-leave-active {
  transition: all 0.15s ease-in;
}

.modal-content-enter-from {
  opacity: 0;
  transform: scale(0.95) translateY(10px);
}

.modal-content-leave-to {
  opacity: 0;
  transform: scale(0.95) translateY(10px);
}

/* 커스텀 스크롤바 */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}
</style>
