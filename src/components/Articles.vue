<script setup>

const gotoPaper = (paperId) => {
    router.push({
    path: '/???',
    query: {
        paperId: paperId
    }
  });
}

const gotoScholar = (userId) => {
    router.push({
    path: '/???',
    query: {
        userId: userId
    }
  });
}

const FormatString = (abstract) => {
    if (!abstract) return "";
      if (abstract.length > 300) {
        return abstract.slice(0,300) + "...";
      }
      return abstract;
}
</script>

<template>
<div class="articles">
    <div class="articles-body">
        <div v-for="(article, index) in articles" v-bind:key="index">
            <div style="text-align: left">
                <div style="margin-bottom: 10px">
                    <span class="title" @click="gotoPaper(article.paperId)">{{ article.paperTitle }}</span>
                </div>
                <span v-for="(author, index1) in article.authors" :key="author" class="author-name">
                    <span @click="gotoScholar(author.userId)">{{ author.userName }}</span>
                    <span v-if="index1 < article.authors.length-1"></span>
                </span>
                <span class="publish-year"> · {{ article.year }}</span>
            </div>

            <div style="text-align:left;margin-top:10px;">
                <span class="abstract">{{ FormatString(article.abstract) }}</span>
            </div>

            <div class="citation-count">
                <span>{{ article.collectNum }}&nbsp;被收藏</span>
                <span>&nbsp;·&nbsp;{{ article.citationNum }}&nbsp;被引用</span>
            </div>

            <el-divider v-if="index<articles.length - 1"></el-divider>
        </div>
    </div>
</div>
</template>

<style scoped>

</style>