<template>
    <div>
        <h1>Reviews List</h1>
        <el-row>
            <el-button type="primary" @click="newBtnClick">New</el-button>
        </el-row>

        <el-table :data="reviews" v-loading="loading" style="width: 100%">
            <el-table-column prop="owner.name" label="Auditee"></el-table-column>
            <el-table-column label="Total Reviwers">
                <template slot-scope="scope">
                    {{ scope.row.feedbacks.map(feedback=>feedback.writer.name).join(', ') }}
                </template>
            </el-table-column>
            <el-table-column label="Has Replied">
                <template slot-scope="scope">
                    {{ scope.row.feedbacks.filter(feedback => !!feedback.comment).map(feedback=>feedback.writer.name).join(', ') }}
                </template>
            </el-table-column>
            <el-table-column label="Comments">
                <template slot-scope="scope">
                    {{ scope.row.feedbacks.filter(feedback => !!feedback.comment).map(feedback=>feedback.comment).join(', ') }}
                </template>
            </el-table-column>
            <el-table-column fixed="right" label="opreater" width="100">
                <template slot-scope="scope">
                    <el-button @click="deleteReview(scope.row)" type="text" size="small">Delete</el-button>
                    <el-button @click="editBtnClick(scope.row)" type="text" size="small">Edit</el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-dialog title="PerformenceReview" :visible.sync="dialogFormVisible">
            <el-form v-model="form">
                <el-form-item label="Auditee" >
                    <el-select v-model="form.ownerId" placeholder="select owner">
                        <el-option
                            v-for="employee in employees"
                            :key="employee.id"
                            :label="employee.name"
                            :value="employee.id"
                            :disabled="form.writers.includes(employee.id)"
                            >
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="Reviews" >
                    <el-select v-model="form.writers" multiple placeholder="select reviews">
                        <el-option
                            v-for="employee in employees"
                            :key="employee.id"
                            :label="employee.name"
                            :value="employee.id"
                            :disabled="employee.id === form.ownerId">
                        </el-option>
                    </el-select>
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
    CREATE_PERFORMANCE_REVIEWS,
    UPDATE_PERFORMANCE_REVIEWS,
    DELETE_PERFORMANCE_REVIEWS,
} from '../mutation';
import {
    GET_ALL_EMPLOYEES,
    GET_ALL_REVIEWS
} from '../query';

export default {
  data() {
    return {
        dialogFormVisible: false,
        formMode: 'create',
        form: {
          ownerId: '',
          writers: [],
        },
        reviews: [],
        employees: [],
    };
  },
  async created() {
      await this.fetchReviews();
      await this.fetchEmployees();
  },
  methods: {
    async fetchEmployees() {
        try {
            // enable cache
            const response = await this.$apollo.query({
                query: GET_ALL_EMPLOYEES,
                fetchPolicy: 'no-cache',
            });

            this.employees = response.data.allEmployees;
        } catch(error) {
            console.error(error)
        }
    },
    isDisabledSelect(id) {
        return this.form.writers.includes(id);
    },
    async newBtnClick() {
        await this.fetchEmployees();
        this.formMode = 'create';
        this.form = {
          ownerId: '',
          writers: [],
        };
        this.dialogFormVisible = true;
    },
    async editBtnClick(review) {
        await this.fetchEmployees();
        this.formMode = 'edit';
        this.form = {
            id: review.id,
            ownerId: review.owner.id,
            writers: review.feedbacks.map(feeback => feeback.writer.id),
        };
        this.dialogFormVisible = true;
    },
    async createReviews() {
        try {
            await this.$apollo.mutate({
                mutation: CREATE_PERFORMANCE_REVIEWS,
                variables: {
                    input: {
                        ownerId: Number(this.form.ownerId),
                        writers: this.form.writers.map(writer=> Number(writer)),
                    },
                }
            });
            
            this.$message({
                message: 'Create Review Success',
                type: 'success'
            });
        } catch (error) {
            console.error(error);
        }
    },
    async updateReviews() {
        try {
            await this.$apollo.mutate({
                mutation: UPDATE_PERFORMANCE_REVIEWS,
                variables: {
                    id: this.form.id,
                    input: {
                        ownerId: Number(this.form.ownerId),
                        writers: this.form.writers.map(writer=> Number(writer)),
                    },
                }
            });
            
            this.$message({
                message: 'Create Review Success',
                type: 'success'
            });
        } catch (error) {
            console.error(error);
        }
    },
    async deleteReview(review) {
        try {
            await this.$apollo.mutate({
                mutation: DELETE_PERFORMANCE_REVIEWS,
                variables: {
                    id: review.id
                }
            });

            this.$message({
                message: 'Delete Review Success',
                type: 'success'
            });
        } catch(error) {
            //
        }

        await this.fetchReviews();
    },
    async fetchReviews() {
        this.loading = true;
        try {
            const response = await this.$apollo.query({
                query: GET_ALL_REVIEWS,
                fetchPolicy: 'no-cache',
            });

            this.reviews = response.data.allPerformanceReviews;

        } catch(error) {
            console.error(error)
        }
        this.loading = false;
    },
    async formSubmit() {
        if (this.formMode === 'create') {
            await this.createReviews();
        } else {
            await this.updateReviews();
        }

        this.dialogFormVisible = false;
        await this.fetchReviews();
    }
  },
};
</script>
