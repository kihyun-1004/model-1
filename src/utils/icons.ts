/**
 * 사이드바 메뉴용 대중적 아이콘 리스트 (lucide-vue-next)
 * - iconMap: 아이콘 이름 → 컴포넌트 매핑 (외부에서 이름으로 컴포넌트 조회용)
 * - iconList: 카테고리별 아이콘 정보 배열 (아이콘 피커 모달용)
 */
import { markRaw, type Component } from 'vue';
import {
  // 네비게이션
  LayoutDashboard,
  Home,
  Menu,
  ChevronRight,
  ArrowLeft,
  ExternalLink,
  Navigation,
  Compass,
  Map,
  Globe,
  // 콘텐츠
  FileText,
  FolderOpen,
  Image,
  Video,
  BookOpen,
  Newspaper,
  ClipboardList,
  Archive,
  Database,
  Table,
  // 커뮤니케이션
  Mail,
  MessageSquare,
  Bell,
  Phone,
  Send,
  Users,
  UserPlus,
  UserCheck,
  Contact,
  AtSign,
  // 비즈니스
  BarChart3,
  PieChart,
  TrendingUp,
  DollarSign,
  ShoppingCart,
  CreditCard,
  Briefcase,
  Building2,
  Receipt,
  Package,
  // 시스템
  Settings,
  Lock,
  Shield,
  Key,
  Wrench,
  Bug,
  Server,
  Cloud,
  HardDrive,
  Cpu,
  // 기타
  Star,
  Heart,
  Bookmark,
  Calendar,
  Clock,
  Search,
  Zap,
  Activity,
  CircleHelp,
  Info,
} from 'lucide-vue-next';

/** 아이콘 항목 타입 */
export interface IconItem {
  /** lucide 컴포넌트명 (예: "LayoutDashboard") */
  name: string;
  /** 사용자에게 보여줄 라벨 */
  label: string;
  /** 카테고리 */
  category: string;
  /** lucide-vue-next 컴포넌트 */
  component: Component;
}

/** 아이콘 카테고리 목록 */
export const iconCategories = [
  '전체',
  '네비게이션',
  '콘텐츠',
  '커뮤니케이션',
  '비즈니스',
  '시스템',
  '기타',
] as const;

/**
 * 아이콘 이름 → 컴포넌트 매핑
 * 외부에서 아이콘 이름(문자열)으로 컴포넌트를 조회할 때 사용
 */
export const iconMap: Record<string, Component> = {
  LayoutDashboard,
  Home,
  Menu,
  ChevronRight,
  ArrowLeft,
  ExternalLink,
  Navigation,
  Compass,
  Map,
  Globe,
  FileText,
  FolderOpen,
  Image,
  Video,
  BookOpen,
  Newspaper,
  ClipboardList,
  Archive,
  Database,
  Table,
  Mail,
  MessageSquare,
  Bell,
  Phone,
  Send,
  Users,
  UserPlus,
  UserCheck,
  Contact,
  AtSign,
  BarChart3,
  PieChart,
  TrendingUp,
  DollarSign,
  ShoppingCart,
  CreditCard,
  Briefcase,
  Building2,
  Receipt,
  Package,
  Settings,
  Lock,
  Shield,
  Key,
  Wrench,
  Bug,
  Server,
  Cloud,
  HardDrive,
  Cpu,
  Star,
  Heart,
  Bookmark,
  Calendar,
  Clock,
  Search,
  Zap,
  Activity,
  CircleHelp,
  Info,
};

/** 사이드바 메뉴용 대중적 아이콘 리스트 (카테고리별 분류) */
export const iconList: IconItem[] = [
  // 네비게이션
  {
    name: 'LayoutDashboard',
    label: 'Dashboard',
    category: '네비게이션',
    component: markRaw(LayoutDashboard),
  },
  { name: 'Home', label: 'Home', category: '네비게이션', component: markRaw(Home) },
  { name: 'Menu', label: 'Menu', category: '네비게이션', component: markRaw(Menu) },
  {
    name: 'ChevronRight',
    label: 'Chevron Right',
    category: '네비게이션',
    component: markRaw(ChevronRight),
  },
  { name: 'ArrowLeft', label: 'Arrow Left', category: '네비게이션', component: markRaw(ArrowLeft) },
  {
    name: 'ExternalLink',
    label: 'External Link',
    category: '네비게이션',
    component: markRaw(ExternalLink),
  },
  {
    name: 'Navigation',
    label: 'Navigation',
    category: '네비게이션',
    component: markRaw(Navigation),
  },
  { name: 'Compass', label: 'Compass', category: '네비게이션', component: markRaw(Compass) },
  { name: 'Map', label: 'Map', category: '네비게이션', component: markRaw(Map) },
  { name: 'Globe', label: 'Globe', category: '네비게이션', component: markRaw(Globe) },
  // 콘텐츠
  { name: 'FileText', label: 'File Text', category: '콘텐츠', component: markRaw(FileText) },
  { name: 'FolderOpen', label: 'Folder Open', category: '콘텐츠', component: markRaw(FolderOpen) },
  { name: 'Image', label: 'Image', category: '콘텐츠', component: markRaw(Image) },
  { name: 'Video', label: 'Video', category: '콘텐츠', component: markRaw(Video) },
  { name: 'BookOpen', label: 'Book Open', category: '콘텐츠', component: markRaw(BookOpen) },
  { name: 'Newspaper', label: 'Newspaper', category: '콘텐츠', component: markRaw(Newspaper) },
  {
    name: 'ClipboardList',
    label: 'Clipboard List',
    category: '콘텐츠',
    component: markRaw(ClipboardList),
  },
  { name: 'Archive', label: 'Archive', category: '콘텐츠', component: markRaw(Archive) },
  { name: 'Database', label: 'Database', category: '콘텐츠', component: markRaw(Database) },
  { name: 'Table', label: 'Table', category: '콘텐츠', component: markRaw(Table) },
  // 커뮤니케이션
  { name: 'Mail', label: 'Mail', category: '커뮤니케이션', component: markRaw(Mail) },
  {
    name: 'MessageSquare',
    label: 'Message',
    category: '커뮤니케이션',
    component: markRaw(MessageSquare),
  },
  { name: 'Bell', label: 'Bell', category: '커뮤니케이션', component: markRaw(Bell) },
  { name: 'Phone', label: 'Phone', category: '커뮤니케이션', component: markRaw(Phone) },
  { name: 'Send', label: 'Send', category: '커뮤니케이션', component: markRaw(Send) },
  { name: 'Users', label: 'Users', category: '커뮤니케이션', component: markRaw(Users) },
  { name: 'UserPlus', label: 'User Plus', category: '커뮤니케이션', component: markRaw(UserPlus) },
  {
    name: 'UserCheck',
    label: 'User Check',
    category: '커뮤니케이션',
    component: markRaw(UserCheck),
  },
  { name: 'Contact', label: 'Contact', category: '커뮤니케이션', component: markRaw(Contact) },
  { name: 'AtSign', label: 'At Sign', category: '커뮤니케이션', component: markRaw(AtSign) },
  // 비즈니스
  { name: 'BarChart3', label: 'Bar Chart', category: '비즈니스', component: markRaw(BarChart3) },
  { name: 'PieChart', label: 'Pie Chart', category: '비즈니스', component: markRaw(PieChart) },
  {
    name: 'TrendingUp',
    label: 'Trending Up',
    category: '비즈니스',
    component: markRaw(TrendingUp),
  },
  {
    name: 'DollarSign',
    label: 'Dollar Sign',
    category: '비즈니스',
    component: markRaw(DollarSign),
  },
  {
    name: 'ShoppingCart',
    label: 'Shopping Cart',
    category: '비즈니스',
    component: markRaw(ShoppingCart),
  },
  {
    name: 'CreditCard',
    label: 'Credit Card',
    category: '비즈니스',
    component: markRaw(CreditCard),
  },
  { name: 'Briefcase', label: 'Briefcase', category: '비즈니스', component: markRaw(Briefcase) },
  { name: 'Building2', label: 'Building', category: '비즈니스', component: markRaw(Building2) },
  { name: 'Receipt', label: 'Receipt', category: '비즈니스', component: markRaw(Receipt) },
  { name: 'Package', label: 'Package', category: '비즈니스', component: markRaw(Package) },
  // 시스템
  { name: 'Settings', label: 'Settings', category: '시스템', component: markRaw(Settings) },
  { name: 'Lock', label: 'Lock', category: '시스템', component: markRaw(Lock) },
  { name: 'Shield', label: 'Shield', category: '시스템', component: markRaw(Shield) },
  { name: 'Key', label: 'Key', category: '시스템', component: markRaw(Key) },
  { name: 'Wrench', label: 'Wrench', category: '시스템', component: markRaw(Wrench) },
  { name: 'Bug', label: 'Bug', category: '시스템', component: markRaw(Bug) },
  { name: 'Server', label: 'Server', category: '시스템', component: markRaw(Server) },
  { name: 'Cloud', label: 'Cloud', category: '시스템', component: markRaw(Cloud) },
  { name: 'HardDrive', label: 'Hard Drive', category: '시스템', component: markRaw(HardDrive) },
  { name: 'Cpu', label: 'CPU', category: '시스템', component: markRaw(Cpu) },
  // 기타
  { name: 'Star', label: 'Star', category: '기타', component: markRaw(Star) },
  { name: 'Heart', label: 'Heart', category: '기타', component: markRaw(Heart) },
  { name: 'Bookmark', label: 'Bookmark', category: '기타', component: markRaw(Bookmark) },
  { name: 'Calendar', label: 'Calendar', category: '기타', component: markRaw(Calendar) },
  { name: 'Clock', label: 'Clock', category: '기타', component: markRaw(Clock) },
  { name: 'Search', label: 'Search', category: '기타', component: markRaw(Search) },
  { name: 'Zap', label: 'Zap', category: '기타', component: markRaw(Zap) },
  { name: 'Activity', label: 'Activity', category: '기타', component: markRaw(Activity) },
  { name: 'CircleHelp', label: 'Help', category: '기타', component: markRaw(CircleHelp) },
  { name: 'Info', label: 'Info', category: '기타', component: markRaw(Info) },
];
