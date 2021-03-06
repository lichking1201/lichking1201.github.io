---
layout: post
title: 我的「大数据」挖掘
description: 信息巨量化+碎片化的时代，对于我这种信息强迫症患者来说，将大量时间用于阅读繁杂琐碎，不利思考记忆的「信息」碎片，而不是用在系统结构化的「知识」深入上，那就是个彻头彻尾的灾难。如果能从这该死的信息流里抽身出来，将宝贵时间投入到更美好的生(mei)活(zi)中去。想来用不了多久我就可以当上技术经理，出任CTO，迎娶白富美，走上人生巅峰，想想还真有点小激动呢~嘿嘿
keywords: 大数据,中文分词
tags: 折腾
---
*感谢RSS的作者[Aaron Swartz](http://www.ifanr.com/234104)，愿你在某个地方安息。*

作为一个重度信息强迫症患者来说，大量订阅RSS那是必然的。但人生如此短暂，一天只有可怜的24小时，刨掉工作、睡觉、吃饭、看(da)电(hui)影(ji)等等等等时间，余下的时间还不够刷知乎的。于是RSS那巨大的未读数字就犹如滔滔江水排山倒海连绵不绝看得我心惊胆颤不忍直视却又耐不住空虚焦虑和来自灵魂深处剧烈的强迫感不得已逐一翻开阅后标记已读这一切就蛋疼的好比看了一大段语句不通滥用成语还没有标点符号的小学生文字一般。

![鲜果客户端示例](/resouse/img/2014-2-25-0.png)
一天几百的信息流，一周没开客户端，这辈子就都不想点开了。。。

真的是忍无可忍了啊，必须要找个办法缓解这个症状了啊，要不一直这样下去完全没办法当上技术经理，出任CTO，迎娶白富美，走上人生巅峰了啊。现在大数据分析这么流行，干脆我就通过分析只找出最热信息关注，这样放弃掉其他的也就比较心安理得了吧！虽然方法简单粗暴，自动化低，但都病入膏肓了就先用着吧

初步设想的解决方案很简单：前端截取信息标题字符串（元数据）==》提交给分词分析系统处理==》根据算法筛选最高权重词频的词汇==》根据筛选结果汇总文章链接，推送==》End
<!--more-->
###通过鲜果RSS客户端截取标题字符串
<pre>
var inv;
var t = false;
var txt = "";
var ary = [];

function tra(){
	var len = jQuery('#itemList_footer_filp').children("a").length;
	if(jQuery('#itemList_footer_filp').children("a").eq(len-1).text() == "下一页"){
		t = false;
		jQuery('#itemList_footer_filp').children("a").eq(len-1).click();
	}else{t = true}
	
	jQuery(".item_title_mode").each(function(){txt += jQuery(this).find(".title").text() + "|";});
	ary = txt.replace(/^\|+|\|+$/g, "").split("|")
}
inv = window.setInterval("if(!t){tra()}else{console.log(txt);window.clearInterval(inv)}",2000);
</pre>

方法很笨，实现起来也非常龟速，就是利用鲜果客户端采集源，然后对源列表不停发送请求迭代截取的字符串，直到没有"下一页"为止。

###中文分词与词频分词
第二步是将结果提交给中文分析系统，当前方法是把获取的字符串手动复制粘贴到这个[开源的在线分析系统](http://www.xunsearch.com/scws/demo/v48.php)中，然后第三部分词和筛选就完全交给它了。这两个步骤以后将开源系统研究透了再说自动化吧！

到这里我们粗略的热点信息大概就都出来了，比如下图，分析的是2014-2-23到2014-2-25间，一千条来自新浪、网易、搜狐、凤凰的焦点新闻标题，最终词频结果——

![新闻时事词频](/resouse/img/2014-2-25-1.jpg)

排除掉「国内」「体育」「科技」「财经」等新浪用来标示频道的干扰信息，可以看出：我们的几个门户网站编辑们对国际新闻更关注，动荡的乌克兰和奇葩的朝鲜是当前关注的热点，扫黄打非虽然脱离了风口浪尖但依然坚挺（东莞请挺住）。而类似「中央」「官员」「反腐」「改革」这些是一贯政治热词，也可能是为两会预热。

看完了时事新闻，再来关心下IT弄潮，这次的源信息主要来自36Kr，爱范儿，虎嗅，Engadget中文等等主流IT媒体，可以看出google、腾讯、三星、苹果是这些媒体舆论的宠儿。移动、智能、手机和视频是谈论最多的话题，Facebook因为收购whatsApp，两者词频接近一目了然。诺基亚显然处于低谷，小米倒是很意外被提到的次数还不如诺基亚，有些意外，可能最近小米比较低调的原因吧。图中被涂红的「大众」可不是那个das auto，而是「大众点评」因为分词的缘故被分开了。看来这几个媒体对腾讯还真是重视，没少写腾讯收购大众点评股份的文章。

![IT媒体词频](/resouse/img/2014-2-25-2.jpg)

这么一分析，痛快多了啊，不考虑时效性，作用比上百篇文章一点一点翻找重点还是强多了。今天先分析这么多吧，样本还是太少，大数据分析肯定是很有意思的，以后有时间一定要多研究，对于信息强迫症，坚决不弃疗。


PS：抓取[今日头条](http://www.toutiao.com/news_hot/)的热点新闻效果应该也挺好，可惜不能被鲜果收录订阅，要再研究研究了。







