<template>
    <div>
      <!-- 导航栏 -->

  
      <!-- 高级搜索 -->
      <el-main>
        <el-card class="custom-card">
          <h2 style="display: flex;justify-content: center ; font-size: 60px; color: white ;text-shadow: 
    1px 1px 1px black, 
    /* -2px -2px 3px black,  */
    /* 5px -5px 5px black, */
    -5px 5px 5px black;">高级搜索<svg t="1732093185852" style="color: white;" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2792" width="32" height="32"><path d="M974.966667 91.46a21.333333 21.333333 0 0 0-21.713334-5.033333l-896 298.666666a21.333333 21.333333 0 0 0-4.226666 38.533334L256 545.413333V832a21.333333 21.333333 0 0 0 36.42 15.086667L448 691.506667l240.913333 240.913333a21.333333 21.333333 0 0 0 35.426667-8.666667l256-810.666666a21.333333 21.333333 0 0 0-5.373333-21.626667z" fill="rgb(121.3, 187.1, 255)" p-id="2793"></path></svg></h2>
          <div class="basic-search">
            <el-select v-model="searchType" placeholder="类型" style="width: 100px;">
              <el-option
                v-for="item in searchTypes"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            <el-input v-model="searchKeyword" placeholder="搜索..." class="search-input" />
          </div>
        </el-card>
        <el-row gutter="20">
          <el-col :span="24">
        <el-card style="background-color: #f5f5f5;display: flex;justify-content: center ;">
          <div class="search-container">
          <!-- 高级搜索 -->
    <h3 style="font-size: 30px;display: flex;justify-content: center ;">高级选项</h3>
    <div class="advanced-search">
      <div class="search-row" v-for="(field, index) in advancedFields" :key="index" style="display: flex; align-items: center; gap: 10px;">
        <!-- 逻辑下拉框 -->
        <el-select v-model="field.logic" placeholder="选择逻辑" style="width: 100px;">
          <el-option label="AND" value="and"></el-option>
          <el-option label="OR" value="or"></el-option>
          <el-option label="NOT" value="not"></el-option>
        </el-select>

        <!-- 搜索输入框 -->
        <el-input
          v-model="field.value"
          placeholder="关键词"
          class="advanced-input"
          style="flex: 1;"
        />
        <span style="font-weight: bold; ">in</span>
        <!-- 搜索范围下拉框 -->
        <el-select v-model="field.scope" placeholder="选择范围" style="width: 150px;margin-left: 10px">
          <el-option label="标题" value="title"></el-option>
          <el-option label="作者" value="author"></el-option>
          <el-option label="关键词" value="keywords"></el-option>
        </el-select>

        <!-- 增加/删除按钮 -->
        <el-button @click="addField(index)" type="text"><svg t="1732017170634" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2660" width="32" height="32"><path d="M512 958.016611c-119.648434 0-232.1288-46.367961-316.736783-130.559656-84.640667-84.255342-131.263217-196.255772-131.263217-315.455235 0-119.168499 46.624271-231.199892 131.232254-315.424271 84.607983-84.191695 197.088348-130.559656 316.736783-130.559656s232.1288 46.367961 316.704099 130.559656c84.67163 84.224378 131.263217 196.255772 131.263217 315.391587 0.032684 119.199462-46.591587 231.232576-131.263217 315.455235C744.1288 911.615966 631.648434 958.016611 512 958.016611zM512 129.983389c-102.623626 0-199.071738 39.743475-271.583282 111.936783-72.480581 72.12794-112.416718 168.063432-112.416718 270.079828s39.903454 197.951888 112.384034 270.047144c72.511544 72.191587 168.959656 111.936783 271.583282 111.936783 102.592662 0 199.071738-39.743475 271.583282-111.936783 72.480581-72.160624 112.416718-168.063432 112.384034-270.079828 0-102.016396-39.903454-197.919204-112.384034-270.016181C711.071738 169.759548 614.592662 129.983389 512 129.983389z" fill="#575B66" p-id="2661"></path><path d="M736.00086 480.00086 544.00086 480.00086 544.00086 288.00086c0-17.664722-14.336138-32.00086-32.00086-32.00086s-32.00086 14.336138-32.00086 32.00086l0 192L288.00086 480.00086c-17.664722 0-32.00086 14.336138-32.00086 32.00086s14.336138 32.00086 32.00086 32.00086l192 0 0 192c0 17.695686 14.336138 32.00086 32.00086 32.00086s32.00086-14.303454 32.00086-32.00086L544.00258 544.00086l192 0c17.695686 0 32.00086-14.336138 32.00086-32.00086S753.696546 480.00086 736.00086 480.00086z" fill="#575B66" p-id="2662"></path></svg></el-button>
              <el-button @click="removeField(index)" type="text"><svg t="1732017192235" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2811" width="32" height="32"><path d="M512 960c-247.039484 0-448-200.960516-448-448S264.960516 64 512 64 960 264.960516 960 512 759.039484 960 512 960zM512 128.287273c-211.584464 0-383.712727 172.128262-383.712727 383.712727 0 211.551781 172.128262 383.712727 383.712727 383.712727 211.551781 0 383.712727-172.159226 383.712727-383.712727C895.712727 300.415536 723.551781 128.287273 512 128.287273z" fill="#575B66" p-id="2812"></path><path d="M557.05545 513.376159l138.367639-136.864185c12.576374-12.416396 12.672705-32.671738 0.25631-45.248112s-32.704421-12.672705-45.248112-0.25631l-138.560301 137.024163-136.447897-136.864185c-12.512727-12.512727-32.735385-12.576374-45.248112-0.063647-12.512727 12.480043-12.54369 32.735385-0.063647 45.248112l136.255235 136.671523-137.376804 135.904314c-12.576374 12.447359-12.672705 32.671738-0.25631 45.248112 6.271845 6.335493 14.496116 9.504099 22.751351 9.504099 8.12794 0 16.25588-3.103239 22.496761-9.247789l137.567746-136.064292 138.687596 139.136568c6.240882 6.271845 14.432469 9.407768 22.65674 9.407768 8.191587 0 16.352211-3.135923 22.591372-9.34412 12.512727-12.480043 12.54369-32.704421 0.063647-45.248112L557.05545 513.376159z" fill="#575B66" p-id="2813"></path></svg></el-button>
      </div>

      <!-- 日期范围 -->
      <span style="color: #a0a0a0; font-size: 15px; margin-top: 8px;">发表日期</span>
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
      <el-button type="primary" @click="submitSearch" style="background-color: #333; color: white; border-radius: 5px; border: 1px solid; padding: 8px 20px;margin-top:3%;">确定</el-button>
      <el-button type="warning" @click="onReset" style="margin-left: 10px;margin-top: 3%; border-radius: 5px; border: 1px solid; padding: 8px 20px;">重置</el-button>
    </div>
          
          
        </div>
          </el-card>
        </el-col>
        
        </el-row>
        
      </el-main>
    </div>
  </template>
  
  <script>

  import { ref, reactive, onMounted } from 'vue';
  import { useRouter } from 'vue-router';

  export default {
    data() {
      return {
        searchType: null,
        searchKeyword: "",
        searchTypes: [
          { label: "标题", value: "title" },
          { label: "作者", value: "author" },
          { label: "关键词", value: "keywords" },
        ],
        advancedFields: [
          { value: "", logic: null, scope: null},
        ],
        dateRange: [null, null],
      };
    },
    methods: {
      addField(index) {
        console.log('Adding field at index:', index);
        this.advancedFields.splice(index + 1, 0, { value: "" });
      },
      removeField(index) {
        if (this.advancedFields.length > 1) {
          this.advancedFields.splice(index, 1);
        }
      },
      
      submitSearch() {
        // 构造 searchData 格式的数据
        // 构造 searchData 格式的数据
        const searchData = this.advancedFields.map(field => {
        // 检查每个条件的逻辑（logic）是否为空
          if (!field.logic) {
            // this.$message.warning("请为所有条件选择逻辑！");
            return null;  // 如果没有选择逻辑，则返回 null，跳过此条数据
          }

          return {
              logic: field.logic || null, // 保留原来的逻辑
              value: field.value || null,  // 保留原来的值
              scope: field.scope || null   // 保留原来的范围
          };
        }).filter(item => item !== null);  // 过滤掉没有逻辑的条件

        // if (searchData.length === 0) {
        //     return;  // 直接返回，阻止继续执行后面的代码
        // }

        // 将 searchType 和 searchKeyword 作为额外的条件添加到 searchData 中
        if (this.searchKeyword && this.searchType) {
          searchData.unshift({  // 使用 unshift() 将其放在数组的第一位
            logic: null,         // 没有逻辑
            value: this.searchKeyword,  // 将 searchKeyword 作为 value
            scope: this.searchType // 将 searchType 作为 scope
          });
        } else {
          this.$message.warning("请填写搜索条件");
          return;
        }
        const formatDate = (date) => {
          if (!date) return null;
          const d = new Date(date);
          return d.toISOString().split('T')[0]; // 只保留 'yyyy-mm-dd' 部分
        };

        const formattedDateRange = this.dateRange ? this.dateRange.map(date => formatDate(date)) : [];
        // 创建 payload，包含搜索条件和日期范围
        const payload = {
          searchConditions: searchData,
          dateRange: formattedDateRange,
        };

        console.log('搜索提交数据:', payload);

        // 跳转并传递数据到搜索结果页面
        this.$router.push({
          name: 'searchRes',
          query: {
            searchConditions: JSON.stringify(payload.searchConditions),
            dateRange: JSON.stringify(payload.dateRange)
          }
        });
      },
      onReset() {
        // 重置所有搜索条件
        this.searchType = null; // 清空搜索类型
        this.searchKeyword = ""; // 清空关键词
        this.advancedFields = [{ value: "" }]; // 重置高级搜索字段为一个空的输入框
        this.dateRange = [null, null]; // 清空日期范围
        console.log("所有条件已重置");
    },
    },
  };
  </script>
  
  <style scoped>
  .search-container {
    padding: 20px;
  }
  .basic-search {
    display: flex;
    justify-content: center;
    margin: 20px 0;
  }
  .advanced-search {
    
    margin: 20px 0;
  }
  .search-input {
    margin-left: 0px;
    width: 800px;
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
  .custom-card {
    background:url(../../assets/images/advSearch.png);
    background-size: cover;
    background-color: #f0f8ff; /* 浅蓝色背景 */
    border-radius: 8px;       /* 圆角 */
    padding: 20px;            /* 内边距 */
    border: 1px solid #dcdcdc; /* 可选：设置边框 */
}
.search-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px; /* 调整行距 */
}
.search-row span {
  font-weight: bold;
  margin: 0 5px; /* "in" 的左右间距 */
}

  </style>
  