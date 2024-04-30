<template>
  <div class="auth-page-wrapper">
    <div class="auth-page-content">
      <div class="container d-flex flex-column justify-content-center">
        <div class="row">
          <div class="col-lg-12">
            <div class="text-center mb-3">
              <router-link to="/" class="d-inline-block auth-logo">
                <img
                  class="sys-logo"
                  :src="`${BASE_URL}static/img/logo/${logo}.png`"
                  :alt="logo"
                  height="55"
                />
              </router-link>
            </div>
          </div>
        </div>

        <div class="row justify-content-center">
          <div class="col-md-8 col-lg-6 col-xl-5">
            <div class="card mt-4">
              <div class="card-body p-4">
                <div class="text-center mt-2">
                  <h5 class="text-primary">{{ $t('public.authentication.login.title') }}</h5>
                  <p class="text-muted">
                    {{ $t('public.authentication.login.tip', { sys: $store.state.sys.name }) }}
                  </p>
                </div>
                <div class="p-2 mt-4">
                  <Form v-slot="{ errors }" @submit="handleFormSubmit">
                    <div v-if="logintype === 'account_password'">
                      <div class="mb-3">
                        <label for="username" class="form-label">
                          {{ $t('public.authentication.login.form.username') }}
                        </label>
                        <Field
                          name="username"
                          v-model="username"
                          @input="res = {}"
                          :placeholder="$t('public.authentication.login.form.username')"
                          :class="[
                            'form-control',
                            (errors.username || res.username) && 'is-invalid',
                          ]"
                          rules="required"
                        />
                        <span class="invalid-feedback">
                          {{ $te(errors.username) || res.username }}
                        </span>
                      </div>

                      <div class="mb-3">
                        <label class="form-label" for="password">
                          {{ $t('public.authentication.login.form.password') }}
                        </label>
                        <div class="float-end">
                          <router-link
                            :to="{ name: 'forgotPassword', query: $route.query }"
                            class="text-muted"
                          >
                            {{ $t('public.authentication.login.form.forgotPassword') }}
                          </router-link>
                        </div>
                        <div class="position-relative">
                          <Field
                            name="password"
                            v-model="password"
                            @input="res = {}"
                            :type="isPasswordVisible ? 'text' : 'password'"
                            :placeholder="$t('public.authentication.login.form.password')"
                            :class="[
                              'form-control',
                              'pe-5',
                              (errors.password || res.password) && 'is-invalid',
                            ]"
                            rules="required"
                            autocomplete="off"
                          />
                          <span class="invalid-feedback">
                            {{ $te(errors.password) || res.password }}
                          </span>
                          <button
                            type="button"
                            class="btn btn-link position-absolute end-0 top-0 text-decoration-none text-muted"
                          >
                            <i
                              :class="[
                                'align-middle mdi',
                                isPasswordVisible ? 'mdi-eye-off' : 'mdi-eye',
                              ]"
                              @click="isPasswordVisible = !isPasswordVisible"
                            ></i>
                          </button>
                        </div>
                      </div>

                      <div class="form-check">
                        <input
                          v-model="remember"
                          id="remember-check-for-account-password"
                          type="checkbox"
                          class="form-check-input"
                        />
                        <label class="form-check-label" for="remember-check-for-account-password">
                          {{ $t('public.authentication.login.form.remember') }}
                        </label>
                      </div>

                      <div class="mt-4">
                        <button
                          class="btn btn-primary w-100"
                          type="submit"
                          :disabled="Object.keys(errors).length"
                        >
                          {{ $t('public.authentication.login.form.signIn') }}
                        </button>
                      </div>
                    </div>

                    <div v-else-if="logintype === 'sms_verification'">
                      <div class="mb-3">
                        <label for="phone" class="form-label">
                          {{ $t('public.authentication.login.form.phone') }}
                        </label>
                        <div class="float-end" v-if="!canSendVerificationCode">
                          <span class="text-muted">
                            {{
                              $tc(
                                'public.authentication.login.form.resendVerificationCodeCountDown',
                                { count: resendVerificationCodeCountDown },
                              )
                            }}
                          </span>
                        </div>
                        <div class="position-relative">
                          <Field
                            name="phone"
                            v-model="phone"
                            @input="res = {}"
                            :placeholder="$t('public.authentication.login.form.phone')"
                            :class="['form-control', (errors.phone || res.phone) && 'is-invalid']"
                            rules="required|phone"
                          />
                          <span class="invalid-feedback">{{ $te(errors.phone) || res.phone }}</span>
                          <button
                            v-if="phone && !errors.phone"
                            type="button"
                            class="btn btn-link position-absolute end-0 top-0 text-decoration-none text-muted"
                          >
                            <i
                              :class="[
                                'align-middle mdi',
                                canSendVerificationCode ? 'mdi-send' : 'mdi-send-clock-outline',
                              ]"
                              @click="handleSendVerificationCode"
                            ></i>
                          </button>
                        </div>
                      </div>

                      <div class="mb-3">
                        <label for="code" class="form-label">
                          {{ $t('public.authentication.login.form.code') }}
                        </label>
                        <Field
                          name="code"
                          v-model="code"
                          @input="res = {}"
                          :placeholder="$t('public.authentication.login.form.code')"
                          :class="['form-control', (errors.code || res.code) && 'is-invalid']"
                          rules="required"
                        />
                        <span class="invalid-feedback">{{ $te(errors.code) || res.code }}</span>
                      </div>

                      <div class="form-check">
                        <input
                          v-model="remember"
                          id="remember-check-for-sms-verification"
                          type="checkbox"
                          class="form-check-input"
                        />
                        <label class="form-check-label" for="remember-check-for-sms-verification">
                          {{ $t('public.authentication.login.form.remember') }}
                        </label>
                      </div>

                      <div class="mt-4">
                        <button
                          class="btn btn-primary w-100"
                          type="submit"
                          :disabled="Object.keys(errors).length"
                        >
                          {{ $t('public.authentication.login.form.signIn') }}
                        </button>
                      </div>
                    </div>

                    <div v-if="logintype === 'scan_qrcode'" class="text-center">
                      <img
                        :key="qr.scene"
                        :src="qr.src || require('@/assets/images/gif/loading.gif')"
                        width="243"
                        height="243"
                        :style="{
                          padding: qr.src ? '5%' : '25%',
                          filter: qr.scaned ? 'blur(6px)' : 'unset',
                        }"
                      />
                    </div>
                  </Form>
                  <div class="mt-4 text-center">
                    <div class="signin-other-title">
                      <h5 class="fs-13 mb-4 title">
                        {{ $t('public.authentication.login.form.signInWith') }}
                      </h5>
                    </div>

                    <div>
                      <button
                        v-for="(item, index) in types"
                        :key="item.name"
                        type="button"
                        :class="[
                          'btn',
                          item.class,
                          'btn-icon',
                          'waves-effect',
                          'waves-light',
                          index != 0 && 'ms-1',
                        ]"
                        @click="logintype = item.name"
                      >
                        <i :class="['fs-20 mdi', item.icon]"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <footer class="footer">
      <div class="row">
        <div class="col-lg-12">
          <div class="text-center">
            <p class="mb-0 text-muted">
              &copy; {{ new Date().getFullYear() }} {{ $store.state.sys.company }}
            </p>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { hashData } from '@utils';
import { socket } from '@utils/socket';
import store from '@store';
import { userLogin, getUserData } from '@api/user';
import { getQRCode } from '@api/weixin';
import { sendVerificationCode } from '@api/com/sms';

const route = useRoute();
const router = useRouter();

const types = reactive([
  {
    icon: 'mdi-account',
    name: 'account_password',
    class: 'btn-primary',
  },
  {
    icon: 'mdi-cellphone-message',
    name: 'sms_verification',
    class: 'btn-danger',
  },
]);

if (store.state.sys.cfg.weixin)
  types.push({
    icon: 'mdi-wechat',
    name: 'scan_qrcode',
    class: 'btn-success',
  });

const logintype = ref(types[0].name);

watch(
  () => logintype.value,
  (val) => {
    if (val === 'scan_qrcode') generateQRCode();
  },
);

const qr = reactive({
  src: null,
  scene: null,
  scaned: false,
});

const generateQRCode = () => {
  qr.src = null;
  qr.scene = `login:${Math.random().toString(36).slice(-6)}`;
  qr.scaned = false;

  const params = {
    soid: store.state.sys.cfg.weixin.soid,
    scene: qr.scene,
    expire: 60,
  };

  getQRCode(params).then(({ code, data }) => {
    if (code === 200) qr.src = data.src;
  });
};

const QRCodeScanHandler = ({ scene }) => {
  if (logintype.value === 'scan_qrcode' && !qr.scaned && scene === qr.scene) {
    qr.scaned = true;
  }
};

const QRCodeLoginHandler = ({ scene }) => {
  if (logintype.value === 'scan_qrcode' && qr.scaned && scene === qr.scene) {
    canSubmit.value = true;
    handleFormSubmit();
  }
};

onMounted(() => {
  socket.on('QRCodeScan', QRCodeScanHandler);
  socket.on('QRCodeLogin', QRCodeLoginHandler);
});

onUnmounted(() => {
  socket.off('QRCodeScan', QRCodeScanHandler);
  socket.off('QRCodeLogin', QRCodeLoginHandler);
});

const username = ref('');
const password = ref('');
const isPasswordVisible = ref(false);

const phone = ref('');
const code = ref('');

const remember = ref(false);

const res = ref({});

const canSendVerificationCode = ref(true);
const resendVerificationCodeCountDown = ref(60);
const handleSendVerificationCode = () => {
  if (canSendVerificationCode.value) {
    canSendVerificationCode.value = false;
    let params = {
      template: 'login',
      phone: phone.value,
    };
    sendVerificationCode(params).then(({ code, data }) => {
      if (code === 200) {
        let interval;
        interval = setInterval(() => {
          resendVerificationCodeCountDown.value -= 1;
          if (resendVerificationCodeCountDown.value === 0) {
            clearInterval(interval);
            canSendVerificationCode.value = true;
            resendVerificationCodeCountDown.value = 60;
          }
        }, 1000);
      } else {
        canSendVerificationCode.value = true;
        res.value = data;
      }
    });
  }
};

const { BASE_URL } = process.env;
const canSubmit = ref(true);
const handleFormSubmit = async () => {
  if (canSubmit.value) {
    canSubmit.value = false;
    /*
          1. Make HTTP request to get accessToken
          2. Store received token in localStorage for future use
          3. Make another HTTP request for getting user information
          4. On successful response of user information redirect to home page
        */
    const params = {};
    params.logintype = logintype.value;
    params.remember = remember.value;
    if (params.logintype == 'account_password') {
      params.username = username.value;
      params.password = hashData(password.value);
    } else if (params.logintype == 'sms_verification') {
      params.phone = phone.value;
      params.code = code.value;
    } else if (params.logintype == 'scan_qrcode') {
      params.soid = store.state.sys.cfg.weixin.soid;
      params.scene = qr.scene;
    }
    userLogin(params).then(({ code, data }) => {
      if (code === 200) {
        const { token } = data;
        // Set access token in localStorage so axios interceptor can use it
        localStorage.setItem(`${BASE_URL.replace(/\//g, '_')}accessToken`, token);
        // Getting user information
        getUserData().then(() => {
          // Redirect to home or query.redirect
          router.replace(route.query.redirect ? { path: route.query.redirect } : '/');
        });
      } else {
        canSubmit.value = true;
        res.value = data;
      }
    });
  }
};

const logo = computed(() => {
  return store.getters['sys/logo'];
});
</script>
