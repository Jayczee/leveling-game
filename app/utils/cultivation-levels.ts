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
      { id: 'qi_gathering_1', name: '聚气一层', description: '初步感知灵气', requiredExp: 100, rewards: { attributes: { spiritualPower: 1 }, derivedAttributes: { mana: 10 } } },
      { id: 'qi_gathering_2', name: '聚气二层', description: '灵气运转更加顺畅', requiredExp: 120, rewards: { attributes: { spiritualPower: 1 }, derivedAttributes: { mana: 12 } } },
      { id: 'qi_gathering_3', name: '聚气三层', description: '灵气凝聚初成', requiredExp: 140, rewards: { attributes: { spiritualPower: 1 }, derivedAttributes: { mana: 15 } } },
      { id: 'qi_gathering_4', name: '聚气四层', description: '灵气循环稳定', requiredExp: 160, rewards: { attributes: { spiritualPower: 1 }, derivedAttributes: { mana: 18 } } },
      { id: 'qi_gathering_5', name: '聚气五层', description: '聚气期圆满', requiredExp: 180, rewards: { attributes: { spiritualPower: 2 }, derivedAttributes: { mana: 20, magicalDefense: 5 } } }
    ]
  },
  {
    id: 'qi_refining',
    name: '炼气期',
    description: '炼化灵气，提升修为',
    levels: [
      { id: 'qi_refining_1', name: '炼气一层', description: '开始炼化体内灵气', requiredExp: 220, rewards: { attributes: { spiritualPower: 2 }, derivedAttributes: { mana: 25 } } },
      { id: 'qi_refining_2', name: '炼气二层', description: '灵气纯度提升', requiredExp: 260, rewards: { attributes: { spiritualPower: 2 }, derivedAttributes: { mana: 30 } } },
      { id: 'qi_refining_3', name: '炼气三层', description: '灵气运转如意', requiredExp: 300, rewards: { attributes: { spiritualPower: 2 }, derivedAttributes: { mana: 35 } } },
      { id: 'qi_refining_4', name: '炼气四层', description: '灵气凝实如液', requiredExp: 340, rewards: { attributes: { spiritualPower: 2 }, derivedAttributes: { mana: 40 } } },
      { id: 'qi_refining_5', name: '炼气五层', description: '炼气期圆满', requiredExp: 380, rewards: { attributes: { spiritualPower: 3 }, derivedAttributes: { mana: 45, magicalDefense: 8 } } }
    ]
  },
  {
    id: 'foundation_building',
    name: '筑基期',
    description: '筑建修炼根基，凝聚金丹雏形',
    levels: [
      { id: 'foundation_1', name: '筑基一层', description: '筑建灵力根基', requiredExp: 450, rewards: { attributes: { spiritualPower: 3 }, derivedAttributes: { mana: 55 } } },
      { id: 'foundation_2', name: '筑基二层', description: '根基渐趋稳固', requiredExp: 520, rewards: { attributes: { spiritualPower: 3 }, derivedAttributes: { mana: 65 } } },
      { id: 'foundation_3', name: '筑基三层', description: '灵力根基稳固', requiredExp: 590, rewards: { attributes: { spiritualPower: 3 }, derivedAttributes: { mana: 75 } } },
      { id: 'foundation_4', name: '筑基四层', description: '根基深厚扎实', requiredExp: 660, rewards: { attributes: { spiritualPower: 3 }, derivedAttributes: { mana: 85 } } },
      { id: 'foundation_5', name: '筑基五层', description: '筑基期圆满', requiredExp: 730, rewards: { attributes: { spiritualPower: 4 }, derivedAttributes: { mana: 100, magicalDefense: 12 } } }
    ]
  },
  {
    id: 'golden_core',
    name: '金丹期',
    description: '凝聚金丹，法力精纯',
    levels: [
      { id: 'golden_core_1', name: '金丹一层', description: '初凝金丹', requiredExp: 850, rewards: { attributes: { spiritualPower: 4 }, derivedAttributes: { mana: 120 } } },
      { id: 'golden_core_2', name: '金丹二层', description: '金丹渐圆', requiredExp: 970, rewards: { attributes: { spiritualPower: 4 }, derivedAttributes: { mana: 140 } } },
      { id: 'golden_core_3', name: '金丹三层', description: '金丹稳固', requiredExp: 1090, rewards: { attributes: { spiritualPower: 4 }, derivedAttributes: { mana: 160 } } },
      { id: 'golden_core_4', name: '金丹四层', description: '金丹圆润', requiredExp: 1210, rewards: { attributes: { spiritualPower: 4 }, derivedAttributes: { mana: 180 } } },
      { id: 'golden_core_5', name: '金丹五层', description: '金丹期圆满', requiredExp: 1330, rewards: { attributes: { spiritualPower: 5 }, derivedAttributes: { mana: 200, magicalDefense: 15 } } }
    ]
  },
  {
    id: 'nascent_soul',
    name: '元婴期',
    description: '凝聚元婴，神识初现',
    levels: [
      { id: 'nascent_soul_1', name: '元婴一层', description: '初凝元婴', requiredExp: 1500, rewards: { attributes: { spiritualPower: 5 }, derivedAttributes: { mana: 240, magicalDefense: 18 } } },
      { id: 'nascent_soul_2', name: '元婴二层', description: '元婴渐成', requiredExp: 1700, rewards: { attributes: { spiritualPower: 5 }, derivedAttributes: { mana: 280, magicalDefense: 21 } } },
      { id: 'nascent_soul_3', name: '元婴三层', description: '元婴稳固', requiredExp: 1900, rewards: { attributes: { spiritualPower: 5 }, derivedAttributes: { mana: 320, magicalDefense: 24 } } },
      { id: 'nascent_soul_4', name: '元婴四层', description: '元婴圆满', requiredExp: 2100, rewards: { attributes: { spiritualPower: 5 }, derivedAttributes: { mana: 360, magicalDefense: 27 } } },
      { id: 'nascent_soul_5', name: '元婴五层', description: '元婴期圆满', requiredExp: 2300, rewards: { attributes: { spiritualPower: 6, comprehension: 5 }, derivedAttributes: { mana: 400, magicalDefense: 30 } } }
    ]
  },
  {
    id: 'soul_transformation',
    name: '化神期',
    description: '神识化形，法则初悟',
    levels: [
      { id: 'soul_transformation_1', name: '化神一层', description: '神识初化', requiredExp: 2600, rewards: { attributes: { spiritualPower: 6, comprehension: 1 }, derivedAttributes: { mana: 460, magicalDefense: 35 } } },
      { id: 'soul_transformation_2', name: '化神二层', description: '神识凝实', requiredExp: 2900, rewards: { attributes: { spiritualPower: 6, comprehension: 1 }, derivedAttributes: { mana: 520, magicalDefense: 40 } } },
      { id: 'soul_transformation_3', name: '化神三层', description: '神识通灵', requiredExp: 3200, rewards: { attributes: { spiritualPower: 6, comprehension: 1 }, derivedAttributes: { mana: 580, magicalDefense: 45 } } },
      { id: 'soul_transformation_4', name: '化神四层', description: '神识圆满', requiredExp: 3500, rewards: { attributes: { spiritualPower: 6, comprehension: 1 }, derivedAttributes: { mana: 640, magicalDefense: 50 } } },
      { id: 'soul_transformation_5', name: '化神五层', description: '化神期圆满', requiredExp: 3800, rewards: { attributes: { spiritualPower: 7, comprehension: 2 }, derivedAttributes: { mana: 700, magicalDefense: 55 } } }
    ]
  },
  {
    id: 'void_refinement',
    name: '炼虚期',
    description: '炼化虚空，掌控法则',
    levels: [
      { id: 'void_refinement_1', name: '炼虚一层', description: '初炼虚空', requiredExp: 4200, rewards: { attributes: { spiritualPower: 7, comprehension: 2 }, derivedAttributes: { mana: 800, magicalDefense: 65 } } },
      { id: 'void_refinement_2', name: '炼虚二层', description: '虚空小成', requiredExp: 4600, rewards: { attributes: { spiritualPower: 7, comprehension: 2 }, derivedAttributes: { mana: 900, magicalDefense: 75 } } },
      { id: 'void_refinement_3', name: '炼虚三层', description: '虚空大成', requiredExp: 5000, rewards: { attributes: { spiritualPower: 7, comprehension: 2 }, derivedAttributes: { mana: 1000, magicalDefense: 85 } } },
      { id: 'void_refinement_4', name: '炼虚四层', description: '虚空圆满', requiredExp: 5400, rewards: { attributes: { spiritualPower: 7, comprehension: 2 }, derivedAttributes: { mana: 1100, magicalDefense: 95 } } },
      { id: 'void_refinement_5', name: '炼虚五层', description: '炼虚期圆满', requiredExp: 5800, rewards: { attributes: { spiritualPower: 8, comprehension: 3 }, derivedAttributes: { mana: 1200, magicalDefense: 105 } } }
    ]
  },
  {
    id: 'unity_dao',
    name: '合道期',
    description: '与道合一，超凡入圣',
    levels: [
      { id: 'unity_dao_1', name: '合道一层', description: '初悟大道', requiredExp: 6500, rewards: { attributes: { spiritualPower: 8, comprehension: 3 }, derivedAttributes: { mana: 1350, magicalDefense: 120 } } },
      { id: 'unity_dao_2', name: '合道二层', description: '道法渐成', requiredExp: 7200, rewards: { attributes: { spiritualPower: 8, comprehension: 3 }, derivedAttributes: { mana: 1500, magicalDefense: 135 } } },
      { id: 'unity_dao_3', name: '合道三层', description: '道法大成', requiredExp: 7900, rewards: { attributes: { spiritualPower: 8, comprehension: 3 }, derivedAttributes: { mana: 1650, magicalDefense: 150 } } },
      { id: 'unity_dao_4', name: '合道四层', description: '道法圆满', requiredExp: 8600, rewards: { attributes: { spiritualPower: 8, comprehension: 3 }, derivedAttributes: { mana: 1800, magicalDefense: 165 } } },
      { id: 'unity_dao_5', name: '合道五层', description: '合道期圆满', requiredExp: 9300, rewards: { attributes: { spiritualPower: 10, comprehension: 5 }, derivedAttributes: { mana: 2000, magicalDefense: 180 } } }
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
      { id: 'body_tempering_1', name: '淬体一层', description: '初步强化肌肉', requiredExp: 100, rewards: { attributes: { constitution: 1 }, derivedAttributes: { health: 20, physicalDefense: 2 } } },
      { id: 'body_tempering_2', name: '淬体二层', description: '骨骼开始强化', requiredExp: 120, rewards: { attributes: { constitution: 1 }, derivedAttributes: { health: 25, physicalDefense: 3 } } },
      { id: 'body_tempering_3', name: '淬体三层', description: '筋骨齐鸣', requiredExp: 140, rewards: { attributes: { constitution: 1 }, derivedAttributes: { health: 30, physicalDefense: 4 } } },
      { id: 'body_tempering_4', name: '淬体四层', description: '血肉强韧', requiredExp: 160, rewards: { attributes: { constitution: 1 }, derivedAttributes: { health: 35, physicalDefense: 5 } } },
      { id: 'body_tempering_5', name: '淬体五层', description: '淬体期圆满', requiredExp: 180, rewards: { attributes: { constitution: 2 }, derivedAttributes: { health: 40, physicalDefense: 6, divineStrength: 10 } } }
    ]
  },
  {
    id: 'body_forging',
    name: '锻体期',
    description: '深度锻造肉身，脱胎换骨',
    levels: [
      { id: 'body_forging_1', name: '锻体一层', description: '肉身如铁', requiredExp: 220, rewards: { attributes: { constitution: 2 }, derivedAttributes: { health: 50, physicalDefense: 8 } } },
      { id: 'body_forging_2', name: '锻体二层', description: '铜皮铁骨', requiredExp: 260, rewards: { attributes: { constitution: 2 }, derivedAttributes: { health: 60, physicalDefense: 10 } } },
      { id: 'body_forging_3', name: '锻体三层', description: '金刚不坏', requiredExp: 300, rewards: { attributes: { constitution: 2 }, derivedAttributes: { health: 70, physicalDefense: 12 } } },
      { id: 'body_forging_4', name: '锻体四层', description: '钢筋铁骨', requiredExp: 340, rewards: { attributes: { constitution: 2 }, derivedAttributes: { health: 80, physicalDefense: 14 } } },
      { id: 'body_forging_5', name: '锻体五层', description: '锻体期圆满', requiredExp: 380, rewards: { attributes: { constitution: 3 }, derivedAttributes: { health: 90, physicalDefense: 16, divineStrength: 15 } } }
    ]
  },
  {
    id: 'bone_refining',
    name: '炼骨期',
    description: '炼化骨髓，重塑根基',
    levels: [
      { id: 'bone_refining_1', name: '炼骨一层', description: '骨髓初炼', requiredExp: 450, rewards: { attributes: { constitution: 3 }, derivedAttributes: { health: 110, physicalDefense: 20 } } },
      { id: 'bone_refining_2', name: '炼骨二层', description: '骨质如玉', requiredExp: 520, rewards: { attributes: { constitution: 3 }, derivedAttributes: { health: 130, physicalDefense: 24 } } },
      { id: 'bone_refining_3', name: '炼骨三层', description: '骨髓重生', requiredExp: 590, rewards: { attributes: { constitution: 3 }, derivedAttributes: { health: 150, physicalDefense: 28 } } },
      { id: 'bone_refining_4', name: '炼骨四层', description: '骨坚如钢', requiredExp: 660, rewards: { attributes: { constitution: 3 }, derivedAttributes: { health: 170, physicalDefense: 32 } } },
      { id: 'bone_refining_5', name: '炼骨五层', description: '炼骨期圆满', requiredExp: 730, rewards: { attributes: { constitution: 4 }, derivedAttributes: { health: 200, physicalDefense: 36, divineStrength: 20 } } }
    ]
  },
  {
    id: 'blood_transformation',
    name: '换血期',
    description: '脱胎换骨，血脉重生',
    levels: [
      { id: 'blood_transformation_1', name: '换血一层', description: '血液初变', requiredExp: 850, rewards: { attributes: { constitution: 4 }, derivedAttributes: { health: 240, physicalDefense: 42 } } },
      { id: 'blood_transformation_2', name: '换血二层', description: '血脉觉醒', requiredExp: 970, rewards: { attributes: { constitution: 4 }, derivedAttributes: { health: 280, physicalDefense: 48 } } },
      { id: 'blood_transformation_3', name: '换血三层', description: '血气如虹', requiredExp: 1090, rewards: { attributes: { constitution: 4 }, derivedAttributes: { health: 320, physicalDefense: 54 } } },
      { id: 'blood_transformation_4', name: '换血四层', description: '血脉纯净', requiredExp: 1210, rewards: { attributes: { constitution: 4 }, derivedAttributes: { health: 360, physicalDefense: 60 } } },
      { id: 'blood_transformation_5', name: '换血五层', description: '换血期圆满', requiredExp: 1330, rewards: { attributes: { constitution: 5 }, derivedAttributes: { health: 400, physicalDefense: 66, divineStrength: 30 } } }
    ]
  },
  {
    id: 'muscle_transformation',
    name: '易筋期',
    description: '改造筋脉，重塑肌理',
    levels: [
      { id: 'muscle_transformation_1', name: '易筋一层', description: '筋脉初变', requiredExp: 1500, rewards: { attributes: { constitution: 5 }, derivedAttributes: { health: 480, physicalDefense: 75 } } },
      { id: 'muscle_transformation_2', name: '易筋二层', description: '筋脉重塑', requiredExp: 1700, rewards: { attributes: { constitution: 5 }, derivedAttributes: { health: 560, physicalDefense: 84 } } },
      { id: 'muscle_transformation_3', name: '易筋三层', description: '筋脉如龙', requiredExp: 1900, rewards: { attributes: { constitution: 5 }, derivedAttributes: { health: 640, physicalDefense: 93 } } },
      { id: 'muscle_transformation_4', name: '易筋四层', description: '筋脉通神', requiredExp: 2100, rewards: { attributes: { constitution: 5 }, derivedAttributes: { health: 720, physicalDefense: 102 } } },
      { id: 'muscle_transformation_5', name: '易筋五层', description: '易筋期圆满', requiredExp: 2300, rewards: { attributes: { constitution: 6 }, derivedAttributes: { health: 800, physicalDefense: 111, divineStrength: 40 } } }
    ]
  },
  {
    id: 'marrow_cleansing',
    name: '洗髓期',
    description: '洗涤骨髓，净化本源',
    levels: [
      { id: 'marrow_cleansing_1', name: '洗髓一层', description: '髓质初净', requiredExp: 2600, rewards: { attributes: { constitution: 6 }, derivedAttributes: { health: 920, physicalDefense: 125 } } },
      { id: 'marrow_cleansing_2', name: '洗髓二层', description: '髓质如玉', requiredExp: 2900, rewards: { attributes: { constitution: 6 }, derivedAttributes: { health: 1040, physicalDefense: 139 } } },
      { id: 'marrow_cleansing_3', name: '洗髓三层', description: '髓质通透', requiredExp: 3200, rewards: { attributes: { constitution: 6 }, derivedAttributes: { health: 1160, physicalDefense: 153 } } },
      { id: 'marrow_cleansing_4', name: '洗髓四层', description: '髓质无垢', requiredExp: 3500, rewards: { attributes: { constitution: 6 }, derivedAttributes: { health: 1280, physicalDefense: 167 } } },
      { id: 'marrow_cleansing_5', name: '洗髓五层', description: '洗髓期圆满', requiredExp: 3800, rewards: { attributes: { constitution: 7 }, derivedAttributes: { health: 1400, physicalDefense: 181, divineStrength: 50 } } }
    ]
  },
  {
    id: 'divine_body',
    name: '神体期',
    description: '肉身成神，不朽不灭',
    levels: [
      { id: 'divine_body_1', name: '神体一层', description: '初入神体', requiredExp: 4200, rewards: { attributes: { constitution: 7 }, derivedAttributes: { health: 1600, physicalDefense: 200 } } },
      { id: 'divine_body_2', name: '神体二层', description: '神体小成', requiredExp: 4600, rewards: { attributes: { constitution: 7 }, derivedAttributes: { health: 1800, physicalDefense: 219 } } },
      { id: 'divine_body_3', name: '神体三层', description: '神体大成', requiredExp: 5000, rewards: { attributes: { constitution: 7 }, derivedAttributes: { health: 2000, physicalDefense: 238 } } },
      { id: 'divine_body_4', name: '神体四层', description: '神体圆满', requiredExp: 5400, rewards: { attributes: { constitution: 7 }, derivedAttributes: { health: 2200, physicalDefense: 257 } } },
      { id: 'divine_body_5', name: '神体五层', description: '神体期圆满', requiredExp: 5800, rewards: { attributes: { constitution: 8 }, derivedAttributes: { health: 2400, physicalDefense: 276, divineStrength: 60 } } }
    ]
  },
  {
    id: 'immortal_body',
    name: '仙体期',
    description: '超凡入圣，肉身不朽',
    levels: [
      { id: 'immortal_body_1', name: '仙体一层', description: '初入仙体', requiredExp: 6500, rewards: { attributes: { constitution: 8 }, derivedAttributes: { health: 2700, physicalDefense: 300 } } },
      { id: 'immortal_body_2', name: '仙体二层', description: '仙体渐成', requiredExp: 7200, rewards: { attributes: { constitution: 8 }, derivedAttributes: { health: 3000, physicalDefense: 324 } } },
      { id: 'immortal_body_3', name: '仙体三层', description: '仙体大成', requiredExp: 7900, rewards: { attributes: { constitution: 8 }, derivedAttributes: { health: 3300, physicalDefense: 348 } } },
      { id: 'immortal_body_4', name: '仙体四层', description: '仙体圆满', requiredExp: 8600, rewards: { attributes: { constitution: 8 }, derivedAttributes: { health: 3600, physicalDefense: 372 } } },
      { id: 'immortal_body_5', name: '仙体五层', description: '仙体期圆满', requiredExp: 9300, rewards: { attributes: { constitution: 10 }, derivedAttributes: { health: 4000, physicalDefense: 400, divineStrength: 80 } } }
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

// 获取等级对应的名称
export function getCultivationLevelName(level: number, realms: CultivationRealm[]): string {
  const levelInfo = getCultivationLevelInfo(level, realms)
  if (levelInfo.levelInfo) {
    return levelInfo.levelInfo.name
  }
  return '未知境界'
}

// 检查是否达到指定等级要求（练气或炼体其中一个达到即可）
export function meetsLevelRequirement(
  requiredLevel: number,
  qiLevel: number,
  bodyLevel: number
): boolean {
  // 将探险区域等级转换为修炼等级（探险区域等级从1开始，修炼等级从0开始）
  const cultivationLevel = requiredLevel - 1
  return qiLevel >= cultivationLevel || bodyLevel >= cultivationLevel
}

// 获取等级要求的显示文本
export function getLevelRequirementText(requiredLevel: number): string {
  // 将探险区域等级转换为修炼等级（探险区域等级从1开始，修炼等级从0开始）
  const cultivationLevel = requiredLevel - 1

  // 获取练气和炼体等级名称
  const qiLevelName = getCultivationLevelName(cultivationLevel, QI_CULTIVATION_REALMS)
  const bodyLevelName = getCultivationLevelName(cultivationLevel, BODY_CULTIVATION_REALMS)

  // 如果两个等级名称都存在且不同，则用"或"连接
  if (qiLevelName !== '未知境界' && bodyLevelName !== '未知境界') {
    if (qiLevelName === bodyLevelName) {
      return qiLevelName
    } else {
      return `${qiLevelName} 或 ${bodyLevelName}`
    }
  }

  // 如果只有一个等级名称存在
  if (qiLevelName !== '未知境界') {
    return qiLevelName
  }

  if (bodyLevelName !== '未知境界') {
    return bodyLevelName
  }

  return `Lv.${requiredLevel}`
}
