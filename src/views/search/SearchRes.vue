<template>
  <div class="search-container">
    <el-affix class="search-filters">
      <div class="block">
        <div class="filter-title">关键词</div>
        <div class="filter-selections">
        <el-checkbox-group v-model="selectedKeywords" fill="var(--button-color)">
          <el-checkbox v-for="(keyword, idx) in allKeywords" :key="idx" :label="keyword" :value="keyword" fill="var(--button-color)"></el-checkbox>
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
          <el-checkbox-group v-model="selectedAuthors" fill="var(--button-color)">
            <el-checkbox v-for="(authorOrganization, idx) in allAuthorOrganizations" :key="idx" :label="authorOrganization" :value=authorOrganization></el-checkbox>
          </el-checkbox-group>
        </div>
      </div>
    </el-affix>

    <div class="results-section">
      <h1 style="color:var(--text-color);">检索结果</h1>

      <div class="sort-controls">
        <el-radio-group v-model="sortBy" fill="var(--button-color)">
          <el-radio-button :value=1 >按相关度排序</el-radio-button>
          <el-radio-button :value=2 >按时间排序</el-radio-button>
          <el-radio-button :value=3 >按被引次数排序</el-radio-button>
        </el-radio-group>
        <p style="width:25px;height:25px;border: 1px solid var(--gray-color);border-radius: 15px; display: flex; justify-content: center; align-items: center;margin-right:20px">
          <el-icon v-if="sortDown===1" @click="sortDown=-1" size="20" color="var(--theme-color)"><SortDown /></el-icon>
          <el-icon v-if="sortDown===-1" @click="sortDown=1" size="20" color="var(--theme-color)"><SortUp /></el-icon>
        </p>
      </div>

      <div class="results-list">
        
        <div v-if="!loading && results.length === 0" class="no-results">
          未找到相关论文，以下是测试信息。
        </div>

        <div 
          v-for="(paper, index) in showRes" 
          :key="index" 
          class="result-item"
          @click="viewPaper(paper)"
        >
          <h2 class="paper-title" style="color:var(--text-color)">{{ paper.title }}</h2>
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
            <span v-for="(author, idx) in paper.authors" :key="idx" class="author" @mouseover="hover = true" @mouseleave="hover = false">
              <a>{{ author.userName }}</a>
            </span>
          </div>
          <div class="paper-keywords">
            <span v-for="(keyword, idx) in paper.keywords" :key="idx" class="keyword">
              <!-- <i class="keyword-icon">#</i>  -->
              {{ keyword }}
            </span>
          </div>

          <div class="action-buttons" >
            <button @click.stop="collectPaper(paper)" class="action-btn" v-if="paper.isFavorite"> 
              <el-icon :size="18" ><Star /></el-icon>
            </button>
            <button @click.stop="collectPaper(paper)" class="action-btn" v-if="!paper.isFavorite"> 
              <el-icon :size="18" ><StarFilled /></el-icon>
            </button>
            <!-- <button @click="quotePaper(paper)" class="action-btn">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-quote" viewBox="0 0 16 16">
                <path d="M12 12a1 1 0 0 0 1-1V8.558a1 1 0 0 0-1-1h-1.388c0-.351.021-.703.062-1.054.062-.372.166-.703.31-.992.145-.29.331-.517.559-.683.227-.186.516-.279.868-.279V3c-.579 0-1.085.124-1.52.372a3.322 3.322 0 0 0-1.085.992 4.92 4.92 0 0 0-.62 1.458A7.712 7.712 0 0 0 9 7.558V11a1 1 0 0 0 1 1h2Zm-6 0a1 1 0 0 0 1-1V8.558a1 1 0 0 0-1-1H4.612c0-.351.021-.703.062-1.054.062-.372.166-.703.31-.992.145-.29.331-.517.559-.683.227-.186.516-.279.868-.279V3c-.579 0-1.085.124-1.52.372a3.322 3.322 0 0 0-1.085.992 4.92 4.92 0 0 0-.62 1.458A7.712 7.712 0 0 0 3 7.558V11a1 1 0 0 0 1 1h2Z"/>
              </svg></button> -->
            <button @click="downloadPaper(paper)" class="action-btn"><el-icon :size="18"><Download /></el-icon></button>
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

      userId: this.$root.OnlineUser,
      router:useRouter(),
    };
  },
  computed: {
    searchConditions() {
      const conditions = this.$route.query.searchConditions;
      return Array.isArray(conditions) ? conditions : [conditions].filter(Boolean);
    },
    dateRange() {
      const range = this.$route.query.dateRange;
      return Array.isArray(range) ? range : [range].filter(Boolean);
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

    async fetchFilters() {
      try {
        const data = await fetchFilters({
          searchConditions: this.searchConditions,
          dateRange: this.dateRange,
        });

        console.log("Fetched filters:", data);

        this.allKeywords = data.allKeys;
        this.allAuthorOrganizations = data.allAuthorOrganization;
      } catch (error) {
        console.error("Error fetching filters:", error);
      }
    },

    async getTotalPages() {
      try {
        const data = await getTotalPages({
          searchConditions: this.searchConditions,
          dateRange: this.dateRange,
          filter: {
            keys: this.selectedKeywords,
            years: this.selectedYears.map(year => year.toString()),
            authorOrganizations: this.selectedAuthors
          }
        });

        this.totalPages = data;
      } catch (error) {
        console.error("Error getting total pages:", error);
        this.totalPages = Math.ceil(this.mockData.totalResults / 10);
      }
    },

    async fetchResults() {
  this.loading = true;

  try {
    const data = await fetchResults({
      searchConditions: this.searchConditions,
      dateRange: this.dateRange,
      filter: {
        keys: this.selectedKeywords,
        years: this.selectedYears.map(year => year.toString()),
        authorOrganizations: this.selectedAuthors
      },
      sort: this.sortByz * this.sortDown,
      page: this.currentPage,
      userId: this.userId
    });

    this.results = data.map(paper => ({
      ...paper,
      authors: paper.authors.map(author => ({ userName: author.userName, authorOrganization: author.authorOrganization }))
    }));
    this.showRes = this.results.slice((this.currentPage - 1) * 10, this.currentPage * 10);
  } catch (error) {
    console.error("Error fetching results:", error);
    this.showRes = [
      { 
        Id:'11',
        title: '测试标题 1', 
        isFavorite:true,
        date: '2022-01-01', 
        journal: '期刊名1', 
        citations: 34, 
        authors: [{ userName: '作者 1', authorOrganization: '北京航空航天大学' }, { userName: '作者 2', authorOrganization: '北京航空航天大学' }], 
        keywords: ['人工智能', '深度学习'] ,
        download:null,
      },
      { 
        Id:'12',
        title: '测试标题 2', 
        isFavorite:false, 
        date: '2022-02-01', 
        journal: '期刊名2', 
        citations: 78, 
        authors: [{ userName: '作者 2', authorOrganization: '清华大学' }, { userName: '作者 3', authorOrganization: '清华大学' }], 
        keywords: ['自然语言处理', '机器学习'],
        download:null,
      },
    ];
  } finally {
    this.loading = false;
  }
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

    async collectPaper(paper) {
      try {
        const response = await PostStar(this.userId, paper.id, paper.isFavorite);

        if (response.success) {
          paper.isFavorite = !paper.isFavorite;
        } else {
          console.error("Failed to update favorite status:", response.message || 'Unknown error');
        }
      } catch (error) {
        console.error("Error updating favorite status:", error);
      }
    },

    downloadPaper(paper) {
      console.log('下载论文:', paper);
    }
  },

  watch: {
    selectedKeywords: {
      handler() {
        this.currentPage = 1;
        this.getTotalPages();
        this.fetchResults();
      },
      deep: true
    },
    selectedYears: {
      handler() {
        this.currentPage = 1;
        this.getTotalPages();
        this.fetchResults();
      },
      deep: true
    },
    selectedAuthors: {
      handler() {
        this.currentPage = 1;
        this.getTotalPages();
        this.fetchResults();
      },
      deep: true
    },
    
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

<style>
:root {
  --theme-color: #385b9d;
  --mid-color:#5f96c7;
  --light-color: #e5edfe;
  --button-color:#a6c0ed;
  --back-color: #fafcff;
  --shadow-color:rgba(68, 95, 183, 0.185);
  --deep-shadow:rgba(65, 73, 156, 0.311);
  --gray-color:#c7d0db;
  --dark-color: #868ea8;
  --secondary-color: #ecf4ff;
  --second-text:#000000aa;
  --text-color: #282829;
  --light-text-color: #4f4454;
}

.search-container {
  display: flex;
  margin: 20px;
}

.search-filters {
  width: 250px;
  min-width: 250px;
  max-width: 250px;
  border-right: 2px solid var(--gray-color);
  position: sticky;
  height: 86vh;
}

.results-section {
  padding-left: 20px;
  display: flex;
  flex-grow: 1;
  flex-direction: column;
}

.results-section h1 {
  font-size: 24px;
  margin-bottom: -20px;
  padding-left: 10px;
}

.loading, .no-results {
  text-align: center;
  font-size: 18px;
  color: var(--gray-color);
}

.results-list {
  overflow-y: auto;
  padding-top: 20px;
  padding-left: 10px;
}

.result-item {
  padding: 15px;
  border: 1px solid var(--light-color);
  margin-bottom: 15px;
  border-radius: 5px;
  background-color: var(--back-color);
  width: 96.5%;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  box-shadow: 0 2px 5px var(--shadow-color);
  transform-origin: 30% 50%;
}

.result-item:hover {
  transform: scale(1.015, 1.02);
  box-shadow: 0 2px 10px var(--deep-shadow);
}

.paper-title {
  font-size: 20px;
  margin: 5px 0 10px 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--gray-color);
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
  color: var(--mid-color);
  margin-left:10px;
}

.separator {
  margin: 0 10px;
  color: var(--dark-color);
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
  margin-right: 10px;
}

.author a {
  color: var(--light-text-color);
  text-decoration: none;
}

.author a:hover {
  color: var(--second-text);
  text-decoration: underline;
}

.paper-keywords {
  margin-top: 5px;
}

.sort-controls{
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: 100%;  
  gap: 10px;
  border-bottom: 1px solid var(--gray-color);
}

.action-buttons {
  display: flex;
  justify-content: flex-end;

}

.action-btn {
  padding: 5px 10px;
  margin-inline: 5px;
  color: var(--theme-color);
  border: 1px solid var(--theme-color);
  background-color: var(--back-color);
  border-radius: 20px;
  width: 40px;
  height: 40px;
  cursor: pointer;
  display: flex; 
  justify-content: center; 
  align-items: center;
}

.action-btn:hover {
  background-color: var(--light-color);
}

.keyword {
  display: inline-block;
  margin: 5px;
  padding: 5px 10px;
  border: 1px solid var(--gray-color);
  border-radius: 15px;
  background-color: var(--secondary-color);
  font-size: 14px;
  color: var(--second-text);
}

.keyword-icon {
  margin-right: 5px;
  color:var(--theme-color);
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 20px;
  color:var(--text-color)
}

.pagination button {
  padding: 5px 10px;
  margin: 0 5px;
  cursor: pointer;
  border: 1px solid var(--gray-color);
  background-color: var(--back-color);
  border-radius: 5px;
  color:var(--text-color)
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
  background-color: var(--button-color);
  padding:10px 10px 10px 10px;
  margin-bottom: 10px;
  margin-right: 15px;
  border-radius: 5px;
  color: var(--back-color);
}
.filter-selections{
  padding-left:10px;
  margin-right: 20px;
}
</style>
