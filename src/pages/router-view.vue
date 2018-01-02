<template>
<keep-alive>
  <router-view @windowReset='windowReset'/>
</keep-alive>
  

</template>
<script>
export default {
  data () {
    return {

    }
  },
  methods: {
    windowReset () {
      this.$emit('windowReset')
    }
  },
  mounted () {
    
  }
}
</script>

