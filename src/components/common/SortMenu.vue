<template>
  <div class="sort">
    <div class='sortItems' v-for="(item,index) in sortMenu" :key="index">
      <span>{{item}}</span>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        sortMenu: ['综合排序', '距离最近', '品质联盟', '筛选']
      }
    }
  }

</script>
<style lang="scss" scoped>
    @import '@/style/mixin.scss';
  .sort {
    @include fdaj();
    @include sc(0.6rem, #333);
    padding: 1rem;

  }

</style>
