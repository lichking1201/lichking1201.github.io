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





















