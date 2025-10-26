<script lang="ts" setup>
import { onMounted, watch, ref } from 'vue'
import Table, { type TableHeader } from '@/components/Table/Table.vue'
import { useRouter } from 'vue-router'
import { useLoadingStore } from '@/stores/loadingStore'
import { useBooking } from '@/composables/useBooking'
import DateFilter from './component/DateFilter.vue'
import StatusFilter from './component/StatusFilter.vue'
import { formatDateToYYYYMMDD, formatToDatetime } from '@/utils/utils'
import SearchFilter from './component/SearchFilter.vue'
import ScheduleMsgPopup, {
  type ScheduledMessageOptionModel,
} from '@/components/Popup/ScheduleMsgPopup.vue'
import { useProperty } from '@/composables/useProperty'
import ResultPopup from '@/components/Popup/ResultPopup.vue'
import type { BookingsResponse } from '@/interfaces/booking'
import { usePagination } from '@/composables/usePagination'
import CiInfoIcon from '@/components/Icons/table/CiInfoIcon.vue'
import CoInfoIcon from '@/components/Icons/table/CoInfoIcon.vue'
import type { LabelValueOption } from '@/interfaces/general_interface'
const { loading, error, bookingList, loadBookings, sendBroadcastMessage } = useBooking()
const { scheduledMessagesByProperty, loadScheduledMessagesByProperty } = useProperty()
const { currentPage, lastPage, onPageClick, onPressNextPage, onPressPrevPage } = usePagination()
const router = useRouter()
const loadingStore = useLoadingStore()

watch(loading, (newLoadingStatus) => {
  loadingStore.setLoading(newLoadingStatus)
})

const headers: TableHeader[] = [
  { label: 'OTA Booking ID', key: 'source_id' },
  { label: 'PMS Booking ID', key: 'invoice_id' },
  { label: 'Property Name', key: 'propertyDetails', type: 'route_link' },
  { label: 'Primary Guest', key: 'guest', type: 'longtext' },
  { label: 'Booking Status', key: 'booking_status', type: 'longtext' },
  { label: 'Source', key: 'source', type: 'breaktext' },
  { label: 'Booking Created', key: 'booking_create_datetime', type: 'longtext' },
  { label: 'Check-in Date', key: 'checkin_date', type: 'longtext' },
  { label: 'CI Info', key: 'checkin_info', type: 'custom_icon', customIcon: CiInfoIcon },
  { label: 'Check-out Date', key: 'checkout_date', type: 'longtext' },
  { label: 'CO Info', key: 'checkout_info', type: 'custom_icon', customIcon: CoInfoIcon },
  // { label: 'AI Check-out Status', key: 'ai_room_status', type: 'status' },
]

interface BookingTableContent {
  source_id: string
  invoice_id: string
  booking_id: number
  propertyDetails_id: number
  propertyDetails_name: string
  guest: string
  booking_status: string
  source: string
  booking_create_datetime: string
  checkin_date: string
  checkin_info: boolean
  checkout_date: string
  checkout_info: boolean
  // ai_room_status: 'checkin' | 'checkout' | null
}

const contents = ref<BookingTableContent[]>([])

// filters
const searchKeyword = ref<string>('')
const dateRange = ref<[Date, Date] | null>(null)
// soon - status filters (api hasn't provided yet)

const filterOptions = ref<LabelValueOption[]>([])
const selectedStatus = ref<Record<string, boolean>>({})

async function onUpdateSelected(newSelected: Record<string, boolean>) {
  selectedStatus.value = newSelected

  if (currentPage.value) {
    await fetchBookings(currentPage.value)
  } else {
    await fetchBookings(1)
  }
}

async function fetchBookings(page: number): Promise<BookingsResponse | undefined> {
  const startDate = dateRange.value ? formatDateToYYYYMMDD(dateRange.value[0]) : ''
  const endDate = dateRange.value ? formatDateToYYYYMMDD(dateRange.value[1]) : ''

  const selectedStatusesArray = Object.keys(selectedStatus.value).filter(
    (key) => selectedStatus.value[key],
  )

  const res = await loadBookings(
    searchKeyword.value,
    startDate,
    endDate,
    page,
    selectedStatusesArray,
  )

  if (res.status_code === 401) {
    router.push('/')
    return
  }

  if (bookingList.value) {
    currentPage.value = bookingList.value.current_page
    lastPage.value = bookingList.value.last_page

    contents.value = bookingList.value.bookings.map(
      (booking) =>
        ({
          source_id: booking.source_id,
          invoice_id: booking.invoice_id,
          booking_id: booking.id,
          propertyDetails_id: booking.hotel.id,
          propertyDetails_name: booking.hotel.hotel_name,
          guest: booking.primary_guest_name,
          booking_status: booking.booking_status,
          source: booking.source,
          booking_create_datetime: formatToDatetime(new Date(booking.created_at)),
          checkin_date: formatToDatetime(new Date(booking.check_in_date_time)),
          checkin_info:
            booking.checkin_id_docs.length > 0 || booking.car_plates.length > 0 ? true : false,
          checkout_date: formatToDatetime(new Date(booking.check_out_date_time)),
          checkout_info: booking.checkout_images.length > 0 ? true : false,
          // ai_room_status: booking.ai_room_status,
        }) as BookingTableContent,
    )
  }

  return res
}

onMounted(async () => {
  const res = await fetchBookings(1)

  if (res) {
    // data.booking_statuses is now an array of { value, label }
    filterOptions.value = res.data.booking_statuses

    // Initialize selected with all false or your desired defaults
    selectedStatus.value = filterOptions.value.reduce(
      (acc, option) => {
        acc[option.value] = false // or true if you want default checked
        return acc
      },
      {} as Record<string, boolean>,
    )
  }
})

// Watch currentPage and fetch bookings on page change
watch(currentPage, async (newPage) => {
  if (newPage !== null) {
    await fetchBookings(newPage)
  }
})

async function onUpdateSearchKeyword() {
  if (currentPage.value) {
    await fetchBookings(currentPage.value)
  } else {
    await fetchBookings(1)
  }
}

async function onUpdateDateFilter() {
  if (currentPage.value) {
    await fetchBookings(currentPage.value)
  } else {
    await fetchBookings(1)
  }
}

const isSchedulePopupVisible = ref(false)
const scheduleRow = ref<BookingTableContent | null>(null)
const messageTypes = ref<ScheduledMessageOptionModel[] | null>(null)

async function openScheduleMessageModal(row: BookingTableContent) {
  scheduleRow.value = row
  isSchedulePopupVisible.value = true
  await loadScheduledMessagesByProperty(row.propertyDetails_id)
  if (scheduledMessagesByProperty) {
    messageTypes.value = scheduledMessagesByProperty.value?.map((msg) => {
      return {
        label: msg.title,
        value: msg.id,
      }
    }) as ScheduledMessageOptionModel[]
  }
}

const handleCreateScheduledMessage = async (
  row: BookingTableContent,
  type_id: number | null,
  phone: string,
) => {
  if (type_id) {
    const res = await sendBroadcastMessage(row.propertyDetails_id, row.booking_id, type_id, phone)
    isSchedulePopupVisible.value = false
    if (res.status == 'success') {
      openResPopup(
        'Broadcast Message Sent',
        'Your message has been successfully sent to the guest.',
        true,
      )
    } else {
      openResPopup('Failed to Send Broadcast Message', res.msg!, false)
    }
  }
}

const isResultPopupVisible = ref(false)
const resultTitle = ref<string>('')
const resultDesc = ref<string>('')
const resultIsSuccess = ref<boolean>(false)

async function openResPopup(title: string, desc: string, isSuccess: boolean) {
  resultTitle.value = title
  resultDesc.value = desc
  resultIsSuccess.value = isSuccess
  isResultPopupVisible.value = true
}

async function onViewBooking(row: BookingTableContent) {
  router.push({
    name: 'BookingDetail',
    params: {
      id: row.booking_id,
    },
  })
}
</script>

<template>
  <ScheduleMsgPopup
    v-if="isSchedulePopupVisible"
    :options="messageTypes"
    @close="isSchedulePopupVisible = false"
    @confirm="
      (type, phone) => {
        if (scheduleRow) {
          handleCreateScheduledMessage(scheduleRow, type, phone)
        }
      }
    "
  />
  <ResultPopup
    v-if="isResultPopupVisible"
    :title="resultTitle"
    :desc="resultDesc"
    :isSuccess="resultIsSuccess"
    @close="isResultPopupVisible = false"
  />
  <div class="container py-3">
    <div class="d-flex flex-row align-items-center justify-content-between mb-3">
      <h3>Bookings</h3>
      <div class="d-flex flex-row align-items-center justify-content-end gap-2">
        <SearchFilter v-model="searchKeyword" @update:model-value="onUpdateSearchKeyword" />
        <DateFilter v-model="dateRange" @update:model-value="onUpdateDateFilter" />
        <StatusFilter
          :options="filterOptions"
          :selected="selectedStatus"
          @update:selected="onUpdateSelected"
        />
      </div>
    </div>

    <Table
      :headers="headers"
      :rows="contents"
      :hasEdit="false"
      :hasView="true"
      :hasBroadcast="true"
      :hasSync="false"
      :hasDelete="false"
      noDataMsg="Oops! We couldn't find any bookings that match."
      :currentPage="currentPage!"
      :lastPage="lastPage!"
      @click-page="onPageClick"
      @next-page="onPressNextPage"
      @prev-page="onPressPrevPage"
      @view="onViewBooking"
      @broadcast="openScheduleMessageModal"
    />

    <p v-if="error" style="color: red">{{ error }}</p>
  </div>
</template>

<style scoped></style>
