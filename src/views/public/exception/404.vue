<template>
  <div class="auth-page-wrapper d-flex justify-content-center align-items-center min-vh-100">
    <div class="auth-page-content overflow-hidden p-0">
      <div class="container-fluid">
        <div class="row justify-content-center">
          <div class="col-6 text-center">
            <div class="error position-relative">
              <img src="@/assets/images/exception/404.png" alt="error img" class="img-fluid" />
            </div>
            <div>
              <h3 class="text-uppercase">😭 {{ $t('public.exception.404.title') }}</h3>
              <div class="mt-3 mb-1">
                <p>{{ $route.params.msg || $t('public.exception.404.msg') }}</p>
              </div>
              <router-link to="/" class="btn btn-primary">
                <i class="mdi mdi-home me-1"></i>
                {{ $t('public.exception.404.btn') }}
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
