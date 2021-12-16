<template>
  <div id="app">
  <div class="container m-5">
    <form @submit.prevent="userLogin">
      <h3>Login</h3>

      <div class="form-group">
        <label>email: </label>
        <input
          type="email"
          class="form-control form-control-lg"
          v-model="user.email"
        />
      </div>

      <div class="form-group">
        <label>password: </label>
        <input
          type="password"
          class="form-control form-control-lg"
          v-model="user.password"
        />
      </div>

      <button type="submit" class="btn btn-dark btn-lg btn-block">Login</button>
    </form>
  </div>
  </div>
</template>
<script>
import jwtDecode from 'jwt-decode';
import {
    LOGIN
} from '../mutation';

export default {
  data() {
    return {
      user: {
        email: "",
        password: "",
      },
    };
  },
  created: function(){
    this.autoRedirect();
  },
  methods: {
    autoRedirect() {
      const token = localStorage.getItem('token');
      if (token) {
        const payload = jwtDecode(token);
        if (payload.role == 0) {
          this.$router.push({ name: 'employee' })              
        } else {
          this.$router.push({ name: 'my_reviews' });
        }
      }
    },
    async userLogin() {
        try {
            const response = await this.$apollo.mutate({
                mutation: LOGIN,
                variables: {
                    email: this.user.email,
                    password: this.user.password
                }
            })

            const token = response.data.login;
            localStorage.setItem('token', token);

            const payload = jwtDecode(token);
            localStorage.setItem('userId', payload.subject);
            this.autoRedirect();
        } catch(error) {
            alert(error.message)
        }
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>