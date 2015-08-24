function Hero(name){
    this.name = name
    this.bag = new List()
    this.bag.appendArray([ITEMS.MEDICAMENT.LIFE, ITEMS.MEDICAMENT.ENERGY])
    this.status = {
    	alive: true,
    	maxLife: 100,
    	maxMana: 100,
    	life: 100,
    	mana: 100,
    	strength: 5,		// 力量
    	dexterity: 5,		// 敏捷
    	vitality: 5,		// 体力
    	energy: 5,			// 智力
    	atk: 5
    },
    this.statusChange = function(status, val){
    	this.status[status] += val
    	this.maxLimit()
    }
    this.maxLimit = function(){
    	var status = this.status
    	if(status.life > status.maxLife) status.life = status.maxLife
    	if(status.life <= 0) this.die()
    	if(status.mana > status.maxMana) status.mana = status.maxMana
    }
	this.die = function(){
		this.status.life = 0
		this.status.alive = false
	}
}

function Monster(name, life, atk, award){
	this.name = name
	this.status = {
		alive: true,
		maxLife: life,
		life: life,
		atk: atk
	}
	this.award = award
	this.statusChange = function(status, val){
    	this.status[status] += val
    	this.maxLimit()
    }
    this.maxLimit = function(){
    	var status = this.status
    	if(status.life > status.maxLife) status.life = status.maxLife
    	if(status.life <= 0) this.die()
    	if(status.mana > status.maxMana) status.mana = status.maxMana
    }
	this.die = function(){
		this.status.life = 0
		this.status.alive = false
	}
}

function battleWith(monster){
	print("开始战斗！")
	var heroAtk = hero.status.atk
	var monsterAtk = monster.status.atk

	do{
		putstr("按0: 普通攻击||1: 查看背包：")
		var action = readline()
		switch(+action){
			case 0:
				hero.statusChange("life", -monsterAtk)
				monster.statusChange("life", -heroAtk)

				print(hero.name + "攻击" + monster.name + "造成了" + heroAtk + "点伤害；" + monster.name + "攻击" + hero.name + "造成了" + monsterAtk + "点伤害；" )
				print(hero.name + "剩余" + hero.status.life + "生命； " + monster.name + "剩余" + monster.status.life + "生命")
				break;
			case 1:
				showBag()
				break;
			default:
				if(/useProps/.test(action)){
					try{
						eval(action)
					}catch(err){
						print("无效指令")
					}
				}else{
					print("无效指令")
				}
		}
	}
	while(hero.status.alive && monster.status.alive)
	if(hero.status.alive){
		print("你杀死了" + monster.name + "!")

		if(monster.award){
			hero.bag.append(monster.award)
			print("夺走了它的" + monster.award.name)
		}
	}else{
		print("你被" + monster.name + "杀死了!")
		print("GAME OVER !!!")
		quit()
	}
}

function Equipment(name, description, type, cost, fun){
    this.name = name
    this.description = description
    this.cost = cost
    this.effect = fun
    this.type = type
}

// 事件脚本
var EVENT = {
	MOVE_FORWARD: {
		str: "向前走"
	}
}

var STATUS = {
	BATTLE: false
}

var ITEMS = {
	MEDICAMENT: {},
	EQUIP: {}
}
ITEMS.MEDICAMENT.LIFE = new Equipment("生命药剂", "恢复30生命", "prop", 50, function(){hero.statusChange("life", 30)})
ITEMS.MEDICAMENT.ENERGY = new Equipment("魔力药剂", "恢复30魔力", "prop", 50, function(){hero.statusChange("mana", 30)})
ITEMS.EQUIP.SWORD = new Equipment("长剑", "攻击+2", "equip", 100, function(){hero.statusChange("atk", 2)})

// function action(){
// 	var args = arguments
// }

putstr("请输入一个名字，创建属于您的英雄：")
var hero = new Hero(readline())