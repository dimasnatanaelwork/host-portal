<script lang="ts" setup>
import type { TableHeader } from '@/components/Table/Table.vue'
import Table from '@/components/Table/Table.vue'
import { usePagination } from '@/composables/usePagination'
import { onMounted, ref, watch } from 'vue'
import { useSubscription } from '@/composables/useSubscription'
import { useLoadingStore } from '@/stores/loadingStore'

const loadingStore = useLoadingStore()
const { loading, error, billingHistory, loadBillingHistory } = useSubscription()
watch(loading, (newLoadingStatus) => {
  loadingStore.setLoading(newLoadingStatus)
})

const { currentPage, lastPage, onPageClick, onPressNextPage, onPressPrevPage } = usePagination()

const billingHisHeader: TableHeader[] = [
  { label: 'Invoice #', key: 'uuid' },
  { label: 'Chatbot Name', key: 'name' },
  { label: 'Invoice Date', key: 'created_at', type: 'date' },
  { label: 'Due Date', key: 'payment_due_date', type: 'date' },
  { label: 'Amount', key: 'total_payment' },
  { label: 'Status', key: 'status', type: 'status' },
  { label: 'Payment Date', key: 'paid_at', type: 'date' },
  // {label: 'Download', key: ''} // invoice_url and receipt_url (show both when paid, show invoice when pending, other than that, show none)
]

onMounted(async () => {
  await loadBillingHistory(1)

  if (billingHistory.value) {
    currentPage.value = billingHistory.value.current_page
    lastPage.value = billingHistory.value.last_page
  }
})

watch(currentPage, async (newPage) => {
  if (newPage !== null) {
    await loadBillingHistory(newPage)
  }
})
</script>

<template>
  <Table
    :headers="billingHisHeader"
    :rows="billingHistory?.billings"
    noDataMsg="You currently have no billing history to display. Once you make a subscription or purchase, your billing details will appear here."
    :hasEdit="false"
    :hasView="false"
    :hasBroadcast="false"
    :hasSync="false"
    :hasDelete="false"
    :hasInvoiceActions="true"
    :currentPage="currentPage!"
    :lastPage="lastPage!"
    @click-page="onPageClick"
    @next-page="onPressNextPage"
    @prev-page="onPressPrevPage"
  />
</template>
