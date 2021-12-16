<template>
    <div>
        <h1>Employees List</h1>
        <el-row>
            <el-button type="primary" @click="newBtnClick">New</el-button>
        </el-row>

        <el-table :data="employees" v-loading="loading" style="width: 100%">
            <el-table-column prop="name" label="name"></el-table-column>
            <el-table-column prop="email" label="email" ></el-table-column>
             <el-table-column fixed="right" label="opreater" width="100">
                <template slot-scope="scope">
                    <el-button @click="deleteEmployee(scope.row)" type="text" size="small">Delete</el-button>
                    <el-button @click="editBtnClick(scope.row)" type="text" size="small">Edit</el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-dialog title="Employee" :visible.sync="dialogFormVisible">
            <el-form v-model="form">
                <el-form-item label="Name" >
                    <el-input v-model="form.name" ></el-input>
                </el-form-item>
                <el-form-item label="Email" >
                    <el-input type="email" v-model="form.email"></el-input>
                </el-form-item>
                 <el-form-item label="Password" >
                    <el-input v-model="form.password" show-password></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">Cancel</el-button>
                <el-button type="primary" @click="formSubmit">Create</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import {
    CREATE_EMPLOYEE,
    UPDATE_EMPLOYEE,
    DELETE_EMPLOYEE,
} from '../mutation';
import {
    GET_ALL_EMPLOYEES,
} from '../query';

export default {
  data() {
    return {
        dialogFormVisible: false,
        formMode: 'create',
        form: {
          name: '',
          email: '',
          password: '',
        },
        employees: [],
    };
  },
  created() {
      this.fetchEmployees();
  },
  methods: {
    newBtnClick() {
        this.formMode = 'create';
        this.dialogFormVisible = true;
        this.form = {
          name: '',
          email: '',
          password: '',
        };
    },
    editBtnClick(employee) {
        this.formMode = 'edit';
        this.dialogFormVisible = true;
        this.form = {
            id: employee.id,
            name: employee.name,
            email: employee.email,
            password: ''
        };
    },
    async formSubmit() {
        if (this.formMode === 'create') {
            await this.createEmployee();
        } else {
            await this.updateEmployee();
        }

        this.dialogFormVisible = false;
        await this.fetchEmployees();
    },
    async updateEmployee() {
        try {
            const variables = {
                id: this.form.id,
                input: {
                    name: this.form.name,
                    email: this.form.email,
                }
            };

            if (this.form.password) {
                variables.input.password = this.form.password;
            }

            await this.$apollo.mutate({
                mutation: UPDATE_EMPLOYEE,
                variables
            });

            this.$message({
                message: 'Update Employee Success',
                type: 'success'
            });
        } catch(error) {
            //
        }
    },
    async deleteEmployee(employee) {
        await this.$apollo.mutate({
            mutation: DELETE_EMPLOYEE,
            variables: {
                id: employee.id
            }
        });

        this.$message({
            message: 'Delete Employee Success',
            type: 'success'
        });

        await this.fetchEmployees();
    },
    async createEmployee() {
        try {
            await this.$apollo.mutate({
                mutation: CREATE_EMPLOYEE,
                variables: {
                    input: {
                        name: this.form.name,
                        email: this.form.email,
                        password: this.form.password,
                    },
                }
            });
            
            this.$message({
                message: 'Create Employee Success',
                type: 'success'
            });
        } catch (error) {
            console.error(error);
        }
    },
    async fetchEmployees() {
        this.loading = true;
        try {
            const response = await this.$apollo.query({
                query: GET_ALL_EMPLOYEES,
                fetchPolicy: 'no-cache',
            });

            this.employees = response.data.allEmployees;

        } catch(error) {
            console.error(error)
        }
        this.loading = false;
    },
  },
};
</script>
