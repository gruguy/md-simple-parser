# md-simple-parser

## 项目简介
本项目是一个轻量的markdown格式转换工具。是我在使用markdown写微信文章时发现：很多现有的转换器格式支持有问题，样式单一，所以决定自己写本项目。

![项目图片](https://raw.githubusercontent.com/gruguy/md-simple-parser/master/public/assets/img/md-simple1.png)

## 使用技术

* markdown-it 这是一个github开源组件，用于markdown转换，链接在这里 [markdown-it](https://github.com/markdown-it/markdown-it)

* highlightjs 用于高亮代码的插件，拥有很多种主题样式，我根据本人喜好选择了部分主题，如果需要更多主题，去访问 [highlightjs](https://highlightjs.org/)

* 本项目是基于vue-cli3创建的，所以是基于VUE的项目

## 项目使用 

首先得下载项目

```
git clone git@github.com:gruguy/md-simple-parser.git
```
项目下载完成后，需要下载npm依赖包：

```
npm install
```
下载依赖包完成，启动本地项目：
```
npm run serve
```
你还可以对项目进行打包，部署到自己服务器上，方便随时使用：
```
npm run build
```
打完包，在项目中找到dist目录，拷贝至自己的服务器上面即可。

## 最后做了一个操作的gif图片

![项目图片](https://raw.githubusercontent.com/gruguy/md-simple-parser/master/public/assets/img/md-simple-parser-opt_ev.gif)

## demo我运行在GitHub上面了，点击这里查看[点我查看demo](https://gruguy.github.io/md-simple-parser/)

### tips: 如何将vue项目打包的dist目录发布到git pages

- 本地vue项目打包，注意更改`publicPath` 为 './' 或者 '/项目名/'

- git提交代码并将dist目录提交至github上（需要去.gitignore文件中去掉dist）

- 运行代码： `git subtree push --prefix dist orgin gh-pages`其中 orgin是你自己的项目github地址，替换即可，这段代码会生成一个gh-pages 分支，并且将dist目录拷贝进去

- 项目切换到gh-pages分支，打开 setting -> GitHub Pages 如果你之前发布过git pages那现在已经发不好了，复制地址打开就好 
