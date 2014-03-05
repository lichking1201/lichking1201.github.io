/*
 * metroSplit v1.1 
 * Date: 2014-3-5
 * https://github.com/lichking1201/metroSplit
 * (c) 2013-2014 lichking, http://lichking1201.github.io
 *
 * This is licensed under the GNU LGPL, version 2.1 or later.
 * For details, see: http://www.gnu.org/licenses/lgpl-2.1.html
 *
 */

 /*
 @DOM
	<div class="selector">
		<div class="metroSplit-main">
			... main-menu's code...
		</div>
		<div class="metroSplit-sub">
			<ul>
				<li><a>...submenu's code...</a></li>
				<li><a>...submenu's code...</a></li>
				<li><a>...submenu's code...</a></li>
			</ul>
		</div>
	</div>
	
 @Usage
	$(".selector").metroSplit(options)
 */
 
$.fn.metroSplit = function(options){
	
	var opt = $.extend({},
		{
			dx : 2,  		//������Ƭ���Ҽ��
			dy : 2,			//������Ƭ���¼��
			rank : 3,		//������ƬΪrank��
			event : "hover" //�����¼���֧��"hover"��"click" 
		},options)
	
	var WARP_BLK = '<div style="position:fixed;left:0;top:0;bottom:0;right:0;z-index:999;"></div>';
	
	//IE �ж�
	var _IE = (function(){
		var v = 3, div = document.createElement('div'), all = div.getElementsByTagName('i');
		while (
			div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->',
			all[0]
		);
		return v > 4 ? v : false ;
	}());
	
	//ȷ����Ƭ�����λ����������Ϊ��Ƭ�ڵ�li��jQuery����li��length����Ҫ���ѵ�����rank
	var _sectionWidth = function(ele,n,rank,w)
	{
		var w = w || {}
		var section = ele;
		var spans = Math.ceil(n/rank);  	//ÿ����Ƭ������n�����޷�����rank�����һ���޷����������һ������Դ�����������䡣
		var lastSpans = n-spans*(rank-1);	//���һ����Ƭ����
		
		//��Ƭ����С��Ҫ���ѵ�������������Ƭ�޷�����metroʱ������rankֱ�����䣻
		if(n%rank != 0 && lastSpans <= 0 || n<rank){
			rank -= 1;
			return _sectionWidth(section,n,rank)
		}
		
		var num = section.index();
		var dx = opt.dx/2,dy = opt.dy/2; //ÿ����Ƭλ������ֵ��һ�룬�ԳƷ���
		
		section.data({top:dy,right:dx,bottom:dy,left:dx}) //��ʼ��λ����
		
		if(num%spans == 0) section.data({left:0})	//�����һ������Ƭ���Ѿ����ߣ�����Ҫ��������ƶ�
		if(num%spans == spans-1 || num == n-1) section.data({right:0})	//�����һ������Ƭ
		if(num <= spans-1) section.data({top:0})	//��ͷ��һ����Ƭ
		if(num >= n - lastSpans) section.data({bottom:0})	//ĩβ���һ����Ƭ
		
		spans = (num < n - lastSpans) ? spans : lastSpans;	//ȷ����ǰ��Ƭ�����й��ж�����Ƭ
		section.width(100/spans + "%").height(Math.ceil(100/rank) + "%").css("line-height",section.height() + "px");	//����spans��rank������Ƭ��ߡ��иߡ���ĳЩ������ж�С�������Ⱦ���Ƚϲ���Ը߶Ȱٷֱ�����ȡ����metro����overflow:hidden ���ض���Ĳ�ֵ��
		if(_IE == 7 && num%spans == 0 && spans != 1){
			section.width(w - section.width()*(spans-1) + "px"); //IE7�԰ٷֱȿ�ȼ��������������¼����ȼ�ȥ��ֵȷ�������metro��
		}
	}
	
	/* �����淽��������ͬ���Բ��������ʽ��д����
	$.fn._sectionWidth = function(n,rank)
	{
		return this.each(function()
		{
			var section = $(this);
			var spans = Math.ceil(n/rank);  
			var lastSpans = n-spans*(rank-1);
			if(n%rank != 0 && lastSpans <= 0 || n<rank){
				rank -= 1;
				return section._sectionWidth(n,rank)
			}
			
			var num = section.index();
			var dx = opt.dx/2,dy = opt.dy/2;
			
			section.data({top:dy,right:dx,bottom:dy,left:dx})
			
			if(num%spans == 0) section.data({left:0})
			if(num%spans == spans-1 || num == n-1) section.data({right:0})
			if(num <= spans-1) section.data({top:0})
			if(num >= n - lastSpans) section.data({bottom:0})
			
			spans = (num < n - lastSpans) ? spans : lastSpans;
			section.width(100/spans + "%").height(100/rank + "%").css("line-height",section.height() + "px");
			if(_IE == 7){
				section.width(section.width() - 1 + "px");
			}	
		})
	}
	*/
	
	return this.each(function()
	{
		var metro = $(this);
		var mainMenu = metro.find(".metroSplit-main"),
			subMenu = metro.find(".metroSplit-sub");
		var lis = subMenu.find("li"),
			len = lis.length;
		var W = metro.width() //����HACKie7
		lis.each(function(){_sectionWidth($(this),len,opt.rank,W)})//��ʼ��ÿ�������Ӳ˵���Ƭ�Ŀ��ߡ�λ����
		//lis._sectionWidth(len,opt.rank)
		if(opt.event == "hover") metro.hover(_star,_stop)
		if(opt.event == "click") metro.on("click",function()
		{
			_star();
			$(WARP_BLK).appendTo($("body")).on("click",function()
			{
				$(this).remove();
				_stop();
			})
		})
		
		function _star()
		{
			mainMenu.hide();
			metro.css({zIndex:99999});
			subMenu
				.css("zIndex","99")
				.find("a").each(function()
				{
					var section = $(this).parent();
					var diffTop = "+=" + section.data("top"),
						diffRight = "+=" + section.data("right"),
						diffBottom = "+=" + section.data("bottom"),
						diffLeft = "+=" + section.data("left");
					$(this).animate({top:diffTop,right:diffRight,bottom:diffBottom,left:diffLeft},"fast")
				})
		}
		
		function _stop()
		{
			metro.css({zIndex:1});
			subMenu
				.find("a").each(function()
				{
					var section = $(this).parent();
					var diffTop = "-=" + section.data("top"),
					diffRight = "-=" + section.data("right"),
					diffBottom = "-=" + section.data("bottom"),
					diffLeft = "-=" + section.data("left");
					$(this).animate({top:diffTop,right:diffRight,bottom:diffBottom,left:diffLeft},"fast")
				})
				.end()
				.css("zIndex","1")
				.delay(200)
				.queue(function(){mainMenu.stop(true,true).fadeIn();$(this).dequeue();})
		}
	})
}