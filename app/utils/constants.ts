// 游戏常量配置

// 天赋系统
export const TALENTS = {
  SPIRITUAL_ROOT: {
    id: 'spiritual_root',
    name: '天灵根',
    description: '修炼速度提升50%，悟性+2',
    effects: {
      cultivationSpeed: 1.5,
      comprehension: 2
    }
  },
  IRON_BODY: {
    id: 'iron_body',
    name: '铁骨铮铮',
    description: '体质+3，炼体效率提升30%',
    effects: {
      constitution: 3,
      bodyTrainingSpeed: 1.3
    }
  },
  WISE_MIND: {
    id: 'wise_mind',
    name: '慧心通明',
    description: '悟性+3，突破几率提升20%',
    effects: {
      comprehension: 3,
      breakthroughChance: 1.2
    }
  },
  LUCKY_STAR: {
    id: 'lucky_star',
    name: '气运加身',
    description: '探险获得稀有物品几率提升33%',
    effects: {
      luckBonus: 1.33
    }
  }
} as const

// 修炼方向系统
export const CULTIVATION_PATHS = {
  QI_CULTIVATION: {
    id: 'qi_cultivation',
    name: '练气',
    description: '专注于灵气修炼，法术威力强大',
    effects: {
      spiritualQiEfficiency: 1.75,  // 灵气获得效率
      constitutionGrowthRate: 0.33  // 体质成长率
    }
  },
  BODY_CULTIVATION: {
    id: 'body_cultivation',
    name: '炼体',
    description: '专注于肉身修炼，体魄强健无比',
    effects: {
      constitutionGrowthRate: 1.5,   // 体质成长率
      spiritualQiEfficiency: 0.2    // 灵气获得效率
    }
  },
  DUAL_CULTIVATION: {
    id: 'dual_cultivation',
    name: '双修',
    description: '练气炼体并重，均衡发展',
    effects: {
      spiritualQiEfficiency: 0.75,  // 灵气获得效率
      constitutionGrowthRate: 0.75  // 体质成长率
    }
  }
} as const



// 修炼活动
export const ACTIVITIES = {
  MEDITATION: {
    id: 'meditation',
    name: '打坐静修',
    description: '吸纳天地灵气，提升修为',
    baseGain: 1,
    type: 'cultivation'
  },
  BODY_TRAINING: {
    id: 'body_training',
    name: '炼体修行',
    description: '锤炼肉身，增强体质',
    baseGain: 1,
    type: 'body'
  },
  EXPLORATION: {
    id: 'exploration',
    name: '外出探险',
    description: '探索未知区域，寻找机缘',
    baseGain: 0.5,
    type: 'adventure'
  }
} as const







// 时光法宝品质
export enum TimeTreasureQuality {
  COMMON = 'common',
  RARE = 'rare',
  EPIC = 'epic',
  LEGENDARY = 'legendary'
}

// 时光法宝配置
export interface TimeTreasure {
  id: string
  name: string
  description: string
  quality: TimeTreasureQuality
  speedMultiplier: number
  icon: string
}

// 时光法宝定义
export const TIME_TREASURES: Record<string, TimeTreasure> = {
  BRONZE_HOURGLASS: {
    id: 'bronze_hourglass',
    name: '青铜沙漏',
    description: '古老的青铜沙漏，能够加速修炼进程',
    quality: TimeTreasureQuality.COMMON,
    speedMultiplier: 1.5,
    icon: '⏳'
  },
  SILVER_CHRONOMETER: {
    id: 'silver_chronometer',
    name: '白银时计',
    description: '精致的白银时计，大幅提升修炼效率',
    quality: TimeTreasureQuality.RARE,
    speedMultiplier: 2.0,
    icon: '⏰'
  }
} as const

// 神通品质
export enum DivinePowerQuality {
  COMMON = 'common',
  RARE = 'rare',
  EPIC = 'epic',
  LEGENDARY = 'legendary'
}

// 神通配置接口
export interface DivinePower {
  id: string
  name: string
  description: string
  quality: DivinePowerQuality
  maxLevel: number
  baseUpgradeCost: number  // 基础升级消耗（灵晶）
  costMultiplier: number   // 每级消耗倍率
  effects: {
    health?: number        // 每级增加的生命值
    divineStrength?: number // 每级增加的神力
    physicalDefense?: number // 每级增加的物抗
    magicalDefense?: number  // 每级增加的法抗
  }
  icon: string
}

// 神通定义
export const DIVINE_POWERS: Record<string, DivinePower> = {
  IRON_BONE: {
    id: 'iron_bone',
    name: '铁骨神通',
    description: '炼化骨骼如铁，大幅提升物理防御力',
    quality: DivinePowerQuality.COMMON,
    maxLevel: 10,
    baseUpgradeCost: 50,
    costMultiplier: 1.5,
    effects: {
      physicalDefense: 15,
      health: 20
    },
    icon: '🦴'
  },
  GOLDEN_BODY: {
    id: 'golden_body',
    name: '金身护体',
    description: '修炼金身，肉身坚如金刚，提升生命值和双抗',
    quality: DivinePowerQuality.RARE,
    maxLevel: 8,
    baseUpgradeCost: 100,
    costMultiplier: 1.8,
    effects: {
      health: 50,
      physicalDefense: 10,
      magicalDefense: 10
    },
    icon: '✨'
  },
  DIVINE_STRENGTH: {
    id: 'divine_strength',
    name: '神力通天',
    description: '激发体内神力，大幅提升神力值',
    quality: DivinePowerQuality.RARE,
    maxLevel: 12,
    baseUpgradeCost: 80,
    costMultiplier: 1.6,
    effects: {
      divineStrength: 25,
      health: 15
    },
    icon: '💪'
  },
  VAJRA_BODY: {
    id: 'vajra_body',
    name: '金刚不坏',
    description: '修成金刚不坏之身，极大提升物理防御',
    quality: DivinePowerQuality.EPIC,
    maxLevel: 6,
    baseUpgradeCost: 200,
    costMultiplier: 2.0,
    effects: {
      physicalDefense: 30,
      health: 40,
      divineStrength: 10
    },
    icon: '🛡️'
  },
  IMMORTAL_FLESH: {
    id: 'immortal_flesh',
    name: '不死血肉',
    description: '血肉重生，生命力极其旺盛',
    quality: DivinePowerQuality.EPIC,
    maxLevel: 8,
    baseUpgradeCost: 150,
    costMultiplier: 1.9,
    effects: {
      health: 80,
      magicalDefense: 15
    },
    icon: '❤️'
  },
  DRAGON_ELEPHANT_POWER: {
    id: 'dragon_elephant_power',
    name: '龙象般若',
    description: '修炼龙象般若功，拥有龙象之力',
    quality: DivinePowerQuality.LEGENDARY,
    maxLevel: 5,
    baseUpgradeCost: 500,
    costMultiplier: 2.5,
    effects: {
      divineStrength: 50,
      health: 60,
      physicalDefense: 20,
      magicalDefense: 20
    },
    icon: '🐉'
  }
} as const

// 游戏配置
export const GAME_CONFIG = {
  // 基础属性点数
  INITIAL_ATTRIBUTE_POINTS: 10,

  // 挂机间隔（毫秒）
  IDLE_INTERVAL: 1000,

  // 探险时间（毫秒）
  EXPLORATION_TIME: 5000,

  // 存档数量限制
  MAX_SAVE_SLOTS: 5
} as const









// 悟道系统
export interface EnlightenmentPath {
  id: string
  name: string
  description: string
  icon: string
  maxLevel: number
  expPerLevel: number
  effects: {
    // 基础属性加成（每级百分比）
    constitution?: number
    spiritualPower?: number
    comprehension?: number
    physicalDefense?: number
    magicalDefense?: number
    health?: number
    mana?: number
    divineStrength?: number
    // 特殊效果（每级百分比）
    explorationTimeReduction?: number
    cultivationEfficiency?: number
  }
}

// 悟道之道定义
export const ENLIGHTENMENT_PATHS: Record<string, EnlightenmentPath> = {
  METAL: {
    id: 'metal',
    name: '金之道',
    description: '金主坚固，增强物理防御',
    icon: '⚔️',
    maxLevel: 100,
    expPerLevel: 10,
    effects: {
      physicalDefense: 0.5, // 每级增加0.5%物理防御
      mana: 5 // 每级增加5点法力值
    }
  },
  WOOD: {
    id: 'wood',
    name: '木之道',
    description: '木主生机，增强生命力',
    icon: '🌳',
    maxLevel: 100,
    expPerLevel: 10,
    effects: {
      health: 0.5, // 每级增加0.5%生命值
      mana: 5 // 每级增加5点法力值
    }
  },
  WATER: {
    id: 'water',
    name: '水之道',
    description: '水主柔韧，增强法术防御',
    icon: '💧',
    maxLevel: 100,
    expPerLevel: 10,
    effects: {
      magicalDefense: 0.5, // 每级增加0.5%法术防御
      mana: 5 // 每级增加5点法力值
    }
  },
  FIRE: {
    id: 'fire',
    name: '火之道',
    description: '火主炽热，增强法力',
    icon: '🔥',
    maxLevel: 100,
    expPerLevel: 10,
    effects: {
      // 火之道特殊：每级增加额外法力值
      mana: 5 // 每级增加5点法力值
    }
  },
  EARTH: {
    id: 'earth',
    name: '土之道',
    description: '土主厚重，增强神力',
    icon: '🏔️',
    maxLevel: 100,
    expPerLevel: 10,
    effects: {
      divineStrength: 0.5, // 每级增加0.5%神力
      mana: 5 // 每级增加5点法力值
    }
  },
  TIME: {
    id: 'time',
    name: '时间之道',
    description: '时间主流转，提升修炼效率',
    icon: '⏰',
    maxLevel: 100,
    expPerLevel: 10,
    effects: {
      cultivationEfficiency: 0.5, // 每级增加0.5%修炼效率
      mana: 5 // 每级增加5点法力值
    }
  },
  SPACE: {
    id: 'space',
    name: '空间之道',
    description: '空间主距离，减少探险时间',
    icon: '🌌',
    maxLevel: 100,
    expPerLevel: 10,
    effects: {
      explorationTimeReduction: 0.5, // 每级减少0.5%探险时间
      mana: 5 // 每级增加5点法力值
    }
  }
} as const

// 计算衍生属性
export function calculateDerivedAttributes(constitution: number, spiritualPower: number) {
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
