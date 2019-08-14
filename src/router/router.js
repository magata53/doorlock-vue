import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const menuLink = [
  {
    name: "home",
    path: "/",
    component: () => import("../components/Home.vue")
  },
  {
    name: "face",
    path: "/face",
    component: () => import("../components/Face.vue")
  },
  {
    name: "fingerprint",
    path: "/fingerprint",
    component: () => import("../components/Fingerprint.vue")
  },
  {
    name: "access-denied",
    path: "/access-denied/:type",
    props: true,
    component: () => import("../components/AccessDenied.vue")
  }
];

const router = new VueRouter({
  routes: menuLink,
  mode: "history"
});

export default router;
