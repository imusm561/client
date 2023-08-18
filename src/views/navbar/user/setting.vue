<template>
  <div>
    <div class="row">
      <div class="col-xxl-3">
        <div class="card">
          <div class="card-body p-4">
            <div class="text-center">
              <div class="profile-user position-relative d-inline-block mx-auto mb-4">
                <Avatar :data="user" size="xl" thumbnail />
                <div class="avatar-xs p-0 rounded-circle profile-photo-edit">
                  <input
                    id="profile-img-file-input"
                    type="file"
                    accept="image/*"
                    class="profile-img-file-input"
                    @click="
                      (e) => {
                        e.target.value = '';
                      }
                    "
                    @change="handleFileInput"
                  />
                  <label for="profile-img-file-input" class="profile-photo-edit avatar-xs">
                    <span class="avatar-title rounded-circle bg-light text-body">
                      <i class="mdi mdi-camera fs-16"></i>
                    </span>
                  </label>
                </div>
              </div>
              <h5 class="fs-16 mb-1 text-capitalize">
                {{ user.fullname }}
              </h5>
              <p class="text-muted mb-0">{{ user.post }}</p>
            </div>
          </div>
        </div>
        <div class="card">
          <div class="card-body">
            <div class="d-flex align-items-center mb-4">
              <div class="flex-grow-1">
                <h5 class="card-title mb-0">
                  {{ $t('layout.navbar.user.dropdown.setting.social') }}
                </h5>
              </div>
            </div>
            <div class="mb-3 d-flex">
              <div class="avatar-xs d-block flex-shrink-0 me-3">
                <span class="avatar-title rounded-circle fs-16 bg-success">
                  <i class="mdi mdi-wechat"></i>
                </span>
              </div>
              <input
                type="text"
                class="form-control"
                :placeholder="$t('layout.navbar.user.dropdown.setting.social.wechat')"
                v-model="user.wechat"
              />
            </div>
            <div class="mb-3 d-flex">
              <div class="avatar-xs d-block flex-shrink-0 me-3">
                <span class="avatar-title rounded-circle fs-16 bg-secondary">
                  <i class="mdi mdi-qqchat"></i>
                </span>
              </div>
              <input
                type="text"
                class="form-control"
                :placeholder="$t('layout.navbar.user.dropdown.setting.social.qq')"
                v-model="user.qq"
              />
            </div>
            <div class="mb-3 d-flex">
              <div class="avatar-xs d-block flex-shrink-0 me-3">
                <span class="avatar-title rounded-circle fs-16 bg-dark text-light">
                  <i class="mdi mdi-github"></i>
                </span>
              </div>
              <input
                type="text"
                class="form-control"
                :placeholder="$t('layout.navbar.user.dropdown.setting.social.github')"
                v-model="user.github"
              />
            </div>
            <div class="d-flex">
              <div class="avatar-xs d-block flex-shrink-0 me-3">
                <span class="avatar-title rounded-circle fs-16 bg-primary">
                  <i class="mdi mdi-web"></i>
                </span>
              </div>
              <input
                type="text"
                class="form-control"
                :placeholder="$t('layout.navbar.user.dropdown.setting.social.website')"
                v-model="user.website"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="col-xxl-9">
        <div class="card">
          <div class="card-header">
            <ul class="nav nav-tabs-custom rounded card-header-tabs border-bottom-0" role="tablist">
              <li class="nav-item">
                <a
                  class="nav-link"
                  :class="{ active: !$route.query.tab || $route.query.tab === 'personal_details' }"
                  data-bs-toggle="tab"
                  href="#personalDetails"
                  role="tab"
                >
                  <i class="fas fa-home"></i>
                  {{ $t('layout.navbar.user.dropdown.setting.personalDetails') }}
                </a>
              </li>
              <li class="nav-item">
                <a
                  class="nav-link"
                  :class="{ active: $route.query.tab === 'change_password' }"
                  data-bs-toggle="tab"
                  href="#changePassword"
                  role="tab"
                >
                  <i class="far fa-user"></i>
                  {{ $t('layout.navbar.user.dropdown.setting.changePassword') }}
                </a>
              </li>
              <li class="nav-item">
                <a
                  class="nav-link"
                  :class="{ active: $route.query.tab === 'app_notification' }"
                  data-bs-toggle="tab"
                  href="#appNotification"
                  role="tab"
                >
                  <i class="far fa-envelope"></i>
                  {{ $t('layout.navbar.user.dropdown.setting.appNotification') }}
                </a>
              </li>
              <li v-if="$store.state.user.data.id === 1" class="nav-item">
                <a
                  class="nav-link"
                  :class="{ active: $route.query.tab === 'sys_configuration' }"
                  data-bs-toggle="tab"
                  href="#sysConfiguration"
                  role="tab"
                >
                  <i class="far fa-envelope"></i>
                  {{ $t('layout.navbar.user.dropdown.setting.sysConfiguration') }}
                </a>
              </li>
            </ul>
          </div>
          <div class="card-body p-4">
            <div class="tab-content">
              <div
                class="tab-pane"
                :class="{ active: !$route.query.tab || $route.query.tab === 'personal_details' }"
                id="personalDetails"
                role="tabpanel"
              >
                <Form v-slot="{ errors }" @submit="handleSaveUserInfo">
                  <div class="row">
                    <div class="col-lg-6">
                      <div class="mb-3">
                        <label for="username" class="form-label">
                          {{ $t('layout.navbar.user.dropdown.setting.personalDetails.username') }}
                        </label>
                        <Field
                          name="username"
                          disabled
                          v-model="user.username"
                          :placeholder="
                            $t('layout.navbar.user.dropdown.setting.personalDetails.username')
                          "
                          :class="['form-control', errors.username && 'is-invalid']"
                          rules="required"
                        />
                        <span class="invalid-feedback">{{ errors.username }}</span>
                      </div>
                    </div>
                    <div class="col-lg-6">
                      <div class="mb-3">
                        <label for="fullname" class="form-label">
                          {{ $t('layout.navbar.user.dropdown.setting.personalDetails.fullname') }}
                        </label>
                        <Field
                          name="fullname"
                          v-model="user.fullname"
                          :placeholder="
                            $t('layout.navbar.user.dropdown.setting.personalDetails.fullname')
                          "
                          :class="['form-control', errors.fullname && 'is-invalid']"
                          rules="required"
                        />
                        <span class="invalid-feedback">{{ errors.fullname }}</span>
                      </div>
                    </div>
                    <div class="col-lg-6">
                      <div class="mb-3">
                        <label for="phone" class="form-label">
                          {{ $t('layout.navbar.user.dropdown.setting.personalDetails.phone') }}
                        </label>
                        <Field
                          name="phone"
                          v-model="user.phone"
                          :placeholder="
                            $t('layout.navbar.user.dropdown.setting.personalDetails.phone')
                          "
                          :class="['form-control', errors.phone && 'is-invalid']"
                          rules="required|phone"
                        />
                        <span class="invalid-feedback">{{ errors.phone }}</span>
                      </div>
                    </div>
                    <div class="col-lg-6">
                      <div class="mb-3">
                        <label for="email" class="form-label">
                          {{ $t('layout.navbar.user.dropdown.setting.personalDetails.email') }}
                        </label>
                        <Field
                          name="email"
                          v-model="user.email"
                          :placeholder="
                            $t('layout.navbar.user.dropdown.setting.personalDetails.email')
                          "
                          :class="['form-control', errors.email && 'is-invalid']"
                          rules="required|email"
                        />
                        <span class="invalid-feedback">{{ errors.email }}</span>
                      </div>
                    </div>
                    <div class="col-lg-6">
                      <div class="mb-3">
                        <label for="JoiningdatInput" class="form-label">
                          {{ $t('layout.navbar.user.dropdown.setting.personalDetails.birthday') }}
                        </label>
                        <FlatPickr
                          class="form-control"
                          v-model="user.birthday"
                          :placeholder="
                            $t('layout.navbar.user.dropdown.setting.personalDetails.birthday')
                          "
                        ></FlatPickr>
                      </div>
                    </div>
                    <div class="col-lg-6">
                      <div class="mb-3">
                        <label for="JoiningdatInput" class="form-label">
                          {{ $t('layout.navbar.user.dropdown.setting.personalDetails.gender') }}
                        </label>
                        <VueSelect
                          v-model="user.gender"
                          :placeholder="
                            $t('layout.navbar.user.dropdown.setting.personalDetails.gender')
                          "
                          :reduce="(item) => item.value"
                          label="text"
                          :options="[
                            {
                              text: $t(
                                'layout.navbar.user.dropdown.setting.personalDetails.gender.secrecy',
                              ),
                              value: -1,
                            },
                            {
                              text: $t(
                                'layout.navbar.user.dropdown.setting.personalDetails.gender.male',
                              ),
                              value: 1,
                            },
                            {
                              text: $t(
                                'layout.navbar.user.dropdown.setting.personalDetails.gender.female',
                              ),
                              value: 0,
                            },
                          ]"
                        >
                          <template #option="{ text }">
                            <span class="ml-50 align-middle">{{ text }}</span>
                          </template>

                          <template #selected-option="{ text }">
                            <span class="ml-50 align-middle">{{ text }}</span>
                          </template>

                          <template v-slot:no-options="{ search, searching }">
                            <template v-if="searching">
                              <span v-html="$t('components.vs.search', { search })"></span>
                            </template>
                            <em v-else style="opacity: 0.5">
                              {{ $t('components.vs.searchOption') }}
                            </em>
                          </template>
                        </VueSelect>
                      </div>
                    </div>
                    <div class="col-lg-12">
                      <div class="mb-3">
                        <label class="form-label">
                          {{ $t('layout.navbar.user.dropdown.setting.personalDetails.address') }}
                        </label>
                        <input
                          type="text"
                          class="form-control"
                          :placeholder="
                            $t('layout.navbar.user.dropdown.setting.personalDetails.address')
                          "
                          v-model="user.address"
                        />
                      </div>
                    </div>
                    <div class="col-lg-12">
                      <div class="mb-3">
                        <label for="skillsInput" class="form-label">
                          {{ $t('layout.navbar.user.dropdown.setting.personalDetails.skills') }}
                        </label>
                        <VueSelect
                          v-model="user.skills"
                          multiple
                          :close-on-select="false"
                          taggable
                          push-tags
                          :placeholder="
                            $t('layout.navbar.user.dropdown.setting.personalDetails.skills')
                          "
                        >
                          <template v-slot:no-options="{ search, searching }">
                            <template v-if="searching">
                              <span v-html="$t('components.vs.search', { search })"></span>
                            </template>
                            <em v-else style="opacity: 0.5">
                              {{ $t('components.vs.generateSkill') }}
                            </em>
                          </template>
                        </VueSelect>
                      </div>
                    </div>
                    <div class="col-lg-12">
                      <div class="mb-3 pb-2">
                        <label for="about" class="form-label">
                          {{ $t('layout.navbar.user.dropdown.setting.personalDetails.about') }}
                        </label>
                        <textarea
                          class="form-control"
                          v-model="user.about"
                          :placeholder="
                            $t('layout.navbar.user.dropdown.setting.personalDetails.about')
                          "
                          rows="3"
                        />
                      </div>
                    </div>
                    <div class="col-lg-12">
                      <div class="hstack gap-2 justify-content-end">
                        <button
                          type="submit"
                          class="btn btn-primary"
                          :disabled="Object.keys(errors).length"
                        >
                          <i class="mdi mdi-content-save-outline" />
                          {{ $t('layout.navbar.user.dropdown.setting.save') }}
                        </button>
                      </div>
                    </div>
                  </div>
                </Form>
              </div>
              <div
                class="tab-pane"
                :class="{ active: $route.query.tab === 'change_password' }"
                id="changePassword"
                role="tabpanel"
              >
                <Form v-slot="{ errors }" @submit="handleChangePassword">
                  <div class="row g-2">
                    <div class="col-lg-4">
                      <div>
                        <label for="currentpassword" class="form-label">
                          {{
                            $t('layout.navbar.user.dropdown.setting.changePassword.currentPassoprd')
                          }}
                        </label>
                        <div class="position-relative">
                          <Field
                            :type="isCurrentPasswordVisible ? 'text' : 'password'"
                            name="currentpassword"
                            v-model="currentpassword"
                            :placeholder="
                              $t(
                                'layout.navbar.user.dropdown.setting.changePassword.currentPassoprd',
                              )
                            "
                            :class="['form-control', errors.currentpassword && 'is-invalid']"
                            rules="required"
                            autocomplete="off"
                          />
                          <span class="invalid-feedback">{{ errors.currentpassword }}</span>
                          <button
                            type="button"
                            class="btn btn-link position-absolute end-0 top-0 text-decoration-none text-muted"
                          >
                            <i
                              :class="[
                                'align-middle mdi',
                                isCurrentPasswordVisible ? 'mdi-eye-off' : 'mdi-eye',
                              ]"
                              @click="isCurrentPasswordVisible = !isCurrentPasswordVisible"
                            ></i>
                          </button>
                        </div>
                      </div>
                    </div>
                    <div class="col-lg-4">
                      <div>
                        <label for="newpassword" class="form-label">
                          {{ $t('layout.navbar.user.dropdown.setting.changePassword.newPassoprd') }}
                        </label>
                        <div class="position-relative">
                          <Field
                            :type="isNewPasswordVisible ? 'text' : 'password'"
                            name="newpassword"
                            v-model="newpassword"
                            :placeholder="
                              $t('layout.navbar.user.dropdown.setting.changePassword.newPassoprd')
                            "
                            :class="['form-control', errors.newpassword && 'is-invalid']"
                            rules="required|password"
                            autocomplete="off"
                          />
                          <span class="invalid-feedback">{{ errors.newpassword }}</span>
                          <button
                            type="button"
                            class="btn btn-link position-absolute end-0 top-0 text-decoration-none text-muted"
                          >
                            <i
                              :class="[
                                'align-middle mdi',
                                isNewPasswordVisible ? 'mdi-eye-off' : 'mdi-eye',
                              ]"
                              @click="isNewPasswordVisible = !isNewPasswordVisible"
                            ></i>
                          </button>
                        </div>
                      </div>
                    </div>
                    <div class="col-lg-4">
                      <div>
                        <label for="confirmpassword" class="form-label">
                          {{
                            $t('layout.navbar.user.dropdown.setting.changePassword.confirmPassoprd')
                          }}
                        </label>
                        <div class="position-relative">
                          <Field
                            :type="isConfirmPasswordVisible ? 'text' : 'password'"
                            name="confirmpassword"
                            v-model="confirmpassword"
                            :placeholder="
                              $t(
                                'layout.navbar.user.dropdown.setting.changePassword.confirmPassoprd',
                              )
                            "
                            :class="['form-control', errors.confirmpassword && 'is-invalid']"
                            rules="required|confirmed:@newpassword"
                            autocomplete="off"
                          />
                          <span class="invalid-feedback">{{ errors.confirmpassword }}</span>
                          <button
                            type="button"
                            class="btn btn-link position-absolute end-0 top-0 text-decoration-none text-muted"
                          >
                            <i
                              :class="[
                                'align-middle mdi',
                                isConfirmPasswordVisible ? 'mdi-eye-off' : 'mdi-eye',
                              ]"
                              @click="isConfirmPasswordVisible = !isConfirmPasswordVisible"
                            ></i>
                          </button>
                        </div>
                      </div>
                    </div>
                    <div class="col-lg-12">
                      <div class="mb-3">
                        <router-link
                          :to="{ name: 'forgotPassword' }"
                          class="link-primary text-decoration-underline"
                        >
                          {{
                            $t('layout.navbar.user.dropdown.setting.changePassword.forgotPassoprd')
                          }}
                        </router-link>
                      </div>
                    </div>
                    <div class="col-lg-12">
                      <div class="text-end">
                        <button
                          type="submit"
                          class="btn btn-danger"
                          :disabled="Object.keys(errors).length"
                        >
                          {{
                            $t('layout.navbar.user.dropdown.setting.changePassword.changePassword')
                          }}
                        </button>
                      </div>
                    </div>
                  </div>
                </Form>
                <div class="mt-4 mb-3 border-bottom pb-2">
                  <h5 class="card-title">
                    {{ $t('layout.navbar.user.dropdown.setting.changePassword.loginHistory') }}
                  </h5>
                </div>
                <div
                  class="d-flex align-items-center mb-3"
                  v-for="item in login_history"
                  :key="item.id"
                >
                  <div class="flex-shrink-0 avatar-sm">
                    <div class="avatar-title bg-light text-primary rounded-3 fs-18">
                      <i
                        class="mdi"
                        :class="resolveDeviceIcon(uaParser(item.agent).device.type || 'desktop')"
                      />
                    </div>
                  </div>
                  <div class="flex-grow-1 ms-3">
                    <div class="text-capitalize">
                      {{ uaParser(item.agent).device.type || 'desktop' }}
                    </div>
                    <p class="text-muted mb-0">
                      {{ item.ip }} - {{ $moment(item.created_at).format('llll') }}
                      <span class="badge bg-soft-info text-dark ms-1">
                        {{ $moment(item.created_at).fromNow() }}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
              <div
                class="tab-pane"
                :class="{ active: $route.query.tab === 'app_notification' }"
                id="appNotification"
                role="tabpanel"
              >
                <ul class="list-unstyled mb-0">
                  <li class="d-flex mt-2">
                    <div class="flex-grow-1">
                      <label class="form-check-label fs-14" for="chatNotify">
                        {{ $t('layout.navbar.user.dropdown.setting.appNotification.chat') }}
                      </label>
                      <p class="text-muted">
                        {{ $t('layout.navbar.user.dropdown.setting.appNotification.chat.desc') }}
                      </p>
                    </div>
                    <div class="flex-shrink-0">
                      <div class="form-check form-switch">
                        <input
                          class="form-check-input"
                          type="checkbox"
                          role="switch"
                          id="chatNotify"
                          v-model="user.config.chatNotify"
                        />
                      </div>
                    </div>
                  </li>
                  <li class="d-flex mt-2">
                    <div class="flex-grow-1">
                      <label class="form-check-label fs-14" for="mailNotify">
                        {{ $t('layout.navbar.user.dropdown.setting.appNotification.mail') }}
                      </label>
                      <p class="text-muted">
                        {{ $t('layout.navbar.user.dropdown.setting.appNotification.mail.desc') }}
                      </p>
                    </div>
                    <div class="flex-shrink-0">
                      <div class="form-check form-switch">
                        <input
                          class="form-check-input"
                          type="checkbox"
                          role="switch"
                          id="mailNotify"
                          v-model="user.config.mailNotify"
                        />
                      </div>
                    </div>
                  </li>
                  <li class="d-flex mt-2">
                    <div class="flex-grow-1">
                      <label class="form-check-label fs-14" for="commentNotify">
                        {{ $t('layout.navbar.user.dropdown.setting.appNotification.comment') }}
                      </label>
                      <p class="text-muted">
                        {{ $t('layout.navbar.user.dropdown.setting.appNotification.comment.desc') }}
                      </p>
                    </div>
                    <div class="flex-shrink-0">
                      <div class="form-check form-switch">
                        <input
                          class="form-check-input"
                          type="checkbox"
                          role="switch"
                          id="commentNotify"
                          v-model="user.config.commentNotify"
                        />
                      </div>
                    </div>
                  </li>
                </ul>
                <div class="col-lg-12">
                  <div class="hstack gap-2 justify-content-end">
                    <button type="submit" class="btn btn-primary" @click="handleSaveUserInfo">
                      <i class="mdi mdi-content-save-outline" />
                      {{ $t('layout.navbar.user.dropdown.setting.save') }}
                    </button>
                  </div>
                </div>
              </div>
              <div
                v-if="$store.state.user.data.id === 1"
                class="tab-pane"
                :class="{ active: $route.query.tab === 'sys_configuration' }"
                id="sysConfiguration"
                role="tabpanel"
              >
                <Form v-slot="{ errors }" @submit="handleSaveUserInfo">
                  <div class="row">
                    <div class="col-lg-4">
                      <div class="mb-3">
                        <label for="name" class="form-label">
                          {{ $t('layout.navbar.user.dropdown.setting.sysConfiguration.name') }}
                        </label>
                        <Field
                          name="name"
                          v-model="user.config.name"
                          :placeholder="
                            $t('layout.navbar.user.dropdown.setting.sysConfiguration.name')
                          "
                          :class="['form-control', errors.name && 'is-invalid']"
                          rules="required"
                        />
                        <span class="invalid-feedback">{{ errors.name }}</span>
                      </div>
                    </div>
                    <div class="col-lg-4">
                      <div class="mb-3">
                        <label for="company" class="form-label">
                          {{ $t('layout.navbar.user.dropdown.setting.sysConfiguration.company') }}
                        </label>
                        <Field
                          name="company"
                          v-model="user.config.company"
                          :placeholder="
                            $t('layout.navbar.user.dropdown.setting.sysConfiguration.company')
                          "
                          :class="['form-control', errors.company && 'is-invalid']"
                          rules="required"
                        />
                        <span class="invalid-feedback">{{ errors.company }}</span>
                      </div>
                    </div>
                    <div class="col-lg-4">
                      <div class="mb-3">
                        <label for="beian" class="form-label">
                          {{ $t('layout.navbar.user.dropdown.setting.sysConfiguration.beian') }}
                        </label>
                        <Field
                          name="beian"
                          v-model="user.config.beian"
                          :placeholder="
                            $t('layout.navbar.user.dropdown.setting.sysConfiguration.beian')
                          "
                          :class="['form-control', errors.beian && 'is-invalid']"
                          rules="required"
                        />
                        <span class="invalid-feedback">{{ errors.beian }}</span>
                      </div>
                    </div>
                    <div class="col-12">
                      <div class="mb-3 pb-2">
                        <label for="agGridLicense" class="form-label">
                          {{
                            $t('layout.navbar.user.dropdown.setting.sysConfiguration.agGridLicense')
                          }}
                        </label>
                        <textarea
                          class="form-control"
                          v-model="user.config.agGridLicense"
                          :placeholder="
                            $t('layout.navbar.user.dropdown.setting.sysConfiguration.agGridLicense')
                          "
                          rows="3"
                        />
                      </div>
                    </div>
                    <div class="col-lg-6">
                      <div class="mb-3">
                        <label for="aliyunAccessKeyId" class="form-label">
                          {{
                            $t(
                              'layout.navbar.user.dropdown.setting.sysConfiguration.aliyunAccessKeyId',
                            )
                          }}
                        </label>
                        <Field
                          name="aliyunAccessKeyId"
                          v-model="user.config.aliyunAccessKeyId"
                          :placeholder="
                            $t(
                              'layout.navbar.user.dropdown.setting.sysConfiguration.aliyunAccessKeyId',
                            )
                          "
                          :class="['form-control', errors.aliyunAccessKeyId && 'is-invalid']"
                        />
                        <span class="invalid-feedback">{{ errors.aliyunAccessKeyId }}</span>
                      </div>
                    </div>
                    <div class="col-lg-6">
                      <div class="mb-3">
                        <label for="aliyunAccessKeySecret" class="form-label">
                          {{
                            $t(
                              'layout.navbar.user.dropdown.setting.sysConfiguration.aliyunAccessKeySecret',
                            )
                          }}
                        </label>
                        <Field
                          name="aliyunAccessKeySecret"
                          v-model="user.config.aliyunAccessKeySecret"
                          :placeholder="
                            $t(
                              'layout.navbar.user.dropdown.setting.sysConfiguration.aliyunAccessKeySecret',
                            )
                          "
                          :class="['form-control', errors.aliyunAccessKeySecret && 'is-invalid']"
                        />
                        <span class="invalid-feedback">{{ errors.aliyunAccessKeySecret }}</span>
                      </div>
                    </div>
                    <div class="col-12">
                      <div class="mb-3">
                        <label for="aliyunSmsTemplates" class="form-label">
                          {{
                            $t(
                              'layout.navbar.user.dropdown.setting.sysConfiguration.aliyunSmsTemplates',
                            )
                          }}
                        </label>
                        <MonacoEditor
                          v-model="user.config.aliyunSmsTemplates"
                          :class="{
                            'is-invalid':
                              errors.aliyunSmsTemplates || syntax_error.aliyunSmsTemplates,
                          }"
                          @error="($event) => (syntax_error.aliyunSmsTemplates = $event)"
                          language="json"
                        />
                        <Field
                          name="aliyunSmsTemplates"
                          v-model="user.config.aliyunSmsTemplates"
                          :placeholder="
                            $t(
                              'layout.navbar.user.dropdown.setting.sysConfiguration.aliyunSmsTemplates',
                            )
                          "
                          class="d-none"
                          :class="{
                            'is-invalid':
                              errors.aliyunSmsTemplates || syntax_error.aliyunSmsTemplates,
                          }"
                        />
                        <span class="invalid-feedback">
                          {{ errors.aliyunSmsTemplates || syntax_error.aliyunSmsTemplates }}
                        </span>
                      </div>
                    </div>
                    <div class="col-lg-4">
                      <div class="mb-3">
                        <label for="amapJsApi" class="form-label">
                          {{ $t('layout.navbar.user.dropdown.setting.sysConfiguration.amapJsApi') }}
                        </label>
                        <Field
                          name="amapJsApi"
                          v-model="user.config.amapJsApi"
                          :placeholder="
                            $t('layout.navbar.user.dropdown.setting.sysConfiguration.amapJsApi')
                          "
                          :class="['form-control', errors.amapJsApi && 'is-invalid']"
                        />
                        <span class="invalid-feedback">{{ errors.amapJsApi }}</span>
                      </div>
                    </div>
                    <div class="col-lg-4">
                      <div class="mb-3">
                        <label for="amapJsCode" class="form-label">
                          {{
                            $t('layout.navbar.user.dropdown.setting.sysConfiguration.amapJsCode')
                          }}
                        </label>
                        <Field
                          name="amapJsCode"
                          v-model="user.config.amapJsCode"
                          :placeholder="
                            $t('layout.navbar.user.dropdown.setting.sysConfiguration.amapJsCode')
                          "
                          :class="['form-control', errors.amapJsCode && 'is-invalid']"
                        />
                        <span class="invalid-feedback">{{ errors.amapJsCode }}</span>
                      </div>
                    </div>
                    <div class="col-lg-4">
                      <div class="mb-3">
                        <label for="amapWebService" class="form-label">
                          {{
                            $t(
                              'layout.navbar.user.dropdown.setting.sysConfiguration.amapWebService',
                            )
                          }}
                        </label>
                        <Field
                          name="amapWebService"
                          v-model="user.config.amapWebService"
                          :placeholder="
                            $t(
                              'layout.navbar.user.dropdown.setting.sysConfiguration.amapWebService',
                            )
                          "
                          :class="['form-control', errors.amapWebService && 'is-invalid']"
                        />
                        <span class="invalid-feedback">{{ errors.amapWebService }}</span>
                      </div>
                    </div>

                    <div class="col-lg-4">
                      <div class="mb-3">
                        <label for="officeViewer" class="form-label">
                          {{
                            $t('layout.navbar.user.dropdown.setting.sysConfiguration.officeViewer')
                          }}
                        </label>
                        <Field
                          name="officeViewer"
                          v-model="user.config.officeViewer"
                          :placeholder="
                            $t('layout.navbar.user.dropdown.setting.sysConfiguration.officeViewer')
                          "
                          :class="['form-control', errors.officeViewer && 'is-invalid']"
                          rules="required"
                        />
                        <span class="invalid-feedback">{{ errors.officeViewer }}</span>
                      </div>
                    </div>

                    <div class="col-lg-4">
                      <div class="mb-3">
                        <label for="useAvatar" class="form-label">
                          {{ $t('layout.navbar.user.dropdown.setting.sysConfiguration.useAvatar') }}
                        </label>
                        <VueSelect
                          v-model="user.config.useAvatar"
                          :placeholder="
                            $t('layout.navbar.user.dropdown.setting.sysConfiguration.useAvatar')
                          "
                          :options="[true, false]"
                          :clearable="false"
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
                      </div>
                    </div>

                    <div class="col-lg-4">
                      <div class="mb-3">
                        <label for="waterMark" class="form-label">
                          {{ $t('layout.navbar.user.dropdown.setting.sysConfiguration.waterMark') }}
                        </label>
                        <VueSelect
                          v-model="user.config.waterMark"
                          :placeholder="
                            $t('layout.navbar.user.dropdown.setting.sysConfiguration.waterMark')
                          "
                          :options="[true, false]"
                          :clearable="false"
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
                      </div>
                    </div>

                    <div class="col-lg-6">
                      <div class="mb-3">
                        <label for="mail" class="form-label">
                          {{ $t('layout.navbar.user.dropdown.setting.sysConfiguration.mail') }}
                        </label>
                        <MonacoEditor
                          v-model="user.config.mail"
                          :class="{ 'is-invalid': errors.mail || syntax_error.mail }"
                          @error="($event) => (syntax_error.mail = $event)"
                          language="json"
                        />
                        <Field
                          name="mail"
                          v-model="user.config.mail"
                          :placeholder="
                            $t('layout.navbar.user.dropdown.setting.sysConfiguration.mail')
                          "
                          class="d-none"
                          :class="{ 'is-invalid': errors.mail || syntax_error.mail }"
                          rules="required"
                        />
                        <span class="invalid-feedback">
                          {{ errors.mail || syntax_error.mail }}
                        </span>
                      </div>
                    </div>

                    <div class="col-lg-6">
                      <div class="mb-3">
                        <label for="task" class="form-label">
                          {{ $t('layout.navbar.user.dropdown.setting.sysConfiguration.task') }}
                        </label>
                        <MonacoEditor
                          v-model="user.config.task"
                          :class="{ 'is-invalid': errors.task || syntax_error.task }"
                          @error="($event) => (syntax_error.task = $event)"
                          language="json"
                        />
                        <Field
                          name="task"
                          v-model="user.config.task"
                          :placeholder="
                            $t('layout.navbar.user.dropdown.setting.sysConfiguration.task')
                          "
                          class="d-none"
                          :class="{ 'is-invalid': errors.task || syntax_error.task }"
                          rules="required"
                        />
                        <span class="invalid-feedback">
                          {{ errors.task || syntax_error.task }}
                        </span>
                      </div>
                    </div>

                    <div class="col-12">
                      <div class="mb-3">
                        <label for="vars" class="form-label">
                          {{ $t('layout.navbar.user.dropdown.setting.sysConfiguration.vars') }}
                        </label>
                        <MonacoEditor
                          v-model="user.config.vars"
                          :class="{ 'is-invalid': errors.vars || syntax_error.vars }"
                          @error="($event) => (syntax_error.vars = $event)"
                          language="json"
                        />
                        <Field
                          name="vars"
                          v-model="user.config.vars"
                          :placeholder="
                            $t('layout.navbar.user.dropdown.setting.sysConfiguration.vars')
                          "
                          class="d-none"
                          :class="{ 'is-invalid': errors.vars || syntax_error.vars }"
                        />
                        <span class="invalid-feedback">
                          {{ errors.vars || syntax_error.vars }}
                        </span>
                      </div>
                    </div>

                    <div class="col-12">
                      <div class="hstack gap-2 justify-content-end">
                        <button
                          type="submit"
                          class="btn btn-primary"
                          :disabled="Object.keys(errors).length"
                        >
                          <i class="mdi mdi-content-save-outline" />
                          {{ $t('layout.navbar.user.dropdown.setting.save') }}
                        </button>
                      </div>
                    </div>
                  </div>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <button
      id="showAvatarCropperModalBtn"
      class="d-none"
      data-bs-toggle="modal"
      data-bs-target="#avatarCropperModal"
    />
    <div id="avatarCropperModal" class="modal fade zoomIn">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <div class="mt-2 text-center">
              <VueCropper
                ref="cropper"
                style="width: 300px; height: 300px; margin: 0 auto"
                :img="option.img"
                :output-size="option.outputSize"
                :output-type="option.outputType"
                :info="option.info"
                :can-scale="option.canScale"
                :auto-crop="option.autoCrop"
                :auto-crop-width="option.autoCropWidth"
                :auto-crop-height="option.autoCropHeight"
                :fixed="option.fixed"
                :fixed-number="option.fixedNumber"
                :full="option.full"
                :fixed-box="option.fixedBox"
                :can-move="option.canMove"
                :can-move-box="option.canMoveBox"
                :original="option.original"
                :center-box="option.centerBox"
                :high="option.high"
                :info-true="option.infoTrue"
                :max-img-size="option.maxImgSize"
                :enlarge="option.enlarge"
                :mode="option.mode"
              ></VueCropper>
              <span
                class="mt-2 btn btn-icon btn-topbar rounded-circle btn-ghost-primary"
                @click="$refs.cropper.rotateLeft()"
              >
                <i class="mdi mdi-rotate-left fs-22 text-dark"></i>
              </span>
              <span
                class="mt-2 btn btn-icon btn-topbar rounded-circle btn-ghost-primary"
                @click="$refs.cropper.rotateRight()"
              >
                <i class="mdi mdi-rotate-right fs-22 text-dark"></i>
              </span>
              <span
                class="mt-2 btn btn-icon btn-topbar rounded-circle btn-ghost-primary"
                @click="$refs.cropper.changeScale(1)"
              >
                <i class="mdi mdi-image-size-select-large fs-22 text-dark"></i>
              </span>
              <span
                class="mt-2 btn btn-icon btn-topbar rounded-circle btn-ghost-primary"
                @click="$refs.cropper.changeScale(-1)"
              >
                <i class="mdi mdi-image-size-select-small fs-22 text-dark"></i>
              </span>
            </div>
            <div class="d-flex gap-2 justify-content-center mt-4 mb-2">
              <button type="button" class="btn w-sm btn-light" data-bs-dismiss="modal">
                {{ $t('layout.navbar.user.dropdown.setting.avatarCropperModal.cancel') }}
              </button>
              <button
                type="button"
                class="btn w-sm btn-danger"
                data-bs-dismiss="modal"
                @click="handleUploadAvatar"
              >
                {{ $t('layout.navbar.user.dropdown.setting.avatarCropperModal.submit') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed, reactive } from 'vue';
import store from '@store';
import i18n from '@utils/i18n';
import { VueCropper } from 'vue-cropper';
import 'vue-cropper/dist/index.css';
import { base64ToFile } from '@utils';
import { uploadAvatar, updateUser, changePassword, getUserLogs } from '@api/user';
import { useRouter, clearUserData, deepCompare, hashData } from '@utils';
import { useToast } from 'vue-toastification';
import ToastificationContent from '@components/ToastificationContent';
import FlatPickr from '@components/FlatPickr';
import Avatar from '@components/Avatar';
import MonacoEditor from '@components/MonacoEditor';
import uaParser from 'ua-parser-js';
export default {
  components: {
    FlatPickr,
    Avatar,
    VueCropper,
    MonacoEditor,
  },
  setup() {
    const { router } = useRouter();
    const toast = useToast();

    const user = ref(JSON.parse(JSON.stringify(store.state.user.data)));

    const login_history = ref([]);

    onMounted(() => {
      getUserLogs({ type: 1 }).then(({ code, data, msg }) => {
        if (code === 200) {
          login_history.value = data;
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
    });

    const resolveDeviceIcon = computed(() => {
      return (type) => {
        if (type.toLowerCase().includes('mobile')) return 'mdi-cellphone';
        else if (type.toLowerCase().includes('safari')) return 'mdi-tablet';
        else return 'mdi-desktop-mac';
      };
    });

    const currentpassword = ref('');
    const newpassword = ref('');
    const confirmpassword = ref('');

    const isCurrentPasswordVisible = ref(false);
    const isNewPasswordVisible = ref(false);
    const isConfirmPasswordVisible = ref(false);

    const cropper = ref(null);
    const option = ref({
      file: null,
      img: null,
      outputSize: 1,
      outputType: 'png',
      info: true,
      canScale: true,
      autoCrop: true,
      autoCropWidth: 200,
      autoCropHeight: 200,
      fixed: true,
      fixedNumber: [1, 1],
      full: false,
      fixedBox: true,
      canMove: true,
      canMoveBox: false,
      original: false,
      centerBox: false,
      high: true,
      infoTrue: false,
      maxImgSize: 2000,
      enlarge: 1,
      mode: 'cover',
    });

    const handleFileInput = (e) => {
      option.value.file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        let data;
        if (typeof e.target.result === 'object') {
          data = window.URL.createObjectURL(new Blob([e.target.result]));
        } else {
          data = e.target.result;
        }
        option.value.img = data;
        document.getElementById('showAvatarCropperModalBtn').click();
      };
      reader.readAsDataURL(option.value.file);
    };

    const handleUploadAvatar = () => {
      cropper.value.getCropData((data) => {
        const avatar = base64ToFile(
          data,
          `${option.value.file.name.substring(0, option.value.file.name.lastIndexOf('.'))}[${
            option.value.autoCropWidth
          }x${option.value.autoCropHeight}].${option.value.outputType}`,
        );
        const formData = new FormData();
        formData.append('avatar', avatar, avatar.name);
        uploadAvatar(formData).then(({ code, msg, data }) => {
          if (code === 200) {
            user.value.avatar = data.url;
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
      });
    };

    const handleSaveUserInfo = () => {
      const changes = deepCompare(user.value, store.state.user.data);
      if (Object.keys(changes).length) {
        changes.id = user.value.id;
        updateUser(changes).then(() => {
          // user.value = JSON.parse(JSON.stringify(store.state.user.data));
          toast({
            component: ToastificationContent,
            props: {
              variant: 'success',
              icon: 'mdi-check-circle',
              text: i18n.global.t('layout.navbar.user.dropdown.setting.save.success'),
            },
          });
        });
      }
    };
    const handleChangePassword = () => {
      changePassword({
        currentpassword: hashData(currentpassword.value),
        newpassword: hashData(newpassword.value),
      }).then(async ({ code, msg }) => {
        if (code === 200) {
          // Clean user information
          clearUserData();
          // Redirect to login page
          router.replace({ name: 'login' });
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

    const syntax_error = reactive({
      aliyunSmsTemplates: null,
      mail: null,
      task: null,
      vars: null,
    });

    return {
      user,

      uaParser,
      login_history,

      resolveDeviceIcon,

      currentpassword,
      newpassword,
      confirmpassword,

      isCurrentPasswordVisible,
      isNewPasswordVisible,
      isConfirmPasswordVisible,

      cropper,
      option,
      handleFileInput,
      handleUploadAvatar,
      handleSaveUserInfo,
      handleChangePassword,

      syntax_error,
    };
  },
};
</script>
