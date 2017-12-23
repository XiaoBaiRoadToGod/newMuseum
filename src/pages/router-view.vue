<template>

  <router-view @windowReset='windowReset'/>

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

