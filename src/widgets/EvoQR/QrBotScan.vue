<script setup lang="ts">
import Popup from '@/components/Popup/Popup.vue'
import { useAiChatbot } from '@/composables/useAiChatbot'
import { useCountdown } from '@/composables/useCountdown'
import { useLoadingStore } from '@/stores/loadingStore'
import { onMounted, watch } from 'vue'

const { loading, error, evoQrData, generateEvoQR, checkQrStatus } = useAiChatbot()
// const loadingStore = useLoadingStore()
// watch(loading, (newLoadingStatus) => {
//   loadingStore.setLoading(newLoadingStatus)
// })

const props = defineProps<{
  qrPopupVisible: boolean
  chatbotId: number
  instanceMobileNo: string
}>()

const emits = defineEmits<{
  (e: 'close', status: 'cancel' | 'connected'): void
}>()

const checkQrConnectivityStatus = async () => {
  const res = await checkQrStatus(props.chatbotId)
  if (res.status === 'success') {
    // switch (res.data.state) {
    //   case null:
    //   case 'connecting':
    //     console.log('generating new QR')
    //     await generateEvoQR(props.chatbotId, props.instanceMobileNo)
    //     break
    //   case 'open': // connected, no need to scan
    //     console.log('ALREADY CONNECTED')
    //     onConnected()
    //     break
    // }
    if (res.data.state === 'open') {
      console.log('ALREADY CONNECTED')
      onConnected()
    } else {
      console.log('generating new QR')
      await generateEvoQR(props.chatbotId)
    }
  }
}

const {
  minutes,
  seconds,
  start: startCountdown,
  stop: stopCountdown,
  reset: resetCountdown,
} = useCountdown(
  90, // 90s before generating new qr
  () => {
    // after countdown finished, reset countdown
    resetCountdown()
    startCountdown()
  },
  10, // 10s check interval
  checkQrConnectivityStatus,
) // 5m, interval every 5s

const onClose = () => {
  resetCountdown()
  emits('close', 'cancel')
}

const onConnected = () => {
  stopCountdown()
  emits('close', 'connected')
}

onMounted(async () => {
  if (props.qrPopupVisible) {
    resetCountdown()
    startCountdown()
    await checkQrConnectivityStatus()
  }
})

watch(
  () => props.qrPopupVisible,
  async (visible) => {
    if (visible) {
      resetCountdown()
      startCountdown()
      await checkQrConnectivityStatus()
      // console.log('Visible now for ', props.chatbotId)
      // await generateEvoQR(props.chatbotId, props.instanceMobileNo)
    }
  },
)
</script>

<template>
  <Popup type="scan" title="Link to Whatsapp" v-if="qrPopupVisible" @close="onClose">
    <template #bodyContent>
      <div class="w-100 d-flex flex-column align-items-center small-text">
        <div class="w-100 qr-container text-center py-4">
          <!-- <img :src="dummyQR" alt="QR Code" class="qr-style" /> -->
          <img
            :src="evoQrData?.qrcode.base64"
            alt="QR Code"
            class="qr-style"
            v-if="evoQrData?.qrcode.base64"
          />
        </div>

        <span class="my-3">
          QR Code Reset in :
          <b class="countdown-color fw-bold">
            {{ String(minutes).padStart(2, '0') }}:{{ String(seconds).padStart(2, '0') }}
          </b>
        </span>

        <div class="instructions-container p-3 w-100">
          <ol>
            <li>Open WhatsApp on your Phone</li>
            <li>Tap <b>Menu</b> on Android, or <b>Settings</b> on iPhone</li>
            <li>Tap <b>Linked devices</b> and then <b>Link a Device</b></li>
            <li>Point your phone at this screen to scan the QR code</li>
          </ol>
        </div>
      </div>
    </template>
  </Popup>
</template>

<style scoped>
.qr-container {
  background-color: #efefef;
  border-radius: 1rem;
}

.qr-style {
  max-width: 250px;
}

.instructions-container {
  border: 1px solid #ccc;
  border-radius: 1rem;
}

.countdown-color {
  color: #f15e61;
}
</style>
