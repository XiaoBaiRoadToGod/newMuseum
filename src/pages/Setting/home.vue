<template>
  <Container :route-path='routerPath' type='setting'></Container>
</template>
<script>
import Container from '@/components/Container'
export default {
  data () {
    return {
      routerPath: []
    }
  },
  components: { Container },
  methods: {

  },
  created () {
    this.routerPath = this.$router.options.routes[1]
  },
  mounted () {
    console.log(this.$router.options.routes[1])
  }
}
</script>
<style lang="scss" scoped>

</style>


