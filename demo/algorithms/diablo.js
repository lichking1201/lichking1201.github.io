load("algorithm.js")
load("model.js")

function liveCheck(){
	if(!hero) return
}

function restart(){

}

// 命令工具

function go(){
	if(STATUS.BATTLE){
		print("正在战斗，无法脱离！")
		return false
	}
	map.next()
	var step = map.getElement()
	switch(step){
		case 0:
			print("什么也没有发生，风景不错")
			break;
		case 1:
			print("一个小恶魔张牙舞爪的向你扑来")
			monster = new Monster("小恶魔", 30, 8, ITEMS.EQUIP.SWORD)
			battleWith(monster)
			break;
	}
}

function showBag(){
	print(hero.name + "打开了背包，里面有：")
	var bag = hero.bag
	for(bag.front(); bag.curPos() < bag.length(); bag.next()){
		var item = bag.getElement()
		print(bag.curPos() + " " + item.name + ": " + item.description + ". $" + item.cost)
	}
	print("Tips: useProps(num)可以使用道具")
}

function useProps(n){
	var bag = hero.bag
	if(n > bag.length() || n < 0 || isNaN(n)) return print("背包中并无此物品")
	var item = bag.dataStore[n]
	if(item.type == "prop"){
		bag.remove(item)
		print(hero.name + "使用了" + item.name + "；" + item.description)
	}else if(item.type = "equip"){
		print(hero.name + "装备了" + item.name + "；" + item.description)
	}

	item.effect()

}

function status(){
	print("英雄" + hero.name + ":")
	print("生命：" + hero.status.life)
	print("魔力：" + hero.status.mana)
	print("力量：" + hero.status.strength)
	print("敏捷：" + hero.status.dexterity)
	print("体力：" + hero.status.vitality)
	print("智力：" + hero.status.energy)
	print("伤害：" + hero.status.atk)
}

function help(){
	print("go()来探索世界")
	print("showBag()显示背包")
	print("useProps()使用道具")
	print("status()显示英雄状态")
}

var MAP = [0,0,1,0,1,1,0,0,0]
var map = new List()
map.appendArray(MAP)

print("资源加载完毕...")
print("您已进入迪亚波罗的世界！")

print("欢迎您" + hero.name + "，欢迎来到罗格营地！在开始冒险前，使用help()命令，将会得到神的知识")

