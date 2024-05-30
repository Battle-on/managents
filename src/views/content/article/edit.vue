<template>
    <div>
        <el-form label-width="100px">
            <el-form-item label="标题">
                <el-input v-model="formData.title" placeholder="请输入标题"></el-input>
            </el-form-item>
            <el-form-item label="分类">
                <el-select v-model="formData.classify" placeholder="请选择分类">
                    <el-option v-for="(item, index) in classifyOptions" :key="index" :label="item.label"
                        :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="发表时间">
                <el-date-picker v-model="formData.publishTime" type="datetime" placeholder="选择日期时间"
                    value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
            </el-form-item>
            <el-form-item label="内容">
                <RichTextEditor v-model="formData.detail" ref="myWangEditor"></RichTextEditor>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm">保存</el-button>
                <el-button @click="previewContent">预览</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import RichTextEditor from "../../../components/RichTextEditor"
import fetchSmart from '@/utils/fetch'


export default {
    components: {
        RichTextEditor,
    },
    data() {
        return {
            formData: {
                title: "",
                classify: "",
                publishTime: new Date(),
                detail: "",
            },
            classifyOptions: [],
        };
    },
    mounted() {
        this.init();
        this.getClassiyOptions()
    },
    methods: {

        async init() {
            const { type, id } = this.$route.query;

            if (type === 'edit') {
                const { title, classify, publishTime, detail } = await this.getArticleInfo(id)

                this.$nextTick(() => {
                    this.formData.title = title;
                    this.formData.publishTime = publishTime;
                    this.formData.classify = classify;
                    this.formData.detail = detail;
                    this.$refs.myWangEditor.setHtml(detail)

                })
            }
        },


        async getClassiyOptions() {
            const { data } = await fetchSmart('/api/article/classIfy/list', {}, 'get');
            this.classifyOptions = data.map((item => {
                return {
                    ...item,
                    label: item.value
                }
            }))
        },

        async getArticleInfo(id) {
            const { data } = await fetchSmart(`/api/article/${id}`, {}, 'get');
            return data || {}
        },


        submitForm() {
            console.log(this.formData);
            // this.$message.success("表单已提交");
        },
        previewContent() {
            const detail = this.$refs.myWangEditor.getEditor().getText();
            alert("预览内容：\n" + detail);
        },
    },

};
</script>

<style scoped>
#editor {
    width: 100%;
    height: 300px;
}
</style>