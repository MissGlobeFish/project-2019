<template>
  <div id="app">
    <transition :name="transitionName">
      <!-- <keep-alive include="newEstateOrder"> -->
        <navigation>
          <router-view class="child-view"/>
        </navigation>
        <!-- </keep-alive> -->
      </transition>
    </div>
  </template>

  <script>
  export default {
    name: 'App',
    data () {
      return {
        transitionName: 'slide-left', 
      }
    },
    watch: {
      '$route' (to, from) {
　　　 let routerStats = this.$router.routerStats ; //  监听路由变化时的状态为前进还是后退
      switch(routerStats){
        case "push":
        this.transitionName = "slide-left";
        break;
        case "pop":
        this.transitionName = "slide-right";
        break;
        default:
        this.transitionName = "normal";
      } 
      this.$router.routerStats = "normal";
    }
  },
}
</script>

<style>

/*
  .header {
    position:absolute;
    height:44px;
    width:100%
    }*/

    *{
      margin: 0;
      padding: 0;
    }
    body,html{
      width: 100%;
      background: #F9FAFC;
    }
    li{
      list-style: none;
    }
    a{
      text-decoration: none;
    }
    i{
      font-style: normal;
    }
    b,strong{
      font-weight: normal;
    }
    #app {
      font-family: 'Avenir', Helvetica, Arial, sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      text-align: center;
      color: #2c3e50;
    }
    .child-view {
      position: absolute;
      transition: all .4s cubic-bezier(.55,0,.1,1);
      top: 0;
      left: 0;
      right: 0;
      /*background: #fff;*/
      /* will-change: transform; */
    }
    .slide-left-enter, .slide-right-leave-active {
      -webkit-transform: translateX(100%);
      transform: translateX(100%);
      z-index: 1;
    }
    .slide-left-leave-active, .slide-right-enter {
      -webkit-transform: translateX(-50px);
      transform: translateX(-50px);
      z-index: -1;
    }
    </style>
