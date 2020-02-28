---
layout: post
title: Javascript模式 笔记（二） —— 对象与函数的编码模式
description: 对原书第3、4、5、6核心章节提炼，主要讲述使用Js如何优雅的创建函数与对象
keywords: js 
tags: 前端 js 笔记
---

##字面量和构造函数

在Javascript中可以使用字面量(Literal notation)模式，这种方法更为准确，也更富有表现力，并且在对象定义中更不容易出错。为此，我们应避免使用构造函数，更建议使用字面量的方法。

###对象字面量

关键词：键\-值对（key-value pari）哈希表；属性(property)；方法(method)

空对象添加法示例

      // 开始时定义一个空对象
      var dog = {};
      
      // 添加属性方法
      dog.name = "foo dog";
      dog.getName = function(){
         return dog.name;
      }

      // 完全删除属性/方法
      delete dog.name;

创建对象初始化法示例

      var dog = {
         name: "foo dog",
         getName: function(){
            return this.name  
         }
      };

      // 反模式，使用内置构造函数
      var dog = new Object();
      dog.name = "bad dog";

与构造函数相比，使用字面量表示法的优点除了字符更少，另一个原因是他强调了该对象仅是一个可变哈希映射，而不是从对象中提取的属性或者方法。此外，字面量法被创造时并没有作用于解析。使用构造函数创造某同名局部变量时，解释器需要从调用Object()的位置开始一直向上查询作用域链，直到发现全局object构造函数。

构造函数的一个“特性”是object构造函数仅接受一个参数，并且还依赖传递的值，该Object()可能委派另一个内置构造函数来创建对象，并返回了一个并非期望的不同对象。

      // 反模式
      var o = new Object();
      console.log(o.constrctor === Object); // true
      
      var o = new Object(1);
      console.log(o.constrctor === Number); // true
      console.log(o.toFixed(2)) // "1.00"
      
      var o = new Object("n");
      console.log(o.constrctor === String); // true
      // 一般对象没有此方法，但字符串对象都有
      console.log(typeof o.substring) // "function"
      
      var o = new Object(true);
      console.log(o.constrctor === Boolean); // true

当传递给Object()构造函数的值是动态的，并且直到运行时才能确定其类型时，Object()构造函数的这种行为可能会导致意想不到的后果。因此，总的还说，不要new构造函数，相反应该使用更为简单、可靠的对象字面量模式。

###自定义构造函数
除内置构造函数和对象字面量模式外，还可以使用自己的构造函数来创建对象

      var Person = function(name){
         // 使用对象字面量模式创建一个新对象
         //var this = {}
         //var this = Object.create(Person.prototype)
         this.name = name;
         this.say = function(){
            return "我是" + this.name;
         }

         // return this
      }

      var lich = new Person("dragoon")
      lich.say() //"我是dragoon"

当以new操作符调用构造函数时，函数内部会发生以下情况（上方源码注释部分为模拟）：

   * 创建一个空对象，并且this变量引用了该对象，同时还继承了该函数的原型。
   * 属性和方法加入到this引用的对象中。
   * 新建的对象由this所引用，并且最后隐式的返回this
   
  上述事例中将构造函数的say()方法添加到this中，造成的结果是任何时候调用new Person()时都会在内存中创建一个新的函数，这种方法的效率十分低下。正确的做法应该是将方法添加到Person类的原型中。

####构造函数返回值

new操作符创建对象时，构造函数总返回一个对象，默认情况隐式返回this做引用的对象。如果在构造函数中并不向this添加任何属性，将返回“空”对象。

注意，构造函数中可以自由返回任意对象，只要他是一个对象。视图返回并非对象的值，并不会造成错误，但函数会简单的忽略该值，并返回this所引用的对象

###强制使用new的模式

忘记使用new操作符，构造函数中的this指向全局对象

* es5严格模式中this不会指向全局
* 命名约定，构造函数首字母大写
* 使用that替代this返回，可以避免忘记new造成的错误。缺陷是会丢失原型链
* 自调用构造函数可解决前面的缺点：检查this是否为构造函数的一个实例，如果为否，构造函数再次调用并正确的使用new操作符。
		
		function Waffle(){
			if(!(this instanceof Waffle)){
				return new Waffle()
			}
		}

###数组字面量

	// 反模式
	var a = new Array("first", "second", "third")
	// 数组字面量
	var a = ["first", "second", "third"]
	
	console.log(typeof a)		// object
	console.log(a.constructor === Array)	// true

**为什么要避免new Array()方式创造数组？**
当向Array()传递单个数组时，它并不会成为第一个数组元素的值。相反，它却设定了数组的长度。如果传第一个浮点数，入new Array(3.14)，则会报错

**什么时候用Array构造函数创建数组？**
创建重复字符串：比如下面的代码片段返回了一个255空白字符的字符串

	var white = new Array(256).join(" ")

**如何检测数组？**
* 通过检测数组特性，如length属性或slice()等数组方法，但并不健壮
* instanceof Array检查，可能在IE中运行不正确
* ES5新方法Array.isArray()
* 下述代码片段可增强ES5方法的兼容性

	if(typeof Array.isArray === "undefined"){
		Array.isArray = function(arg){
			return Object.prototype.toString.call(org) === "[object Array]"
		}
	}

###JSON

代表了JavaScript对象表示以及数据传输格式。和对象唯一的语法差异在于，JSON中属性名称需要包装在引号中才能成为合法的JSON。

使用ES5中的JSON.parse()方法解析字符串，对于早期浏览器，使用JSON.org库。

反之JSON.stringify()可以序列化对象或者数组为JSON字符串

###正则表达式字面量

正则表达式也是对象，可以使用两种方法创建正则表达式

* 使用 new RegExp() 构造函数
* 使用正则表达式字面量
* g全局匹配；m多行；i大小写敏感
* 调用RegExp()使用new与不使用的行为是相同的

###基本值类型包装器
Number();String();Boolean()

###错误对象
内置错误构造函数，如Error();SyntaxError();typeError()

通常具有下列属性：
* name: 用于创建对象的构造函数的名称属性
* message：当创建对象时传递给构造函数的字符串

	try{
		throw{
			name: "MyErrorType",
			message: "oops",
			remedy: method
		} catch(e) {
			alert(e.message)
			e.remedy()
		}
	}

##函数

###基础
* 函数是第一类对象(first-class object)
* 提供作用域——javascript仅存在函数作用域

声明式与表达式：

* 函数表达式：
	* 命名表达式or匿名函数
	* 表达式赋值，须有分号结尾
	* 使用命名表达式并将其分配给一个不同名称的变量，在技术上是可行的，例如`var foo = function bar(){}`但在一些IE浏览器中，并没有被正确实现，所以不推荐这种模式。
* 函数声明
	* 不须分号结尾
	* 仅能出现在其他函数体内部，不能分配给变量或属性，也不能以参数形式出现在函数调用中
	* 变量声明提升


###回调模式

###返回函数

###自定义函数

###即时函数

###即时函数初始化

###初始化分支

###函数属性——备忘模式

###配置对象

###Curry

##对象创建模式

###命名空间模式

###声明依赖关系

###私有属性和方法

###模块模式

###沙箱模式

###静态成员

###对象常量

###链模式

###method()方法





















