// 修炼等级定义配置

export interface CultivationLevel {
  id: string
  name: string
  description: string
  requiredExp: number
  rewards?: {
    attributes?: {
      constitution?: number // 体质
      spiritualPower?: number // 灵力
      comprehension?: number  // 悟性
    }
    derivedAttributes?: {
      mana?: number // 法力
      divineStrength?: number // 神力
      physicalDefense?: number  // 物理防御
      magicalDefense?: number // 魔法防御
      health?: number // 生命值
    }
    resources?: {
      spiritualQi?: number  // 灵气（练气经验）
      spiritualStones?: number  // 灵石（炼体经验）
    }
  }
}

export interface CultivationRealm {
  id: string
  name: string
  description: string
  levels: CultivationLevel[]
}

// 练气等级定义
export const QI_CULTIVATION_REALMS: CultivationRealm[] = [
  {
    id: 'qi_gathering',
    name: '聚气期',
    description: '初入练气，聚集天地灵气',
    levels: [
      {
        id: 'qi_gathering_1',
        name: '聚气一层',
        description: '初步感知灵气',
        requiredExp: 100,
        rewards: {
          attributes: { spiritualPower: 1 },
          derivedAttributes: { mana: 10 }
        }
      },
      {
        id: 'qi_gathering_2',
        name: '聚气二层',
        description: '灵气运转更加顺畅',
        requiredExp: 150,
        rewards: {
          attributes: { spiritualPower: 1 },
          derivedAttributes: { mana: 15 }
        }
      },
      {
        id: 'qi_gathering_3',
        name: '聚气三层',
        description: '灵气凝聚初成',
        requiredExp: 200,
        rewards: {
          attributes: { spiritualPower: 2 },
          derivedAttributes: { mana: 20, magicalDefense: 5 }
        }
      }
    ]
  },
  {
    id: 'qi_refining',
    name: '炼气期',
    description: '炼化灵气，提升修为',
    levels: [
      {
        id: 'qi_refining_1',
        name: '炼气一层',
        description: '开始炼化体内灵气',
        requiredExp: 300,
        rewards: {
          attributes: { spiritualPower: 2 },
          derivedAttributes: { mana: 25 }
        }
      },
      {
        id: 'qi_refining_2',
        name: '炼气二层',
        description: '灵气纯度提升',
        requiredExp: 400,
        rewards: {
          attributes: { spiritualPower: 2 },
          derivedAttributes: { mana: 30, magicalDefense: 8 }
        }
      },
      {
        id: 'qi_refining_3',
        name: '炼气三层',
        description: '灵气运转如意',
        requiredExp: 500,
        rewards: {
          attributes: { spiritualPower: 3 },
          derivedAttributes: { mana: 40, magicalDefense: 10 },
          resources: { spiritualStones: 1 }
        }
      }
    ]
  }
]

// 炼体等级定义
export const BODY_CULTIVATION_REALMS: CultivationRealm[] = [
  {
    id: 'body_tempering',
    name: '淬体期',
    description: '锤炼肉身，强化体魄',
    levels: [
      {
        id: 'body_tempering_1',
        name: '淬体一层',
        description: '初步强化肌肉',
        requiredExp: 100,
        rewards: {
          attributes: { constitution: 1 },
          derivedAttributes: { health: 20, physicalDefense: 2 }
        }
      },
      {
        id: 'body_tempering_2',
        name: '淬体二层',
        description: '骨骼开始强化',
        requiredExp: 150,
        rewards: {
          attributes: { constitution: 1 },
          derivedAttributes: { health: 25, physicalDefense: 3 }
        }
      },
      {
        id: 'body_tempering_3',
        name: '淬体三层',
        description: '筋骨齐鸣',
        requiredExp: 200,
        rewards: {
          attributes: { constitution: 2 },
          derivedAttributes: { health: 35, physicalDefense: 5, divineStrength: 10 }
        }
      }
    ]
  },
  {
    id: 'body_forging',
    name: '锻体期',
    description: '深度锻造肉身，脱胎换骨',
    levels: [
      {
        id: 'body_forging_1',
        name: '锻体一层',
        description: '肉身如铁',
        requiredExp: 300,
        rewards: {
          attributes: { constitution: 2 },
          derivedAttributes: { health: 40, physicalDefense: 8 }
        }
      },
      {
        id: 'body_forging_2',
        name: '锻体二层',
        description: '铜皮铁骨',
        requiredExp: 400,
        rewards: {
          attributes: { constitution: 2 },
          derivedAttributes: { health: 50, physicalDefense: 10, divineStrength: 15 }
        }
      },
      {
        id: 'body_forging_3',
        name: '锻体三层',
        description: '金刚不坏',
        requiredExp: 500,
        rewards: {
          attributes: { constitution: 3 },
          derivedAttributes: { health: 60, physicalDefense: 15, divineStrength: 20, magicalDefense: 5 },
          resources: { spiritualStones: 1 }
        }
      }
    ]
  }
]

// 根据等级获取修炼境界和层级信息
export function getCultivationLevelInfo(totalLevel: number, realms: CultivationRealm[]) {
  let currentLevel = 0

  for (const realm of realms) {
    if (currentLevel + realm.levels.length > totalLevel) {
      const levelInRealm = totalLevel - currentLevel
      return {
        realm,
        levelInRealm,
        levelInfo: realm.levels[levelInRealm]
      }
    }
    currentLevel += realm.levels.length
  }

  // 如果超出定义的等级，返回null表示已达到最高等级
  return {
    realm: null,
    levelInRealm: -1,
    levelInfo: null
  }
}

// 计算到达指定等级所需的总经验
export function getTotalExpForLevel(targetLevel: number, realms: CultivationRealm[]): number {
  let totalExp = 0
  let currentLevel = 0
  
  for (const realm of realms) {
    for (const level of realm.levels) {
      if (currentLevel >= targetLevel) {
        return totalExp
      }
      totalExp += level.requiredExp
      currentLevel++
    }
  }
  
  return totalExp
}
