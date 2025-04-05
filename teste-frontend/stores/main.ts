// stores/useStore.ts
export const useStore = defineStore('main', () => {
  const phrases = ref<string[]>([])

  const addPhrase = (newPhrase: string) => {
    if (newPhrase.trim()) {
      phrases.value.push(newPhrase)
    }
  }

  return { phrases, addPhrase }
}, {
  persist: {
    storage: typeof window !== 'undefined' ? localStorage : undefined,
    key: 'phrases-local',
  }
})
