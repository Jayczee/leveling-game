export default defineNuxtRouteMiddleware((to, from) => {
  // 只在客户端执行
  if (process.server) return

  const characterStore = useCharacterStore()
  
  // 检查是否有角色数据
  if (!characterStore.character) {
    return navigateTo('/')
  }
})
