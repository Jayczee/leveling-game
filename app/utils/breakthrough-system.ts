// 突破系统类型定义和核心逻辑

export interface BreakthroughCondition {
  // 必要条件
  required: {
    // 练气突破条件：悟道总等级
    enlightenmentTotalLevel?: number
    // 炼体突破条件：神通等级总和
    divinePowerTotalLevel?: number
    // 高等级额外条件：最高悟道等级要求
    highestEnlightenmentLevel?: number
  }
  
  // 可选条件（提升成功率）
  optional: {
    // 额外悟道总等级条件
    enlightenmentTotalLevel?: {
      level: number  // 更高的悟道总等级
      successRateBonus: number  // 成功率加成（百分比）
    }
    // 额外神通条件
    divinePowerTotalLevel?: {
      level: number  // 更高的神通等级总和
      successRateBonus: number  // 成功率加成（百分比）
    }
    // 额外最高悟道等级条件
    highestEnlightenmentLevel?: {
      level: number  // 更高的最高悟道等级要求
      successRateBonus: number  // 成功率加成（百分比）
    }
  }
}

export interface RealmBreakthroughConfig {
  fromRealmId: string  // 当前境界ID
  toRealmId: string    // 下一境界ID
  baseSuccessRate: number  // 基础成功率（0-1）
  cultivationType: 'qi' | 'body'  // 修炼类型
  conditions: BreakthroughCondition
  // 突破失败惩罚
  failurePenalty?: {
    resourceLoss: number  // 资源损失百分比（0-1）
  }
  // 突破成功奖励
  successReward?: {
    // 可以在这里添加突破成功的额外奖励
    message?: string
  }
}

// 突破结果
export interface BreakthroughResult {
  success: boolean
  finalSuccessRate: number  // 最终成功率
  conditionsMet: {
    requiredConditions: boolean
    optionalBonuses: number  // 可选条件提供的成功率加成
  }
  rewards?: any[]
  penalties?: any[]
  message: string
}

// 各大境界突破配置
export const BREAKTHROUGH_CONFIGS: Record<string, RealmBreakthroughConfig> = {
  // ===== 练气突破配置 =====
  // 聚气期 → 炼气期
  QI_GATHERING_TO_REFINING: {
    fromRealmId: 'qi_gathering',
    toRealmId: 'qi_refining', 
    cultivationType: 'qi',
    baseSuccessRate: 0.95,
    conditions: {
      required: {
        enlightenmentTotalLevel: 3  // 悟道总等级达到3级
      },
      optional: {
        enlightenmentTotalLevel: {
          level: 8,  // 悟道总等级8级
          successRateBonus: 3  // 额外3%成功率
        }
      }
    }
  },

  // 炼气期 → 筑基期
  QI_REFINING_TO_FOUNDATION: {
    fromRealmId: 'qi_refining',
    toRealmId: 'foundation_building',
    cultivationType: 'qi', 
    baseSuccessRate: 0.85,
    conditions: {
      required: {
        enlightenmentTotalLevel: 8  // 悟道总等级达到8级
      },
      optional: {
        enlightenmentTotalLevel: {
          level: 15,  // 悟道总等级15级
          successRateBonus: 5  // 额外5%成功率
        }
      }
    }
  },

  // 筑基期 → 金丹期
  FOUNDATION_TO_GOLDEN_CORE: {
    fromRealmId: 'foundation_building',
    toRealmId: 'golden_core',
    cultivationType: 'qi',
    baseSuccessRate: 0.75,
    conditions: {
      required: {
        enlightenmentTotalLevel: 15  // 悟道总等级达到15级
      },
      optional: {
        enlightenmentTotalLevel: {
          level: 25,  // 悟道总等级25级
          successRateBonus: 8  // 额外8%成功率
        }
      }
    }
  },

  // 金丹期 → 元婴期
  GOLDEN_CORE_TO_NASCENT_SOUL: {
    fromRealmId: 'golden_core',
    toRealmId: 'nascent_soul',
    cultivationType: 'qi',
    baseSuccessRate: 0.65,
    conditions: {
      required: {
        enlightenmentTotalLevel: 25,  // 悟道总等级达到25级
        highestEnlightenmentLevel: 8  // 最高道等级达到8级
      },
      optional: {
        enlightenmentTotalLevel: {
          level: 40,  // 悟道总等级40级
          successRateBonus: 8  // 额外8%成功率
        },
        highestEnlightenmentLevel: {
          level: 12,  // 最高道等级12级
          successRateBonus: 5  // 额外5%成功率
        }
      }
    }
  },

  // 元婴期 → 化神期
  NASCENT_SOUL_TO_SOUL_TRANSFORMATION: {
    fromRealmId: 'nascent_soul',
    toRealmId: 'soul_transformation',
    cultivationType: 'qi',
    baseSuccessRate: 0.55,
    conditions: {
      required: {
        enlightenmentTotalLevel: 40,  // 悟道总等级达到40级
        highestEnlightenmentLevel: 12  // 最高道等级达到12级
      },
      optional: {
        enlightenmentTotalLevel: {
          level: 60,  // 悟道总等级60级
          successRateBonus: 10  // 额外10%成功率
        },
        highestEnlightenmentLevel: {
          level: 18,  // 最高道等级18级
          successRateBonus: 7  // 额外7%成功率
        }
      }
    }
  },

  // 化神期 → 炼虚期
  SOUL_TRANSFORMATION_TO_VOID_REFINEMENT: {
    fromRealmId: 'soul_transformation',
    toRealmId: 'void_refinement',
    cultivationType: 'qi',
    baseSuccessRate: 0.45,
    conditions: {
      required: {
        enlightenmentTotalLevel: 60,  // 悟道总等级达到60级
        highestEnlightenmentLevel: 18  // 最高道等级达到18级
      },
      optional: {
        enlightenmentTotalLevel: {
          level: 90,  // 悟道总等级90级
          successRateBonus: 12  // 额外12%成功率
        },
        highestEnlightenmentLevel: {
          level: 25,  // 最高道等级25级
          successRateBonus: 8  // 额外8%成功率
        }
      }
    }
  },

  // 炼虚期 → 合道期
  VOID_REFINEMENT_TO_UNITY_DAO: {
    fromRealmId: 'void_refinement',
    toRealmId: 'unity_dao',
    cultivationType: 'qi',
    baseSuccessRate: 0.35,
    conditions: {
      required: {
        enlightenmentTotalLevel: 90,  // 悟道总等级达到90级
        highestEnlightenmentLevel: 25  // 最高道等级达到25级
      },
      optional: {
        enlightenmentTotalLevel: {
          level: 140,  // 悟道总等级140级
          successRateBonus: 15  // 额外15%成功率
        },
        highestEnlightenmentLevel: {
          level: 35,  // 最高道等级35级
          successRateBonus: 10  // 额外10%成功率
        }
      }
    }
  },

  // ===== 炼体突破配置 =====
  // 淬体期 → 锻体期
  BODY_TEMPERING_TO_FORGING: {
    fromRealmId: 'body_tempering',
    toRealmId: 'body_forging',
    cultivationType: 'body',
    baseSuccessRate: 0.95,
    conditions: {
      required: {
        // 前期无神通要求，降低门槛
      },
      optional: {
        divinePowerTotalLevel: {
          level: 3,  // 神通等级总和3级
          successRateBonus: 10  // 额外10%成功率
        }
      }
    }
  },

  // 锻体期 → 炼骨期
  BODY_FORGING_TO_BONE_REFINING: {
    fromRealmId: 'body_forging',
    toRealmId: 'bone_refining',
    cultivationType: 'body',
    baseSuccessRate: 0.85,
    conditions: {
      required: {
        // 前期无神通要求，降低门槛
      },
      optional: {
        divinePowerTotalLevel: {
          level: 5,  // 神通等级总和5级
          successRateBonus: 10  // 额外10%成功率
        }
      }
    }
  },

  // 炼骨期 → 换血期
  BONE_REFINING_TO_BLOOD_TRANSFORMATION: {
    fromRealmId: 'bone_refining',
    toRealmId: 'blood_transformation',
    cultivationType: 'body',
    baseSuccessRate: 0.75,
    conditions: {
      required: {
        divinePowerTotalLevel: 8  // 开始需要神通等级总和8级
      },
      optional: {
        divinePowerTotalLevel: {
          level: 15,  // 神通等级总和15级
          successRateBonus: 12  // 额外12%成功率
        }
      }
    }
  },

  // 换血期 → 易筋期
  BLOOD_TRANSFORMATION_TO_MUSCLE_TRANSFORMATION: {
    fromRealmId: 'blood_transformation',
    toRealmId: 'muscle_transformation',
    cultivationType: 'body',
    baseSuccessRate: 0.65,
    conditions: {
      required: {
        divinePowerTotalLevel: 15  // 神通等级总和至少15级
      },
      optional: {
        divinePowerTotalLevel: {
          level: 25,  // 神通等级总和25级
          successRateBonus: 12  // 额外12%成功率
        }
      }
    }
  },

  // 易筋期 → 洗髓期
  MUSCLE_TRANSFORMATION_TO_MARROW_CLEANSING: {
    fromRealmId: 'muscle_transformation',
    toRealmId: 'marrow_cleansing',
    cultivationType: 'body',
    baseSuccessRate: 0.50,
    conditions: {
      required: {
        divinePowerTotalLevel: 35  // 神通等级总和至少35级
      },
      optional: {
        divinePowerTotalLevel: {
          level: 50,  // 神通等级总和50级
          successRateBonus: 15  // 额外15%成功率
        }
      }
    }
  },

  // 洗髓期 → 神体期
  MARROW_CLEANSING_TO_DIVINE_BODY: {
    fromRealmId: 'marrow_cleansing',
    toRealmId: 'divine_body',
    cultivationType: 'body',
    baseSuccessRate: 0.40,
    conditions: {
      required: {
        divinePowerTotalLevel: 50  // 神通等级总和至少50级
      },
      optional: {
        divinePowerTotalLevel: {
          level: 70,  // 神通等级总和70级
          successRateBonus: 18  // 额外18%成功率
        }
      }
    }
  },

  // 神体期 → 仙体期
  DIVINE_BODY_TO_IMMORTAL_BODY: {
    fromRealmId: 'divine_body',
    toRealmId: 'immortal_body',
    cultivationType: 'body',
    baseSuccessRate: 0.30,
    conditions: {
      required: {
        divinePowerTotalLevel: 70  // 神通等级总和至少70级
      },
      optional: {
        divinePowerTotalLevel: {
          level: 100,  // 神通等级总和100级
          successRateBonus: 25  // 额外25%成功率
        }
      }
    }
  }
} as const

// 根据当前境界获取突破配置
export function getBreakthroughConfig(currentRealmId: string, cultivationType: 'qi' | 'body'): RealmBreakthroughConfig | null {
  // 查找匹配的突破配置
  const config = Object.values(BREAKTHROUGH_CONFIGS).find(
    config => config.fromRealmId === currentRealmId && config.cultivationType === cultivationType
  )
  
  return config || null
}

// 检查悟道条件
export function checkEnlightenmentConditions(
  enlightenmentPaths: Record<string, { level: number; experience: number }>,
  condition: { totalLevel: number } | { highestLevel: number }
): { met: boolean; details: string[] } {
  const details: string[] = []
  let met = false

  if ('totalLevel' in condition) {
    // 检查总等级
    let currentTotal = 0
    Object.entries(enlightenmentPaths).forEach(([pathId, pathData]) => {
      currentTotal += pathData.level
      const pathName = getPathDisplayName(pathId)
      details.push(`${pathName}：${pathData.level}级`)
    })

    met = currentTotal >= condition.totalLevel
    const summary = `悟道总等级需要${condition.totalLevel}级，当前：${currentTotal}级`
    details.unshift(summary)
  } else if ('highestLevel' in condition) {
    // 检查最高等级
    let highestLevel = 0
    let highestPathName = ''
    Object.entries(enlightenmentPaths).forEach(([pathId, pathData]) => {
      const pathName = getPathDisplayName(pathId)
      details.push(`${pathName}：${pathData.level}级`)
      if (pathData.level > highestLevel) {
        highestLevel = pathData.level
        highestPathName = pathName
      }
    })

    met = highestLevel >= condition.highestLevel
    const summary = `最高悟道等级需要${condition.highestLevel}级，当前最高：${highestPathName} ${highestLevel}级`
    details.unshift(summary)
  }

  return { met, details }
}

// 检查神通条件
export function checkDivinePowerConditions(
  divinePowers: { owned: string[]; levels: Record<string, number> },
  requiredTotalLevel: number
): { met: boolean; currentTotal: number; details: string[] } {
  let currentTotal = 0
  const details: string[] = []

  divinePowers.owned.forEach(powerId => {
    const level = divinePowers.levels[powerId] || 0
    currentTotal += level
    const powerName = getDivinePowerDisplayName(powerId)
    details.push(`${powerName}：${level}级`)
  })

  const met = currentTotal >= requiredTotalLevel
  const summary = `神通等级总和需要${requiredTotalLevel}级，当前：${currentTotal}级`
  details.unshift(summary)

  return { met, currentTotal, details }
}

// 计算突破成功率
export function calculateBreakthroughSuccessRate(
  config: RealmBreakthroughConfig,
  enlightenmentPaths: Record<string, { level: number; experience: number }>,
  divinePowers: { owned: string[]; levels: Record<string, number> }
): { finalRate: number; optionalBonus: number; breakdown: string[] } {
  let finalRate = config.baseSuccessRate * 100 // 转换为百分比
  let optionalBonus = 0
  const breakdown: string[] = []

  breakdown.push(`基础成功率：${finalRate}%`)

  // 检查可选条件加成 - 练气修炼
  if (config.cultivationType === 'qi') {
    // 悟道总等级可选条件
    if (config.conditions.optional.enlightenmentTotalLevel) {
      const optionalCondition = config.conditions.optional.enlightenmentTotalLevel
      const check = checkEnlightenmentConditions(enlightenmentPaths, {
        totalLevel: optionalCondition.level
      })
      
      if (check.met) {
        optionalBonus += optionalCondition.successRateBonus
        breakdown.push(`可选悟道总等级条件加成：+${optionalCondition.successRateBonus}%`)
      }
    }

    // 最高悟道等级可选条件
    if (config.conditions.optional.highestEnlightenmentLevel) {
      const optionalCondition = config.conditions.optional.highestEnlightenmentLevel
      const check = checkEnlightenmentConditions(enlightenmentPaths, {
        highestLevel: optionalCondition.level
      })
      
      if (check.met) {
        optionalBonus += optionalCondition.successRateBonus
        breakdown.push(`可选最高悟道等级条件加成：+${optionalCondition.successRateBonus}%`)
      }
    }
  }

  // 检查可选条件加成 - 炼体修炼
  if (config.cultivationType === 'body') {
    if (config.conditions.optional.divinePowerTotalLevel) {
      const optionalCondition = config.conditions.optional.divinePowerTotalLevel
      const check = checkDivinePowerConditions(divinePowers, optionalCondition.level)
      
      if (check.met) {
        optionalBonus += optionalCondition.successRateBonus
        breakdown.push(`可选神通条件加成：+${optionalCondition.successRateBonus}%`)
      }
    }
  }

  finalRate += optionalBonus
  finalRate = Math.min(finalRate, 100) // 成功率不能超过100%

  if (optionalBonus > 0) {
    breakdown.push(`最终成功率：${finalRate}%`)
  }

  return { finalRate, optionalBonus, breakdown }
}

// 检查是否满足突破条件
export function checkBreakthroughConditions(
  config: RealmBreakthroughConfig,
  enlightenmentPaths: Record<string, { level: number; experience: number }>,
  divinePowers: { owned: string[]; levels: Record<string, number> }
): { canBreakthrough: boolean; details: { required: string[]; optional: string[] } } {
  let canBreakthrough = true
  const requiredDetails: string[] = []
  const optionalDetails: string[] = []

  // 检查必要条件 - 练气修炼
  if (config.cultivationType === 'qi') {
    // 悟道总等级必要条件
    if (config.conditions.required.enlightenmentTotalLevel) {
      const condition = config.conditions.required.enlightenmentTotalLevel
      const check = checkEnlightenmentConditions(enlightenmentPaths, { totalLevel: condition })
      requiredDetails.push(...check.details)
      if (!check.met) {
        canBreakthrough = false
      }
    }

    // 最高悟道等级必要条件
    if (config.conditions.required.highestEnlightenmentLevel) {
      const condition = config.conditions.required.highestEnlightenmentLevel
      const check = checkEnlightenmentConditions(enlightenmentPaths, { highestLevel: condition })
      requiredDetails.push(...check.details)
      if (!check.met) {
        canBreakthrough = false
      }
    }
  }

  // 检查必要条件 - 炼体修炼
  if (config.cultivationType === 'body') {
    if (config.conditions.required.divinePowerTotalLevel) {
      const condition = config.conditions.required.divinePowerTotalLevel
      const check = checkDivinePowerConditions(divinePowers, condition)
      requiredDetails.push(...check.details)
      if (!check.met) {
        canBreakthrough = false
      }
    }
  }

  // 检查可选条件（仅显示，不影响是否能突破）- 练气修炼
  if (config.cultivationType === 'qi') {
    // 悟道总等级可选条件
    if (config.conditions.optional.enlightenmentTotalLevel) {
      const condition = config.conditions.optional.enlightenmentTotalLevel
      const check = checkEnlightenmentConditions(enlightenmentPaths, { totalLevel: condition.level })
      optionalDetails.push(`可选条件（+${condition.successRateBonus}%成功率）：`)
      optionalDetails.push(...check.details)
    }

    // 最高悟道等级可选条件
    if (config.conditions.optional.highestEnlightenmentLevel) {
      const condition = config.conditions.optional.highestEnlightenmentLevel
      const check = checkEnlightenmentConditions(enlightenmentPaths, { highestLevel: condition.level })
      optionalDetails.push(`可选条件（+${condition.successRateBonus}%成功率）：`)
      optionalDetails.push(...check.details)
    }
  }

  // 检查可选条件 - 炼体修炼
  if (config.cultivationType === 'body') {
    if (config.conditions.optional.divinePowerTotalLevel) {
      const condition = config.conditions.optional.divinePowerTotalLevel
      const check = checkDivinePowerConditions(divinePowers, condition.level)
      optionalDetails.push(`可选条件（+${condition.successRateBonus}%成功率）：`)
      optionalDetails.push(...check.details)
    }
  }

  return {
    canBreakthrough,
    details: {
      required: requiredDetails,
      optional: optionalDetails
    }
  }
}

// 执行突破尝试
export function attemptBreakthrough(
  config: RealmBreakthroughConfig,
  enlightenmentPaths: Record<string, { level: number; experience: number }>,
  divinePowers: { owned: string[]; levels: Record<string, number> }
): BreakthroughResult {
  // 检查突破条件
  const conditionCheck = checkBreakthroughConditions(config, enlightenmentPaths, divinePowers)
  
  if (!conditionCheck.canBreakthrough) {
    return {
      success: false,
      finalSuccessRate: 0,
      conditionsMet: {
        requiredConditions: false,
        optionalBonuses: 0
      },
      message: '不满足突破必要条件！'
    }
  }

  // 计算成功率
  const successRateCalc = calculateBreakthroughSuccessRate(config, enlightenmentPaths, divinePowers)
  
  // 进行突破判定
  const random = Math.random() * 100
  const success = random < successRateCalc.finalRate

  return {
    success,
    finalSuccessRate: successRateCalc.finalRate,
    conditionsMet: {
      requiredConditions: true,
      optionalBonuses: successRateCalc.optionalBonus
    },
    message: success 
      ? `突破成功！恭喜进入${getRealmDisplayName(config.toRealmId)}！` 
      : `突破失败，请继续修炼！（成功率：${successRateCalc.finalRate.toFixed(1)}%）`
  }
}

// 工具函数：获取道路显示名称
function getPathDisplayName(pathId: string): string {
  const pathNames: Record<string, string> = {
    metal: '金之道',
    wood: '木之道', 
    water: '水之道',
    fire: '火之道',
    earth: '土之道',
    time: '时间之道',
    space: '空间之道'
  }
  return pathNames[pathId] || pathId
}

// 工具函数：获取神通显示名称
function getDivinePowerDisplayName(powerId: string): string {
  const powerNames: Record<string, string> = {
    IRON_BONE: '铁骨神通',
    GOLDEN_BODY: '金身护体',
    DIVINE_STRENGTH: '神力通天',
    VAJRA_BODY: '金刚不坏',
    IMMORTAL_FLESH: '不死血肉',
    DRAGON_ELEPHANT_POWER: '龙象般若'
  }
  return powerNames[powerId] || powerId
}

// 工具函数：获取境界显示名称
function getRealmDisplayName(realmId: string): string {
  const realmNames: Record<string, string> = {
    qi_gathering: '聚气期',
    qi_refining: '炼气期',
    foundation_building: '筑基期',
    golden_core: '金丹期',
    nascent_soul: '元婴期',
    soul_transformation: '化神期',
    void_refinement: '炼虚期',
    unity_dao: '合道期',
    body_tempering: '淬体期',
    body_forging: '锻体期',
    bone_refining: '炼骨期',
    blood_transformation: '换血期',
    muscle_transformation: '易筋期',
    marrow_cleansing: '洗髓期',
    divine_body: '神体期',
    immortal_body: '仙体期'
  }
  return realmNames[realmId] || realmId
}