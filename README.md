# 项目简介 （ETC-销售）

## 项目启动
```
项目目录： cnpm i

项目启动： npm start

项目打包： npm build
```

## 项目介绍

1、配置是路由，文件为config/config.js <br />
2、文件页面地址 src/pages <br />
3、.umi文件夹为框架文件夹，__test__文件夹为框架测试文件夹（两个文件夹忽略）<br />
4、文件图片分为两种：1）背景图放在 src/assets/(主要用于less文件中，路径使用相对路径) 2）js中img地址放在public/img/(用于js中img.src属性)-----文件夹内可自定义文件夹 <br />
5、redux方式采用dva模式，存放在models中，具体可以参考dva项目 <br />
6、mock数据方式采用dva模式，存在在mock文件夹中，具体可以参考dva项目 <br />
7、公用组件存放在 src/components/中，--需分类存放-- <br />
8、接口文件存在 src/services/中 <br />
9、相关单元、方法存放在src/utils中 <br />


## 图片处理
sketch导出的图片需要经过压缩后在放入文件夹内，压缩图片地址：https://tinypng.com/


## 样式书写
0、组件引用antd-mobile,而非antd<br />
1、用rem取写单位，设计图为375px,所以网页尺寸 = 设计图尺寸 / 37.5， 例如70px的设计图，less文件的尺寸为2rem，或者采用公示/less/Index.less文件中的.pxTorem这个方法！/home/home.less中的.btn <br />
2、样式颜色或者大小尽量采用less/Index.less中定义的变量<br />
3、border，字体大小采用px，不采用rem作为单位<br />

## 二级路由书写
1、例如订单页面，订单首页路由为/order,那么订单详情/order/detail这样去写二级路由！<br />
2、二级路由存放位置，放在相应的文件夹内，router.config.js书写：/order/detail 与/order平级，不可嵌套<br />

## 分之
1、dev 开发分之.
