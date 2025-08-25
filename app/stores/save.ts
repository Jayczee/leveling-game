import { defineStore } from 'pinia'
import type { Character } from './character'
import { GAME_CONFIG } from '~/utils/constants'

export interface SaveData {
  id: string
  name: string
  character: Character
  createdAt: number
  lastPlayedAt: number
  playTime: number
}

export const useSaveStore = defineStore('save', {
  state: () => ({
    saves: [] as SaveData[],
    currentSaveId: null as string | null
  }),

  getters: {
    // 获取当前存档
    currentSave: (state) => {
      if (!state.currentSaveId) return null
      return state.saves.find(save => save.id === state.currentSaveId) || null
    },

    // 获取存档列表（按最后游戏时间排序）
    sortedSaves: (state) => {
      return [...state.saves].sort((a, b) => b.lastPlayedAt - a.lastPlayedAt)
    },

    // 检查是否可以创建新存档
    canCreateNewSave: (state) => {
      return state.saves.length < GAME_CONFIG.MAX_SAVE_SLOTS
    }
  },

  actions: {
    // 初始化存档系统
    async initSaveSystem() {
      await this.loadSaves()
    },

    // 创建新存档
    createSave(character: Character): string {
      if (!this.canCreateNewSave) {
        throw new Error(`最多只能创建 ${GAME_CONFIG.MAX_SAVE_SLOTS} 个存档`)
      }

      const saveId = Date.now().toString() + Math.random().toString(36).substring(2, 11)
      const now = Date.now()

      const saveData: SaveData = {
        id: saveId,
        name: character.name,
        character: JSON.parse(JSON.stringify(character)), // 深拷贝
        createdAt: now,
        lastPlayedAt: now,
        playTime: 0
      }

      this.saves.push(saveData)
      this.currentSaveId = saveId
      
      this.saveToDisk()
      return saveId
    },

    // 加载存档
    loadSave(saveId: string): Character | null {
      const save = this.saves.find(s => s.id === saveId)
      if (!save) return null

      this.currentSaveId = saveId
      save.lastPlayedAt = Date.now()
      this.saveToDisk()

      // 确保角色数据兼容性
      const character = JSON.parse(JSON.stringify(save.character)) // 深拷贝
      this.ensureCharacterCompatibility(character)

      return character
    },

    // 保存当前游戏状态
    saveCurrentGame(character: Character) {
      if (!this.currentSaveId) return false

      const save = this.saves.find(s => s.id === this.currentSaveId)
      if (!save) return false

      save.character = JSON.parse(JSON.stringify(character)) // 深拷贝
      save.lastPlayedAt = Date.now()
      save.playTime = character.stats.totalPlayTime

      this.saveToDisk()
      return true
    },

    // 删除存档
    deleteSave(saveId: string): boolean {
      const index = this.saves.findIndex(s => s.id === saveId)
      if (index === -1) return false

      this.saves.splice(index, 1)
      
      if (this.currentSaveId === saveId) {
        this.currentSaveId = null
      }

      this.saveToDisk()
      return true
    },

    // 重命名存档
    renameSave(saveId: string, newName: string): boolean {
      const save = this.saves.find(s => s.id === saveId)
      if (!save) return false

      save.name = newName
      save.character.name = newName
      this.saveToDisk()
      return true
    },

    // 导出存档
    exportSave(saveId: string): string | null {
      const save = this.saves.find(s => s.id === saveId)
      if (!save) return null

      return JSON.stringify(save, null, 2)
    },

    // 导入存档
    importSave(saveDataJson: string): boolean {
      try {
        const saveData = JSON.parse(saveDataJson) as SaveData
        
        // 验证存档数据格式
        if (!this.validateSaveData(saveData)) {
          throw new Error('存档数据格式无效')
        }

        // 检查是否已存在相同ID的存档
        const existingIndex = this.saves.findIndex(s => s.id === saveData.id)
        if (existingIndex > -1) {
          // 替换现有存档
          this.saves[existingIndex] = saveData
        } else {
          // 检查存档数量限制
          if (!this.canCreateNewSave) {
            throw new Error(`最多只能有 ${GAME_CONFIG.MAX_SAVE_SLOTS} 个存档`)
          }
          this.saves.push(saveData)
        }

        this.saveToDisk()
        return true
      } catch (error) {
        console.error('导入存档失败:', error)
        return false
      }
    },

    // 验证存档数据
    validateSaveData(saveData: any): saveData is SaveData {
      return (
        typeof saveData === 'object' &&
        typeof saveData.id === 'string' &&
        typeof saveData.name === 'string' &&
        typeof saveData.character === 'object' &&
        typeof saveData.createdAt === 'number' &&
        typeof saveData.lastPlayedAt === 'number' &&
        typeof saveData.playTime === 'number' &&
        // 验证角色数据结构
        typeof saveData.character.name === 'string' &&
        typeof saveData.character.gender === 'string' &&
        typeof saveData.character.talent === 'string' &&
        typeof saveData.character.attributes === 'object' &&
        typeof saveData.character.cultivation === 'object' &&
        typeof saveData.character.resources === 'object' &&
        typeof saveData.character.stats === 'object'
      )
    },

    // 保存到本地存储
    saveToDisk() {
      if (process.client) {
        try {
          localStorage.setItem('xiuxian-saves', JSON.stringify(this.saves))
        } catch (error) {
          console.error('保存存档到本地存储失败:', error)
        }
      }
    },

    // 从本地存储加载
    async loadSaves() {
      if (process.client) {
        try {
          const savedData = localStorage.getItem('xiuxian-saves')
          if (savedData) {
            const saves = JSON.parse(savedData)
            if (Array.isArray(saves)) {
              this.saves = saves.filter(save => this.validateSaveData(save))
            }
          }
        } catch (error) {
          console.error('从本地存储加载存档失败:', error)
          this.saves = []
        }
      }
    },

    // 清除所有存档
    clearAllSaves() {
      this.saves = []
      this.currentSaveId = null
      this.saveToDisk()
    },

    // 确保角色数据兼容性
    ensureCharacterCompatibility(character: any) {
      // 确保装备字段存在
      if (!character.equipment) {
        character.equipment = {
          timeTreasure: null
        }
      }

      // 确保背包字段存在
      if (!character.inventory) {
        character.inventory = {
          timeTreasures: ['BRONZE_HOURGLASS', 'SILVER_CHRONOMETER'] // 为旧存档添加初始法宝
        }
      }
    },

    // 获取存档统计信息
    getSaveStats() {
      return {
        totalSaves: this.saves.length,
        maxSaves: GAME_CONFIG.MAX_SAVE_SLOTS,
        totalPlayTime: this.saves.reduce((total, save) => total + save.playTime, 0),
        oldestSave: this.saves.length > 0 ? Math.min(...this.saves.map(s => s.createdAt)) : 0,
        newestSave: this.saves.length > 0 ? Math.max(...this.saves.map(s => s.createdAt)) : 0
      }
    }
  }
})
