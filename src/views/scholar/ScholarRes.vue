<template>
    <div class="search-container">
        <h1 style="color:#393942;">学者搜索结果</h1>
  
        <div class="sort-controls">
          <el-radio-group v-model="sortBy" fill="#b5d1f0">
            <el-radio-button :value="1">按相关度排序</el-radio-button>
            <el-radio-button :value="2">按收录论文数排序</el-radio-button>
          </el-radio-group>
          <p style="width:25px;height:25px;border: 1px solid #c7d6db;border-radius: 15px; display: flex; justify-content: center; align-items: center;margin-right:20px">
            <el-icon v-if="sortDown===1" @click="sortDown=-1" size="20" color="#385b9d"><SortDown /></el-icon>
            <el-icon v-if="sortDown===-1" @click="sortDown=1" size="20" color="#385b9d"><SortUp /></el-icon>
          </p>
        </div>

        <!-- <div >
          <button style="width:90%;height:50px;font-size:18px;color:#385b9d;background-color:#fafbff;border: 2px solid #b5d1f0;border-radius: 5px;">应用筛选条件</button>
        </div> -->
  
        <div class="results-list">
<!--             
          <div v-if="!loading && results.length === 0" class="no-results">
            未找到相关学者。
          </div> -->
          
          <div 
            v-for="(scholar, index) in showRes" 
            :key="index" 
            class="result-item"
            @click="viewScholar(scholar)"
          >
            <h2 class="scholar-name" style="color:#393942">{{ scholar.name }}</h2>
            
            <div class="scholar-meta">
              <div class="scholar-organization">
                <span class="organization"><i>{{ scholar.organization }}</i></span>
              </div>
              <div class="scholar-papers">
                <span :style="{ color: citationColor(scholar.paperCount) }">论文数: {{ scholar.paperCount }}</span>
              </div>
            </div>
  
            <div class="scholar-fields" style="margin-top:-5px">
              <span
                v-for="(field, idx) in scholar.fields"
                :key="idx"
                class="research-field"
                @click.stop="goToFieldPage(field)"
              >
                <i class="field-icon"></i> {{ field.fieldname }}
              </span>
            </div>


            <!-- <div class="scholar-collaborators">
              <span style="padding-right:10px;color:#393942">相关学者：</span>
              <span v-for="(collaborator, idx) in scholar.collaborators" :key="idx" class="collaborator" @mouseover="hover = true" @mouseleave="hover = false">
                <a @click.stop="viewScholar(collaborator)">{{ collaborator.name }}</a>
              </span>
            </div> -->
  
            <!-- <div class="action-buttons">
              <button @click="sendMessage(scholar)" class="action-btn">
                <el-icon :size="18"><Promotion /></el-icon>
              </button>
            </div> -->
          </div>
        </div>
  
        <div v-if="totalPages > 1" class="pagination">
          <button @click="goToPage(1)" :disabled="currentPage === 1">首页</button>
          <button @click="goToPage(currentPage - 1)" :disabled="currentPage === 1">上一页</button>
          <span>{{ currentPage }} / {{ totalPages }}</span>
          <button @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages">下一页</button>
          <button @click="goToPage(totalPages)" :disabled="currentPage === totalPages">尾页</button>
        </div>
    </div>
  </template>
  
<script>
import { fetchResults } from '@/api/user';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';  // 对于 Element Plus

export default {
  data() {
    return {
      results: [],
      showRes: [],

      loading: false,
      currentPage: 1,
      totalPages: 1,
      sortBy: 1,
      sortDown: 1,
      
      userId: this.$cookies.get('userId'),
      router:useRouter(),
    };
  },
  computed: {
    searchConditions() {
      const conditions = JSON.parse(decodeURIComponent(this.$route.query.conditions));
      return Array.isArray(conditions) ? conditions : [conditions].filter(Boolean);
    },
  },
  methods: {
    goToFieldPage(field) {
      this.$router.push({
        path: '/field',
        query: { id: field.fieldId }
      });
    },

    citationColor(citations) {
      if (citations >= 50) {
        return 'rgb(255, 99, 71)';
      } else if (citations >= 20) {
        return 'rgb(255, 165, 0)';
      } else if (citations >= 10) {
        return 'rgb(0, 128, 0)';
      } else {
        return 'rgb(169, 169, 169)';
      }
    },

    async fetchResults() {
      this.loading = true;
      console.log({
        searchConditions: this.searchConditions,
        sort: this.sortBy * this.sortDown,
        page: this.currentPage,
        userId: this.userId
      });

      try {
        // 假设 fetchResults 是一个返回 Promise 的异步函数
        const data = await fetchResults({
          searchConditions: this.searchConditions,
          sort: this.sortBy * this.sortDown,
          page: this.currentPage,
          userId: this.userId
        });

        // ElMessage.success(this.time);

        console.log("fetchResults", data);

        if (data.status === "error") {
          console.error("Error fetching results");
          // 如果数据请求失败，使用假数据
          // this.showRes = [
          //   { 
          //     Id: '11',
          //     name: '测试学者名字', 
          //     organization: '北京航空航天大学', 
          //     paperCount: 4, 
          //     collaborators: [{ name: '作者 1', Id: '002' }, { name: '作者 3', Id: '003' }],
          //     fields: [{ fieldname: '人工智能', fieldId: '001' }, { fieldname: '深度学习', fieldId: '002' }]
          //   }
          //];
        } else {
          // 数据正常返回时，映射数据结构
          this.totalPages = data.totalPages;
          this.results = data.result.map(scholar => ({
            Id: scholar.Id,
            name: scholar.name,
            organization: scholar.organization,
            paperCount: parseInt(scholar.paperCount), // 需要确保是数字类型
            collaborators: scholar.collaborators.map(collaborator => ({
              name: collaborator.name,
              Id: collaborator.id
            })),
            fields: scholar.fields.map(field => ({
              fieldname: field.fieldname,
              fieldId: field.fieldId
            }))
          }));
          console.log(this.results);
          // 分页处理
          this.showRes = this.results;
          console.log(this.showRes);
        }
      } catch (error) {
        console.error("Error occurred while fetching results", error);
        this.loading = false;
      } finally {
        console.log("fetchResults end");
        this.loading = false;
      }
    },

    goToPage(page) {
      this.currentPage = page;
      this.fetchResults();
    },
    viewScholar(scholar) {
      console.log('go to scholar:', scholar);
      this.router.push({
        path: '/gateway',
        query: {
          userId: scholar.Id
        }
      });
    }
  },
  watch: {
    sortBy() {
      this.currentPage = 1;
      this.fetchResults();
    },
    sortDown() {
      this.currentPage = 1;
      this.fetchResults();
    }
  },
  mounted() {
    this.currentPage = 1;
    this.fetchResults();
  }
};
</script>
  
<style scoped>
  :root {
    --theme-color: #385b9d;
    --mid-color:#5f96c7;
    --light-color: #e5f1fe;
    --button-color:#b5d1f0;
    --back-color: #fafbff;
    --shadow-color:rgba(85, 68, 183, 0.185);
    --deep-shadow:rgba(85, 65, 156, 0.311);
    --gray-color:#c7d6db;
    --dark-color: #868ea8;
    --secondary-color: #ecfbff;
    --second-text:#09255e;
    --text-color: #393942;
    --light-text-color: #4f4454;
  }
  
  .search-container {
    display: flex;
    margin: 30px;
    flex-direction: column;
  }
  
  .search-container h1 {
    font-size: 24px;
    margin-bottom: -20px;
    padding-left: 10px;
  }
  
  .no-results {
    text-align: center;
    font-size: 18px;
    color: #c7d6db;
  }
  
  .results-list {
    overflow-y: auto;
    padding-top: 20px;
    padding-left: 10px;
  }
  
  .result-item {
    padding: 15px;
    border: 1px solid #e5f1fe;
    margin-bottom: 15px;
    border-radius: 5px;
    background-color: #fafbff;
    width: 96%;
    cursor: pointer;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    box-shadow: 0 2px 5px rgba(85, 68, 183, 0.185);
    transform-origin: 30% 50%;
  }
  
  .result-item:hover {
    transform: scale(1.015, 1.05);
    box-shadow: 0 2px 10px rgba(85, 65, 156, 0.311);
  }
  
  .scholar-name {
    font-size: 22px;
    margin: 0 0 10px;
    border-bottom: 1px solid #c7d6db;
  }
  
  .scholar-meta {
    margin-bottom: 15px;
    display: flex;
    justify-content: space-between;
  }
  
  .scholar-organization {
    display: flex;
    align-items: center;
    color: var(--dark-color);
  }
  
  .scholar-papers {
    font-size: 14px;
    padding-right: 5px;
  }
  
  .scholar-collaborators {
    margin-top: 5px;
    margin-bottom: -5px;
  }
  
  .collaborator {
    margin-right: 10px;
  }

  .collaborator a {
    color: #4f4454;
    text-decoration: none;
  }
  
  .collaborator a:hover {
    color: #5f96c7;
    text-decoration: underline;
  }
  
  .research-field {
    display: inline-block;
    margin: 5px;
    padding: 5px 10px;
    border: 1px solid #c7d6db;
    border-radius: 15px;
    background-color: #ecfbff;
    font-size: 14px;
    color: #09255e;
  }
  
  .field-icon {
    margin-right: 5px;
    color: #385b9d;
  }
  
  .sort-controls {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    width: 100%;
    gap: 10px;
    border-bottom: 1px solid #c7d6db;
  }
  
  .action-buttons {
    display: flex;
    justify-content: flex-end;
  }
  
  .action-btn {
    padding: 5px 10px;
    margin-inline: 5px;
    color: #385b9d;
    border: 1px solid #385b9d;
    background-color: #fafbff;
    border-radius: 20px;
    width: 40px;
    height: 40px;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .action-btn:hover {
    background-color: #e5f1fe;
  }
  
  .pagination {
    display: flex;
    justify-content: center;
    margin-top: 20px;
    color: #393942;
  }
  
  .pagination button {
    padding: 5px 10px;
    margin: 0 5px;
    cursor: pointer;
    border: 1px solid #c7d6db;
    background-color: #fafbff;
    border-radius: 5px;
    color: #393942;
  }
  
  .pagination button:disabled {
    cursor: not-allowed;
    background-color: #e0e0e0;
  }
  
  .pagination span {
    align-self: center;
  }
  </style>
  