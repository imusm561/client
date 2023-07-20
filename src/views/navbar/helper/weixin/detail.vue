<template>
  <div v-if="account.id">
    <Breadcrumb :key="$route" />
    <div class="row">
      <div class="col-xl-8">
        <div class="card card-height-100">
          <div class="card-body pb-0">
            <div class="align-items-center d-flex justify-content-between">
              <h5>{{ $t('layout.navbar.helper.weixin.detail.header') }}</h5>
              <div>
                <div
                  v-if="['serviceAccount', 'miniProgram'].includes(account.service_type)"
                  class="d-inline dropdown"
                >
                  <button
                    type="button"
                    class="btn btn-sm p-0 ms-2"
                    data-bs-toggle="dropdown"
                    data-bs-auto-close="outside"
                  >
                    <i class="fs-16 mdi mdi-qrcode text-secondary"></i>
                  </button>
                  <Form class="dropdown-menu p-2" v-slot="{ errors }" @submit="handleGenerateQr">
                    <img v-if="qr.src" :key="qr.scene" :src="qr.src" class="w-100 h-100" />
                    <div v-else class="row g-2">
                      <div class="col-12">
                        <label class="form-label">
                          {{ $t('layout.navbar.helper.weixin.detail.qr.form.scene') }}
                        </label>
                        <Field
                          name="scene"
                          v-model="qr.scene"
                          type="text"
                          :placeholder="$t('layout.navbar.helper.weixin.detail.qr.form.scene')"
                          :class="['form-control', errors.scene && 'is-invalid']"
                          rules="required"
                        />
                        <span class="invalid-feedback">{{ errors.scene }}</span>
                      </div>
                      <div class="col-12">
                        <label class="form-label">
                          {{ $t('layout.navbar.helper.weixin.detail.qr.form.expire') }}
                        </label>
                        <Field
                          name="expire"
                          v-model="qr.expire"
                          type="number"
                          :placeholder="
                            $t('layout.navbar.helper.weixin.detail.qr.form.expire.placeholder')
                          "
                          :class="['form-control', errors.expire && 'is-invalid']"
                          rules="required"
                        />
                        <span class="invalid-feedback">{{ errors.expire }}</span>
                      </div>
                      <div class="col-12">
                        <label class="form-label">
                          {{ $t('layout.navbar.helper.weixin.detail.qr.form.count') }}
                        </label>
                        <Field
                          name="count"
                          v-model="qr.count"
                          type="number"
                          :placeholder="$t('layout.navbar.helper.weixin.detail.qr.form.count')"
                          :class="['form-control', errors.count && 'is-invalid']"
                          rules="required"
                        />
                        <span class="invalid-feedback">{{ errors.count }}</span>
                      </div>
                    </div>
                    <button
                      type="submit"
                      class="btn btn-sm btn-secondary float-end mt-2"
                      :disabled="Object.keys(errors).length"
                    >
                      {{
                        qr.src
                          ? $t('layout.navbar.helper.weixin.detail.qr.form.footer.regenerate')
                          : $t('layout.navbar.helper.weixin.detail.qr.form.footer.generate')
                      }}
                    </button>
                  </Form>
                </div>
                <button class="btn btn-sm p-0 ms-2" @click="handleEditAccount">
                  <i class="fs-16 mdi mdi-square-edit-outline text-info"></i>
                </button>
                <button class="btn btn-sm p-0 ms-2" @click="handleDeleteAccount">
                  <i class="fs-16 mdi mdi-trash-can-outline text-danger"></i>
                </button>
              </div>
            </div>
            <div class="pt-2 border-top border-top">
              <div class="row">
                <div class="col-lg-4">
                  <dl class="row mb-0">
                    <dt class="col-sm-4 text-uppercase">
                      {{ $t('layout.navbar.helper.weixin.detail.title') }}
                    </dt>
                    <dd class="col-sm-8 mb-3">{{ account.title }}</dd>
                    <dt class="col-sm-4 text-uppercase">
                      {{ $t('layout.navbar.helper.weixin.detail.serviceType') }}
                    </dt>
                    <dd class="col-sm-8 mb-3">
                      {{
                        $t(`layout.navbar.helper.weixin.detail.serviceType.${account.service_type}`)
                      }}
                    </dd>
                    <dt class="col-sm-4 text-uppercase">
                      {{ $t('layout.navbar.helper.weixin.detail.soid') }}
                    </dt>
                    <dd class="col-sm-8 mb-3">{{ account.soid }}</dd>
                    <dt class="col-sm-4 text-uppercase">
                      {{ $t('layout.navbar.helper.weixin.detail.email') }}
                    </dt>
                    <dd class="col-sm-8 mb-3">{{ account.email }}</dd>
                  </dl>
                </div>
                <div class="col-lg-8">
                  <dl
                    v-if="['serviceAccount', 'subscriptionAccount'].includes(account.service_type)"
                    class="row mb-0"
                  >
                    <dt class="col-sm-4 text-uppercase">
                      {{ $t('layout.navbar.helper.weixin.detail.token') }}
                    </dt>
                    <dd class="col-sm-8 mb-3">{{ account.token || '&nbsp;' }}</dd>
                    <dt class="col-sm-4 text-uppercase">
                      {{ $t('layout.navbar.helper.weixin.detail.encodingAESKey') }}
                    </dt>
                    <dd class="col-sm-8 mb-3">{{ account.encoding_aes_key || '&nbsp;' }}</dd>
                  </dl>
                  <dl class="row mb-0">
                    <dt class="col-sm-4 text-uppercase">
                      {{ $t('layout.navbar.helper.weixin.detail.appId') }}
                    </dt>
                    <dd class="col-sm-8 mb-3">{{ account.app_id || '&nbsp;' }}</dd>
                    <dt class="col-sm-4 text-uppercase">
                      {{ $t('layout.navbar.helper.weixin.detail.appSecret') }}
                    </dt>
                    <dd class="col-sm-8 mb-3">{{ account.app_secret || '&nbsp;' }}</dd>
                  </dl>
                  <dl v-if="['serviceAccount'].includes(account.service_type)" class="row mb-0">
                    <dt class="col-sm-4 text-uppercase">
                      {{ $t('layout.navbar.helper.weixin.detail.mchId') }}
                    </dt>
                    <dd class="col-sm-8 mb-3">{{ account.mch_id || '&nbsp;' }}</dd>
                    <dt class="col-sm-4 text-uppercase">
                      {{ $t('layout.navbar.helper.weixin.detail.apiKey') }}
                    </dt>
                    <dd class="col-sm-8 mb-3">{{ account.api_key || '&nbsp;' }}</dd>
                  </dl>
                </div>
              </div>
            </div>
            <div class="pt-2 border-top border-top-dashed">
              <div class="col-12">
                <dl class="row mb-0">
                  <dt class="col-sm-3 text-uppercase">
                    {{ $t('layout.navbar.helper.weixin.detail.accessToken') }}
                    <i
                      class="mdi mdi-refresh text-info cursor-pointer"
                      @click="handleRefreshAccount('access_token')"
                    ></i>
                  </dt>
                  <dd class="col-sm-9 mb-3" style="word-break: break-all">
                    {{ account.access_token || '&nbsp;' }}
                  </dd>
                  <dt class="col-sm-3 text-uppercase">
                    {{ $t('layout.navbar.helper.weixin.detail.accessTokenTme') }}
                  </dt>
                  <dd class="col-sm-9 mb-3">
                    {{
                      account.access_token_time
                        ? $moment(account.access_token_time).format('llll')
                        : '&nbsp;'
                    }}
                  </dd>
                </dl>
                <dl class="row mb-0">
                  <dt class="col-sm-3 text-uppercase">
                    {{ $t('layout.navbar.helper.weixin.detail.jsapiTicket') }}
                    <i
                      class="mdi mdi-refresh text-info cursor-pointer"
                      @click="handleRefreshAccount('jsapi_ticket')"
                    ></i>
                  </dt>
                  <dd class="col-sm-9 mb-3" style="word-break: break-all">
                    {{ account.jsapi_ticket || '&nbsp;' }}
                  </dd>
                  <dt class="col-sm-3 text-uppercase">
                    {{ $t('layout.navbar.helper.weixin.detail.jsapiTicketTime') }}
                  </dt>
                  <dd class="col-sm-9 mb-3">
                    {{
                      account.jsapi_ticket_time
                        ? $moment(account.jsapi_ticket_time).format('llll')
                        : '&nbsp;'
                    }}
                  </dd>
                </dl>
              </div>
            </div>
            <div class="pt-2 border-top border-top-dashed" v-if="account.description">
              <div class="col-12 mt-0 mb-3">
                <h6 class="text-dark">
                  {{ $t('layout.navbar.helper.weixin.detail.description') }}
                </h6>
                <div class="ck ck-content" v-html="account.description"></div>
              </div>
            </div>
            <div class="pt-2 border-top border-top-dashed" v-if="account.tags.length">
              <div class="col-12 mt-0 mb-3">
                <h6 class="text-dark">
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
      <div class="col-xl-4">
        <div class="card card-height-100" style="min-height: 40vh">
          <div class="card-body">
            <div class="align-items-center d-flex justify-content-between">
              <h5>
                {{ $t('layout.navbar.helper.weixin.detail.config') }}
              </h5>
              <div>
                <button
                  class="btn btn-sm p-0 ms-2"
                  v-if="['serviceAccount', 'subscriptionAccount'].includes(account.service_type)"
                >
                  <i
                    class="fs-16 mdi mdi-refresh text-info"
                    @click="handleRefreshAccount('menu')"
                  ></i>
                </button>
              </div>
            </div>
            <MonacoEditor
              style="
                position: absolute;
                height: calc(100% - 2rem - 27.5px);
                width: calc(100% - 32px);
              "
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
            <a class="nav-link active" data-bs-toggle="tab" href="#tab_strategies">
              {{ $t('layout.navbar.helper.weixin.detail.strategies') }}
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link" data-bs-toggle="tab" href="#tab_binds">
              {{ $t('layout.navbar.helper.weixin.detail.binds') }}
            </a>
          </li>
        </ul>
      </div>
      <div class="card-body p-0">
        <div class="tab-content">
          <div class="tab-pane active" id="tab_strategies">
            <div v-if="strategies.length">
              <div class="table-responsive" data-simplebar style="max-height: 40vh">
                <table class="table align-middle table-striped mb-0 table-hover">
                  <thead class="table-light">
                    <tr>
                      <th class="text-capitalize">ID</th>
                      <th class="text-capitalize">
                        {{ $t('layout.navbar.helper.weixin.detail.strategies.createdBy') }}
                      </th>
                      <th class="text-capitalize">
                        {{ $t('layout.navbar.helper.weixin.detail.strategies.createdAt') }}
                      </th>
                      <th class="text-capitalize">
                        {{ $t('layout.navbar.helper.weixin.detail.strategies.msgType') }}
                      </th>
                      <th class="text-capitalize">
                        {{ $t('layout.navbar.helper.weixin.detail.strategies.msgKeyword') }}
                      </th>
                      <th class="text-capitalize">
                        {{ $t('layout.navbar.helper.weixin.detail.strategies.weight') }}
                      </th>
                      <th class="text-capitalize">
                        {{ $t('layout.navbar.helper.weixin.detail.strategies.instrExp') }}
                      </th>
                      <th class="text-capitalize">
                        {{ $t('layout.navbar.helper.weixin.detail.strategies.replyType') }}
                      </th>
                      <th class="text-capitalize">
                        {{ $t('layout.navbar.helper.weixin.detail.strategies.replyContent') }}
                      </th>
                      <th class="text-capitalize">
                        {{ $t('layout.navbar.helper.weixin.detail.strategies.replyScope') }}
                      </th>
                      <th class="text-capitalize">
                        {{ $t('layout.navbar.helper.weixin.detail.strategies.description') }}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="strategy in strategies" :key="strategy.id">
                      <td class="text-secondary text-decoration-underline cursor-pointer fw-medium">
                        <span @click="handleClickStrategyId(strategy)">#{{ strategy.id }}</span>
                      </td>
                      <td>
                        {{ getUserInfo(strategy.created_by).fullname }}
                      </td>
                      <td>
                        {{ $moment(strategy.created_at).format('llll') }}
                      </td>
                      <td>
                        {{
                          $t(
                            `layout.navbar.helper.weixin.detail.strategies.msgType.${strategy.msg_type}`,
                          )
                        }}
                      </td>
                      <td>{{ strategy.msg_keyword }}</td>
                      <td>{{ strategy.weight }}</td>
                      <td>{{ strategy.instr_exp }}</td>
                      <td>
                        {{
                          $t(
                            `layout.navbar.helper.weixin.detail.strategies.replyType.${strategy.reply_type}`,
                          )
                        }}
                      </td>
                      <td>{{ strategy.reply_content }}</td>
                      <td>{{ strategy.reply_scope.toString() }}</td>
                      <td>{{ replaceHtml(strategy.description) }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div class="p-2 d-flex justify-content-between">
                <button
                  class="btn btn-soft-secondary btn-sm"
                  type="button"
                  @click="handleCreateStrategy"
                >
                  {{ $t('layout.navbar.helper.weixin.detail.strategies.create') }}
                </button>
                <Pagination
                  :total="pagination.strategies.totalCount"
                  :page-num="pagination.strategies.pageNum"
                  :page-size="pagination.strategies.pageSize"
                  @changed="($event) => handlePaginationChange({ tab: 'strategies', ...$event })"
                />
              </div>
            </div>
            <Empty v-else :text="$t('layout.navbar.helper.weixin.detail.strategies.empty')">
              <span
                class="mt-n3 text-secondary text-center cursor-pointer text-decoration-underline"
                @click="handleCreateStrategy"
              >
                {{ $t('layout.navbar.helper.weixin.detail.strategies.create') }}
              </span>
            </Empty>
          </div>
          <div class="tab-pane" id="tab_binds">
            <div v-if="binds.length">
              <div class="table-responsive" data-simplebar style="max-height: 40vh">
                <table class="table align-middle table-striped mb-0 table-hover">
                  <thead class="table-light">
                    <tr>
                      <th class="text-capitalize">
                        {{ $t('layout.navbar.helper.weixin.detail.binds.title') }}
                      </th>
                      <th class="text-capitalize">
                        {{ $t('layout.navbar.helper.weixin.detail.binds.createdAt') }}
                      </th>
                      <th class="text-capitalize">
                        {{ $t('layout.navbar.helper.weixin.detail.binds.openid') }}
                      </th>
                      <th class="text-capitalize">
                        {{ $t('layout.navbar.helper.weixin.detail.binds.userinfo') }}
                      </th>
                      <th class="text-capitalize"></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="bind in binds" :key="bind.id">
                      <td>{{ bind.title }}</td>
                      <td>
                        {{ $moment(bind.created_at).format('llll') }}
                      </td>
                      <td
                        class="openid cursor-pointer"
                        @click="current_bind = bind"
                        data-bs-toggle="modal"
                        href="#unbindModal"
                        :title="$t('layout.navbar.helper.weixin.detail.binds.unbind')"
                      >
                        {{ bind.openid }}
                      </td>
                      <td
                        class="text-secondary text-decoration-underline cursor-pointer fw-medium"
                        @click="handleViewBindData(bind)"
                      >
                        {{ bind.userinfo }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div class="p-2">
                <Pagination
                  :total="pagination.binds.totalCount"
                  :page-num="pagination.binds.pageNum"
                  :page-size="pagination.binds.pageSize"
                  @changed="($event) => handlePaginationChange({ tab: 'binds', ...$event })"
                />
              </div>
            </div>
            <Empty :text="$t('layout.navbar.helper.weixin.detail.binds.empty')" v-else />
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
          v-model="current_bind.userinfo"
          language="json"
          :options="{
            readOnly: true,
          }"
          height="100vh"
        />
      </div>
    </div>

    <div class="modal fade" id="unbindModal" data-bs-backdrop="static" data-bs-keyboard="false">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <button
              id="hideUnbindModalBtn"
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
            ></button>
          </div>
          <div class="modal-body">
            <div class="mt-2 text-center">
              <div class="fs-15 mx-4 mx-sm-5">
                <h4>
                  {{ current_bind.openid }}
                </h4>
                <p class="text-muted mx-4 mb-0">
                  {{ $t('layout.navbar.helper.weixin.detail.binds.unbindModal.confirm') }}
                </p>
              </div>
            </div>
            <div class="d-flex gap-2 justify-content-center mt-4 mb-2">
              <button type="button" class="btn w-sm btn-light" data-bs-dismiss="modal">
                {{ $t('layout.navbar.helper.weixin.detail.binds.unbindModal.cancel') }}
              </button>
              <button type="button" class="btn w-sm btn-danger" @click="handleUnbind">
                {{ $t('layout.navbar.helper.weixin.detail.binds.unbindModal.confirmed') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <button
      id="showviewAndEditStrategyModalBtn"
      class="d-none"
      data-bs-toggle="modal"
      data-bs-target="#viewAndEditStrategyModal"
    />
    <div
      class="modal fade"
      id="viewAndEditStrategyModal"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
    >
      <div class="modal-dialog modal-dialog-centered" :class="{ 'modal-lg': is_editing }">
        <div class="modal-content">
          <div class="modal-header p-2 bg-soft-info">
            <h5 class="modal-title">
              {{
                current_strategy.id
                  ? `#${current_strategy.id}`
                  : $t(
                      'layout.navbar.helper.weixin.detail.strategies.viewAndEditStrategyModal.newStrategy',
                    )
              }}
            </h5>
            <button
              type="button"
              id="hideviewAndEditStrategyModalBtn"
              class="btn-close"
              data-bs-dismiss="modal"
            ></button>
          </div>
          <Form
            v-slot="{ errors }"
            @submit="handleSubmitStrategy"
            :key="viewAndEditStrategyModalKey"
          >
            <div class="modal-body p-0">
              <div
                v-if="is_editing"
                data-simplebar
                class="p-3"
                style="max-height: 80vh; overflow-x: hidden"
              >
                <div class="row g-3">
                  <div class="col-md-6">
                    <label class="form-label">
                      {{
                        $t(
                          'layout.navbar.helper.weixin.detail.strategies.viewAndEditStrategyModal.form.soid',
                        )
                      }}
                    </label>
                    <Field
                      name="soid"
                      v-model="current_strategy.soid"
                      type="text"
                      disabled
                      :placeholder="
                        $t(
                          'layout.navbar.helper.weixin.detail.strategies.viewAndEditStrategyModal.form.soid',
                        )
                      "
                      :class="['form-control', errors.soid && 'is-invalid']"
                      rules="required"
                    />
                    <span class="invalid-feedback">{{ errors.soid }}</span>
                  </div>

                  <div class="col-md-6">
                    <label class="form-label">
                      {{
                        $t(
                          'layout.navbar.helper.weixin.detail.strategies.viewAndEditStrategyModal.form.msgType',
                        )
                      }}
                    </label>
                    <VueSelect
                      v-model="current_strategy.msg_type"
                      :placeholder="
                        $t(
                          'layout.navbar.helper.weixin.detail.strategies.viewAndEditStrategyModal.form.msgType',
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
                      v-model="current_strategy.msg_type"
                      rules="required"
                      class="d-none"
                    />
                    <span class="invalid-feedback">{{ errors.msg_type }}</span>
                  </div>
                  <div
                    :class="
                      ['serviceAccount', 'subscriptionAccount'].includes(account.service_type) &&
                      current_strategy.msg_keyword?.charAt(0) === '@'
                        ? 'col-md-6'
                        : 'col-12'
                    "
                  >
                    <label class="form-label">
                      {{
                        $t(
                          'layout.navbar.helper.weixin.detail.strategies.viewAndEditStrategyModal.form.msgKeyword',
                        )
                      }}
                    </label>
                    <Field
                      name="msg_keyword"
                      v-model="current_strategy.msg_keyword"
                      type="text"
                      :placeholder="
                        $t(
                          'layout.navbar.helper.weixin.detail.strategies.viewAndEditStrategyModal.form.msgKeyword',
                        )
                      "
                      :class="['form-control', errors.msg_keyword && 'is-invalid']"
                      :rules="
                        ['subscribe', 'unsubscribe', 'LOCATION'].includes(current_strategy.msg_type)
                          ? ''
                          : 'required'
                      "
                    />
                    <span class="invalid-feedback">{{ errors.msg_keyword }}</span>
                  </div>
                  <div
                    class="col-md-6"
                    v-if="
                      ['serviceAccount', 'subscriptionAccount'].includes(account.service_type) &&
                      current_strategy.msg_keyword?.charAt(0) === '@'
                    "
                  >
                    <label class="form-label">
                      {{
                        $t(
                          'layout.navbar.helper.weixin.detail.strategies.viewAndEditStrategyModal.form.instrExp',
                        )
                      }}
                    </label>
                    <Field
                      name="instr_exp"
                      v-model="current_strategy.instr_exp"
                      type="number"
                      :placeholder="
                        $t(
                          'layout.navbar.helper.weixin.detail.strategies.viewAndEditStrategyModal.form.instrExp',
                        )
                      "
                      :class="['form-control', errors.instr_exp && 'is-invalid']"
                      rules="required|between:60,300"
                    />
                    <span class="invalid-feedback">{{ errors.instr_exp }}</span>
                  </div>

                  <div class="col-md-6">
                    <label class="form-label">
                      {{
                        $t(
                          'layout.navbar.helper.weixin.detail.strategies.viewAndEditStrategyModal.form.weight',
                        )
                      }}
                    </label>
                    <Field
                      name="weight"
                      v-model="current_strategy.weight"
                      type="number"
                      :placeholder="
                        $t(
                          'layout.navbar.helper.weixin.detail.strategies.viewAndEditStrategyModal.form.weight',
                        )
                      "
                      :class="['form-control', errors.weight && 'is-invalid']"
                      rules="required|between:0,1000"
                    />
                    <span class="invalid-feedback">{{ errors.weight }}</span>
                  </div>

                  <div class="col-md-6">
                    <label class="form-label">
                      {{
                        $t(
                          'layout.navbar.helper.weixin.detail.strategies.viewAndEditStrategyModal.form.replyType',
                        )
                      }}
                    </label>

                    <VueSelect
                      v-model="current_strategy.reply_type"
                      :placeholder="
                        $t(
                          'layout.navbar.helper.weixin.detail.strategies.viewAndEditStrategyModal.form.replyType',
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
                      v-model="current_strategy.reply_type"
                      rules="required"
                      class="d-none"
                    />
                    <span class="invalid-feedback">{{ errors.reply_type }}</span>
                  </div>

                  <div class="col-md-12">
                    <label class="form-label">
                      {{
                        $t(
                          'layout.navbar.helper.weixin.detail.strategies.viewAndEditStrategyModal.form.replyScope',
                        )
                      }}
                    </label>

                    <VueSelect
                      v-model="current_strategy.reply_scope"
                      :placeholder="
                        $t(
                          'layout.navbar.helper.weixin.detail.strategies.viewAndEditStrategyModal.form.replyScope',
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
                      v-model="current_strategy.reply_scope"
                      rules=""
                      class="d-none"
                    />
                    <span class="invalid-feedback">{{ errors.reply_scope }}</span>
                  </div>

                  <div class="col-12">
                    <label class="form-label">
                      {{
                        $t(
                          'layout.navbar.helper.weixin.detail.strategies.viewAndEditStrategyModal.form.replyContent',
                        )
                      }}
                    </label>
                    <Field
                      as="textarea"
                      rows="6"
                      name="reply_content"
                      v-model="current_strategy.reply_content"
                      type="text"
                      :placeholder="
                        $t(
                          'layout.navbar.helper.weixin.detail.strategies.viewAndEditStrategyModal.form.replyContent',
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
                          'layout.navbar.helper.weixin.detail.strategies.viewAndEditStrategyModal.form.description',
                        )
                      }}
                    </label>
                    <CKEditor
                      v-model="current_strategy.description"
                      id="ck_job_description"
                      :error="{ id: 'ck_job_description', error: errors.description }"
                      :class="errors.description && 'is-invalid'"
                    />
                    <Field
                      name="description"
                      v-model="current_strategy.description"
                      rules=""
                      class="d-none"
                    />
                    <span class="invalid-feedback">{{ errors.description }}</span>
                  </div>
                </div>
              </div>
              <div v-else class="p-3">
                <div class="row mb-2">
                  <span class="col-4 fw-bold">
                    {{ $t('layout.navbar.helper.weixin.detail.strategies.msgType') }}
                  </span>
                  <span class="col-8 text-end">
                    {{
                      $t(
                        `layout.navbar.helper.weixin.detail.strategies.msgType.${current_strategy.msg_type}`,
                      )
                    }}
                  </span>
                </div>

                <div class="row mb-2">
                  <span class="col-4 fw-bold">
                    {{ $t('layout.navbar.helper.weixin.detail.strategies.msgKeyword') }}
                  </span>
                  <span class="col-8 text-end">
                    {{ current_strategy.msg_keyword }}
                  </span>
                </div>

                <div class="row mb-2">
                  <span class="col-4 fw-bold">
                    {{ $t('layout.navbar.helper.weixin.detail.strategies.weight') }}
                  </span>
                  <span class="col-8 text-end">
                    {{ current_strategy.weight }}
                  </span>
                </div>

                <div
                  class="row mb-2"
                  v-if="
                    current_strategy.instr_exp &&
                    ['serviceAccount', 'subscriptionAccount'].includes(account.service_type)
                  "
                >
                  <span class="col-4 fw-bold">
                    {{ $t('layout.navbar.helper.weixin.detail.strategies.instrExp') }}
                  </span>
                  <span class="col-8 text-end">
                    {{ current_strategy.instr_exp }}
                  </span>
                </div>

                <div class="row mb-2">
                  <span class="col-4 fw-bold">
                    {{ $t('layout.navbar.helper.weixin.detail.strategies.replyType') }}
                  </span>
                  <span class="col-8 text-end">
                    {{
                      $t(
                        `layout.navbar.helper.weixin.detail.strategies.replyType.${current_strategy.reply_type}`,
                      )
                    }}
                  </span>
                </div>

                <div class="row mb-2" v-if="current_strategy.reply_scope">
                  <span class="col-4 fw-bold">
                    {{ $t('layout.navbar.helper.weixin.detail.strategies.replyScope') }}
                  </span>
                  <span class="col-8 text-end">
                    {{ current_strategy.reply_scope.toString() }}
                  </span>
                </div>

                <div class="row mb-2">
                  <span class="col-4 fw-bold">
                    {{ $t('layout.navbar.helper.weixin.detail.strategies.replyContent') }}
                  </span>
                  <span class="col-8" style="word-break: break-all; white-space: break-spaces">
                    {{ current_strategy.reply_content }}
                  </span>
                </div>

                <div class="row mb-2">
                  <span class="col-4 fw-bold">
                    {{ $t('layout.navbar.helper.weixin.detail.strategies.description') }}
                  </span>
                  <div class="col-8 ck ck-content" v-html="current_strategy.description"></div>
                </div>
              </div>
            </div>
            <div class="modal-footer p-3 pt-1 pb-1">
              <span
                v-if="current_strategy.id"
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
                        'layout.navbar.helper.weixin.detail.strategies.viewAndEditStrategyModal.form.footer.cancel',
                      )
                    : $t(
                        'layout.navbar.helper.weixin.detail.strategies.viewAndEditStrategyModal.form.footer.edit',
                      )
                }}
              </span>
              <span
                v-if="!is_editing && current_strategy.id"
                class="btn btn-sm btn-danger"
                data-bs-toggle="modal"
                href="#deleteStrategyModal"
              >
                <i class="mdi mdi-delete-outline"></i>
                {{
                  $t(
                    'layout.navbar.helper.weixin.detail.strategies.viewAndEditStrategyModal.form.footer.delete',
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
                  current_strategy.id
                    ? $t(
                        'layout.navbar.helper.weixin.detail.strategies.viewAndEditStrategyModal.form.footer.save',
                      )
                    : $t(
                        'layout.navbar.helper.weixin.detail.strategies.viewAndEditStrategyModal.form.footer.create',
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
      id="deleteStrategyModal"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <button
              type="button"
              class="btn-close d-none"
              id="hidedeleteStrategyModalBtn"
              data-bs-dismiss="modal"
            ></button>
            <button
              type="button"
              class="btn-close"
              data-bs-toggle="modal"
              href="#viewAndEditStrategyModal"
            ></button>
          </div>
          <div class="modal-body">
            <div class="mt-2 text-center">
              <div class="fs-15 mx-4 mx-sm-5">
                <h4>
                  {{
                    $t('layout.navbar.helper.weixin.detail.strategies.deleteStrategyModal.title', {
                      id: current_strategy.id,
                    })
                  }}
                </h4>
                <p class="text-muted mx-4 mb-0">
                  {{
                    $t('layout.navbar.helper.weixin.detail.strategies.deleteStrategyModal.confirm')
                  }}
                </p>
              </div>
            </div>
            <div class="d-flex gap-2 justify-content-center mt-4 mb-2">
              <button
                type="button"
                class="btn w-sm btn-light"
                data-bs-toggle="modal"
                href="#viewAndEditStrategyModal"
              >
                {{ $t('layout.navbar.helper.weixin.detail.strategies.deleteStrategyModal.cancel') }}
              </button>
              <button type="button" class="btn w-sm btn-danger" @click="handleDelStrategy">
                {{
                  $t('layout.navbar.helper.weixin.detail.strategies.deleteStrategyModal.confirmed')
                }}
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
  getBinds,
  unbindUser,
  getStrategies,
  createStrategy,
  updateStrategy,
  refreshAccount,
  getQRCode,
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
      binds: {
        pageNum: 1,
        pageSize: 200,
        totalCount: 0,
      },
      strategies: {
        pageNum: 1,
        pageSize: 200,
        totalCount: 0,
      },
    });

    const handlePaginationChange = ({ tab, pageNum, pageSize }) => {
      pagination[tab].pageNum = pageNum;
      pagination[tab].pageSize = pageSize;
      if (tab === 'binds') fetchBindBinds();
      if (tab === 'strategies') fetchStrategies();
    };

    const binds = ref([]);
    const fetchBindBinds = () => {
      getBinds({
        soid: route.value.params.soid,
        pageNum: pagination.binds.pageNum,
        pageSize: pagination.binds.pageSize,
      }).then(({ code, data, msg }) => {
        if (code === 200) {
          binds.value = data.rows;
          pagination.binds.totalCount = data.count;
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

    const strategies = ref([]);
    const fetchStrategies = () => {
      getStrategies({
        soid: route.value.params.soid,
        pageNum: pagination.strategies.pageNum,
        pageSize: pagination.strategies.pageSize,
      }).then(({ code, data, msg }) => {
        if (code === 200) {
          strategies.value = data.rows;
          pagination.strategies.totalCount = data.count;
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

    const viewAndEditStrategyModalHiddenHandler = () => {
      is_editing.value = false;
    };

    onMounted(() => {
      fetchAccountInfo();
      fetchBindBinds();
      fetchStrategies();

      const viewAndEditStrategyModal = document.getElementById('viewAndEditStrategyModal');
      if (viewAndEditStrategyModal)
        viewAndEditStrategyModal.addEventListener(
          'hidden.bs.modal',
          viewAndEditStrategyModalHiddenHandler,
        );
    });

    onUnmounted(() => {
      const viewAndEditStrategyModal = document.getElementById('viewAndEditStrategyModal');
      if (viewAndEditStrategyModal)
        viewAndEditStrategyModal.removeEventListener(
          'hidden.bs.modal',
          viewAndEditStrategyModalHiddenHandler,
        );
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

    const current_bind = ref({});

    const handleViewBindData = (bind) => {
      current_bind.value = JSON.parse(JSON.stringify(bind));
      current_bind.value.userinfo = JSON.stringify(current_bind.value.userinfo, null, 2);
      document.getElementById('showBindDataOffcanvasBtn').click();
    };

    const handleUnbind = () => {
      current_bind.value.data_state = 'deleted';
      unbindUser(current_bind.value).then(({ code, msg }) => {
        if (code === 200) {
          fetchBindBinds();
          document.getElementById('hideUnbindModalBtn').click();
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
    const current_strategy = ref({});
    const viewAndEditStrategyModalKey = ref(null);
    const handleClickStrategyId = (strategy) => {
      is_editing.value = false;
      current_strategy.value = JSON.parse(JSON.stringify(strategy));
      viewAndEditStrategyModalKey.value = Math.random().toString(36).slice(-6);
      document.getElementById('showviewAndEditStrategyModalBtn').click();
    };

    const handleDelStrategy = () => {
      current_strategy.value.data_state = 'deleted';
      updateStrategy(current_strategy.value).then(({ code, msg }) => {
        if (code === 200) {
          document.getElementById('hidedeleteStrategyModalBtn').click();
          fetchStrategies();
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

    const handleCreateStrategy = () => {
      current_strategy.value = { soid: account.value.soid, weight: 0 };
      is_editing.value = true;
      viewAndEditStrategyModalKey.value = Math.random().toString(36).slice(-6);
      document.getElementById('showviewAndEditStrategyModalBtn').click();
    };

    const handleSubmitStrategy = () => {
      if (current_strategy.value.msg_keyword?.charAt(0) != '@')
        current_strategy.value.instr_exp = null;
      if (current_strategy.value.id) {
        updateStrategy(current_strategy.value).then(({ code, msg }) => {
          if (code === 200) {
            document.getElementById('hideviewAndEditStrategyModalBtn').click();
            fetchStrategies();
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
        createStrategy(current_strategy.value).then(({ code, msg }) => {
          if (code === 200) {
            document.getElementById('hideviewAndEditStrategyModalBtn').click();
            fetchStrategies();
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

    const handleRefreshAccount = (key) => {
      refreshAccount({ key, soid: account.value.soid }).then((res) => {
        if (res.code === 200) {
          // fetchAccountInfo();
          if (res?.data?.data) account.value[key] = res.data.data;
          if (res?.data?.time) account.value[`${key}_time`] = res.data.time;
        } else {
          toast({
            component: ToastificationContent,
            props: {
              variant: 'danger',
              icon: 'mdi-alert',
              text: res.msg,
            },
          });
        }
      });
    };

    const qr = reactive({
      src: null,
      scene: '',
      expire: 1800,
      count: 1,
    });

    const handleGenerateQr = () => {
      if (qr.src) {
        qr.src = null;
        qr.scene = '';
        qr.expire = 1800;
        qr.count = 1;
        return;
      }
      const params = {
        soid: account.value.soid,
        scene: qr.scene,
        expire: qr.expire,
        count: qr.count,
      };
      getQRCode(params).then(({ code, data }) => {
        if (code === 200) qr.src = data.src;
      });
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

      binds,
      current_bind,
      handleViewBindData,
      handleUnbind,

      strategies,
      current_strategy,

      is_editing,
      msgTypeOptions,
      replyTypeOptions,

      handleCreateStrategy,
      handleClickStrategyId,
      viewAndEditStrategyModalKey,
      handleDelStrategy,
      handleSubmitStrategy,

      handleRefreshAccount,

      qr,
      handleGenerateQr,
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
