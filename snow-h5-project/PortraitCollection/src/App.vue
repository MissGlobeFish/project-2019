<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
// export default {
//   name: 'App'
// }
import UploadPortraitView from './components/UploadPortraitView'
import PCpage from './components/PCpage'
import SuccessPage from './components/SuccessPage'

export default {
  name: 'app',
  components: {
    UploadPortraitView
  }
}
</script>

<style>
#app,body,html {
  margin: 0px;
  height: 100%;
  width: 100%
}



</style>
