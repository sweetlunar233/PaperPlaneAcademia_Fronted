<template>
    <div>
      <!-- 导航栏 -->
      <el-header>
        <h3>导航栏</h3>
      </el-header>
  
      <!-- 高级搜索 -->
      <el-main>
        <div class="search-container">
          <h2>AdvSearch</h2>
          <div class="basic-search">
            <el-select v-model="searchType" placeholder="搜索类型">
              <el-option
                v-for="item in searchTypes"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            <el-input v-model="searchKeyword" placeholder="搜索框" class="search-input" />
          </div>
  
          <!-- 高级搜索 -->
          <h3>高级搜索</h3>
          <div class="advanced-search">
            <div class="search-row" v-for="(field, index) in advancedFields" :key="index">
              <el-input
                v-model="field.value"
                placeholder="搜索框"
                class="advanced-input"
              />
              <el-button @click="addField(index)" icon="el-icon-plus"></el-button>
              <el-button @click="removeField(index)" icon="el-icon-minus"></el-button>
            </div>
            <div class="date-range">
              <el-date-picker
                v-model="dateRange[0]"
                type="date"
                placeholder="从"
              />
              <el-date-picker
                v-model="dateRange[1]"
                type="date"
                placeholder="到"
              />
            </div>
            <el-button type="primary" @click="submitSearch">确定</el-button>
          </div>
        </div>
      </el-main>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        searchType: null,
        searchKeyword: "",
        searchTypes: [
          { label: "标题", value: "title" },
          { label: "作者", value: "author" },
          { label: "关键词", value: "keyword" },
        ],
        advancedFields: [
          { value: "" },
        ],
        dateRange: [null, null],
      };
    },
    methods: {
      addField(index) {
        this.advancedFields.splice(index + 1, 0, { value: "" });
      },
      removeField(index) {
        if (this.advancedFields.length > 1) {
          this.advancedFields.splice(index, 1);
        }
      },
      submitSearch() {
        console.log("搜索类型:", this.searchType);
        console.log("关键词:", this.searchKeyword);
        console.log("高级字段:", this.advancedFields.map((field) => field.value));
        console.log("日期范围:", this.dateRange);
      },
    },
  };
  </script>
  
  <style scoped>
  .search-container {
    padding: 20px;
  }
  .basic-search,
  .advanced-search {
    margin: 20px 0;
  }
  .search-input {
    margin-left: 10px;
    width: 300px;
  }
  .advanced-input {
    margin-right: 10px;
    width: 300px;
  }
  .date-range {
    display: flex;
    gap: 10px;
    margin: 10px 0;
  }
  </style>
  