<template>
  <Container :route-path='routerPath' type='home'/>


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
    created () {
        this.routerPath = this.$router.options.routes[0].children;
    },
    mounted() {
        // console.log(this.$router.options.routes)
        
    }
}
</script>
<style lang="scss" scoped>

</style>


