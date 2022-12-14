<template>
  <div>
    <Breadcrumb :key="$route" />

    <div class="row">
      <div class="col-xxl-4">
        <Dept
          @setDepts="
            ($event) => {
              depts = $event;
            }
          "
        />
      </div>
      <div class="col-xxl-8">
        <Role
          @setRole="
            ($event) => {
              role = $event;
            }
          "
        />
      </div>
    </div>
    <!--end row-->

    <div class="card">
      <User
        :depts="depts"
        :role="role"
        @clearDepts="
          () => {
            depts = [];
          }
        "
        @clearRole="
          () => {
            role = {};
          }
        "
      />
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import Breadcrumb from '@/layouts/breadcrumb';
import Dept from './components/dept.vue';
import Role from './components/role.vue';
import User from './components/user.vue';
export default {
  components: {
    Breadcrumb,
    Dept,
    Role,
    User,
  },
  setup() {
    const depts = ref([]);
    const role = ref({});
    return {
      depts,
      role,
    };
  },
};
</script>
