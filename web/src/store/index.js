import Vue from "vue";
import Vuex from "vuex";

import auth from "./auth";
import home from "@/modules/home/store";
import employee from "@/modules/employee/store";
import authority from "@/modules/forms/store";
import department from "@/modules/departments/store";
import administration from "@/modules/administration/store";
import vrooziReports from "@/modules/reports/store/vroozi-store";
import reports from "@/modules/reports/store/reports-store";
import { secureGet } from "./jwt";
import { USER_URL } from "@/urls";
import forms from "@/modules/forms/store";

Vue.use(Vuex);

export default new Vuex.Store({
  getters: {},
  state: {
    user: {},
    initializationComplete: false,
  },
  mutations: {
    SET_USER(state, payload) {
      state.user = payload;
    },
    SET_COMPLETE(state, value) {
      state.initializationComplete = value;
    },
  },
  actions: {
    async initialize(state) {
      console.log("Initializing Store");

      await this.dispatch("department/initialize");
      await this.dispatch("home/initialize");

      console.log("Initializing Complete");

      state.commit("SET_COMPLETE", true);
      //state.initializationComplete = true;
    },
    async getCurrentUser(state) {
      let userResp = await secureGet(`${USER_URL}/me`);
      state.commit("SET_USER", userResp.data.data);
      return userResp.data.data;
    },
  },
  modules: {
    home,
    auth,
    employee,
    authority,
    department,
    administration,
    forms,
    vrooziReports,
    reports,
  },
});
