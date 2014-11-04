---
layout: post
title: Javascript模式 笔记（一） —— 概述及基础
description: 模式是针对普遍问题的解决方案。更进一步说，模式是解决一类特定问题的模板。本文主要介绍Js的一些基础、编码规范和技巧。温故知新，为后续学习打下良好基础。
keywords: js 
tags: 前端 js 笔记
---
   
##概述
本书主要涉及三种模式

   1. 设计模式
   2. 编码模式
   3. 反模式

##基本概念

   1. 面向对象：

      对象仅仅是一个容器，该容器包含了命名的属性、键-值对的列表。这里面的属性可以是函数（函数对象），这种情况下我们称其为方法。

   2. 没有类：

      即构造函数，不称呼“类”，会引起误解；尽量多的使用对象组合，而不是使用类的继承

   3. 原型（prototypes）：

      原型是一个对象，并且创建的每一个都会自动获取一个Prototypes属性，该属性指向一个空对象。该对象几乎等同于采用对象字面量或Object()创建的对象，区别在于它的constructor属性指向了所创建的函数，而不是指向内置的Object()函数。每一个函数都有Prototype属性

   4. ECMAscript5 ：

      使用use strict严格模式

##基本技巧

   1. **编写可维护的代码**

      * 阅读性良好
      * 具有一致性
      * 预见性
      * 看起来如同一个人编写
      * 有文档

   2. **尽量少使用全局变量**

      注意避免隐式创建：var a=b=0 //反模式
      应使用var a,b; a=b=0;

   3. **变量释放时的副作用**

      使用delete撤销变量时，var创建的全局变量无法被删除，隐式创建的可以删除
      表明隐含全局变量严格来讲不是真正的变量，而是全局对象属性。属性可以通过delete操作符删除，但变量不可以

            var global_var = 1;
            global_novar = 2; //反模式
            (function(){
               global_fromfunc = 3 //反模式
            })();

            delete global_val; //false
            delete global_novar; //true
            delete global_fromfunc; //true

            typeof global_var; //number
            typeof global_novar; //undefined
            typeof global_fromfunc; //undefined

   4. 访问全局变量

   5. **单一var模式**

   6. **变量提升**

      函数任意地方声明多个变量，效果都等同于函数顶部声明。同一作用域下，先使用，再声明，亦可。

      >代码处理上分两个阶段，第一，这个阶段创建变量、函数声明及形参。这是解析和进入上、下文的阶段。第二个阶段是代码运行时执行过程，创建函数表达和不合格标识符（未定义变量）。但为了实际使用的目的，我们采纳了“提升”的概念，这个概念并没有在ECMAScript标准中定义，但却经常用来表述这种情形。

   7. for循环

      * 遍历HTML容器对象(HTMLColltion)时，非常耗时，缓存长度可以极大优化。
      * i-\-递减遍历，因为同0比较比同数组长度比较速度更快。

   8. for\-in循环

      * 也被成为枚举，用来遍历非数组对象。*不推荐遍历数组*，因为当该数组对象被自定义函数扩大后，可能导致逻辑上的错误。
      * 使用hasOwnProperty()过滤原型方法

            var man = {
               age: 25,
               handsome: true,
               heads: 1
            };

            // 将一个方法添加到所有对象，那么枚举对象时，就可以过滤掉此方法，有效避免命名冲突。
            if(typeOf Object.prototype.clone = "undefined"){
               Object.prototype.clone = function(){};
            }

            for(var i in man){
               if(man.hasOwnpropotype(i)){
                  console.log(i, ":" , man[i])
               }
            }

   9. 不要增加内置的原型（为Object(),Array(),Function()等）

      严重影响到可维护性，所以除以下例外，不要添加。

      * 基于未来，提前定义如ECMAScript6的方法。
      * 为兼容性而添加的
      * 详细文档记录下来的

      如遇到以上情况，可采用如下模式为原型添加自定义的方法：

            if(typeof Object.prototype.myMethod !== 'function'){
               Object.prototype.myMethod = function(){}
            }

   0. Switch模式

      * 每个case 和 switch 纵向排列对齐
      * 每个case语句中使用代码缩进
      * 每个case语句结尾有一个明确的break语句
      * 使用default作为结束，给出默认结果

      示例

            var inspect_me = 0,
                result = '';

            switch(inspect_me){
            case 0:
               result = "zero";
               break;
            case 1:
               result = "one";
               break;
            default:
               result = "unknown";
            }

   1. 避免使用隐式类型转换

   2. 避免是使用eval()

   3. 使用ParseInt()

      ECMAScript3 0开始的字符串会被当成8进制，ECMAScript5 则不会。为避免不一致性和未预期的结果，每次都制定进制参数。

   4. 编码约定

   5. 命名约定

      * 构造函数首字母大写+驼峰
      * 全部大写变量约定程序声明周期中不可改变
      * 下划线结尾，表明私有变量
      * 使用一个下划线前缀表示受保护属性，使用两个下划线表示私有属性

   6. 编写注释

      通常有必要对所有的函数、函数参数、返回值和其他有趣或不同寻常的算法和技术都用文档记录下来。设想注释就是未来代码读者的一个提示，只需阅读注释就能明白代码中有哪些函数和函数名。

      >最重要的习惯，也是最难遵循的习惯就是不断更新注释，因为过期注释可能会误导阅读者，这比没有注释还要可怕。

   7. 编写API文档

      自动生成API文档的工具：JSDoc Toolkit 和 YUIDoc。
      步骤如下：
      编写特殊格式的代码块 ==》运行工具解析代码和注释 ==》 发布工具解析的结果，大多以HTML发布。

      使用特殊标签：

            /**
             * @tag value
             */

      举例：

            /**
             * 翻转一个字符串
             * 
             * @param   {String} 输入需要翻转的字符串
             * @return  {String} 翻转后的字符串
             *
             */

      通常：
      @namespace;@class;@method;@param;@return;@constructor;@propety;@type

   8. 编写可读性强的代码

   9. 同行互查

   0. 正式发布时精简代码

   1. 运行JSLint





            


















