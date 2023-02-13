<template>
  <div class="auth-page-wrapper">
    <div class="auth-page-content">
      <div class="container d-flex flex-column justify-content-center">
        <div class="row">
          <div class="col-lg-12">
            <div class="text-center mb-3">
              <router-link to="/" class="d-inline-block auth-logo">
                <img :src="`${BASE_URL}static/img/logo/${logo}.png`" alt="" height="55" />
              </router-link>
            </div>
          </div>
        </div>

        <div class="row justify-content-center">
          <div class="col-md-8 col-lg-6 col-xl-5">
            <div class="card mt-4">
              <div class="card-body p-4">
                <div class="text-center mt-2">
                  <h5 class="text-primary">{{ $t('public.authentication.forgotPassword.title') }}</h5>
                  <p class="text-muted">{{ $t('public.authentication.forgotPassword.tip', { sys: $store.state.sys.name }) }}</p>
                </div>

                <div class="p-2 mt-4">
                  <div v-if="formtype === 'sms_verification'">
                    <Form v-slot="{ errors }" @submit="handleVerifyCode">
                      <div class="mb-3">
                        <label for="phone" class="form-label">{{ $t('public.authentication.forgotPassword.form.phone') }}</label>
                        <div class="float-end" v-if="!canSendVerificationCode">
                          <span class="text-muted">{{ $tc('public.authentication.forgotPassword.form.resendVerificationCodeCountDown', { count: resendVerificationCodeCountDown }) }}</span>
                        </div>
                        <div class="position-relative">
                          <Field
                            name="phone"
                            v-model="phone"
                            @input="res = {}"
                            :placeholder="$t('public.authentication.forgotPassword.form.phone')"
                            :class="['form-control', (errors.phone || res.phone) && 'is-invalid']"
                            rules="required|phone"
                          />
                          <span class="invalid-feedback">{{ errors.phone || res.phone }}</span>
                          <button v-if="phone && !errors.phone" type="button" class="btn btn-link position-absolute end-0 top-0 text-decoration-none text-muted">
                            <i :class="['align-middle mdi', canSendVerificationCode ? 'mdi-send' : 'mdi-send-clock-outline']" @click="handleSendVerificationCode"></i>
                          </button>
                        </div>
                      </div>

                      <div class="mb-3">
                        <label for="code" class="form-label">{{ $t('public.authentication.forgotPassword.form.code') }}</label>
                        <Field
                          name="code"
                          v-model="code"
                          @input="res = {}"
                          :placeholder="$t('public.authentication.forgotPassword.form.code')"
                          :class="['form-control', (errors.code || res.code) && 'is-invalid']"
                          rules="required"
                          autocomplete="off"
                        />
                        <span class="invalid-feedback">{{ errors.code || res.code }}</span>
                      </div>

                      <div class="mt-4">
                        <button class="btn btn-success w-100" type="submit" :disabled="Object.keys(errors).length">{{ $t('public.authentication.forgotPassword.form.verify') }}</button>
                      </div>
                    </Form>
                  </div>

                  <div v-else-if="formtype === 'reset_password'">
                    <Form v-slot="{ errors }" @submit="handleResetPassword">
                      <div class="mb-3">
                        <label for="newpassword" class="form-label">{{ $('public.authentication.forgotPassword.form.newPassword') }}</label>
                        <div class="position-relative">
                          <Field
                            :type="isNewPasswordVisible ? 'text' : 'password'"
                            name="newpassword"
                            v-model="newpassword"
                            :placeholder="$('public.authentication.forgotPassword.form.newPassword')"
                            :class="['form-control', errors.newpassword && 'is-invalid']"
                            rules="required|password"
                            autocomplete="off"
                          />
                          <span class="invalid-feedback">{{ errors.newpassword }}</span>
                          <button type="button" class="btn btn-link position-absolute end-0 top-0 text-decoration-none text-muted">
                            <i :class="['align-middle mdi', isNewPasswordVisible ? 'mdi-eye-off' : 'mdi-eye']" @click="isNewPasswordVisible = !isNewPasswordVisible"></i>
                          </button>
                        </div>
                      </div>

                      <div class="mb-3">
                        <label for="confirmpassword" class="form-label">{{ $t('public.authentication.forgotPassword.form.confirmPassword') }}</label>
                        <div class="position-relative">
                          <Field
                            :type="isConfirmPasswordVisible ? 'text' : 'password'"
                            name="confirmpassword"
                            v-model="confirmpassword"
                            :placeholder="$t('public.authentication.forgotPassword.form.confirmPassword')"
                            :class="['form-control', errors.confirmpassword && 'is-invalid']"
                            rules="required|confirmed:@newpassword"
                            autocomplete="off"
                          />
                          <span class="invalid-feedback">{{ errors.confirmpassword }}</span>
                          <button type="button" class="btn btn-link position-absolute end-0 top-0 text-decoration-none text-muted">
                            <i :class="['align-middle mdi', isConfirmPasswordVisible ? 'mdi-eye-off' : 'mdi-eye']" @click="isConfirmPasswordVisible = !isConfirmPasswordVisible"></i>
                          </button>
                        </div>
                      </div>

                      <div class="mt-4">
                        <button class="btn btn-success w-100" type="submit" :disabled="Object.keys(errors).length">{{ $t('public.authentication.forgotPassword.form.reset') }}</button>
                      </div>
                    </Form>
                  </div>
                </div>
              </div>
            </div>

            <div class="mt-4 text-center">
              <p class="mb-0">
                {{ $t('public.authentication.forgotPassword.form.tontent') }}
                <router-link :to="{ name: 'login', query: $route.query }" class="fw-semibold text-primary text-decoration-underline">
                  {{ $t('public.authentication.forgotPassword.form.clickHere') }}
                </router-link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <footer class="footer">
      <div class="row">
        <div class="col-lg-12">
          <div class="text-center">
            <p class="mb-0 text-muted">&copy; {{ new Date().getFullYear() }} {{ $store.state.sys.company }}</p>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { resetPassword } from '@api/user';
import { sendVerificationCode, verifyVerificationCode } from '@api/com/sms';
import { useRouter, hashData } from '@utils';
import store from '@store';
import { useToast } from 'vue-toastification';
import ToastificationContent from '@components/ToastificationContent';
export default {
  setup() {
    const formtype = ref('sms_verification');

    const phone = ref('');
    const code = ref('');

    const newpassword = ref('');
    const confirmpassword = ref('');
    const isNewPasswordVisible = ref(false);
    const isConfirmPasswordVisible = ref(false);

    const res = ref({});

    const canSendVerificationCode = ref(true);
    const resendVerificationCodeCountDown = ref(60);
    const handleSendVerificationCode = () => {
      if (canSendVerificationCode.value) {
        canSendVerificationCode.value = false;
        let params = {
          template: 'reset_password',
          phone: phone.value,
        };
        sendVerificationCode(params).then(({ code, data }) => {
          if (code === 200) {
            const sendVerificationCodeCountDown = setInterval(() => {
              resendVerificationCodeCountDown.value -= 1;
              if (resendVerificationCodeCountDown.value === 0) {
                clearInterval(sendVerificationCodeCountDown);
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

    const canSubmit = ref(true);
    const handleVerifyCode = async () => {
      if (canSubmit.value) {
        canSubmit.value = false;
        const params = {
          template: 'reset_password',
          phone: phone.value,
          code: code.value,
        };
        verifyVerificationCode(params).then(({ code, data }) => {
          if (code === 200) {
            formtype.value = 'reset_password';
          } else {
            res.value = data;
          }
          canSubmit.value = true;
        });
      }
    };

    const { router, route } = useRouter();
    const toast = useToast();
    const handleResetPassword = async () => {
      if (canSubmit.value) {
        canSubmit.value = false;
        const params = {
          phone: phone.value,
          password: hashData(newpassword.value),
        };
        resetPassword(params).then(({ code, msg }) => {
          if (code === 200) {
            router.replace({ name: 'login', query: route.value.query });
          } else {
            toast({
              component: ToastificationContent,
              props: {
                variant: 'danger',
                icon: 'mdi-alert',
                text: msg,
              },
            });
          }
          canSubmit.value = true;
        });
      }
    };

    const logo = computed(() => {
      return store.getters['sys/logo'];
    });

    return {
      formtype,

      newpassword,
      confirmpassword,
      isNewPasswordVisible,
      isConfirmPasswordVisible,

      phone,
      code,

      res,

      canSendVerificationCode,
      resendVerificationCodeCountDown,
      handleSendVerificationCode,

      canSubmit,
      handleVerifyCode,

      handleResetPassword,

      logo,
    };
  },
};
</script>
