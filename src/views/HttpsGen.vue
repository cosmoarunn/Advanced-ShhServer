<template>
  <div class="home">
    <HTTPSGen />
  </div>
</template>

<script>
// @ is an alias to /src
import HTTPSGen from '@/components/HTTPSGen.vue'

export default {
  name: 'httpsgen',
  components: {
    HTTPSGen
  }
}
</script>
