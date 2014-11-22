$(function(){
	// 【问题】模型，包括问题的答案类型（单选、复选、文本），题干
	var Question = Backbone.Model.extend({

		defaults: function(){
			return {
				title: "请输入问题...",
				type: "radio",
				opts: [],
				id: questions.nextId(),
				belong: "q"
			}
		}
	})

	// 【问题】列表集合
	var QuestionList = Backbone.Collection.extend({

		model: Question,
		localStorage: new Backbone.LocalStorage("research-backbone"),
		nextId: function(){
			if(!this.length) return 1
			return this.last().get("id") + 1
		}
	})

	var questions = new QuestionList

	// 子项视图
	var QuesItemView = Backbone.View.extend({

		tagName: "li",
		template: _.template($("#item-template").html()),
		events: {
			"click .view" : "edit",
			"click .viewOpt" : "editOpt",
			"click a.destroy": "clear",
			"keypress .edit": "updateOnEnter",
			"blur .edit": "close",
			"blur .editOpt": "closeOpt"
		},
		initialize: function() {
			this.listenTo(this.model,'change',this.render)
			this.listenTo(this.model,'destroy',this.remove)
		},
		render: function() {
			this.$el.html(this.template(this.model.toJSON()))
			this.Tit = this.$(".edit")
			this.Opt = this.$(".editOpt")
			return this
		},
		edit: function(){
			this.$el.addClass("editing")
			this.Tit.focus()
		},
		editOpt: function(){
			if(this.$('input').eq(0).attr("type") == "text") return
			this.$el.addClass("editing")
			this.Opt.focus()
		},
		close: function(){
			var value = this.Tit.val()
			if(!value){
				this.clear()
			}else{
				this.model.save({title: value})
				this.$el.removeClass("editing")
			}
		},
		closeOpt: function(){
			var value = this.Opt.val()
			if(!value){
				alert("请键入选项") // TODO: 增加type修改
			}else{
				this.model.save({opts: value.split('\n')})
				this.$el.removeClass("editing")
			}
		},
		updateOnEnter: function(e){
			if(e.keyCode == 13) this.close()
		},
		clear: function(){
			this.model.destroy()
		}
	})

	var QuestionView = Backbone.View.extend({

		el: $("#questionPage"),
		events: {
			"focus #newQuestion": "choseType",
			"click #addOpt" : "creatOpt",
			"click #addQuestion": "creatQues",
			"click #resetQuestion": "resetQues",
			"click #clearQuestion": "clearQues"
		},
		// 初始化，拉取所有问题
		initialize: function(){
			this.type = "radio"
			this.main = $("#main")

			this.listenTo(questions, 'add', this.addQues)
			this.listenTo(questions, 'all', this.render)
			
			questions.fetch()
		},
		render: function(){
			if(questions.length){
				this.main.show()
			}else{
				this.main.hide()
			}
		},
		// 页面渲染新问题
		addQues: function(ques){
			$("#QuestionType").hide()
			var view = new QuesItemView({model: ques, item: "ques"})
			this.$("#questionList").append(view.render().el)
		},
		// 集合中创建问题
		creatQues: function(){
			
			var ques = this.$("#newQuestion").val()
			if(!ques){
				alert("请输入问题")
				return
			}
			var opts = $("#opts").val()
			opts = opts.split('\n')
			if(this.type != "text" && !opts){
				alert("请输入问题选项，以回车间隔")
				return
			}

			questions.create({title: ques,type: this.type, opts: opts})
			
			this.resetQues()
		},
		// 选择问题类型
		choseType: function(){
			var q = this
			$("#newQuestion").addClass("on")
			$("#questionType").show()

			$("#choseType").on("click",function(e){
				$(e.target).addClass("on").siblings().removeClass("on")
				q.type = $(e.target).data("type")
				if(q.type == "text"){
					$("#optsArea").hide()
				}else{
					$("#optsArea").show()
				}
			})
		},
		// 重置页面，清除焦点，隐藏表单
		resetQues: function(){
			$("#newQuestion").removeClass("on").val("")
			$("#opts").val("")
			$("#questionType").hide()
		},
		// 清除所有问题
		clearQues: function(){
			var cfm = confirm("确定要清除所有问题吗？")
			var model
			if(cfm){
				while(model = questions.first()){
					model.destroy()
				}
			}
		}
	})

	var questionView = new QuestionView

	var APPRouter = Backbone.Router.extend({

		rotus:{
			"begin": "begin",
			"admin": "admin",
			"viewer": "viewer"
		},
		begin: function(){

		},
		admin: function(){

		},
		viewer: function(){

		}

	})

})




