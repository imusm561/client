<template>
  <div v-if="account.id">
    <Breadcrumb :key="$route" />
    <div class="row">
      <div class="col-xl-7">
        <div class="card card-height-100">
          <div class="card-body pb-0">
            <div class="align-items-center d-flex justify-content-between">
              <h5>{{ $t('layout.navbar.helper.weixin.detail.header') }}</h5>
              <div>
                <button class="btn btn-sm" @click="handleEditAccount">
                  <i class="fs-16 mdi mdi-square-edit-outline text-info"></i>
                </button>
                <button class="btn btn-sm" @click="handleDeleteAccount">
                  <i class="fs-16 mdi mdi-trash-can-outline text-danger"></i>
                </button>
              </div>
            </div>
            <div class="pt-2 border-top border-top-dashed">
              <div class="row">
                <div class="col-lg-6">
                  <dl class="row mb-0">
                    <dt class="col-sm-4 text-uppercase mb-3">
                      {{ $t('layout.navbar.helper.weixin.detail.title') }}
                    </dt>
                    <dd class="col-sm-8">{{ account.title }}</dd>
                    <dt class="col-sm-4 text-uppercase mb-3">
                      {{ $t('layout.navbar.helper.weixin.detail.serviceType') }}
                    </dt>
                    <dd class="col-sm-8">
                      {{
                        $t(`layout.navbar.helper.weixin.detail.serviceType.${account.service_type}`)
                      }}
                    </dd>
                    <dt class="col-sm-4 text-uppercase mb-3">
                      {{ $t('layout.navbar.helper.weixin.detail.soid') }}
                    </dt>
                    <dd class="col-sm-8">{{ account.soid }}</dd>
                    <dt class="col-sm-4 text-uppercase mb-3">
                      {{ $t('layout.navbar.helper.weixin.detail.email') }}
                    </dt>
                    <dd class="col-sm-8">{{ account.email }}</dd>
                  </dl>
                </div>
                <div class="col-lg-6">
                  <dl class="row mb-0">
                    <span
                      v-if="
                        ['serviceAccount', 'subscriptionAccount'].includes(account.service_type)
                      "
                    >
                      <dt class="col-sm-4 text-uppercase mb-3">
                        {{ $t('layout.navbar.helper.weixin.detail.token') }}
                      </dt>
                      <dd class="col-sm-8">{{ account.token }}</dd>
                      <dt class="col-sm-4 text-uppercase mb-3">
                        {{ $t('layout.navbar.helper.weixin.detail.encodingAESKey') }}
                      </dt>
                      <dd class="col-sm-8">{{ account.encoding_aes_key }}</dd>
                    </span>
                    <dt class="col-sm-4 text-uppercase mb-3">
                      {{ $t('layout.navbar.helper.weixin.detail.appId') }}
                    </dt>
                    <dd class="col-sm-8">{{ account.app_id }}</dd>
                    <dt class="col-sm-4 text-uppercase mb-3">
                      {{ $t('layout.navbar.helper.weixin.detail.appSecret') }}
                    </dt>
                    <dd class="col-sm-8">{{ account.app_secret }}</dd>
                    <span
                      v-if="
                        ['serviceAccount', 'subscriptionAccount'].includes(account.service_type)
                      "
                    >
                      <dt class="col-sm-4 text-uppercase mb-3">
                        {{ $t('layout.navbar.helper.weixin.detail.mchId') }}
                      </dt>
                      <dd class="col-sm-8">{{ account.mch_id }}</dd>
                      <dt class="col-sm-4 text-uppercase mb-3">
                        {{ $t('layout.navbar.helper.weixin.detail.apiKey') }}
                      </dt>
                      <dd class="col-sm-8">{{ account.api_key }}</dd>
                    </span>
                  </dl>
                </div>
              </div>
            </div>
            <div
              class="pt-2 border-top border-top-dashed"
              v-if="account.access_token || account.js_api_ticket"
            >
              <div class="col-12">
                <dl class="row mb-0" v-if="account.access_token">
                  <dt class="col-sm-3 text-uppercase mb-3">
                    {{ $t('layout.navbar.helper.weixin.detail.accessToken') }}
                  </dt>
                  <dd class="col-sm-9">{{ account.access_token }}</dd>
                  <dt class="col-sm-3 text-uppercase mb-3">
                    {{ $t('layout.navbar.helper.weixin.detail.accessTokenTme') }}
                  </dt>
                  <dd class="col-sm-9">{{ $moment(account.access_token_time).fromNow() }}</dd>
                </dl>
                <dl class="row mb-0" v-if="account.js_api_ticket">
                  <dt class="col-sm-3 text-uppercase mb-3">
                    {{ $t('layout.navbar.helper.weixin.detail.jsApiTicket') }}
                  </dt>
                  <dd class="col-sm-9">{{ account.js_api_ticket }}</dd>
                  <dt class="col-sm-3 text-uppercase mb-3">
                    {{ $t('layout.navbar.helper.weixin.detail.jsApiTicketTime') }}
                  </dt>
                  <dd class="col-sm-9">{{ $moment(account.js_api_ticket_time).fromNow() }}</dd>
                </dl>
              </div>
            </div>
            <div class="pt-2 border-top border-top-dashed" v-if="account.description">
              <div class="col-12 mt-0 mb-3">
                <h6 class="text-black">
                  {{ $t('layout.navbar.helper.weixin.detail.description') }}
                </h6>
                <div class="ck ck-content" v-html="account.description"></div>
              </div>
            </div>
            <div class="pt-2 border-top border-top-dashed" v-if="account.tags.length">
              <div class="col-12 mt-0 mb-3">
                <h6 class="text-black">
                  {{ $t('layout.navbar.helper.weixin.detail.tags') }}
                </h6>
                <div class="hstack flex-wrap gap-2 fs-15">
                  <div
                    class="badge fw-medium badge-soft-info"
                    v-for="tag in account.tags"
                    :key="tag"
                  >
                    {{ tag }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-xl-5">
        <div class="card card-height-100" style="min-height: 40vh">
          <div class="card-body">
            <div class="align-items-center d-flex justify-content-between">
              <h5>{{ $t('layout.navbar.helper.weixin.detail.config') }}</h5>
              <div>
                <!-- <button class="btn btn-sm">
                  <i class="fs-16 mdi mdi-square-edit-outline text-info"></i>
                </button>
                <button class="btn btn-sm">
                  <i class="fs-16 mdi mdi-trash-can-outline text-danger"></i>
                </button> -->
              </div>
            </div>
            <MonacoEditor
              style="position: absolute; height: calc(100% - 66.5px); width: calc(100% - 32px)"
              v-model="account.config"
              :options="{
                readOnly: true,
              }"
            />
          </div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <ul class="nav nav-tabs-custom rounded card-header-tabs border-bottom-0">
          <li class="nav-item">
            <a class="nav-link active" data-bs-toggle="tab" href="#tab_scripts">
              {{ $t('layout.navbar.helper.weixin.detail.scripts') }}
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link" data-bs-toggle="tab" href="#tab_users">
              {{ $t('layout.navbar.helper.weixin.detail.users') }}
            </a>
          </li>
        </ul>
      </div>
      <div class="card-body p-0">
        <div class="tab-content">
          <div class="tab-pane active" id="tab_scripts">
            <div v-if="scripts.length">
              <div class="table-responsive" data-simplebar style="max-height: 40vh">
                <table class="table align-middle table-striped mb-0 table-hover">
                  <thead class="table-light">
                    <tr>
                      <th class="text-capitalize">ID</th>
                      <th class="text-capitalize">
                        {{ $t('layout.navbar.helper.weixin.detail.scripts.createdBy') }}
                      </th>
                      <th class="text-capitalize">
                        {{ $t('layout.navbar.helper.weixin.detail.scripts.createdAt') }}
                      </th>
                      <th class="text-capitalize">
                        {{ $t('layout.navbar.helper.weixin.detail.scripts.msgType') }}
                      </th>
                      <th class="text-capitalize">
                        {{ $t('layout.navbar.helper.weixin.detail.scripts.msgKeyword') }}
                      </th>
                      <th class="text-capitalize">
                        {{ $t('layout.navbar.helper.weixin.detail.scripts.instrPre') }}
                      </th>
                      <th class="text-capitalize">
                        {{ $t('layout.navbar.helper.weixin.detail.scripts.instrExp') }}
                      </th>
                      <th class="text-capitalize">
                        {{ $t('layout.navbar.helper.weixin.detail.scripts.replyType') }}
                      </th>
                      <th class="text-capitalize">
                        {{ $t('layout.navbar.helper.weixin.detail.scripts.replyContent') }}
                      </th>
                      <th class="text-capitalize">
                        {{ $t('layout.navbar.helper.weixin.detail.scripts.replyScope') }}
                      </th>
                      <th class="text-capitalize">
                        {{ $t('layout.navbar.helper.weixin.detail.scripts.description') }}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="script in scripts" :key="script.id">
                      <td class="text-secondary text-decoration-underline cursor-pointer fw-medium">
                        <span @click="handleClickScriptId(script)">#{{ script.id }}</span>
                      </td>
                      <td>
                        {{ getUserInfo(script.created_by).fullname }}
                      </td>
                      <td>
                        {{ $moment(script.created_at).format('llll') }}
                      </td>
                      <td>
                        {{
                          $t(
                            `layout.navbar.helper.weixin.detail.scripts.msgType.${script.msg_type}`,
                          )
                        }}
                      </td>
                      <td>{{ script.msg_keyword }}</td>
                      <td>{{ script.instr_pre }}</td>
                      <td>{{ script.instr_exp }}</td>
                      <td>
                        {{
                          $t(
                            `layout.navbar.helper.weixin.detail.scripts.replyType.${script.reply_type}`,
                          )
                        }}
                      </td>
                      <td>{{ script.reply_content }}</td>
                      <td>{{ script.reply_scope.toString() }}</td>
                      <td>{{ replaceHtml(script.description) }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div class="p-2 d-flex justify-content-between">
                <button
                  class="btn btn-soft-secondary btn-sm"
                  type="button"
                  @click="handleCreateScript"
                >
                  {{ $t('layout.navbar.helper.weixin.detail.scripts.create') }}
                </button>
                <Pagination
                  :total="pagination.scripts.totalCount"
                  :page-num="pagination.scripts.pageNum"
                  :page-size="pagination.scripts.pageSize"
                  @changed="($event) => handlePaginationChange({ tab: 'scripts', ...$event })"
                />
              </div>
            </div>
            <Empty v-else :text="$t('layout.navbar.helper.weixin.detail.scripts.empty')">
              <span
                class="mt-n3 text-secondary text-center cursor-pointer text-decoration-underline"
                @click="handleCreateScript"
              >
                {{ $t('layout.navbar.helper.weixin.detail.scripts.create') }}
              </span>
            </Empty>
          </div>
          <div class="tab-pane" id="tab_users">
            <div v-if="users.length">
              <div class="table-responsive" data-simplebar style="max-height: 40vh">
                <table class="table align-middle table-striped mb-0 table-hover">
                  <thead class="table-light">
                    <tr>
                      <th class="text-capitalize">
                        {{ $t('layout.navbar.helper.weixin.detail.users.title') }}
                      </th>
                      <th class="text-capitalize">
                        {{ $t('layout.navbar.helper.weixin.detail.users.createdAt') }}
                      </th>
                      <th class="text-capitalize">
                        {{ $t('layout.navbar.helper.weixin.detail.users.openid') }}
                      </th>
                      <th class="text-capitalize">
                        {{ $t('layout.navbar.helper.weixin.detail.users.userinfo') }}
                      </th>
                      <th class="text-capitalize"></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="user in users" :key="user.id">
                      <td>{{ user.title }}</td>
                      <td>
                        {{ $moment(user.created_at).format('llll') }}
                      </td>
                      <td
                        class="openid cursor-pointer"
                        @click="current_user = user"
                        data-bs-toggle="modal"
                        href="#unbindUserModal"
                        :title="$t('layout.navbar.helper.weixin.detail.users.unbind')"
                      >
                        {{ user.openid }}
                      </td>
                      <td
                        class="text-secondary text-decoration-underline cursor-pointer fw-medium"
                        @click="handleViewBindUserInfo(user)"
                      >
                        {{ user.userinfo }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div class="p-2">
                <Pagination
                  :total="pagination.users.totalCount"
                  :page-num="pagination.users.pageNum"
                  :page-size="pagination.users.pageSize"
                  @changed="($event) => handlePaginationChange({ tab: 'users', ...$event })"
                />
              </div>
            </div>
            <Empty :text="$t('layout.navbar.helper.weixin.detail.users.empty')" v-else />
          </div>
        </div>
      </div>
    </div>

    <button
      id="showBindDataOffcanvasBtn"
      class="d-none"
      data-bs-toggle="offcanvas"
      data-bs-target="#bindDataOffcanvas"
    />
    <div class="offcanvas offcanvas-end w-resp" id="bindDataOffcanvas">
      <div class="offcanvas-body p-0 overflow-hidden">
        <i
          class="i-close mdi mdi-close-box fs-24 text-muted cursor-pointer"
          data-bs-dismiss="offcanvas"
        />
        <MonacoEditor
          v-model="current_user.userinfo"
          language="json"
          :options="{
            readOnly: true,
          }"
          height="100vh"
        />
      </div>
    </div>

    <div class="modal fade" id="unbindUserModal" data-bs-backdrop="static" data-bs-keyboard="false">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <button
              id="hideUnbindUserModalBtn"
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
            ></button>
          </div>
          <div class="modal-body">
            <div class="mt-2 text-center">
              <div class="fs-15 mx-4 mx-sm-5">
                <h4>
                  {{ current_user.openid }}
                </h4>
                <p class="text-muted mx-4 mb-0">
                  {{ $t('layout.navbar.helper.weixin.detail.users.unbindUserModal.confirm') }}
                </p>
              </div>
            </div>
            <div class="d-flex gap-2 justify-content-center mt-4 mb-2">
              <button type="button" class="btn w-sm btn-light" data-bs-dismiss="modal">
                {{ $t('layout.navbar.helper.weixin.detail.users.unbindUserModal.cancel') }}
              </button>
              <button type="button" class="btn w-sm btn-danger" @click="handleUnbindUser">
                {{ $t('layout.navbar.helper.weixin.detail.users.unbindUserModal.confirmed') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <button
      id="showViewAndEditScriptModalBtn"
      class="d-none"
      data-bs-toggle="modal"
      data-bs-target="#viewAndEditScriptModal"
    />
    <div
      class="modal fade"
      id="viewAndEditScriptModal"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
    >
      <div class="modal-dialog modal-dialog-centered" :class="{ 'modal-lg': is_editing }">
        <div class="modal-content">
          <div class="modal-header p-2 bg-soft-info">
            <h5 class="modal-title">
              {{
                current_script.id
                  ? `#${current_script.id}`
                  : $t(
                      'layout.navbar.helper.weixin.detail.scripts.viewAndEditScriptModal.newScript',
                    )
              }}
            </h5>
            <button
              type="button"
              id="hideViewAndEditScriptModalBtn"
              class="btn-close"
              data-bs-dismiss="modal"
            ></button>
          </div>
          <Form v-slot="{ errors }" @submit="handleSubmitScript" :key="viewAndEditScriptModalKey">
            <div class="modal-body p-0">
              <div
                v-if="is_editing"
                data-simplebar
                class="p-3"
                style="max-height: 80vh; overflow-x: hidden"
              >
                <div class="row g-3">
                  <div class="col-md-3">
                    <label class="form-label">
                      {{
                        $t(
                          'layout.navbar.helper.weixin.detail.scripts.viewAndEditScriptModal.form.soid',
                        )
                      }}
                    </label>
                    <Field
                      name="soid"
                      v-model="current_script.soid"
                      type="text"
                      disabled
                      :placeholder="
                        $t(
                          'layout.navbar.helper.weixin.detail.scripts.viewAndEditScriptModal.form.soid',
                        )
                      "
                      :class="['form-control', errors.soid && 'is-invalid']"
                      rules="required"
                    />
                    <span class="invalid-feedback">{{ errors.soid }}</span>
                  </div>

                  <div class="col-md-3">
                    <label class="form-label">
                      {{
                        $t(
                          'layout.navbar.helper.weixin.detail.scripts.viewAndEditScriptModal.form.msgType',
                        )
                      }}
                    </label>
                    <VueSelect
                      v-model="current_script.msg_type"
                      :placeholder="
                        $t(
                          'layout.navbar.helper.weixin.detail.scripts.viewAndEditScriptModal.form.msgType',
                        )
                      "
                      :class="errors.msg_type && 'is-invalid'"
                      :reduce="(item) => item.value"
                      label="text"
                      :clearable="false"
                      :options="
                        msgTypeOptions.filter((option) => option.for.includes(account.service_type))
                      "
                    >
                      <template v-slot:no-options="{ search, searching }">
                        <template v-if="searching">
                          <span v-html="$t('components.vs.search', { search })"></span>
                        </template>
                        <em v-else style="opacity: 0.5">
                          {{ $t('components.vs.searchOption') }}
                        </em>
                      </template>
                    </VueSelect>
                    <Field
                      name="msg_type"
                      v-model="current_script.msg_type"
                      rules="required"
                      class="d-none"
                    />
                    <span class="invalid-feedback">{{ errors.msg_type }}</span>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">
                      {{
                        $t(
                          'layout.navbar.helper.weixin.detail.scripts.viewAndEditScriptModal.form.msgKeyword',
                        )
                      }}
                    </label>
                    <Field
                      name="msg_keyword"
                      v-model="current_script.msg_keyword"
                      type="text"
                      :placeholder="
                        $t(
                          'layout.navbar.helper.weixin.detail.scripts.viewAndEditScriptModal.form.msgKeyword',
                        )
                      "
                      :class="['form-control', errors.msg_keyword && 'is-invalid']"
                      rules="required"
                    />
                    <span class="invalid-feedback">{{ errors.msg_keyword }}</span>
                  </div>
                  <div
                    class="col-md-6"
                    v-if="['serviceAccount', 'subscriptionAccount'].includes(account.service_type)"
                  >
                    <label class="form-label">
                      {{
                        $t(
                          'layout.navbar.helper.weixin.detail.scripts.viewAndEditScriptModal.form.instrPre',
                        )
                      }}
                    </label>
                    <Field
                      name="instr_pre"
                      v-model="current_script.instr_pre"
                      type="text"
                      :placeholder="
                        $t(
                          'layout.navbar.helper.weixin.detail.scripts.viewAndEditScriptModal.form.instrPre',
                        )
                      "
                      :class="['form-control', errors.instr_pre && 'is-invalid']"
                      rules=""
                    />
                    <span class="invalid-feedback">{{ errors.instr_pre }}</span>
                  </div>
                  <div
                    class="col-md-6"
                    v-if="['serviceAccount', 'subscriptionAccount'].includes(account.service_type)"
                  >
                    <label class="form-label">
                      {{
                        $t(
                          'layout.navbar.helper.weixin.detail.scripts.viewAndEditScriptModal.form.instrExp',
                        )
                      }}
                    </label>
                    <Field
                      name="instr_exp"
                      v-model="current_script.instr_exp"
                      type="number"
                      :placeholder="
                        $t(
                          'layout.navbar.helper.weixin.detail.scripts.viewAndEditScriptModal.form.instrExp',
                        )
                      "
                      :class="['form-control', errors.instr_exp && 'is-invalid']"
                      :rules="current_script.instr_pre ? 'required' : ''"
                    />
                    <span class="invalid-feedback">{{ errors.instr_exp }}</span>
                  </div>

                  <div class="col-md-6">
                    <label class="form-label">
                      {{
                        $t(
                          'layout.navbar.helper.weixin.detail.scripts.viewAndEditScriptModal.form.replyType',
                        )
                      }}
                    </label>

                    <VueSelect
                      v-model="current_script.reply_type"
                      :placeholder="
                        $t(
                          'layout.navbar.helper.weixin.detail.scripts.viewAndEditScriptModal.form.replyType',
                        )
                      "
                      :class="errors.reply_type && 'is-invalid'"
                      :reduce="(item) => item.value"
                      label="text"
                      :clearable="false"
                      :options="
                        replyTypeOptions.filter((option) =>
                          option.for.includes(account.service_type),
                        )
                      "
                    >
                      <template v-slot:no-options="{ search, searching }">
                        <template v-if="searching">
                          <span v-html="$t('components.vs.search', { search })"></span>
                        </template>
                        <em v-else style="opacity: 0.5">
                          {{ $t('components.vs.searchOption') }}
                        </em>
                      </template>
                    </VueSelect>
                    <Field
                      name="reply_type"
                      v-model="current_script.reply_type"
                      rules="required"
                      class="d-none"
                    />
                    <span class="invalid-feedback">{{ errors.reply_type }}</span>
                  </div>

                  <div class="col-md-6">
                    <label class="form-label">
                      {{
                        $t(
                          'layout.navbar.helper.weixin.detail.scripts.viewAndEditScriptModal.form.replyScope',
                        )
                      }}
                    </label>

                    <VueSelect
                      v-model="current_script.reply_scope"
                      :placeholder="
                        $t(
                          'layout.navbar.helper.weixin.detail.scripts.viewAndEditScriptModal.form.replyScope',
                        )
                      "
                      multiple
                      :close-on-select="false"
                      :options="
                        account.config
                          ? JSON.parse(account.config)?.bind?.map((item) => {
                              return item.title;
                            }) || []
                          : []
                      "
                    >
                      <template v-slot:no-options="{ search, searching }">
                        <template v-if="searching">
                          <span v-html="$t('components.vs.search', { search })"></span>
                        </template>
                        <em v-else style="opacity: 0.5">
                          {{ $t('components.vs.searchOption') }}
                        </em>
                      </template>
                    </VueSelect>
                    <Field
                      name="reply_scope"
                      v-model="current_script.reply_scope"
                      rules=""
                      class="d-none"
                    />
                    <span class="invalid-feedback">{{ errors.reply_scope }}</span>
                  </div>

                  <div class="col-12">
                    <label class="form-label">
                      {{
                        $t(
                          'layout.navbar.helper.weixin.detail.scripts.viewAndEditScriptModal.form.replyContent',
                        )
                      }}
                    </label>
                    <Field
                      as="textarea"
                      rows="6"
                      name="reply_content"
                      v-model="current_script.reply_content"
                      type="text"
                      :placeholder="
                        $t(
                          'layout.navbar.helper.weixin.detail.scripts.viewAndEditScriptModal.form.replyContent',
                        )
                      "
                      :class="['form-control', errors.reply_content && 'is-invalid']"
                      rules="required"
                    />
                    <span class="invalid-feedback">{{ errors.reply_content }}</span>
                  </div>

                  <div class="col-12">
                    <label class="form-label">
                      {{
                        $t(
                          'layout.navbar.helper.weixin.detail.scripts.viewAndEditScriptModal.form.description',
                        )
                      }}
                    </label>
                    <CKEditor
                      v-model="current_script.description"
                      id="ck_job_description"
                      :error="{ id: 'ck_job_description', error: errors.description }"
                      :class="errors.description && 'is-invalid'"
                    />
                    <Field
                      name="description"
                      v-model="current_script.description"
                      rules=""
                      class="d-none"
                    />
                    <span class="invalid-feedback">{{ errors.description }}</span>
                  </div>
                </div>
              </div>
              <div v-else class="p-3">
                <div class="row mb-2" v-if="current_script.msg_type">
                  <span class="col-4 fw-bold">
                    {{ $t('layout.navbar.helper.weixin.detail.scripts.msgType') }}
                  </span>
                  <span class="col-8 text-end">
                    {{
                      $t(
                        `layout.navbar.helper.weixin.detail.scripts.msgType.${current_script.msg_type}`,
                      )
                    }}
                  </span>
                </div>

                <div class="row mb-2" v-if="current_script.msg_keyword">
                  <span class="col-4 fw-bold">
                    {{ $t('layout.navbar.helper.weixin.detail.scripts.msgKeyword') }}
                  </span>
                  <span class="col-8 text-end">
                    {{ current_script.msg_keyword }}
                  </span>
                </div>

                <div
                  class="row mb-2"
                  v-if="
                    current_script.instr_pre &&
                    ['serviceAccount', 'subscriptionAccount'].includes(account.service_type)
                  "
                >
                  <span class="col-4 fw-bold">
                    {{ $t('layout.navbar.helper.weixin.detail.scripts.instrPre') }}
                  </span>
                  <span class="col-8 text-end">
                    {{ current_script.instr_pre }}
                  </span>
                </div>

                <div
                  class="row mb-2"
                  v-if="
                    current_script.instr_exp &&
                    ['serviceAccount', 'subscriptionAccount'].includes(account.service_type)
                  "
                >
                  <span class="col-4 fw-bold">
                    {{ $t('layout.navbar.helper.weixin.detail.scripts.instrExp') }}
                  </span>
                  <span class="col-8 text-end">
                    {{ current_script.instr_exp }}
                  </span>
                </div>

                <div class="row mb-2" v-if="current_script.reply_type">
                  <span class="col-4 fw-bold">
                    {{ $t('layout.navbar.helper.weixin.detail.scripts.replyType') }}
                  </span>
                  <span class="col-8 text-end">
                    {{
                      $t(
                        `layout.navbar.helper.weixin.detail.scripts.replyType.${current_script.reply_type}`,
                      )
                    }}
                  </span>
                </div>

                <div class="row mb-2" v-if="current_script.reply_scope">
                  <span class="col-4 fw-bold">
                    {{ $t('layout.navbar.helper.weixin.detail.scripts.replyScope') }}
                  </span>
                  <span class="col-8 text-end">
                    {{ current_script.reply_scope.toString() }}
                  </span>
                </div>

                <div class="row mb-2" v-if="current_script.reply_content">
                  <span class="col-4 fw-bold">
                    {{ $t('layout.navbar.helper.weixin.detail.scripts.replyContent') }}
                  </span>
                  <span class="col-8 text-end">
                    {{ current_script.reply_content }}
                  </span>
                </div>

                <div class="row mb-2" v-if="current_script.description">
                  <span class="col-4 fw-bold">
                    {{ $t('layout.navbar.helper.weixin.detail.scripts.description') }}
                  </span>
                  <div class="col-8 ck ck-content" v-html="current_script.description"></div>
                </div>
              </div>
            </div>
            <div class="modal-footer p-3 pt-1 pb-1">
              <span
                v-if="current_script.id"
                class="btn btn-sm btn-primary"
                @click="is_editing = !is_editing"
              >
                <i
                  class="mdi"
                  :class="is_editing ? 'mdi-content-save-off-outline' : 'mdi-square-edit-outline '"
                ></i>
                {{
                  is_editing
                    ? $t(
                        'layout.navbar.helper.weixin.detail.scripts.viewAndEditScriptModal.form.footer.cancel',
                      )
                    : $t(
                        'layout.navbar.helper.weixin.detail.scripts.viewAndEditScriptModal.form.footer.edit',
                      )
                }}
              </span>
              <span
                v-if="!is_editing && current_script.id"
                class="btn btn-sm btn-danger"
                data-bs-toggle="modal"
                href="#deleteScriptModal"
              >
                <i class="mdi mdi-delete-outline"></i>
                {{
                  $t(
                    'layout.navbar.helper.weixin.detail.scripts.viewAndEditScriptModal.form.footer.delete',
                  )
                }}
              </span>
              <button
                v-if="is_editing"
                type="submit"
                class="btn btn-sm btn-success"
                :disabled="Object.keys(errors).length"
              >
                <i class="mdi mdi-content-save-outline"></i>
                {{
                  current_script.id
                    ? $t(
                        'layout.navbar.helper.weixin.detail.scripts.viewAndEditScriptModal.form.footer.save',
                      )
                    : $t(
                        'layout.navbar.helper.weixin.detail.scripts.viewAndEditScriptModal.form.footer.create',
                      )
                }}
              </button>
            </div>
          </Form>
        </div>
      </div>
    </div>

    <div
      class="modal fade"
      id="deleteScriptModal"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <button
              type="button"
              class="btn-close d-none"
              id="hideDeleteScriptModalBtn"
              data-bs-dismiss="modal"
            ></button>
            <button
              type="button"
              class="btn-close"
              data-bs-toggle="modal"
              href="#viewAndEditScriptModal"
            ></button>
          </div>
          <div class="modal-body">
            <div class="mt-2 text-center">
              <div class="fs-15 mx-4 mx-sm-5">
                <h4>
                  {{
                    $t('layout.navbar.helper.weixin.detail.scripts.deleteScriptModal.title', {
                      id: current_script.id,
                    })
                  }}
                </h4>
                <p class="text-muted mx-4 mb-0">
                  {{ $t('layout.navbar.helper.weixin.detail.scripts.deleteScriptModal.confirm') }}
                </p>
              </div>
            </div>
            <div class="d-flex gap-2 justify-content-center mt-4 mb-2">
              <button
                type="button"
                class="btn w-sm btn-light"
                data-bs-toggle="modal"
                href="#viewAndEditScriptModal"
              >
                {{ $t('layout.navbar.helper.weixin.detail.scripts.deleteScriptModal.cancel') }}
              </button>
              <button type="button" class="btn w-sm btn-danger" @click="handleDelScript">
                {{ $t('layout.navbar.helper.weixin.detail.scripts.deleteScriptModal.confirmed') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <EditAccountModal :data="_account" @submit="fetchAccountInfo()" />
    <DeleteAccountModal :data="_account" @confirm="$router.replace({ name: 'weixin' })" />
  </div>
</template>
<script>
import Breadcrumb from '@layouts/breadcrumb';
import { onMounted, onUnmounted, reactive, ref } from 'vue';
import { useRouter, getUserInfo, replaceHtml } from '@utils';
import {
  getAccountDetail,
  getBindUsers,
  unBindUser,
  getReplyScripts,
  createReplyScript,
  updateReplyScript,
} from '@api/weixin';
import { useToast } from 'vue-toastification';
import useWeixin from './useWeixin';
import MonacoEditor from '@components/MonacoEditor';
import ToastificationContent from '@components/ToastificationContent';
import Empty from '@components/Empty';
import Pagination from '@components/Pagination';
import CKEditor from '@components/CKEditor';
import EditAccountModal from './components/EditAccountModal.vue';
import DeleteAccountModal from './components/DeleteAccountModal.vue';
export default {
  components: {
    Breadcrumb,
    MonacoEditor,
    Empty,
    Pagination,
    CKEditor,
    EditAccountModal,
    DeleteAccountModal,
  },
  setup() {
    const { route } = useRouter();
    const { msgTypeOptions, replyTypeOptions } = useWeixin();

    const toast = useToast();
    const account = ref({});
    const _account = ref({});

    const fetchAccountInfo = () => {
      getAccountDetail({ soid: route.value.params.soid }).then(({ code, data, msg }) => {
        if (code === 200) {
          account.value = data;
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

    const pagination = reactive({
      users: {
        pageNum: 1,
        pageSize: 200,
        totalCount: 0,
      },
      scripts: {
        pageNum: 1,
        pageSize: 200,
        totalCount: 0,
      },
    });

    const handlePaginationChange = ({ tab, pageNum, pageSize }) => {
      pagination[tab].pageNum = pageNum;
      pagination[tab].pageSize = pageSize;
      if (tab === 'users') fetchBindUsers();
      if (tab === 'scripts') fetchReplyScripts();
    };

    const users = ref([]);
    const fetchBindUsers = () => {
      getBindUsers({
        soid: route.value.params.soid,
        pageNum: pagination.users.pageNum,
        pageSize: pagination.users.pageSize,
      }).then(({ code, data, msg }) => {
        if (code === 200) {
          users.value = data.rows;
          pagination.users.totalCount = data.count;
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

    const scripts = ref([]);
    const fetchReplyScripts = () => {
      getReplyScripts({
        soid: route.value.params.soid,
        pageNum: pagination.scripts.pageNum,
        pageSize: pagination.scripts.pageSize,
      }).then(({ code, data, msg }) => {
        if (code === 200) {
          scripts.value = data.rows;
          pagination.scripts.totalCount = data.count;
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

    onMounted(() => {
      fetchAccountInfo();
      fetchBindUsers();
      fetchReplyScripts();

      const viewAndEditScriptModal = document.getElementById('viewAndEditScriptModal');
      if (viewAndEditScriptModal)
        viewAndEditScriptModal.addEventListener('hidden.bs.modal', () => {
          is_editing.value = false;
        });
    });

    onUnmounted(() => {
      const viewAndEditScriptModal = document.getElementById('viewAndEditScriptModal');
      if (viewAndEditScriptModal)
        viewAndEditScriptModal.removeEventListener('hidden.bs.modal', () => {});
    });

    const handleEditAccount = () => {
      _account.value = JSON.parse(JSON.stringify(account.value));
      _account.value.key = Math.random().toString(36).slice(-6);
      setTimeout(() => {
        document.getElementById('showEditAccountModalBtn').click();
      }, 10);
    };

    const handleDeleteAccount = () => {
      _account.value = JSON.parse(JSON.stringify(account.value));
      document.getElementById('showDeleteAccountModalBtn').click();
    };

    const current_user = ref({});

    const handleViewBindUserInfo = (user) => {
      current_user.value = JSON.parse(JSON.stringify(user));
      current_user.value.userinfo = JSON.stringify(current_user.value.userinfo, null, 2);
      document.getElementById('showBindDataOffcanvasBtn').click();
    };

    const handleUnbindUser = () => {
      current_user.value.data_state = 'deleted';
      unBindUser(current_user.value).then(({ code, msg }) => {
        if (code === 200) {
          fetchBindUsers();
          document.getElementById('hideUnbindUserModalBtn').click();
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

    const is_editing = ref(false);
    const current_script = ref({});
    const viewAndEditScriptModalKey = ref(null);
    const handleClickScriptId = (script) => {
      is_editing.value = false;
      current_script.value = JSON.parse(JSON.stringify(script));
      viewAndEditScriptModalKey.value = Math.random().toString(36).slice(-6);
      document.getElementById('showViewAndEditScriptModalBtn').click();
    };

    const handleDelScript = () => {
      current_script.value.data_state = 'deleted';
      updateReplyScript(current_script.value).then(({ code, msg }) => {
        if (code === 200) {
          document.getElementById('hideDeleteScriptModalBtn').click();
          fetchReplyScripts();
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

    const handleCreateScript = () => {
      current_script.value = { soid: account.value.soid };
      is_editing.value = true;
      viewAndEditScriptModalKey.value = Math.random().toString(36).slice(-6);
      document.getElementById('showViewAndEditScriptModalBtn').click();
    };

    const handleSubmitScript = () => {
      if (current_script.value.id) {
        updateReplyScript(current_script.value).then(({ code, msg }) => {
          if (code === 200) {
            document.getElementById('hideViewAndEditScriptModalBtn').click();
            fetchReplyScripts();
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
      } else {
        createReplyScript(current_script.value).then(({ code, msg }) => {
          if (code === 200) {
            document.getElementById('hideViewAndEditScriptModalBtn').click();
            fetchReplyScripts();
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
      }
    };

    return {
      account,
      _account,
      fetchAccountInfo,
      handleEditAccount,
      handleDeleteAccount,

      getUserInfo,
      replaceHtml,

      pagination,
      handlePaginationChange,

      users,
      current_user,
      handleViewBindUserInfo,
      handleUnbindUser,

      scripts,
      current_script,

      is_editing,
      msgTypeOptions,
      replyTypeOptions,

      handleCreateScript,
      handleClickScriptId,
      viewAndEditScriptModalKey,
      handleDelScript,
      handleSubmitScript,
    };
  },
};
</script>

<style lang="scss" scoped>
th,
td {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 300px;
}
.openid {
  &:hover {
    color: red;
    text-decoration: line-through;
    text-decoration-color: red;
  }
}
</style>
