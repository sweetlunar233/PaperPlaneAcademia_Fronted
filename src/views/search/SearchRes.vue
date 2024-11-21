<template>
  <div class="search-container">
    <el-affix class="search-filters">
      <p>检索条件组件</p>
    </el-affix>

    <div class="results-section">
      <h1 style="color:var(--text-color);">检索结果</h1>

      <div class="sort-controls">
        <el-radio-group v-model="sortBy" fill="var(--button-color)">
          <el-radio-button :value=0 >按相关度排序</el-radio-button>
          <el-radio-button :value=1>按时间排序</el-radio-button>
          <el-radio-button :value=2>按被引次数排序</el-radio-button>
        </el-radio-group>
        <p style="width:25px;height:25px;border: 1px solid var(--gray-color);border-radius: 15px; display: flex; justify-content: center; align-items: center;margin-right:20px">
          <el-icon v-if="sortDown===0" @click="sortDown=1" size="20" color="var(--theme-color)"><SortDown /></el-icon>
          <el-icon v-if="sortDown===1" @click="sortDown=0" size="20" color="var(--theme-color)"><SortUp /></el-icon>
        </p>
      </div>

      <div class="results-list">
        
      <div v-if="!loading && results.length === 0" class="no-results">
        未找到相关论文。
      </div>

        <div 
          v-for="(paper, index) in results" 
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
              <span :style="{ color: citationColor(paper.citations) }">被引次数: {{ paper.citations }}</span>
            </div>
          </div>
          <div class="paper-authors">
            <span v-for="(author, idx) in paper.authors" :key="idx" class="author" @mouseover="hover = true" @mouseleave="hover = false">
              <a :href="`/authors/${author.id}`">{{ author.name }}</a>
            </span>
          </div>
          <div class="paper-keywords">
            <span v-for="(keyword, idx) in paper.keywords" :key="idx" class="keyword">
              <!-- <i class="keyword-icon">#</i>  -->
              {{ keyword }}
            </span>
          </div>

          <div class="action-buttons" >
            <button @click="collectPaper(paper)" class="action-btn"> <el-icon :size="18"><Star /></el-icon></button>
            <button @click="quotePaper(paper)" class="action-btn"><el-icon :size="18"><Share /></el-icon></button>
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

<script setup>
import { ref, onMounted, watch } from 'vue';

const results = ref([]);
const loading = ref(false);
const currentPage = ref(1);
const totalPages = ref(1);
const sortBy = ref(0);
const sortDown = ref(0);

const citationColor = (citations) => {
  if (citations >= 50) {
    return 'rgb(255, 99, 71)';
  } else if (citations >= 20) {
    return 'rgb(255, 165, 0)';
  } else if (citations >= 10) {
    return 'rgb(0, 128, 0)';
  } else {
    return 'rgb(169, 169, 169)';
  }
};

const fetchResults = async () => {
  loading.value = true;

  const response = await new Promise((resolve) =>
    setTimeout(() => {
      const mockData = {
        totalResults: 20,
        papers: Array.from({ length: 10 }, (_, index) => ({
          title: `长长长长长长长长长长长长长长长长超长长长长长长长长长长长长长长长长长长超长长长长长长长长长长长长长长长长长长超长长长长长长长长长长长长长长长长长长超长长标题 ${index + 1 + (currentPage.value - 1) * 10}`,
          date: `2023-08-${index + 1}`,
          journal: '期刊名',
          citations: Math.floor(Math.random() * 100),
          authors: [
            { id: index, name: `作者` },
            { id: index + 1, name: `长长长长长长长长长长长长长长长长超长长长长长长长长长长长长长长长长长长超长长长长长长长长长长长长长长长长长长超长长长长长长长长长长长长长长长长长长超长长长长长长长长长长长长长长长长长长超长长长长长长长长长长长长长长长长长长超长长作者作者 ${index + 2}` },
          ],
          keywords: ['关键词', '关键', '关键111111111'],
        })),
      };

      resolve(mockData);
    }, 1000)
  );

  results.value = response.papers;
  totalPages.value = Math.ceil(response.totalResults / 10);
  loading.value = false;
};

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    fetchResults();
  }
};

const viewPaper = (paper) => {
  console.log('查看全文:', paper);
};

const collectPaper = (paper) => {
  console.log('收藏论文:', paper);
};

const quotePaper = (paper) => {
  console.log('引用论文:', paper);
};

const downloadPaper = (paper) => {
  console.log('下载论文:', paper);
};

watch([sortBy], () => {
  currentPage.value = 1;
  fetchResults();
});

onMounted(() => {
  fetchResults();
});
</script>

<style>

:root {
  --theme-color: #3f389d;
  --light-color: #e9e5fe;
  --back-color: #ffffff;
  --button-color:#bfb5f0;
  --shadow-color:rgba(121, 68, 183, 0.185);
  --deep-shadow:rgba(108, 65, 156, 0.311);
  --gray-color:#cbc7db;
  --dark-color: #8d86a8;
  --secondary-color: #ecfff5;
  --second-text:#212121;
  --text-color: #251c57;
  --light-text-color: #4f4454;
}

.search-container {
  display: flex;
  margin: 20px;
}

.search-filters {
  width: 250px;
  min-width: 250px;
  padding-right: 20px;
  border-right: 2px solid var(--gray-color);
  position: sticky;
}

.results-section {
  padding-left: 20px;
  display: flex;
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
  width: 96%;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  box-shadow: 0 2px 5px var(--shadow-color);
  transform-origin: 30% 50%;
}

.result-item:hover {
  transform: scale(1.015, 1.05);
  box-shadow: 0 2px 10px var(--deep-shadow);
}

.paper-title {
  font-size: 20px;
  margin: 0 0 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--gray-color);
}

.paper-meta {
  margin-bottom: 15px;
  display: flex;
  justify-content: space-between;
}

.paper-date-journal {
  display: flex;
  align-items: center;
  color: var(--dark-color);
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
  margin-top: 10px;
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
</style>
