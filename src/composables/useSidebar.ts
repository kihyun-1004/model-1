import { ref } from 'vue';

// 사이드바 열림/닫힘 상태 (전역 공유)
const isOpen = ref(true);

/**
 * 사이드바 상태 관리 Composable
 * - Header(토글)와 Sidebar(반응) 간의 상태 공유
 */
export function useSidebar() {
  /**
   * 사이드바 토글 (열림 <-> 닫힘)
   */
  const toggleSidebar = () => {
    isOpen.value = !isOpen.value;
  };

  const closeSidebar = () => {
    isOpen.value = false;
  };

  const openSidebar = () => {
    isOpen.value = true;
  };

  return {
    isOpen,
    toggleSidebar,
    closeSidebar,
    openSidebar,
  };
}
