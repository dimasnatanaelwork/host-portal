<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import SubsTable, { type SubsTableContent } from './widgets/SubsTable.vue'
// import BillingHisTable from './widgets/BillingHisTable.vue'
import AiChatbotSubForm from '@/widgets/AiChatbotSubForm.vue'
import SubmitChatbotSubSuccess from '@/widgets/SubmitChatbotSubSuccess.vue'
import TopAnnouncementBar from '@/components/Notification/TopAnnouncementBar.vue'
import { useSubscription } from '@/composables/useSubscription'
import { useLoadingStore } from '@/stores/loadingStore'
import { watch } from 'vue'
import type { Subscription } from '@/interfaces/subscription'
import CreateChatbotBtn from '@/widgets/CreateChatbotBtn.vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const { loading, error, mySubscriptions, loadMySubscriptions } = useSubscription()
const loadingStore = useLoadingStore()
watch(loading, (newLoadingStatus) => {
  loadingStore.setLoading(newLoadingStatus)
})

const subsTableContent = ref<SubsTableContent[]>([])
const pendingActivationChatbotCount = ref(0)

onMounted(async () => {
  await loadMySubscriptions()

  if (mySubscriptions.value) {
    subsTableContent.value = mySubscriptions.value?.subscriptions.map(
      (sub) =>
        ({
          subs_id: sub.id,
          name: sub.name,
          subscription_status: sub.subscription.status,
          is_trial: sub.subscription.is_trial == 1 ? true : false,
          is_paused: sub.subscription.is_paused == 1 ? true : false,
          expired_at: sub.subscription.expired_at,
          total_unit: sub.total_unit,
          subscription_next_billing_at: sub.subscription.next_billing_at,
          package_type: sub.subscription.package_type,
        }) as SubsTableContent,
    )

    pendingActivationChatbotCount.value = mySubscriptions.value.subscriptions.filter(
      (sub: Subscription) => sub.subscription.status === 'pending_activation',
    ).length
  }
})

watch(
  mySubscriptions,
  (newSubs) => {
    if (newSubs) {
      subsTableContent.value = newSubs.subscriptions.map((sub) => ({
        subs_id: sub.id,
        name: sub.name,
        subscription_status: sub.subscription.status,
        is_trial: sub.subscription.is_trial == 1,
        is_paused: sub.subscription.is_paused == 1,
        expired_at: sub.subscription.expired_at,
        total_unit: sub.total_unit,
        subscription_next_billing_at: sub.subscription.next_billing_at,
        package_type: sub.subscription.package_type,
      }))
    } else {
      subsTableContent.value = []
    }
  },
  { immediate: true },
)

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

const showTopAnnouncement = ref<boolean>(false)

const nearestExpiringSubscription = computed(() => {
  if (!mySubscriptions.value?.subscriptions?.length) return null

  const today = new Date()

  // Filter active subscriptions with a valid expired_at date
  const activeSubs = mySubscriptions.value.subscriptions.filter((sub) => {
    return (
      sub.subscription.status === 'active' &&
      sub.subscription.expired_at &&
      !isNaN(new Date(sub.subscription.expired_at).getTime())
    )
  })

  if (activeSubs.length === 0) return null

  // Find subscription with nearest expiry date
  activeSubs.sort((a, b) => {
    const dateA = new Date(a.subscription.expired_at).getTime()
    const dateB = new Date(b.subscription.expired_at).getTime()
    return dateA - dateB
  })

  const nearestSub = activeSubs[0]
  const nextBillingDate = new Date(nearestSub.subscription.next_billing_at)
  const expiryDate = new Date(nearestSub.subscription.expired_at)

  // days before billing
  const diffTimeBilling = nextBillingDate.getTime() - today.getTime()
  const diffDaysBilling = Math.floor(diffTimeBilling / (1000 * 60 * 60 * 24))

  // Calculate days left (round down)
  const diffTime = expiryDate.getTime() - today.getTime()
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays > 0 || diffTime > 0) {
    showTopAnnouncement.value = true
  }

  return {
    subscription: nearestSub,
    nextBillingDaysLeft: diffDaysBilling >= 0 ? diffDaysBilling : 0,
    daysLeft: diffDays >= 0 ? diffDays : 0,
  }
})

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
</script>

<template>
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
  <div class="container py-3">
    <div class="mb-3" v-if="nearestExpiringSubscription?.subscription && showTopAnnouncement">
      <template
        v-if="
          nearestExpiringSubscription.nextBillingDaysLeft > 0 &&
          nearestExpiringSubscription.nextBillingDaysLeft <= 7
        "
      >
        <TopAnnouncementBar
          status="reminder"
          btnText="View Chatbot"
          @action=""
          @close="showTopAnnouncement = false"
        >
          <template #announcementContent>
            <span class="small-text text-white">
              <b>{{ nearestExpiringSubscription.nextBillingDaysLeft }} days until renewal</b> for
              {{ nearestExpiringSubscription.subscription.name }} — keep your balance sufficient to
              stay connected.
            </span>
          </template>
        </TopAnnouncementBar>
      </template>
      <template
        v-else-if="
          nearestExpiringSubscription.nextBillingDaysLeft === 0 &&
          nearestExpiringSubscription.daysLeft > 0
        "
      >
        <TopAnnouncementBar
          status="warning"
          btnText="Renew Now"
          @action=""
          @close="showTopAnnouncement = false"
        >
          <template #announcementContent>
            <span class="small-text text-white">
              Grace period ticking… {{ nearestExpiringSubscription.daysLeft }} days left before
              {{ nearestExpiringSubscription.subscription.name }} takes a nap 😴
            </span>
          </template>
        </TopAnnouncementBar>
      </template>
    </div>

    <h4 class="mb-3">Your Subscription</h4>
    <div class="d-flex flex-row justify-content-end w-100 mb-3">
      <CreateChatbotBtn
        :pendingActivationLimitReached="pendingActivationChatbotCount >= 2"
        @createsubs="onTriggerCreateSubs"
      />
    </div>
    <SubsTable
      :subsTableContent="subsTableContent"
      @create-chatbot="onTriggerCreateSubs"
      @refresh-subscriptions="loadMySubscriptions"
    />

    <!--
      <h6 class="mt-4 fw-bold">Billing History</h6>
      <BillingHisTable />
    -->
  </div>
</template>
