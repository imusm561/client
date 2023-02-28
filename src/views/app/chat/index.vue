<template>
  <div class="chat-wrapper d-lg-flex gap-1 mx-n4 mt-n4 pt-1 ps-1 pe-1">
    <div class="chat-leftsidebar">
      <div class="px-4 pt-4 mb-4">
        <div class="d-flex align-items-start">
          <div class="flex-grow-1">
            <h5 class="mb-4">{{ $t('app.chat.chat') }}</h5>
          </div>
        </div>
        <div class="search-box">
          <input
            type="text"
            class="form-control bg-light border-light"
            :placeholder="$t('app.chat.filter')"
            v-model="search_contact"
          />
          <i class="mdi mdi-magnify fs-16 search-icon"></i>
        </div>
      </div>
      <div data-simplebar class="chat-room-list">
        <div v-if="chats.length" class="d-flex align-items-center px-4 mb-2">
          <div class="flex-grow-1">
            <h4 class="mb-0 fs-11 text-muted text-uppercase">{{ $t('app.chat.chats') }}</h4>
          </div>
        </div>
        <div v-if="chats.length" class="chat-message-list mb-4">
          <div class="list-unstyled chat-list chat-user-list">
            <li
              class
              v-for="chat in chats"
              :key="chat.id"
              :class="{ active: chat.username == current_chat.username }"
              @click="handleClickContact(chat)"
            >
              <a class="d-flex align-items-center cursor-pointer">
                <div
                  :class="`flex-shrink-0 chat-user-img ${
                    $store.state.org.onlines.includes(chat.username) ? 'online' : 'offline'
                  } user-own-img align-self-center me-2 ms-0`"
                >
                  <span class="user-status"></span>
                  <Avatar :data="chat" thumbnail />
                </div>
                <div class="flex-grow-1 overflow-hidden" style="line-height: 100%">
                  <div class="fs-14 text-dark">{{ chat.fullname }}</div>
                  <div class="fs-10 mt-1 text-muted text-truncate">
                    {{
                      chat.chat_data.length
                        ? chat.chat_data[chat.chat_data.length - 1].type === 'file'
                          ? JSON.parse(
                              decryptData(chat.chat_data[chat.chat_data.length - 1].message),
                            )?.name
                          : decryptData(chat.chat_data[chat.chat_data.length - 1].message)
                        : chat.post
                    }}
                  </div>
                </div>
                <div class="flex-shrink-0">
                  <span
                    v-if="
                      chat.chat_data.filter(
                        (data) =>
                          data.receiver === $store.state.user.data.username && !data.receiver_read,
                      ).length
                    "
                    class="badge badge-soft-dark rounded p-1"
                  >
                    {{
                      chat.chat_data.filter(
                        (data) =>
                          data.receiver === $store.state.user.data.username && !data.receiver_read,
                      ).length
                    }}
                  </span>
                </div>
              </a>
            </li>
          </div>
        </div>

        <div class="d-flex align-items-center px-4 pt-2 mb-2">
          <div class="flex-grow-1">
            <h4 class="mb-0 fs-11 text-muted text-uppercase">{{ $t('app.chat.contacts') }}</h4>
          </div>
        </div>
        <div class="chat-message-list">
          <div class="list-unstyled chat-list chat-user-list">
            <li
              class
              v-for="contact in contacts"
              :key="contact.id"
              @click="handleClickContact(contact)"
            >
              <a class="d-flex align-items-center cursor-pointer">
                <div
                  :class="`flex-shrink-0 chat-user-img ${
                    $store.state.org.onlines.includes(contact.username) ? 'online' : 'offline'
                  } user-own-img align-self-center me-2 ms-0`"
                >
                  <span class="user-status"></span>
                  <Avatar :data="contact" thumbnail />
                </div>
                <span class="d-flex flex-column w-75" style="line-height: 100%">
                  <span class="fs-14 text-dark">{{ contact.fullname }}</span>
                  <span class="mt-1 fs-10 text-muted text-truncate">{{ contact.post }}</span>
                </span>
              </a>
            </li>
          </div>
        </div>
      </div>
    </div>

    <div
      :class="`user-chat w-100 overflow-hidden ${current_chat.username ? 'user-chat-show' : ''}`"
    >
      <div class="chat-content d-lg-flex">
        <div class="w-100 overflow-hidden position-relative">
          <div class="position-relative" v-if="current_chat.username">
            <div class="p-2 user-chat-topbar">
              <div class="row align-items-center">
                <div class="col-sm-4 col-8">
                  <div class="d-flex align-items-center">
                    <div class="flex-shrink-0 d-block d-lg-none me-3">
                      <span @click="current_chat = {}" class="cursor-pointer fs-18 p-1">
                        <i class="mdi mdi-arrow-left align-bottom"></i>
                      </span>
                    </div>
                    <div class="flex-grow-1 overflow-hidden">
                      <div class="d-flex align-items-center">
                        <div
                          :class="`flex-shrink-0 chat-user-img ${
                            $store.state.org.onlines.includes(current_chat.username)
                              ? 'online'
                              : 'offline'
                          } user-own-img align-self-center me-2 ms-0`"
                        >
                          <span
                            class="user-status"
                            style="width: 12px; height: 12px; right: 2px"
                          ></span>
                          <Avatar size="sm" :data="current_chat" thumbnail />
                        </div>
                        <div class="flex-grow-1 overflow-hidden">
                          <h5 class="text-truncate mb-0 fs-16">
                            <a
                              class="text-reset username"
                              data-bs-toggle="offcanvas"
                              href="#userProfileOffcanvas"
                              aria-controls="userProfileOffcanvas"
                            >
                              {{ current_chat.fullname || current_chat.username }}
                            </a>
                          </h5>
                          <p class="text-truncate text-muted fs-14 mb-0 mt-1 userStatus">
                            <small>
                              {{
                                $store.state.org.onlines.includes(current_chat.username)
                                  ? $t('app.chat.online')
                                  : $t('app.chat.offline')
                              }}
                            </small>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-sm-8 col-4">
                  <ul class="list-inline user-chat-nav text-end mb-0">
                    <li class="list-inline-item m-0">
                      <div class="dropdown">
                        <button
                          class="btn btn-ghost-secondary btn-icon"
                          type="button"
                          data-bs-toggle="dropdown"
                          aria-haspopup="true"
                          aria-expanded="false"
                        >
                          <i class="mdi mdi-dots-vertical fs-22"></i>
                        </button>
                        <div class="dropdown-menu dropdown-menu-end">
                          <span
                            class="dropdown-item cursor-pointer d-block d-lg-none user-profile-show"
                            data-bs-toggle="offcanvas"
                            data-bs-target="#userProfileOffcanvas"
                            aria-controls="userProfileOffcanvas"
                          >
                            <i class="mdi mdi-information align-bottom text-muted me-2"></i>
                          </span>
                          <span class="dropdown-item cursor-pointer" @click="current_chat = {}">
                            <i class="mdi mdi-close align-bottom text-muted me-2"></i>
                            {{ $t('app.chat.close') }}
                          </span>
                          <span class="dropdown-item cursor-pointer" @click="handleDelChat">
                            <i class="mdi mdi-delete-outline align-bottom text-muted me-2"></i>
                            {{ $t('app.chat.delete') }}
                          </span>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div class="position-relative" id="user-chat">
              <div data-simplebar class="chat-conversation p-3 p-lg-4">
                <ul class="chat-conversation-list">
                  <li
                    v-for="(data, index) in current_chat.chat_data"
                    :key="index"
                    :class="{
                      right: data.sender == $store.state.user.data.username,
                      left: data.sender == current_chat.username,
                    }"
                    class="chat-list"
                  >
                    <div class="conversation-list">
                      <div
                        class="chat-avatar"
                        v-if="data.sender != $store.state.user.data.username"
                      >
                        <Avatar :data="current_chat" />
                      </div>
                      <div class="user-chat-content">
                        <div class="ctext-wrap">
                          <div class="ctext-wrap-content">
                            <span v-if="data.quote && data.quote.id" class="mb-0 ctext-content">
                              <span class="d-flex justify-content-between" style="min-width: 120px">
                                <p>
                                  “
                                  {{
                                    getUserInfo(data.quote.sender)?.fullname || data.quote.sender
                                  }}
                                </p>
                                <small class="text-muted time">
                                  <span
                                    v-if="
                                      $moment(data.quote.created_at).format('YYYYMMDD') !=
                                      $moment().format('YYYYMMDD')
                                    "
                                  >
                                    {{ $moment(data.created_at).format('lll') }}
                                  </span>
                                  <span v-else>{{ $moment(data.created_at).format('HH:mm') }}</span>
                                </small>
                              </span>
                              <Message :item="data.quote" />
                              <hr />
                            </span>
                            <Message :item="data" />
                          </div>
                          <div class="dropdown align-self-start message-box-drop">
                            <a
                              class="dropdown-toggle"
                              role="button"
                              @click="handleClickQuote(data)"
                            >
                              <i class="mdi mdi-comment-quote-outline text-muted align-bottom"></i>
                            </a>
                          </div>
                          <div class="conversation-name">
                            <small class="text-muted time">
                              <span
                                v-if="
                                  index === 0 ||
                                  (index > 0 &&
                                    $moment(current_chat.chat_data[index].created_at).format(
                                      'YYYYMMDD',
                                    ) !=
                                      $moment(current_chat.chat_data[index - 1].created_at).format(
                                        'YYYYMMDD',
                                      ))
                                "
                              >
                                {{ $moment(data.created_at).format('llll') }}
                              </span>
                              <span v-else>{{ $moment(data.created_at).format('HH:mm') }}</span>
                            </small>
                            <span class="text-success check-message-icon">
                              <i
                                :class="`mdi mdi-${
                                  data.id === 0
                                    ? 'spin mdi-loading'
                                    : data.receiver_read
                                    ? 'check-all'
                                    : 'check'
                                } align-bottom`"
                              ></i>
                            </span>
                            <span
                              v-if="
                                data.id &&
                                ($moment().valueOf() - $moment(data.created_at).valueOf()) / 1000 <
                                  120 &&
                                data.sender === $store.state.user.data.username &&
                                !data.receiver_read
                              "
                              class="text-primary check-message-icon cursor-pointer"
                              @click="handleWithdrawMsg(data)"
                            >
                              <i class="mdi mdi-restart align-bottom"></i>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            <div class="chat-input-section">
              <div class="chat-input-toolpanel d-flex align-items-center cursor-pointer">
                <div class="flex-shrink-0 align-self-center ms-0 d-flex">
                  <div class="dropup">
                    <i
                      class="fs-20 me-2 text-muted mdi mdi-emoticon-outline cursor-pointer"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    ></i>
                    <div
                      data-simplebar
                      class="dropdown-menu p-0"
                      style="width: 100vw; max-width: 340px; height: 220px"
                    >
                      <div class="row g-0">
                        <div
                          class="emoji col-1 text-center fs-20"
                          style="border-radius: 5px"
                          v-for="(item, index) in emoji.split(',')"
                          :key="index"
                          @click="handleClickEmoji(item)"
                        >
                          {{ item }}
                        </div>
                      </div>
                    </div>
                  </div>
                  <i
                    class="fs-20 me-2 text-muted mdi mdi-folder-outline cursor-pointer"
                    @click="handleClickFileInput"
                  ></i>
                  <Uploader
                    class="d-none"
                    :multiple="false"
                    @added="handleAddedFile"
                    @completed="handleCompletedFile"
                  />
                  <!-- <i class="fs-20 me-2 text-muted mdi mdi-content-cut"></i> -->
                </div>
                <div v-if="quote" class="flex-grow-1 overflow-hidden">
                  <small
                    class="chat-quote text-muted text-truncate"
                    @click="quote = null"
                    :title="$t('app.chat.quote.remove')"
                  >
                    {{ $t('app.chat.quote') }}:
                    {{
                      quote.type === 'file'
                        ? JSON.parse(decryptData(quote.message))?.name
                        : decryptData(quote.message)
                    }}
                  </small>
                </div>
                <div class="flex-shrink-0"></div>
              </div>

              <div class="chat-input-area">
                <textarea
                  id="message_input"
                  class="form-control"
                  style="resize: none; border: none; height: 110px"
                  v-model="message"
                  @keydown="handleKeyDownEvent"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="offcanvas offcanvas-end border-0" tabindex="-1" id="userProfileOffcanvas">
      <div v-if="current_chat.id" class="offcanvas-body profile-offcanvas p-0">
        <div class="">
          <div class="team-settings">
            <div class="row g-0">
              <div class="col">
                <div class="btn nav-btn">
                  <button
                    type="button"
                    class="btn-close btn-close-dark"
                    data-bs-dismiss="offcanvas"
                    aria-label="Close"
                  ></button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="p-3 text-center">
          <a class="d-flex justify-content-center align-items-center cursor-pointer">
            <div
              :class="`flex-shrink-0 chat-user-img ${
                $store.state.org.onlines.includes(current_chat.username) ? 'online' : 'offline'
              } user-own-img align-self-center`"
            >
              <span class="user-status" style="width: 15px; height: 15px; right: 5px"></span>
              <Avatar :data="current_chat" size="md" thumbnail />
            </div>
          </a>
          <h5 class="mt-3 mb-1">{{ current_chat.fullname }}</h5>
          <p class="text-muted text-capitalize">{{ current_chat.post }}</p>

          <div class="d-flex gap-2 justify-content-center">
            <button
              type="button"
              class="btn avatar-xs p-0"
              data-bs-toggle="tooltip"
              data-bs-placement="top"
            >
              <span class="avatar-title rounded bg-light text-body">
                <a :href="`tel:${current_chat.phone}`"><i class="mdi mdi-phone"></i></a>
              </span>
            </button>

            <button
              type="button"
              class="btn avatar-xs p-0"
              data-bs-toggle="tooltip"
              data-bs-placement="top"
            >
              <span class="avatar-title rounded bg-light text-body">
                <a :href="`mailto:${current_chat.phone}`"><i class="mdi mdi-email"></i></a>
              </span>
            </button>
          </div>
        </div>

        <div class="border-top border-top-dashed p-3">
          <h5 class="fs-15 mb-3">{{ $t('app.chat.personalDetails') }}</h5>
          <div class="mb-3">
            <p class="text-muted text-uppercase fw-medium fs-12 mb-1">
              {{ $t('app.chat.personalDetails.phone') }}
            </p>
            <h6>{{ current_chat.phone }}</h6>
          </div>
          <div class="mb-3">
            <p class="text-muted text-uppercase fw-medium fs-12 mb-1">
              {{ $t('app.chat.personalDetails.email') }}
            </p>
            <h6>{{ current_chat.email }}</h6>
          </div>
          <div class="mb-3">
            <p class="text-muted text-uppercase fw-medium fs-12 mb-1">
              {{ $t('app.chat.personalDetails.department') }}
            </p>
            <h6>
              {{ $store.state.org.depts.find((dept) => dept.id === current_chat.dept)?.name }}
            </h6>
          </div>
          <div class="mb-3">
            <p class="text-muted text-uppercase fw-medium fs-12 mb-1">
              {{ $t('app.chat.personalDetails.loginCount') }}
            </p>
            <h6>{{ current_chat.login_count || 'Never' }}</h6>
          </div>
          <div>
            <p class="text-muted text-uppercase fw-medium fs-12 mb-1">
              {{ $t('app.chat.personalDetails.lastLoginAt') }}
            </p>
            <h6>
              {{
                current_chat.last_login_at ? $moment(current_chat.last_login_at).fromNow() : 'Never'
              }}
            </h6>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import store from '@store';
import { computed, onMounted, ref, reactive, watch, onUnmounted } from 'vue';
import { getChats, sendMsg, withdrawMsg, readMsg, delChat } from '@api/app/chat';
import { useRouter, getUserInfo, encryptData, decryptData } from '@utils';
import { useToast } from 'vue-toastification';
import ToastificationContent from '@components/ToastificationContent';
import Avatar from '@components/Avatar';
import Uploader from '@components/Uploader';
import Message from './Message';
export default {
  components: {
    Avatar,
    Uploader,
    Message,
  },
  setup() {
    const toast = useToast();
    const socket = window.socket;
    const { route } = useRouter();

    const _chats = ref([]);
    const _contacts = computed(() => {
      return store.state.org.users.filter(
        (user) => user.username !== store.state.user.data.username,
      );
    });

    const search_contact = ref('');

    const chats = computed(() => {
      if (search_contact.value)
        return _chats.value.filter(
          (chat) =>
            chat.username.toLowerCase().includes(search_contact.value.toLowerCase()) ||
            chat.fullname.toLowerCase().includes(search_contact.value.toLowerCase()),
        );
      else return _chats.value;
    });
    const contacts = computed(() => {
      if (search_contact.value)
        return _contacts.value.filter(
          (user) =>
            user.username.toLowerCase().includes(search_contact.value.toLowerCase()) ||
            user.fullname.toLowerCase().includes(search_contact.value.toLowerCase()),
        );
      else return _contacts.value;
    });

    const scrollToBottom = (behavior = 'auto') => {
      setTimeout(() => {
        if (document.getElementById('user-chat')) {
          const chatConversationList = document
            .getElementById('user-chat')
            .querySelector('.chat-conversation .simplebar-content-wrapper');
          const offsetHeight =
            document.getElementById('user-chat').getElementsByClassName('chat-conversation-list')[0]
              .scrollHeight -
            window.innerHeight +
            600;
          chatConversationList.scrollTo({
            top: offsetHeight,
            behavior,
          });
          setTimeout(() => {
            document.getElementById('message_input').focus();
          }, 50);
        }
      }, 0);
    };

    const current_chat = ref({});

    watch(
      () => current_chat.value.chat_data,
      (val) => {
        if (val) {
          scrollToBottom('smooth');
          const unReadData = current_chat.value.chat_data.filter(
            (data) => data.receiver === store.state.user.data.username && !data.receiver_read,
          );
          if (unReadData.length) {
            handleReadMsg(() => {
              unReadData.map((data) => {
                data.receiver_read = true;
                return data;
              });
            });
          }
        }
      },
      { immediate: true, deep: true },
    );

    onMounted(() => {
      getChats().then(({ code, data, msg }) => {
        if (code === 200) {
          _chats.value = data
            .filter((chat) => _contacts.value.find((contact) => contact.username === chat.username))
            .map((chat) => {
              const contact = _contacts.value.find((contact) => contact.username === chat.username);
              return {
                ...contact,
                ...chat,
              };
            });

          watch(
            () => route.value.query,
            (val) => {
              if (val.contact) {
                let contact = _contacts.value.find((contact) => contact.username === val.contact);
                if (contact) handleClickContact(contact);
              }
            },
            { immediate: true },
          );
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

      socket.on('onReceiverReadMsg', (data) => {
        let _chat = _chats.value.find((chat) => chat.username === data.receiver);
        if (_chat) {
          _chat.chat_data.map((data) => {
            data.receiver_read = true;
            return data;
          });
        }
      });

      socket.on('receiveMsg', (data) => {
        let _chat = _chats.value.find((chat) => chat.username === data.sender);
        if (_chat) {
          _chat.chat_data.push({
            id: data.id,
            created_at: data.created_at,
            sender: data.sender,
            receiver: data.receiver,
            message: data.message,
            quote: data.quote,
            receiver_read: current_chat.value.username === data.sender ? true : false,
          });
          if (current_chat.value.username === data.sender) handleReadMsg();
        } else {
          let contact = _contacts.value.find((contact) => contact.username == data.sender);
          if (contact) {
            _chat = {
              ...contact,
              ...{
                chat_data: [
                  {
                    id: data.id,
                    created_at: data.created_at,
                    sender: data.sender,
                    receiver: data.receiver,
                    message: data.message,
                    quote: data.quote,
                    receiver_read: false,
                  },
                ],
              },
            };
            _chats.value.push(_chat);
          }
        }
      });

      socket.on('withdrawMsg', (data) => {
        let _chat = _chats.value.find((chat) => chat.username === data.sender);
        if (_chat) {
          const index = _chat.chat_data.findIndex((item) => item.id === data.id);
          if (index !== -1) _chat.chat_data.splice(index, 1);
        }
      });
    });

    onUnmounted(() => {
      socket.removeListener('onReceiverReadMsg');
      socket.removeListener('receiveMsg');
      socket.removeListener('withdrawMsg');
    });

    const handleClickContact = (contact) => {
      store.commit('user/DEL_NOTICE', {
        app: 'chat',
        data: { user: contact },
      });
      let chat = _chats.value.find((chat) => chat.username === contact.username);
      if (!chat) {
        chat = {
          ...contact,
          ...{
            chat_data: [],
          },
        };
        _chats.value.push(chat);
      }
      current_chat.value = chat;
      search_contact.value = '';
      scrollToBottom();
    };

    const quote = ref(null);
    const message = ref('');

    const handleKeyDownEvent = (e) => {
      if (e.keyCode == 13) {
        if (!e.metaKey) {
          e.preventDefault();
          handleSendMsg();
        } else {
          message.value = message.value + '\n';
        }
      }
    };

    const handleClickEmoji = (item) => {
      message.value += item;
      setTimeout(() => {
        document.getElementById('message_input').focus();
      }, 50);
    };

    const handleClickFileInput = () => {
      document.getElementById('uploadFile').click();
    };

    const handleAddedFile = (e) => {
      const temp_file = {
        category: e.category,
        extension: e.extension,
        name: e.name,
        size: e.size,
      };
      const temp_data = reactive({
        key: e.key,
        id: 0,
        created_at: new Date(),
        sender: store.state.user.data.username,
        receiver: current_chat.value.username,
        type: 'file',
        message: encryptData(JSON.stringify(temp_file)),
        quote: quote.value,
      });
      current_chat.value.chat_data.push(temp_data);
    };

    const handleCompletedFile = (e) => {
      const temp_data = current_chat.value.chat_data.find((item) => item.key === e.key);
      if (temp_data) {
        temp_data.message = encryptData(JSON.stringify(e.data));
        sendMsg({
          uid: e.data.id,
          sender: temp_data.sender,
          receiver: temp_data.receiver,
          type: temp_data.type,
          message: temp_data.message,
          quote: temp_data.quote,
        }).then(({ code, msg, data }) => {
          if (code === 200) {
            temp_data.id = data.id;
            temp_data.created_at = data.created_at;
            delete temp_data.key;
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

    const handleSendMsg = () => {
      if (message.value.trim()) {
        const temp_data = reactive({
          id: 0,
          created_at: new Date(),
          sender: store.state.user.data.username,
          receiver: current_chat.value.username,
          type: 'text',
          message: encryptData(message.value.trim()),
          quote: quote.value,
        });
        message.value = '';
        current_chat.value.chat_data.push(temp_data);
        sendMsg({
          sender: temp_data.sender,
          receiver: temp_data.receiver,
          type: temp_data.type,
          message: temp_data.message,
          quote: temp_data.quote,
        }).then(({ code, msg, data }) => {
          if (code === 200) {
            temp_data.id = data.id;
            temp_data.created_at = data.created_at;
            quote.value = null;
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

    const handleClickQuote = (data) => {
      quote.value = data;
      setTimeout(() => {
        document.getElementById('message_input').focus();
      }, 50);
    };

    const handleWithdrawMsg = (data) => {
      withdrawMsg({
        id: data.id,
      }).then(({ code, msg }) => {
        if (code === 200) {
          const idx = current_chat.value.chat_data.findIndex((item) => item.id === data.id);
          if (idx != -1) current_chat.value.chat_data.splice(idx, 1);
          quote.value = data.quote;
          message.value = data.message;
        } else
          toast({
            component: ToastificationContent,
            props: {
              variant: 'danger',
              icon: 'mdi-alert',
              text: msg,
            },
          });
      });
    };

    const handleReadMsg = (callback) => {
      readMsg({
        contact: current_chat.value.username,
      }).then(({ code, msg }) => {
        if (code === 200) callback && callback();
        else
          toast({
            component: ToastificationContent,
            props: {
              variant: 'danger',
              icon: 'mdi-alert',
              text: msg,
            },
          });
      });
    };

    const handleDelChat = () => {
      delChat({
        contact: current_chat.value.username,
      }).then(({ code, msg }) => {
        if (code === 200) {
          current_chat.value = {};
          const idx = _chats.value.findIndex(
            (chat) => chat.username === current_chat.value.username,
          );
          _chats.value.splice(idx, 1);
        } else
          toast({
            component: ToastificationContent,
            props: {
              variant: 'danger',
              icon: 'mdi-alert',
              text: msg,
            },
          });
      });
    };

    return {
      search_contact,
      chats,
      contacts,
      current_chat,
      handleClickContact,
      quote,
      message,
      handleKeyDownEvent,
      emoji:
        '😀,😁,😂,😃,😄,😅,😆,😉,😊,😋,😎,😍,😘,😗,😙,😚,😇,😐,😑,😶,😏,😣,😥,😮,😯,😪,😫,😴,😌,😛,😜,😝,😒,😓,😔,😕,😲,😷,😖,😞,😟,😤,😢,😭,😦,😧,😨,😬,😰,😱,😳,😵,😡,😠,💘,❤,💓,💔,💕,💖,💗,💙,💚,💛,💜,💝,💞,💟,❣,💪,👈,👉,☝,👆,👇,✌,✋,👌,👍,👎,✊,👊,👋,👏,👐,✍,🍇,🍈,🍉,🍊,🍋,🍌,🍍,🍎,🍏,🍐,🍑,🍒,🍓,🍅,🍆,🌽,🍄,🌰,🍞,🍖,🍗,🍔,🍟,🍕,🍳,🍲,🍱,🍘,🍙,🍚,🍛,🍜,🍝,🍠,🍢,🍣,🍤,🍥,🍡,🍦,🍧,🍨,🍩,🍪,🎂,🍰,🍫,🍬,🍭,🍮,🍯,🍼,☕,🍵,🍶,🍷,🍸,🍹,🍺,🍻,🍴,🌹,🍀,🍎,💰,📱,🌙,🍁,🍂,🍃,🌷,💎,🔪,🔫,🏀,⚽,⚡,👄,👍,🔥,🙈,🙉,🙊,🐵,🐒,🐶,🐕,🐩,🐺,🐱,😺,😸,😹,😻,😼,😽,🙀,😿,😾,🐈,🐯,🐅,🐆,🐴,🐎,🐮,🐂,🐃,🐄,🐷,🐖,🐗,🐽,🐏,🐑,🐐,🐪,🐫,🐘,🐭,🐁,🐀,🐹,🐰,🐇,🐻,🐨,🐼,🐾,🐔,🐓,🐣,🐤,🐥,🐦,🐧,🐸,🐊,🐢,🐍,🐲,🐉,🐳,🐋,🐬,🐟,🐠,🐡,🐙,🐚,🐌,🐛,🐜,🐝,🐞,🦋,😈,👿,👹,👺,💀,☠,👻,👽,👾,💣',
      handleClickEmoji,
      handleClickFileInput,
      handleAddedFile,
      handleCompletedFile,
      handleSendMsg,
      handleClickQuote,
      handleWithdrawMsg,
      handleDelChat,
      getUserInfo,
      decryptData,
    };
  },
};
</script>
