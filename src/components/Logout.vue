<template>
  <div>
    <h1>Logout Success</h1>
    <router-link :to="{ name: 'login'}">Login</router-link>
  </div>
</template>
<script>
export default {
  data() {
    return {};
  },
  created: function(){
    this.logout();
  },
  methods: {
    async logout() {
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
    },
  },
};
</script>
