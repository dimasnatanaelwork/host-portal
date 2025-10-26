<script lang="ts" setup>
import BackArrowIcon from '@/components/Icons/BackArrowIcon.vue'
import { ref, defineProps, onMounted, watch } from 'vue'

import Table, { type TableHeader } from '@/components/Table/Table.vue'
import { useRouter } from 'vue-router'
import DeletePopup from '@/components/Popup/DeletePopup.vue'
import { useAiChatbot } from '@/composables/useAiChatbot'
import type { AiDoc, ForwardRule } from '@/interfaces/aichatbot'
import { useLoadingStore } from '@/stores/loadingStore'
import { useFormSubmitMsgStore } from '@/stores/formSubmitMsg'
import ExpandablePanel from '@/components/SectionPanel/ExpandablePanel.vue'
import PropertyTable from '@/widgets/PropertyTable.vue'
import SyncBookingPopup from '@/widgets/SyncBookingPopup.vue'
import ResultPopup from '@/components/Popup/ResultPopup.vue'

const router = useRouter()
const formSubmitMsgStore = useFormSubmitMsgStore()
const { loading, error, aiChatbotDetail, loadAiChatbotDetail, removeAiDocAndReload } =
  useAiChatbot()

const loadingStore = useLoadingStore()
watch(loading, (newLoadingStatus) => {
  loadingStore.setLoading(newLoadingStatus)
})

const props = defineProps<{
  id: number
}>()

interface Property {
  id: number
  hotel_name: string
  boardcast_channel: string
}

const aiTableHeaders: TableHeader[] = [
  { label: 'ID', key: 'id' },
  { label: 'Document Name', key: 'name' },
  { label: 'Document Persona', key: 'persona', type: 'longtext' },
  { label: 'Reference File', key: 'doc_url', type: 'download_link' },
]

const fallbackMsgTableHeaders: TableHeader[] = [
  { label: 'Message Name', key: 'title' },
  { label: 'Forward Message to', key: 'forward_message_to' },
  { label: 'Essential Conditions', key: 'function_instruction', type: 'longtext' },
  { label: 'Fallback Message', key: 'forward_message_response', type: 'longtext' },
]

function handleEditProperty(row: Property) {
  router.push({ name: 'propertyDetails', params: { id: row.id, botType: row.boardcast_channel } })
}

const showSyncPopup = ref<boolean>(false)
const propIdToSync = ref<number | null>(null)

const showSuccessPopup = ref<boolean>(false)
const resultTitle = ref<string>('')
const resultDesc = ref<string>('')
const resultIsSuccess = ref<boolean>(false)

function handleSyncProperty(row: Property) {
  propIdToSync.value = row.id
  showSyncPopup.value = true
}

const confirmTriggerSync = (isSuccess: boolean, errorMsg: string) => {
  showSyncPopup.value = false
  if (isSuccess) {
    // console.log('confirmed trigger sync')
    resultTitle.value = 'Booking Sync Success'
    resultDesc.value = 'The booking details has been synced.'
    resultIsSuccess.value = isSuccess
    showSuccessPopup.value = true
  } else {
    // alert(errorMsg)
    resultTitle.value = 'Booking Sync Failed'
    resultDesc.value = errorMsg
    resultIsSuccess.value = isSuccess
    showSuccessPopup.value = true
  }
}

const responseDirectness = ref<string>('')

const response: Record<string, string> = {
  '0.2': 'Very direct and serious replies',
  '0.5': 'Balanced and natural replies',
  '0.7': 'Slightly creative and friendly',
  '1.0': 'Very creative and casual replies',
}

const aibotLimitMsg = ref<string | null>(null)

const filteredForwardRules = ref<ForwardRule[]>([])
const forwardRuleLimitMsg = ref<string | null>(null)

onMounted(async () => {
  await loadAiChatbotDetail(props.id)

  if (aiChatbotDetail.value?.ai_chatbot.ai_docs.length! >= 10) {
    aibotLimitMsg.value = 'You’ve reached the maximum limit of 10 AI Files.'
  } else {
    aibotLimitMsg.value = null
  }

  filteredForwardRules.value =
    aiChatbotDetail.value?.forward_rules?.filter((rule) => rule.is_enable === 1) || []

  if (filteredForwardRules.value.length! >= 5) {
    forwardRuleLimitMsg.value = 'You’ve reached the maximum limit of 5 Forward Rules.'
  } else {
    forwardRuleLimitMsg.value = null
  }
})

watch(aiChatbotDetail, (newVal) => {
  if (newVal?.ai_chatbot) {
    responseDirectness.value = response[String(newVal.ai_chatbot.openai_temperature)] ?? 'Unknown'
  }
})

function handleEditAIdocs(row: AiDoc) {
  router.push({
    name: 'AIDocsForm',
    params: {
      id: row.id,
      mode: 'edit',
      chatbotId: props.id,
      chatbotName: aiChatbotDetail.value?.ai_chatbot.name,
    },
  })
}

function handleEditFallbackMessage(row: ForwardRule) {
  router.push({
    name: 'FallbackMessageForm',
    params: {
      id: row.id,
      mode: 'edit',
      chatbotId: props.id,
      chatbotName: aiChatbotDetail.value?.ai_chatbot.name,
    },
  })
}

const isDeleteModalVisible = ref(false)
const DeleteModalTitle = ref('')
const rowToDelete = ref<AiDoc | null>(null)

function openDeleteAiDocModal(row: AiDoc) {
  DeleteModalTitle.value = 'AI File'
  rowToDelete.value = row
  isDeleteModalVisible.value = true
}

const handleDeleteAiDoc = (row: AiDoc) => {
  // console.log(props.id + ' prop id, row: ' + row.id)
  removeAiDocAndReload(props.id, row.id)
  isDeleteModalVisible.value = false
}

const backToList = () => {
  router.push({ name: 'AIChatbotList' })
}
</script>

<template>
  <div class="container">
    <DeletePopup
      :title="`Delete ${DeleteModalTitle}`"
      :message="`Are you sure you want to delete this ${DeleteModalTitle}? This action cannot be undone.`"
      v-if="isDeleteModalVisible"
      @close="isDeleteModalVisible = false"
      @confirm="
        () => {
          if (rowToDelete) {
            handleDeleteAiDoc(rowToDelete)
          }
        }
      "
    />
    <SyncBookingPopup
      v-if="propIdToSync"
      :syncPopupVisible="showSyncPopup"
      :property_id="propIdToSync"
      @close="showSyncPopup = false"
      @confirm="confirmTriggerSync"
    />
    <ResultPopup
      v-if="showSuccessPopup"
      :title="resultTitle"
      :desc="resultDesc"
      :isSuccess="resultIsSuccess"
      @close="showSuccessPopup = false"
    />
    <div class="d-flex flex-row align-items-center py-3">
      <a @click="backToList">
        <BackArrowIcon />
      </a>

      <h3 class="my-0 mx-3">Edit {{ aiChatbotDetail?.ai_chatbot.name }}</h3>
    </div>

    <ExpandablePanel title="Property Listing">
      <template #bodyContent>
        <PropertyTable
          :properties="aiChatbotDetail?.hotels ?? []"
          :hasEdit="true"
          @edit="handleEditProperty"
          @sync="handleSyncProperty"
        />
      </template>
    </ExpandablePanel>

    <div style="height: 1rem" />

    <ExpandablePanel
      title="AI Persona"
      addOrEdit="edit"
      redirectionTo="PersonaForm"
      :redirectionParam="{
        id: id,
        mode: 'edit',
      }"
      :submitMsg="
        formSubmitMsgStore.submitMessageStatus == 'editAiPersonaSuccess'
          ? 'AI Persona Updated!'
          : ''
      "
    >
      <template #bodyContent>
        <div class="medium-text">
          <div class="row">
            <div class="col-3 fw-600">Chatbot Name</div>
            <div class="col-9">{{ aiChatbotDetail?.ai_chatbot.name }}</div>
          </div>
          <div class="row">
            <div class="col-3 fw-600">AI Persona</div>
            <div class="col-9">
              <div class="outer-container">
                <div class="scrollable-inner" style="white-space: pre-wrap">
                  {{ aiChatbotDetail?.ai_chatbot.openai_persona }}
                </div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-3 fw-600">Response Directness</div>
            <div class="col-9">{{ responseDirectness }}</div>
          </div>
          <div class="row">
            <div class="col-3 fw-600">Query Room Rate?</div>
            <div class="col-9">
              {{ aiChatbotDetail?.ai_chatbot.query_room_rate! == 1 ? 'Yes' : 'No' }}
            </div>
          </div>
        </div>
      </template>
    </ExpandablePanel>

    <div style="height: 1rem" />

    <ExpandablePanel
      title="AI Files"
      addOrEdit="add"
      redirectionTo="AIDocsForm"
      :anchoredMessage="aibotLimitMsg"
      :disableAddBtn="aiChatbotDetail?.ai_chatbot.ai_docs.length! >= 10"
      :redirectionParam="{
        id: id,
        mode: 'add',
        chatbotId: id,
        chatbotName: aiChatbotDetail?.ai_chatbot.name,
      }"
      :submitMsg="
        formSubmitMsgStore.submitMessageStatus == 'editAiDocSuccess'
          ? 'AI File Updated!'
          : formSubmitMsgStore.submitMessageStatus == 'addAiDocSuccess'
            ? 'AI File Added'
            : ''
      "
    >
      <template #bodyContent>
        <Table
          :headers="aiTableHeaders"
          :rows="aiChatbotDetail?.ai_chatbot.ai_docs"
          :hasEdit="true"
          :hasView="false"
          :hasBroadcast="false"
          :hasSync="false"
          :hasDelete="true"
          @delete="openDeleteAiDocModal"
          @edit="handleEditAIdocs"
        />
      </template>
    </ExpandablePanel>

    <!-- <div style="height: 1rem" />

    <ExpandablePanel
      title="Fallback Message"
      addOrEdit="edit"
      redirectionTo="FallbackMessageForm"
      :redirectionParam="{
        id: id,
        mode: 'edit',
        chatbotName: aiChatbotDetail?.ai_chatbot.name,
      }"
      :submitMsg="
        formSubmitMsgStore.submitMessageStatus == 'editFallbackMsgSuccess'
          ? 'Fallback Message Updated!'
          : ''
      "
    >
      <template #bodyContent>
        <div class="medium-text">
          <div class="row">
            <div class="col-3 fw-600">Forward Message To</div>
            <div class="col-9">{{ aiChatbotDetail?.ai_chatbot.forward_message_to }}</div>
          </div>
          <div class="row">
            <div class="col-3 fw-600">Essential Conditions</div>
            <div class="col-9">
              <div class="outer-container">
                <div class="scrollable-inner" style="white-space: pre-wrap">
                  {{ aiChatbotDetail?.ai_chatbot.forward_message_condition }}
                </div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-3 fw-600">Fallback Message</div>
            <div class="col-9">
              {{ aiChatbotDetail?.ai_chatbot.forward_message_response }}
            </div>
          </div>
        </div>
      </template>
    </ExpandablePanel> -->

    <div style="height: 1rem" />

    <ExpandablePanel
      title="Fallback Message"
      addOrEdit="add"
      redirectionTo="FallbackMessageForm"
      :anchoredMessage="forwardRuleLimitMsg"
      :disableAddBtn="filteredForwardRules.length! >= 5"
      :redirectionParam="{
        id: -1,
        mode: 'add',
        chatbotId: id,
        chatbotName: aiChatbotDetail?.ai_chatbot.name,
      }"
      :submitMsg="
        formSubmitMsgStore.submitMessageStatus == 'editFallbackMsgSuccess'
          ? 'Fallback Message Updated!'
          : formSubmitMsgStore.submitMessageStatus == 'addFallbackMsgSuccess'
            ? 'Fallback Message Added'
            : ''
      "
    >
      <template #bodyContent>
        <Table
          :headers="fallbackMsgTableHeaders"
          :rows="filteredForwardRules"
          :hasEdit="true"
          :hasView="false"
          :hasBroadcast="false"
          :hasSync="false"
          :hasDelete="false"
          @edit="handleEditFallbackMessage"
        />
      </template>
    </ExpandablePanel>
  </div>
</template>

<style>
.outer-container {
  width: 100%;
  height: 250px;
}

.scrollable-inner {
  height: 100%;
  overflow-y: auto;
}
</style>
