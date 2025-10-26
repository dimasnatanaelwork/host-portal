import { ref } from 'vue'

export function usePagination(initialPage = 1, initialLastPage: number | null = null) {
  const currentPage = ref<number | null>(initialPage)
  const lastPage = ref<number | null>(initialLastPage)

  function onPageClick(page: number) {
    currentPage.value = page
  }

  function onPressNextPage() {
    if (currentPage.value && lastPage.value && currentPage.value < lastPage.value) {
      currentPage.value += 1
    }
  }

  function onPressPrevPage() {
    if (currentPage.value && currentPage.value > 1) {
      currentPage.value -= 1
    }
  }

  return {
    currentPage,
    lastPage,
    onPageClick,
    onPressNextPage,
    onPressPrevPage,
  }
}
