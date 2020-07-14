<template>
    <div class="succeed">
        <div class="one">
            <div class="imge"></div>
            <div class="hint">操作成功！</div>
        </div>
        <router-link class="two" to="/">完成</router-link>
        <Bottom />
    </div>
</template>

<script>
import Bottom from "../common/Bottom";

export default {
  name: "Succeed",
  components: {
    Bottom: Bottom
  },
  data() {
    return {};
  }
};
</script>

<style lang="less">

@lineHeight: 44px;
@boxShadow: 0 2px 4px 0 rgba(102, 102, 102, 0.1);

.succeed {
  height: 100%;
  position: relative;
  padding: 14px 12px 0;
  box-sizing: border-box;

  .one {
    width: 100%;
    height: 176px;
    background: #fff;
    box-shadow: @boxShadow;
    padding-top: 32px;
    box-sizing: border-box;
  }

  .two {
    width: 100%;
    height: @lineHeight;
    color: rgb(255, 102, 0);
    font-size: 16px;
    background: #fff;
    line-height: @lineHeight;
    text-align: center;
    text-decoration: none;
    box-shadow: @boxShadow;
    display: block;
    margin: 10px 0;
  }

  .imge {
    width: 74px;
    height: 74px;
    background: rgb(255, 102, 0) url(../../assets/face.png) no-repeat 21px 26px;
    background-size: 32px 29px;
    border-radius: 50%;
    margin: 0 auto;
  }

  .hint {
    color: rgb(38, 38, 38);
    font-size: 18px;
    text-align: center;
    margin-top: 16px;
  }
  .Bottom{
    width: 100%;
    text-align: center;
    position: absolute;
    left: 0;
    bottom: 0;
  }
}
</style>
