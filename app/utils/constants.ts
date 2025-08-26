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
