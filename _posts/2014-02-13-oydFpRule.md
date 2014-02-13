---
layout: post
title: 东方永德前端开发规范
description: 无规矩不成方圆。望有心人多提宝贵意见，拜谢！
keywords: 前端开发规范,前端开发
tags: 前端 文档
---

###关于本规范

本规范由前端开发工程师负责编写，服务器端工程师补充完善。

由于项目的维护和二次开发可能是直接的或间接的团队合作，为提高团队协作效率, 便于后台人员添加功能及前端后期优化维护, 输出高质量的文档。所以该文档**核心是一个较为松散但有据可循，首要目的是确保项目可维护性的前端规范**。

好的可维护性，需要从四个方面下手：

1. 代码的松耦合，高度模块化，将页面内的元素视为一个个模块，相互独立，尽量避免耦合过高的代码，从html,css,js三个层面都要考虑模块化。
2. 良好的注释与代码风格。
3. 结构、样式与行为（html,css,js）高度分离并语义化元素
4. 严格按照规范编写代码。
     
	 

###基本准则
符合web标准，语义化html，结构（Xhtml）、样式（CSS）、行为（JavaScript）完全分离，兼容性优良。页面性能方面，代码要求简洁明了有序，尽可能的减小服务器负载，保证最快的解析速度。
<!--more-->
###静态页文档结构
[下载模板文件夹](/resouse/FPmodel.rar)
<pre>
root/
	`--index.html           html模板页面
	|--psd                  存放静态页面原型图
	|--js                   脚本文件夹
		`--jquery.js        默认包含jquery1.8.3.min
		`--common.js        默认包含通用脚本文件
	|--skins                页面样式文件夹
		|--images           图标、背景图片文件夹
		|--ui               js组件样式
		`--basic.css        默认包含基础样式文件
		`--common.css       默认包含通用样式文件
		`--page.css         默认包含页面特有样式文件
	|--pic                  示例图片文件夹
</pre>

###命名规则
1.模块组件化，组件中的class或id名采用骆驼命名法和下划线相结合的方式，单词之间的分隔靠大写字母分开，从属关系靠下划线分隔。例如：
<pre>
&lt;ul class="testList"&gt;
	&lt;li class="testList_firstItem"&gt;从属关系，命名使用下划线分隔&lt;/li&gt;
	&lt;li&gt;XXXXXXXXX&lt;/li&gt;
	&lt;li&gt;XXXXXXXXX&lt;/li&gt;
&lt;/ul&gt;
</pre>

2.命名清晰，不怕命名长，怕命名容易冲突，长命名可以保证不会产生冲突，所以css选择时可以尽量不使用子选择符，也能确保css优先级权重足够低，方便扩展时的覆盖操作。

3.命名避免使用中文拼音，应该采用更简明有语义的英文单词进行组合。

4.id用于标识模块或页面的某一个父容器区域，名称必须唯一，不要随意新建id。<del>可用命名可以参考 <a href="" title="常用命名与语义">常用命名与语义</a></del>

5.使用有意义的或通用的ID和class命名：ID和class的命名应反映该元素的功能或使用通用名称，而不要用抽象的晦涩的命名。反映元素的使用目的是首选；使用通用名称代表该元素不表特定意义，与其同级元素无异，通常是用于辅助命名；使用功能性或通用的名称可以更适用于文档或模版变化的情况。

###HTML初始化
初始化HTML应包括一下几点，具体见模板index.html文件

1. DTD统一用&lt;!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">。
2. 编码使用UTF-8
3. 上线互联网产品至少应包括Keywords,description与title

###HTML规则
1.标签语义化，确保在去css后具有良好的可读性

2.应在保证弹性的基础上尽量减少嵌套层数结构清晰

3.使用Tab缩进，根元素无缩进

4.所有编码均遵循xhtml标准, 且所有标签必须闭合, 包括br (&lt;br />), hr(&lt;hr />)等；标签属性必须在引号内；所有特殊字符必须编码；所有图片必须包含alt属性；所有链接必需包含title属性。

5.特殊符号使用转码，可参考 <del><a href="../resource/webTools/tools.php#d-htmlchar">常见转义字符</a> | <a href="../resource/doc/转义字符.txt">字符表下载</a></del>

###样式CSS
1.CSS分为三类，通用类、组件类和业务类。通用类包括reset和常用样式的basic.css，专人维护。组件类为js组件关联的样式，置于ui文件夹下；业务类为页面或站点特有样式。

2.单个CSS文件避免过大（建议少于300行）

3.所有内部、外联的css文件须放置在head中加载

4.避免在CSS中使用expression

5.绝对不要在CSS中使用*选择符

6.层级(z-index)必须清晰明确，页面弹窗、气泡为最高级（最高级为999），不同弹窗气泡之间可在三位数之间调整；普通区块为10-90内10的倍数；区块展开、弹出为当前父层级上个位增加，禁止层级间盲目攀比。

7。关于书写规则，暂不作特别严格规范。其他CSS的注意事项可以参考 <del><a href="#h1-2">命名规则</a> | <a href="#">常用HACK</a> | <a href="#">其他</a></del>

###行为——Javascript
1.js分为通用组件库与业务组件，通用组件库由专人维护，并提供详细文档Demo。

2.开源组件必须保留原作者完整版权信息，并保留官网或说明文档网址

3.为避免JS冲突，必须控制全局变量数量。每段功能代码要使用匿名函数包裹，控制变量的作用域

4.通过设置全局命名空间OYD = {} 完成各匿名函数间的通信

5.模板文件引入jQuery时，不要使用$符号，用jQuery替代，避免冲突

6.与HTML、CSS高度分离：不要在HTML标签内通过onClick等触发程序，应使用事件监听。不要在程序内设置CSS样式，应通过添加、删除、替换样式的class达到目的，并在注释中注明样式的class

7.页面引入的JS文件，放置在页尾加载。

8.书写习惯暂不做严格规范。严格缩进，代码结构清晰，注释完整即可。其他可参考<del><a href="#h1-2">命名规则</a></del>

###图片规范
1.图片主要分为两类：作为背景、图标的样式图片；以及照片等内容图片。**每张图片不得超过50KB**（2013年中国平均网速375KB/s）

2.样式图片文件名须有意义

3.严格区分做样式图片与内容图片。做为背景的图片采用Css sprite技术，放在一张大图里。Css sprite技术的优点是减少了http请求数，但使图片面性css的background-position耦合度增加了，增加了维护成本。如果图片有修改，不要删已添加的图片，在空白处新增修改后的图片，减小修改的风险。

4.背景图避免使用过小的背景图片平铺。对渲染性能影响很大

5.如果有半透明阴影，使用PNG24无法IE6中显示。除非特别必要，建议原型图中去除阴影并使用PNG8存储，针对IE6HACK

6.页面通过&lt;img src=""/>内容图片时，须为其设置尺寸，并以16:9或4:3为最佳

7.因为背景图总是最后加载，所以作为logo,章节标题的样式图片，必须通过&lt;img src=""/>导入而不得通过背景图方式。且必须设置文字语义，例如：
<pre>
&lt;h1>&lt;img src="logo.png" alt="东方永德公司"/>&lt;/h1>
&lt;h2>&lt;img src="title.png" alt="公司文化"/>&lt;/h2>
</pre>

8.页面图片过多时，使用lazyLoad组件延迟加载

9.关于Web上常用的图片设计、格式等内容可参考<del> <a href="../resource/doc/photo&design.docx">图片与设计（文档版）</a> </del>| <a href="http://ued.taobao.org/blog/?p=3196">Web版</a>

###兼容性与测试

1.浏览器兼容性
浏览器测试优先级：IE8、Chrome、IE9、IE7、IE6、Firefox。

因360浏览器、搜狗浏览器、猎豹浏览器通过封装IE、Chrome内核实现，故兼容性不作特殊要求
<blockquote>
<table>
	<thead>
		<tr>
			<th>浏览器</th>
			<th>浏览器占比例</th>
			<th>支持标准</th>
		</tr>
	</thead>
	<tfoot>
		<tr>
			<td colspan="3">
				<hr>
				<code>A级－交互和视觉完全符全设计的要求</code><br />
				<code>B级－视觉上允许有所差异，但不破坏页面的整体效果</code><br />
				<code>C级－可忽略设计上的细节，但不防碍使用</code>
				<hr>
				<span class="note">数据来源：<a href="http://tongji.baidu.com/data/browser" title="2013年3季度浏览器份额">2013年3季度浏览器份额</a></span><br />
				<span class="text note"><a href="http://brow.data.cnzz.com/main.php?s=brow&uv=0&type=3">CNZZ</a>数据是按浏览器品牌区分而不是内核版本，如360等浏览器使用的依然是IE或Webkit内核，故采用百度统计数据</span>
			</td>
		</tr>
	</tfoot>
	<tbody>
		<tr>
			<td>IE8.0</td>
			<td>33.46%</td>
			<td>A</td>
		</tr>
		<tr>
			<td>chrome</td>
			<td>25.25%</td>
			<td>A</td>
		</tr>
		<tr>
			<td>IE6.0</td>
			<td>10.92%</td>
			<td>B</td>
		</tr>
		<tr>
			<td>IE9.0</td>
			<td>6.43%</td>
			<td>A</td>
		</tr>
		<tr>
			<td>IE7.0</td>
			<td>2.97%</td>
			<td>B</td>
		</tr>
		<tr>
			<td>IE10.0</td>
			<td>2.54%</td>
			<td>B</td>
		</tr>
		<tr>
			<td>Firefox</td>
			<td>1.54%</td>
			<td>C</td>
		</tr>
		<tr>
			<td>其他</td>
			<td></td>
			<td>C</td>
		</tr>
	</tbody>
</table>
</blockquote>

2.分辨率兼容性：以1024X768分辨率为测试基准。无移动端要求的自适应页面，须通过800X600;1024X768;1280X800;1366X768;1440X900测试

###其他测试与工具
1.浏览器兼容性：<del><a href="../resource/tools/install-ietester-v0.5.2.exe" title="IETester">IETester</a> | <a href="../resource/tools/install-debugbar-v7.2.exe" title="IEDebugger">IEDebugger</a> </del>

2.分辨率兼容性：<del><a href="../resource/tools/分辨率test.rar" title="分辨率test">分辨率test</a></del>

3.[浏览器兼容性检查](http://browsershots.org/)

4.[W3C标准检查](http://validator.w3.org/)

5.页面性能检查：YSlow

6.CSS格式检查（在线） <a href="http://csslint.net/">CSSLint</a> 

7.Javascript格式检查（在线） <a href="http://www.jslint.com/">JSLint</a>

###优化
1.CSS内部、外联样式置于页面顶端head标签内；script引入的js文件置于页面最低端

2.严格限制图片的大小不超过50KB每张，以及图片数量

3.禁用CSS Expressions

4.尽可能合并压缩CSS、JS文件，减少HTTP请求数量。通过外链的形式加载，使其可被浏览器缓存

5.延迟加载组件、内容、图片

6.预加载如CSS sprites等图片

7.优化工具：<del><a href="#" title="前端工具箱">前端工具箱</a></del>

###注释要求
一个项目涉及到多人协作开发，阅读调用公共组件或者他人代码是必不可少的，时间的紧迫性却让程序员没有办法写出详细的说明文档。那么，友善的注释就变得非常重要。**请务必认真对待下面的注释规范，因为我们是一个团队**

####HTML注释
为方便二次开发套程序，HTML各模块使用注释&lt;!--模块XXX-->分割，详细如下：
<pre>
	&lt;!--模块A开始-->
	&lt;div id="modelA">
		模块A代码...
	&lt;/div>
	&lt;!--模块A结束-->
</pre>
####CSS注释
为便于团队协作，CSS文件头部需要详细注释此文件用途，示例如下：
<pre>
/*
* 文件用途说明
* 作者
* 制作日期
*/
</pre>
若此CSS为内含多个模块样式，以注释区分，示例如下
<pre>
/*通用样式*/
.box{}
.detail{}
...

/*头部样式*/
.head{}
.logo{}
...
</pre>
####JS注释
为便于团队协作，js各组件须详细注明该组件用途，调用方法，依赖关系，示例如下：
<pre>
	/*
		Tabs切换 OYDtabs
		@DOM
			&lt;div class="OYDtabs">
				&lt;ul>
					&lt;li>&lt;a hrdf="#tabs1">tabs1&lt;/a>&lt;/li>
					&lt;li>&lt;a hrdf="#tabs2">tabs2&lt;/a>&lt;/li>
					&lt;li>&lt;a hrdf="#tabs3">tabs3&lt;/a>&lt;/li>
				&lt;/ul>
				&lt;div id="tabs1">111&lt;/div>
				&lt;div id="tabs2">222&lt;/div>
				&lt;div id="tabs3">333&lt;/div>
			&lt;/div>
		@CSS
			#OYDsfq li a.OYDtabs-active{background:#7FD2FF;color:#fff}
		@Usage
			$('.OYDtabs').OYDtabs(options);
		@Options
			activeClass		:'OYDsfq-active',	//tabs标题选中样式名
			showDiv			:'',				//显示哪个div，默认为空，显示第一个
			overOrClick		:'click',			//触发事件，可以有click、mouseover、dbclick
			animation		:false,				//是否开启动画效果
			speed			:'normal'			//渐隐渐现速度，'slow','normal','fast'，也可以用数值代替，比如2000表示2000毫秒
	*/
</pre>


















