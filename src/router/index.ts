import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';

// 라우터 인스턴스 생성
const router = createRouter({
  // Web History 모드 사용 (clean URL)
  history: createWebHistory(import.meta.env.BASE_URL),
  // 라우트 정의
  routes: [
    // 1. 홈 (대시보드 메인)
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    // 2. 컴포넌트 데모 (개발용)
    // Lazy Loading 적용 (필요할 때 청크 로드)
    {
      path: '/demo',
      name: 'component-demo',
      component: () => import('../views/ComponentDemo.vue'),
    },
    // 3. 사용자 관리 페이지
    // Lazy Loading 적용
    {
      path: '/users',
      name: 'user-management',
      component: () => import('../views/UserManagement.vue'),
    },
  ],
});

export default router;
