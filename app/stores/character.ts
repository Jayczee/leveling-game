import { defineStore } from 'pinia'
import { TALENTS, CULTIVATION_PATHS, TIME_TREASURES, calculateDerivedAttributes } from '~/utils/constants'
import { QI_CULTIVATION_REALMS, BODY_CULTIVATION_REALMS, getCultivationLevelInfo, type CultivationLevel } from '~/utils/cultivation-levels'
import { type AttributeModifier, calculateBaseDerivedAttributes, applyAttributeModifiers, getTalentModifier } from '~/utils/attribute-system'

export interface Character {
  // 基础信息
  name: string
  gender: 'male' | 'female'
  cultivationPath: keyof typeof CULTIVATION_PATHS
  talent: keyof typeof TALENTS
  
  // 基础属性
  attributes: {
    constitution: number      // 体质
    spiritualPower: number   // 灵力
    comprehension: number    // 悟性
  }

  // 衍生属性（由基础属性计算得出）
  derivedAttributes: {
    mana: number            // 法力（由灵力影响）
    divineStrength: number  // 神力（由体质影响）
    physicalDefense: number // 物抗（由体质影响）
    magicalDefense: number  // 法抗（由灵力和体质影响）
    health: number          // 生命值（由体质影响）
    maxHealth: number       // 最大生命值
  }

  // 属性修饰器（用于扩展性）
  attributeModifiers: AttributeModifier[]
  
  // 修炼状态
  cultivation: {
    // 练气修炼
    qiCultivation: {
      level: number           // 练气等级
    }
    // 炼体修炼
    bodyCultivation: {
      level: number           // 炼体等级
    }
  }

  // 资源
  resources: {
    spiritualQi: number      // 灵气（练气经验）
    spiritualStones: number  // 灵石（炼体经验）
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


    // 获取天赋信息
    currentTalent: (state) => {
      if (!state.character) return null
      return TALENTS[state.character.talent]
    },





    // 获取角色总战力（简单计算）
    totalPower: (state) => {
      if (!state.character) return 0
      const { constitution, spiritualPower, comprehension } = state.character.attributes
      const { qiCultivation, bodyCultivation } = state.character.cultivation
      return constitution * 10 + spiritualPower * 15 + comprehension * 8 + bodyCultivation.level * 20 + qiCultivation.level * 30
    },

    // 获取当前练气等级信息
    currentQiLevelInfo: (state) => {
      if (!state.character) return null
      return getCultivationLevelInfo(state.character.cultivation.qiCultivation.level, QI_CULTIVATION_REALMS)
    },

    // 获取当前炼体等级信息
    currentBodyLevelInfo: (state) => {
      if (!state.character) return null
      return getCultivationLevelInfo(state.character.cultivation.bodyCultivation.level, BODY_CULTIVATION_REALMS)
    },

    // 检查是否可以获得练气经验
    canGainQiExperience: (state) => {
      if (!state.character) return false

      const currentLevelInfo = getCultivationLevelInfo(state.character.cultivation.qiCultivation.level, QI_CULTIVATION_REALMS)

      // 如果没有当前等级信息，说明已经达到最高等级
      if (!currentLevelInfo?.levelInfo) return false

      // 如果当前经验已经达到要求，检查是否还有下一级
      if (state.character.resources.spiritualQi >= currentLevelInfo.levelInfo.requiredExp) {
        const nextLevelInfo = getCultivationLevelInfo(state.character.cultivation.qiCultivation.level + 1, QI_CULTIVATION_REALMS)
        return !!nextLevelInfo?.levelInfo
      }

      return true
    },

    // 检查是否可以获得炼体经验
    canGainBodyExperience: (state) => {
      if (!state.character) return false

      const currentLevelInfo = getCultivationLevelInfo(state.character.cultivation.bodyCultivation.level, BODY_CULTIVATION_REALMS)

      // 如果没有当前等级信息，说明已经达到最高等级
      if (!currentLevelInfo?.levelInfo) return false

      // 如果当前经验已经达到要求，检查是否还有下一级
      if (state.character.resources.spiritualStones >= currentLevelInfo.levelInfo.requiredExp) {
        const nextLevelInfo = getCultivationLevelInfo(state.character.cultivation.bodyCultivation.level + 1, BODY_CULTIVATION_REALMS)
        return !!nextLevelInfo?.levelInfo
      }

      return true
    },

    // 检查练气是否可以突破
    canBreakthroughQi: (state) => {
      if (!state.character) return false

      const currentLevelInfo = getCultivationLevelInfo(state.character.cultivation.qiCultivation.level, QI_CULTIVATION_REALMS)

      // 必须有当前等级信息且经验达到要求
      if (!currentLevelInfo?.levelInfo || state.character.resources.spiritualQi < currentLevelInfo.levelInfo.requiredExp) {
        return false
      }

      // 检查是否有下一级
      const nextLevelInfo = getCultivationLevelInfo(state.character.cultivation.qiCultivation.level + 1, QI_CULTIVATION_REALMS)
      return !!nextLevelInfo?.levelInfo
    },

    // 检查炼体是否可以突破
    canBreakthroughBody: (state) => {
      if (!state.character) return false

      const currentLevelInfo = getCultivationLevelInfo(state.character.cultivation.bodyCultivation.level, BODY_CULTIVATION_REALMS)

      // 必须有当前等级信息且经验达到要求
      if (!currentLevelInfo?.levelInfo || state.character.resources.spiritualStones < currentLevelInfo.levelInfo.requiredExp) {
        return false
      }

      // 检查是否有下一级
      const nextLevelInfo = getCultivationLevelInfo(state.character.cultivation.bodyCultivation.level + 1, BODY_CULTIVATION_REALMS)
      return !!nextLevelInfo?.levelInfo
    },

    // 检查练气是否需要显示突破按钮（经验满且无下一级）
    needQiBreakthrough: (state) => {
      if (!state.character) return false

      const currentLevelInfo = getCultivationLevelInfo(state.character.cultivation.qiCultivation.level, QI_CULTIVATION_REALMS)

      // 必须有当前等级信息且经验达到要求
      if (!currentLevelInfo?.levelInfo || state.character.resources.spiritualQi < currentLevelInfo.levelInfo.requiredExp) {
        return false
      }

      // 检查是否没有下一级（即已达到当前境界最高级）
      const nextLevelInfo = getCultivationLevelInfo(state.character.cultivation.qiCultivation.level + 1, QI_CULTIVATION_REALMS)
      return !nextLevelInfo?.levelInfo
    },

    // 检查炼体是否需要显示突破按钮（经验满且无下一级）
    needBodyBreakthrough: (state) => {
      if (!state.character) return false

      const currentLevelInfo = getCultivationLevelInfo(state.character.cultivation.bodyCultivation.level, BODY_CULTIVATION_REALMS)

      // 必须有当前等级信息且经验达到要求
      if (!currentLevelInfo?.levelInfo || state.character.resources.spiritualStones < currentLevelInfo.levelInfo.requiredExp) {
        return false
      }

      // 检查是否没有下一级（即已达到当前境界最高级）
      const nextLevelInfo = getCultivationLevelInfo(state.character.cultivation.bodyCultivation.level + 1, BODY_CULTIVATION_REALMS)
      return !nextLevelInfo?.levelInfo
    }
  },

  actions: {
    // 创建新角色
    createCharacter(data: {
      name: string
      gender: 'male' | 'female'
      cultivationPath: keyof typeof CULTIVATION_PATHS
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

      if ('constitution' in talent.effects) {
        attributes.constitution += talent.effects.constitution
      }
      if ('comprehension' in talent.effects) {
        attributes.comprehension += talent.effects.comprehension
      }

      // 初始化属性修饰器
      const attributeModifiers: AttributeModifier[] = [
        getTalentModifier(data.talent)
      ]

      // 计算最终属性
      const baseDerived = calculateBaseDerivedAttributes(attributes.constitution, attributes.spiritualPower)
      const finalAttributes = applyAttributeModifiers(attributes, baseDerived, attributeModifiers)

      this.character = {
        name: data.name,
        gender: data.gender,
        cultivationPath: data.cultivationPath,
        talent: data.talent,
        attributes: finalAttributes.base,
        derivedAttributes: finalAttributes.derived,
        attributeModifiers,
        cultivation: {
          qiCultivation: {
            level: 0
          },
          bodyCultivation: {
            level: 0
          }
        },
        resources: {
          spiritualQi: 90, // 接近第一级升级所需的100经验
          spiritualStones: 90 // 接近第一级升级所需的100经验
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
    },

    // 更新衍生属性
    updateDerivedAttributes() {
      if (!this.character) return

      // 使用新的属性系统重新计算所有属性
      const baseDerived = calculateBaseDerivedAttributes(
        this.character.attributes.constitution,
        this.character.attributes.spiritualPower
      )

      const finalAttributes = applyAttributeModifiers(
        this.character.attributes,
        baseDerived,
        this.character.attributeModifiers
      )

      // 保持当前生命值比例
      const healthRatio = this.character.derivedAttributes.health / this.character.derivedAttributes.maxHealth

      this.character.attributes = finalAttributes.base
      this.character.derivedAttributes = {
        ...finalAttributes.derived,
        health: Math.floor(finalAttributes.derived.maxHealth * healthRatio)
      }
    },

    // 获取修炼方向信息
    getCurrentCultivationPath() {
      if (!this.character) return null
      return CULTIVATION_PATHS[this.character.cultivationPath]
    },

    // 添加属性修饰器
    addAttributeModifier(modifier: AttributeModifier) {
      if (!this.character) return

      // 检查是否已存在相同ID的修饰器
      const existingIndex = this.character.attributeModifiers.findIndex(m => m.id === modifier.id)
      if (existingIndex >= 0) {
        this.character.attributeModifiers[existingIndex] = modifier
      } else {
        this.character.attributeModifiers.push(modifier)
      }

      // 重新计算属性
      this.updateDerivedAttributes()
    },

    // 移除属性修饰器
    removeAttributeModifier(modifierId: string) {
      if (!this.character) return

      this.character.attributeModifiers = this.character.attributeModifiers.filter(m => m.id !== modifierId)

      // 重新计算属性
      this.updateDerivedAttributes()
    },

    // 获得练气经验（经验值已经在调用时应用了效率）
    gainQiExperience(amount: number) {
      if (!this.character) return

      // 检查是否可以获得经验
      if (!this.canGainQiExperience) return

      // 直接增加经验，不限制上限，让升级逻辑处理
      this.character.resources.spiritualQi += amount

      // 检查是否可以升级
      this.checkQiLevelUp()
    },

    // 获得炼体经验（经验值已经在调用时应用了效率）
    gainBodyExperience(amount: number) {
      if (!this.character) return

      // 检查是否可以获得经验
      if (!this.canGainBodyExperience) return

      // 直接增加经验，不限制上限，让升级逻辑处理
      this.character.resources.spiritualStones += amount

      // 检查是否可以升级
      this.checkBodyLevelUp()
    },

    // 检查练气等级提升
    checkQiLevelUp() {
      if (!this.character) return

      // 循环检查升级，直到无法再升级
      while (true) {
        const currentLevelInfo = this.currentQiLevelInfo
        if (!currentLevelInfo?.levelInfo) break

        // 检查当前经验是否达到升级要求
        if (this.character.resources.spiritualQi >= currentLevelInfo.levelInfo.requiredExp) {
          const nextLevelIndex = this.character.cultivation.qiCultivation.level + 1
          const nextLevelInfo = getCultivationLevelInfo(nextLevelIndex, QI_CULTIVATION_REALMS)

          // 如果有下一级，则升级
          if (nextLevelInfo.levelInfo) {
            this.character.resources.spiritualQi -= currentLevelInfo.levelInfo.requiredExp
            this.character.cultivation.qiCultivation.level += 1

            // 应用等级奖励
            this.applyLevelRewards(nextLevelInfo.levelInfo)

            // 添加升级消息
            const gameStore = useGameStore()
            gameStore.addMessage(`练气突破：${nextLevelInfo.levelInfo.name}`, 'success')

            // 继续循环检查下一级
          } else {
            // 没有下一级，停止升级
            break
          }
        } else {
          // 经验不足，停止升级
          break
        }
      }
    },

    // 检查炼体等级提升
    checkBodyLevelUp() {
      if (!this.character) return

      // 循环检查升级，直到无法再升级
      while (true) {
        const currentLevelInfo = this.currentBodyLevelInfo
        if (!currentLevelInfo?.levelInfo) break

        // 检查当前经验是否达到升级要求
        if (this.character.resources.spiritualStones >= currentLevelInfo.levelInfo.requiredExp) {
          const nextLevelIndex = this.character.cultivation.bodyCultivation.level + 1
          const nextLevelInfo = getCultivationLevelInfo(nextLevelIndex, BODY_CULTIVATION_REALMS)

          // 如果有下一级，则升级
          if (nextLevelInfo.levelInfo) {
            this.character.resources.spiritualStones -= currentLevelInfo.levelInfo.requiredExp
            this.character.cultivation.bodyCultivation.level += 1

            // 应用等级奖励
            this.applyLevelRewards(nextLevelInfo.levelInfo)

            // 添加升级消息
            const gameStore = useGameStore()
            gameStore.addMessage(`炼体突破：${nextLevelInfo.levelInfo.name}`, 'success')

            // 继续循环检查下一级
          } else {
            // 没有下一级，停止升级
            break
          }
        } else {
          // 经验不足，停止升级
          break
        }
      }
    },

    // 应用等级奖励
    applyLevelRewards(levelInfo: CultivationLevel) {
      if (!this.character || !levelInfo.rewards) return

      // 应用属性奖励
      if (levelInfo.rewards.attributes) {
        const { constitution, spiritualPower, comprehension } = levelInfo.rewards.attributes
        if (constitution) this.character.attributes.constitution += constitution
        if (spiritualPower) this.character.attributes.spiritualPower += spiritualPower
        if (comprehension) this.character.attributes.comprehension += comprehension
      }

      // 应用资源奖励
      if (levelInfo.rewards.resources) {
        if (levelInfo.rewards.resources.spiritualQi) {
          this.gainResources({ spiritualQi: levelInfo.rewards.resources.spiritualQi })
        }
        if (levelInfo.rewards.resources.spiritualStones) {
          this.gainResources({ spiritualStones: levelInfo.rewards.resources.spiritualStones })
        }
      }

      // 更新衍生属性
      this.updateDerivedAttributes()

      // 应用衍生属性奖励（额外加成）
      if (levelInfo.rewards.derivedAttributes) {
        const { mana, divineStrength, physicalDefense, magicalDefense, health } = levelInfo.rewards.derivedAttributes
        if (mana) this.character.derivedAttributes.mana += mana
        if (divineStrength) this.character.derivedAttributes.divineStrength += divineStrength
        if (physicalDefense) this.character.derivedAttributes.physicalDefense += physicalDefense
        if (magicalDefense) this.character.derivedAttributes.magicalDefense += magicalDefense
        if (health) {
          this.character.derivedAttributes.health += health
          this.character.derivedAttributes.maxHealth += health
        }
      }
    },

    // 测试升级机制的辅助函数
    testUpgrade() {
      if (!this.character) {
        console.log('请先创建角色')
        return
      }

      console.log('=== 升级机制测试 ===')
      console.log('初始状态:')
      console.log('练气等级:', this.character.cultivation.qiCultivation.level)
      console.log('练气经验:', this.character.resources.spiritualQi)
      console.log('炼体等级:', this.character.cultivation.bodyCultivation.level)
      console.log('炼体经验:', this.character.resources.spiritualStones)

      // 测试练气升级
      console.log('\n测试练气升级...')
      this.gainQiExperience(20) // 给予20点经验，应该能升级
      console.log('给予20点练气经验后:')
      console.log('练气等级:', this.character.cultivation.qiCultivation.level)
      console.log('练气经验:', this.character.resources.spiritualQi)

      // 测试炼体升级
      console.log('\n测试炼体升级...')
      this.gainBodyExperience(20) // 给予20点经验，应该能升级
      console.log('给予20点炼体经验后:')
      console.log('炼体等级:', this.character.cultivation.bodyCultivation.level)
      console.log('炼体经验:', this.character.resources.spiritualStones)

      // 测试连续升级
      console.log('\n测试连续升级...')
      this.gainQiExperience(500) // 给予大量经验
      console.log('给予500点练气经验后:')
      console.log('练气等级:', this.character.cultivation.qiCultivation.level)
      console.log('练气经验:', this.character.resources.spiritualQi)

      this.gainBodyExperience(500) // 给予大量经验
      console.log('给予500点炼体经验后:')
      console.log('炼体等级:', this.character.cultivation.bodyCultivation.level)
      console.log('炼体经验:', this.character.resources.spiritualStones)

      // 检查突破状态
      console.log('\n突破状态检查:')
      console.log('需要练气突破:', this.needQiBreakthrough)
      console.log('需要炼体突破:', this.needBodyBreakthrough)
      console.log('可以获得练气经验:', this.canGainQiExperience)
      console.log('可以获得炼体经验:', this.canGainBodyExperience)

      console.log('=== 测试完成 ===')
    }
  }
})
