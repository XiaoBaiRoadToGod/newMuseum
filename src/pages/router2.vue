<template>
  <div>路由2
    {{msg}}
  </div>
  
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  data () {
    return {

    }
  },
  computed: {
    ...mapGetters(['msg'])
  }
}
</script>
<style lang="scss" scoped>

</style>

