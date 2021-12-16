import Router from 'vue-router'
import jwtDecode from 'jwt-decode';
import Login from './components/Login.vue';
import Logout from './components/Logout.vue';
import Employee from './components/Employee.vue';
import Review from './components/Reviews.vue';
import MyReview from './components/MyReviews.vue';

const ROLE = {
  ADMIN: 0,
  EMPLOYEE: 1,
};

const router = new Router({
    routes: [
      {
        name: 'login',
        path: '/login',
        component: Login,
      },
      {
        name: 'logout',
        path: '/logout',
        component: Logout,
      },
      {
        name: 'employee',
        path: '/employee',
        component: Employee,
        meta: {
            requiresAuth: true,
            role: ROLE.ADMIN,
        },
      },
      {
        name: 'review',
        path: '/review',
        component: Review,
        meta: {
          requiresAuth: true,
          role: ROLE.ADMIN,
        }
      },
      {
        name: 'my_reviews',
        path: '/my_reviews',
        component: MyReview,
        meta: {
          requiresAuth: true,
          role: ROLE.EMPLOYEE,
        }
      },
      {
        path: '*',
        component: {
          render (h) { return h('div', '404. Not Found.') }
        }
      }
    ]
});

router.beforeEach((to, from, next) => {
    if (!to.matched.some((record) => record.meta.requiresAuth)) {
      next();
      return;
    } 
    
    const token = localStorage.getItem("token");
    if (token == null) {
      next({
        path: "/login",
        params: { nextUrl: to.fullPath },
      });
      return
    }

    // token expired
    const payload = jwtDecode(token);
    if (payload.exp * 1000 <= new Date().getTime()) {
      localStorage.removeItem("token");
      next({
        path: "/login",
        params: { nextUrl: to.fullPath },
      });
      return
    }

    if (to.matched.some((record) => record.meta.role === payload.role !== undefined)) {
      const role = payload.role;
      const needBeRole = to.matched[0].meta.role;

      if (needBeRole != role) {
        next({
          path: "/login",
        });
        return;
      }
    }


    next();
});

export default router;
