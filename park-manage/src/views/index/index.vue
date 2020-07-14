<template>
  <div class="homePage-container" :style="maxHeight">
    <div class="imgBox">
        <img class="pic-imgBox" src="@/assets/homePage_images/homePage01.gif">
        <!-- <img class="pic-imgBox" src="@/assets/homePage_images/homePage02.gif"> -->
        <!-- <img class="pic-imgBox" src="@/assets/homePage_images/homePage03.gif"> -->
        <!-- <img class="pic-imgBox" src="@/assets/homePage_images/homePage04.gif"> -->
        <!-- <img class="pic-imgBox" src="@/assets/homePage_images/homePage05.gif"> -->
        <!-- <img class="pic-imgBox" src="@/assets/homePage_images/homePage06.gif"> -->
    </div>
  </div>
</template>

<script>
import { getList, addSystemUser, editSystemUser, deleteSystemUser, getItemSystemUser, editState, resetPasswords } from '@/api/systemUser'

export default {
  data() {
    return {
        maxHeight:{
            height: ''
        }
    }
  },
  created() {
    this.maxHeight.height = document.documentElement.clientHeight + 'px'; //取得浏览器页面可视区域的宽度
  },
  methods: {}
}
</script>

<style lang="scss" scoped>
    .homePage-container{
        width: 100%;
        background: #08CFE0;
        //background: #E2E3E4;
        //background: #F16B52;
        //background: #E6E6E6;
        //background: #FE7AAF;
        //background: #FFCC66;
        position: absolute;
        top: 0;
        left: 0;
        .imgBox{
            width: 100%;
            height: 100%;
            .pic-imgBox{
                display: block;
                margin: 0 auto;
                padding-top: 15%;
            }
        }
    }
</style>
