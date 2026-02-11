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
  console.log('Login attempt:', {
    username: username.value,
    password: password.value,
    rememberMe: rememberMe.value,
  });
  // 임시로 홈으로 이동
  router.push('/');
};
</script>

<template>
  <div
    :class="
      cn(
        'bg-background-light dark:bg-background-dark flex min-h-screen items-center justify-center p-4 font-sans',
      )
    "
  >
    <div
      :class="
        cn(
          'grid w-full max-w-[1200px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl md:grid-cols-2 dark:border-slate-800 dark:bg-slate-900',
        )
      "
    >
      <!-- Left Side: Brand & Promo (Desktop Only) -->
      <div
        :class="
          cn('bg-primary relative hidden flex-col justify-between overflow-hidden p-12 md:flex')
        "
      >
        <!-- Background Effects -->
        <div
          :class="
            cn(
              'absolute top-0 right-0 -mt-16 -mr-16 h-64 w-64 rounded-full bg-white opacity-10 blur-3xl',
            )
          "
        ></div>
        <div
          :class="
            cn(
              'absolute bottom-0 left-0 -mb-16 -ml-16 h-64 w-64 rounded-full bg-black opacity-10 blur-3xl',
            )
          "
        ></div>

        <!-- Logo -->
        <div :class="cn('relative z-10')">
          <div :class="cn('flex items-center gap-3')">
            <div
              :class="
                cn('flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow-lg')
              "
            >
              <Layers :class="cn('text-primary size-6')" />
            </div>
            <span :class="cn('text-2xl font-bold tracking-tight text-white')">Nexus</span>
          </div>
        </div>

        <!-- Main Text -->
        <div :class="cn('relative z-10')">
          <h2 :class="cn('mb-6 text-4xl leading-tight font-bold text-white')">
            Centralized Admin Control & Data Insights
          </h2>
          <p :class="cn('text-lg text-blue-100')">
            Manage your entire ecosystem with precision through our advanced dashboard and real-time
            analytics engine.
          </p>
        </div>

        <!-- Footer / Social Proof -->
        <div :class="cn('relative z-10 flex items-center gap-4')">
          <div :class="cn('flex -space-x-2')">
            <div :class="cn('border-primary h-8 w-8 rounded-full border-2 bg-blue-400')"></div>
            <div :class="cn('border-primary h-8 w-8 rounded-full border-2 bg-blue-300')"></div>
            <div :class="cn('border-primary h-8 w-8 rounded-full border-2 bg-blue-200')"></div>
          </div>
          <span :class="cn('text-sm font-medium text-blue-50')">Trusted by 5,000+ teams</span>
        </div>
      </div>

      <!-- Right Side: Login Form -->
      <div :class="cn('flex flex-col justify-center p-8 md:p-16')">
        <!-- Mobile Logo -->
        <div :class="cn('mb-10 flex items-center gap-2 md:hidden')">
          <div :class="cn('bg-primary flex h-8 w-8 items-center justify-center rounded-lg')">
            <Layers :class="cn('size-5 text-white')" />
          </div>
          <span :class="cn('text-xl font-bold tracking-tight text-slate-800 dark:text-white')"
            >Nexus</span
          >
        </div>

        <!-- Form Header -->
        <div :class="cn('mb-8')">
          <h1 :class="cn('mb-2 text-3xl font-bold text-slate-900 dark:text-white')">
            Welcome Back
          </h1>
          <p :class="cn('text-slate-500 dark:text-slate-400')">
            Please sign in to access your admin account.
          </p>
        </div>

        <!-- Login Form -->
        <form :class="cn('space-y-6')" @submit="handleLogin">
          <!-- Username Input -->
          <div :class="cn('space-y-1.5')">
            <label
              :class="cn('ml-1 text-sm font-semibold text-slate-700 dark:text-slate-300')"
              for="username"
              >Username</label
            >
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
              <label
                :class="cn('ml-1 text-sm font-semibold text-slate-700 dark:text-slate-300')"
                for="password"
                >Password</label
              >
              <a
                :class="
                  cn('text-primary hover:text-primary/80 text-xs font-semibold transition-colors')
                "
                href="#"
                >Forgot Password?</a
              >
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
                  :class="
                    cn(
                      'text-slate-400 hover:text-slate-600 focus:outline-hidden dark:hover:text-slate-200',
                    )
                  "
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
            <label :class="cn('group flex cursor-pointer items-center gap-2')">
              <AppCheckbox v-model="rememberMe" />
              <span
                :class="
                  cn(
                    'text-sm text-slate-600 transition-colors group-hover:text-slate-900 dark:text-slate-400 dark:group-hover:text-slate-200',
                  )
                "
                >Remember Me</span
              >
            </label>
          </div>

          <!-- Submit Button -->
          <AppButton
            type="submit"
            :class="cn('shadow-primary/20 w-full justify-center py-3 text-base shadow-lg')"
            size="lg"
          >
            Sign In
          </AppButton>
        </form>

        <!-- Sign Up Link -->
        <div :class="cn('mt-8 border-t border-slate-100 pt-8 text-center dark:border-slate-800')">
          <p :class="cn('text-sm text-slate-500 dark:text-slate-400')">
            New on our platform?
            <a :class="cn('text-primary font-semibold hover:underline')" href="#">Request Access</a>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
