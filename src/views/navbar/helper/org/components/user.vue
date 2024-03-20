<template>
  <div>
    <div class="card-header border-0 align-items-center d-flex">
      <h4 class="card-title mb-0 flex-grow-1">
        {{ $t('layout.navbar.helper.org.user.users') }}
        <i class="mdi mdi-account-plus float-end fs-16 cursor-pointer" @click="handleCreateUser" />
      </h4>
    </div>
    <div class="card-body p-0">
      <div class="input-group">
        <span v-if="deptQuery" class="p-3 pe-0 pb-0">
          {{ $t('layout.navbar.helper.org.user.filter.dept') }}: {{ deptQuery.text }}
          <i class="mdi mdi-close text-danger cursor-pointer" @click="deptQuery = null"></i>
        </span>
        <span v-if="roleQuery" class="p-3 pe-0 pb-0">
          {{ $t('layout.navbar.helper.org.user.filter.role') }}: {{ roleQuery.text }}
          <i class="mdi mdi-close text-danger cursor-pointer" @click="roleQuery = null"></i>
        </span>
        <div class="search-box">
          <input
            type="text"
            class="form-control search border-0 py-3"
            :placeholder="$t('layout.navbar.helper.org.user.filter.search')"
            v-model="userQuery"
          />
          <i class="mdi mdi-magnify ms-2 fs-16 search-icon"></i>
        </div>
      </div>
    </div>
    <div v-if="users.length" class="card-body pb-0">
      <div class="table-responsive table-card" data-simplebar style="max-height: 50vh">
        <table class="table table-hover table-striped align-middle table-nowrap">
          <thead class="table-light text-muted">
            <tr>
              <th>{{ $t('layout.navbar.helper.org.user.table.id') }}</th>
              <th>{{ $t('layout.navbar.helper.org.user.table.user') }}</th>
              <th>{{ $t('layout.navbar.helper.org.user.table.email') }}</th>
              <th>{{ $t('layout.navbar.helper.org.user.table.phone') }}</th>
              <th>{{ $t('layout.navbar.helper.org.user.table.status') }}</th>
              <th>{{ $t('layout.navbar.helper.org.user.table.dept') }}</th>
              <th>{{ $t('layout.navbar.helper.org.user.table.role') }}</th>
              <th>{{ $t('layout.navbar.helper.org.user.table.post') }}</th>
              <th>{{ $t('layout.navbar.helper.org.user.table.leader') }}</th>
              <th>{{ $t('layout.navbar.helper.org.user.table.gender') }}</th>
              <th>{{ $t('layout.navbar.helper.org.user.table.birthday') }}</th>
              <th>{{ $t('layout.navbar.helper.org.user.table.address') }}</th>
              <th>{{ $t('layout.navbar.helper.org.user.table.wechat') }}</th>
              <th>{{ $t('layout.navbar.helper.org.user.table.qq') }}</th>
              <th>{{ $t('layout.navbar.helper.org.user.table.github') }}</th>
              <th>{{ $t('layout.navbar.helper.org.user.table.website') }}</th>
              <th>{{ $t('layout.navbar.helper.org.user.table.about') }}</th>
              <th>{{ $t('layout.navbar.helper.org.user.table.loginCount') }}</th>
              <th>{{ $t('layout.navbar.helper.org.user.table.lastLoginAt') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users" :key="user.id">
              <td class="text-primary text-decoration-underline cursor-pointer fw-medium">
                <span @click="handleClickUserId(user)">#{{ user.id }}</span>
              </td>
              <td>
                <div class="d-flex align-items-center">
                  <Avatar :data="user" />
                  <span class="d-flex flex-column ms-1">
                    <span class="fs-14">
                      {{ user.fullname }}
                    </span>
                    <span class="fs-10 text-muted">
                      {{ user.username }}
                    </span>
                  </span>
                </div>
              </td>
              <td>{{ user.email }}</td>
              <td>{{ user.phone }}</td>
              <td>
                <span
                  class="badge text-uppercase"
                  :class="{
                    'badge-soft-success': user.status === 1,
                    'badge-soft-danger': user.status === 0,
                  }"
                >
                  <i
                    class="mdi fs-16 align-middle"
                    :class="{
                      'mdi-check-decagram': user.status === 1,
                      'mdi-alert-decagram': user.status === 0,
                    }"
                  ></i>
                  {{
                    user.status === 1
                      ? $t('layout.navbar.helper.org.user.table.status.enable')
                      : $t('layout.navbar.helper.org.user.table.status.disabled')
                  }}
                </span>
              </td>
              <td>{{ $store.state.org.depts.find((dept) => dept.id === user.dept)?.name }}</td>
              <td>
                {{
                  $store.state.org.roles
                    .filter((role) => user.role.includes(role.id))
                    .map((role) => {
                      return role.name;
                    })
                    .join(', ')
                }}
              </td>
              <td>{{ user.post }}</td>
              <td>{{ getUserInfo(user.leader, 'id').fullname }}</td>
              <td>
                <span
                  class="badge text-uppercase"
                  :class="{
                    'badge-soft-info': user.gender == 1,
                    'badge-soft-warning': user.gender == 0,
                    'badge-soft-primary': user.gender == -1,
                  }"
                >
                  {{
                    user.gender === 1
                      ? $t('layout.navbar.helper.org.user.table.gender.male')
                      : user.gender === 0
                      ? $t('layout.navbar.helper.org.user.table.gender.female')
                      : $t('layout.navbar.helper.org.user.table.gender.secrecy')
                  }}
                </span>
              </td>
              <td>{{ user.birthday }}</td>
              <td>{{ user.address }}</td>
              <td>{{ user.wechat }}</td>
              <td>{{ user.qq }}</td>
              <td>{{ user.github }}</td>
              <td>{{ user.website }}</td>
              <td>{{ user.about }}</td>
              <td>{{ user.login_count }}</td>
              <td>{{ user.last_login_at && moment(user.last_login_at).fromNow() }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="pb-2 pt-4">
        <Pagination
          :total="pagination.totalCount"
          :page-num="pagination.pageNum"
          :page-size="pagination.pageSize"
          @changed="handlePaginationChange"
        />
      </div>
    </div>
    <Empty :text="$t('layout.navbar.helper.org.user.table.empty')" v-else />

    <button
      id="showViewAndEditUserModalBtn"
      class="d-none"
      data-bs-toggle="modal"
      data-bs-target="#viewAndEditUserModal"
    />
    <div
      class="modal fade"
      id="viewAndEditUserModal"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
    >
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header p-2 bg-soft-info">
            <h5 class="modal-title">
              {{
                current_user.id
                  ? current_user.fullname
                  : $t('layout.navbar.helper.org.user.viewAndEditUserModal.newUser')
              }}
            </h5>
            <button
              type="button"
              id="hideViewAndEditUserModalBtn"
              class="btn-close"
              data-bs-dismiss="modal"
            ></button>
          </div>
          <Form v-slot="{ errors }" @submit="handleSubmitUser" :key="viewAndEditUserModalKey">
            <div class="modal-body p-0">
              <div
                v-if="is_editing"
                data-simplebar
                class="p-3"
                style="max-height: 80vh; overflow-x: hidden"
              >
                <div class="row g-3">
                  <div class="col-lg-6">
                    <label class="form-label">
                      {{ $t('layout.navbar.helper.org.user.viewAndEditUserModal.form.username') }}
                    </label>
                    <Field
                      name="username"
                      v-model="current_user.username"
                      type="text"
                      :placeholder="
                        $t('layout.navbar.helper.org.user.viewAndEditUserModal.form.username')
                      "
                      :class="['form-control', errors.username && 'is-invalid']"
                      :disabled="current_user.id"
                      rules="required|username"
                    />
                    <span class="invalid-feedback">{{ errors.username }}</span>
                  </div>
                  <div class="col-lg-6">
                    <label class="form-label">
                      {{ $t('layout.navbar.helper.org.user.viewAndEditUserModal.form.fullname') }}
                    </label>
                    <Field
                      name="fullname"
                      v-model="current_user.fullname"
                      type="text"
                      :placeholder="
                        $t('layout.navbar.helper.org.user.viewAndEditUserModal.form.fullname')
                      "
                      :class="['form-control', errors.fullname && 'is-invalid']"
                      rules="required|fullname"
                    />
                    <span class="invalid-feedback">{{ errors.fullname }}</span>
                  </div>
                  <div class="col-lg-6">
                    <label class="form-label">
                      {{ $t('layout.navbar.helper.org.user.viewAndEditUserModal.form.phone') }}
                    </label>
                    <Field
                      name="phone"
                      v-model="current_user.phone"
                      :placeholder="
                        $t('layout.navbar.helper.org.user.viewAndEditUserModal.form.username')
                      "
                      :class="['form-control', errors.phone && 'is-invalid']"
                      rules="required|phone"
                    />
                    <span class="invalid-feedback">{{ errors.phone }}</span>
                  </div>
                  <div class="col-lg-6">
                    <label class="form-label">
                      {{ $t('layout.navbar.helper.org.user.viewAndEditUserModal.form.email') }}
                    </label>
                    <Field
                      name="email"
                      v-model="current_user.email"
                      :placeholder="
                        $t('layout.navbar.helper.org.user.viewAndEditUserModal.form.email')
                      "
                      :class="['form-control', errors.email && 'is-invalid']"
                      rules="required|email"
                    />
                    <span class="invalid-feedback">{{ errors.email }}</span>
                  </div>
                  <div class="col-lg-6">
                    <label class="form-label">
                      {{ $t('layout.navbar.helper.org.user.viewAndEditUserModal.form.birthday') }}
                    </label>
                    <FlatPickr
                      v-model="current_user.birthday"
                      :class="['form-control', errors.birthday && 'is-invalid']"
                      :placeholder="
                        $t('layout.navbar.helper.org.user.viewAndEditUserModal.form.birthday')
                      "
                    ></FlatPickr>
                    <Field
                      name="birthday"
                      v-model="current_user.birthday"
                      rules="required"
                      class="d-none"
                    />
                    <span class="invalid-feedback">{{ errors.birthday }}</span>
                  </div>
                  <div class="col-lg-3">
                    <label class="form-label">
                      {{ $t('layout.navbar.helper.org.user.viewAndEditUserModal.form.gender') }}
                    </label>
                    <VueSelect
                      v-model="current_user.gender"
                      :placeholder="
                        $t('layout.navbar.helper.org.user.viewAndEditUserModal.form.gender')
                      "
                      :class="{ 'is-invalid': errors.gender }"
                      :reduce="(item) => item.value"
                      label="text"
                      :options="[
                        {
                          text: $t(
                            'layout.navbar.helper.org.user.viewAndEditUserModal.form.gender.male',
                          ),
                          value: 1,
                        },
                        {
                          text: $t(
                            'layout.navbar.helper.org.user.viewAndEditUserModal.form.gender.female',
                          ),
                          value: 0,
                        },
                        {
                          text: $t(
                            'layout.navbar.helper.org.user.viewAndEditUserModal.form.gender.secrecy',
                          ),
                          value: -1,
                        },
                      ]"
                      :clearable="false"
                    >
                      <template v-slot:no-options="{ search, searching }">
                        <template v-if="searching">
                          <span v-html="$t('components.vs.search', { search })"></span>
                        </template>
                        <em v-else style="opacity: 0.5">{{ $t('components.vs.searchOption') }}</em>
                      </template>
                    </VueSelect>
                    <Field
                      name="gender"
                      v-model="current_user.gender"
                      rules="required"
                      class="d-none"
                    />
                    <span class="invalid-feedback">{{ errors.gender }}</span>
                  </div>
                  <div class="col-lg-3">
                    <label class="form-label">
                      {{ $t('layout.navbar.helper.org.user.viewAndEditUserModal.form.status') }}
                    </label>
                    <VueSelect
                      v-model="current_user.status"
                      :placeholder="
                        $t('layout.navbar.helper.org.user.viewAndEditUserModal.form.status')
                      "
                      :class="{ 'is-invalid': errors.status }"
                      :reduce="(item) => item.value"
                      :disabled="current_user.id === 1"
                      label="text"
                      :options="[
                        {
                          text: $t(
                            'layout.navbar.helper.org.user.viewAndEditUserModal.form.status.enable',
                          ),
                          value: 1,
                        },
                        {
                          text: $t(
                            'layout.navbar.helper.org.user.viewAndEditUserModal.form.status.disabled',
                          ),
                          value: 0,
                        },
                      ]"
                      :clearable="false"
                    >
                      <template v-slot:no-options="{ search, searching }">
                        <template v-if="searching">
                          <span v-html="$t('components.vs.search', { search })"></span>
                        </template>
                        <em v-else style="opacity: 0.5">{{ $t('components.vs.searchOption') }}</em>
                      </template>
                    </VueSelect>
                    <Field
                      name="status"
                      v-model="current_user.status"
                      rules="required"
                      class="d-none"
                    />
                    <span class="invalid-feedback">{{ errors.status }}</span>
                  </div>
                  <div class="col-lg-6">
                    <label class="form-label">
                      {{ $t('layout.navbar.helper.org.user.viewAndEditUserModal.form.dept') }}
                    </label>
                    <VueSelect
                      v-model="current_user.dept"
                      :placeholder="
                        $t('layout.navbar.helper.org.user.viewAndEditUserModal.form.dept')
                      "
                      :class="{ 'is-invalid': errors.dept }"
                      :reduce="(item) => item.id"
                      label="name"
                      :clearable="false"
                      :options="$store.state.org.depts"
                      @option:selected="handleSelectDept(true)"
                    >
                      <template v-slot:no-options="{ search, searching }">
                        <template v-if="searching">
                          <span v-html="$t('components.vs.search', { search })"></span>
                        </template>
                        <em v-else style="opacity: 0.5">
                          {{ $t('components.vs.searchDepartment') }}
                        </em>
                      </template>
                    </VueSelect>
                    <Field
                      name="dept"
                      v-model="current_user.dept"
                      rules="required"
                      class="d-none"
                    />
                    <span class="invalid-feedback">{{ errors.dept }}</span>
                  </div>

                  <div class="col-lg-6">
                    <label class="form-label">
                      {{ $t('layout.navbar.helper.org.user.viewAndEditUserModal.form.role') }}
                    </label>
                    <VueSelect
                      v-model="current_user.role"
                      multiple
                      :close-on-select="false"
                      :placeholder="
                        $t('layout.navbar.helper.org.user.viewAndEditUserModal.form.role')
                      "
                      :class="{ 'is-invalid': errors.role }"
                      :reduce="(item) => item.id"
                      label="name"
                      :options="$store.state.org.roles"
                      :clearable="false"
                    >
                      <template v-slot:no-options="{ search, searching }">
                        <template v-if="searching">
                          <span v-html="$t('components.vs.search', { search })"></span>
                        </template>
                        <em v-else style="opacity: 0.5">{{ $t('components.vs.searchRole') }}</em>
                      </template>
                    </VueSelect>
                    <Field
                      name="role"
                      v-model="current_user.role"
                      rules="required"
                      class="d-none"
                    />
                    <span class="invalid-feedback">{{ errors.role }}</span>
                  </div>

                  <div class="col-lg-6">
                    <label class="form-label">
                      {{ $t('layout.navbar.helper.org.user.viewAndEditUserModal.form.leader') }}
                    </label>
                    <VueSelect
                      v-model="current_user.leader"
                      :placeholder="
                        $t('layout.navbar.helper.org.user.viewAndEditUserModal.form.leader')
                      "
                      :class="{ 'is-invalid': errors.leader }"
                      :reduce="(item) => item.id"
                      label="fullname"
                      :options="options4leader"
                    >
                      <template #option="data">
                        <div class="d-flex align-items-center">
                          <Avatar :data="data" size="xxs" />
                          <span class="ml-50 align-middle ms-1">{{ data.fullname }}</span>
                        </div>
                      </template>

                      <template #selected-option="data">
                        <div class="d-flex align-items-center">
                          <Avatar :data="data" size="xxs" />
                          <span class="ml-50 align-middle ms-1">{{ data.fullname }}</span>
                        </div>
                      </template>

                      <template v-slot:no-options="{ search, searching }">
                        <template v-if="searching">
                          <span v-html="$t('components.vs.search', { search })"></span>
                        </template>
                        <em v-else style="opacity: 0.5">{{ $t('components.vs.searchUser') }}</em>
                      </template>
                    </VueSelect>
                    <Field
                      name="leader"
                      v-model="current_user.leader"
                      rules="required"
                      class="d-none"
                    />
                    <span class="invalid-feedback">{{ errors.leader }}</span>
                  </div>

                  <div class="col-lg-6">
                    <label class="form-label">
                      {{ $t('layout.navbar.helper.org.user.viewAndEditUserModal.form.post') }}
                    </label>
                    <Field
                      name="post"
                      v-model="current_user.post"
                      type="text"
                      :placeholder="
                        $t('layout.navbar.helper.org.user.viewAndEditUserModal.form.post')
                      "
                      :class="['form-control', errors.post && 'is-invalid']"
                      rules="required"
                    />
                    <span class="invalid-feedback">{{ errors.post }}</span>
                  </div>

                  <div class="col-lg-12">
                    <label class="form-label">
                      {{ $t('layout.navbar.helper.org.user.viewAndEditUserModal.form.skills') }}
                    </label>
                    <VueSelect
                      v-model="current_user.skills"
                      multiple
                      :close-on-select="false"
                      taggable
                      push-tags
                      :placeholder="
                        $t('layout.navbar.helper.org.user.viewAndEditUserModal.form.skills')
                      "
                    >
                      <template v-slot:no-options="{ search, searching }">
                        <template v-if="searching">
                          <span v-html="$t('components.vs.search', { search })"></span>
                        </template>
                        <em v-else style="opacity: 0.5">{{ $t('components.vs.generateSkill') }}</em>
                      </template>
                    </VueSelect>
                  </div>

                  <div class="col-lg-3">
                    <label class="form-label">
                      {{ $t('layout.navbar.helper.org.user.viewAndEditUserModal.form.wechat') }}
                    </label>
                    <Field
                      name="wechat"
                      v-model="current_user.wechat"
                      type="text"
                      :placeholder="
                        $t('layout.navbar.helper.org.user.viewAndEditUserModal.form.wechat')
                      "
                      class="form-control"
                    />
                    <span class="invalid-feedback">{{ errors.wechat }}</span>
                  </div>
                  <div class="col-lg-3">
                    <label class="form-label">
                      {{ $t('layout.navbar.helper.org.user.viewAndEditUserModal.form.qq') }}
                    </label>
                    <Field
                      name="qq"
                      v-model="current_user.qq"
                      type="text"
                      :placeholder="
                        $t('layout.navbar.helper.org.user.viewAndEditUserModal.form.qq')
                      "
                      class="form-control"
                    />
                    <span class="invalid-feedback">{{ errors.qq }}</span>
                  </div>
                  <div class="col-lg-3">
                    <label class="form-label">
                      {{ $t('layout.navbar.helper.org.user.viewAndEditUserModal.form.github') }}
                    </label>
                    <Field
                      name="github"
                      v-model="current_user.github"
                      type="text"
                      :placeholder="
                        $t('layout.navbar.helper.org.user.viewAndEditUserModal.form.github')
                      "
                      class="form-control"
                    />
                    <span class="invalid-feedback">{{ errors.github }}</span>
                  </div>
                  <div class="col-lg-3">
                    <label class="form-label">
                      {{ $t('layout.navbar.helper.org.user.viewAndEditUserModal.form.website') }}
                    </label>
                    <Field
                      name="website"
                      v-model="current_user.website"
                      type="text"
                      :placeholder="
                        $t('layout.navbar.helper.org.user.viewAndEditUserModal.form.website')
                      "
                      class="form-control"
                    />
                    <span class="invalid-feedback">{{ errors.website }}</span>
                  </div>

                  <div class="col-lg-6">
                    <label class="form-label">
                      {{ $t('layout.navbar.helper.org.user.viewAndEditUserModal.form.address') }}
                    </label>
                    <input
                      type="text"
                      class="form-control"
                      :placeholder="
                        $t('layout.navbar.helper.org.user.viewAndEditUserModal.form.address')
                      "
                      v-model="current_user.address"
                    />
                  </div>

                  <div class="col-lg-6">
                    <label class="form-label">
                      {{ $t('layout.navbar.helper.org.user.viewAndEditUserModal.form.about') }}
                    </label>
                    <textarea
                      class="form-control"
                      v-model="current_user.about"
                      :placeholder="
                        $t('layout.navbar.helper.org.user.viewAndEditUserModal.form.about')
                      "
                      rows="3"
                    />
                  </div>
                </div>
              </div>
              <div v-else class="user-details">
                <div class="card-body text-center">
                  <a class="d-flex justify-content-center align-items-center cursor-pointer">
                    <div
                      :class="`flex-shrink-0 chat-user-img ${
                        $store.state.org.onlines.includes(current_user.username)
                          ? 'online'
                          : 'offline'
                      } user-own-img align-self-center`"
                    >
                      <span
                        class="user-status"
                        style="width: 15px; height: 15px; right: 5px"
                      ></span>
                      <Avatar :data="current_user" size="md" thumbnail />
                    </div>
                  </a>
                  <h5 class="mt-3 mb-1">{{ current_user.fullname }}</h5>
                  <p class="text-muted">
                    <span class="text-capitalize">{{ current_user.post }}</span>
                    @
                    <span class="text-capitalize">
                      {{
                        $store.state.org.depts.find((dept) => dept.id === current_user.dept)?.name
                      }}
                    </span>
                  </p>
                </div>
                <div class="card-body">
                  <div class="table-responsive table-card">
                    <table class="table table-borderless mb-0">
                      <tbody>
                        <tr>
                          <td class="fw-medium">
                            <i class="mdi mdi-cellphone text-muted me-2"></i>
                            {{
                              $t('layout.navbar.helper.org.user.viewAndEditUserModal.form.phone')
                            }}
                          </td>
                          <td>{{ current_user.phone }}</td>
                        </tr>
                        <tr>
                          <td class="fw-medium">
                            <i class="mdi mdi-email text-muted me-2"></i>
                            {{
                              $t('layout.navbar.helper.org.user.viewAndEditUserModal.form.email')
                            }}
                          </td>
                          <td>{{ current_user.email }}</td>
                        </tr>
                        <tr>
                          <td class="fw-medium">
                            <i class="mdi mdi-github text-muted me-2"></i>
                            {{
                              $t('layout.navbar.helper.org.user.viewAndEditUserModal.form.github')
                            }}
                          </td>
                          <td>{{ current_user.github }}</td>
                        </tr>
                        <tr>
                          <td class="fw-medium">
                            <i class="mdi mdi-wechat text-muted me-2"></i>
                            {{
                              $t('layout.navbar.helper.org.user.viewAndEditUserModal.form.wechat')
                            }}
                          </td>
                          <td>{{ current_user.wechat }}</td>
                        </tr>
                        <tr>
                          <td class="fw-medium">
                            <i class="mdi mdi-qqchat text-muted me-2"></i>
                            {{ $t('layout.navbar.helper.org.user.viewAndEditUserModal.form.qq') }}
                          </td>
                          <td>{{ current_user.qq }}</td>
                        </tr>
                        <tr>
                          <td class="fw-medium">
                            <i class="mdi mdi-web text-muted me-2"></i>
                            {{
                              $t('layout.navbar.helper.org.user.viewAndEditUserModal.form.website')
                            }}
                          </td>
                          <td>{{ current_user.website }}</td>
                        </tr>
                        <tr>
                          <td class="fw-medium">
                            <i class="mdi mdi-calendar text-muted me-2"></i>
                            {{
                              $t('layout.navbar.helper.org.user.viewAndEditUserModal.form.birthday')
                            }}
                          </td>
                          <td>{{ current_user.birthday }}</td>
                        </tr>
                        <tr>
                          <td class="fw-medium">
                            <i class="mdi mdi-google-maps text-muted me-2"></i>
                            {{
                              $t('layout.navbar.helper.org.user.viewAndEditUserModal.form.address')
                            }}
                          </td>
                          <td>{{ current_user.address }}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
            <div class="modal-footer p-3 pt-1 pb-1">
              <a
                v-if="current_user.id && (current_user.id != 1 || $store.state.user.data.id === 1)"
                class="btn btn-sm btn-primary"
                @click="is_editing = !is_editing"
              >
                <i
                  class="mdi"
                  :class="is_editing ? 'mdi-content-save-off-outline' : 'mdi-account-edit-outline'"
                ></i>
                {{
                  is_editing
                    ? $t('layout.navbar.helper.org.user.viewAndEditUserModal.form.footer.cancel')
                    : $t('layout.navbar.helper.org.user.viewAndEditUserModal.form.footer.edit')
                }}
              </a>
              <button
                v-if="!is_editing && current_user.id && current_user.id != 1"
                type="button"
                class="btn btn-sm btn-danger"
                @click="handleDelUser(false)"
              >
                <i class="mdi mdi-account-remove-outline"></i>
                {{ $t('layout.navbar.helper.org.user.viewAndEditUserModal.form.footer.delete') }}
              </button>
              <button
                v-if="is_editing"
                type="submit"
                class="btn btn-sm btn-success"
                :disabled="Object.keys(errors).length"
              >
                <i
                  class="mdi"
                  :class="
                    current_user.id ? 'mdi-account-check-outline' : 'mdi-account-plus-outline'
                  "
                ></i>
                {{
                  current_user.id
                    ? $t('layout.navbar.helper.org.user.viewAndEditUserModal.form.footer.save')
                    : $t('layout.navbar.helper.org.user.viewAndEditUserModal.form.footer.create')
                }}
              </button>
            </div>
          </Form>
        </div>
      </div>
    </div>

    <button
      type="button"
      class="d-none"
      id="showDeleteUserModalBth"
      data-bs-toggle="modal"
      href="#deleteUserModal"
    ></button>
    <div class="modal fade" id="deleteUserModal" data-bs-backdrop="static" data-bs-keyboard="false">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <button
              type="button"
              class="btn-close d-none"
              id="hideDeleteUserModalBtn"
              data-bs-dismiss="modal"
            ></button>
            <button
              type="button"
              class="btn-close"
              data-bs-toggle="modal"
              href="#viewAndEditUserModal"
            ></button>
          </div>
          <div class="modal-body">
            <div class="mt-2 text-center">
              <div class="fs-15 mx-4 mx-sm-5">
                <h4>
                  {{
                    $t('layout.navbar.helper.org.user.deleteUserModal.title', {
                      name: current_user.fullname,
                    })
                  }}
                </h4>
                <p class="text-muted mx-4 mb-0">
                  {{ $t('layout.navbar.helper.org.user.deleteUserModal.confirm') }}
                </p>
              </div>
            </div>
            <div class="d-flex gap-2 justify-content-center mt-4 mb-2">
              <button
                type="button"
                class="btn w-sm btn-light"
                data-bs-toggle="modal"
                href="#viewAndEditUserModal"
              >
                {{ $t('layout.navbar.helper.org.user.deleteUserModal.cancel') }}
              </button>
              <button type="button" class="btn w-sm btn-danger" @click="handleDelUser(true)">
                {{ $t('layout.navbar.helper.org.user.deleteUserModal.confirmed') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, computed, onMounted, onUnmounted, ref, reactive } from 'vue';
import { useToast } from 'vue-toastification';
import ToastificationContent from '@components/ToastificationContent';
import { getChanges, getUserInfo } from '@utils';
import i18n from '@utils/i18n';
import moment from '@utils/moment';
import store from '@store';
import FlatPickr from '@components/FlatPickr';
import Pagination from '@components/Pagination';
import Avatar from '@components/Avatar';
import Empty from '@components/Empty';
import { getUserList, updateUser, createUser } from '@api/user';

const props = defineProps({
  depts: {
    type: Array,
    default: () => {
      return [];
    },
  },
  role: {
    type: Object,
    default: () => {
      return {};
    },
  },
});

const emit = defineEmits(['clearDepts', 'clearRole']);

const toast = useToast();

const pagination = reactive({
  pageNum: 1,
  pageSize: 200,
  totalCount: 0,
});

const _users = ref([]);

onMounted(() => {
  getData();
});

const handlePaginationChange = ({ pageNum, pageSize }) => {
  pagination.pageNum = pageNum;
  pagination.pageSize = pageSize;
  getData();
};

const getData = () => {
  getUserList({ pageNum: pagination.pageNum, pageSize: pagination.pageSize }).then(
    ({ code, msg, data }) => {
      if (code === 200) {
        _users.value = data.rows;
        pagination.totalCount = data.count;
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
    },
  );
};

const deptQuery = computed({
  get() {
    return props.depts.length
      ? {
          text: props.depts
            .map((dept) => {
              return dept.name;
            })
            .join(', '),
          value: props.depts.map((dept) => {
            return dept.id;
          }),
        }
      : null;
  },
  set() {
    emit('clearDepts');
  },
});

const roleQuery = computed({
  get() {
    return props.role.id
      ? {
          text: props.role.name,
          value: props.role.id,
        }
      : null;
  },
  set() {
    emit('clearRole');
  },
});

const userQuery = ref('');

const users = computed(() => {
  return _users.value
    .filter((user) => (deptQuery.value ? deptQuery.value.value.includes(user.dept) : true))
    .filter((user) => (roleQuery.value ? user.role.includes(roleQuery.value.value) : true))
    .filter((user) =>
      userQuery.value
        ? `${user.username}|${user.fullname}|${user.phone}|${user.email}`.includes(userQuery.value)
        : true,
    );
});

const current_user = ref({});
const is_editing = ref(false);

const viewAndEditUserModalHiddenHandler = () => {
  is_editing.value = false;
};

onMounted(() => {
  const viewAndEditUserModal = document.getElementById('viewAndEditUserModal');
  if (viewAndEditUserModal)
    viewAndEditUserModal.addEventListener('hidden.bs.modal', viewAndEditUserModalHiddenHandler);
});

onUnmounted(() => {
  const viewAndEditUserModal = document.getElementById('viewAndEditUserModal');
  if (viewAndEditUserModal)
    viewAndEditUserModal.removeEventListener('hidden.bs.modal', viewAndEditUserModalHiddenHandler);
});

const viewAndEditUserModalKey = ref(null);

const handleClickUserId = (user) => {
  current_user.value = JSON.parse(JSON.stringify(user));
  handleSelectDept();
  viewAndEditUserModalKey.value = Math.random().toString(36).slice(-6);
  document.getElementById('showViewAndEditUserModalBtn').click();
};

const handleCreateUser = () => {
  current_user.value = { status: 1 };
  is_editing.value = true;
  viewAndEditUserModalKey.value = Math.random().toString(36).slice(-6);
  document.getElementById('showViewAndEditUserModalBtn').click();
};

const handleDelUser = (confirm) => {
  if (confirm) {
    updateUser({
      id: current_user.value.id,
      data_state: 'deleted',
    }).then(() => {
      getData();
      document.getElementById('hideDeleteUserModalBtn').click();
    });
  } else {
    if (
      store.state.org.users.filter(
        (user) => user.id != current_user.value.id && user.leader === current_user.value.id,
      ).length
    ) {
      toast({
        component: ToastificationContent,
        props: {
          variant: 'danger',
          icon: 'mdi-alert',
          text: i18n.global.t('layout.navbar.helper.org.user.delete.error'),
        },
      });
      return;
    }
    document.getElementById('showDeleteUserModalBth').click();
  }
};

const options4leader = ref([]);
const handleSelectDept = (autoSelect = false) => {
  options4leader.value = store.state.org.users.filter(
    (user) =>
      user.dept === current_user.value.dept ||
      user.dept === store.state.org.depts.find((dept) => dept.id === current_user.value.dept).pid,
  );
  if (autoSelect) {
    if (options4leader.value.length === 1) current_user.value.leader = options4leader.value[0].id;
    else current_user.value.leader = null;
  }
};

const handleSubmitUser = () => {
  if (
    !current_user.value.id &&
    store.state.org.users.filter((user) => user.username === current_user.value.username).length
  ) {
    toast({
      component: ToastificationContent,
      props: {
        variant: 'danger',
        icon: 'mdi-alert',
        text: i18n.global.t('layout.navbar.helper.org.user.create.username.error', {
          username: current_user.value.username,
        }),
      },
    });
    return;
  }
  if (
    store.state.org.users.filter(
      (user) => user.id != current_user.value.id && user.phone === current_user.value.phone,
    ).length
  ) {
    toast({
      component: ToastificationContent,
      props: {
        variant: 'danger',
        icon: 'mdi-alert',
        text: i18n.global.t('layout.navbar.helper.org.user.create.phone.error', {
          phone: current_user.value.phone,
        }),
      },
    });
    return;
  }
  if (
    store.state.org.users.filter(
      (user) => user.id != current_user.value.id && user.email === current_user.value.email,
    ).length
  ) {
    toast({
      component: ToastificationContent,
      props: {
        variant: 'danger',
        icon: 'mdi-alert',
        text: i18n.global.t('layout.navbar.helper.org.user.create.email.error', {
          email: current_user.value.email,
        }),
      },
    });
    return;
  }
  if (current_user.value.id) {
    const changes = getChanges(current_user.value, getUserInfo(current_user.value.id, 'id'));
    if (Object.keys(changes).length) {
      changes.id = current_user.value.id;
      updateUser(changes).then(() => {
        getData();
        document.getElementById('hideViewAndEditUserModalBtn').click();
      });
    } else {
      document.getElementById('hideViewAndEditUserModalBtn').click();
    }
  } else {
    createUser(current_user.value).then(() => {
      getData();
      document.getElementById('hideViewAndEditUserModalBtn').click();
    });
  }
};
</script>
