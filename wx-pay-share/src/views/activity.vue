<template>
   <div class="activity">
    <img class="header" src="./../assets/img/header.png"/>
    <div class="content">
      <div class="item-info">
        <h2 class="item-title">活动说明</h2>
        <ul class="item-ul">
          <li class="item-li">1、欢迎来到慕课支付专项课程</li>
          <li class="item-li">2、本课程专门针对大家对微信SDK使用的痛点进行讲解</li>
          <li class="item-li">3、从公众号创建，微信支付申请到代码编写手把手教大家使用相关API功能</li>
          <li class="item-li">4、课程最大的难点在于开发流程的理解和签名算法的生成</li>
          <li class="item-li">5、此课程通过几个页面将支付和分享相关业务串联起来让大家彻底熟悉微信支付功能</li>
        </ul>
      </div>
      <p class="tip">在法律范围允许范围内，本课程最终版权归慕课所有</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'activity'
}
</script>
<style>
  .activity{
    background-color:#FFC93A;
  }
  .header{
	width: 100%;
	height: 312px;
  }
  .content{
    padding: 20px 36px;
  }
  .item-info{
    padding: 36px 20px 82px;
    background-color:#FFFFFF;
    box-shadow:0px 8px 48px 6px rgba(252,195,56,0.44);
    border-radius: 10px;
  }
  .item-info .item-title{
    background: url('./../assets/img/tip.png') no-repeat;
    background-size: 50%;
    background-position: center;
    text-align:center;
    font-size: 15px;
    color:#3F1E00;
    margin-bottom: 28px;
  }
  .item-info .item-ul{
    list-style:none;
    font-size: 15px;
    color: #9e9999;;
  }
  .item-info .item-ul .item-li{
    font-size: 14px;
    font-weight:normal;
    color:#333333;
    line-height: 24px;
  }
  .content .tip{
    margin-top: 44px;
    text-align:center;
    font-size: 12px;
    color:#6D5312;
  }
</style>