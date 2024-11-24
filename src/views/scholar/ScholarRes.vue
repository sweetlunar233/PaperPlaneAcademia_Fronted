<template>
    <div class="search-container">
        <h1 style="color:var(--text-color);">学者搜索结果</h1>
  
        <div class="sort-controls">
          <el-radio-group v-model="sortBy" fill="var(--button-color)">
            <el-radio-button :value="0">按相关度排序</el-radio-button>
            <el-radio-button :value="1">按收录论文数排序</el-radio-button>
          </el-radio-group>
          <p style="width:25px;height:25px;border: 1px solid var(--gray-color);border-radius: 15px; display: flex; justify-content: center; align-items: center;margin-right:20px">
            <el-icon v-if="sortDown===0" @click="sortDown=1" size="20" color="var(--theme-color)"><SortDown /></el-icon>
            <el-icon v-if="sortDown===1" @click="sortDown=0" size="20" color="var(--theme-color)"><SortUp /></el-icon>
          </p>
        </div>
  
        <div class="results-list">
<!--             
          <div v-if="!loading && results.length === 0" class="no-results">
            未找到相关学者。
          </div> -->
          
          <div 
            v-for="(scholar, index) in results" 
            :key="index" 
            class="result-item"
            @click="viewScholar(scholar)"
          >
            <h2 class="scholar-name" style="color:var(--text-color)">{{ scholar.name }}</h2>
            
            <div class="scholar-meta">
              <div class="scholar-institution">
                <span class="institution"><i>{{ scholar.institution }}</i></span>
              </div>
              <div class="scholar-papers">
                <span :style="{ color: citationColor(scholar.paperCount) }">论文数: {{ scholar.paperCount }}</span>
              </div>
            </div>
  
            <div class="scholar-collaborators">
              <span v-for="(collaborator, idx) in scholar.collaborators" :key="idx" class="collaborator" @mouseover="hover = true" @mouseleave="hover = false">
                <a :href="`/authors/${collaborator.id}`">{{ collaborator.name }}</a>
              </span>
            </div>
  
            <div class="scholar-fields">
              <span v-for="(field, idx) in scholar.researchFields" :key="idx" class="research-field">
                <i class="field-icon">#</i> {{ field }}
              </span>
            </div>
  
            <div class="action-buttons">
              <button @click="sendMessage(scholar)" class="action-btn">
                <el-icon :size="18"><Promotion /></el-icon>
              </button>
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
          scholars: Array.from({ length: 10 }, (_, index) => ({
            name: `学者 ${index + 1}`,
            institution: `北京航空航天大学`,
            paperCount: Math.floor(Math.random() * 10),
            collaborators: [
                { id: index, name: `悲伤泡椒凤爪` },
            ],
            researchFields: ['机器学习', '人工智能', '大数据'],
          })),
        };
        console.log('Fetched data:', mockData);
        resolve(mockData);
      }, 1000)
    );
  
    results.value = response.scholars;
    totalPages.value = Math.ceil(response.totalResults / 10);
    loading.value = false;
  };
  
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page;
      fetchResults();
    }
  };
  
  const sendMessage = (scholar) => {
    console.log('发送消息给学者:', scholar);
  };

  const viewScholar = (scholar) => {
    console.log('go to scholar:', scholar);
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
    --theme-color: #385b9d;
    --mid-color:#5f96c7;
    --light-color: #e5f1fe;
    --button-color:#b6b5f0;
    --back-color: #fefaff;
    --shadow-color:rgba(85, 68, 183, 0.185);
    --deep-shadow:rgba(85, 65, 156, 0.311);
    --gray-color:#c7c8db;
    --dark-color: #8686a8;
  --secondary-color: #f7ecff;
    --second-text:#660cd4;
    --text-color: #282829;
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
  
  .scholar-name {
    font-size: 22px;
    margin: 0 0 10px;
    border-bottom: 1px solid var(--gray-color);
  }
  
  .scholar-meta {
    margin-bottom: 15px;
    display: flex;
    justify-content: space-between;
  }
  
  .scholar-institution {
    display: flex;
    align-items: center;
    color: var(--dark-color);
  }
  
  .scholar-papers {
    font-size: 14px;
    padding-right: 5px;
  }
  
  .scholar-collaborators {
    margin-top: -5px;
    margin-bottom: 5px;
  }
  
  .collaborator {
    margin-right: 10px;
  }

  .collaborator a {
    color: var(--light-text-color);
    text-decoration: none;
  }
  
  .collaborator a:hover {
    color: var(--second-text);
    text-decoration: underline;
  }
  
  .research-field {
    display: inline-block;
    margin: 5px;
    padding: 5px 10px;
    border: 1px solid var(--gray-color);
    border-radius: 15px;
    background-color: var(--secondary-color);
    font-size: 14px;
    color: var(--second-text);
  }
  
  .field-icon {
    margin-right: 5px;
    color: var(--theme-color);
  }
  
  .sort-controls {
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
  
  .pagination {
    display: flex;
    justify-content: center;
    margin-top: 20px;
    color: var(--text-color);
  }
  
  .pagination button {
    padding: 5px 10px;
    margin: 0 5px;
    cursor: pointer;
    border: 1px solid var(--gray-color);
    background-color: var(--back-color);
    border-radius: 5px;
    color: var(--text-color);
  }
  
  .pagination button:disabled {
    cursor: not-allowed;
    background-color: #e0e0e0;
  }
  
  .pagination span {
    align-self: center;
  }
  </style>
  