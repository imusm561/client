<template>
  <div>
    <Breadcrumb :key="$route" />
    <div class="card adaptive">
      <div class="card-header border-0 p-2 pb-0 d-flex justify-content-between">
        <p class="text-muted ms-2 mb-2">
          {{ $t('layout.navbar.helper.sql.tip.before') }}
          <code>$</code>
          {{ $t('layout.navbar.helper.sql.tip.after') }}
        </p>
        <span class="float-end">
          <i
            class="mdi mdi-motion-play-outline fs-16 cursor-pointer text-muted pe-2"
            @click="handleQuery"
          ></i>
        </span>
      </div>
      <div class="card-body d-flex flex-column pt-0 h-100">
        <MonacoEditor v-model="sql" language="mysql" height="100%" />
      </div>

      <button
        id="showResultOffcanvasBtn"
        class="d-none"
        data-bs-toggle="offcanvas"
        data-bs-target="#resultOffcanvas"
      />
      <div class="offcanvas offcanvas-end w-resp" id="resultOffcanvas">
        <div class="offcanvas-body p-0 overflow-hidden">
          <i
            class="i-close mdi mdi-close-box fs-24 text-muted cursor-pointer"
            data-bs-dismiss="offcanvas"
          />
          <MonacoEditor
            :key="sql"
            v-model="res"
            language="json"
            :options="{
              readOnly: true,
            }"
            height="100vh"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useToast } from 'vue-toastification';
import ToastificationContent from '@components/ToastificationContent';
import Breadcrumb from '@layouts/breadcrumb';
import MonacoEditor from '@components/MonacoEditor';
import { query } from '@api/com/sql';

const toast = useToast();
const sql = ref(null);
const res = ref(null);

const handleQuery = () => {
  if (!sql.value) return;

  if (
    sql.value.toLowerCase().includes('use ') ||
    sql.value.toLowerCase().includes('drop') ||
    sql.value.toLowerCase().includes('delete ') ||
    sql.value.toLowerCase().includes('truncate ') ||
    sql.value.toLowerCase().includes('create ') ||
    sql.value.toLowerCase().includes('alter ')
  ) {
    toast({
      component: ToastificationContent,
      props: {
        variant: 'danger',
        icon: 'mdi-alert',
        text: 'layout.navbar.helper.sql.query.error',
      },
    });
    return;
  }

  res.value = null;
  query({ sql: sql.value }).then(({ code, data, msg }) => {
    if (code === 200) {
      res.value = JSON.stringify(data, null, 2);
      document.getElementById('showResultOffcanvasBtn').click();
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
  });
};
</script>
