<template>
  <div class="home">
    <btn-start />
  </div>
</template>

<script>
// @ is an alias to /src
import BtnStart from '@/components/BtnStart.vue'

export default {
  name: 'Home',
  components: {
    BtnStart
  }
}
</script>
<style scoped>
.home {
  width: 100%;
  height: 100%;
}
</style>
