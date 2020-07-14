<template>
  <div id="app">
    <router-view class="child-view"/>
  </div>
</template>

<script>
export default {
  name: "App"
};
</script>

<style>


::-webkit-scrollbar {  
    display: none
},

* {
  margin: 0;
  padding: 0;
}
body,
html {
  width: 100%;
  height: 100%;
  background: #000;
}
li {
  list-style: none;
}
a {
  text-decoration: none;
}
i {
  font-style: normal;
}
b,
strong {
  font-weight: normal;
}
/* #app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
} */
.child-view {
  position: absolute;
  text-align: center;
  transition: all 0.4s cubic-bezier(0.55, 0, 0.1, 1);
  top: 0;
  left: 0;
  right: 0;
  /*background: #fff;*/
  will-change: transform;
}
</style>
