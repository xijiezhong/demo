<template>
  <div class="start-btn-wrapper">
    <el-button
      @click="startTest"
      type="primary"
      round>
      开始
    </el-button>
  </div>
</template>

<script>
export default {
  name: 'BtnStart',
  methods: {
    startTest () {
      this.$router.push('/test')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.start-btn-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
