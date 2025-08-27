// 可扩展的属性计算系统

import { TALENTS, ENLIGHTENMENT_PATHS } from './constants'

// 属性修饰器接口
export interface AttributeModifier {
  id: string
  name: string
  source: 'base' | 'talent' | 'equipment' | 'cultivation' | 'enlightenment' | 'temporary'
  modifiers: {
    // 基础属性修饰
    constitution?: number
    spiritualPower?: number
    comprehension?: number
    // 衍生属性修饰
    mana?: number
    divineStrength?: number
    physicalDefense?: number
    magicalDefense?: number
    health?: number
    maxHealth?: number
    // 百分比修饰
    constitutionPercent?: number
    spiritualPowerPercent?: number
    comprehensionPercent?: number
    manaPercent?: number
    divineStrengthPercent?: number
    physicalDefensePercent?: number
    magicalDefensePercent?: number
    healthPercent?: number
  }
}

// 基础属性接口
export interface BaseAttributes {
  constitution: number
  spiritualPower: number
  comprehension: number
}

// 衍生属性接口
export interface DerivedAttributes {
  mana: number
  divineStrength: number
  physicalDefense: number
  magicalDefense: number
  health: number
  maxHealth: number
}

// 完整属性接口
export interface CalculatedAttributes {
  base: BaseAttributes
  derived: DerivedAttributes
  modifiers: AttributeModifier[]
}

// 计算基础衍生属性（不包含修饰器）
export function calculateBaseDerivedAttributes(constitution: number, spiritualPower: number): DerivedAttributes {
  // 基础值 + 属性加成
  const mana = 5 + spiritualPower * 2  // 基础法力5点，每1点灵力增加2法力
  const divineStrength = 5 + constitution * 1  // 基础神力5点，每1点体质增加1神力
  const physicalDefense = 10 + constitution * 0.4 + spiritualPower * 0.1  // 基础物防10点，每1点体质增加0.4，每1点灵力增加0.1
  const magicalDefense = 10 + constitution * 0.2 + spiritualPower * 0.5  // 基础法防10点，每1点体质增加0.2，每1点灵力增加0.5
  const maxHealth = 50 + constitution * 5  // 基础生命值50点，每1点体质增加5生命值
  
  return {
    mana: Math.floor(mana),
    divineStrength: Math.floor(divineStrength),
    physicalDefense: Math.floor(physicalDefense * 10) / 10, // 保留一位小数
    magicalDefense: Math.floor(magicalDefense * 10) / 10,   // 保留一位小数
    health: Math.floor(maxHealth),
    maxHealth: Math.floor(maxHealth)
  }
}

// 应用属性修饰器
export function applyAttributeModifiers(
  baseAttributes: BaseAttributes,
  baseDerived: DerivedAttributes,
  modifiers: AttributeModifier[]
): CalculatedAttributes {
  // 复制基础属性
  let finalBase = { ...baseAttributes }
  let finalDerived = { ...baseDerived }
  
  // 按优先级排序修饰器（base -> talent -> cultivation -> enlightenment -> equipment -> temporary）
  const sortedModifiers = [...modifiers].sort((a, b) => {
    const priority = { base: 0, talent: 1, cultivation: 2, enlightenment: 3, equipment: 4, temporary: 5 }
    return priority[a.source] - priority[b.source]
  })
  
  // 应用固定值修饰器
  for (const modifier of sortedModifiers) {
    const mods = modifier.modifiers
    
    // 基础属性修饰
    if (mods.constitution) finalBase.constitution += mods.constitution
    if (mods.spiritualPower) finalBase.spiritualPower += mods.spiritualPower
    if (mods.comprehension) finalBase.comprehension += mods.comprehension
    
    // 衍生属性修饰
    if (mods.mana) finalDerived.mana += mods.mana
    if (mods.divineStrength) finalDerived.divineStrength += mods.divineStrength
    if (mods.physicalDefense) finalDerived.physicalDefense += mods.physicalDefense
    if (mods.magicalDefense) finalDerived.magicalDefense += mods.magicalDefense
    if (mods.health) finalDerived.health += mods.health
    if (mods.maxHealth) finalDerived.maxHealth += mods.maxHealth
  }
  
  // 重新计算基于基础属性的衍生属性
  const recalculatedDerived = calculateBaseDerivedAttributes(finalBase.constitution, finalBase.spiritualPower)
  finalDerived = {
    mana: finalDerived.mana + (recalculatedDerived.mana - baseDerived.mana),
    divineStrength: finalDerived.divineStrength + (recalculatedDerived.divineStrength - baseDerived.divineStrength),
    physicalDefense: finalDerived.physicalDefense + (recalculatedDerived.physicalDefense - baseDerived.physicalDefense),
    magicalDefense: finalDerived.magicalDefense + (recalculatedDerived.magicalDefense - baseDerived.magicalDefense),
    health: finalDerived.health + (recalculatedDerived.health - baseDerived.health),
    maxHealth: finalDerived.maxHealth + (recalculatedDerived.maxHealth - baseDerived.maxHealth)
  }
  
  // 应用百分比修饰器
  for (const modifier of sortedModifiers) {
    const mods = modifier.modifiers
    
    if (mods.constitutionPercent) finalBase.constitution *= (1 + mods.constitutionPercent / 100)
    if (mods.spiritualPowerPercent) finalBase.spiritualPower *= (1 + mods.spiritualPowerPercent / 100)
    if (mods.comprehensionPercent) finalBase.comprehension *= (1 + mods.comprehensionPercent / 100)
    if (mods.manaPercent) finalDerived.mana *= (1 + mods.manaPercent / 100)
    if (mods.divineStrengthPercent) finalDerived.divineStrength *= (1 + mods.divineStrengthPercent / 100)
    if (mods.physicalDefensePercent) finalDerived.physicalDefense *= (1 + mods.physicalDefensePercent / 100)
    if (mods.magicalDefensePercent) finalDerived.magicalDefense *= (1 + mods.magicalDefensePercent / 100)
    if (mods.healthPercent) {
      finalDerived.health *= (1 + mods.healthPercent / 100)
      finalDerived.maxHealth *= (1 + mods.healthPercent / 100)
    }
  }
  
  // 确保所有值都是正数并格式化
  finalBase.constitution = Math.max(1, Math.floor(finalBase.constitution))
  finalBase.spiritualPower = Math.max(1, Math.floor(finalBase.spiritualPower))
  finalBase.comprehension = Math.max(1, Math.floor(finalBase.comprehension))
  
  finalDerived.mana = Math.max(0, Math.floor(finalDerived.mana))
  finalDerived.divineStrength = Math.max(0, Math.floor(finalDerived.divineStrength))
  finalDerived.physicalDefense = Math.max(0, Math.floor(finalDerived.physicalDefense * 10) / 10)
  finalDerived.magicalDefense = Math.max(0, Math.floor(finalDerived.magicalDefense * 10) / 10)
  finalDerived.health = Math.max(1, Math.floor(finalDerived.health))
  finalDerived.maxHealth = Math.max(1, Math.floor(finalDerived.maxHealth))
  
  return {
    base: finalBase,
    derived: finalDerived,
    modifiers: sortedModifiers
  }
}

// 获取天赋修饰器
export function getTalentModifier(talentKey: keyof typeof TALENTS): AttributeModifier {
  const talent = TALENTS[talentKey]
  const modifiers: AttributeModifier['modifiers'] = {}

  if ('constitution' in talent.effects) {
    modifiers.constitution = talent.effects.constitution
  }
  if ('comprehension' in talent.effects) {
    modifiers.comprehension = talent.effects.comprehension
  }

  return {
    id: `talent_${talentKey}`,
    name: talent.name,
    source: 'talent',
    modifiers
  }
}

// 获取悟道修饰器
export function getEnlightenmentModifier(enlightenmentPaths: any): AttributeModifier {
  const modifiers: AttributeModifier['modifiers'] = {}

  // 遍历所有悟道路径
  Object.entries(enlightenmentPaths).forEach(([pathId, pathData]: [string, any]) => {
    const pathConfig = ENLIGHTENMENT_PATHS[pathId.toUpperCase() as keyof typeof ENLIGHTENMENT_PATHS]
    if (!pathConfig || !pathData.level) return

    const effects = pathConfig.effects
    Object.entries(effects).forEach(([effectType, effectValue]) => {
      if (typeof effectValue === 'number') {
        if (effectType === 'mana') {
          // 固定法力值加成
          modifiers.mana = (modifiers.mana || 0) + (effectValue * pathData.level)
        } else {
          // 百分比加成
          const percentKey = `${effectType}Percent` as keyof typeof modifiers
          if (percentKey in modifiers) {
            modifiers[percentKey] = (modifiers[percentKey] || 0) + (effectValue * pathData.level)
          }
        }
      }
    })
  })

  return {
    id: 'enlightenment_paths',
    name: '悟道加成',
    source: 'enlightenment',
    modifiers
  }
}
