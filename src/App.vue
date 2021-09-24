<template>
  <div id="app">
    <router-view/>
  </div>
</template>


<style>
body{
  overflow: hidden;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  font-family: "Microsoft Yahei","Hiragino Sans GB","Heiti SC","WenQuanYi Micro Hei",sans-serif;
  -webkit-app-region: drag
}

::-webkit-scrollbar {

  width: 9px;

  height: 9px;

}

::-webkit-scrollbar-track-piece {

  background-color: rgb(245, 245, 245);

}

::-webkit-scrollbar-thumb {

  background-color: #dddddd;

  background-clip: padding-box;

  min-height: 10px;

  border-radius: 3px;

}

/*定义滚动条轨道 内阴影+圆角*/
::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
  border-radius: 10px;  /*滚动条的背景区域的圆角*/
  background-color: red;/*滚动条的背景颜色*/
}

/*定义滑块 内阴影+圆角*/
::-webkit-scrollbar-thumb {
  border-radius: 99px; /*滚动条的圆角*/
  /*-webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, .3);*/
  /*background-color: green;  !*滚动条的背景颜色*!*/
}
</style>
