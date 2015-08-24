---
layout: post
title: 数据结构预算法 javascript描述
description: 数据结构预算法 javascript描述
keywords: 数据结构 javascript 算法
tags: js
---

## 列表

列表是一组有序的数据。每个列表中的数据项称为*元素*

当不需要在一个很长的序列中查找元素，或者进行排序时，列表显得尤为有用。反之，如果数据结构非常复杂，列表的作用就没那么大了。

	function List(){
		// 列表元素的个数
		this.listSize = 0
		// 列表当前的位置（指针）
		this.pos = 0
		// 初始化一个空数组，保存列表元素
		this.dataStore = []
		// 为列表添加元素
		this.append = function(element){
			this.dataStore[this.listSize++] = element
		}
		// 批量添加
		this.appendArray = function(ary){
			if(Array.isArray(ary) || toString.call(ary) == '[object Array]'){
				for(var i = 0, len = ary.length; i < len; i++){
					this.append(ary[i])
				}
				return true
			}
			return false
		}
		// 清空所有元素，重置列表
		this.clear = function(){
			delete this.dataStore
			this.dataStore = []
			this.listSize = this.pos = 0
		}
		// 查找元素，找到返回其在列表中的位置，否则返回-1
		this.find = function(element){
			for(var i = 0; i < this.dataStore.length; i++){
				if(this.dataStore[i] == element) return i
			}
			return -1
		}
		// 移除元素
		this.remove = function(element){
			var foundAt = this.find(element)
			if(foundAt > -1){
				this.dataStore.splice(foundAt, 1)
				--this.listSize
				return true
			}
			return false
		}
		// 在某元素后面插入元素
		this.insert = function(element, after){
			var insertPos = this.find(after)
			if(insertPos > -1){
				this.dataStore.splice(insertPos + 1, 0, element)
				++this.listSize
				return true
			}
			return false
		}
		this.contains = function(element){
			for(var i = 0, len = this.dataStore.length; i < len; i++){
				if(this.dataStore[i] == element){
					return true
				}
			}
			return false
		}
		// 获取列表中有多少元素
		this.length = function(){
			return this.listSize
		}
		// 显示列表中的元素
		this.toString = function(){
			return this.dataStore.toString()
		}
		// 指针遍历列表
		this.front = function(){
			this.pos = 0
		}
		this.end = function(){
			this.pos = this.listSize - 1
		}
		this.prev = function(){
			if(this.pos > 0){
				--this.pos
			}
		}
		this.next = function(){
			if(this.pos < this.listSize -1){
				++this.pos
			}
		}
		this.curPos = function(){
			return this.pos
		}
		this.moveTo = function(position){
			this.pos = position
		}
		this.getElement = function(){
			return this.dataStore[this.pos]
		}
	}
	
###实例——迪亚波罗的背包
目标：实现RPG游戏的背包，能够实现简单拾取、存储、取出
