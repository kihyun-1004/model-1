import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';

// 라우터 인스턴스 생성
const router = createRouter({
  // Web History 모드 사용 (clean URL)
  history: createWebHistory(import.meta.env.BASE_URL),
  // 라우트 정의
  routes: [
    // 1. 인증된 메인 레이아웃 (DashboardLayout)
    {
      path: '/',
      component: () => import('../views/MainLayout.vue'),
      children: [
        // 1-1. 홈 (대시보드 메인)
        {
          path: '',
          name: 'home',
          component: HomeView,
        },
        // 1-2. 사용자 관리 페이지
        {
          path: 'users',
          name: 'user-management',
          component: () => import('../views/UserManagement.vue'),
        },
        // 1-3. 권한 관리 페이지
        {
          path: 'permissions',
          name: 'permission-management',
          component: () => import('../views/PermissionManagement.vue'),
        },
        // 1-4. 메뉴 관리 페이지
        {
          path: 'menus',
          name: 'menu-management',
          component: () => import('../views/MenuManagement.vue'),
        },
        // 1-3. 컴포넌트 데모 (개발용)
        // 데모 페이지도 대시보드 레이아웃 안에 포함시키고 싶다면 여기로 이동
        // 현재는 별도 레이아웃을 전제로 할 수 있으나, 일관성을 위해 일단 둠.
        // ComponentDemo는 자체적인 Full Page 레이아웃 스타일을 가질 수 있으므로
        // 만약 DashboardLayout을 원치 않으면 밖으로 빼야 함.
        // 기존 코드상 ComponentDemo는 DashboardLayout을 쓰지 않고 직접 스타일링 되어 있었음.
        // 따라서 ComponentDemo는 이 children에서 제외하고 별도 루트로 유지하거나,
        // 필요 시 MainLayout 내부로 편입. (사용자 요청은 "login 화면을 제외한 나머지")
        // 일단 "나머지"라고 했으므로 포함시키는 것이 맞으나,
        // ComponentDemo의 내부 스타일(min-h-screen, p-8 등)이 DashboardLayout과 충돌할 수 있음.
        // 안전하게 demo는 분리해 두거나, 사용자가 원하면 포함.
        // 여기서는 "User Management 처럼" 이라는 문맥상 업무용 화면들을 의미함.
        // Demo는 일단 제외하고 별도로 둠 (기존 유지)
      ],
    },

    // 2. 컴포넌트 데모 (개발용) - 별도 레이아웃 유지
    {
      path: '/demo',
      name: 'component-demo',
      component: () => import('../views/ComponentDemo.vue'),
    },

    // 3. TanStack Table 데모 (개발/학습용)
    {
      path: '/tabledemo',
      name: 'table-demo',
      component: () => import('../views/TableDemoView.vue'),
    },

    // 3. 로그인 페이지
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
    },
  ],
});

export default router;
