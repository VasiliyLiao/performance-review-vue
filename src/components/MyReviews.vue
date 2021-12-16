<template>
    <div>
        <h1>My Reviews List</h1>
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
                    <el-button @click="addBtnClick(scope.row)" type="text" size="small">Submit Comment</el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-dialog title="Feedback Comment" :visible.sync="dialogFormVisible">
            <el-form v-model="form">
                <el-form-item label="Comment" >
                    <el-input v-model="form.comment" ></el-input>
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
    MY_NEED_WRITE_REVIEWS
} from '../query';
import {
    SUBMIT_FEEDBACK_COMMENT
} from '../mutation'

export default {
  data() {
    return {
        dialogFormVisible: false,
        form: {
          comment: '',
        },
        reviews: [],
    };
  },
  async created() {
      await this.fetchReviews();
  },
  methods: {
    async addBtnClick(review) {
        const userId = localStorage.getItem('userId');
        const feedback = review.feedbacks.find(feedback => feedback.writer.id == userId);
        this.form = {
            id: feedback.id, //feedbackId
            comment: '',
        };
        this.dialogFormVisible = true;
    },
    async fetchReviews() {
        this.loading = true;
        try {
            const response = await this.$apollo.query({
                query: MY_NEED_WRITE_REVIEWS,
                fetchPolicy: 'no-cache',
            });

            this.reviews = response.data.myNeedWriteReviews;

        } catch(error) {
            console.error(error)
        }
        this.loading = false;
    },
    async submitFeedbackComment() {
        try {
            await this.$apollo.mutate({
                mutation: SUBMIT_FEEDBACK_COMMENT,
                variables: {
                    id: this.form.id,
                    comment: this.form.comment,
                }
            });
            
            this.$message({
                message: 'Submit Comment Success',
                type: 'success'
            });
        } catch (error) {
            console.error(error);
        }
    },
    async formSubmit() {
        await this.submitFeedbackComment();
        this.dialogFormVisible = false;
        await this.fetchReviews();
    }
  },
};
</script>
