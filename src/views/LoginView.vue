<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { cn } from '@/lib/utils';
import { Layers, User, Lock, Eye, EyeOff } from 'lucide-vue-next';
import AppInput from '@/components/ui/AppInput.vue';
import AppButton from '@/components/ui/AppButton.vue';
import AppCheckbox from '@/components/ui/AppCheckbox.vue';

const router = useRouter();

// 폼 상태
const username = ref('');
const password = ref('');
const rememberMe = ref(false);
const showPassword = ref(false);

const handleLogin = (e: Event) => {
  e.preventDefault();
  // TODO: 실제 인증 로직 연동
  console.log('Login attempt:', { username: username.value, password: password.value, rememberMe: rememberMe.value });
  // 임시로 홈으로 이동
  router.push('/');
};
</script>

<template>
  <div :class="cn('min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark font-sans p-4')">
    <div :class="cn('w-full max-w-[1200px] grid md:grid-cols-2 bg-white dark:bg-slate-900 rounded-2xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-800')">

      <!-- Left Side: Brand & Promo (Desktop Only) -->
      <div :class="cn('hidden md:flex flex-col justify-between p-12 bg-primary relative overflow-hidden')">
        <!-- Background Effects -->
        <div :class="cn('absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl')"></div>
        <div :class="cn('absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-black opacity-10 rounded-full blur-3xl')"></div>

        <!-- Logo -->
        <div :class="cn('relative z-10')">
          <div :class="cn('flex items-center gap-3')">
            <div :class="cn('w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-lg')">
              <Layers :class="cn('text-primary size-6')" />
            </div>
            <span :class="cn('font-bold text-2xl tracking-tight text-white')">Nexus</span>
          </div>
        </div>

        <!-- Main Text -->
        <div :class="cn('relative z-10')">
          <h2 :class="cn('text-4xl font-bold text-white leading-tight mb-6')">Centralized Admin Control & Data Insights</h2>
          <p :class="cn('text-blue-100 text-lg')">Manage your entire ecosystem with precision through our advanced dashboard and real-time analytics engine.</p>
        </div>

        <!-- Footer / Social Proof -->
        <div :class="cn('relative z-10 flex items-center gap-4')">
          <div :class="cn('flex -space-x-2')">
            <div :class="cn('w-8 h-8 rounded-full border-2 border-primary bg-blue-400')"></div>
            <div :class="cn('w-8 h-8 rounded-full border-2 border-primary bg-blue-300')"></div>
            <div :class="cn('w-8 h-8 rounded-full border-2 border-primary bg-blue-200')"></div>
          </div>
          <span :class="cn('text-sm text-blue-50 font-medium')">Trusted by 5,000+ teams</span>
        </div>
      </div>

      <!-- Right Side: Login Form -->
      <div :class="cn('p-8 md:p-16 flex flex-col justify-center')">
        <!-- Mobile Logo -->
        <div :class="cn('flex items-center gap-2 mb-10 md:hidden')">
          <div :class="cn('w-8 h-8 bg-primary rounded-lg flex items-center justify-center')">
            <Layers :class="cn('text-white size-5')" />
          </div>
          <span :class="cn('font-bold text-xl tracking-tight text-slate-800 dark:text-white')">Nexus</span>
        </div>

        <!-- Form Header -->
        <div :class="cn('mb-8')">
          <h1 :class="cn('text-3xl font-bold text-slate-900 dark:text-white mb-2')">Welcome Back</h1>
          <p :class="cn('text-slate-500 dark:text-slate-400')">Please sign in to access your admin account.</p>
        </div>

        <!-- Login Form -->
        <form :class="cn('space-y-6')" @submit="handleLogin">
          <!-- Username Input -->
          <div :class="cn('space-y-1.5')">
            <label :class="cn('text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1')" for="username">Username</label>
            <AppInput
              id="username"
              v-model="username"
              placeholder="Enter your username"
              :icon="User"
            />
          </div>

          <!-- Password Input -->
          <div :class="cn('space-y-1.5')">
            <div :class="cn('flex items-center justify-between')">
              <label :class="cn('text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1')" for="password">Password</label>
              <a :class="cn('text-xs font-semibold text-primary hover:text-primary/80 transition-colors')" href="#">Forgot Password?</a>
            </div>
            <AppInput
              id="password"
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="••••••••"
              :icon="Lock"
            >
              <template #suffix>
                <button
                  type="button"
                  :class="cn('text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 focus:outline-hidden')"
                  @click="showPassword = !showPassword"
                >
                  <EyeOff v-if="showPassword" :class="cn('size-5')" />
                  <Eye v-else :class="cn('size-5')" />
                </button>
              </template>
            </AppInput>
          </div>

          <!-- Remember Me Checkbox -->
          <div :class="cn('flex items-center')">
            <label :class="cn('flex items-center gap-2 cursor-pointer group')">
              <AppCheckbox v-model="rememberMe" />
              <span :class="cn('text-sm text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200 transition-colors')">Remember Me</span>
            </label>
          </div>

          <!-- Submit Button -->
          <AppButton type="submit" :class="cn('w-full justify-center py-3 text-base shadow-lg shadow-primary/20')" size="lg">
            Sign In
          </AppButton>
        </form>

        <!-- Sign Up Link -->
        <div :class="cn('mt-8 pt-8 border-t border-slate-100 dark:border-slate-800 text-center')">
          <p :class="cn('text-sm text-slate-500 dark:text-slate-400')">
            New on our platform?
            <a :class="cn('font-semibold text-primary hover:underline')" href="#">Request Access</a>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
