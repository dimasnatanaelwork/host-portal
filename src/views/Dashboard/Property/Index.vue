<script lang="ts" setup>
import { onMounted } from 'vue'
import { useDashboardStore } from '../../../stores/dashboardItems'
import Table from '@/components/Table/Table.vue'
import { useRouter } from 'vue-router'
import { useProperty } from '@/composables/useProperty'
import type { Hotel } from '@/interfaces/property'

const { loading, error, propertyList, loadProperties } = useProperty()
const router = useRouter()
const headers = [
  { label: 'Property ID', key: 'id' },
  { label: 'Property Name', key: 'hotel_name' },
  { label: 'Phone Number', key: 'mobile_number' },
  { label: 'Email', key: 'email' },
  { label: 'Check-in Time', key: 'check_in_time' },
  { label: 'Check-out Time', key: 'check_out_time' },
]

onMounted(async () => {
  const res = await loadProperties()

  if (res.status_code == 401) {
    router.push('/')
  }
})

function handleEdit(row: Hotel) {
  router.push({ name: 'propertyDetails', params: { id: row.id } })
}

function handleDelete(row: Hotel) {
  if (confirm(`Are you sure you want to delete ${row.hotel_name} (${row.id})?`)) {
    // delete logic
  }
}
</script>

<template>
  <div class="container py-3">
    <h3 class="mb-3">Property Persona</h3>
    <Table
      :headers="headers"
      :rows="propertyList?.hotels"
      :hasEdit="true"
      :hasView="false"
      :hasBroadcast="false"
      :hasSync="false"
      :hasDelete="false"
      noDataBtnTxt="Contact Us!"
      noDataMsg="Looks like there’s no property linked yet! Ready to add one?"
      @edit="handleEdit"
      @delete="handleDelete"
    />
    <p v-if="error" style="color: red">{{ error }}</p>
  </div>
</template>

<style></style>
