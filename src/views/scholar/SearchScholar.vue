<template>
    <el-card style="background-color: #f0f8ff; display: flex; justify-content: center;">
      <div class="search-container">
        <h3 style="font-size: 45px;display: flex;justify-content: center ;">作者搜索<svg t="1732172617443" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3730" width="32" height="32"><path d="M945.08544 366.6432l-425.97376-183.1936a20.5312 20.5312 0 0 0-8.12544-1.6896c-2.7648 0-5.52448 0.5632-8.14592 1.6896L76.87168 366.6432c-8.98048 3.84512-14.92992 13.65504-14.92992 24.59136 0 10.9568 5.94944 20.74112 14.92992 24.60672L502.8352 599.04a20.29056 20.29056 0 0 0 16.27136 0l331.1872-142.43328v145.7152c-17.75104 9.40032-30.08512 29.8496-30.08512 53.62688 0 23.7824 12.33408 44.22656 30.08512 53.62688v50.83136h43.6224v-50.82112c17.76128-9.40032 30.1056-29.8496 30.1056-53.63712s-12.34432-44.2368-30.1056-53.63712V437.84704l51.16416-22.00576c8.97536-3.8656 14.9248-13.65504 14.9248-24.60672 0-10.93632-5.94944-20.74624-14.9248-24.59136z m-434.0992 269.16352a47.96928 47.96928 0 0 1-19.03104-3.95776L226.4064 517.632v157.70112c0 129.16224 193.65888 167.936 254.208 167.936h60.69248c45.35808 0 254.22848-38.77376 254.22848-167.936v-157.696l-265.55904 114.21184a47.76448 47.76448 0 0 1-18.9952 3.95776z" fill="#272636" p-id="3731"></path></svg></h3>
        <div class="author-search">
          <!-- 动态条件 -->
          <div
            class="search-row"
            v-for="(condition, index) in authorConditions"
            :key="index"
            style="display: flex; align-items: center; gap: 10px; margin-bottom: 16px;"
          >
            <!-- 运算符选择 -->
            <el-select v-if="index > 0" v-model="condition.operator" placeholder="逻辑运算" style="width: 80px;">
              <el-option label="AND" value="AND"></el-option>
              <el-option label="OR" value="OR"></el-option>
              <el-option label="NOT" value="NOT"></el-option>
            </el-select>
  
            <!-- 输入框 -->
            <el-input
              v-model="condition.value"
              placeholder="请输入作者相关内容"
              style="flex: 1;width: 800px;"
            />
  
            <!-- 搜索范围选择 -->
            <el-select v-model="condition.scope" placeholder="选择范围" style="width: 150px;">
              <el-option label="作者名" value="name"></el-option>
              <el-option label="机构" value="organization"></el-option>
              <el-option label="研究领域" value="field"></el-option>
            </el-select>
  
            <!-- 删除条件按钮 -->
            <el-button @click="removeCondition(index)" type="text">
              <i class="el-icon-minus"></i>
            </el-button>
          </div>
  
          <!-- 添加条件按钮 -->

            <el-button @click="addCondition(index)" type="text"><svg t="1732017170634" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2660" width="32" height="32"><path d="M512 958.016611c-119.648434 0-232.1288-46.367961-316.736783-130.559656-84.640667-84.255342-131.263217-196.255772-131.263217-315.455235 0-119.168499 46.624271-231.199892 131.232254-315.424271 84.607983-84.191695 197.088348-130.559656 316.736783-130.559656s232.1288 46.367961 316.704099 130.559656c84.67163 84.224378 131.263217 196.255772 131.263217 315.391587 0.032684 119.199462-46.591587 231.232576-131.263217 315.455235C744.1288 911.615966 631.648434 958.016611 512 958.016611zM512 129.983389c-102.623626 0-199.071738 39.743475-271.583282 111.936783-72.480581 72.12794-112.416718 168.063432-112.416718 270.079828s39.903454 197.951888 112.384034 270.047144c72.511544 72.191587 168.959656 111.936783 271.583282 111.936783 102.592662 0 199.071738-39.743475 271.583282-111.936783 72.480581-72.160624 112.416718-168.063432 112.384034-270.079828 0-102.016396-39.903454-197.919204-112.384034-270.016181C711.071738 169.759548 614.592662 129.983389 512 129.983389z" fill="#575B66" p-id="2661"></path><path d="M736.00086 480.00086 544.00086 480.00086 544.00086 288.00086c0-17.664722-14.336138-32.00086-32.00086-32.00086s-32.00086 14.336138-32.00086 32.00086l0 192L288.00086 480.00086c-17.664722 0-32.00086 14.336138-32.00086 32.00086s14.336138 32.00086 32.00086 32.00086l192 0 0 192c0 17.695686 14.336138 32.00086 32.00086 32.00086s32.00086-14.303454 32.00086-32.00086L544.00258 544.00086l192 0c17.695686 0 32.00086-14.336138 32.00086-32.00086S753.696546 480.00086 736.00086 480.00086z" fill="#575B66" p-id="2662"></path></svg></el-button>
              <el-button @click="removeCondition(index)" type="text"><svg t="1732017192235" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2811" width="32" height="32"><path d="M512 960c-247.039484 0-448-200.960516-448-448S264.960516 64 512 64 960 264.960516 960 512 759.039484 960 512 960zM512 128.287273c-211.584464 0-383.712727 172.128262-383.712727 383.712727 0 211.551781 172.128262 383.712727 383.712727 383.712727 211.551781 0 383.712727-172.159226 383.712727-383.712727C895.712727 300.415536 723.551781 128.287273 512 128.287273z" fill="#575B66" p-id="2812"></path><path d="M557.05545 513.376159l138.367639-136.864185c12.576374-12.416396 12.672705-32.671738 0.25631-45.248112s-32.704421-12.672705-45.248112-0.25631l-138.560301 137.024163-136.447897-136.864185c-12.512727-12.512727-32.735385-12.576374-45.248112-0.063647-12.512727 12.480043-12.54369 32.735385-0.063647 45.248112l136.255235 136.671523-137.376804 135.904314c-12.576374 12.447359-12.672705 32.671738-0.25631 45.248112 6.271845 6.335493 14.496116 9.504099 22.751351 9.504099 8.12794 0 16.25588-3.103239 22.496761-9.247789l137.567746-136.064292 138.687596 139.136568c6.240882 6.271845 14.432469 9.407768 22.65674 9.407768 8.191587 0 16.352211-3.135923 22.591372-9.34412 12.512727-12.480043 12.54369-32.704421 0.063647-45.248112L557.05545 513.376159z" fill="#575B66" p-id="2813"></path></svg></el-button>

  
          <!-- 提交和重置按钮 -->
          <div class="search-actions" style="text-align: center;">
            <el-button type="primary" @click="submitSearch">搜索</el-button>
            <el-button type="warning" @click="onReset" style="margin-left: 10px;">重置</el-button>
          </div>
        </div>
      </div>
    </el-card>
  </template>
  
  <script>
  export default {
    name: "AuthorSearch",
    data() {
      return {
        authorConditions: [
          {
            operator: "AND", // 初始条件的运算符
            value: "", // 条件内容
            scope: "name", // 条件范围
          },
        ],
      };
    },
    methods: {
      // 添加新条件
      addCondition() {
        this.authorConditions.push({
          operator: "AND",
          value: "",
          scope: "name",
        });
      },
  
      // 移除条件
      removeCondition(index) {
        this.authorConditions.splice(index, 1);
      },
  
      // 提交搜索
      submitSearch() {
        // 验证条件
        if (!this.authorConditions.every((cond) => cond.value.trim())) {
          this.$message.warning("请填写所有搜索条件");
          return;
        }
  
        // 生成搜索参数
        const searchParams = this.authorConditions.map((cond) => ({
          operator: cond.operator,
          value: cond.value,
          scope: cond.scope,
        }));
  
        // 跳转到 ScholarRes.vue 页面并传递参数
        this.$router.push({ name: "ScholarRes", query: { conditions: JSON.stringify(searchParams) } });
      },
  
      // 重置条件
      onReset() {
        this.authorConditions = [
          {
            operator: "AND",
            value: "",
            scope: "name",
          },
        ];
      },
    },
  };
  </script>
  
  <style scoped>
  .search-container {
    width: 100%;
 
  }
  h3 {
    text-align: center;
    font-weight: bold;
    margin-bottom: 16px;
  }
  .search-row {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 16px;
  }
  .search-actions {
    text-align: center;
  }
  </style>
  