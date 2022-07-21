import { FORMA_URL } from "@/urls";
import _ from "lodash";

import { getInstance } from "@/auth/auth0-plugin"


const state = {
    formA: { employee: {}, department: {} }
};

const actions = {
    async loadFormA({ commit }, id) {
    //   console.log(`FormA ID: ${id}`)
      const auth = getInstance()
      return auth.get(`${FORMA_URL}/${id}`)
        .then(resp => {
            commit("setFormA", resp.data.data);
            return resp.data.data

        }).catch(() => {
            commit("setFormA", {});
        });
  },
  async createFormA({ commit }, item) {
    const auth = getInstance()
    // console.log(item)

    return auth.post(`${FORMA_URL}`, item)
        .then(resp => {
            commit("setFormA", resp.data.data);
            return resp.data.data

        }).catch(() => {
            commit("setFormA", {});
        });
  },
  async saveFormA({ commit }, item) {
    const auth = getInstance()
      let body = _.clone(item);
      delete body.employee;
      delete body.department;
      delete body._id;

      return auth.put(`${FORMA_URL}/${item._id}`, body)
          .then(resp => {
              commit("setFormA", resp.data.data);
              return resp.data.data

          }).catch(() => {
              commit("setFormA", {});
          });
  },
  async archiveFormA({ commit,state }, archiveDetails) {
    const auth = getInstance()
    // const params = {
    //     archive: true
    // };

    let body = _.clone(state.formA);
    console.log("Clone state...")
    console.table(body)
    body.archived = archiveDetails;
    delete body._id;

    return auth.put(`${FORMA_URL}/${state.formA._id}`, body)
        .then(resp => {
            commit("setFormA",{});
            console.log("got a 200 response")
            return resp.code

        }).catch(() => {

            console.log(`Error archiving form A ${state.formA._id}`)
            commit("setFormA", {});
        });
  },
  async downloadFormA(state, id) {
      const auth = getInstance()
        return auth.get(`${FORMA_URL}/${id}/pdf`)
          .then(resp => {
              //commit("setFormB", resp.data.data);
            //   console.log(resp)
              return resp.data.data

          }).catch(() => {
              //commit("setFormB", {});
          });
  },
    // Department Sepcific FormAs
  async getDepartmentFormAList(state, department_code){
      const auth = getInstance()
      const a = await auth.get(`${FORMA_URL}/department/${department_code}`)
      return a.data.data
  }
};

const mutations = {
    setFormA(state, value) {
        state.formA = value;
    },
};

export default {
    namespaced: true,
    state,
    // getters,
    actions,
    mutations
};