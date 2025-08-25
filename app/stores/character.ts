import { defineStore } from 'pinia'
import { TALENTS, REALMS, GAME_CONFIG, TIME_TREASURES, getRequiredExp, getCultivationSpeedMultiplier, getBreakthroughChance } from '~/utils/constants'

export interface Character {
  // 基础信息
  name: string
  gender: 'male' | 'female'
  talent: keyof typeof TALENTS
  
  // 属性
  attributes: {
    constitution: number      // 体质
    spiritualPower: number   // 灵力
    comprehension: number    // 悟性
  }
  
  // 修炼状态
  cultivation: {
    realm: keyof typeof REALMS
    level: number
    experience: number
    bodyLevel: number        // 炼体等级
    spiritLevel: number      // 练气等级
  }
  
  // 资源
  resources: {
    spiritualQi: number      // 灵气
    spiritualStones: number  // 灵石
  }
  
  // 装备
  equipment: {
    timeTreasure: string | null  // 装备的时光法宝ID
  }

  // 拥有的物品
  inventory: {
    timeTreasures: string[]  // 拥有的时光法宝ID列表
  }

  // 统计
  stats: {
    totalPlayTime: number    // 总游戏时间（秒）
    totalExploration: number // 总探险次数
    breakthroughAttempts: number // 突破尝试次数
    successfulBreakthroughs: number // 成功突破次数
  }
}

export const useCharacterStore = defineStore('character', {
  state: (): { character: Character | null } => ({
    character: null
  }),

  getters: {
    // 获取当前境界信息
    currentRealm: (state) => {
      if (!state.character) return null
      return REALMS[state.character.cultivation.realm]
    },

    // 获取天赋信息
    currentTalent: (state) => {
      if (!state.character) return null
      return TALENTS[state.character.talent]
    },

    // 计算修炼速度倍率
    cultivationSpeedMultiplier: (state) => {
      if (!state.character) return 1
      const { constitution, spiritualPower, comprehension } = state.character.attributes
      let multiplier = getCultivationSpeedMultiplier(constitution, spiritualPower, comprehension)
      
      // 应用天赋效果
      const talent = TALENTS[state.character.talent]
      if (talent.effects.cultivationSpeed) {
        multiplier *= talent.effects.cultivationSpeed
      }
      
      return multiplier
    },

    // 计算当前等级所需经验
    requiredExp: (state) => {
      if (!state.character) return 0
      return getRequiredExp(state.character.cultivation.level + 1)
    },

    // 计算突破成功率
    breakthroughChance: (state) => {
      if (!state.character) return 0
      let chance = getBreakthroughChance(
        state.character.attributes.comprehension,
        state.character.cultivation.level
      )
      
      // 应用天赋效果
      const talent = TALENTS[state.character.talent]
      if (talent.effects.breakthroughChance) {
        chance *= talent.effects.breakthroughChance
      }
      
      return chance
    },

    // 检查是否可以突破
    canBreakthrough: (state) => {
      if (!state.character) return false
      const realm = REALMS[state.character.cultivation.realm]
      return state.character.cultivation.level >= realm.maxLevel && realm.maxLevel > 0
    },

    // 获取角色总战力（简单计算）
    totalPower: (state) => {
      if (!state.character) return 0
      const { constitution, spiritualPower, comprehension } = state.character.attributes
      const { level, bodyLevel, spiritLevel } = state.character.cultivation
      return constitution * 10 + spiritualPower * 15 + comprehension * 8 + level * 50 + bodyLevel * 20 + spiritLevel * 30
    }
  },

  actions: {
    // 创建新角色
    createCharacter(data: {
      name: string
      gender: 'male' | 'female'
      talent: keyof typeof TALENTS
      attributes: {
        constitution: number
        spiritualPower: number
        comprehension: number
      }
    }) {
      // 应用天赋属性加成
      const talent = TALENTS[data.talent]
      const attributes = { ...data.attributes }
      
      if (talent.effects.constitution) {
        attributes.constitution += talent.effects.constitution
      }
      if (talent.effects.comprehension) {
        attributes.comprehension += talent.effects.comprehension
      }

      this.character = {
        name: data.name,
        gender: data.gender,
        talent: data.talent,
        attributes,
        cultivation: {
          realm: 'MORTAL',
          level: 0,
          experience: 0,
          bodyLevel: 0,
          spiritLevel: 0
        },
        resources: {
          spiritualQi: 100,
          spiritualStones: 0
        },
        equipment: {
          timeTreasure: null
        },
        inventory: {
          timeTreasures: ['BRONZE_HOURGLASS', 'SILVER_CHRONOMETER'] // 初始拥有两个时光法宝
        },
        stats: {
          totalPlayTime: 0,
          totalExploration: 0,
          breakthroughAttempts: 0,
          successfulBreakthroughs: 0
        }
      }
    },

    // 加载角色
    loadCharacter(character: Character) {
      this.character = character
    },

    // 获得经验
    gainExperience(amount: number) {
      if (!this.character) return

      this.character.cultivation.experience += amount
      
      // 检查是否可以升级
      while (this.character.cultivation.experience >= this.requiredExp) {
        this.levelUp()
      }
    },

    // 升级
    levelUp() {
      if (!this.character) return

      this.character.cultivation.experience -= this.requiredExp
      this.character.cultivation.level += 1

      // 检查是否需要突破境界
      const currentRealm = REALMS[this.character.cultivation.realm]
      if (this.character.cultivation.level > currentRealm.maxLevel && currentRealm.maxLevel > 0) {
        this.attemptBreakthrough()
      }
    },

    // 尝试突破
    attemptBreakthrough() {
      if (!this.character) return false

      this.character.stats.breakthroughAttempts += 1
      
      const success = Math.random() < this.breakthroughChance
      
      if (success) {
        this.character.stats.successfulBreakthroughs += 1
        
        // 突破到下一个境界
        const realmKeys = Object.keys(REALMS) as (keyof typeof REALMS)[]
        const currentIndex = realmKeys.indexOf(this.character.cultivation.realm)
        
        if (currentIndex < realmKeys.length - 1) {
          this.character.cultivation.realm = realmKeys[currentIndex + 1]
          this.character.cultivation.level = 1
          
          // 突破奖励
          this.character.resources.spiritualQi += 500
          this.character.resources.spiritualStones += 1
        }
        
        return true
      }
      
      return false
    },

    // 获得资源
    gainResources(resources: Partial<Character['resources']>) {
      if (!this.character) return

      if (resources.spiritualQi) {
        this.character.resources.spiritualQi += resources.spiritualQi
      }
      if (resources.spiritualStones) {
        this.character.resources.spiritualStones += resources.spiritualStones
      }
    },

    // 消耗资源
    consumeResources(resources: Partial<Character['resources']>): boolean {
      if (!this.character) return false

      // 检查是否有足够资源
      if (resources.spiritualQi && this.character.resources.spiritualQi < resources.spiritualQi) {
        return false
      }
      if (resources.spiritualStones && this.character.resources.spiritualStones < resources.spiritualStones) {
        return false
      }

      // 消耗资源
      if (resources.spiritualQi) {
        this.character.resources.spiritualQi -= resources.spiritualQi
      }
      if (resources.spiritualStones) {
        this.character.resources.spiritualStones -= resources.spiritualStones
      }

      return true
    },

    // 增加游戏时间
    addPlayTime(seconds: number) {
      if (!this.character) return
      this.character.stats.totalPlayTime += seconds
    },

    // 增加探险次数
    addExploration() {
      if (!this.character) return
      this.character.stats.totalExploration += 1
    },

    // 装备时光法宝
    equipTimeTreasure(treasureId: string | null) {
      if (!this.character) return false
      this.character.equipment.timeTreasure = treasureId
      return true
    },

    // 获取当前装备的时光法宝
    getCurrentTimeTreasure() {
      if (!this.character?.equipment.timeTreasure) return null
      return TIME_TREASURES[this.character.equipment.timeTreasure] || null
    },

    // 获取时光法宝加速倍率
    getTimeTreasureSpeedMultiplier() {
      const treasure = this.getCurrentTimeTreasure()
      return treasure ? treasure.speedMultiplier : 1
    }
  }
})
