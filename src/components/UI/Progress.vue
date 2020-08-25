<template>
  <div>
    <!-- <div v-for="bar in bars" class="row mb-1"> -->
      <div class="col-sm-2">{{ bar.variant }}:</div>
      <div class="col-sm-10 pt-1">
        <b-progress :value="bar.value" :variant="bar.variant" :key="bar.variant"></b-progress>
      </div>
    <!-- </div> -->
  </div>
</template>

<script>
  export default {
    props: { 
      variant: { type: String, default: Boolean }
      value: { type: Integer, default: 0 }
    },
    data() {
      return {
        bars: [
          { variant: 'success', value: this.value },
          { variant: 'info', value: this.value },
          { variant: 'warning', value: this.value },
          { variant: 'danger', value: this.value },
          { variant: 'primary', value: this.value },
          { variant: 'secondary', value: this.value },
          { variant: 'dark', value: this.value }
        ],
        timer: null
      }
    },
    mounted() {
      /*this.timer = setInterval(() => {
        this.bars.forEach(bar => (bar.value = 25 + Math.random() * 75))
      }, 2000)*/
    },
    beforeDestroy() {
      clearInterval(this.timer)
      this.timer = null
    }
  }
</script>