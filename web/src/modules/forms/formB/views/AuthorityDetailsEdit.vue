<template>
  <v-container fluid class="down-top-padding">
    <BaseBreadcrumb :title="page.title" :icon="page.icon" :breadcrumbs="breadcrumbs"> </BaseBreadcrumb>

    <v-overlay absolute :value="is_loading">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>

    <BaseCard :showHeader="true" :heading="`Form B for ${formB.employee.name}`">
      <template slot="right">
        <v-btn color="primary" small class="mr-5" text @click="closeClick">Cancel</v-btn>
        <v-btn color="primary" @click="saveClick" :disabled="!canSave">Save</v-btn>
      </template>

      <v-row>
        <v-col>
          <v-alert type="warning" v-if="formB.reject_comments">Rejection Comment: {{ formB.reject_comments }}</v-alert>

          <v-card class="default">
            <v-card-text>
              <table
                border="0"
                cellspacing="0"
                cellpadding="0"
                class="table"
                style="background-color: white;width: 100%;text-align: left;"
              >
                <thead>
                  <tr>
                    <th
                      rowspan="5"
                      colspan="3"
                      style="text-align: left;padding: 10px;vertical-align: top;height: 190px;font-weight: 400;"
                    >
                      <h3>Delegate:</h3>

                      <v-text-field
                        v-model="formB.employee.name"
                        readonly
                        label="Public Officer Name"
                        append-icon="mdi-lock"
                      ></v-text-field>

                      <v-text-field
                        readonly
                        v-model="formB.department_descr"
                        label="Department"
                        append-icon="mdi-lock"
                      ></v-text-field>

                      <v-text-field
                        v-model="formB.program_branch"
                        label="Program"
                        readonly
                        append-icon="mdi-lock"
                      ></v-text-field>

                      <v-text-field
                        :value="formB.activity || formB.form_a.activity"
                        label="Actviity"
                        readonly
                        append-icon="mdi-lock"
                      ></v-text-field>

                      <v-text-field
                        v-model="formB.employee.title"
                        label="Position title"
                        readonly
                        append-icon="mdi-lock"
                      ></v-text-field>
                    </th>
                    <th colspan="12">SPENDING AUTHORITY</th>
                    <th rowspan="3" class="rotate" style="height: 140px">
                      <div>
                        PAYMENT<br />
                        AUTHORITY s.30
                      </div>
                    </th>
                  </tr>
                  <tr>
                    <th colspan="6">PROCUREMENT</th>
                    <th rowspan="2" colspan="2" style="max-width: 80px">
                      TRANSFER PAYMENTS
                    </th>
                    <th colspan="3" rowspan="2">OTHER:<br />S.24 COMMITMENT & <br />S.23 SIGNING CONTRACT</th>
                    <th rowspan="2">S.29</th>
                  </tr>
                  <tr>
                    <th colspan="4">S.24 Commitment</th>
                    <th colspan="2" style="max-width: 80px">
                      S.23 Signing Contract
                    </th>
                  </tr>
                  <tr>
                    <th colspan="2" style="max-width: 80px">
                      OWN PROCUREMENT
                    </th>
                    <th rowspan="4" class="rotate">
                      <div>Request for goods<br />or services</div>
                    </th>
                    <th rowspan="4" class="rotate">
                      <div>Assignment <br />Authority</div>
                    </th>
                    <th rowspan="4" class="rotate">
                      <div class="mb-2">Goods</div>
                    </th>
                    <th rowspan="4" class="rotate">
                      <div class="mb-2">Services</div>
                    </th>
                    <th rowspan="4" class="rotate">
                      <div class="mb-2">S.24 Commitment</div>
                    </th>
                    <th rowspan="4" class="rotate">
                      <div>S.23 Signing<br />contract</div>
                    </th>
                    <th rowspan="4" class="rotate">
                      <div>S.24 Travel <br />authorization</div>
                    </th>
                    <th rowspan="4" class="rotate">
                      <div>Other contracts &<br />Expenditures</div>
                    </th>
                    <th rowspan="4" class="rotate">
                      <div>Loans & <br />Guarantees</div>
                    </th>
                    <th rowspan="4" class="rotate">
                      <div>Certificate of <br />performance</div>
                    </th>
                    <th rowspan="4" class="rotate">
                      <div>Requisition<br />for payment</div>
                    </th>
                  </tr>
                  <tr>
                    <th class="rotate" rowspan="4">
                      <div class="mb-2">Goods</div>
                    </th>
                    <th class="rotate" rowspan="4">
                      <div class="mb-2">Services</div>
                    </th>
                  </tr>
                  <tr style="height: 30px">
                    <th style="height: 30px">
                      Area of Authority
                    </th>
                    <th style="height: 30px">
                      Operational Restrictions
                    </th>
                    <th style="height: 30px">Notes</th>
                  </tr>
                </thead>

                <tbody>
                  <tr v-for="(line, idx) of formB.authority_lines" :key="idx">
                    <td class="" v-bind:class="checkProblem(idx, ['has no value', 'No parent rows'])">
                      <v-text-field
                        v-model="line.coding"
                        dense
                        filled
                        hide-details
                        prepend-inner-icon="mdi-delete"
                        @click:prepend-inner="removeLine(idx)"
                        @change="codingChanged(line)"
                      >
                        <template slot="append">
                          <v-icon color="success" title="Valid coding" v-if="!line.coding_invalid && !line.is_working"
                            >mdi-check</v-icon
                          >
                          <v-icon color="error" title="Invalid coding" v-if="line.coding_invalid && !line.is_working"
                            >mdi-alert</v-icon
                          >
                          <v-progress-circular
                            indeterminate
                            v-if="line.is_working"
                            color="primary"
                            size="20"
                            width="3"
                            style="margin-top: 2px"
                          ></v-progress-circular>
                          <div style="display:none">{{ version }}</div>

                          <v-menu bottom left>
                            <template v-slot:activator="{ on, attrs }">
                              <v-btn icon small v-bind="attrs" v-on="on" class="my-0">
                                <v-icon>mdi-dots-vertical</v-icon>
                              </v-btn>
                            </template>

                            <v-list dense>
                              <v-list-item @click="moveLineUp(idx)" :disabled="idx == 0">
                                <v-list-item-icon><v-icon>mdi-arrow-up</v-icon></v-list-item-icon>
                                <v-list-item-title>Move up</v-list-item-title>
                              </v-list-item>
                              <v-list-item
                                @click="moveLineDown(idx)"
                                :disabled="idx == formB.authority_lines.length - 1"
                              >
                                <v-list-item-icon><v-icon>mdi-arrow-down</v-icon></v-list-item-icon>
                                <v-list-item-title>Move down</v-list-item-title>
                              </v-list-item>
                              <v-list-item @click="duplicateLine(idx)">
                                <v-list-item-icon><v-icon>mdi-content-copy</v-icon></v-list-item-icon>
                                <v-list-item-title>Duplicate</v-list-item-title>
                              </v-list-item>
                            </v-list>
                          </v-menu>
                        </template>
                      </v-text-field>
                    </td>
                    <td class="">
                      <v-select
                        class=""
                        :items="items"
                        @change="itemChanged"
                        dense
                        filled
                        hide-details
                        v-model="line.operational_restriction"
                      ></v-select>
                    </td>
                    <td>
                      <v-text-field v-model="line.notes" dense filled hide-details @change="itemChanged"></v-text-field>
                    </td>
                    <td class="fb-value" v-bind:class="checkProblem(idx, 'S24 Goods')">
                      <v-text-field
                        v-model="line.s24_procure_goods_limit"
                        dense
                        filled
                        hide-details
                        @change="itemChanged"
                      ></v-text-field>
                    </td>
                    <td class="fb-value" v-bind:class="checkProblem(idx, 'S24 Services limit invalid')">
                      <v-text-field
                        v-model="line.s24_procure_services_limit"
                        dense
                        filled
                        hide-details
                        @change="itemChanged"
                      ></v-text-field>
                    </td>
                    <td class="fb-value" v-bind:class="checkProblem(idx, 'S24 Procure request limit invalid')">
                      <v-text-field
                        v-model="line.s24_procure_request_limit"
                        dense
                        filled
                        hide-details
                        @change="itemChanged"
                      ></v-text-field>
                    </td>
                    <td class="fb-value" v-bind:class="checkProblem(idx, 'S24 Procure assignment limit invalid')">
                      <v-text-field
                        v-model="line.s24_procure_assignment_limit"
                        dense
                        filled
                        hide-details
                        @change="itemChanged"
                      ></v-text-field>
                    </td>
                    <td class="fb-value" v-bind:class="checkProblem(idx, 'S23 Goods')">
                      <v-text-field
                        v-model="line.s23_procure_goods_limit"
                        dense
                        filled
                        hide-details
                        @change="itemChanged"
                      ></v-text-field>
                    </td>
                    <td class="fb-value" v-bind:class="checkProblem(idx, 'S23 Services limit invalid')">
                      <v-text-field
                        v-model="line.s23_procure_services_limit"
                        dense
                        filled
                        hide-details
                        @change="itemChanged"
                      ></v-text-field>
                    </td>
                    <td class="fb-value" v-bind:class="checkProblem(idx, 'S24 Transfer limit invalid')">
                      <v-text-field
                        v-model="line.s24_transfer_limit"
                        dense
                        filled
                        hide-details
                        @change="itemChanged"
                      ></v-text-field>
                    </td>
                    <td class="fb-value" v-bind:class="checkProblem(idx, 'S23 Transfer limit invalid')">
                      <v-text-field
                        v-model="line.s23_transfer_limit"
                        dense
                        filled
                        hide-details
                        @change="itemChanged"
                      ></v-text-field>
                    </td>
                    <td class="fb-value" v-bind:class="checkProblem(idx, 'S24 Travel limit invalid')">
                      <v-text-field
                        v-model="line.s24_travel_limit"
                        dense
                        filled
                        hide-details
                        @change="itemChanged"
                      ></v-text-field>
                    </td>
                    <td class="fb-value" v-bind:class="checkProblem(idx, 'Other limit invalid')">
                      <v-text-field
                        v-model="line.other_limit"
                        dense
                        filled
                        hide-details
                        @change="itemChanged"
                      ></v-text-field>
                    </td>
                    <td class="fb-value" v-bind:class="checkProblem(idx, 'Loans limit invalid')">
                      <v-text-field
                        v-model="line.loans_limit"
                        dense
                        filled
                        hide-details
                        @change="itemChanged"
                      ></v-text-field>
                    </td>
                    <td class="fb-value" v-bind:class="checkProblem(idx, 'S29 Performance limit invalid')">
                      <v-text-field
                        v-model="line.s29_performance_limit"
                        dense
                        filled
                        hide-details
                        @change="itemChanged"
                      ></v-text-field>
                    </td>
                    <td class="fb-value" v-bind:class="checkProblem(idx, 'S30 Payment limit invalid')">
                      <v-text-field
                        v-model="line.s30_payment_limit"
                        dense
                        filled
                        hide-details
                        @change="itemChanged"
                      ></v-text-field>
                    </td>
                  </tr>
                </tbody>
              </table>

              <!--   <v-data-table style="font-size: .5rem !important"
            dense
            :headers="[{text:'Account', value:'account'}, {text: 'S23 Goods', value:'s24_procure_goods_limit'}]"
            :items="formB.authority_lines"></v-data-table>

-->

              <div class="d-flex">
                <v-btn color="secondary" small class="mb-0" @click="addLine">Add line</v-btn>
                <v-spacer />
                <span class="text-error pt-5" v-if="saveError">Error Saving Position: {{ saveError.error }}</span>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </BaseCard>

    <v-dialog></v-dialog>
  </v-container>
</template>

<style scoped>
.table {
  border-collapse: collapse;
}
.table th {
  text-align: center;
}
.table thead {
  text-transform: uppercase;
}
.table th,
.table td {
  border: 1px black solid;
}

.table th.rotate {
  height: 140px;
  white-space: nowrap;
  vertical-align: bottom;
  padding-bottom: 20px;
}

.table th.rotate > div {
  transform: rotate(270deg);
  width: 58px;
}
.table .fb-value {
  width: 60px;
  text-align: center;
}
td.problem {
  background-color: #ff000055 !important;
}
</style>

<script>
import { mapGetters, mapActions, mapState, mapMutations } from "vuex";
import _ from "lodash";

export default {
  name: "AuthorityDetails",
  components: {},
  data: () => ({
    page: {
      title: "",
    },
    breadcrumbs: [
      {
        text: "Signing Authorities Home",
        to: "/dashboard",
      },
      {
        text: "",
        to: "",
        exact: true,
      },
      {
        text: "Form B Authorizations",
        to: "",
        exact: true,
      },
      {
        text: "",
        to: "",
        exact: true,
      },
      {
        text: "Edit",
      },
    ],
    saveError: null,

    id: "",
    departmentId: "",
    department: {},

    authority: {},
    showUpload: false,
    items: [],
  }),
  computed: {
    ...mapState("authority/formB", ["formB", "version", "is_loading"]),
    ...mapState(["initializationComplete"]),
    ...mapGetters("department", ["departments"]),

    canSave() {
      if (this.formB && this.formB.authority_lines && this.formB.authority_lines.length > 0) {
        for (let line of this.formB.authority_lines) {
          if (line.coding_invalid || line.is_working) return false;
        }

        return true;
      }
      return false;
    },
  },
  watch: {
    initializationComplete(val) {
      if (val) {
        this.loadScreen();
      }
    },
  },

  async mounted() {
    this.id = this.$route.params.id;

    if (this.initializationComplete) this.loadScreen();
  },
  methods: {
    ...mapActions("department", ["getDepartment"]),
    ...mapActions("authority/formB", ["loadFormB", "saveFormB"]),
    ...mapActions("authority", ["getOperationalRestictions"]),
    ...mapMutations("authority/formB", ["setFormB"]),

    async loadScreen() {
      let p = await this.loadFormB(this.id);

      this.departmentId = p.department_code;
      this.department = await this.getDepartment({ id: this.departmentId });

      this.page.title = `Form B Details - Edit`;
      this.items = await this.getOperationalRestictions();

      this.breadcrumbs[1].text = this.department.descr;
      this.breadcrumbs[1].to = `/departments/${this.departmentId}`;
      this.breadcrumbs[2].to = `/departments/${this.departmentId}/form-b`;

      this.breadcrumbs[3].text = `${p.employee.title} (${p.employee.name})`;
      this.breadcrumbs[3].to = `/form-b/${this.id}`;
    },

    addLine() {
      this.formB.authority_lines.push({ coding: `${this.formB.department_code}` });
    },
    removeLine(idx) {
      this.formB.authority_lines.splice(idx, 1);
      this.saveFormB(this.formB);
    },
    moveLineUp(idx) {
      let item = this.formB.authority_lines.splice(idx, 1)[0];
      this.formB.authority_lines.splice(idx - 1, 0, item);
    },
    moveLineDown(idx) {
      let item = this.formB.authority_lines.splice(idx, 1)[0];
      this.formB.authority_lines.splice(idx + 1, 0, item);
    },
    duplicateLine(idx) {
      let item = _.clone(this.formB.authority_lines[idx]);
      this.formB.authority_lines.splice(idx + 1, 0, item);
    },
    itemChanged() {
      this.setFormB(this.formB);
    },
    codingChanged(line) {
      line.is_working = true;
      this.itemChanged();
    },
    async saveClick() {
      this.saveError = null;
      let resp = await this.saveFormB(this.formB);

      if (resp) {
        if (resp.status && _.isNumber(resp.status) && resp.status != 200) {
          this.saveError = resp.data;
        } else this.closeClick();
      }
    },
    closeClick() {
      this.$router.push(`/form-b/${this.id}`);
    },
    checkProblem(idx, fields) {
      if (this.saveError && this.saveError.error) {
        if (!_.isArray(fields)) fields = [fields];
        for (let field of fields)
          if (this.saveError.line == idx && this.saveError.error.indexOf(field) >= 0) return "problem";
      }
      return "";
    },
  },
};
</script>
