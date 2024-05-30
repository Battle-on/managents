<template>
    <el-container class="user-management">
        <el-header class="user-management__header">
            <div class="user-management__header-main">
                <el-input v-model="searchKey" placeholder="请输入手机号或者邮箱搜索" class="management__headerInput"
                    style="width:300px"></el-input>
                <el-button type="primary" size="small" @click="search" style="margin-right: 120px;">搜索</el-button>
                <el-button type="success" size="small" @click="openAddUserModal">新增用户</el-button>
            </div>

        </el-header>
        <el-main class="user-management__content">
            <div class="table-container" ref="container">
                <el-table :data="users" style="width: 100%" ref="table" :height="tableHeight" align="center"
                    header-align="center">
                    <el-table-column label="ID" prop="id"></el-table-column>
                    <el-table-column label="手机/邮箱账号" prop="username"></el-table-column>
                    <el-table-column label="用户类型">
                        <template slot-scope="scope">
                            {{ scope.row.type === 'admin' ? '管理员' : "普通用户" }}
                        </template>
                    </el-table-column>
                    <el-table-column label="密码" prop="password"></el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button type="danger" size="small" @click="deleteUser(scope.row)"
                                v-if="scope.row.type !== 'admin'">删除</el-button>
                            <el-button size="small" @click="openPasswordDialog(scope.row)">更改密码</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </el-main>
        <div class="pagination-container">
            <el-pagination @current-change="handlePageChange" :current-page="pageNum" :page-size="pageSize"
                layout="prev, pager, next" :total="total" background></el-pagination>
        </div>

        <el-dialog title="新增用户" :visible.sync="dialogVisible" width="600px" center :lock-scroll="true"
            :close-on-press-escape="false">
            <el-form :model="formData" ref="form" :rules="rules" label-width="100px">
                <el-form-item label="账号" prop="username">
                    <el-input v-model="formData.username" placeholder="请输入手机号或邮箱"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input type="password" v-model="formData.password" placeholder="请输入密码（至少6位）"></el-input>
                </el-form-item>
                <el-form-item label="账号类型" prop="password">
                    <el-select v-model="formData.type">
                        <el-option v-for="item in accountTypes" :key="item.value" :label="item.label"
                            :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer">
                <el-button @click="cancel">取消</el-button>
                <el-button type="primary" @click="submitForm">保存</el-button>
            </span>
        </el-dialog>

        <el-dialog title="更改密码" :visible.sync="passwordDialogVisible" width="30%" center>
            <el-form :model="passwordModel" ref="form" :rules="rules" label-width="100px">
                <el-form-item label="新密码" prop="newPassword">
                    <el-input type="password" v-model="passwordModel.newPassword" placeholder="请输入新密码"></el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="confirmPassword">
                    <el-input type="password" v-model="passwordModel.confirmPassword" placeholder="请再次输入新密码"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer">
                <el-button @click="closePasswordDialog">取消</el-button>
                <el-button type="primary" @click="upatePassword">确认更改</el-button>
            </span>
        </el-dialog>


    </el-container>



</template>


<script>
import fetchSmart from '@/utils/fetch'

export default {
    data() {
        return {
            tableHeight: 400,
            searchKey: "",
            pageNum: 1,
            pageSize: 10,
            total: 0,
            users: [],
            dialogVisible: false,
            formData: {
                username: "",
                password: "",
                type: "normal",
            },
            passwordDialogVisible: false,
            passwordModel: {
                id: '',
                newPassword: "",
                confirmPassword: "",
            },
            rules: {
                username: [
                    { required: true, message: "请输入账号", trigger: "blur" },
                    { pattern: /^(\d{11})|([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/, message: "请输入有效的手机号或邮箱", trigger: "blur" },
                ],
                password: [
                    { required: true, message: "请输入密码", trigger: "blur" },
                    { min: 6, message: "密码长度至少为6位", trigger: "blur" },
                ],
                newPassword: [{ required: true, message: "请输入新密码", trigger: "blur" }, { min: 6, message: "密码长度至少为6位", trigger: "blur" },
                ],
                confirmPassword: [
                    { required: true, message: "请再次输入新密码", trigger: "blur" },
                    { min: 6, message: "密码长度至少为6位", trigger: "blur" },
                    { validator: this.checkPasswords, trigger: "blur" },
                ],
            },
            accountTypes: [
                { value: "normal", label: "普通用户" },
                { value: "admin", label: "管理员" },
            ],
        };
    },

    created() {
        this.fetchUsers();
        this.$nextTick(() => {
            this.calculateTableHeight();
        })
    },
    methods: {
        search() {
            this.fetchUsers();

        },
        async fetchUsers() {
            const params = {
                pageNum: this.pageNum,
                pageSize: this.pageSize,
                username: this.searchKey
            }
            const { data } = await fetchSmart('/api/user/list', params, 'get')
            this.users = data.sorts;
            this.total = data.total;

        },
        refesh() {
            this.fetchUsers()
        },
        openAddUserModal() {
            this.dialogVisible = true;
        },

        submitForm() {
            this.$refs["form"].validate(async (valid) => {
                if (valid) {
                    const loading = this.$loading()
                    const { code } = await fetchSmart('/api/user/create', this.formData)
                    if (code === 0) {
                        this.$message.success("添加用户成功")
                        this.$nextTick(() => {
                            this.cancel()
                        })
                    } else {
                        this.$message.error(res.msg)
                    }
                    loading.close()

                } else {
                    console.log("valid")
                }
            });
        },
        cancel() {
            this.dialogVisible = false;
            this.formData = {
                username: "",
                password: "",
            };
            this.refesh()
        },

        deleteUser(row) {
            const params = {
                id: row.id
            }
            this.$confirm("确定要删除此用户嘛？", '', {
                distinguishCancelAndClose: true,
                confirmButtonText: '确认',
                cancelButtonText: '取消'
            }).then(async () => {
                const { code, msg } = await fetchSmart('/api/user/delete', params)
                if (code === 0) {
                    this.$message.success("删除用户成功")
                } else {
                    this.$message.error(msg)
                }
                this.refesh()
            })

        },

        openPasswordDialog(row) {
            this.passwordDialogVisible = true;
            this.passwordModel.id = row.id
        },
        closePasswordDialog() {
            this.passwordDialogVisible = false;
            this.passwordModel = {
                newPassword: "",
                confirmPassword: "",
                id: ""
            }

        },
        checkPasswords(_, value, callback) {
            if (value !== this.passwordModel.newPassword) {
                callback(new Error("两次输入的新密码不一致"));
            } else {
                callback();
            }
        },
        async upatePassword() {

            const params = {
                id: this.passwordModel.id,
                password: this.passwordModel.newPassword
            }

            const { code } = await fetchSmart('/api/user/updatePassword', params)
            if (code === 0) {
                this.$message.success("密码更改成功")
                this.closePasswordDialog();
            } else {
                this.$message.error(res.msg)
            }
            this.refesh()


        },

        handlePageChange(pageNum) {
            this.pageNum = pageNum;
            this.fetchUsers();
        },
        calculateTableHeight() {
            const containerHeight = this.$refs.container.offsetHeight ? this.$refs.container.offsetHeight : 0;
            this.tableHeight = containerHeight;
        },
    },
};
</script>

<style scoped lang="scss">
.user-management {
    display: flex;
    flex-direction: column;
    height: calc(100vh - 50px);

    .user-management__header {
        display: flex;
        margin-top: 20px;
        align-items: center;

        .user-management__header-main {
            height: 40px;
            display: flex;
            align-items: center;

            .management__headerInput {
                margin-right: 20px;
            }

            .el-button {
                // height: 30px;
            }
        }
    }

    .user-management__content {
        display: flex;
        flex-direction: column;
        height: 100%;
        overflow: auto;

        .table-container {
            flex: 1;
            overflow: hidden;
            overflow-y: auto;

            .el-table__body-wrapper {}
        }
    }

    .pagination-container {
        display: flex;
        justify-content: center;
        // margin-top: 20px;
        margin-bottom: 20px;

        .pagination {
            margin-top: auto;
        }
    }


}
</style>