<script setup lang="ts">
import Table from '@/components/Table/Table.vue'
import type { HotelSummary } from '@/interfaces/aichatbot'

defineProps<{
  properties: HotelSummary[]
  hasEdit: boolean
}>()

const emits = defineEmits<{
  (e: 'edit', row: any): void
  (e: 'sync', row: any): void
}>()

const onEdit = (row: any) => {
  emits('edit', row)
}

const onSync = (row: any) => {
  emits('sync', row)
}
</script>

<template>
  <template v-if="hasEdit">
    <Table
      :headers="[
        { label: 'ID', key: 'id' },
        { label: 'Property Name', key: 'hotel_name' },
        { label: 'Active Unit', key: 'total_units' },
      ]"
      :rows="properties"
      :hasEdit="true"
      :hasView="false"
      :hasBroadcast="false"
      :hasSync="true"
      :hasDelete="false"
      @edit="onEdit"
      @sync="onSync"
    />
  </template>
  <template v-else>
    <Table
      :headers="[
        { label: 'ID', key: 'id' },
        { label: 'Property Name', key: 'hotel_name' },
        { label: 'Active Unit', key: 'total_units' },
      ]"
      :rows="properties"
      :hasEdit="false"
      :hasView="false"
      :hasBroadcast="false"
      :hasSync="false"
      :hasDelete="false"
    />
  </template>
</template>
