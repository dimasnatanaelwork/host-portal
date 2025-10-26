<script lang="ts" setup>
import { onMounted, watch, ref, type Component } from 'vue'
import Table, { type DropdownMenuItem, type TableHeader } from '@/components/Table/Table.vue'
import { useRouter } from 'vue-router'
import { useAiChatbot } from '@/composables/useAiChatbot'
import type { AiChatbot } from '@/interfaces/aichatbot'
import { useLoadingStore } from '@/stores/loadingStore'
import AiChatbotSubForm from '@/widgets/AiChatbotSubForm.vue'
import SubmitChatbotSubSuccess from '@/widgets/SubmitChatbotSubSuccess.vue'
import CreateChatbotBtn from '@/widgets/CreateChatbotBtn.vue'
import QrBotScan from '@/widgets/EvoQR/QrBotScan.vue'
import ScanSuccess from '@/widgets/EvoQR/ScanSuccess.vue'
import InputMobileNumberPopup from '@/widgets/EvoQR/InputMobileNumberPopup.vue'
import LinkWAIcon from '@/components/Icons/table/LinkWAIcon.vue'
import ResumeChatbotIcon from '@/components/Icons/table/ResumeChatbotIcon.vue'
import PauseChatbotIcon from '@/components/Icons/table/PauseChatbotIcon.vue'
import ManageSubscriptionIcon from '@/components/Icons/table/ManageSubscriptionIcon.vue'
import PauseResumePopup from '@/widgets/PauseResume/PauseResumePopup.vue'
import BotSad from '@/components/Icons/GifImages/BotSad.vue'
import SipCoffee from '@/components/Icons/GifImages/SipCoffee.vue'
import SayHi from '@/components/Icons/GifImages/SayHi.vue'
import BotHappy from '@/components/Icons/GifImages/BotHappy.vue'

const { loading, error, aiChatbotList, loadAiChatbots, updatePersona } = useAiChatbot()
const router = useRouter()
const loadingStore = useLoadingStore()
watch(loading, (newLoadingStatus) => {
  loadingStore.setLoading(newLoadingStatus)
})

const headers: TableHeader[] = [
  { label: 'ID', key: 'id' },
  { label: 'ChatBot Name', key: 'name', type: 'longtext' },
  { label: 'Subscription Status', key: 'subscription_status', type: 'subscription_status' },
  { label: 'Integration', key: 'bot_type' },
  { label: 'Connection Number', key: 'evolution_instance_mobile' },
  { label: 'Connection Status', key: 'connection_status', type: 'connection_status' },
]

interface ContentModel {
  id: number
  name: string
  subscription_status: string
  is_trial: boolean
  expiry_date: string | null
  next_billing_date: string | null
  bot_type: string
  evolution_instance_mobile: string
  connection_status: boolean
  is_paused: boolean
  dropdownItems: DropdownMenuItem[]
}

const contents = ref<ContentModel[]>([])
const pendingActivationChatbotCount = ref(0)

onMounted(async () => {
  const res = await loadAiChatbots()

  if (res.status_code == 401) {
    router.push('/')
  }

  updateTableData()
})

const updateTableData = () => {
  if (aiChatbotList.value) {
    contents.value = aiChatbotList.value?.ai_chatbots.map((chatbot) => {
      const isPaused = chatbot.subscription.is_paused == 1 ? true : false

      const dropdownItems = [
        {
          label: 'Link to Whatsapp',
          key: 'link_wa',
          icon: LinkWAIcon,
          disabled:
            chatbot.evolution_instance_state === 'open' || chatbot.subscription.status !== 'active',
        },
        ...(isPaused
          ? [
              {
                label: 'Resume AI Persona',
                key: 'resume_ai_persona',
                icon: ResumeChatbotIcon,
                disabled: chatbot.subscription.status !== 'active',
              },
            ]
          : [
              {
                label: 'Pause AI Persona',
                key: 'pause_ai_persona',
                icon: PauseChatbotIcon,
                disabled: chatbot.subscription.status !== 'active',
              },
            ]),
        {
          key: 'separator',
          label: '',
          icon: null,
        },
        {
          label: 'Manage Subscription',
          key: 'manage_subs',
          icon: ManageSubscriptionIcon,
        },
      ]

      return {
        id: chatbot.id,
        name: chatbot.name,
        subscription_status: chatbot.subscription.status,
        is_trial: chatbot.subscription.is_trial == 1 ? true : false,
        expiry_date: chatbot.subscription.expired_at,
        bot_type: chatbot.evolution_intgration_type == 'WHATSAPP-BAILEYS' ? 'Janus WA' : 'WABA',
        evolution_instance_mobile: chatbot.evolution_instance_mobile,
        connection_status: chatbot.evolution_instance_state == 'open' ? true : false,
        is_paused: isPaused,
        dropdownItems: dropdownItems,
      } as ContentModel
    })

    // to find out how many chatbots are pending activation, to limit it to 2
    pendingActivationChatbotCount.value = aiChatbotList.value.ai_chatbots.filter(
      (chatbot: AiChatbot) => chatbot.subscription.status === 'pending_activation',
    ).length
  }
}

function handleEdit(row: AiChatbot) {
  router.push({
    name: 'AiChatbotDetail',
    params: {
      id: row.id,
    },
  })
}

function handleDelete(row: AiChatbot) {
  if (confirm(`Are you sure you want to delete ${row.name} (${row.id})?`)) {
    // delete logic
  }
}

const chatbotPopupVisible = ref(false)
const successPopupVisible = ref(false)
const hasChosenChannelManager = ref(false)
const newPropId = ref<number | null>(null)
const newBotId = ref<number | null>(null)

const onTriggerCreateSubs = () => {
  chatbotPopupVisible.value = true
}

const confirmSubmitted = (
  isSuccess: boolean,
  hasCompletePMSData: boolean,
  newPropertyId: number | null,
  newChatbotId: number | null,
  errorMsg: string,
) => {
  chatbotPopupVisible.value = false
  if (isSuccess) {
    console.log('confirmed chatbot subscription. Is the data complete? ' + hasCompletePMSData)
    hasChosenChannelManager.value = hasCompletePMSData
    successPopupVisible.value = true
    newPropId.value = newPropertyId
    newBotId.value = newChatbotId
  } else {
    alert(errorMsg)
  }
}

const onConfirmSubmissionDone = () => {
  successPopupVisible.value = false
  if (!hasChosenChannelManager.value) {
    console.log('will redirect to property <-> AI integration page')
    router.push({ name: 'PropertyIntegration', params: { id: newPropId.value } }) // redirect to the corresponding integration page
  } else {
    // redirect to payment page
    router.push({ name: 'PlanNPricing', params: { botId: newBotId.value, mode: 'subscribe' } })
  }
}

const phonePopupVisible = ref<boolean>(false)
const newPhoneNum = ref<string>('')
const qrPopupVisible = ref<boolean>(false)
const chatbotToConnect = ref<AiChatbot | null>(null)
const scanSuccessVisible = ref<boolean>(false)

// pause / resume
const pauseResumeVisible = ref<boolean>(false)
const botImage = ref<Component | null>(null)
const pauseResumeTitle = ref<string>('')
const pauseResumeDesc = ref<string>('')
const currentActiveFunc = ref<Function | null>(null)
const cancelText = ref<string>('')
const confText = ref<string>('')

const onTriggerDropdownByKey = async (menuKey: string, row: AiChatbot) => {
  switch (menuKey) {
    case 'link_wa':
      chatbotToConnect.value = row
      qrPopupVisible.value = true
      break
    case 'pause_ai_persona':
      pauseResumeVisible.value = true
      botImage.value = BotSad
      pauseResumeTitle.value = 'Take a Break?'
      pauseResumeDesc.value =
        'Your chatbot will stop responding until you turn it back on. Don’t worry, you can resume anytime.'
      cancelText.value = 'Keep Running'
      confText.value = 'Pause Now'
      currentActiveFunc.value = () => onConfirmPauseResume(row.id, 1)

      break
    case 'resume_ai_persona':
      pauseResumeVisible.value = true
      botImage.value = BotHappy
      pauseResumeTitle.value = 'Bring Your Chatbot Back 🎉'
      pauseResumeDesc.value =
        'Do you want to turn the chatbot back on? It will immediately start responding to messages.'
      cancelText.value = 'Not Yet'
      confText.value = 'Yes, Resume'
      currentActiveFunc.value = () => onConfirmPauseResume(row.id, 0)

      break
    case 'manage_subs':
      router.push({ name: 'PlanNPricing', params: { botId: row.id, mode: 'subscribe' } })
      break
    default:
      break
  }
}

// pause: onConfirmPauseResume(row.id, 1)
// resume: onConfirmPauseResume(row.id, 0)
const onConfirmPauseResume = async (rowId: number, isPaused: number) => {
  const res = await updatePersona(rowId, { isPaused: isPaused })
  if (res.status_code == 422) {
    alert(res.msg)
  } else {
    await loadAiChatbots()
    updateTableData()
  }

  if (isPaused) {
    botImage.value = SipCoffee
    pauseResumeTitle.value = 'Chatbot on Pause ☕'
    pauseResumeDesc.value =
      'Okay! Your chatbot is now taking a break. It won’t reply until you decide to bring it back.'

    confText.value = 'Got It!'
  } else {
    botImage.value = SayHi
    pauseResumeTitle.value = 'Chatbot is Back 🎉'
    pauseResumeDesc.value =
      'Your chatbot is up and running again. Guests can now chat with it in real time.'
    confText.value = 'Great!'
  }
  cancelText.value = ''
  currentActiveFunc.value = onClosePauseResumePopup
}

const onClosePauseResumePopup = () => {
  pauseResumeVisible.value = false
}

const onCloseQRPopup = (status: 'cancel' | 'connected') => {
  qrPopupVisible.value = false
  if (status === 'connected') {
    scanSuccessVisible.value = true
  }
}
</script>

<template>
  <!-- submit new chatbot -->
  <AiChatbotSubForm
    :chatbotPopupVisible="chatbotPopupVisible"
    @close="chatbotPopupVisible = false"
    @confirm="confirmSubmitted"
  />
  <SubmitChatbotSubSuccess
    :successPopupVisible="successPopupVisible"
    :hasChosenChannelManager="hasChosenChannelManager"
    @confirm="onConfirmSubmissionDone"
  />

  <!-- link to evo wa -->
  <QrBotScan
    v-if="chatbotToConnect"
    :qrPopupVisible="qrPopupVisible"
    :chatbotId="chatbotToConnect.id!"
    :instanceMobileNo="newPhoneNum"
    @close="onCloseQRPopup"
  />
  <ScanSuccess :scanSuccessVisible="scanSuccessVisible" @close="scanSuccessVisible = false" />

  <!-- pause/resume -->
  <PauseResumePopup
    :pauseResumeVisible="pauseResumeVisible"
    :title="pauseResumeTitle"
    :desc="pauseResumeDesc"
    :cancelText="cancelText"
    :confText="confText"
    @confirm="currentActiveFunc!"
    @close="onClosePauseResumePopup"
  >
    <template #mainImg>
      <component :is="botImage" />
    </template>
  </PauseResumePopup>

  <div class="container py-3">
    <div class="mb-3 d-flex flex-row justify-content-between align-items-center">
      <h3>AI Chatbot</h3>
      <CreateChatbotBtn
        :pendingActivationLimitReached="pendingActivationChatbotCount >= 2"
        @createsubs="onTriggerCreateSubs"
      />
    </div>

    <Table
      :headers="headers"
      :rows="contents"
      :hasEdit="true"
      :hasView="false"
      :hasBroadcast="false"
      :hasSync="false"
      :hasDelete="false"
      noDataMsg="Looks like there's no AI Chatbot linked yet! Ready to add one?"
      noDataBtnTxt="Create a Chatbot"
      :hasDropdownMenu="true"
      dropdownMenuItemsKey="dropdownItems"
      @edit="handleEdit"
      @delete="handleDelete"
      @no-data-func="onTriggerCreateSubs"
      @dropdown-menu-click="onTriggerDropdownByKey"
    />

    <p v-if="error" style="color: red">{{ error }}</p>
  </div>
</template>
