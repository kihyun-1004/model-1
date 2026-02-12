import { ref } from 'vue';

// 전역 다크모드 상태 (싱글톤 패턴으로 앱 전체 공유)
const isDark = ref(false);

/**
 * 테마 관리 Composable
 * 다크모드/라이트모드 전환 및 영속성 관리
 */
export function useTheme() {
  /**
   * 초기 테마 설정
   * - 로컬 스토리지에 저장된 테마 확인
   * - 없으면 시스템 설정(prefers-color-scheme) 확인
   * - document root에 'dark' 클래스 적용 여부 결정
   */
  const initTheme = () => {
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
      isDark.value = true;
      document.documentElement.classList.add('dark');
    } else {
      isDark.value = false;
      document.documentElement.classList.remove('dark');
    }
  };

  /**
   * 테마 토글 함수
   * - 상태 변경 및 DOM 클래스 업데이트
   * - 사용자 선택을 로컬 스토리지에 저장
   * - 부드러운 전환을 위한 트랜지션 클래스 임시 적용
   */
  const toggleTheme = () => {
    // 트랜지션 클래스 추가 (애니메이션 활성화)
    document.documentElement.classList.add('theme-transition');

    isDark.value = !isDark.value;
    if (isDark.value) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }

    // 애니메이션 종료(300ms) 후 트랜지션 클래스 제거
    // (CSS transition-duration과 일치해야 함)
    setTimeout(() => {
      document.documentElement.classList.remove('theme-transition');
    }, 500);
  };

  return {
    isDark,
    initTheme,
    toggleTheme,
  };
}
