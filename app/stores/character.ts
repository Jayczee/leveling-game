import { defineStore } from 'pinia'
import { TALENTS, CULTIVATION_PATHS, TIME_TREASURES, ENLIGHTENMENT_PATHS, DIVINE_POWERS } from '~/utils/constants'
import { QI_CULTIVATION_REALMS, BODY_CULTIVATION_REALMS, getCultivationLevelInfo, type CultivationLevel } from '~/utils/cultivation-levels'
import { type AttributeModifier, calculateBaseDerivedAttributes, applyAttributeModifiers, getTalentModifier, getEnlightenmentModifier, getDivinePowerModifier } from '~/utils/attribute-system'

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

  // 悟道系统
  enlightenment: {
    paths: {
      metal: { level: number; experience: number }     // 金之道
      wood: { level: number; experience: number }      // 木之道
      water: { level: number; experience: number }     // 水之道
      fire: { level: number; experience: number }      // 火之道
      earth: { level: number; experience: number }     // 土之道
      time: { level: number; experience: number }      // 时间之道
      space: { level: number; experience: number }     // 空间之道
    }
  }

  // 资源
  resources: {
    spiritualQi: number      // 灵气（练气经验）
    spiritualStones: number  // 灵石（炼体经验）
    spiritCrystals: number   // 灵晶（神通升级货币）
  }

  // 神通系统
  divinePowers: {
    owned: string[]          // 已获得的神通ID列表
    levels: Record<string, number>  // 神通等级 {神通ID: 等级}
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
    totalSpiritualQiGained: number // 累积获得的练气经验
    totalSpiritualStonesGained: number // 累积获得的炼体经验
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

    // 检查练气是否需要显示突破按钮（达到当前境界最后一级且经验满）
    needQiBreakthrough: (state) => {
      if (!state.character) return false

      const currentLevelInfo = getCultivationLevelInfo(state.character.cultivation.qiCultivation.level, QI_CULTIVATION_REALMS)

      // 必须有当前等级信息且经验达到要求
      if (!currentLevelInfo?.levelInfo || state.character.resources.spiritualQi < currentLevelInfo.levelInfo.requiredExp) {
        return false
      }

      // 检查是否达到当前境界的最后一级
      if (!currentLevelInfo.realm) return false

      const isLastLevelInRealm = currentLevelInfo.levelInRealm === currentLevelInfo.realm.levels.length - 1

      // 如果是当前境界的最后一级且经验满，显示突破按钮
      return isLastLevelInRealm
    },

    // 检查炼体是否需要显示突破按钮（达到当前境界最后一级且经验满）
    needBodyBreakthrough: (state) => {
      if (!state.character) return false

      const currentLevelInfo = getCultivationLevelInfo(state.character.cultivation.bodyCultivation.level, BODY_CULTIVATION_REALMS)

      // 必须有当前等级信息且经验达到要求
      if (!currentLevelInfo?.levelInfo || state.character.resources.spiritualStones < currentLevelInfo.levelInfo.requiredExp) {
        return false
      }

      // 检查是否达到当前境界的最后一级
      if (!currentLevelInfo.realm) return false

      const isLastLevelInRealm = currentLevelInfo.levelInRealm === currentLevelInfo.realm.levels.length - 1

      // 如果是当前境界的最后一级且经验满，显示突破按钮
      return isLastLevelInRealm
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
      const enlightenmentPaths = {
        metal: { level: 0, experience: 0 },
        wood: { level: 0, experience: 0 },
        water: { level: 0, experience: 0 },
        fire: { level: 0, experience: 0 },
        earth: { level: 0, experience: 0 },
        time: { level: 0, experience: 0 },
        space: { level: 0, experience: 0 }
      }

      const initialDivinePowers = { owned: [], levels: {} }
      const attributeModifiers: AttributeModifier[] = [
        getTalentModifier(data.talent),
        getEnlightenmentModifier(enlightenmentPaths),
        getDivinePowerModifier(initialDivinePowers)
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
        enlightenment: {
          paths: {
            metal: { level: 0, experience: 0 },
            wood: { level: 0, experience: 0 },
            water: { level: 0, experience: 0 },
            fire: { level: 0, experience: 0 },
            earth: { level: 0, experience: 0 },
            time: { level: 0, experience: 0 },
            space: { level: 0, experience: 0 }
          }
        },
        resources: {
          spiritualQi: 90, // 接近第一级升级所需的100经验
          spiritualStones: 90, // 接近第一级升级所需的100经验
          spiritCrystals: 0 // 初始灵晶为0
        },
        divinePowers: {
          owned: [], // 初始没有神通
          levels: {} // 初始神通等级为空
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
          successfulBreakthroughs: 0,
          totalSpiritualQiGained: 0,
          totalSpiritualStonesGained: 0
        }
      }
    },

    // 加载角色
    loadCharacter(character: Character) {
      // 处理旧存档兼容性 - 如果没有悟道系统数据，则初始化
      if (!character.enlightenment) {
        character.enlightenment = {
          paths: {
            metal: { level: 0, experience: 0 },
            wood: { level: 0, experience: 0 },
            water: { level: 0, experience: 0 },
            fire: { level: 0, experience: 0 },
            earth: { level: 0, experience: 0 },
            time: { level: 0, experience: 0 },
            space: { level: 0, experience: 0 }
          }
        }
      }

      // 处理旧存档兼容性 - 如果没有神通系统数据，则初始化
      if (!character.divinePowers) {
        character.divinePowers = {
          owned: [],
          levels: {}
        }
      }

      // 处理旧存档兼容性 - 如果没有灵晶资源，则初始化
      if (character.resources && typeof character.resources.spiritCrystals === 'undefined') {
        character.resources.spiritCrystals = 0
      }

      this.character = character

      // 确保属性修饰器包含悟道修饰器和神通修饰器
      this.updateEnlightenmentModifier()
      this.updateDivinePowerModifier()
      this.updateDerivedAttributes()
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
      if (resources.spiritCrystals) {
        this.character.resources.spiritCrystals += resources.spiritCrystals
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
      if (resources.spiritCrystals && this.character.resources.spiritCrystals < resources.spiritCrystals) {
        return false
      }

      // 消耗资源
      if (resources.spiritualQi) {
        this.character.resources.spiritualQi -= resources.spiritualQi
      }
      if (resources.spiritualStones) {
        this.character.resources.spiritualStones -= resources.spiritualStones
      }
      if (resources.spiritCrystals) {
        this.character.resources.spiritCrystals -= resources.spiritCrystals
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

      // 更新悟道修饰器和神通修饰器
      this.updateEnlightenmentModifier()
      this.updateDivinePowerModifier()

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

    // 更新悟道修饰器
    updateEnlightenmentModifier() {
      if (!this.character) return

      // 找到并更新悟道修饰器
      const enlightenmentModifierIndex = this.character.attributeModifiers.findIndex(
        modifier => modifier.id === 'enlightenment_paths'
      )

      const newEnlightenmentModifier = getEnlightenmentModifier(this.character.enlightenment.paths)

      if (enlightenmentModifierIndex >= 0) {
        this.character.attributeModifiers[enlightenmentModifierIndex] = newEnlightenmentModifier
      } else {
        this.character.attributeModifiers.push(newEnlightenmentModifier)
      }
    },

    // 更新神通修饰器
    updateDivinePowerModifier() {
      if (!this.character) return

      // 找到并更新神通修饰器
      const divinePowerModifierIndex = this.character.attributeModifiers.findIndex(
        modifier => modifier.id === 'divine_powers'
      )

      const newDivinePowerModifier = getDivinePowerModifier(this.character.divinePowers)

      if (divinePowerModifierIndex >= 0) {
        this.character.attributeModifiers[divinePowerModifierIndex] = newDivinePowerModifier
      } else {
        this.character.attributeModifiers.push(newDivinePowerModifier)
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

      // 更新累积经验统计
      this.character.stats.totalSpiritualQiGained += amount

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

      // 更新累积经验统计
      this.character.stats.totalSpiritualStonesGained += amount

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

    // 悟道系统相关方法

    // 获得悟道经验
    gainEnlightenmentExperience(pathId: string, amount: number) {
      if (!this.character) return

      // 类型安全的路径访问
      const pathKey = pathId.toLowerCase() as keyof typeof this.character.enlightenment.paths
      const path = this.character.enlightenment.paths[pathKey]
      if (!path) return

      // 增加经验
      path.experience += amount

      // 检查是否可以升级
      this.checkEnlightenmentLevelUp(pathId)

      // 添加消息
      const pathConfig = ENLIGHTENMENT_PATHS[pathId.toUpperCase() as keyof typeof ENLIGHTENMENT_PATHS]
      if (pathConfig) {
        const gameStore = useGameStore()
        gameStore.addMessage(`${pathConfig.name}经验+${amount}`, 'info')
      }
    },

    // 检查悟道等级提升
    checkEnlightenmentLevelUp(pathId: string) {
      if (!this.character) return

      const pathKey = pathId.toLowerCase() as keyof typeof this.character.enlightenment.paths
      const path = this.character.enlightenment.paths[pathKey]
      const pathConfig = ENLIGHTENMENT_PATHS[pathId.toUpperCase() as keyof typeof ENLIGHTENMENT_PATHS]
      if (!path || !pathConfig) return

      // 循环检查升级
      while (path.level < pathConfig.maxLevel && path.experience >= pathConfig.expPerLevel) {
        path.experience -= pathConfig.expPerLevel
        path.level += 1

        // 应用悟道加成
        this.applyEnlightenmentBonus(pathConfig)

        // 添加升级消息
        const gameStore = useGameStore()
        gameStore.addMessage(`${pathConfig.name}突破：${path.level}级`, 'success')
      }
    },

    // 应用悟道加成
    applyEnlightenmentBonus(pathConfig: any) {
      if (!this.character) return

      const effects = pathConfig.effects
      if (!effects) return

      // 应用固定法力值加成
      if (effects.mana && typeof effects.mana === 'number') {
        this.character.derivedAttributes.mana += effects.mana
      }

      // 更新衍生属性以应用百分比加成
      this.updateDerivedAttributes()
    },

    // 获取悟道总加成
    getEnlightenmentBonuses() {
      if (!this.character) return {}

      const bonuses: any = {
        physicalDefense: 0,
        magicalDefense: 0,
        health: 0,
        mana: 0,
        divineStrength: 0,
        explorationTimeReduction: 0,
        cultivationEfficiency: 0
      }

      // 遍历所有悟道路径
      Object.entries(this.character.enlightenment.paths).forEach(([pathId, pathData]) => {
        const pathConfig = ENLIGHTENMENT_PATHS[pathId.toUpperCase() as keyof typeof ENLIGHTENMENT_PATHS]
        if (!pathConfig || !pathData.level) return

        const effects = pathConfig.effects
        Object.entries(effects).forEach(([effectType, effectValue]) => {
          if (typeof effectValue === 'number' && effectType !== 'mana') {
            // 百分比加成
            bonuses[effectType] += (effectValue * pathData.level) / 100
          }
        })
      })

      return bonuses
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
      this.gainQiExperience(20) // 给予大量经验
      console.log('给予500点练气经验后:')
      console.log('练气等级:', this.character.cultivation.qiCultivation.level)
      console.log('练气经验:', this.character.resources.spiritualQi)

      this.gainBodyExperience(20) // 给予大量经验
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
    },

    // 神通系统相关方法

    // 获得神通
    gainDivinePower(powerId: string) {
      if (!this.character) return false

      // 检查神通是否存在
      const power = DIVINE_POWERS[powerId]
      if (!power) return false

      // 检查是否已经拥有该神通
      if (this.character.divinePowers.owned.includes(powerId)) {
        return false
      }

      // 添加神通到已拥有列表
      this.character.divinePowers.owned.push(powerId)
      // 初始化神通等级为0
      this.character.divinePowers.levels[powerId] = 0

      // 添加获得神通的消息
      const gameStore = useGameStore()
      gameStore.addMessage(`获得神通：${power.name}`, 'success')

      return true
    },

    // 升级神通
    upgradeDivinePower(powerId: string): boolean {
      if (!this.character) return false

      // 检查是否拥有该神通
      if (!this.character.divinePowers.owned.includes(powerId)) {
        return false
      }

      const power = DIVINE_POWERS[powerId]
      if (!power) return false

      const currentLevel = this.character.divinePowers.levels[powerId] || 0

      // 检查是否已达到最大等级
      if (currentLevel >= power.maxLevel) {
        return false
      }

      // 计算升级所需灵晶
      const upgradeCost = this.getDivinePowerUpgradeCost(powerId)

      // 检查是否有足够的灵晶
      if (this.character.resources.spiritCrystals < upgradeCost) {
        return false
      }

      // 消耗灵晶
      this.character.resources.spiritCrystals -= upgradeCost

      // 升级神通
      this.character.divinePowers.levels[powerId] = currentLevel + 1

      // 更新衍生属性（会自动应用神通加成）
      this.updateDerivedAttributes()

      // 添加升级消息
      const gameStore = useGameStore()
      gameStore.addMessage(`${power.name}升级至${currentLevel + 1}级`, 'success')

      return true
    },

    // 计算神通升级所需灵晶
    getDivinePowerUpgradeCost(powerId: string): number {
      if (!this.character) return 0

      const power = DIVINE_POWERS[powerId]
      if (!power) return 0

      const currentLevel = this.character.divinePowers.levels[powerId] || 0

      // 升级费用 = 基础费用 * (倍率 ^ 当前等级)
      return Math.floor(power.baseUpgradeCost * Math.pow(power.costMultiplier, currentLevel))
    },



    // 获取神通总加成
    getDivinePowerBonuses() {
      if (!this.character) return {}

      const bonuses = {
        health: 0,
        divineStrength: 0,
        physicalDefense: 0,
        magicalDefense: 0
      }

      // 遍历所有已拥有的神通
      this.character.divinePowers.owned.forEach(powerId => {
        const power = DIVINE_POWERS[powerId]
        const level = this.character!.divinePowers.levels[powerId] || 0

        if (power && level > 0) {
          const effects = power.effects
          if (effects.health) bonuses.health += effects.health * level
          if (effects.divineStrength) bonuses.divineStrength += effects.divineStrength * level
          if (effects.physicalDefense) bonuses.physicalDefense += effects.physicalDefense * level
          if (effects.magicalDefense) bonuses.magicalDefense += effects.magicalDefense * level
        }
      })

      return bonuses
    },

    // 检查是否拥有神通
    hasDivinePower(powerId: string): boolean {
      if (!this.character) return false
      return this.character.divinePowers.owned.includes(powerId)
    },

    // 获取神通等级
    getDivinePowerLevel(powerId: string): number {
      if (!this.character) return 0
      return this.character.divinePowers.levels[powerId] || 0
    },

    // 测试神通系统
    testDivinePowerSystem() {
      if (!this.character) {
        console.log('请先创建角色')
        return
      }

      console.log('=== 神通系统测试 ===')
      console.log('初始状态:')
      console.log('灵晶:', this.character.resources.spiritCrystals)
      console.log('已拥有神通:', this.character.divinePowers.owned)
      console.log('神通等级:', this.character.divinePowers.levels)

      // 给予一些灵晶用于测试
      this.gainResources({ spiritCrystals: 500 })
      console.log('给予500灵晶后:', this.character.resources.spiritCrystals)

      // 测试获得神通
      console.log('\n测试获得神通...')
      this.gainDivinePower('IRON_BONE')
      this.gainDivinePower('GOLDEN_BODY')
      console.log('获得神通后:', this.character.divinePowers.owned)

      // 测试升级神通
      console.log('\n测试升级神通...')
      const ironBoneCost = this.getDivinePowerUpgradeCost('IRON_BONE')
      console.log('铁骨神通升级消耗:', ironBoneCost)

      this.upgradeDivinePower('IRON_BONE')
      console.log('升级后等级:', this.character.divinePowers.levels)
      console.log('剩余灵晶:', this.character.resources.spiritCrystals)

      // 显示属性加成
      console.log('\n神通属性加成:')
      const bonuses = this.getDivinePowerBonuses()
      console.log(bonuses)

      console.log('=== 测试完成 ===')
    }
  }
})
