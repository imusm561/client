<template>
  <div class="email-wrapper d-lg-flex gap-1 mx-n4 mt-n4 p-1" @click="handleClickMailWrapper">
    <div class="email-menu-sidebar" id="menusidebar">
      <div class="p-4 d-flex flex-column h-100">
        <div class="pb-3 border-bottom border-bottom-dashed">
          <button type="button" class="btn btn-danger w-100" id="showComposeModalBtn" data-bs-toggle="modal" data-bs-target="#composeModal" @click="handleComposeMail">
            <i class="mdi mdi-email-plus-outline me-1"></i>
            {{ $t('app.mail.compose') }}
          </button>
        </div>

        <div class="mx-n4 px-4 email-menu-sidebar-scroll">
          <div class="mail-list mt-3">
            <a v-for="(menu, index) in menus" :key="index" class="cursor-pointer" :class="{ active: current_menu === menu.value }" @click="changemenu(menu.value)">
              <i :class="`mdi ${menu.icon} me-3 align-middle fw-medium`"></i>
              <span class="mail-list-link">{{ menu.title }}</span>
              <span v-if="menu.count !== 0" class="badge badge-soft-success ms-auto">{{ menu.count }}</span>
            </a>
          </div>

          <div>
            <h5 class="fs-12 text-uppercase text-muted mt-4">{{ $t('app.mail.label') }}</h5>
            <div class="mail-list mt-1">
              <a v-for="label in labels" :key="label.value" class="cursor-pointer" @click="changelabel(label.value)">
                <span class="mdi mdi-circle-outline me-2 text-info"></span>
                {{ label.title }}
                <span v-if="label.count !== 0" class="badge badge-soft-success ms-auto">{{ label.count }}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="email-content">
      <div class="p-4 pb-0">
        <div class="border-bottom border-bottom-dashed">
          <div class="row mt-n2 mb-3 mb-sm-0">
            <div class="col col-sm-auto order-1 d-block d-lg-none">
              <button type="button" class="btn btn-soft-success btn-icon btn-sm fs-16" @click.stop="handleClickMenuBtn">
                <i class="mdi mdi-menu align-bottom"></i>
              </button>
            </div>
            <div class="col-sm order-3 order-sm-2">
              <div class="hstack gap-sm-1 align-items-center flex-wrap email-topbar-link">
                <div class="form-check fs-14 m-0">
                  <input class="form-check-input" type="checkbox" id="checkall" :disabled="mails.length === 0" @change="handleCheckAllMail" />
                  <label class="form-check-label" for="flexCheck18"></label>
                </div>
                <button type="button" class="btn btn-ghost-secondary btn-icon btn-sm fs-16" @click="fetchMails()">
                  <i class="mdi mdi-refresh align-bottom"></i>
                </button>
                <div v-if="checkedMailIds.length">
                  <button type="button" class="btn btn-ghost-secondary btn-icon btn-sm fs-16 trash-btn" :class="{ active: current_menu === 'trash' }" @click="handleTrashMails()">
                    <i class="mdi mdi-trash-can align-bottom"></i>
                  </button>
                  <button v-if="current_menu === 'trash'" type="button" class="btn btn-ghost-secondary btn-icon btn-sm fs-16" data-bs-toggle="modal" data-bs-target="#deleteMailConfirmModal">
                    <i class="mdi mdi-delete-forever text-danger align-bottom"></i>
                  </button>
                </div>
              </div>
            </div>
            <div class="col-auto order-2 order-sm-3" v-if="checkedMailIds.length">
              <div class="d-flex gap-sm-1 email-topbar-link">
                <div class="dropdown">
                  <button class="btn btn-ghost-secondary btn-icon btn-sm fs-16" type="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    <i class="mdi mdi-dots-vertical align-bottom"></i>
                  </button>
                  <div class="dropdown-menu dropdown-menu-end">
                    <a class="dropdown-item cursor-pointer" @click="handleMarkMails('important')">{{ $t('app.mail.detail.markAsImportant') }}</a>
                    <a class="dropdown-item cursor-pointer" @click="handleMarkMails('star')">{{ $t('app.mail.detail.addStar') }}</a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="row align-items-center mt-3">
            <div class="col">
              <ul class="nav nav-tabs nav-tabs-custom nav-success gap-1 text-center border-bottom-0" style="width: 100vw">
                <li class="nav-item tabtype">
                  <a class="nav-link fw-semibold cursor-pointer" :class="{ active: current_label == 'all' }" id="all_tab" @click="changetab('all')">
                    <i class="mdi mdi-format-list-bulleted align-bottom d-inline-block"></i>
                    <span class="ms-1 d-none d-sm-inline-block">{{ $t('app.mail.label.all') }}</span>
                  </a>
                </li>
                <li v-for="label in labels" :key="label.value" class="nav-item tabtype">
                  <a class="nav-link fw-semibold cursor-pointer" :class="{ active: current_label == label.value }" :id="`${label.value}_tab`" @click="changetab(label.value)">
                    <i :class="`mdi ${label.icon} align-bottom d-inline-block`"></i>
                    <span class="ms-1 d-none d-sm-inline-block">{{ label.title }}</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="message-list-content mx-n4 px-4 message-list-scroll p-2" data-simplebar>
          <ul id="messageList" class="message-list mb-0">
            <div v-for="mail in mails" :key="mail.id">
              <li :class="{ unread: !mail.read.includes($store.state.user.data.username) && mail.created_by != $store.state.user.data.username, active: checkedMailIds.includes(mail.id) }">
                <div>
                  <div class="col-mail col-mail-1">
                    <div class="form-check checkbox-wrapper-mail fs-14">
                      <input class="form-check-input" type="checkbox" :checked="checkedMailIds.includes(mail.id)" @change="handleCheckMail(mail)" />
                      <label class="form-check-label"></label>
                    </div>

                    <button
                      type="button"
                      class="btn avatar-xs p-0 favourite-btn fs-15"
                      :class="{ active: mail.star.includes($store.state.user.data.username) }"
                      @click="handleMarkOrUnmarkMail(mail, 'star')"
                    >
                      <i class="mdi mdi-star"></i>
                    </button>
                    <i v-if="mail.attachments.length" class="mdi mdi-attachment text-primary fs-15 me-2"></i>
                    <a class="cursor-pointer title-name" @click="handleOpenMail(mail)">{{ mail.sender.fullname }}</a>
                  </div>
                  <div class="col-mail col-mail-2" @click="handleOpenMail(mail)">
                    <a class="cursor-pointer subject">
                      <span class="subject-title">{{ mail.subject }}</span>
                      -
                      <span class="teaser">{{ replaceHtml(mail.content) }}</span>
                    </a>
                    <div class="date text-truncate">{{ $moment(mail.created_at).fromNow() }}</div>
                  </div>
                </div>
              </li>
            </div>
            <!-- <li class="bg-transparent text-center">
                <button type="button" class="btn btn-soft-info btn-rounded btn-sm px-2">
                  <i class="mdi mdi-spin mdi-loading me-2"></i>
                  Loading...
                </button>
              </li> -->
          </ul>
        </div>
      </div>
    </div>

    <div class="email-detail-content">
      <div class="p-4 d-flex flex-column h-100" v-if="current_mail.id">
        <div class="pb-4 border-bottom border-bottom-dashed">
          <div class="row">
            <div class="col">
              <button type="button" class="btn btn-soft-danger btn-icon btn-sm fs-16" @click="handleCloseMail">
                <i class="mdi mdi-close align-bottom"></i>
              </button>
            </div>
            <div class="col-auto">
              <div class="hstack gap-sm-1 align-items-center flex-wrap email-topbar-link">
                <button v-if="current_mail.created_by != $store.state.user.data.username" class="btn btn-ghost-primary btn-icon btn-sm fs-16" @click="handleReply(current_mail)">
                  <i class="mdi mdi-reply align-bottom"></i>
                </button>
                <button v-if="current_mail.created_by != $store.state.user.data.username" class="btn btn-ghost-danger btn-icon btn-sm fs-16" @click="handleReply2All(current_mail)">
                  <i class="mdi mdi-reply-all align-bottom"></i>
                </button>
                <i v-if="current_mail.attachments.length.length" class="mdi mdi-attachment text-primary fs-15 me-2"></i>
                <button
                  type="button"
                  class="btn btn-ghost-secondary btn-icon btn-sm fs-16 favourite-btn"
                  :class="{ active: current_mail.star.includes($store.state.user.data.username) }"
                  @click="handleMarkOrUnmarkMail(current_mail, 'star')"
                >
                  <i class="mdi mdi-star align-bottom"></i>
                </button>
                <button
                  class="btn btn-ghost-secondary btn-icon btn-sm fs-16 trash-btn"
                  :class="{ active: current_mail.trash.includes($store.state.user.data.username) }"
                  @click="handleMarkOrUnmarkMail(current_mail, 'trash')"
                >
                  <i class="mdi mdi-trash-can align-bottom"></i>
                </button>
                <button class="btn btn-ghost-secondary btn-icon btn-sm fs-16 trash-btn" data-bs-toggle="modal" data-bs-target="#fullscreenMailContentModal">
                  <i class="mdi mdi-fullscreen align-bottom"></i>
                </button>
                <div class="dropdown">
                  <button class="btn btn-ghost-secondary btn-icon btn-sm fs-16" type="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    <i class="mdi mdi-dots-vertical align-bottom"></i>
                  </button>
                  <div class="dropdown-menu dropdown-menu-end">
                    <a class="dropdown-item cursor-pointer" @click="handleMarkOrUnmarkMail(current_mail, 'important')">
                      {{ current_mail.important.includes($store.state.user.data.username) ? $t('app.mail.detail.unmarkImportant') : $t('app.mail.detail.markAsImportant') }}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="mx-n4 px-4 email-detail-content-scroll" data-simplebar>
          <div class="mt-4 mb-3">
            <h5 class="fw-bold email-subject-title text-truncate">{{ current_mail.subject }}</h5>
          </div>

          <div class="d-flex align-items-center text-muted">
            <Avatar class="me-3" :data="current_mail.sender" />
            <div class="flex-grow-1 overflow-hidden">
              <h5 class="fs-14 text-truncate mb-0">{{ current_mail.sender.fullname }}</h5>
              <div
                id="to_list"
                :class="`fs-12 ${showMoreUsers ? '' : 'text-truncate'}`"
                :title="
                  resolveUsers(vs.to)
                    .map((item) => {
                      return item.label;
                    })
                    .join(',')
                "
              >
                {{ $t('app.mail.detail.to') }}:
                <span style="word-break: break-all" v-for="(item, index) in resolveUsers(vs.to)" :key="index" :title="item.title">
                  {{ item.label }}{{ index === resolveUsers(vs.to).length - 1 ? '' : ', ' }}
                </span>
              </div>
              <div
                id="cc_list"
                class="accordion-collapse collapse fs-12"
                :title="
                  resolveUsers(vs.cc)
                    .map((item) => {
                      return item.label;
                    })
                    .join(',')
                "
              >
                <span v-if="vs.cc.length">
                  {{ $t('app.mail.detail.cc') }}:
                  <span style="word-break: break-all" v-for="(item, index) in resolveUsers(vs.cc)" :key="index" :title="item.title">
                    {{ item.label }}{{ index === resolveUsers(vs.cc).length - 1 ? '' : ', ' }}
                  </span>
                </span>
              </div>
            </div>
            <div class="flex-shrink-0 align-self-start">
              <div class="text-muted fs-12">{{ $moment(current_mail.created_at).fromNow() }}</div>
              <a role="button" class="w-100 text-primary float-end text-end collapsed" data-bs-toggle="collapse" href="#cc_list">
                <i :class="`mdi mdi-chevron-double-${showMoreUsers ? 'up' : 'down'}`" />
              </a>
            </div>
          </div>

          <div class="text-body mt-3 text-break">
            <div class="ck ck-content" v-html="current_mail.content"></div>
          </div>
          <div v-if="current_mail.attachments.length">
            <hr class="mt-3" />
            <label class="form-label mb-0">{{ $t('app.mail.detail.attachments') }}:</label>
            <Uploader v-model="current_mail.attachments" readonly />
          </div>
        </div>
      </div>
    </div>

    <div class="modal fade" id="composeModal" data-bs-backdrop="static" data-bs-keyboard="false" data-bs-focus="false">
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header p-2 bg-light">
            <h5 class="modal-title">{{ $t('app.mail.composeModal.newMail') }}</h5>
            <button type="button" class="btn-close d-none" id="hideComposeModalBtn" data-bs-dismiss="modal"></button>
          </div>
          <Form v-slot="{ errors }" @submit="handleSubmitMail">
            <div class="modal-body p-0">
              <div data-simplebar class="p-3" style="max-height: 80vh; overflow-x: hidden">
                <div class="row g-3">
                  <div class="col-12">
                    <label class="d-flex justify-content-between">
                      <span>{{ $t('app.mail.composeModal.form.to') }}:</span>
                      <div class="d-flex">
                        <b class="cursor-pointer ms-2 text-decoration-underline" data-bs-toggle="collapse" data-bs-target="#CcRecipientsCollapse">{{ $t('app.mail.composeModal.form.cc') }}</b>
                        <b class="cursor-pointer ms-2 text-decoration-underline" data-bs-toggle="collapse" data-bs-target="#BccRecipientsCollapse">{{ $t('app.mail.composeModal.form.bcc') }}</b>
                      </div>
                    </label>
                    <VueSelect
                      v-model="vs.to"
                      multiple
                      :close-on-select="false"
                      :placeholder="$t('app.mail.composeModal.form.to')"
                      :class="errors.to && 'is-invalid'"
                      :reduce="(item) => item.value"
                      label="label"
                      :options="options4to"
                      :selectable="
                        (option) =>
                          vs.to.includes(0)
                            ? option.value === 0
                            : option.users
                            ? option.users
                                .map((user) => {
                                  return user.username;
                                })
                                .filter((v) => [...new_mail.cc, ...new_mail.bcc].includes(v)).length === 0
                            : !(
                                (!vs.to.includes(option.value) && new_mail.to.includes(option.value)) ||
                                vs.cc.includes(option.value) ||
                                new_mail.cc.includes(option.value) ||
                                vs.bcc.includes(option.value) ||
                                new_mail.bcc.includes(option.value)
                              )
                      "
                      @option:selected="handleSelectValue('to')"
                      @option:deselected="handleSelectValue('to')"
                    >
                      <template #option="data">
                        <div class="d-flex align-items-center">
                          <Avatar class="me-2" :data="data" size="xxs" key-username="value" key-fullname="label" />
                          <span class="ml-50 align-middle">{{ data.label }}</span>
                        </div>
                      </template>

                      <template #selected-option="data">
                        <div class="d-flex align-items-center">
                          <Avatar class="me-2" :data="data" size="xxs" key-username="value" key-fullname="label" />
                          <span class="ml-50 align-middle">{{ data.label }}</span>
                        </div>
                      </template>

                      <template v-slot:no-options="{ search, searching }">
                        <template v-if="searching">
                          <span v-html="$t('components.vs.search', { search })"></span>
                        </template>
                        <em v-else style="opacity: 0.5">{{ $t('components.vs.searchUser') }}</em>
                      </template>
                    </VueSelect>
                    <Field name="to" v-model="new_mail.to" rules="required" class="d-none" />
                    <span class="invalid-feedback">{{ errors.to }}</span>
                  </div>
                  <div class="collapse" id="CcRecipientsCollapse">
                    <div class="col-12">
                      <label>{{ $t('app.mail.composeModal.form.cc') }}:</label>
                      <VueSelect
                        v-model="vs.cc"
                        multiple
                        :close-on-select="false"
                        :placeholder="$t('app.mail.composeModal.form.cc')"
                        :reduce="(item) => item.value"
                        label="label"
                        :options="options4cc"
                        :disabled="vs.to.includes(0)"
                        :selectable="
                          (option) =>
                            option.users
                              ? option.users
                                  .map((user) => {
                                    return user.username;
                                  })
                                  .filter((v) => [...new_mail.to, ...new_mail.bcc].includes(v)).length === 0
                              : !(
                                  (!vs.cc.includes(option.value) && new_mail.cc.includes(option.value)) ||
                                  vs.to.includes(option.value) ||
                                  new_mail.to.includes(option.value) ||
                                  vs.bcc.includes(option.value) ||
                                  new_mail.bcc.includes(option.value)
                                )
                        "
                        @option:selected="handleSelectValue('cc')"
                        @option:deselected="handleSelectValue('cc')"
                      >
                        <template #option="data">
                          <div class="d-flex align-items-center">
                            <Avatar class="me-2" :data="data" size="xxs" key-username="value" key-fullname="label" />
                            <span class="ml-50 align-middle">{{ data.label }}</span>
                          </div>
                        </template>

                        <template #selected-option="data">
                          <div class="d-flex align-items-center">
                            <Avatar class="me-2" :data="data" size="xxs" key-username="value" key-fullname="label" />
                            <span class="ml-50 align-middle">{{ data.label }}</span>
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
                  <div class="collapse" id="BccRecipientsCollapse">
                    <div class="col-12">
                      <label>{{ $t('app.mail.composeModal.form.bcc') }}:</label>
                      <VueSelect
                        v-model="vs.bcc"
                        multiple
                        :close-on-select="false"
                        :placeholder="$t('app.mail.composeModal.form.bcc')"
                        :reduce="(item) => item.value"
                        label="label"
                        :options="options4bcc"
                        :disabled="vs.to.includes(0)"
                        :selectable="
                          (option) =>
                            option.users
                              ? option.users
                                  .map((user) => {
                                    return user.username;
                                  })
                                  .filter((v) => [...new_mail.to, ...new_mail.cc].includes(v)).length === 0
                              : !(
                                  (!vs.bcc.includes(option.value) && new_mail.bcc.includes(option.value)) ||
                                  vs.to.includes(option.value) ||
                                  new_mail.to.includes(option.value) ||
                                  vs.cc.includes(option.value) ||
                                  new_mail.cc.includes(option.value)
                                )
                        "
                        @option:selected="handleSelectValue('bcc')"
                        @option:deselected="handleSelectValue('bcc')"
                      >
                        <template #option="data">
                          <div class="d-flex align-items-center">
                            <Avatar class="me-2" :data="data" size="xxs" key-username="value" key-fullname="label" />
                            <span class="ml-50 align-middle">{{ data.label }}</span>
                          </div>
                        </template>

                        <template #selected-option="data">
                          <div class="d-flex align-items-center">
                            <Avatar class="me-2" :data="data" size="xxs" key-username="value" key-fullname="label" />
                            <span class="ml-50 align-middle">{{ data.label }}</span>
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
                  <div class="col-12">
                    <label>{{ $t('app.mail.composeModal.form.subject') }}:</label>
                    <Field
                      name="subject"
                      v-model="new_mail.subject"
                      type="text"
                      :placeholder="$t('app.mail.composeModal.form.subject')"
                      :class="['form-control', errors.subject && 'is-invalid']"
                      rules="required"
                    />
                    <span class="invalid-feedback">{{ errors.subject }}</span>
                  </div>
                  <div class="col-12">
                    <label class="form-label">{{ $t('app.mail.composeModal.form.label') }}</label>
                    <VueSelect
                      v-model="new_mail.label"
                      :placeholder="$t('app.mail.composeModal.form.label')"
                      :class="errors.label && 'is-invalid'"
                      :reduce="(item) => item.value"
                      label="title"
                      multiple
                      :close-on-select="false"
                      :options="labels"
                    >
                      <template v-slot:no-options="{ search, searching }">
                        <template v-if="searching">
                          <span v-html="$t('components.vs.search', { search })"></span>
                        </template>
                        <em v-else style="opacity: 0.5">{{ $t('components.vs.searchLabel') }}</em>
                      </template>
                    </VueSelect>
                    <Field name="label" v-model="new_mail.label" rules="required" class="d-none" />
                    <span class="invalid-feedback">{{ errors.label }}</span>
                  </div>
                  <div class="col-12">
                    <label>{{ $t('app.mail.composeModal.form.content') }}:</label>
                    <CKEditor v-model="new_mail.content" id="ck_mail_content" :error="{ id: 'ck_mail_content', error: errors.content }" :class="errors.content && 'is-invalid'" />
                    <Field name="content" v-model="new_mail.content" rules="required" class="d-none" />
                    <span class="invalid-feedback">{{ errors.content }}</span>
                  </div>
                  <div class="col-12">
                    <Uploader :key="new_mail.key" v-model="new_mail.attachments" accept="*" :multiple="true" :placeholder="$t('app.mail.composeModal.form.attachments')" />
                  </div>
                </div>
              </div>
            </div>
            <div class="modal-footer p-3 pt-1 pb-1">
              <button type="button" class="btn btn-sm btn-danger" @click="showCancelConfirmModal">
                <i class="mdi mdi-email-remove-outline"></i>
                {{ $t('app.mail.composeModal.form.footer.cancel') }}
              </button>
              <button type="submit" class="btn btn-sm btn-success" :disabled="Object.keys(errors).length">
                <i class="mdi mdi-email-send-outline"></i>
                {{ $t('app.mail.composeModal.form.footer.send') }}
              </button>
            </div>
          </Form>
        </div>
      </div>
    </div>
    <button type="button" class="d-none" id="showReply2AllConfirmModalBtn" data-bs-toggle="modal" data-bs-target="#reply2AllConfirmModal"></button>
    <div id="reply2AllConfirmModal" class="modal fade zoomIn">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="mt-2 text-center">
              <div class="fs-15 mx-4 mx-sm-5">
                <h4>{{ $t('app.mail.reply2AllConfirmModal.title') }}</h4>
                <p class="text-muted mx-4 mb-0">{{ $t('app.mail.reply2AllConfirmModal.confirm') }}</p>
              </div>
            </div>
            <div class="d-flex gap-2 justify-content-center mt-4 mb-2">
              <button type="button" class="btn w-sm btn-primary" @click="handleReply(current_mail)">{{ $t('app.mail.reply2AllConfirmModal.replyToSender') }}</button>
              <button type="button" class="btn w-sm btn-danger" @click="handleReply2All(current_mail, true)">{{ $t('app.mail.reply2AllConfirmModal.replyToAll') }}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <button type="button" class="d-none" id="showCancelConfirmModalBtn" data-bs-toggle="modal" data-bs-target="#cancelConfirmModal"></button>
    <div id="cancelConfirmModal" class="modal fade zoomIn">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="btn-close" data-bs-target="#composeModal" data-bs-toggle="modal" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="mt-2 text-center">
              <div class="fs-15 mx-4 mx-sm-5">
                <h4>{{ $t('app.mail.cancelConfirmModal.title') }}</h4>
                <p class="text-muted mx-4 mb-0">{{ $t('app.mail.cancelConfirmModal.confirm') }}</p>
              </div>
            </div>
            <div class="d-flex gap-2 justify-content-center mt-4 mb-2">
              <button type="button" class="btn w-sm btn-primary" data-bs-dismiss="modal" @click="handleCancelCompose(false)">{{ $t('app.mail.cancelConfirmModal.staged') }}</button>
              <button type="button" class="btn w-sm btn-danger" data-bs-dismiss="modal" @click="handleCancelCompose()">{{ $t('app.mail.cancelConfirmModal.discard') }}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <button type="button" class="d-none" id="showDeleteMailConfirmModalBtn" data-bs-toggle="modal" data-bs-target="#deleteMailConfirmModal"></button>
    <div id="deleteMailConfirmModal" class="modal fade zoomIn">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="mt-2 text-center">
              <div class="fs-15 mx-4 mx-sm-5">
                <h4>{{ $tc('app.mail.deleteMailConfirmModal.title', checkedMailIds.length) }}</h4>
                <p class="text-muted mx-4 mb-0">{{ $tc('app.mail.deleteMailConfirmModal.confirm', checkedMailIds.length) }}</p>
              </div>
            </div>
            <div class="d-flex gap-2 justify-content-center mt-4 mb-2">
              <button type="button" class="btn w-sm btn-light" data-bs-dismiss="modal">{{ $t('app.mail.deleteMailConfirmModal.cancel') }}</button>
              <button type="button" class="btn w-sm btn-danger" data-bs-dismiss="modal" @click="handleTrashMails(true)">{{ $t('app.mail.deleteMailConfirmModal.confirmed') }}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="modal fade" id="fullscreenMailContentModal">
      <div class="modal-dialog modal-fullscreen">
        <div class="modal-content">
          <div class="modal-header p-2 bg-light">
            <h5 class="modal-title text-truncate">{{ current_mail.subject }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body text-break" data-simplebar style="height: calc(100vh - 57px)">
            <div class="ck ck-content" v-html="current_mail.content"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import { replaceHtml, useRouter, getUserInfo, encryptData, decryptData } from '@utils';
import store from '@store';
import CKEditor from '@components/CKEditor';
import Uploader from '@components/Uploader';
import { getMails, createMail, updateMail } from '@api/app/mail';
import { useToast } from 'vue-toastification';
import ToastificationContent from '@components/ToastificationContent';
import Avatar from '@components/Avatar';
import i18n from '@utils/i18n';
export default {
  components: {
    CKEditor,
    Uploader,
    Avatar,
  },
  setup() {
    const toast = useToast();
    const { route } = useRouter();
    const socket = window.socket;
    const moment = window.moment;

    const new_mail = ref({
      key: Math.random().toString(36).slice(-6),
      to: [],
      cc: [],
      bcc: [],
      subject: '',
      content: '',
      attachments: [],
      label: [],
      trash: [],
      star: [],
      important: [],
      read: [],
    });

    const all = [{ value: 0, label: i18n.global.t('app.mail.composeModal.userAll'), title: i18n.global.t('app.mail.composeModal.userAll') }];
    const users = JSON.parse(JSON.stringify(store.state.org.users))
      .filter((user) => user.username != store.state.user.data.username)
      .map((user) => {
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
            .filter((user) => user.username != store.state.user.data.username && user.dept === dept.id)
            .map((user) => {
              return {
                username: user.value,
                fullname: user.label,
              };
            }),
        };
      })
      .filter((dept) => dept.users.length != 0);

    const options4to = ref([...(users.length ? all : []), ...depts, ...users]);
    const options4cc = ref([...depts, ...users]);
    const options4bcc = ref([...depts, ...users]);

    const vs = ref({
      to: [],
      cc: [],
      bcc: [],
    });

    const handleSelectValue = (field) => {
      new_mail.value[field] = [];
      if (vs.value.to.includes(0)) {
        vs.value.to = [0];
        new_mail.value.to = users.map((user) => {
          return user.value;
        });
        new_mail.value.cc = [];
        vs.value.cc = [];
        new_mail.value.bcc = [];
        vs.value.bcc = [];
      } else {
        vs.value[field].forEach((value) => {
          if (typeof value === 'number') {
            const dept = depts.find((dept) => dept.value === value);
            new_mail.value[field] = [
              ...new_mail.value[field],
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
            new_mail.value[field].push(value);
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
        if (field === 'to' && depts.every((dept) => vs.value[field].includes(dept.value))) vs.value.to = [0];
      }
    };

    const randerVsUsers = (mail) => {
      ['to', 'cc', 'bcc'].forEach((field) => {
        vs.value[field] = JSON.parse(JSON.stringify(mail[field] || []));
        if (mail[field] && mail[field].length === 0) vs.value[field] = [];
        else if (mail[field] && mail[field].length === users.length) vs.value[field] = [0];
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

    const menus = computed(() => {
      return [
        {
          title: i18n.global.t('app.mail.menu.all'),
          value: 'all',
          icon: 'mdi-email-multiple',
          count: _mails.value.filter((mail) => !mail.trash.includes(store.state.user.data.username)).length,
        },
        {
          title: i18n.global.t('app.mail.menu.inbox'),
          value: 'inbox',
          icon: 'mdi-email-receive',
          count: _mails.value.filter((mail) => !mail.trash.includes(store.state.user.data.username) && mail.created_by != store.state.user.data.username).length,
        },
        {
          title: i18n.global.t('app.mail.menu.sent'),
          value: 'sent',
          icon: 'mdi-email-send',
          count: _mails.value.filter((mail) => !mail.trash.includes(store.state.user.data.username) && mail.created_by === store.state.user.data.username).length,
        },
        {
          title: i18n.global.t('app.mail.menu.trash'),
          value: 'trash',
          icon: 'mdi-trash-can',
          count: _mails.value.filter((mail) => mail.trash.includes(store.state.user.data.username)).length,
        },
        {
          title: i18n.global.t('app.mail.menu.star'),
          value: 'star',
          icon: 'mdi-star',
          count: _mails.value.filter((mail) => !mail.trash.includes(store.state.user.data.username) && mail.star.includes(store.state.user.data.username)).length,
        },
        {
          title: i18n.global.t('app.mail.menu.important'),
          value: 'important',
          icon: 'mdi-label',
          count: _mails.value.filter((mail) => !mail.trash.includes(store.state.user.data.username) && mail.important.includes(store.state.user.data.username)).length,
        },
      ];
    });

    const labels = computed(() => {
      return [
        {
          title: i18n.global.t('app.mail.label.personal'),
          value: 'personal',
          variant: 'primary',
          icon: 'mdi-account',
          count: _mails.value.filter((mail) => !mail.trash.includes(store.state.user.data.username) && mail.label.includes('personal')).length,
        },
        {
          title: i18n.global.t('app.mail.label.metting'),
          value: 'metting',
          variant: 'secondary',
          icon: 'mdi-notebook-outline',
          count: _mails.value.filter((mail) => !mail.trash.includes(store.state.user.data.username) && mail.label.includes('metting')).length,
        },
        {
          title: i18n.global.t('app.mail.label.family'),
          value: 'family',
          variant: 'warning',
          icon: 'mdi-home-outline',
          count: _mails.value.filter((mail) => !mail.trash.includes(store.state.user.data.username) && mail.label.includes('family')).length,
        },
        {
          title: i18n.global.t('app.mail.label.work'),
          value: 'work',
          variant: 'danger',
          icon: 'mdi-wallet-travel',
          count: _mails.value.filter((mail) => !mail.trash.includes(store.state.user.data.username) && mail.label.includes('work')).length,
        },
        {
          title: i18n.global.t('app.mail.label.holiday'),
          value: 'holiday',
          variant: 'success',
          icon: 'mdi-weather-sunny',
          count: _mails.value.filter((mail) => !mail.trash.includes(store.state.user.data.username) && mail.label.includes('holiday')).length,
        },
        {
          title: i18n.global.t('app.mail.label.other'),
          value: 'other',
          variant: 'info',
          icon: 'mdi-information-outline',
          count: _mails.value.filter((mail) => !mail.trash.includes(store.state.user.data.username) && mail.label.includes('other')).length,
        },
      ];
    });

    const _mails = ref([]);

    const current_menu = ref('all');
    const changemenu = (menu) => {
      if (current_menu.value != menu) {
        handleCloseMail();
        current_label.value = 'all';
        current_menu.value = menu;
        const checkall = document.getElementById('checkall');
        checkall.checked = false;
        checkall.indeterminate = false;
        checkedMailIds.value = [];
      }
    };
    const current_label = ref('all');
    const changelabel = (label) => {
      current_menu.value = 'all';
      document.getElementById(`${label}_tab`).click();
    };
    const changetab = (label) => {
      if (current_label.value != label) {
        handleCloseMail();
        current_label.value = label;
        const checkall = document.getElementById('checkall');
        checkall.checked = false;
        checkall.indeterminate = false;
        checkedMailIds.value = [];
      }
    };

    const fetchMails = (callback) => {
      getMails().then(({ code, data, msg }) => {
        if (code === 200) {
          _mails.value = data.map((mail) => {
            mail.sender = getUserInfo(mail.created_by);
            return mail;
          });
          callback && callback();
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

    const mails = computed(() => {
      if (current_menu.value === 'all')
        return _mails.value.filter((mail) => !mail.trash.includes(store.state.user.data.username)).filter((mail) => (current_label.value === 'all' ? true : mail.label.includes(current_label.value)));
      else if (current_menu.value === 'inbox')
        return _mails.value
          .filter((mail) => !mail.trash.includes(store.state.user.data.username))
          .filter((mail) => mail.created_by !== store.state.user.data.username)
          .filter((mail) => (current_label.value === 'all' ? true : mail.label.includes(current_label.value)));
      else if (current_menu.value === 'sent')
        return _mails.value
          .filter((mail) => !mail.trash.includes(store.state.user.data.username))
          .filter((mail) => mail.created_by === store.state.user.data.username)
          .filter((mail) => (current_label.value === 'all' ? true : mail.label.includes(current_label.value)));
      else if (current_menu.value === 'trash')
        return _mails.value.filter((mail) => mail.trash.includes(store.state.user.data.username)).filter((mail) => (current_label.value === 'all' ? true : mail.label.includes(current_label.value)));
      else
        return _mails.value
          .filter((mail) => !mail.trash.includes(store.state.user.data.username))
          .filter((mail) => mail[current_menu.value].includes(store.state.user.data.username))
          .filter((mail) => (current_label.value === 'all' ? true : mail.label.includes(current_label.value)));
    });

    onMounted(() => {
      fetchMails(() => {
        watch(
          () => route.value.query,
          (val) => {
            if (val.id) {
              let mail = _mails.value.find((mail) => mail.id == val.id);
              if (mail) {
                setTimeout(() => {
                  handleOpenMail(mail);
                  if (mail.trash.includes(store.state.user.data.username)) current_menu.value = 'trash';
                  else if (mail.created_by === store.state.user.data.username) current_menu.value = 'sent';
                  else current_menu.value = 'inbox';
                }, 100);
              }
            }
          },
          { immediate: true },
        );
      });
      socket.on('refetchMails', () => {
        fetchMails();
      });
      handleCloseMail();
      const CcRecipientsCollapse = document.getElementById('CcRecipientsCollapse');
      if (CcRecipientsCollapse)
        CcRecipientsCollapse.addEventListener('hidden.bs.collapse', () => {
          new_mail.value.cc = [];
          vs.value.cc = [];
        });
      const BccRecipientsCollapse = document.getElementById('BccRecipientsCollapse');
      if (BccRecipientsCollapse)
        BccRecipientsCollapse.addEventListener('hidden.bs.collapse', () => {
          new_mail.value.bcc = [];
          vs.value.bcc = [];
        });
      const composeModal = document.getElementById('composeModal');
      if (composeModal)
        composeModal.addEventListener('hidden.bs.modal', () => {
          if (CcRecipientsCollapse && new_mail.value.cc.length === 0) CcRecipientsCollapse.classList.remove('show');
          if (BccRecipientsCollapse && new_mail.value.bcc.length === 0) BccRecipientsCollapse.classList.remove('show');
        });
    });

    onUnmounted(() => {
      socket.removeListener('refetchMails');
      const mailCcListEl = document.getElementById('cc_list');
      if (mailCcListEl) {
        mailCcListEl.removeEventListener('show.bs.collapse', () => {});
        mailCcListEl.removeEventListener('hide.bs.collapse', () => {});
      }
      const CcRecipientsCollapse = document.getElementById('CcRecipientsCollapse');
      if (CcRecipientsCollapse) CcRecipientsCollapse.removeEventListener('hidden.bs.collapse', () => {});
      const BccRecipientsCollapse = document.getElementById('BccRecipientsCollapse');
      if (BccRecipientsCollapse) BccRecipientsCollapse.removeEventListener('hidden.bs.collapse', () => {});
      const composeModal = document.getElementById('composeModal');
      if (composeModal) composeModal.removeEventListener('hidden.bs.modal', () => {});
    });

    const handleClickMenuBtn = () => {
      document.getElementById('menusidebar').classList.add('menubar-show');
    };

    const handleClickMailWrapper = () => {
      if (document.getElementById('menusidebar').classList.contains('menubar-show')) document.getElementById('menusidebar').classList.remove('menubar-show');
    };

    const checkedMailIds = ref([]);

    const handleCheckMail = (mail) => {
      const idx = checkedMailIds.value.indexOf(mail.id);
      if (idx === -1) checkedMailIds.value.push(mail.id);
      else checkedMailIds.value.splice(idx, 1);
      const checkall = document.getElementById('checkall');
      checkall.checked = checkedMailIds.value.length > 0;
      checkall.indeterminate = checkedMailIds.value.length > 0 && checkedMailIds.value.length < mails.value.length;
    };
    const handleCheckAllMail = (e) => {
      if (e.target.checked)
        checkedMailIds.value = mails.value.map((mail) => {
          return mail.id;
        });
      else checkedMailIds.value = [];
    };

    const handleMarkOrUnmarkMail = (mail, field, callback) => {
      const idx = mail[field].indexOf(store.state.user.data.username);
      if (idx === -1) mail[field].push(store.state.user.data.username);
      else mail[field].splice(idx, 1);
      const params = { id: mail.id };
      params[field] = mail[field];
      updateMail(params).then(({ code, msg }) => {
        if (code === 200) {
          callback && callback();
          if (field === 'trash') handleCloseMail();
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

    const current_mail = ref({});

    const resolveUsers = computed(() => {
      return (arr) => {
        return arr.map((item) => {
          if (item == 0) {
            return all[0];
          } else if (!Number(item)) {
            const user = getUserInfo(item);
            return {
              label: user ? user.fullname : i18n.global.t('app.mail.content.to.user', { user: item }),
              title: user ? user.fullname : i18n.global.t('app.mail.content.to.user', { user: item }),
            };
          } else {
            item = Number(item);
            const dept = store.state.org.depts.find((dept) => dept.id === item);
            return {
              label: dept ? dept.name : i18n.global.t('app.mail.content.to.dept', { dept: item }),
              title: dept
                ? store.state.org.users
                    .map((user) => {
                      return user.fullname;
                    })
                    .join(',')
                : i18n.global.t('app.mail.content.to.dept', { dept: item }),
            };
          }
        });
      };
    });

    const showMoreUsers = ref(false);

    const handleOpenMail = (mail) => {
      store.commit('user/DEL_NOTICE', {
        app: 'mail',
        data: mail,
      });
      if (mail.created_by != store.state.user.data.username && mail.read.indexOf(store.state.user.data.username) === -1) {
        mail.read.push(store.state.user.data.username);
        updateMail({
          id: mail.id,
          read: mail.read,
        }).then(({ code, msg }) => {
          if (code !== 200) {
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
      current_mail.value = mail;
      randerVsUsers(current_mail.value);
      document.body.classList.add('email-detail-show');
      setTimeout(() => {
        const mailCcListEl = document.getElementById('cc_list');
        if (mailCcListEl) {
          mailCcListEl.addEventListener('show.bs.collapse', () => {
            showMoreUsers.value = true;
          });
          mailCcListEl.addEventListener('hide.bs.collapse', () => {
            showMoreUsers.value = false;
          });
        }
      }, 100);
    };

    const handleCloseMail = () => {
      const mailCcListEl = document.getElementById('cc_list');
      setTimeout(() => {
        if (mailCcListEl) {
          mailCcListEl.removeEventListener('show.bs.collapse', () => {});
          mailCcListEl.removeEventListener('hide.bs.collapse', () => {});
        }
        showMoreUsers.value = false;
        current_mail.value = {};
      }, 100);
      document.body.classList.remove('email-detail-show');
    };

    const handleComposeMail = () => {
      const staged = localStorage.getItem(`staged_app_mail_${store.state.user.data.id}`);
      if (staged) {
        try {
          new_mail.value = JSON.parse(decryptData(staged));
        } catch (error) {
          console.log(error);
        }
      }
      localStorage.removeItem(`staged_app_mail_${store.state.user.data.id}`);
      handleCloseMail();
      randerVsUsers(new_mail.value);
    };

    const handleSubmitMail = () => {
      createMail(new_mail.value).then(({ code, msg }) => {
        if (code === 200) {
          handleCancelCompose();
          document.getElementById('hideComposeModalBtn').click();
          localStorage.removeItem(`staged_app_mail_${store.state.user.data.id}`);
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

    const handleReply = (mail) => {
      randerVsUsers(mail);
      new_mail.value = {
        to: [mail.created_by],
        cc: [],
        bcc: [],
        subject: `Re: ${mail.subject}`,
        content: `<br/><hr/><b>Sender:</b> ${mail.sender.fullname}<br/><b>Date:</b> ${moment(mail.created_at).format('llll')}<br/><b>To:</b> ${resolveUsers
          .value(vs.value.to)
          .map((item) => {
            return item.label;
          })
          .join(', ')}<br/>${
          mail.cc.length
            ? `<b>Cc:</b> ${resolveUsers
                .value(vs.value.cc)
                .map((item) => {
                  return item.label;
                })
                .join(', ')}<br/>`
            : ``
        }<b>Subject:</b> ${mail.subject}<br/>${mail.content}`,
        attachments: [],
        label: mail.label,
        trash: [],
        star: [],
        important: [],
        read: [],
      };
      randerVsUsers(new_mail.value);
      document.getElementById('showComposeModalBtn').click();
    };
    const handleReply2All = (mail, confirmed) => {
      if (!confirmed && ![...mail.to, ...mail.cc].includes(store.state.user.data.username)) {
        document.getElementById('showReply2AllConfirmModalBtn').click();
        return;
      }
      randerVsUsers(mail);
      new_mail.value = {
        to: [...[mail.created_by], ...mail.to.filter((username) => username != store.state.user.data.username)],
        cc: mail.cc.filter((username) => username != store.state.user.data.username),
        bcc: [],
        subject: `Re: ${mail.subject}`,
        content: `<br/><hr/><b>Sender:</b> ${mail.sender.fullname}<br/><b>Date:</b> ${moment(mail.created_at).format('llll')}<br/><b>To:</b> ${resolveUsers
          .value(vs.value.to)
          .map((item) => {
            return item.label;
          })
          .join(', ')}<br/>${
          vs.value.cc.length
            ? `<b>Cc:</b> ${resolveUsers
                .value(vs.value.cc)
                .map((item) => {
                  return item.label;
                })
                .join(', ')}<br/>`
            : ``
        }<b>Subject:</b> ${mail.subject}<br/>${mail.content}`,
        attachments: [],
        label: mail.label,
        trash: [],
        star: [],
        important: [],
        read: [],
      };
      randerVsUsers(new_mail.value);
      if (new_mail.value.cc.length) {
        document.getElementById('CcRecipientsCollapse').classList.add('show');
      }
      document.getElementById('showComposeModalBtn').click();
    };
    const showCancelConfirmModal = () => {
      document.getElementById('showCancelConfirmModalBtn').click();
    };
    const handleCancelCompose = (discard = true) => {
      if (discard) {
        new_mail.value = {
          key: Math.random().toString(36).slice(-6),
          to: [],
          cc: [],
          bcc: [],
          subject: '',
          content: '',
          attachments: [],
          label: [],
          trash: [],
          star: [],
          important: [],
          read: [],
        };
        randerVsUsers(new_mail.value);
        localStorage.removeItem(`staged_app_mail_${store.state.user.data.id}`);
      } else {
        localStorage.setItem(`staged_app_mail_${store.state.user.data.id}`, encryptData(JSON.stringify(new_mail.value)));
      }
    };

    const handleDeleteMail = (mail, callback) => {
      updateMail({ id: mail.id, data_state: 'deleted' }).then(({ code, msg }) => {
        if (code === 200) {
          callback && callback();
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

    const handleTrashMails = (del = false) => {
      const mails = _mails.value.filter((mail) => checkedMailIds.value.includes(mail.id));
      mails.forEach((mail) => {
        if (del) {
          handleDeleteMail(mail, () => {
            handleCheckMail(mail);
            _mails.value.splice(
              _mails.value.findIndex((_mail) => _mail.id === mail.id),
              1,
            );
          });
        } else {
          handleMarkOrUnmarkMail(mail, 'trash', () => {
            handleCheckMail(mail);
          });
        }
      });
    };

    const handleMarkMails = (field) => {
      const mails = _mails.value.filter((mail) => checkedMailIds.value.includes(mail.id) && !mail[field].includes(store.state.user.data.username));
      mails.forEach((mail) => {
        handleMarkOrUnmarkMail(mail, field, () => {
          handleCheckMail(mail);
        });
      });
    };

    return {
      new_mail,
      options4to,
      options4cc,
      options4bcc,
      vs,
      menus,
      current_menu,
      labels,
      current_label,
      changelabel,
      changetab,
      changemenu,
      fetchMails,
      replaceHtml,
      handleSelectValue,
      handleClickMenuBtn,
      handleClickMailWrapper,
      mails,
      checkedMailIds,
      handleCheckMail,
      handleCheckAllMail,
      handleMarkOrUnmarkMail,
      current_mail,
      resolveUsers,
      showMoreUsers,
      handleOpenMail,
      handleCloseMail,
      handleComposeMail,
      handleSubmitMail,
      handleReply,
      handleReply2All,
      showCancelConfirmModal,
      handleCancelCompose,
      handleTrashMails,
      handleMarkMails,
    };
  },
};
</script>
