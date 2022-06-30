import { DEPARTMENT_URL } from "@/urls";
import { secureGet } from "@/store/jwt"

const state = {
    departments: [],
};

const getters = {
    departmentList: (state) => {
        return state.departments.map(a => ({"descr": a.descr, "dept": a.dept, "display_name": a.display_name }))
    },

 }
const actions = {
    async initialize(store) {
        console.log("-- Initializing Department Store")
        await store.dispatch("loadDepartments")
    },
    async loadDepartments({ commit }) {
        secureGet(`${DEPARTMENT_URL}`).then(resp => {
            commit("setDepartments", resp.data.data);
            return resp.data.data;
        }).catch(() => {
            commit("setDepartments", []);
        });
    },
    async getDepartment(store, { id }) {
        console.log("In Gets Department")
        if (store.state.departments.length == 0) {
            return secureGet(`${DEPARTMENT_URL}/${id}`).then(resp => {
                return resp.data.data;
            }).catch(() => { })
        }

        let dept = store.state.departments.filter(d => d.dept == id);
        console.log (dept)
        return dept[0];
    },
    // async getFormAList(store, { id }) {
    //     return secureGet(`${DEPARTMENT_URL}/${id}/form-a`).then(resp => {
    //         return resp.data.data
    //     })
    // },
    // async getFormBList(store, { id }) {
    //     return secureGet(`${DEPARTMENT_URL}/${id}/form-b`).then(resp => {
    //         return resp.data.data
    //     })
    // },
};

const mutations = {
    setDepartments(state, value) {
        state.departments = value;
    },
};

export default {
    namespaced: true,
    state,
    actions,
    mutations,
    getters
};