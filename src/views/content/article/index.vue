<template>
  <el-container class="article-management">
    <el-header class="article-management__header">
      <div class="article-management__header-main">
        <el-input
          v-model="searchKey"
          placeholder="请输入文章ID / 文章标题"
          class="management__headerInput"
          style="width: 300px"
        />
        <el-button
          type="primary"
          size="small"
          style="margin-right: 120px"
          @click="search"
        >搜索</el-button>
        <el-button
          type="success"
          size="small"
          @click="handleAdd"
        >新增文章</el-button>
      </div>
    </el-header>
    <el-main class="article-management__content">
      <div ref="container" class="table-container">
        <el-table
          ref="table"
          :data="datas"
          style="width: 100%"
          :height="tableHeight"
          align="center"
          header-align="center"
        >
          <el-table-column label="ID" prop="id" width="60" />
          <el-table-column label="来源" prop="classify" />
          <el-table-column label="标题" prop="title" />
          <el-table-column label="发布时间">
            <template slot-scope="scope">
              {{ formatTime(scope.row.publishTime) }}
            </template>
          </el-table-column>

          <el-table-column label="封面" width="200">
            <template slot-scope="scope">
              <el-image v-if="scope.row.bg" :src="scope.row.bg" />
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                v-if="scope.row.type !== 'admin'"
                type="danger"
                size="small"
                @click="handlePreview(scope.row)"
              >预览</el-button>
              <el-button
                size="small"
                @click="handleEdit(scope.row)"
              >编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-main>
    <div class="pagination-container">
      <el-pagination
        :current-page="pageNum"
        :page-size="pageSize"
        layout="prev, pager, next"
        :total="total"
        background
        @current-change="handlePageChange"
      />
    </div>
  </el-container>
</template>

<script>
import fetchSmart from '@/utils/fetch'
import dayjs from 'dayjs'

export default {
  data() {
    return {
      tableHeight: 400,
      searchKey: '',
      pageNum: 1,
      pageSize: 10,
      total: 0,
      datas: [],
      dialogVisible: false,
      formData: {
        username: '',
        password: '',
        type: 'normal'
      }
    }
  },

  created() {
    this.fetchDatas()
    this.$nextTick(() => {
      this.calculateTableHeight()
    })
  },
  methods: {
    search() {
      this.fetchDatas()
    },
    async fetchDatas() {
      const params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }
      const { data } = await fetchSmart('/api/article/list', params, 'get')
      this.datas = data.sorts
      this.total = data.total
    },
    refesh() {
      this.fetchDatas()
    },
    handleAdd() {
      this.$router.push({
        path: '/content/article-edit',
        query: {
          type: 'add'
        }
      })
    },

    handleEdit(row) {
      this.$router.push({
        path: '/content/article-edit',
        query: {
          type: 'edit',
          id: row.id
        }
      })
    },

    handlePreview(row) {},

    handlePageChange(pageNum) {
      this.pageNum = pageNum
      this.fetchDatas()
    },
    calculateTableHeight() {
      const containerHeight = this.$refs.container.offsetHeight
        ? this.$refs.container.offsetHeight
        : 0
      this.tableHeight = containerHeight
    },

    formatTime(time) {
      return dayjs(time).format('YYYY-MM-DD')
    }
  }
}
</script>

<style scoped lang="scss">
.article-management {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 50px);

  .article-management__header {
    display: flex;
    margin-top: 20px;
    align-items: center;

    .article-management__header-main {
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

  .article-management__content {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: auto;

    .table-container {
      flex: 1;
      overflow: hidden;
      overflow-y: auto;

      .el-table__body-wrapper {
      }
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
