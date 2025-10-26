<script lang="ts" setup>
import IconBtn from '@/components/Buttons/IconBtn.vue'
import AddIcon from '@/components/Icons/AddIcon.vue'
import ButtonAnchoredMsgBubble from '@/components/MessageBubble/ButtonAnchoredMsgBubble.vue'
import { ref } from 'vue'

defineProps<{
  pendingActivationLimitReached: boolean
}>()

const emits = defineEmits<{
  (e: 'createsubs'): void
}>()

const onCreateSub = () => {
  emits('createsubs')
}

const showAnchoredMessage = ref<boolean>(false)
</script>

<template>
  <div class="d-flex flex-row align-items-center position-relative">
    <template v-if="pendingActivationLimitReached && showAnchoredMessage">
      <div class="bubble">
        <h6 style="color: #da1e1c">Limit Reached!</h6>
        <span class="smaller-text">
          You already have 2 chatbots pending activation. Please activate/delete before creating new
          one.
        </span>
        <span class="arrow"></span>
      </div>
    </template>
    <IconBtn
      btnText="Create"
      iconStrokeColor="#273C8C"
      @click.stop="onCreateSub"
      :disabled="pendingActivationLimitReached"
      @mouseenter="showAnchoredMessage = true"
      @mouseleave="showAnchoredMessage = false"
    >
      <template #btnIcon>
        <AddIcon />
      </template>
    </IconBtn>
  </div>
</template>

<style scoped>
.bubble {
  position: absolute;
  right: calc(100% + 10px);
  top: -10px; /* negative to overflow above header */
  /* min-width: 100%; */
  width: 50vw;
  max-width: 500px;
  background: #fff;
  border: 1px solid #e0d7e7;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.13);
  padding: 16px 20px;
  z-index: 10;
  color: #222;
}

.arrow {
  position: absolute;
  top: 20%;
  right: -12px; /* adjust so arrow is outside the bubble */
  width: 0;
  height: 0;
  border-top: 7px solid transparent;
  border-bottom: 7px solid transparent;
  border-left: 12px solid #fff; /* matches bubble bg */
  filter: drop-shadow(1px 0 0 #ccc); /* border effect */
}
</style>
