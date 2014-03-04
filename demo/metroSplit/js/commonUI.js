(function ($) {
	//========================
	//����ͼ�л�
	//========================
	$.focus = function (slid) {
		var sWidth = $(slid).width(); //��ȡ����ͼ�Ŀ�ȣ���ʾ�����
		var sHeight = sWidth*0.35;
		var len = $(slid).find("ul li").length; //��ȡ����ͼ����
		var index = 0;
		var picTimer;
		$(slid).find("li").width(sWidth).height(sHeight);
		$(slid).height(sHeight);
		//���´���������ְ�ť�Ͱ�ť��İ�͸������������һҳ����һҳ������ť
		var btn = "<div class='btnBg'><p class='focusTitle'></p></div><div class='btn'>";
		for (var i = 0; i < len; i++) {
			btn += "<span></span>";
		}
		btn += "</div>";
		$(slid).append(btn);

		//ΪС��ť�����껬���¼�������ʾ��Ӧ������
		$(slid + " div.btn span").mouseenter(function () {
			index = $(slid + " .btn span").index(this);
			showPics(index);
		}).eq(0).trigger("mouseenter");

		//����Ϊ���ҹ�����������liԪ�ض�����ͬһ�����󸡶�������������Ҫ�������ΧulԪ�صĿ��
		$(slid + " ul").css("width", sWidth * (len));

		//��껬�Ͻ���ͼʱֹͣ�Զ����ţ�����ʱ��ʼ�Զ�����
		$(slid).hover(function () {
			clearInterval(picTimer);
		}, function () {
			picTimer = setInterval(function () {
					showPics(index);
					index++;
					if (index == len) {
						index = 0;
					}
				}, 3000); //��4000�����Զ����ŵļ������λ������
		}).trigger("mouseleave");

		//��ʾͼƬ���������ݽ��յ�indexֵ��ʾ��Ӧ������
		function showPics(index) { //��ͨ�л�
			var nowLeft = -index * sWidth; //����indexֵ����ulԪ�ص�leftֵ
			var t = $(slid + " li").eq(index).find("img").attr("alt");
			var l = parseInt($(slid + " ul").css("left"));
			var tt = $(".focusTitle");
			tt.text(t);
			if (l != nowLeft) {
				tt.hide().fadeIn(300);
				$(slid + " ul").stop(true,true).animate({
					"left" : nowLeft
				}, 300)
			} //ͨ��animate()����ulԪ�ع������������position
			$(slid + " .btn span").removeClass("on").eq(index).addClass("on"); //Ϊ��ǰ�İ�ť�л���ѡ�е�Ч��
			$(slid + " .btn span").animate({
				"opacity" : "1"
			}, 300); //Ϊ��ǰ�İ�ť�л���ѡ�е�Ч��
		}
	};
})(jQuery);
