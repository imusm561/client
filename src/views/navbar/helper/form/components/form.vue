<template>
  <div class="card card-height-100">
    <div class="card-body">
      <div class="row">
        <div class="col-xl-4 col-md-4">
          <div class="sticky-side-div">
            <div class="align-items-center d-flex">
              <h4 class="flex-grow-1">{{ $t('layout.navbar.helper.forms') }}</h4>
              <i class="mdi mdi-plus-box-outline text-primary float-end fs-16 cursor-pointer" @click.stop="handleAddForm()"></i>
            </div>
            <el-tree
              :data="tree"
              node-key="id"
              :default-expanded-keys="default_expanded_keys"
              :draggable="!isModified(['form', 'columns'])"
              :expand-on-click-node="false"
              @node-click="handleSelectForm"
              @node-drop="handleDropForm"
            >
              <template #default="{ node }">
                <span class="d-flex flex-1 align-items-center justify-content-between fs-14 pe-2 text-truncate">
                  <span class="tree-node-label text-truncate">
                    <input
                      id="node_edit"
                      v-if="node.data.edit"
                      type="text"
                      class="form-control form-control-sm"
                      v-model="node.data.title"
                      @keyup.enter="$event.target.blur()"
                      @blur="handleSaveFormTitle(node)"
                    />
                    <span v-else @dblclick="handleEditFormTitle(node)">
                      <i :class="['mdi me-1', node.data.icon || 'mdi-circle-medium']"></i>
                      {{ node.data.title }}
                    </span>
                  </span>
                  <span v-if="!node.data.edit" class="tree-node-actions ms-3">
                    <i class="cursor-pointer fs-16 text-primary mdi mdi-plus-box-outline" @click.stop="handleAddForm(node)"></i>
                    <i
                      v-if="!node.data.children"
                      class="cursor-pointer fs-16 text-denger mdi mdi-delete-outline"
                      @click.stop="handleConfirmDelForm(node)"
                      data-bs-toggle="modal"
                      data-bs-target="#confirmDeleteFormDataModal"
                    ></i>
                  </span>
                </span>
              </template>
            </el-tree>
          </div>
        </div>

        <div class="col-xl-8 col-md-8" v-if="current_form.id">
          <div class="d-flex">
            <div class="flex-grow-1 text-truncate">
              <h4 class="text-truncate">
                <code>#{{ current_form.id }}</code>
                <span class="ms-2">{{ current_form.title }}</span>
              </h4>
              <div class="hstack gap-3 flex-wrap">
                <div class="text-muted">
                  {{
                    $t('layout.navbar.helper.form.create', { user: getUserInfo(current_form.created_by)?.fullname || current_form.created_by, time: $moment(current_form.created_at).format('llll') })
                  }}
                </div>
                <div v-if="current_form.updated_at" class="vr"></div>
                <div v-if="current_form.updated_at" class="text-muted">
                  {{
                    $t('layout.navbar.helper.form.update', { user: getUserInfo(current_form.updated_by)?.fullname || current_form.updated_by, time: $moment(current_form.updated_at).format('llll') })
                  }}
                </div>
              </div>
            </div>
            <div class="flex-shrink-0">
              <div>
                <button v-if="isModified(['form'])" type="button" class="btn btn-sm btn-soft-secondary btn-icon waves-effect waves-light ms-1" @click="handleSaveFormInfo">
                  <i class="fs-20 mdi mdi-content-save"></i>
                </button>
                <button v-if="isModified(['form'])" type="button" class="btn btn-sm btn-soft-success btn-icon waves-effect waves-light ms-1" @click="handleRestoreFormInfo">
                  <i class="fs-20 mdi mdi-restore"></i>
                </button>
                <button
                  type="button"
                  v-if="!isParentOrHasRedirect(current_form)"
                  class="btn btn-sm btn-soft-primary btn-icon waves-effect waves-light ms-1"
                  data-bs-toggle="modal"
                  data-bs-target="#confirmBackupFormDataModal"
                >
                  <i class="fs-20 mdi mdi-database-clock"></i>
                </button>
                <button
                  type="button"
                  v-if="!isParentOrHasRedirect(current_form)"
                  class="btn btn-sm btn-soft-danger btn-icon waves-effect waves-light ms-1"
                  data-bs-toggle="modal"
                  data-bs-target="#confirmTruncateFormDataModal"
                >
                  <i class="fs-20 mdi mdi-database-refresh"></i>
                </button>
              </div>
            </div>
          </div>

          <div class="mt-2">
            <ul class="nav nav-tabs nav-tabs-custom nav-secondary nav-justified mb-3" v-if="!isParentOrHasRedirect(current_form)">
              <li class="nav-item">
                <a class="nav-link" :class="{ active: current_tab === 'basic_info' }" data-bs-toggle="tab" href="#basic_info" @click="current_tab = 'basic_info'">
                  <i class="mdi mdi-cog"></i>
                  {{ $t('layout.navbar.helper.form.tab.basicInfo') }}
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" :class="{ active: current_tab === 'presave_script' }" data-bs-toggle="tab" href="#presave_script" @click="current_tab = 'presave_script'">
                  <i class="mdi mdi-language-javascript"></i>
                  {{ $t('layout.navbar.helper.form.tab.presaveScript') }}
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" :class="{ active: current_tab === 'form_style' }" data-bs-toggle="tab" href="#form_style" @click="current_tab = 'form_style'">
                  <i class="mdi mdi-language-css3"></i>
                  {{ $t('layout.navbar.helper.form.tab.formStyle') }}
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" :class="{ active: current_tab === 'pub_from' }" data-bs-toggle="tab" href="#pub_from" @click="current_tab = 'pub_from'">
                  <i class="mdi mdi-web"></i>
                  {{ $t('layout.navbar.helper.form.tab.pubForm') }}
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" :class="{ active: current_tab === 'approval_flow' }" data-bs-toggle="tab" href="#approval_flow" @click="current_tab = 'approval_flow'">
                  <i class="mdi mdi-account-multiple-check"></i>
                  {{ $t('layout.navbar.helper.form.tab.approvalFlow') }}
                </a>
              </li>
            </ul>

            <div class="tab-content text-muted">
              <div class="tab-pane" :class="{ active: current_tab === 'basic_info' }" id="basic_info">
                <div class="row">
                  <div class="col-lg-3">
                    <div class="mb-3">
                      <label class="form-label">{{ $t('layout.navbar.helper.form.tab.basicInfo.icon') }}</label>
                      <VueSelect
                        v-model="current_form.icon"
                        :placeholder="$t('layout.navbar.helper.form.tab.basicInfo.icon')"
                        :reduce="(item) => `mdi-${item.name}`"
                        label="name"
                        @search="fetchIconOptions"
                        :options="iconOptions"
                      >
                        <template #option="{ name }">
                          <div class="d-flex align-items-center">
                            <i :class="`mdi mdi-${name} me-2`" />
                            <span class="ml-50 align-middle text-truncate">{{ name }}</span>
                          </div>
                        </template>

                        <template #selected-option="{ name }">
                          <div class="d-flex align-items-center">
                            <i :class="`mdi ${name}`" />
                          </div>
                        </template>

                        <template v-slot:no-options="{ search, searching }">
                          <template v-if="searching">
                            <span v-if="search.length > 2">
                              <span v-html="$t('components.vs.search', { search })"></span>
                            </span>
                            <span v-else v-html="$t('components.vs.searchRule')"></span>
                          </template>
                          <em v-else style="opacity: 0.5">{{ $t('components.vs.searchOption') }}</em>
                        </template>
                      </VueSelect>
                    </div>
                  </div>
                  <div class="col-lg-3">
                    <div class="mb-3">
                      <label class="form-label">{{ $t('layout.navbar.helper.form.tab.basicInfo.status') }}</label>
                      <VueSelect
                        v-model="current_form.status"
                        :disabled="!!current_form.is_parent"
                        :placeholder="$t('layout.navbar.helper.form.tab.basicInfo.status')"
                        :reduce="(item) => item.value"
                        label="text"
                        :options="[
                          { text: $t('layout.navbar.helper.form.tab.basicInfo.status.enable'), value: 1 },
                          { text: $t('layout.navbar.helper.form.tab.basicInfo.status.disabled'), value: 0 },
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
                    </div>
                  </div>
                  <div class="col-lg-6">
                    <div class="mb-3">
                      <label class="form-label">{{ $t('layout.navbar.helper.form.tab.basicInfo.redirect') }}</label>
                      <input
                        type="text"
                        class="form-control"
                        :disabled="!!current_form.is_parent"
                        :placeholder="$t('layout.navbar.helper.form.tab.basicInfo.redirect')"
                        v-model="current_form.redirect"
                      />
                    </div>
                  </div>
                  <div class="col-12">
                    <div class="mb-3">
                      <label class="form-label">{{ $t('layout.navbar.helper.form.tab.basicInfo.tags') }}</label>
                      <VueSelect
                        v-model="current_form.tags"
                        :disabled="isParentOrHasRedirect(current_form)"
                        multiple
                        :close-on-select="false"
                        taggable
                        push-tags
                        :placeholder="$t('layout.navbar.helper.form.tab.basicInfo.tags')"
                        :options="[]"
                      >
                        <template v-slot:no-options="{ search, searching }">
                          <template v-if="searching">
                            <span v-html="$t('components.vs.search', { search })"></span>
                          </template>
                          <em v-else style="opacity: 0.5">{{ $t('components.vs.generateTag') }}</em>
                        </template>
                      </VueSelect>
                    </div>
                  </div>
                  <div class="col-12">
                    <div class="mb-3">
                      <label class="form-label">{{ $t('layout.navbar.helper.form.tab.basicInfo.aclView') }}</label>
                      <UsersSelector v-model="current_form.acl_view" :disabled="isParentOrHasRedirect(current_form)" :placeholder="$t('layout.navbar.helper.form.tab.basicInfo.aclView.placeholder')" />
                    </div>
                  </div>
                  <div class="col-12">
                    <div class="mb-3">
                      <label class="form-label">{{ $t('layout.navbar.helper.form.tab.basicInfo.aclEdit') }}</label>
                      <UsersSelector v-model="current_form.acl_edit" :disabled="isParentOrHasRedirect(current_form)" :placeholder="$t('layout.navbar.helper.form.tab.basicInfo.aclEdit.placeholder')" />
                    </div>
                  </div>
                  <div class="col-12">
                    <div class="mb-3">
                      <label class="form-label">{{ $t('layout.navbar.helper.form.tab.basicInfo.description') }}</label>
                      <CKEditor v-model="current_form.description" :disabled="isParentOrHasRedirect(current_form)" />
                    </div>
                  </div>
                </div>
              </div>
              <div class="tab-pane" :class="{ active: current_tab === 'presave_script' }" id="presave_script">
                <div class="col-12">
                  <MonacoEditor :key="current_form.id" v-model="current_form.script" language="javascript" />
                </div>
              </div>
              <div class="tab-pane" :class="{ active: current_tab === 'form_style' }" id="form_style">
                <div class="col-12">
                  <MonacoEditor :key="current_form.id" v-model="current_form.style" language="css" />
                </div>
              </div>
              <div class="tab-pane" :class="{ active: current_tab === 'pub_from' }" id="pub_from">
                <div data-simplebar style="max-height: 30vh">
                  <ul class="list-group">
                    <li class="list-group-item border-1 mb-2" style="border-radius: 5px !important" v-for="item in pubs" :key="item.id">
                      <div class="d-flex align-items-center">
                        <div class="flex-grow-1">
                          <div class="flex-shrink-0 ms-2">
                            <h6 class="fs-14 mb-0 cursor-pointer" @click="handleEditPubForm(item)">#{{ item.id }} {{ item.title }}</h6>
                            <small class="text-muted" v-if="item.start == item.end">{{ $moment(item.start).format('ll') }}</small>
                            <small class="text-muted" v-else>{{ $moment(item.start).format('ll') }} - {{ $moment(item.end).format('ll') }}</small>
                          </div>
                        </div>
                        <div class="flex-shrink-0">
                          <span class="text-success" @click="handleShowPubFormQr">
                            {{
                              $moment().valueOf() > $moment(item.end).add(1, 'd').valueOf()
                                ? $t('layout.navbar.helper.form.tab.pubForm.state.expired')
                                : item.status === 0
                                ? $t('layout.navbar.helper.form.tab.pubForm.state.disabled')
                                : $moment(item.start).valueOf() > $moment().valueOf()
                                ? $t('layout.navbar.helper.form.tab.pubForm.state.notStart')
                                : $t('layout.navbar.helper.form.tab.pubForm.state.inEffect')
                            }}
                          </span>
                        </div>
                      </div>
                    </li>
                    <li class="list-group-item cursor-pointer border" style="border-radius: 5px !important" @click="handleCreatePubForm">
                      <div class="d-flex align-items-center">
                        <div class="flex-grow-1">
                          <div class="flex-shrink-0 ms-2">
                            <h6 class="fs-14 mb-0 text-center">
                              <i class="mdi mdi-plus" />
                              {{ $t('layout.navbar.helper.form.tab.pubForm.create') }}
                            </h6>
                          </div>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
              <div class="tab-pane" :class="{ active: current_tab === 'approval_flow' }" id="approval_flow">
                <ul class="list-group">
                  <draggable class="accordion accordion-flush" id="accordionFlushFlow" :list="current_form.flow" group="flow" handle=".mover" :sort="true">
                    <li class="list-group-item border-1 mb-2" style="border-radius: 5px !important" v-for="(item, index) in current_form.flow" :key="index">
                      <div class="d-flex align-items-center">
                        <div class="flex-grow-1 cursor-pointer" data-bs-toggle="collapse" :data-bs-target="`#flow_${index}`">
                          <div class="d-flex">
                            <div class="flex-shrink-0 ms-2">
                              <h6 class="fs-14 mb-0">
                                <i class="mdi mdi-drag ms-n1 mover cursor-move fs-16"></i>
                                {{ index + 1 }}# {{ item.title }}
                              </h6>
                              <small class="text-muted">
                                {{
                                  $t('layout.navbar.helper.form.tab.approvalFlow.desc', {
                                    count: item.users.length,
                                    logic: item.logic === 1 ? $t('layout.navbar.helper.form.tab.approvalFlow.form.logic.and') : $t('layout.navbar.helper.form.tab.approvalFlow.form.logic.or'),
                                  })
                                }}
                              </small>
                            </div>
                            <Avatar v-if="item.users.length" :key="resolveFlowUsers(item)" class="ms-2" :data="resolveFlowUsers(item)" size="xs" />
                          </div>
                        </div>
                        <div class="flex-shrink-0">
                          <span>
                            <i
                              class="mdi mdi-plus cursor-pointer pe-2"
                              @click="current_form.flow.splice(index + 1, 0, { title: $t('layout.navbar.helper.form.tab.approvalFlow.nodeTitle'), logic: 1, users: [] })"
                            />
                            <i class="mdi mdi-minus cursor-pointer" @click="current_form.flow.splice(index, 1)" />
                          </span>
                        </div>
                      </div>
                      <div :id="`flow_${index}`" class="accordion-collapse collapse" data-bs-parent="#accordionFlushFlow">
                        <div class="row p-2">
                          <div class="col-md-6">
                            <div class="mb-2">
                              <label class="form-label">{{ $t('layout.navbar.helper.form.tab.approvalFlow.form.title') }}</label>
                              <input type="text" class="form-control" v-model="item.title" :placeholder="$t('layout.navbar.helper.form.tab.approvalFlow.form.title')" />
                            </div>
                          </div>
                          <div class="col-md-6">
                            <div class="mb-2">
                              <label class="form-label">{{ $t('layout.navbar.helper.form.tab.approvalFlow.form.logic') }}</label>
                              <VueSelect
                                v-model="item.logic"
                                :placeholder="$t('layout.navbar.helper.form.tab.approvalFlow.form.logic')"
                                :reduce="(item) => item.value"
                                label="text"
                                :options="[
                                  { text: $t('layout.navbar.helper.form.tab.approvalFlow.form.logic.and'), value: 1 },
                                  { text: $t('layout.navbar.helper.form.tab.approvalFlow.form.logic.or'), value: 0 },
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
                            </div>
                          </div>
                          <div class="col-12">
                            <div class="mb-2">
                              <label class="form-label">{{ $t('layout.navbar.helper.form.tab.approvalFlow.form.users') }}</label>
                              <VueSelect
                                v-model="item.users"
                                multiple
                                :close-on-select="false"
                                :placeholder="$t('layout.navbar.helper.form.tab.approvalFlow.form.users')"
                                :reduce="(item) => item.username"
                                label="fullname"
                                :options="[...[$store.state.org.leader], ...$store.state.org.users]"
                                :selectable="
                                  (option) => {
                                    const temp_flow = JSON.parse(JSON.stringify(current_form.flow));
                                    temp_flow.splice(index, 1);
                                    const selected = temp_flow
                                      .map((item) => {
                                        return item.users;
                                      })
                                      .flat();
                                    return option.username === '@leader' || !selected.includes(option.username);
                                  }
                                "
                              >
                                <template #option="data">
                                  <div class="d-flex align-items-center">
                                    <Avatar class="me-2" :data="data" size="xxs" />
                                    <span class="ml-50 align-middle">{{ data.fullname }}</span>
                                  </div>
                                </template>

                                <template #selected-option="data">
                                  <div class="d-flex align-items-center">
                                    <Avatar class="me-2" :data="data" size="xxs" />
                                    <span class="ml-50 align-middle">{{ data.fullname }}</span>
                                  </div>
                                </template>

                                <template v-slot:no-options="{ search, searching }">
                                  <template v-if="searching">
                                    <span v-html="$t('components.vs.search', { search })"></span>
                                  </template>
                                  <em v-else style="opacity: 0.5">{{ $t('components.vs.searchUser') }}</em>
                                </template>
                              </VueSelect>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                    <li
                      v-if="current_form.flow.length === 0"
                      class="list-group-item cursor-pointer"
                      style="border-radius: 5px !important"
                      @click="current_form.flow.splice(0, 0, { title: $t('layout.navbar.helper.form.tab.approvalFlow.nodeTitle'), logic: 1, users: [] })"
                    >
                      <div class="d-flex align-items-center">
                        <div class="flex-grow-1">
                          <div class="flex-shrink-0 ms-2">
                            <h6 class="fs-14 mb-0 text-center">
                              <i class="mdi mdi-plus" />
                              {{ $t('layout.navbar.helper.form.tab.approvalFlow.create') }}
                            </h6>
                          </div>
                        </div>
                      </div>
                    </li>
                  </draggable>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <button id="showViewAndEditPubModalBtn" class="d-none" data-bs-toggle="modal" data-bs-target="#viewAndEditPubModal" />
    <div class="modal fade" id="viewAndEditPubModal" data-bs-backdrop="static" data-bs-keyboard="false" data-bs-focus="false">
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content border-0">
          <div class="modal-header p-2 bg-light">
            <h5 class="modal-title">{{ current_pub.id ? current_pub.title : $t('layout.navbar.helper.form.tab.pubForm.viewAndEditPubModal.newPubForm') }}</h5>
            <button type="button" id="hideViewAndEditPubModalBtn" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <Form v-slot="{ errors }" @submit="handleSubmitPubForm">
            <div class="modal-body p-0">
              <div data-simplebar class="p-3" style="max-height: 80vh; overflow-x: hidden">
                <div class="row g-3">
                  <div class="col-md-6">
                    <label class="form-label">{{ $t('layout.navbar.helper.form.tab.pubForm.viewAndEditPubModal.form.title') }}</label>
                    <Field
                      name="title"
                      v-model="current_pub.title"
                      type="text"
                      :placeholder="$t('layout.navbar.helper.form.tab.pubForm.viewAndEditPubModal.form.title')"
                      :class="['form-control', errors.title && 'is-invalid']"
                      rules="required"
                    />
                    <span class="invalid-feedback">{{ errors.title }}</span>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">{{ $t('layout.navbar.helper.form.tab.pubForm.viewAndEditPubModal.form.status') }}</label>
                    <VueSelect
                      v-model="current_pub.status"
                      :placeholder="$t('layout.navbar.helper.form.tab.pubForm.viewAndEditPubModal.form.status')"
                      :reduce="(item) => item.value"
                      label="text"
                      :options="[
                        { text: $t('layout.navbar.helper.form.tab.pubForm.viewAndEditPubModal.form.status.enable'), value: 1 },
                        { text: $t('layout.navbar.helper.form.tab.pubForm.viewAndEditPubModal.form.status.disabled'), value: 0 },
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
                  </div>
                  <div class="col-12">
                    <label class="form-label">{{ $t('layout.navbar.helper.form.tab.pubForm.viewAndEditPubModal.form.duration') }}</label>
                    <FlatPickr
                      v-model="current_pub.duration"
                      @change="handleChangeDuration"
                      :class="['form-control', errors.duration && 'is-invalid']"
                      :placeholder="$t('layout.navbar.helper.form.tab.pubForm.viewAndEditPubModal.form.duration')"
                      :config="{ mode: 'range' }"
                    ></FlatPickr>
                    <Field name="duration" v-model="current_pub.duration" rules="required" class="d-none" />
                    <span class="invalid-feedback">{{ errors.duration }}</span>
                  </div>

                  <div class="col-12">
                    <label class="form-label">{{ $t('layout.navbar.helper.form.tab.pubForm.viewAndEditPubModal.form.tags') }}</label>
                    <VueSelect
                      v-model="current_pub.tags"
                      multiple
                      :close-on-select="false"
                      taggable
                      push-tags
                      :placeholder="$t('layout.navbar.helper.form.tab.pubForm.viewAndEditPubModal.form.tags')"
                      :options="['allowContinuousSubmission']"
                    >
                      <template v-slot:no-options="{ search, searching }">
                        <template v-if="searching">
                          <span v-html="$t('components.vs.search', { search })"></span>
                        </template>
                        <em v-else style="opacity: 0.5">{{ $t('components.vs.generateTag') }}</em>
                      </template>
                    </VueSelect>
                  </div>

                  <div class="col-12">
                    <label class="form-label">{{ $t('layout.navbar.helper.form.tab.pubForm.viewAndEditPubModal.form.message') }}</label>
                    <CKEditor v-model="current_pub.message" />
                  </div>
                </div>
              </div>
            </div>
            <div class="modal-footer p-3 pt-1 pb-1 pt-0 justify-content-between">
              <div id="qrcode" :key="qrCodeKey" @dblclick="handleDbclickQrcode(current_pub.uuid)"></div>
              <div class="hstack gap-2 align-items-end">
                <button v-if="current_pub.id" type="button" class="btn btn-sm btn-danger" data-bs-toggle="modal" href="#deletePubModal">
                  <i class="mdi mdi-delete-outline align-bottom"></i>
                  {{ $t('layout.navbar.helper.form.tab.pubForm.viewAndEditPubModal.form.footer.delete') }}
                </button>
                <button type="submit" class="btn btn-sm btn-success" :disabled="Object.keys(errors).length">
                  <i class="mdi mdi-content-save-outline"></i>
                  {{
                    current_pub.id
                      ? $t('layout.navbar.helper.form.tab.pubForm.viewAndEditPubModal.form.footer.save')
                      : $t('layout.navbar.helper.form.tab.pubForm.viewAndEditPubModal.form.footer.create')
                  }}
                </button>
              </div>
            </div>
          </Form>
        </div>
      </div>
    </div>

    <div class="modal fade" id="confirmDeleteFormDataModal" data-bs-backdrop="static" data-bs-keyboard="false" data-bs-focus="false">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-body">
            <div class="mt-2 text-center">
              <div class="fs-15 mx-4 mx-sm-5">
                <h4>Delete Form Confirm</h4>
                <p class="text-muted mx-4 mb-0 mb-2" style="white-space: nowrap">
                  Please enter
                  <code class="text-primary fw-bold d-block">{{ delete_form.title }}</code>
                  to verify this operation
                </p>
                <input class="form-control" v-model="confirm" :placeholder="delete_form.title" />
              </div>
            </div>

            <div class="d-flex gap-2 justify-content-center mt-4 mb-2">
              <button
                type="button"
                class="btn w-sm btn-light"
                data-bs-dismiss="modal"
                @click="
                  () => {
                    delete_form = {};
                    confirm = null;
                  }
                "
              >
                Cancel
              </button>
              <button
                type="button"
                :disabled="confirm !== delete_form.title"
                class="btn w-sm btn-danger"
                data-bs-dismiss="modal"
                @click="
                  () => {
                    confirm = null;
                    handleDelForm();
                  }
                "
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="modal fade" id="confirmBackupFormDataModal" data-bs-backdrop="static" data-bs-keyboard="false" data-bs-focus="false">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-body">
            <div class="mt-2 text-center">
              <div class="fs-15 mx-4 mx-sm-5">
                <h4>{{ $t('layout.navbar.helper.form.confirmBackupFormDataModal.title') }}</h4>
                <p class="text-muted mx-4 mb-0 mb-2" style="white-space: nowrap">
                  {{ $t('layout.navbar.helper.form.confirmBackupFormDataModal.confirm.before') }}
                  <code class="text-primary fw-bold d-block">{{ current_form.title }}</code>
                  {{ $t('layout.navbar.helper.form.confirmBackupFormDataModal.confirm.after') }}
                </p>
                <input class="form-control" v-model="confirm" :placeholder="current_form.title" />
              </div>
            </div>

            <div class="d-flex gap-2 justify-content-center mt-4 mb-2">
              <button
                type="button"
                class="btn w-sm btn-light"
                data-bs-dismiss="modal"
                @click="
                  () => {
                    confirm = null;
                  }
                "
              >
                {{ $t('layout.navbar.helper.form.confirmBackupFormDataModal.cancel') }}
              </button>
              <button
                type="button"
                :disabled="confirm !== current_form.title"
                class="btn w-sm btn-danger"
                data-bs-dismiss="modal"
                @click="
                  () => {
                    confirm = null;
                    handleBackupFormData();
                  }
                "
              >
                {{ $t('layout.navbar.helper.form.confirmBackupFormDataModal.confirm') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="modal fade" id="confirmTruncateFormDataModal" data-bs-backdrop="static" data-bs-keyboard="false" data-bs-focus="false">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-body">
            <div class="mt-2 text-center">
              <div class="fs-15 mx-4 mx-sm-5">
                <h4>{{ $t('layout.navbar.helper.form.confirmTruncateFormDataModal.title') }}</h4>
                <p class="text-muted mx-4 mb-0 mb-2" style="white-space: nowrap">
                  {{ $t('layout.navbar.helper.form.confirmTruncateFormDataModal.confirm.before') }}
                  <code class="text-primary fw-bold d-block">{{ current_form.title }}</code>
                  {{ $t('layout.navbar.helper.form.confirmTruncateFormDataModal.confirm.after') }}
                </p>
                <input class="form-control" v-model="confirm" :placeholder="current_form.title" />
              </div>
            </div>

            <div class="d-flex gap-2 justify-content-center mt-4 mb-2">
              <button
                type="button"
                class="btn w-sm btn-light"
                data-bs-dismiss="modal"
                @click="
                  () => {
                    confirm = null;
                  }
                "
              >
                {{ $t('layout.navbar.helper.form.confirmTruncateFormDataModal.cancel') }}
              </button>
              <button
                type="button"
                :disabled="confirm !== current_form.title"
                class="btn w-sm btn-danger"
                data-bs-dismiss="modal"
                @click="
                  () => {
                    confirm = null;
                    handleTruncateFormData();
                  }
                "
              >
                {{ $t('layout.navbar.helper.form.confirmTruncateFormDataModal.confirm') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="modal fade" id="deletePubModal" data-bs-backdrop="static" data-bs-keyboard="false">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" id="hideDeletePubModalBtn" class="btn-close" data-bs-dismiss="modal" data-bs-toggle="modal" href="#viewAndEditPubModal"></button>
          </div>
          <div class="modal-body">
            <div class="mt-2 text-center">
              <div class="fs-15 mx-4 mx-sm-5">
                <h4>{{ $t('layout.navbar.helper.form.tab.pubForm.deletePubModal.title', { name: current_pub.title }) }}</h4>
                <p class="text-muted mx-4 mb-0">{{ $t('layout.navbar.helper.form.tab.pubForm.deletePubModal.confirm') }}</p>
              </div>
            </div>
            <div class="d-flex gap-2 justify-content-center mt-4 mb-2">
              <button type="button" class="btn w-sm btn-light" data-bs-dismiss="modal" data-bs-toggle="modal" href="#viewAndEditPubModal">
                {{ $t('layout.navbar.helper.form.tab.pubForm.deletePubModal.cancel') }}
              </button>
              <button type="button" class="btn w-sm btn-danger" @click="handleDelPubForm">{{ $t('layout.navbar.helper.form.tab.pubForm.deletePubModal.confirmed') }}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, ref, watch, nextTick } from 'vue';
import QRCode from 'qrcodejs2';
import store from '@store';
import i18n from '@utils/i18n';
import { getForms, createForm, updateForm, dropForm, backupForm, truncateForm } from '@api/form';
import { getPubs, createPub, updatePub } from '@api/pub';
import { getUserData } from '@api/user';
import { listToTree, deepCompare, useRouter, getUserInfo } from '@utils';
import { ElTree } from 'element-plus';
import 'element-plus/es/components/tree/style/css';
import { useToast } from 'vue-toastification';
import ToastificationContent from '@components/ToastificationContent';
import { icons } from '@utils/icons';
import CKEditor from '@components/CKEditor';
import Avatar from '@components/Avatar';
import UsersSelector from '@components/UsersSelector';
import MonacoEditor from '@components/MonacoEditor';
import FlatPickr from '@components/FlatPickr';
import { VueDraggableNext } from 'vue-draggable-next';
export default {
  components: {
    ElTree,
    CKEditor,
    Avatar,
    UsersSelector,
    MonacoEditor,
    FlatPickr,
    draggable: VueDraggableNext,
  },
  props: {
    columnsChanged: {
      type: Boolean,
      default: () => false,
    },
  },
  setup(props, { emit }) {
    const { router } = useRouter();
    const toast = useToast();
    const moment = window.moment;

    const forms = ref([]);
    const current_form = ref({});
    const current_tab = ref('basic_info');
    const delete_form = ref({});
    const default_expanded_keys = ref([]);
    const pubs = ref([]);
    const current_pub = ref({});

    const changes = ref({});

    watch(
      () => current_form.value,
      (newVal, oldVal) => {
        emit('setForm', current_form.value);
        if (newVal?.id && newVal.id !== oldVal?.id) {
          current_tab.value = 'basic_info';
          default_expanded_keys.value = [current_form.value.id, current_form.value.pid];
          if (!isParentOrHasRedirect(current_form.value)) fetchPubs(newVal.id);
        }
        const server_form = forms.value.find((form) => form.id === newVal.id);
        changes.value = deepCompare(newVal, server_form);
        delete changes.value.is_parent;
      },
      { immediate: true, deep: true },
    );

    const fetchForms = (id) => {
      getForms().then(({ code, data, msg }) => {
        if (code === 200) {
          forms.value = data;
          if (id || current_form.value.id) {
            current_form.value = {
              ...JSON.parse(JSON.stringify(forms.value.find((form) => form.id === (id || current_form.value.id)))),
              ...{ is_parent: forms.value.filter((form) => form.pid === (id || current_form.value.id)).length != 0 },
            };
            randerVsUsers();
          }
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

    const fetchPubs = (tid) => {
      getPubs({ tid }).then(({ code, data, msg }) => {
        if (code === 200) {
          pubs.value = data;
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
      fetchForms();
    });

    const tree = computed(() => {
      return listToTree(JSON.parse(JSON.stringify(forms.value)));
    });

    let timer = null;
    const focusInputEl = () => {
      setTimeout(() => {
        document.getElementById('node_edit').focus();
      }, 50);
    };

    const isModified = (items, notify = false) => {
      if (Object.keys(changes.value).length && items.includes('form')) {
        if (notify)
          toast({
            component: ToastificationContent,
            props: {
              variant: 'danger',
              icon: 'mdi-alert',
              text: i18n.global.t('layout.navbar.helper.form.modified'),
            },
          });
        return true;
      }
      if (props.columnsChanged && items.includes('columns')) {
        if (notify)
          toast({
            component: ToastificationContent,
            props: {
              variant: 'danger',
              icon: 'mdi-alert',
              text: i18n.global.t('layout.navbar.helper.form.column.modified'),
            },
          });
        return true;
      }
      return false;
    };

    const isParentOrHasRedirect = (form) => {
      return !!form.redirect || !!form.is_parent;
    };

    const handleSelectForm = (node) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        if (current_form.value.id !== node.id) {
          if (isModified(['form', 'columns'], true)) return;
          current_form.value = {
            ...JSON.parse(JSON.stringify(forms.value.find((form) => form.id === node.id))),
            ...{ is_parent: forms.value.filter((form) => form.pid === node.id).length != 0 },
          };
          randerVsUsers();
        }
      }, 200);
    };

    const handleAddForm = (node) => {
      if (isModified(['form', 'columns'], true)) return;
      if (node) {
        const child = { pid: node.data.id, title: '', title_old: '', edit: true };
        if (!node.data.children) node.data.children = [];
        node.data.children.push(child);
        node.expanded = true;
        focusInputEl();
      } else {
        createForm({ pid: 0 }).then(({ code, data, msg }) => {
          if (code === 200) {
            fetchForms(data.id);
            getUserData();
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

    const handleEditFormTitle = (node) => {
      clearTimeout(timer);
      if (isModified(['form'], true)) return;
      node.data.title_old = node.data.title;
      node.data.edit = true;
      focusInputEl();
    };

    const handleSaveFormTitle = (node) => {
      node.data.title = node.data.title.trim();
      if (!node.data.title) node.data.title = node.data.title_old;
      if (node.data.id) {
        if (node.data.title != node.data.title_old) {
          updateForm({
            id: node.data.id,
            title: node.data.title,
          }).then(({ code, msg }) => {
            if (code === 200) {
              fetchForms(node.data.id);
              getUserData();
              node.data.edit = false;
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
          node.data.edit = false;
        }
      } else {
        node.data.edit = false;
        createForm(node.data).then(({ code, data, msg }) => {
          if (code === 200) {
            fetchForms(data.id);
            getUserData();
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

    const handleDropForm = (draggingNode, dropNode, dropType) => {
      const updates = [];
      if (dropType == 'inner') {
        dropNode.childNodes.forEach((node, index) => {
          const update = { id: node.data.id, pid: dropNode.data.id, sort: index + 1 };
          const origin = forms.value.find((form) => form.id === update.id);
          if (update.pid != origin.pid || update.sort != origin.sort) updates.push(update);
        });
      } else if (dropNode.parent.level === 0) {
        dropNode.parent.childNodes.forEach((node, index) => {
          const update = { id: node.data.id, pid: 0, sort: index + 1 };
          const origin = forms.value.find((form) => form.id === update.id);
          if (update.pid != origin.pid || update.sort != origin.sort) updates.push(update);
        });
      } else {
        dropNode.parent.childNodes.forEach((node, index) => {
          const update = { id: node.data.id, pid: dropNode.parent.data.id, sort: index + 1 };
          const origin = forms.value.find((form) => form.id === update.id);
          if (update.pid != origin.pid || update.sort != origin.sort) updates.push(update);
        });
      }
      dropForm({ forms: updates }).then(({ code, msg }) => {
        if (code === 200) {
          fetchForms(draggingNode.data.id);
          getUserData();
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

    const handleConfirmDelForm = (node) => {
      delete_form.value = node.data;
      default_expanded_keys.value = [delete_form.value.id, delete_form.value.pid];
    };

    const handleDelForm = () => {
      updateForm({
        id: delete_form.value.id,
        data_state: 'deleted',
      }).then(({ code, msg }) => {
        if (code === 200) {
          fetchForms();
          getUserData();
          if (current_form.value.id === delete_form.value.id) current_form.value = {};
          delete_form.value = {};
          document.getElementById('hideDeleteFormModalBtn').click();
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

    const iconOptions = ref([]);
    const fetchIconOptions = (search, loading) => {
      iconOptions.value = [];
      if (search.length > 2) {
        loading(true);
        iconOptions.value = icons.filter((item) => item.name.includes(search));
        loading(false);
      }
    };

    const vs = ref({
      acl_view: [],
      acl_edit: [],
    });

    const users = JSON.parse(JSON.stringify(store.state.org.users)).map((user) => {
      return {
        value: user.username,
        label: user.fullname,
        dept: user.dept,
        avatar: user.avatar,
        gender: user.gender,
      };
    });
    const depts = JSON.parse(JSON.stringify(store.state.org.depts))
      .map((dept) => {
        return {
          value: dept.id,
          label: dept.name,
          users: users
            .filter((user) => user.dept === dept.id)
            .map((user) => {
              return {
                username: user.value,
                fullname: user.label,
              };
            }),
        };
      })
      .filter((dept) => dept.users.length != 0);

    const options4acl_view = ref([...depts, ...users]);
    const options4acl_edit = ref([...depts, ...users]);

    const handleSelectValue = (field) => {
      current_form.value[field] = [];
      if (vs.value[field].includes(0)) {
        vs.value[field] = [0];
        current_form.value[field] = users.map((user) => {
          return user.value;
        });
      } else {
        vs.value[field].forEach((value) => {
          if (typeof value === 'number') {
            const dept = depts.find((dept) => dept.value === value);
            current_form.value[field] = [
              ...current_form.value[field],
              ...dept.users.map((user) => {
                return user.username;
              }),
            ];
            vs.value[field] = vs.value[field].filter(
              (item) =>
                !dept.users
                  .map((user) => {
                    return user.username;
                  })
                  .includes(item),
            );
          } else {
            current_form.value[field].push(value);
          }
        });
        depts
          .filter((dept) => !vs.value[field].includes(dept.value))
          .forEach((dept) => {
            if (
              dept.users
                .map((user) => {
                  return user.username;
                })
                .every((username) => vs.value[field].includes(username))
            ) {
              vs.value[field].push(dept.value);
              vs.value[field] = vs.value[field].filter(
                (item) =>
                  !dept.users
                    .map((user) => {
                      return user.username;
                    })
                    .includes(item),
              );
            }
          });
      }
    };

    const randerVsUsers = () => {
      ['acl_view', 'acl_edit'].forEach((field) => {
        vs.value[field] = JSON.parse(JSON.stringify(current_form.value[field] || []));
        if (current_form.value[field] && current_form.value[field].length === 0) vs.value[field] = [];
        else if (current_form.value[field] && current_form.value[field].length === users.length) vs.value[field] = [0];
        else {
          JSON.parse(JSON.stringify(depts))
            .reverse()
            .forEach((dept) => {
              if (
                dept.users
                  .map((user) => {
                    return user.username;
                  })
                  .every((username) => vs.value[field].includes(username))
              ) {
                vs.value[field].unshift(dept.value);
                vs.value[field] = vs.value[field].filter(
                  (item) =>
                    !dept.users
                      .map((user) => {
                        return user.username;
                      })
                      .includes(item),
                );
              }
            });
        }
      });
    };

    const resolveFlowUsers = computed(() => {
      return ({ users }) => {
        let _users = [];
        users.forEach((user) => {
          _users.push([...[store.state.org.leader], ...store.state.org.users].find((item) => item.username === user));
        });
        return _users.length === 1 ? _users[0] : _users;
      };
    });

    const handleSaveFormInfo = () => {
      const flow_error = changes.value.flow ? changes.value.flow.find((item) => !item.title || item.users.length === 0) : null;
      if (flow_error) {
        toast({
          component: ToastificationContent,
          props: {
            variant: 'danger',
            icon: 'mdi-alert',
            text: i18n.global.t('layout.navbar.helper.form.tab.approvalFlow.error'),
          },
        });
        return;
      }
      changes.value.id = current_form.value.id;
      updateForm(changes.value).then(({ code, msg }) => {
        if (code === 200) {
          fetchForms();
          getUserData();
          toast({
            component: ToastificationContent,
            props: {
              variant: 'success',
              icon: 'mdi-check-circle',
              text: msg,
            },
          });
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

    const handleRestoreFormInfo = () => {
      current_form.value = {
        ...JSON.parse(JSON.stringify(forms.value.find((form) => form.id === current_form.value.id))),
        ...{ is_parent: forms.value.filter((form) => form.pid === current_form.value.id).length != 0 },
      };
    };

    const confirm = ref(null);
    const handleBackupFormData = () => {
      backupForm({ id: current_form.value.id }).then(({ code, data: { tname }, msg }) => {
        if (code === 200) {
          toast({
            component: ToastificationContent,
            props: {
              variant: 'success',
              icon: 'mdi-check-circle',
              text: tname,
            },
          });
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

    const handleTruncateFormData = () => {
      truncateForm({ id: current_form.value.id }).then(({ code, data: { tname }, msg }) => {
        if (code === 200) {
          toast({
            component: ToastificationContent,
            props: {
              variant: 'success',
              icon: 'mdi-check-circle',
              text: tname,
            },
          });
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

    const qrCodeKey = ref(null);
    const handleCreatePubForm = () => {
      current_pub.value = { tid: current_form.value.id, status: 1 };
      document.getElementById('showViewAndEditPubModalBtn').click();
      qrCodeKey.value = null;
    };

    const handleChangeDuration = (e) => {
      if (e.target.value) {
        if (e.target.value.split(' ').length === 3) {
          current_pub.value.start = e.target.value.split(' ')[0];
          current_pub.value.end = e.target.value.split(' ')[2];
        } else {
          current_pub.value.start = current_pub.value.end = e.target.value;
        }
      }
    };

    const handleSubmitPubForm = () => {
      const data = JSON.parse(JSON.stringify(current_pub.value));
      delete data.duration;
      if (data.id) {
        const changes = deepCompare(
          data,
          pubs.value.find((pub) => pub.id === data.id),
        );
        if (Object.keys(changes).length) {
          changes.id = data.id;
          updatePub(changes).then(({ code, msg }) => {
            if (code === 200) {
              fetchPubs(current_form.value.id);
              document.getElementById('hideViewAndEditPubModalBtn').click();
              current_pub.value = {};
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
      } else {
        createPub(data).then(({ code, msg }) => {
          if (code === 200) {
            fetchPubs(current_form.value.id);
            document.getElementById('hideViewAndEditPubModalBtn').click();
            current_pub.value = {};
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

    const handleEditPubForm = (item) => {
      current_pub.value = JSON.parse(JSON.stringify(item));
      current_pub.value.duration = [moment(item.start).format('YYYY-MM-DD'), moment(item.end).format('YYYY-MM-DD')];
      document.getElementById('showViewAndEditPubModalBtn').click();
      qrCodeKey.value = Math.random().toString(36).slice(-6);
      nextTick(() => {
        new QRCode(document.getElementById('qrcode'), {
          text: `${location.origin}/form/${current_pub.value.uuid}`,
          width: 100,
          height: 100,
          colorDark: '#000000',
          colorLight: '#ffffff',
          correctLevel: 3,
        });
      });
    };

    const handleDbclickQrcode = (uuid) => {
      const route = router.resolve({ name: 'pubForm', params: { uuid } });
      window.open(route.href, '_blank');
    };

    const handleDelPubForm = () => {
      updatePub({
        id: current_pub.value.id,
        data_state: 'deleted',
      }).then(({ code, msg }) => {
        if (code === 200) {
          fetchPubs(current_form.value.id);
          document.getElementById('hideDeletePubModalBtn').click();
          current_pub.value = {};
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

    return {
      getUserInfo,

      tree,
      current_form,
      current_tab,
      delete_form,
      default_expanded_keys,
      pubs,
      current_pub,

      changes,
      isModified,
      isParentOrHasRedirect,

      handleSelectForm,
      handleAddForm,
      handleEditFormTitle,
      handleSaveFormTitle,
      handleDropForm,
      handleConfirmDelForm,
      handleDelForm,

      iconOptions,
      fetchIconOptions,
      vs,
      options4acl_view,
      options4acl_edit,
      handleSelectValue,
      resolveFlowUsers,
      handleSaveFormInfo,
      handleRestoreFormInfo,

      confirm,
      handleBackupFormData,
      handleTruncateFormData,

      handleCreatePubForm,
      handleChangeDuration,
      handleSubmitPubForm,
      qrCodeKey,
      handleEditPubForm,
      handleDbclickQrcode,
      handleDelPubForm,
    };
  },
};
</script>
