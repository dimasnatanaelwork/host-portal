<script lang="ts" setup>
import { useDashboardStore } from '../../../stores/dashboardItems'
import BackArrowIcon from '@/components/Icons/BackArrowIcon.vue'
import { ref, defineProps, onMounted, watch, computed, reactive } from 'vue'

import Table, { type TableHeader } from '@/components/Table/Table.vue'
import { useRouter } from 'vue-router'
import DeletePopup from '@/components/Popup/DeletePopup.vue'
import { useProperty } from '@/composables/useProperty'
import type { Hotel, HotelRoom, ScheduleMessage } from '@/interfaces/property'
import { useLoadingStore } from '@/stores/loadingStore'
import { useFormSubmitMsgStore } from '@/stores/formSubmitMsg'
import ExpandablePanel from '@/components/SectionPanel/ExpandablePanel.vue'
import { useSubscription } from '@/composables/useSubscription'
import { obscureText } from '@/utils/utils'

const router = useRouter()
const formSubmitMsgStore = useFormSubmitMsgStore()
const {
  loading,
  error,
  propertyDetail,
  scheduledMessageTypes,
  loadPropertyDetail,
  removeScheduledMsgAndReload,
  fetchScheduledMessageTypes,
} = useProperty()
const { platformTypes, loadPlatformTypes } = useSubscription()

const loadingStore = useLoadingStore()
watch(loading, (newLoadingStatus) => {
  loadingStore.setLoading(newLoadingStatus)
})

const props = defineProps<{
  id: number
  // botType: string
}>()

const botType = ref<string>('')
const dynamicFields = reactive<Record<string, string | number>>({})
const channelManagerName = ref<string>('')

onMounted(async () => {
  await fetchScheduledMessageTypes()
  await loadPropertyDetail(props.id)

  if (propertyDetail.value?.hotel) {
    botType.value = propertyDetail.value?.hotel.boardcast_channel
  }

  if (propertyDetail.value?.hotel_rooms) {
    roomTableContents.value = propertyDetail.value.hotel_rooms
  }

  if (propertyDetail.value?.schedule_messages) {
    populateScheduledMessagesTable()
  }

  if (propertyDetail.value?.schedule_messages.length! >= 6) {
    schedMsgOverMsg.value = 'You’ve reached the limit of 6 scheduled messages.'
  } else {
    schedMsgOverMsg.value = null
  }

  const res = await loadPlatformTypes()

  if (res.status === 'success') {
    console.log('has platform types')
    const platform = platformTypes.value?.platform_types.find(
      (p) => p.value === propertyDetail.value?.hotel.system_platform,
    )
    console.log(
      'found platform corresponding to ' +
        propertyDetail.value?.hotel.system_platform +
        ', which is : ' +
        platform,
    )
    if (platform) {
      channelManagerName.value = platform.label
      Object.keys(dynamicFields).forEach((key) => delete dynamicFields[key]) // Clear existing dynamic fields

      platform.require_fields.forEach((field) => {
        const key = field.key as keyof Hotel
        dynamicFields[field.key] = propertyDetail.value?.hotel[key]!
      })
    } else {
      Object.keys(dynamicFields).forEach((key) => delete dynamicFields[key]) // Clear if no platform
    }
  }
})

const populateScheduledMessagesTable = () => {
  scheduledMessages.value = propertyDetail.value!.schedule_messages.map(
    (msg) =>
      ({
        id: msg.id,
        title: msg.title,
        type: scheduledMessageTypes.value?.schedule_messsage_types.find(
          (item) => item.value === msg.message_type.type,
        )?.label,
        send_at: msg.send_at,
        content: msg.content,
        doc_url: msg.doc_url,
        wa_status:
          botType.value == 'WABA'
            ? msg.meta_info.template_status?.toLowerCase()
            : msg.wa_status.toLowerCase(),
      }) as ScheduledMsgTable,
  )
}

// scheduled messages
const scheduledMessagesTableHeaders = computed<TableHeader[]>(() => [
  { label: 'ID', key: 'id' },
  { label: 'Message Title', key: 'title' },
  { label: 'Message Type', key: 'type' },
  { label: 'Scheduled Timing', key: 'send_at' },
  { label: 'Message Content', key: 'content', type: 'longtext' },
  {
    label: 'Status',
    key: 'wa_status',
    type: botType.value === 'WABA' ? 'bot_type_waba' : 'bot_type_evo',
  },
  { label: 'File Attachment', key: 'doc_url', type: 'download_link' },
])

interface ScheduledMsgTable {
  id: number
  title: string
  type: string
  send_at: string
  content: string
  doc_url: string
  wa_status: string
}
const scheduledMessages = ref<ScheduledMsgTable[]>([])
const schedMsgOverMsg = ref<string | null>(null)

// rooms
const roomTableHeaders: TableHeader[] = [
  { label: 'ID', key: 'id' },
  { label: 'Room Number', key: 'room_number' },
  { label: 'Security Box Password', key: 'securitybox_password' },
  { label: 'Room Persona', key: 'openai_persona', type: 'longtext' },
  { label: 'Remark', key: 'remark', type: 'longtext' },
  { label: 'Instruction Document', key: 'checkin_instruction_doc_url', type: 'download_link' },
]
const roomTableContents = ref<HotelRoom[]>([])

function handleEditRoom(row: HotelRoom) {
  router.push({ name: 'RoomForm', params: { id: props.id, mode: 'edit', roomId: row.id } })
}

function handleEditScheduledMsg(row: ScheduledMsgTable) {
  router.push({
    name: 'ScheduledMessage',
    params: { id: props.id, mode: 'edit', botType: botType.value, schedMsgId: row.id },
  })
}

const isDeleteModalVisible = ref(false)

const rowToDelete = ref<ScheduledMsgTable | null>(null)

function openDeleteScheduledMsgModal(row: ScheduledMsgTable) {
  rowToDelete.value = row
  isDeleteModalVisible.value = true
}

const handleDeleteScheduledMsg = async (row: ScheduledMsgTable) => {
  await removeScheduledMsgAndReload(props.id, row.id)
  if (propertyDetail.value?.schedule_messages) {
    populateScheduledMessagesTable()
  }
  isDeleteModalVisible.value = false
}
</script>

<template>
  <div class="container">
    <DeletePopup
      title="Delete Scheduled Message"
      message="Are you sure you want to delete this scheduled message? This action cannot be undone."
      v-if="isDeleteModalVisible"
      @close="isDeleteModalVisible = false"
      @confirm="
        () => {
          if (rowToDelete) {
            handleDeleteScheduledMsg(rowToDelete)
          }
        }
      "
    />
    <div class="d-flex flex-row align-items-center py-3">
      <a @click="router.back()">
        <BackArrowIcon />
      </a>

      <h3 class="my-0 mx-3">Edit {{ propertyDetail?.hotel.hotel_name! }}</h3>
    </div>

    <ExpandablePanel
      title="Property Integration Information"
      editBtnTxt="Edit"
      redirectionTo="PropertyIntegration"
      :redirectionParam="{
        id: id,
      }"
      addOrEdit="edit"
      :disableAddBtn="propertyDetail?.hotel.is_pms_intergrated === 1"
      :submitMsg="
        formSubmitMsgStore.submitMessageStatus == 'editPropertyIntegrationInfoSuccess'
          ? 'Property Integration Info Updated!'
          : ''
      "
    >
      <template #bodyContent>
        <div class="medium-text">
          <div class="row">
            <div class="col-3 fw-600">PMS Channel Manager</div>
            <div class="col-9">{{ channelManagerName ?? '-' }}</div>
          </div>
          <div
            v-for="field in platformTypes?.platform_types.find(
              (p) => p.value === propertyDetail?.hotel.system_platform,
            )?.require_fields || []"
            class="row"
          >
            <div class="col-3 fw-600">{{ field.label }}</div>
            <div class="col-9">
              {{
                dynamicFields[field.key] ? obscureText(dynamicFields[field.key].toString()) : '-'
              }}
            </div>
          </div>
        </div>
      </template>
    </ExpandablePanel>

    <div style="height: 1rem" />

    <ExpandablePanel
      title="Property Information"
      addOrEdit="edit"
      redirectionTo="PropertyInfo"
      :redirectionParam="{
        id: id,
        mode: 'edit',
      }"
      :submitMsg="
        formSubmitMsgStore.submitMessageStatus == 'editPropertyInfoSuccess'
          ? 'Property Info Updated!'
          : ''
      "
    >
      <template #bodyContent>
        <div class="medium-text">
          <div class="row">
            <div class="col-3 fw-600">Property Persona Name</div>
            <div class="col-9">{{ propertyDetail?.hotel.hotel_name! }}</div>
          </div>
          <div class="row">
            <div class="col-3 fw-600">Booking Link</div>
            <div class="col-9">{{ propertyDetail?.hotel.hotel_link! }}</div>
          </div>
          <div class="row">
            <div class="col-3 fw-600">Property Contact Number</div>
            <div class="col-9">{{ propertyDetail?.hotel.mobile_number! }}</div>
          </div>
          <div class="row">
            <div class="col-3 fw-600">Property Address</div>
            <div class="col-9">{{ propertyDetail?.hotel.address! }}</div>
          </div>
          <div class="row">
            <div class="col-3 fw-600">Property Contact Email</div>
            <div class="col-9">{{ propertyDetail?.hotel.email! }}</div>
          </div>
          <div class="row">
            <div class="col-3 fw-600">Property Latitude</div>
            <div class="col-9">{{ propertyDetail?.hotel.latitude! }}</div>
          </div>
          <div class="row">
            <div class="col-3 fw-600">Property Longitude</div>
            <div class="col-9">{{ propertyDetail?.hotel.longtitude! }}</div>
          </div>
          <div class="row">
            <div class="col-3 fw-600">Check-in Time</div>
            <div class="col-9">{{ propertyDetail?.hotel.check_in_time! }}</div>
          </div>
          <div class="row">
            <div class="col-3 fw-600">Check-out Time</div>
            <div class="col-9">{{ propertyDetail?.hotel.check_out_time! }}</div>
          </div>
          <div class="row">
            <div class="col-3 fw-600">Send Daily Check In/Out Summary?</div>
            <div class="col-9">{{ propertyDetail?.hotel.send_to_host! == 1 ? 'Yes' : 'No' }}</div>
          </div>
        </div>
      </template>
    </ExpandablePanel>

    <div style="height: 1rem" />

    <ExpandablePanel
      title="Scheduled Messages"
      addOrEdit="add"
      redirectionTo="ScheduledMessage"
      :anchoredMessage="schedMsgOverMsg"
      :disableAddBtn="propertyDetail?.schedule_messages.length! >= 6"
      :redirectionParam="{
        id: id,
        mode: 'add',
        botType: botType,
        schedMsgId: -1,
      }"
      :submitMsg="
        formSubmitMsgStore.submitMessageStatus == 'editScheduledMsgSuccess'
          ? 'Scheduled Message Updated!'
          : formSubmitMsgStore.submitMessageStatus == 'addScheduledMsgSuccess'
            ? 'Scheduled Message Added'
            : ''
      "
      :hasHelpInfo="true"
    >
      <template #bodyContent>
        <Table
          :headers="scheduledMessagesTableHeaders"
          :rows="scheduledMessages"
          :hasEdit="true"
          :hasView="false"
          :hasBroadcast="false"
          :hasSync="false"
          :hasDelete="true"
          @edit="handleEditScheduledMsg"
          @delete="openDeleteScheduledMsgModal"
        />
      </template>
    </ExpandablePanel>

    <div style="height: 1rem" />

    <ExpandablePanel
      title="Rooms"
      subtitle="Rooms listing automatically synchronised from PMS"
      :submitMsg="
        formSubmitMsgStore.submitMessageStatus == 'editRoomSuccess' ? 'Room Updated!' : ''
      "
    >
      <template #bodyContent>
        <Table
          :headers="roomTableHeaders"
          :rows="roomTableContents"
          :hasEdit="true"
          :hasView="false"
          :hasBroadcast="false"
          :hasSync="false"
          :hasDelete="false"
          @edit="handleEditRoom"
        />
      </template>
    </ExpandablePanel>
  </div>
</template>

<style>
.outer-container {
  width: 100%;
  height: 250px; /* fixed height */
  /* border: 1px solid #ccc; */
}

.scrollable-inner {
  height: 100%;
  overflow-y: auto; /* enable vertical scroll */
}
</style>
