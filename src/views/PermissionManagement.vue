<script setup lang="ts">
import { ref, computed } from 'vue';
import { cn } from '@/lib/utils';
import { FileDown, Copy } from 'lucide-vue-next';

// 컴포넌트 import
import AppButton from '@/components/ui/AppButton.vue';
import AppBreadcrumb from '@/components/ui/AppBreadcrumb.vue';
import type { BreadcrumbItem } from '@/components/ui/AppBreadcrumb.vue';
import AppPageHeader from '@/components/ui/AppPageHeader.vue';

// 분리된 컴포넌트
import PermissionRoleList from '@/components/permissions/PermissionRoleList.vue';
import PermissionRoleDetail from '@/components/permissions/PermissionRoleDetail.vue';

import type { CodeRole, MenuPermission } from '@/types/role';
import { roles as initialRoles, initialMenuPermissions } from '@/data/roles';

// ===== State =====
const searchQuery = ref('');
const selectedRoleId = ref<number>(1);
// 선택된 역할의 권한 데이터 (Deep Copy로 독립성 유지)
const currentPermissions = ref<MenuPermission[]>(
  JSON.parse(JSON.stringify(initialMenuPermissions)),
);
const roles = ref<CodeRole[]>(initialRoles);

// ===== 브레드크럼 =====
const breadcrumbItems: BreadcrumbItem[] = [
  { label: 'Dashboard', href: '/' },
  { label: 'Users', href: '#' },
  { label: 'Role Management' },
];

// ===== Computed =====
const filteredRoles = computed(() => {
  if (!searchQuery.value) return roles.value;
  const query = searchQuery.value.toLowerCase();
  return roles.value.filter(
    (r) => r.name.toLowerCase().includes(query) || r.code.toLowerCase().includes(query),
  );
});

const selectedRole = computed(() => {
  return roles.value.find((r) => r.id === selectedRoleId.value);
});

// ===== Methods =====
function selectRole(id: number) {
  selectedRoleId.value = id;
  // Mock: Role 변경 시 권한 데이터 로드 (실제론 API 호출)
  console.log(`Loading permissions for Role ID: ${id}`);

  // 데이터 리셋 및 모의 로드
  const newPermissions = JSON.parse(JSON.stringify(initialMenuPermissions));
  if (id === 1) {
    // Admin: Full Access
    newPermissions.forEach((m: MenuPermission) => {
      m.permissions = { read: true, create: true, update: true, delete: true, export: true };
    });
  } else if (id === 3 || id === 4) {
    // Viewer/Guest: Read Only
    newPermissions.forEach((m: MenuPermission) => {
      m.permissions = {
        read: true,
        create: false,
        update: false,
        delete: false,
        export: id === 3,
      };
    });
  }
  currentPermissions.value = newPermissions;
}

function handleSave() {
  alert(`Permissions saved for ${selectedRole.value?.name}`);
}

function handleAddRole() {
  alert('Open Create Role Modal');
}

function toggleExpand(menu: MenuPermission) {
  if (menu.hasChildren) {
    menu.expanded = !menu.expanded;
  }
}

// 초기 로드 시 Admin 권한 세팅
selectRole(1);
</script>

<template>
  <div :class="cn('bg-background-light dark:bg-background-dark flex min-h-0 flex-1 flex-col')">
    <!-- 헤더 영역 -->
    <div :class="cn('shrink-0 px-6 pt-6 pb-2')">
      <AppPageHeader title="Role Management">
        <template #breadcrumb>
          <AppBreadcrumb :items="breadcrumbItems" />
        </template>
        <template #actions>
          <AppButton variant="outline">
            <FileDown :class="cn('mr-2 size-4')" />
            <span>Export</span>
          </AppButton>
          <AppButton variant="outline">
            <Copy :class="cn('mr-2 size-4')" />
            <span>Copy Role</span>
          </AppButton>
        </template>
      </AppPageHeader>
    </div>

    <!-- 메인 컨텐츠 (좌우 분할) -->
    <div :class="cn('flex flex-1 gap-6 overflow-hidden px-6 pb-6')">
      <!-- 좌측 패널: 역할 목록 -->
      <PermissionRoleList
        :roles="filteredRoles"
        :selected-role-id="selectedRoleId"
        v-model:search-query="searchQuery"
        @select="selectRole"
        @add="handleAddRole"
      />

      <!-- 우측 패널: 상세 정보 및 권한 매핑 -->
      <PermissionRoleDetail
        v-if="selectedRole"
        :role="selectedRole"
        :permissions="currentPermissions"
        @save="handleSave"
        @copy="() => {}"
        @toggle-expand="toggleExpand"
      />
    </div>
  </div>
</template>
