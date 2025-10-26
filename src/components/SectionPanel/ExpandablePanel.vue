<script setup lang="ts">
import { ref, watch } from 'vue'
import ExpandIcon from '../Icons/ExpandIcon.vue'
import { useRouter } from 'vue-router'
import SubmittedMsgIcon from '../Icons/SubmittedMsgIcon.vue'
import ButtonAnchoredMsgBubble from '../MessageBubble/ButtonAnchoredMsgBubble.vue'
import IconBtn from '../Buttons/IconBtn.vue'
import AddIcon from '../Icons/ButtonIcons/AddIcon.vue'
import EditIcon from '../Icons/ButtonIcons/EditIcon.vue'

const router = useRouter()

const props = defineProps<{
  title: string
  subtitle?: string
  // editBtnTxt?: string
  addOrEdit?: 'add' | 'edit'
  redirectionTo?: string
  redirectionParam?: any
  submitMsg?: string
  anchoredMessage?: string | null
  disableAddBtn?: boolean
  hasHelpInfo?: boolean
  helpInfoTitle?: string | null
  helpInfoContents?: string[] | null
}>()

const submitMsgRef = ref<string>('')
watch(
  () => props.submitMsg,
  (newMsg) => {
    submitMsgRef.value = newMsg!
  },
)
const showHelpInfo = ref(false)
const showAnchoredMessage = ref(false)

const isExpanded = ref(false)

function editRedirection() {
  router.push({ name: props.redirectionTo, params: props.redirectionParam }) // router.push({ name: props.redirectionTo, params: { id: row.id, mode: 'edit' } }) // edit | add
}

function toggleExpand() {
  isExpanded.value = !isExpanded.value
}
</script>

<template>
  <div class="expandable-panel">
    <header
      class="header"
      :style="isExpanded ? { 'border-bottom': '1px solid #ddd' } : {}"
      @click="toggleExpand"
    >
      <div class="d-flex flex-row position-relative">
        <div class="d-flex flex-column">
          <span class="title medium-text">{{ title }}</span>
          <template v-if="subtitle">
            <span class="small-text fst-italic">{{ subtitle }}</span>
          </template>
        </div>
        <div v-if="hasHelpInfo">
          <span
            class="icon smaller-text"
            @mouseenter="showHelpInfo = true"
            @mouseleave="showHelpInfo = false"
            >i</span
          >
          <div v-if="showHelpInfo" class="bubble">
            <div class="bubble-title small-text">Limitations</div>
            <ul class="smaller-text">
              <li>
                A template can only be edited when it is in a state of
                <b>Approved, Rejected, Paused or In Draft</b>. A template can be edited once per
                day, up to 10 times per month.
              </li>
              <li>The system currently support maximum of 6 message templates.</li>
            </ul>
          </div>
        </div>
      </div>

      <div class="header-buttons d-flex flex-row align-items-center justify-content-end">
        <template v-if="submitMsg && submitMsg != ''">
          <div class="d-flex flex-row align-items-center gap-1 me-3">
            <SubmittedMsgIcon />
            <span class="smaller-text fw-italic" style="color: #0da858">{{ submitMsg }}</span>
          </div>
        </template>
        <template v-if="anchoredMessage && showAnchoredMessage">
          <ButtonAnchoredMsgBubble>
            {{ anchoredMessage }}
          </ButtonAnchoredMsgBubble>
        </template>
        <!-- <button
          v-if="editBtnTxt && editBtnTxt != ''"
          @click.stop="editRedirection"
          class="edit-btn medium-text"
          :disabled="disableAddBtn"
          @mouseenter="showAnchoredMessage = true"
          @mouseleave="showAnchoredMessage = false"
        >
          {{ editBtnTxt }}
        </button> -->
        <template v-if="addOrEdit">
          <IconBtn
            :btnText="addOrEdit === 'add' ? 'Add' : 'Edit'"
            @click.stop="editRedirection"
            @mouseenter="showAnchoredMessage = true"
            @mouseleave="showAnchoredMessage = false"
            :disabled="disableAddBtn"
          >
            <template #btnIcon v-if="addOrEdit === 'add'">
              <AddIcon />
            </template>
            <template #btnIcon v-else-if="addOrEdit === 'edit'">
              <EditIcon />
            </template>
          </IconBtn>
        </template>
        <ExpandIcon v-model:isExpanded="isExpanded" />
      </div>
    </header>

    <transition name="expand">
      <section v-show="isExpanded" class="content">
        <slot name="bodyContent"></slot>
      </section>
    </transition>
  </div>
</template>

<style scoped>
.expandable-panel {
  border: 1px solid #ccc;
  border-radius: 1rem;
  width: 100%;
  font-family: Arial, sans-serif;
  position: relative;
}

.header {
  display: flex;
  /* flex-direction: column; */
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
  cursor: pointer;
  border-top-left-radius: 1rem;
  border-top-right-radius: 1rem;
  position: relative;
}

/* @media (min-width: 1024px) {
  .header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
} */

.title {
  font-weight: 600;
}

.header-buttons button {
  margin-right: 0.5rem;
  border: none;
  cursor: pointer;
  border-radius: 0.5rem;
}

.edit-btn {
  padding: 0.5rem 1.5rem;
  background-color: #273c8c;
  color: white;
}

.edit-btn:hover {
  background-color: #0056b3;
}

.edit-btn:disabled {
  background-color: #9ca6ce;
}

.expand-btn {
  background-color: #28a745;
  color: white;
}

.expand-btn:hover {
  background-color: #1e7e34;
}

.content {
  padding: 15px;
  background-color: white;
  overflow: hidden;
  border-bottom-right-radius: 1rem;
  border-bottom-left-radius: 1rem;
}

.expand-enter-active,
.expand-leave-active {
  transition:
    max-height 0.3s ease,
    opacity 0.3s ease;
}
.expand-enter-from,
.expand-leave-to {
  max-height: 0;
  opacity: 0;
}
.expand-enter-to,
.expand-leave-from {
  max-height: 1000px;
  opacity: 1;
}

.icon {
  margin-left: 8px;
  background: #f36f7c;
  color: #fff;
  border-radius: 50%;
  width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  /* font-size: 1rem; */
  cursor: pointer;
  position: relative;
  z-index: 2;
}

.bubble {
  position: absolute;
  left: calc(100% + 10px);
  top: -20px; /* negative to overflow above header */
  min-width: 500px;
  background: #fff;
  border: 1px solid #e0d7e7;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.13);
  padding: 16px 20px;
  z-index: 10;
  color: #222;
  /* font-size: 0.98rem; */
}

.bubble-title {
  font-weight: 700;
  margin-bottom: 7px;
  /* font-size: 1.06rem; */
}

.bubble::before {
  content: '';
  position: absolute;
  left: -12px;
  top: 28px;
  width: 0;
  height: 0;
  border-top: 10px solid transparent;
  border-bottom: 10px solid transparent;
  border-right: 12px solid #fff;
  filter: drop-shadow(-1px 0 0 #e0d7e7);
}
</style>
