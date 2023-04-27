<template>
  <div>
    <Breadcrumb :key="$route" />
    <div class="card">
      <div class="card-body d-md-none d-flex justify-content-between">
        <div class="search-box w-75">
          <input
            v-model="search_keyword"
            type="text"
            class="form-control search"
            :placeholder="$t('layout.navbar.helper.weixin.search')"
          />
          <i class="mdi mdi-magnify fs-16 search-icon"></i>
        </div>
        <button class="btn btn-primary ms-3 text-nowrap" @click="handleCreateAccount">
          {{ $t('layout.navbar.helper.weixin.create') }}
        </button>
      </div>
      <div class="card-body d-none d-md-flex justify-content-between">
        <div class="w-25">
          <VueSelect
            v-model="search_type"
            :placeholder="$t('layout.navbar.helper.weixin.filter')"
            :reduce="(item) => item.value"
            label="text"
            :options="serviceTypeOptions"
          >
            <template v-slot:no-options="{ search, searching }">
              <template v-if="searching">
                <span v-html="$t('components.vs.search', { search })"></span>
              </template>
              <em v-else style="opacity: 0.5">{{ $t('components.vs.searchOption') }}</em>
            </template>
          </VueSelect>
        </div>
        <div class="d-flex">
          <div class="search-box w-100">
            <input
              v-model="search_keyword"
              type="text"
              class="form-control search"
              :placeholder="$t('layout.navbar.helper.weixin.search')"
            />
            <i class="mdi mdi-magnify fs-16 search-icon"></i>
          </div>
          <button class="btn btn-primary ms-3 text-nowrap" @click="handleCreateAccount">
            {{ $t('layout.navbar.helper.weixin.create') }}
          </button>
        </div>
      </div>
    </div>

    <div v-if="accounts.length" class="row">
      <div
        class="col-xl-3 col-md-4 col-sm-6"
        v-for="(account, index) in accounts.filter(
          (account) =>
            (account.title?.toLowerCase()?.includes(search_keyword?.toLowerCase()) ||
              replaceHtml(account.description)
                ?.toLowerCase()
                ?.includes(search_keyword?.toLowerCase()) ||
              account.email?.toLowerCase()?.includes(search_keyword?.toLowerCase()) ||
              account.soid?.toLowerCase()?.includes(search_keyword?.toLowerCase())) &&
            (!search_type || account.service_type === search_type),
        )"
        :key="index"
      >
        <div class="card">
          <div class="card-body">
            <div class="p-3 mt-n3 mx-n3">
              <div class="d-flex align-items-center">
                <div class="flex-grow-1">
                  <h5
                    class="mb-0 fs-14 cursor-pointer"
                    :title="`#${account.id}`"
                    @click="$router.push({ name: 'weixinDetail', params: { soid: account.soid } })"
                  >
                    {{ account.title }}
                  </h5>
                </div>
                <div class="flex-shrink-0">
                  <div class="d-flex gap-2 align-items-center my-n2">
                    <button type="button" class="btn p-0" @click="handleEditAccount(account)">
                      <i class="mdi mdi-square-edit-outline text-info"></i>
                    </button>
                    <button type="button" class="btn p-0" @click="handleDelAccount(account)">
                      <i class="mdi mdi-delete-outline text-danger"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div class="mb-2">
              <div class="row gy-3">
                <div class="col-5">
                  <p class="text-muted mb-1">{{ $t('layout.navbar.helper.weixin.serviceType') }}</p>
                  <h5 class="fs-12 text-nowrap text-truncate">
                    {{ $t(`layout.navbar.helper.weixin.serviceType.${account.service_type}`) }}
                  </h5>
                </div>
                <div class="col-7">
                  <p class="text-muted mb-1">{{ $t('layout.navbar.helper.weixin.soid') }}</p>
                  <h5 class="fs-12 text-nowrap text-truncate">{{ account.soid }}</h5>
                </div>
              </div>
            </div>
            <div class="mb-2" v-if="account.tags.length">
              <span
                class="badge badge-soft-primary me-1 text-truncate"
                v-for="(tag, index) in account.tags"
                :key="index"
                :title="tag"
              >
                {{ tag }}
              </span>
            </div>
            <p class="text-muted text-truncate-five-lines mb-0">
              {{ replaceHtml(account.description) }}
            </p>
          </div>

          <div class="card-footer bg-transparent border-top-dashed p-2">
            <div class="d-flex justify-content-between">
              <div class="text-muted">
                <i class="mdi mdi-script-text-outline"></i>
                {{ account.strategies.length }}
              </div>
              <div class="text-muted">
                <i class="mdi mdi-shield-account-outline"></i>
                {{ account.binds.length }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <Empty :text="$t('layout.navbar.helper.weixin.empty')" v-else />
    <EditAccountModal :data="current_account" @submit="fetchAccounts()" />
    <DeleteAccountModal :data="current_account" @confirm="fetchAccounts()" />
  </div>
</template>

<script>
import Breadcrumb from '@layouts/breadcrumb';
import EditAccountModal from './components/EditAccountModal';
import DeleteAccountModal from './components/DeleteAccountModal';
import Empty from '@components/Empty';
import { ref, onMounted } from 'vue';
import { getAccounts } from '@api/weixin';
import { useToast } from 'vue-toastification';
import ToastificationContent from '@components/ToastificationContent';
import useWeixin from './useWeixin';
import { replaceHtml } from '@utils';
export default {
  components: {
    Breadcrumb,
    EditAccountModal,
    DeleteAccountModal,
    Empty,
  },
  setup() {
    const toast = useToast();

    onMounted(() => {
      fetchAccounts();
    });

    const accounts = ref([]);
    const fetchAccounts = () => {
      getAccounts().then(({ code, data, msg }) => {
        if (code === 200) {
          accounts.value = data;
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

    const { serviceTypeOptions } = useWeixin();

    const search_keyword = ref('');
    const search_type = ref(null);

    const current_account = ref({});

    const handleCreateAccount = () => {
      const account = {
        key: Math.random().toString(36).slice(-6),
        title: '',
        service_type: 'serviceAccount',
        description: '',
      };
      current_account.value = account;
      setTimeout(() => {
        document.getElementById('showEditAccountModalBtn').click();
      }, 10);
    };

    const handleEditAccount = (account) => {
      current_account.value = JSON.parse(JSON.stringify(account));
      current_account.value.key = Math.random().toString(36).slice(-6);
      setTimeout(() => {
        document.getElementById('showEditAccountModalBtn').click();
      }, 10);
    };

    const handleDelAccount = (account) => {
      current_account.value = JSON.parse(JSON.stringify(account));
      document.getElementById('showDeleteAccountModalBtn').click();
    };
    return {
      replaceHtml,

      accounts,
      fetchAccounts,

      serviceTypeOptions,

      search_keyword,
      search_type,

      current_account,
      handleCreateAccount,
      handleEditAccount,
      handleDelAccount,
    };
  },
};
</script>
