<script lang="ts" setup>
import BackArrowIcon from '@/components/Icons/BackArrowIcon.vue'
import FixedPanel from '@/components/SectionPanel/FixedPanel.vue'
import Table, { type TableHeader } from '@/components/Table/Table.vue'
import { useBooking } from '@/composables/useBooking'
import { usePagination } from '@/composables/usePagination'
import { useLoadingStore } from '@/stores/loadingStore'
import { formatToDatetime } from '@/utils/utils'
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import InfoImgContainer from './component/InfoImgContainer.vue'
import ImagePopup from '@/components/Popup/ImagePopup.vue'
import PrimaryBroadcastIcon from '@/components/Icons/ButtonIcons/PrimaryBroadcastIcon.vue'
import IconBtn from '@/components/Buttons/IconBtn.vue'
import ScheduleMsgPopup, {
  type ScheduledMessageOptionModel,
} from '@/components/Popup/ScheduleMsgPopup.vue'
import ResultPopup from '@/components/Popup/ResultPopup.vue'
import { useProperty } from '@/composables/useProperty'

const router = useRouter()
const { loading, error, bookingDetail, loadBookingDetail, sendBroadcastMessage } = useBooking()
const { currentPage, lastPage, onPageClick, onPressNextPage, onPressPrevPage } = usePagination()
const { scheduledMessagesByProperty, loadScheduledMessagesByProperty } = useProperty()

const loadingStore = useLoadingStore()
watch(loading, (newLoadingStatus) => {
  loadingStore.setLoading(newLoadingStatus)
})

const props = defineProps<{
  id: number
}>()

const roomTableHeader: TableHeader[] = [
  { label: 'ID', key: 'id' },
  { label: 'Room Number', key: 'room_number' },
]

const scheduledMsgLogsHeader: TableHeader[] = [
  { label: 'ID', key: 'id' },
  { label: 'Template Name', key: 'ScheduledMessage', type: 'route_link' },
  { label: 'Sent To', key: 'to' },
  { label: 'Status', key: 'status', type: 'success_status' },
  { label: 'Timestamp', key: 'created_at' },
]

interface SchedMsgLogContent {
  id: number
  ScheduledMessage_name: string
  to: string
  status: string
  created_at: string
}
const schedMsgLogsContents = ref<SchedMsgLogContent[]>([])

onMounted(async () => {
  await loadBookingDetail(props.id)

  if (bookingDetail.value) {
    currentPage.value = bookingDetail.value.current_page
    lastPage.value = bookingDetail.value.last_page

    schedMsgLogsContents.value = bookingDetail.value.schedule_logs.map(
      (msg) =>
        ({
          id: msg.id,
          ScheduledMessage_id: bookingDetail.value?.booking.hotel.id, // necessity to redirect to sched_msg form
          ScheduledMessage_schedMsgId: msg.scheduleMessage.id, // necessity to redirect to sched_msg form
          ScheduledMessage_name: msg.scheduleMessage.title,
          ScheduledMessage_botType: bookingDetail.value?.booking.hotel.boardcast_channel, // necessity to redirect to sched_msg form
          ScheduledMessage_mode: 'edit', // necessity to redirect to sched_msg form
          to: msg.to,
          status: msg.status,
          created_at: formatToDatetime(new Date(msg.created_at)),
        }) as SchedMsgLogContent,
    )
  }
})

const allCheckinDocs = computed(() => {
  const images = bookingDetail.value?.booking?.checkin_id_docs ?? []
  const plates = bookingDetail.value?.booking?.car_plates ?? []
  return [...images, ...plates]
})

const backToList = () => {
  router.push({ name: 'BookingList' })
}

const selectedImgUrl = ref<string>('')
const selectedImgAlt = ref<string>('')
const showImgPopup = ref<boolean>(false)

const viewImg = (url: string, alt: string) => {
  selectedImgUrl.value = url
  selectedImgAlt.value = alt
  showImgPopup.value = true
}

// broadcast
const isSchedulePopupVisible = ref(false)
const messageTypes = ref<ScheduledMessageOptionModel[] | null>(null)

async function openScheduleMessageModal() {
  isSchedulePopupVisible.value = true
  await loadScheduledMessagesByProperty(bookingDetail.value?.booking.hotel.id!)
  if (scheduledMessagesByProperty) {
    messageTypes.value = scheduledMessagesByProperty.value?.map((msg) => {
      return {
        label: msg.title,
        value: msg.id,
      }
    }) as ScheduledMessageOptionModel[]
  }
}

const handleCreateScheduledMessage = async (type_id: number | null, phone: string) => {
  if (type_id) {
    const res = await sendBroadcastMessage(
      bookingDetail.value?.booking.hotel.id!,
      bookingDetail.value?.booking.id!,
      type_id,
      phone,
    )
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
</script>

<template>
  <ScheduleMsgPopup
    v-if="isSchedulePopupVisible"
    :options="messageTypes"
    @close="isSchedulePopupVisible = false"
    @confirm="handleCreateScheduledMessage"
  />
  <ResultPopup
    v-if="isResultPopupVisible"
    :title="resultTitle"
    :desc="resultDesc"
    :isSuccess="resultIsSuccess"
    @close="isResultPopupVisible = false"
  />
  <ImagePopup
    v-if="showImgPopup"
    :imgUrl="selectedImgUrl"
    :imgAlt="selectedImgAlt"
    @close="showImgPopup = false"
  />
  <div class="container">
    <div class="d-flex flex-row align-items-center justify-content-between">
      <div class="d-flex flex-row align-items-center py-3">
        <a @click="backToList">
          <BackArrowIcon />
        </a>
        <h4 class="my-0 mx-3">Bookings ></h4>
        <h4 class="my-0" style="font-style: italic">
          {{ bookingDetail?.booking.primary_guest_name }}
        </h4>
      </div>
      <IconBtn
        btnText="Broadcast Message"
        iconStrokeColor="#273C8C"
        @click.stop="openScheduleMessageModal"
      >
        <template #btnIcon>
          <PrimaryBroadcastIcon />
        </template>
      </IconBtn>
    </div>

    <FixedPanel title="Booking Information">
      <template #bodyContent>
        <div class="medium-text">
          <div class="row mb-2">
            <div class="col-3 fw-600">OTA Booking ID</div>
            <div class="col-9">{{ bookingDetail?.booking.source_id ?? '-' }}</div>
          </div>
          <div class="row mb-2">
            <div class="col-3 fw-600">PMS Booking ID</div>
            <div class="col-9">{{ bookingDetail?.booking.id ?? '-' }}</div>
          </div>
          <div class="row mb-2">
            <div class="col-3 fw-600">Property Name</div>
            <div class="col-9 fw-600" style="color: #273c8c">
              {{ bookingDetail?.booking.hotel.hotel_name ?? '-' }}
            </div>
          </div>
          <div class="row mb-2">
            <div class="col-3 fw-600">Booking Status</div>
            <div class="col-9">
              {{ bookingDetail?.booking.booking_status ?? '-' }}
            </div>
          </div>
          <div class="row mb-2">
            <div class="col-3 fw-600">Source</div>
            <div class="col-9">
              {{ bookingDetail?.booking.source ?? '-' }}
            </div>
          </div>
          <div class="row mb-2">
            <div class="col-3 fw-600">Booking Created</div>
            <div class="col-9">
              {{
                bookingDetail?.booking.created_at
                  ? formatToDatetime(new Date(bookingDetail?.booking.created_at))
                  : '-'
              }}
            </div>
          </div>
          <div class="row mb-2">
            <div class="col-3 fw-600">Check-in Date</div>
            <div class="col-9">
              {{
                bookingDetail?.booking.check_in_date_time
                  ? formatToDatetime(new Date(bookingDetail?.booking.check_in_date_time))
                  : '-'
              }}
            </div>
          </div>
          <div class="row mb-2">
            <div class="col-3 fw-600">Check-out Date</div>
            <div class="col-9">
              {{
                bookingDetail?.booking.check_out_date_time
                  ? formatToDatetime(new Date(bookingDetail?.booking.check_out_date_time))
                  : '-'
              }}
            </div>
          </div>
          <!-- <div class="row mb-2">
            <div class="col-3 fw-600">AI Check-out Status</div>
            <div class="col-9">
              {{ bookingDetail?.booking.ai_room_status ?? '-' }}
            </div>
          </div> -->
          <div class="row">
            <div class="col-3 fw-600">Room Details</div>
            <div class="col-9">
              <Table
                :headers="roomTableHeader"
                :rows="bookingDetail?.booking.booking_rooms"
                :hasEdit="false"
                :hasView="false"
                :hasBroadcast="false"
                :hasSync="false"
                :hasDelete="false"
              />
            </div>
          </div>
        </div>
      </template>
    </FixedPanel>

    <div style="height: 1rem" />

    <FixedPanel title="Primary Guest Details">
      <template #bodyContent>
        <div class="medium-text">
          <div class="row mb-2">
            <div class="col-3 fw-600">Primary Guest</div>
            <div class="col-9">{{ bookingDetail?.booking.primary_guest_name ?? '-' }}</div>
          </div>
          <div class="row mb-2">
            <div class="col-3 fw-600">Phone Number</div>
            <div class="col-9">{{ bookingDetail?.booking.primary_guest_phone ?? '-' }}</div>
          </div>
          <div class="row mb-2">
            <div class="col-3 fw-600">Check-in Info</div>
            <div class="col-9">
              <template v-if="allCheckinDocs && allCheckinDocs.length > 0">
                <div class="d-flex flex-row flex-wrap">
                  <div class="me-2 mb-2" v-for="ciImg in allCheckinDocs">
                    <InfoImgContainer
                      :imgUrl="ciImg.doc_url"
                      imgAlt="checkin-info-img"
                      @onview="viewImg"
                    />
                  </div>
                </div>
              </template>
              <template v-else>
                <InfoImgContainer imgAlt="checkin-info-img" />
              </template>
            </div>
          </div>
          <div class="row">
            <div class="col-3 fw-600">Check-out Info</div>
            <div class="col-9">
              <template
                v-if="
                  bookingDetail?.booking.checkout_images &&
                  bookingDetail?.booking.checkout_images.length > 0
                "
              >
                <div class="d-flex flex-row flex-wrap">
                  <div class="me-2 mb-2" v-for="coImg in bookingDetail?.booking.checkout_images">
                    <InfoImgContainer
                      :imgUrl="coImg.doc_url"
                      imgAlt="checkout-info-img"
                      @onview="viewImg"
                    />
                  </div>
                </div>
              </template>
              <template v-else>
                <InfoImgContainer imgAlt="checkout-info-img" />
              </template>
            </div>
          </div>
        </div>
      </template>
    </FixedPanel>

    <div style="height: 1rem" />

    <!-- <FixedPanel title="Room Details">
      <template #bodyContent>
        <div class="medium-text">
          <div class="row">
            <div class="col-3 fw-600">ID</div>
            <div class="col-9">{{ bookingDetail?.booking.booking_status ?? '-' }}</div>
          </div>
          <div class="row">
            <div class="col-3 fw-600">Room Number</div>
            <div class="col-9">{{ bookingDetail?.booking.primary_guest_name ?? '-' }}</div>
          </div>
        </div>
      </template>
    </FixedPanel>

    <div style="height: 1rem" /> -->

    <FixedPanel title="Schedule Message Logs">
      <template #bodyContent>
        <Table
          :headers="scheduledMsgLogsHeader"
          :rows="schedMsgLogsContents"
          :hasEdit="false"
          :hasView="false"
          :hasBroadcast="false"
          :hasSync="false"
          :hasDelete="false"
          :currentPage="currentPage!"
          :lastPage="lastPage!"
          @click-page="onPageClick"
          @next-page="onPressNextPage"
          @prev-page="onPressPrevPage"
        />
      </template>
    </FixedPanel>
  </div>
</template>
