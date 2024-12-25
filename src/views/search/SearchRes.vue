<template>
  <div class="search-container">
    <el-affix class="search-filters">
      <div>
      <div class="block">
        <div class="filter-title">关键词</div>
        <div class="filter-selections">
        <el-checkbox-group v-model="selectedKeywords" fill="#a6c0ed" size="small">
          <el-checkbox v-for="(keyword, idx) in allKeywords" :key="idx" :label="keyword" :value="keyword" fill="#a6c0ed"></el-checkbox>
        </el-checkbox-group></div>
      </div>

      <div class="block"> 
        <div class="filter-title">发表年份</div>
        <div class="filter-selections">
        <el-date-picker
          v-model="selectedYears"
          type="years"
          placeholder="选择一个或多个年份"
          @clear="selectedYears=[]"
        /></div>
      </div>

      <div class="block">
        <div class="filter-title">作者单位</div>
        <div class="filter-selections">
          <el-checkbox-group v-model="selectedAuthors" fill="#a6c0ed" size="small">
            <el-checkbox v-for="(authorOrganization, idx) in allAuthorOrganizations" :key="idx" :label="authorOrganization" :value=authorOrganization></el-checkbox>
          </el-checkbox-group>
        </div>
      </div></div>
      <div style="position: fixed; bottom: 20px; left: 55px;">
        <button class="apply-filter-button" @click="apply()">应用筛选条件</button>
      </div>
    </el-affix>

    <div class="results-section">
      <h1 style="color:#282829;">检索结果</h1>
        <div class="container">
          <span>用时 {{searchTime}}ms 共检索到 {{ searchCount }} 篇相关论文</span>
          <div class="sort-controls">
            
            <el-radio-group v-model="sortBy" fill="#a6c0ed">
              <el-radio-button :value=1 >按相关度排序</el-radio-button>
              <el-radio-button :value=3 >按时间排序</el-radio-button>
              <el-radio-button :value=2 >按被引次数排序</el-radio-button>
            </el-radio-group>
            <p style="width:25px;height:25px;border: 1px solid #c7d0db;border-radius: 15px; display: flex; justify-content: center; align-items: center;margin-right:20px">
              <el-icon v-if="sortDown===1" @click="sortDown=-1" size="20" color="#385b9d"><SortDown /></el-icon>
              <el-icon v-if="sortDown===-1" @click="sortDown=1" size="20" color="#385b9d"><SortUp /></el-icon>
            </p>
          </div>
        </div>

      <div class="results-list">
        
        <!-- <div v-if="!loading && showRes.length === 0" class="no-results">
          未找到相关论文，以下是测试信息。
        </div> -->

        <div 
          v-for="(paper, index) in showRes" 
          :key="index" 
          class="result-item"
          @click="viewPaper(paper)"
        >
          <h2 class="paper-title" style="color:#282829">{{ paper.title }}</h2>
          <div class="paper-meta">
            <div class="paper-date-journal">
              <span class="paper-date"><i>{{ paper.date }}</i></span>
              <span class="separator">|</span>
              <span class="paper-journal"><i>{{ paper.journal }}</i></span>
            </div>
            <div class="paper-citations">
              
              <span :style="{ color: citationColor(paper.citations) }">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-quote" viewBox="0 0 16 16"><path d="M12 12a1 1 0 0 0 1-1V8.558a1 1 0 0 0-1-1h-1.388c0-.351.021-.703.062-1.054.062-.372.166-.703.31-.992.145-.29.331-.517.559-.683.227-.186.516-.279.868-.279V3c-.579 0-1.085.124-1.52.372a3.322 3.322 0 0 0-1.085.992 4.92 4.92 0 0 0-.62 1.458A7.712 7.712 0 0 0 9 7.558V11a1 1 0 0 0 1 1h2Zm-6 0a1 1 0 0 0 1-1V8.558a1 1 0 0 0-1-1H4.612c0-.351.021-.703.062-1.054.062-.372.166-.703.31-.992.145-.29.331-.517.559-.683.227-.186.516-.279.868-.279V3c-.579 0-1.085.124-1.52.372a3.322 3.322 0 0 0-1.085.992 4.92 4.92 0 0 0-.62 1.458A7.712 7.712 0 0 0 3 7.558V11a1 1 0 0 0 1 1h2Z"/></svg>
                被引次数: {{ paper.citations }}
              </span>
            </div>
          </div>
          <div class="paper-authors">
            <span v-for="(author, idx) in paper.authors" :key="idx" class="author" @mouseover="hover = true" @mouseleave="hover = false" @click.stop="viewScholar(author)">
              <a>{{ author.display_name }}</a>
            </span>
          </div>
          <div class="paper-keywords">
            <span v-for="(keyword, idx) in paper.keywords" :key="idx" class="keyword">
              <!-- <i class="keyword-icon">#</i>  -->
              {{ keyword }}
            </span>
          </div>

          <div class="action-buttons" >
            <button @click.stop="collectPaper(paper)" class="action-btn" v-if="!paper.isFavorite"> 
              <el-icon :size="18" ><Star /></el-icon>
            </button>
            <button @click.stop="collectPaper(paper)" class="action-btn" v-if="paper.isFavorite"> 
              <el-icon :size="18" ><StarFilled /></el-icon>
            </button>
            <!-- <button @click="quotePaper(paper)" class="action-btn">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-quote" viewBox="0 0 16 16">
                <path d="M12 12a1 1 0 0 0 1-1V8.558a1 1 0 0 0-1-1h-1.388c0-.351.021-.703.062-1.054.062-.372.166-.703.31-.992.145-.29.331-.517.559-.683.227-.186.516-.279.868-.279V3c-.579 0-1.085.124-1.52.372a3.322 3.322 0 0 0-1.085.992 4.92 4.92 0 0 0-.62 1.458A7.712 7.712 0 0 0 9 7.558V11a1 1 0 0 0 1 1h2Zm-6 0a1 1 0 0 0 1-1V8.558a1 1 0 0 0-1-1H4.612c0-.351.021-.703.062-1.054.062-.372.166-.703.31-.992.145-.29.331-.517.559-.683.227-.186.516-.279.868-.279V3c-.579 0-1.085.124-1.52.372a3.322 3.322 0 0 0-1.085.992 4.92 4.92 0 0 0-.62 1.458A7.712 7.712 0 0 0 3 7.558V11a1 1 0 0 0 1 1h2Z"/>
              </svg></button> -->
            <button @click.stop="downloadPaper(paper)" class="action-btn"><el-icon :size="18"><Download /></el-icon></button>
          </div>
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
  </div>
</template>

<script>
import { fetchFilters, getTotalPages, fetchResults, PostStar } from '@/api/article';
import { useRouter, useRoute } from 'vue-router';

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
      allKeywords: ['人工智能', '深度学习', '自然语言处理', '机器学习', '数据分析'],
      allAuthorOrganizations: ['北京航空航天大学', '清华大学', '中国科学院', '上海交通大学', '注意这是测试数据'],

      selectedKeywords: [],
      selectedYears: [],
      selectedAuthors: [],

      searchTime:15,
      searchCount:358,

      userId: this.$cookies.get('userId'),
      router:useRouter(),
    };
  },
  computed: {
    searchConditions() {
      const conditions = JSON.parse(decodeURIComponent(this.$route.query.searchConditions))
      return Array.isArray(conditions) ? conditions : [conditions].filter(Boolean);
    },
    dateRange() {
      const queryParam = this.$route.query.dateRange;

    if (queryParam) {
      try {
        const range = JSON.parse(decodeURIComponent(queryParam));

        return Array.isArray(range) ? range : [range];
      } catch (e) {
        console.error('Failed to parse dateRange:', e);
        return [null, null];
      }
    } else {
      return [null, null];
    }
    }
  },
  methods: {
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

    fetchFilters() {
      console.log({
        searchConditions: this.searchConditions,
        dateRange: this.dateRange,
      })
      var response = fetchFilters({
        searchConditions: this.searchConditions,
        dateRange: this.dateRange,
      });

      response
      .then((data) => {
        console.log("fetchFilters res", data);
        if(data.status == "error"){
          console.error("Error fetching filters");
        }else{
          this.allKeywords = data.allKeys;
          this.allAuthorOrganizations = data.allAuthorOrganization;
        }
      })
    },

    getTotalPages() {
      console.log({
        searchConditions: this.searchConditions,
        dateRange: this.dateRange,
        filter: {
          keys: [...this.selectedKeywords],
          years: this.selectedYears.map(year => year.getFullYear().toString()),
          authorOrganizations: [...this.selectedAuthors]
        }
      })
      var response = getTotalPages({
        searchConditions: this.searchConditions,
        dateRange: this.dateRange,
        filter: {
          keys: [...this.selectedKeywords],
          years: this.selectedYears.map(year => year.getFullYear().toString()),
          authorOrganizations: [...this.selectedAuthors]
        }
      });

      response
      .then(data => {
        console.log("getTotalPage res", data);
        if(data.status == "error"){
          console.error("Error getting total pages");
          this.totalPages = 999;
        }else{
          this.totalPages = data.page;
        }
      })
    },

    fetchResults() {
      console.log({
        searchConditions: this.searchConditions,
        dateRange: this.dateRange,
        filter: {
          keys: [...this.selectedKeywords],
          years: this.selectedYears.map(year => year.getFullYear().toString()),
          authorOrganizations: [...this.selectedAuthors]
        },
        sort: this.sortBy * this.sortDown,
        page: this.currentPage,
        userId: this.userId
      })
      this.loading = true;
      var response = fetchResults({
        searchConditions: this.searchConditions,
        dateRange: this.dateRange,
        filter: {
          keys: this.selectedKeywords,
          years: this.selectedYears.map(year => year.getFullYear().toString()),
          authorOrganizations: this.selectedAuthors
        },
        sort: this.sortBy * this.sortDown,
        page: this.currentPage,
        userId: this.userId
      });

      response
      .then(data => {
        console.log("fetch Results", data);
        if(data.status == "error"){
          console.error("Error fetching results");
          this.showRes = [
            { 
              Id:'4055372',
              title: '测试标题 1', 
              isFavorite:true,
              date: '2022-01-01', 
              journal: '期刊名1', 
              citations: 34, 
              authors: [{ display_name: '作者 1', authorOrganization: '北京航空航天大学',authorId:"https://openalex.org/A5062756377" }, { display_name: '作者 2', authorOrganization: '北京航空航天大学',authorId:"42874" }], 
              keywords: ['人工智能', '深度学习'] ,
              download:null,
            },
            { 
              Id:'4055373',
              title: '测试标题 2', 
              isFavorite:false, 
              date: '2022-02-01', 
              journal: '期刊名2', 
              citations: 78, 
              authors: [{ display_name: '作者 2', authorOrganization: '清华大学' }, { display_name: '作者 3', authorOrganization: '清华大学' }], 
              keywords: ['自然语言处理', '机器学习'],
              download:null,
            },
          ];
        }else{
          this.searchTime=data.queryTime%100;
          this.searchCount=data.total;
          this.showRes = data.articles;
        }
      })
      .finally(() => {
        console.log("fetchResults end")
        this.loading = false;
      });
    },

    goToPage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
        this.fetchResults();
      }
    },
    viewPaper(paper) {
      console.log('查看全文:', paper);
      this.router.push({
        path: '/article',
        query: {
          paperId: paper.Id
        }
      });
    },

    viewScholar(user) {
      this.router.push({
        path: '/gateway',
        query: {
          userId: user.authorId
        }
      });
    },

    collectPaper(paper) {
      var response = PostStar(this.userId, paper.Id, paper.isFavorite);

      response
      .then((result) => {
        paper.isFavorite = !paper.isFavorite;
      })
      .catch((err) =>{
        console.error("Failed to update favorite status:", response.message || 'Unknown error');
      })
    },

    downloadPaper(paper){
      if(paper.download != null){
          window.open(paper.download, '_blank');
      }
      else{
          ElMessage({
              message: '暂无下载链接.',
              type: 'warning',
              plain: true,
          });
      }
    },

    apply(){
      this.currentPage = 1;
      this.getTotalPages();
      this.fetchResults();
    }
  },

  watch: {
    
    currentPage: {
      handler() {
        this.fetchResults();
      }
    },
    sortBy: {
      handler() {
        this.currentPage = 1;
        this.fetchResults();
      }
    },
    sortDown: {
      handler() {
        this.currentPage = 1;
        this.fetchResults();
      }
    },
    router: {
      handler() {
        this.selectedKeywords = [];
        this.selectedYears = [];
        this.selectedAuthors = [];
        this.currentPage = 1;
        this.fetchFilters(); // 加载筛选条件
        this.getTotalPages(); // 加载总页数
        this.fetchResults(); // 初始加载结果
      },
      deep: true
    }
  },

  created() {
    this.route = useRoute();
  },

  mounted() {
    this.fetchFilters(); // 加载筛选条件
    this.getTotalPages(); // 加载总页数
    this.fetchResults(); // 初始加载结果
  }
};
</script>

<style scoped>
.app{
  background-color: #ffffffaa;
}

.search-container {
  display: flex;
  margin: 20px;
  height: 80vh;
}

.search-filters {
  width: 300px;
  border-right: 2px solid #c7d0db;
  position: sticky;
  word-wrap: break-word;  
  word-break: break-all;  
  overflow-x: hidden;
  overflow-y: scroll;
}

.results-section {
  padding-left: 20px;
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  height:86vh;
}

.results-section h1 {
  font-size: 24px;
  margin-bottom: -20px;
  padding-left: 10px;
}

.loading, .no-results {
  text-align: center;
  font-size: 18px;
  color: #c7d0db;
}

.results-list {
  border-top: 1.2px solid #c7d0db;
  width:77vw;
  overflow-y: auto;
  padding-top: 10px;
  padding-left: 10px;
}

.result-item {
  padding: 15px;
  border: 1px solid #e5edfe;
  margin-bottom: 15px;
  border-radius: 5px;
  background-color: #fafcff;
  width: 96.5%;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  box-shadow: 0 2px 5px rgba(68, 95, 183, 0.185);
  transform-origin: 30% 50%;
}

.result-item:hover {
  transform: scale(1.015, 1.02);
  box-shadow: 0 2px 7px rgba(113, 133, 207, 0.45);
}

.paper-title {
  font-size: 20px;
  margin: 5px 0 10px 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid #c7d0db;
}

.paper-meta {
  margin-bottom: 15px;
  display: flex;
  justify-content: space-between;
}

.paper-date-journal {
  font-size: 15px;
  display: flex;
  align-items: center;
  color: #5f96c7;
  margin-left:10px;
}

.separator {
  margin: 0 10px;
  color: #868ea8;
}

.paper-citations {
  font-size: 14px;
  padding-right: 5px;
}

.paper-authors {
  margin-top:-10px;
  margin-left:10px;
}

.author {
  margin-right: 20px;
}

.author a {
  color: #4f4454;
  text-decoration: none;
}

.author a:hover {
  color: #000000aa;
  text-decoration: underline;
}

.paper-keywords {
  margin-top: 5px;
}

.container {
  color: #6e8cc4;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-left:10px;
  margin-bottom: -20px;
}

.sort-controls{
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: 40vw;  
  margin-bottom:15px;
  gap: 10px;
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
  background-color: #fafcff;
  border-radius: 20px;
  width: 40px;
  height: 40px;
  cursor: pointer;
  display: flex; 
  justify-content: center; 
  align-items: center;
}

.action-btn:hover {
  background-color: #e5edfe;
}

.keyword {
  display: inline-block;
  margin: 5px;
  padding: 5px 10px;
  border: 1px solid #c7d0db;
  border-radius: 15px;
  background-color: #ecf4ff;
  font-size: 14px;
  color: #000000aa;
}

.keyword-icon {
  margin-right: 5px;
  color:#385b9d;
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 20px;
  color:#282829
}

.pagination button {
  padding: 5px 10px;
  margin: 0 5px;
  cursor: pointer;
  border: 1px solid #c7d0db;
  background-color: #fafcff;
  border-radius: 5px;
  color:#282829
}

.pagination button:disabled {
  cursor: not-allowed;
  background-color: #e0e0e0;
}

.pagination span {
  align-self: center;
}

.block{
  padding-top:20px;
}

.filter-title{
  background-color: #a6c0ed;
  padding:10px 10px 10px 10px;
  margin-bottom: 10px;
  margin-right: 15px;
  border-radius: 5px;
  color: #fafcff;
}
.filter-selections{
  
  padding-left:10px;
  margin-right: 20px;
}
.apply-filter-button{
  width:210px;
  height:50px;
  font-size:18px;
  color:#385b9d;
  background-color:#fafcff;
  border: 2px solid #a6c0ed;
  border-radius: 5px;
}
.apply-filter-button:hover {
  background-color: #c7d0db;
  border-color: #385b9d;
  cursor: pointer;
}
</style>
