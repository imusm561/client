<template>
  <div class="email-wrapper d-lg-flex gap-1 mx-n4 mt-n4 p-1" @click="handleClickMailWrapper">
    <div class="email-menu-sidebar" id="menusidebar">
      <div class="p-4 d-flex flex-column h-100">
        <div class="pb-3 border-bottom border-bottom-dashed">
          <button
            type="button"
            class="btn btn-danger w-100"
            id="showComposeModalBtn"
            data-bs-toggle="modal"
            data-bs-target="#composeModal"
            @click="handleComposeMail"
          >
            <i class="mdi mdi-email-plus-outline me-1"></i>
            {{ $t('app.mail.compose') }}
          </button>
          <button
            class="d-none"
            id="showDraftMailModalBtn"
            data-bs-toggle="modal"
            data-bs-target="#composeModal"
          ></button>
        </div>

        <div class="mx-n4 px-4 email-menu-sidebar-scroll">
          <div class="email-menu-list mt-3">
            <a
              v-for="menu in menus"
              :key="menu.value"
              class="cursor-pointer"
              :class="{ active: mails.menu === menu.value }"
              @click="mails.menu = menu.value"
            >
              <i :class="`mdi ${menu.icon} me-3 align-middle fw-medium`"></i>
              <span>{{ menu.title }}</span>
              <span v-if="menu.count !== 0" :class="`badge badge-soft-${menu.variant} ms-auto`">
                {{ menu.count }}
              </span>
            </a>
          </div>

          <div>
            <h5 class="fs-12 text-uppercase text-muted mt-4">{{ $t('app.mail.label') }}</h5>
            <div class="email-label-list mt-1">
              <a
                v-for="label in labels"
                :key="label.value"
                class="cursor-pointer"
                :class="{ active: mails.label === label.value }"
                @click="mails.label = label.value"
              >
                <i :class="`mdi ${label.icon} me-3 align-middle fw-medium`"></i>
                <span>{{ label.title }}</span>
                <span v-if="label.count !== 0" :class="`badge badge-soft-${label.variant} ms-auto`">
                  {{ label.count }}
                </span>
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
              <button
                type="button"
                class="btn btn-soft-success btn-icon btn-sm fs-16"
                @click.stop="handleClickMenuBtn"
              >
                <i class="mdi mdi-menu align-bottom"></i>
              </button>
            </div>
            <div class="col-sm order-3 order-sm-2">
              <div class="hstack gap-sm-1 align-items-center flex-wrap email-topbar-link">
                <div class="form-check fs-14 m-0">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    id="checkall"
                    :disabled="mails.list.length === 0"
                    @change="handleCheckAllMail"
                  />
                  <label class="form-check-label" for="flexCheck18"></label>
                </div>
                <button
                  type="button"
                  class="btn btn-ghost-secondary btn-icon btn-sm fs-16"
                  @click="
                    () => {
                      mails.refetch = true;
                      fetchMails();
                    }
                  "
                >
                  <i class="mdi mdi-refresh align-bottom"></i>
                </button>
                <div v-if="checkedMailIds.length">
                  <button
                    type="button"
                    class="btn btn-ghost-secondary btn-icon btn-sm fs-16 trash-btn"
                    :class="{ active: mails.menu === 'trash' }"
                    @click="handleMarkOrUnmarkMails(checkedMailIds, 'trash', mails.menu != 'trash')"
                  >
                    <i class="mdi mdi-trash-can align-bottom"></i>
                  </button>
                  <button
                    v-if="mails.menu === 'trash'"
                    type="button"
                    class="btn btn-ghost-secondary btn-icon btn-sm fs-16"
                    data-bs-toggle="modal"
                    data-bs-target="#deleteMailConfirmModal"
                  >
                    <i class="mdi mdi-delete-forever text-danger align-bottom"></i>
                  </button>
                </div>
              </div>
            </div>
            <div class="col-auto order-2 order-sm-3" v-if="checkedMailIds.length">
              <div class="d-flex gap-sm-1 email-topbar-link">
                <div class="dropdown">
                  <button
                    class="btn btn-ghost-secondary btn-icon btn-sm fs-16"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    <i class="mdi mdi-dots-vertical align-bottom"></i>
                  </button>
                  <div class="dropdown-menu dropdown-menu-end">
                    <a
                      class="dropdown-item cursor-pointer"
                      @click="
                        handleMarkOrUnmarkMails(
                          checkedMailIds,
                          'important',
                          !mails.list
                            .filter((mail) => checkedMailIds.includes(mail.id))
                            .every((mail) =>
                              mail.important.includes($store.state.user.data.username),
                            ),
                        )
                      "
                    >
                      {{
                        mails.list
                          .filter((mail) => checkedMailIds.includes(mail.id))
                          .every((mail) => mail.important.includes($store.state.user.data.username))
                          ? $t('app.mail.detail.unmarkImportant')
                          : $t('app.mail.detail.markAsImportant')
                      }}
                    </a>
                    <a
                      class="dropdown-item cursor-pointer"
                      @click="
                        handleMarkOrUnmarkMails(
                          checkedMailIds,
                          'star',
                          !mails.list
                            .filter((mail) => checkedMailIds.includes(mail.id))
                            .every((mail) => mail.star.includes($store.state.user.data.username)),
                        )
                      "
                    >
                      {{
                        mails.list
                          .filter((mail) => checkedMailIds.includes(mail.id))
                          .every((mail) => mail.star.includes($store.state.user.data.username))
                          ? $t('app.mail.detail.unmarkStar')
                          : $t('app.mail.detail.markStar')
                      }}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="row align-items-center mt-3">
            <div class="col">
              <ul
                class="nav nav-tabs nav-tabs-custom nav-success gap-1 text-center border-bottom-0"
                style="width: 100vw"
              >
                <li v-for="label in labels" :key="label.value" class="nav-item tabtype">
                  <a
                    class="nav-link fw-semibold cursor-pointer"
                    :class="{ active: mails.label == label.value }"
                    :id="`${label.value}_tab`"
                    @click="mails.label = label.value"
                  >
                    <i :class="`mdi ${label.icon} align-bottom d-inline-block`"></i>
                    <span class="ms-1 d-none d-sm-inline-block">{{ label.title }}</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div id="email-list" class="email-list-content mx-n4 px-4 p-2" data-simplebar>
          <ul class="email-list mb-0">
            <div v-for="mail in mails.list" :key="mail.id">
              <li
                :class="{
                  unread:
                    !mail.read.includes($store.state.user.data.username) &&
                    mail.created_by != $store.state.user.data.username,
                  active: checkedMailIds.includes(mail.id),
                  'bg-soft-warning': mail.important.includes($store.state.user.data.username),
                }"
              >
                <div>
                  <div class="col-mail col-mail-1">
                    <div class="form-check checkbox-wrapper-mail fs-14">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        :checked="checkedMailIds.includes(mail.id)"
                        @change="handleCheckMail(mail)"
                      />
                      <label class="form-check-label"></label>
                    </div>

                    <button
                      type="button"
                      class="btn avatar-xs p-0 favourite-btn fs-15"
                      :class="{ active: mail.star.includes($store.state.user.data.username) }"
                      @click="
                        handleMarkOrUnmarkMails(
                          [mail.id],
                          'star',
                          !mail.star.includes($store.state.user.data.username),
                        )
                      "
                    >
                      <i class="mdi mdi-star"></i>
                    </button>
                    <i
                      v-if="mail.attachments.length"
                      class="mdi mdi-attachment text-primary fs-15 me-2"
                    ></i>
                    <a class="cursor-pointer title-name" @click="handleOpenMail(mail)">
                      {{ mail.sender.fullname }}
                    </a>
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
            <button
              v-if="mails.loading && !mails.refetch"
              type="button"
              class="btn btn-soft-info btn-rounded btn-sm px-2 d-block mt-2"
              style="margin: 0 auto"
            >
              <i class="mdi mdi-spin mdi-loading me-2"></i>
              {{ $t('app.mail.loading') }}
            </button>
          </ul>
        </div>
      </div>
    </div>

    <div class="email-detail-content">
      <div class="p-4 d-flex flex-column h-100" v-if="current_mail.id">
        <div class="pb-4 border-bottom border-bottom-dashed">
          <div class="row">
            <div class="col">
              <button
                type="button"
                class="btn btn-soft-danger btn-icon btn-sm fs-16"
                @click="handleCloseMail"
              >
                <i class="mdi mdi-close align-bottom"></i>
              </button>
            </div>
            <div class="col-auto">
              <div class="hstack gap-sm-1 align-items-center flex-wrap email-topbar-link">
                <button
                  v-if="current_mail.created_by != $store.state.user.data.username"
                  class="btn btn-ghost-primary btn-icon btn-sm fs-16"
                  @click="handleReply(current_mail)"
                >
                  <i class="mdi mdi-reply align-bottom"></i>
                </button>
                <button
                  v-if="current_mail.created_by != $store.state.user.data.username"
                  class="btn btn-ghost-danger btn-icon btn-sm fs-16"
                  @click="handleReply2All(current_mail)"
                >
                  <i class="mdi mdi-reply-all align-bottom"></i>
                </button>
                <i
                  v-if="current_mail.attachments.length.length"
                  class="mdi mdi-attachment text-primary fs-15 me-2"
                ></i>
                <button
                  type="button"
                  class="btn btn-ghost-secondary btn-icon btn-sm fs-16 favourite-btn"
                  :class="{ active: current_mail.star.includes($store.state.user.data.username) }"
                  @click="
                    handleMarkOrUnmarkMails(
                      [current_mail.id],
                      'star',
                      !current_mail.star.includes($store.state.user.data.username),
                    )
                  "
                >
                  <i class="mdi mdi-star align-bottom"></i>
                </button>
                <button
                  class="btn btn-ghost-secondary btn-icon btn-sm fs-16 trash-btn"
                  :class="{ active: current_mail.trash.includes($store.state.user.data.username) }"
                  @click="
                    handleMarkOrUnmarkMails(
                      [current_mail.id],
                      'trash',
                      !current_mail.trash.includes($store.state.user.data.username),
                    )
                  "
                >
                  <i class="mdi mdi-trash-can align-bottom"></i>
                </button>
                <button
                  class="btn btn-ghost-secondary btn-icon btn-sm fs-16 trash-btn"
                  data-bs-toggle="modal"
                  data-bs-target="#fullscreenMailContentModal"
                >
                  <i class="mdi mdi-fullscreen align-bottom"></i>
                </button>
                <div class="dropdown">
                  <button
                    class="btn btn-ghost-secondary btn-icon btn-sm fs-16"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    <i class="mdi mdi-dots-vertical align-bottom"></i>
                  </button>
                  <div class="dropdown-menu dropdown-menu-end">
                    <a
                      class="dropdown-item cursor-pointer"
                      @click="
                        handleMarkOrUnmarkMails(
                          [current_mail.id],
                          'important',
                          !current_mail.important.includes($store.state.user.data.username),
                        )
                      "
                    >
                      {{
                        current_mail.important.includes($store.state.user.data.username)
                          ? $t('app.mail.detail.unmarkImportant')
                          : $t('app.mail.detail.markAsImportant')
                      }}
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
                  resolveUsers(current_mail.to)
                    .map((item) => {
                      return item.label;
                    })
                    .join(',')
                "
              >
                {{ $t('app.mail.detail.to') }}:
                <span
                  style="word-break: break-all"
                  v-for="(item, index) in resolveUsers(current_mail.to)"
                  :key="index"
                  :title="item.title"
                >
                  {{ item.label
                  }}{{ index === resolveUsers(current_mail.to).length - 1 ? '' : ', ' }}
                </span>
              </div>
              <div
                id="cc_list"
                class="accordion-collapse collapse fs-12"
                :title="
                  resolveUsers(current_mail.cc)
                    .map((item) => {
                      return item.label;
                    })
                    .join(',')
                "
              >
                <span v-if="current_mail.cc.length">
                  {{ $t('app.mail.detail.cc') }}:
                  <span
                    style="word-break: break-all"
                    v-for="(item, index) in resolveUsers(current_mail.cc)"
                    :key="index"
                    :title="item.title"
                  >
                    {{ item.label
                    }}{{ index === resolveUsers(current_mail.cc).length - 1 ? '' : ', ' }}
                  </span>
                </span>
              </div>
            </div>
            <div class="flex-shrink-0 align-self-start">
              <div class="text-muted fs-12">{{ $moment(current_mail.created_at).fromNow() }}</div>
              <a
                role="button"
                class="w-100 text-primary float-end text-end collapsed"
                data-bs-toggle="collapse"
                href="#cc_list"
              >
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

    <div
      class="modal fade"
      id="composeModal"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      data-bs-focus="false"
    >
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header p-2 bg-light">
            <h5 class="modal-title">{{ $t('app.mail.composeModal.newMail') }}</h5>
            <button
              type="button"
              class="btn-close d-none"
              id="hideComposeModalBtn"
              data-bs-dismiss="modal"
            ></button>
          </div>
          <Form v-slot="{ errors }" @submit="handleSubmitMail('published')" :key="new_mail.key">
            <div class="modal-body p-0">
              <div data-simplebar class="p-3" style="max-height: 80vh; overflow-x: hidden">
                <div class="row g-3">
                  <div class="col-12">
                    <label class="d-flex justify-content-between">
                      <span>{{ $t('app.mail.composeModal.form.to') }}:</span>
                      <div class="d-flex">
                        <b
                          class="cursor-pointer ms-2 text-decoration-underline"
                          data-bs-toggle="collapse"
                          data-bs-target="#CcRecipientsCollapse"
                        >
                          {{ $t('app.mail.composeModal.form.cc') }}
                        </b>
                        <b
                          class="cursor-pointer ms-2 text-decoration-underline"
                          data-bs-toggle="collapse"
                          data-bs-target="#BccRecipientsCollapse"
                        >
                          {{ $t('app.mail.composeModal.form.bcc') }}
                        </b>
                      </div>
                    </label>
                    <UserSelector
                      :key="JSON.stringify([...new_mail.cc, ...new_mail.bcc])"
                      v-model="new_mail.to"
                      :disable-list="[...new_mail.cc, ...new_mail.bcc]"
                      :placeholder="$t('app.mail.composeModal.form.to')"
                      :class="errors.to && 'is-invalid'"
                    />
                    <Field name="to" v-model="new_mail.to" rules="required" class="d-none" />
                    <span class="invalid-feedback">{{ errors.to }}</span>
                  </div>
                  <div class="collapse" id="CcRecipientsCollapse">
                    <div class="col-12">
                      <label>{{ $t('app.mail.composeModal.form.cc') }}:</label>
                      <UserSelector
                        :key="JSON.stringify([...new_mail.to, ...new_mail.bcc])"
                        v-model="new_mail.cc"
                        :disable-list="[...new_mail.to, ...new_mail.bcc]"
                        :placeholder="$t('app.mail.composeModal.form.cc')"
                      />
                    </div>
                  </div>
                  <div class="collapse" id="BccRecipientsCollapse">
                    <div class="col-12">
                      <label>{{ $t('app.mail.composeModal.form.bcc') }}:</label>
                      <UserSelector
                        :key="JSON.stringify([...new_mail.to, ...new_mail.cc])"
                        v-model="new_mail.bcc"
                        :disable-list="[...new_mail.to, ...new_mail.cc]"
                        :placeholder="$t('app.mail.composeModal.form.bcc')"
                      />
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
                      :options="labels.filter((label) => label.value != 'all')"
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
                    <CKEditor
                      v-model="new_mail.content"
                      id="ck_mail_content"
                      :error="{ id: 'ck_mail_content', error: errors.content }"
                      :class="errors.content && 'is-invalid'"
                    />
                    <Field
                      name="content"
                      v-model="new_mail.content"
                      rules="required"
                      class="d-none"
                    />
                    <span class="invalid-feedback">{{ errors.content }}</span>
                  </div>
                  <div class="col-12">
                    <Uploader
                      :key="new_mail.key"
                      v-model="new_mail.attachments"
                      accept="*"
                      :multiple="true"
                      :placeholder="$t('app.mail.composeModal.form.attachments')"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div class="modal-footer p-3 pt-1 pb-1">
              <button type="button" class="btn btn-sm btn-danger" @click="showCancelConfirmModal">
                <i class="mdi mdi-email-remove-outline"></i>
                {{ $t('app.mail.composeModal.form.footer.cancel') }}
              </button>
              <button
                type="button"
                class="btn btn-sm btn-warning"
                @click="handleSubmitMail('drafted')"
              >
                <i class="mdi mdi-email-edit-outline"></i>
                {{ $t('app.mail.composeModal.form.footer.draft') }}
              </button>
              <button
                type="submit"
                class="btn btn-sm btn-success"
                :disabled="Object.keys(errors).length"
              >
                <i class="mdi mdi-email-send-outline"></i>
                {{ $t('app.mail.composeModal.form.footer.send') }}
              </button>
            </div>
          </Form>
        </div>
      </div>
    </div>
    <button
      type="button"
      class="d-none"
      id="showReply2AllConfirmModalBtn"
      data-bs-toggle="modal"
      data-bs-target="#replyToAllConfirmModal"
    ></button>
    <div id="replyToAllConfirmModal" class="modal fade zoomIn">
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
              <div class="fs-15 mx-4 mx-sm-5">
                <h4>{{ $t('app.mail.replyToAllConfirmModal.title') }}</h4>
                <p class="text-muted mx-4 mb-0">
                  {{ $t('app.mail.replyToAllConfirmModal.confirm') }}
                </p>
              </div>
            </div>
            <div class="d-flex gap-2 justify-content-center mt-4 mb-2">
              <button type="button" class="btn w-sm btn-primary" @click="handleReply(current_mail)">
                {{ $t('app.mail.replyToAllConfirmModal.replyToSender') }}
              </button>
              <button
                type="button"
                class="btn w-sm btn-danger"
                @click="handleReply2All(current_mail, true)"
              >
                {{ $t('app.mail.replyToAllConfirmModal.replyToAll') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <button
      type="button"
      class="d-none"
      id="showCancelConfirmModalBtn"
      data-bs-toggle="modal"
      data-bs-target="#cancelConfirmModal"
    ></button>
    <div id="cancelConfirmModal" class="modal fade zoomIn">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <button
              type="button"
              class="btn-close"
              data-bs-target="#composeModal"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <div class="mt-2 text-center">
              <div class="fs-15 mx-4 mx-sm-5">
                <h4>{{ $t('app.mail.cancelConfirmModal.title') }}</h4>
                <p class="text-muted mx-4 mb-0">{{ $t('app.mail.cancelConfirmModal.confirm') }}</p>
              </div>
            </div>
            <div class="d-flex gap-2 justify-content-center mt-4 mb-2">
              <button
                type="button"
                class="btn w-sm btn-primary"
                data-bs-dismiss="modal"
                @click="handleCancelCompose(false)"
              >
                {{ $t('app.mail.cancelConfirmModal.staged') }}
              </button>
              <button
                type="button"
                class="btn w-sm btn-danger"
                data-bs-dismiss="modal"
                @click="handleCancelCompose()"
              >
                {{ $t('app.mail.cancelConfirmModal.discard') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <button
      type="button"
      class="d-none"
      id="showDeleteMailConfirmModalBtn"
      data-bs-toggle="modal"
      data-bs-target="#deleteMailConfirmModal"
    ></button>
    <div id="deleteMailConfirmModal" class="modal fade zoomIn">
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
              <div class="fs-15 mx-4 mx-sm-5">
                <h4>{{ $tc('app.mail.deleteMailConfirmModal.title', checkedMailIds.length) }}</h4>
                <p class="text-muted mx-4 mb-0">
                  {{ $tc('app.mail.deleteMailConfirmModal.confirm', checkedMailIds.length) }}
                </p>
              </div>
            </div>
            <div class="d-flex gap-2 justify-content-center mt-4 mb-2">
              <button type="button" class="btn w-sm btn-light" data-bs-dismiss="modal">
                {{ $t('app.mail.deleteMailConfirmModal.cancel') }}
              </button>
              <button
                type="button"
                class="btn w-sm btn-danger"
                data-bs-dismiss="modal"
                @click="handleMarkOrUnmarkMails(checkedMailIds, 'delete', true)"
              >
                {{ $t('app.mail.deleteMailConfirmModal.confirmed') }}
              </button>
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
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
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
import { computed, onMounted, onUnmounted, ref, watch, reactive, nextTick } from 'vue';
import { replaceHtml, useRouter, getUserInfo, hashData, encryptData, decryptData } from '@utils';
import store from '@store';
import CKEditor from '@components/CKEditor';
import Uploader from '@components/Uploader';
import { getMail, getMails, createMail, updateMail } from '@api/app/mail';
import { useToast } from 'vue-toastification';
import ToastificationContent from '@components/ToastificationContent';
import UserSelector from '@components/UserSelector';
import Avatar from '@components/Avatar';
import i18n from '@utils/i18n';
export default {
  components: {
    CKEditor,
    Uploader,
    UserSelector,
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

    const menus = reactive([
      {
        title: i18n.global.t('app.mail.menu.all'),
        value: 'all',
        variant: 'primary',
        icon: 'mdi-email-multiple',
      },
      {
        title: i18n.global.t('app.mail.menu.inbox'),
        value: 'inbox',
        variant: 'info',
        icon: 'mdi-email-receive',
      },
      {
        title: i18n.global.t('app.mail.menu.draft'),
        value: 'draft',
        variant: 'warning',
        icon: 'mdi-email-edit-outline',
      },
      {
        title: i18n.global.t('app.mail.menu.sent'),
        value: 'sent',
        variant: 'success',
        icon: 'mdi-email-send',
      },
      {
        title: i18n.global.t('app.mail.menu.trash'),
        value: 'trash',
        variant: 'danger',
        icon: 'mdi-trash-can',
      },
      {
        title: i18n.global.t('app.mail.menu.star'),
        value: 'star',
        variant: 'warning',
        icon: 'mdi-star',
      },
      {
        title: i18n.global.t('app.mail.menu.important'),
        value: 'important',
        variant: 'warning',
        icon: 'mdi-label',
      },
    ]);

    const labels = reactive(JSON.parse(JSON.stringify(store.state.sys.cfg.mail.labels)));

    const mails = reactive({
      menu: menus[0].value,
      label: labels[0].value,
      total: 0,
      pageNum: 1,
      pageSize: 20,
      list: [],
      loading: false,
      refetch: false,
    });

    const fetchMails = (callback) => {
      getMails({
        menu: mails.menu,
        label: mails.label,
        pageNum: mails.refetch ? 1 : mails.pageNum,
        pageSize: mails.refetch ? (mails.pageNum - 1) * mails.pageSize : mails.pageSize,
      }).then(({ code, data, msg }) => {
        if (code === 200) {
          mails.total = data.count;
          if (mails.refetch) {
            mails.list = data.rows.map((mail) => {
              mail.sender = getUserInfo(mail.created_by);
              return mail;
            });
          } else {
            mails.pageNum += 1;
            mails.list.push(
              ...data.rows.map((mail) => {
                mail.sender = getUserInfo(mail.created_by);
                return mail;
              }),
            );
          }
          if (data.menu)
            menus.forEach((menu) => {
              menu.count = data.menu[menu.value];
            });
          if (data.label)
            labels.forEach((label) => {
              label.count = data.label[label.value];
            });
          setTimeout(() => {
            mails.loading = false;
            mails.refetch = false;
          }, 500);
          nextTick(() => {
            callback && callback();
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

    const scrollHandler = () => {
      const list = document
        .getElementById('email-list')
        ?.querySelector('.simplebar-content-wrapper');
      if (
        list &&
        list.scrollHeight - (list.scrollTop + list.offsetHeight) < 2 &&
        mails.list.length < mails.total &&
        !mails.loading
      ) {
        mails.loading = true;
        fetchMails();
      }
    };

    const refetchMailsHandler = () => {
      mails.refetch = true;
      mails.loading = true;
      fetchMails();
    };

    const ccRecipientsCollapseHiddenHandler = () => {
      new_mail.value.cc = [];
    };

    const bccRecipientsCollapseHiddenHandler = () => {
      new_mail.value.bcc = [];
    };

    const composeModalShowHandler = () => {
      const ccRecipientsCollapse = document.getElementById('CcRecipientsCollapse');
      const bccRecipientsCollapse = document.getElementById('BccRecipientsCollapse');
      if (ccRecipientsCollapse && new_mail.value.cc.length != 0)
        ccRecipientsCollapse.classList.add('show');
      if (bccRecipientsCollapse && new_mail.value.bcc.length != 0)
        bccRecipientsCollapse.classList.add('show');
    };

    const composeModalHiddenHandler = () => {
      const ccRecipientsCollapse = document.getElementById('CcRecipientsCollapse');
      const bccRecipientsCollapse = document.getElementById('BccRecipientsCollapse');
      if (ccRecipientsCollapse && new_mail.value.cc.length === 0)
        ccRecipientsCollapse.classList.remove('show');
      if (bccRecipientsCollapse && new_mail.value.bcc.length === 0)
        bccRecipientsCollapse.classList.remove('show');
    };

    const mailCcListElShowHandler = () => {
      showMoreUsers.value = true;
    };

    const mailCcListElHideHandler = () => {
      showMoreUsers.value = false;
    };

    onMounted(async () => {
      if (route.value.query.id) {
        const { code, data, msg } = await getMail(route.value.query);
        if (code === 200) {
          data.sender = getUserInfo(data.created_by);
          mails.menu = data.trash.includes(store.state.user.data.username)
            ? 'trash'
            : data.created_by === store.state.user.data.username
            ? data.data_state === 'published'
              ? 'sent'
              : 'draft'
            : 'inbox';
          mails.label = data.label?.length ? data.label[0] : 'all';
          nextTick(() => {
            setTimeout(() => {
              handleOpenMail(data);
            }, 500);
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
      }

      fetchMails(() => {
        watch(
          () => [mails.menu, mails.label],
          (newVal, oldVal) => {
            if (newVal && oldVal) {
              handleCloseMail();
              const checkall = document.getElementById('checkall');
              checkall.checked = false;
              checkall.indeterminate = false;
              checkedMailIds.value = [];

              mails.total = 0;
              mails.pageNum = 1;
              mails.pageSize = 20;
              mails.list = [];

              fetchMails();
            }
          },
          { immediate: true },
        );

        const list = document
          .getElementById('email-list')
          ?.querySelector('.simplebar-content-wrapper');
        if (list) list.addEventListener('scroll', scrollHandler);
      });
      socket.on('refetchMails', refetchMailsHandler);
      handleCloseMail();

      const ccRecipientsCollapse = document.getElementById('CcRecipientsCollapse');
      if (ccRecipientsCollapse)
        ccRecipientsCollapse.addEventListener(
          'hidden.bs.collapse',
          ccRecipientsCollapseHiddenHandler,
        );

      const bccRecipientsCollapse = document.getElementById('BccRecipientsCollapse');
      if (bccRecipientsCollapse)
        bccRecipientsCollapse.addEventListener(
          'hidden.bs.collapse',
          bccRecipientsCollapseHiddenHandler,
        );

      const composeModal = document.getElementById('composeModal');
      if (composeModal) {
        composeModal.addEventListener('show.bs.modal', composeModalShowHandler);
        composeModal.addEventListener('hidden.bs.modal', composeModalHiddenHandler);
      }
    });

    onUnmounted(() => {
      const list = document
        .getElementById('email-list')
        ?.querySelector('.simplebar-content-wrapper');
      if (list) list.removeEventListener('scroll', scrollHandler);

      socket.removeListener('refetchMails', refetchMailsHandler);
      const mailCcListEl = document.getElementById('cc_list');
      if (mailCcListEl) {
        mailCcListEl.removeEventListener('show.bs.collapse', mailCcListElShowHandler);
        mailCcListEl.removeEventListener('hide.bs.collapse', mailCcListElHideHandler);
      }

      const ccRecipientsCollapse = document.getElementById('CcRecipientsCollapse');
      if (ccRecipientsCollapse)
        ccRecipientsCollapse.removeEventListener(
          'hidden.bs.collapse',
          ccRecipientsCollapseHiddenHandler,
        );

      const bccRecipientsCollapse = document.getElementById('BccRecipientsCollapse');
      if (bccRecipientsCollapse)
        bccRecipientsCollapse.removeEventListener(
          'hidden.bs.collapse',
          bccRecipientsCollapseHiddenHandler,
        );

      const composeModal = document.getElementById('composeModal');
      if (composeModal) {
        composeModal.removeEventListener('show.bs.modal', composeModalShowHandler);
        composeModal.removeEventListener('hidden.bs.modal', composeModalHiddenHandler);
      }
    });

    const handleClickMenuBtn = () => {
      document.getElementById('menusidebar').classList.add('menubar-show');
    };

    const handleClickMailWrapper = () => {
      if (document.getElementById('menusidebar').classList.contains('menubar-show'))
        document.getElementById('menusidebar').classList.remove('menubar-show');
    };

    const checkedMailIds = ref([]);

    watch(
      () => checkedMailIds.value,
      (val) => {
        if (val) {
          const checkall = document.getElementById('checkall');
          if (checkall) {
            checkall.checked = val.length > 0;
            checkall.indeterminate = val.length > 0 && val.length < mails.list.length;
          }
        }
      },
      { immediate: true, deep: true },
    );

    const handleCheckMail = (mail) => {
      const idx = checkedMailIds.value.indexOf(mail.id);
      if (idx === -1) checkedMailIds.value.push(mail.id);
      else checkedMailIds.value.splice(idx, 1);
    };

    const handleCheckAllMail = (e) => {
      if (e?.target?.checked)
        checkedMailIds.value = mails.list.map((mail) => {
          return mail.id;
        });
      else checkedMailIds.value = [];
    };

    const handleMarkOrUnmarkMails = (ids, field, mark) => {
      const data = {
        mails: ids.map((id) => {
          const mail = mails.list.find((mail) => mail.id === id);
          const idx = mail[field].indexOf(store.state.user.data.username);
          if (mark) {
            if (idx === -1) mail[field].push(store.state.user.data.username);
          } else {
            if (idx != -1) mail[field].splice(idx, 1);
          }
          if (id === current_mail.value.id) current_mail.value[field] = mail[field];
          return {
            id,
            [field]: mail[field],
          };
        }),
      };
      updateMail(data).then(({ code, msg }) => {
        if (code === 200) {
          if (
            mark &&
            (field === 'trash' || field === 'delete') &&
            ids.includes(current_mail.value.id)
          )
            handleCloseMail();
          mails.refetch = true;
          mails.loading = true;
          fetchMails();
          handleCheckAllMail();
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
            return;
          } else if (!Number(item)) {
            const user = getUserInfo(item);
            return {
              label: user
                ? user.fullname
                : i18n.global.t('app.mail.content.to.user', { user: item }),
              title: user
                ? user.fullname
                : i18n.global.t('app.mail.content.to.user', { user: item }),
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
      if (mail.data_state === 'drafted') {
        handleCloseMail();
        new_mail.value = JSON.parse(JSON.stringify(mail));
        new_mail.value.key = Math.random().toString(36).slice(-6);
        setTimeout(() => {
          document.getElementById('showDraftMailModalBtn').click();
        }, 100);
      } else {
        store.commit('user/DEL_NOTICE', {
          app: 'mail',
          data: mail,
        });
        if (
          mail.created_by != store.state.user.data.username &&
          mail.read.indexOf(store.state.user.data.username) === -1
        ) {
          mail.read.push(store.state.user.data.username);
          updateMail({
            mails: [
              {
                id: mail.id,
                read: mail.read,
              },
            ],
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
        document.body.classList.add('email-detail-show');
        setTimeout(() => {
          const mailCcListEl = document.getElementById('cc_list');
          if (mailCcListEl) {
            mailCcListEl.addEventListener('show.bs.collapse', mailCcListElShowHandler);
            mailCcListEl.addEventListener('hide.bs.collapse', mailCcListElHideHandler);
          }
        }, 100);
      }
    };

    const handleCloseMail = () => {
      const mailCcListEl = document.getElementById('cc_list');
      setTimeout(() => {
        if (mailCcListEl) {
          mailCcListEl.removeEventListener('show.bs.collapse', mailCcListElShowHandler);
          mailCcListEl.removeEventListener('hide.bs.collapse', mailCcListElHideHandler);
        }
        showMoreUsers.value = false;
        current_mail.value = {};
      }, 100);
      document.body.classList.remove('email-detail-show');
    };

    const handleComposeMail = () => {
      const staged = localStorage.getItem(
        `${process.env.BASE_URL.replace(/\//g, '_')}${hashData(
          `app_mail_${store.state.user.data.username}_staged`,
        )}`,
      );
      if (staged) {
        try {
          new_mail.value = JSON.parse(decryptData(staged));
        } catch (error) {
          // console.error(error);
        }
        localStorage.removeItem(
          `${process.env.BASE_URL.replace(/\//g, '_')}${hashData(
            `app_mail_${store.state.user.data.username}_staged`,
          )}`,
        );
      }
      handleCloseMail();
    };

    const handleSubmitMail = (data_state) => {
      new_mail.value.data_state = data_state;
      const apis = { createMail, updateMail };
      apis[new_mail.value.id ? 'updateMail' : 'createMail'](
        new_mail.value.id
          ? {
              mails: [new_mail.value],
            }
          : new_mail.value,
      ).then(({ code, msg }) => {
        if (code === 200) {
          mails.refetch = true;
          fetchMails();
          document.getElementById('hideComposeModalBtn').click();
          setTimeout(() => {
            handleCancelCompose();
          }, 500);
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
      new_mail.value = {
        to: [mail.created_by],
        cc: [],
        bcc: [],
        subject: `Re: ${mail.subject}`,
        content: `<br/><hr/><b>Sender:</b> ${mail.sender.fullname}<br/><b>Date:</b> ${moment(
          mail.created_at,
        ).format('llll')}<br/><b>To:</b> ${resolveUsers
          .value(mail.to)
          .map((item) => {
            return item.label;
          })
          .join(', ')}<br/>${
          mail.cc.length
            ? `<b>Cc:</b> ${resolveUsers
                .value(mail.cc)
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
      document.getElementById('showComposeModalBtn').click();
    };
    const handleReply2All = (mail, confirmed) => {
      if (!confirmed && ![...mail.to, ...mail.cc].includes(store.state.user.data.username)) {
        document.getElementById('showReply2AllConfirmModalBtn').click();
        return;
      }
      new_mail.value = {
        to: [
          ...[mail.created_by],
          ...mail.to.filter((username) => username != store.state.user.data.username),
        ],
        cc: mail.cc.filter((username) => username != store.state.user.data.username),
        bcc: [],
        subject: `Re: ${mail.subject}`,
        content: `<br/><hr/><b>Sender:</b> ${mail.sender.fullname}<br/><b>Date:</b> ${moment(
          mail.created_at,
        ).format('llll')}<br/><b>To:</b> ${resolveUsers
          .value(mail.to)
          .map((item) => {
            return item.label;
          })
          .join(', ')}<br/>${
          mail.cc.length
            ? `<b>Cc:</b> ${resolveUsers
                .value(mail.cc)
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
      if (new_mail.value.cc.length) {
        document.getElementById('CcRecipientsCollapse').classList.add('show');
      }
      document.getElementById('showComposeModalBtn').click();
    };
    const showCancelConfirmModal = () => {
      if (new_mail.value.data_state === 'drafted') {
        document.getElementById('hideComposeModalBtn').click();
        setTimeout(() => {
          handleCancelCompose();
        }, 500);
      } else document.getElementById('showCancelConfirmModalBtn').click();
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
        localStorage.removeItem(
          `${process.env.BASE_URL.replace(/\//g, '_')}${hashData(
            `app_mail_${store.state.user.data.username}_staged`,
          )}`,
        );
      } else {
        localStorage.setItem(
          `${process.env.BASE_URL.replace(/\//g, '_')}${hashData(
            `app_mail_${store.state.user.data.username}_staged`,
          )}`,
          encryptData(JSON.stringify(new_mail.value)),
        );
      }
    };

    return {
      new_mail,
      menus,
      labels,
      fetchMails,
      replaceHtml,
      handleClickMenuBtn,
      handleClickMailWrapper,
      mails,
      checkedMailIds,
      handleCheckMail,
      handleCheckAllMail,
      handleMarkOrUnmarkMails,
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
    };
  },
};
</script>
