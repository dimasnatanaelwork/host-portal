<script lang="ts" setup>
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import PrimaryBtn from '../Buttons/PrimaryBtn.vue'
import Multiselect from 'vue-multiselect'
import 'vue-multiselect/dist/vue-multiselect.css'
import DeleteIconNoBg from '../Icons/DeleteIconNoBg.vue'
import UploadedFileIcon from '../Icons/UploadedFileIcon.vue'
import GraphemeSplitter from 'grapheme-splitter'
import TagComponent from '../Tag/TagComponent.vue'
import type { LabelValueOption } from '@/interfaces/general_interface'

const splitter = new GraphemeSplitter()

export interface ExistingFileRef {
  name: string
  url: string
  isExisting: true
}

type InputValue = string | number | boolean | File | ExistingFileRef | null

// Validation rule types
export interface ValidationRule {
  type: 'regex' | 'custom' | 'minLength' | 'maxLength' | 'required'
  pattern?: RegExp
  message: string
  validator?: (value: any) => boolean
  minLength?: number
  maxLength?: number
}

const props = defineProps<{
  title?: string
  subtitle?: string
  hint?: string
  placeholder?: string
  type:
    | 'text'
    | 'checkbox'
    | 'textarea'
    | 'file'
    | 'dropdown'
    | 'time'
    | 'slider-select'
    | 'grid-select'
  required?: boolean
  disabled?: boolean
  textAreaLimit?: number
  textAreaRows?: number
  modelValue: InputValue
  accept?: string // e.g. ".png,.jpg,.pdf"
  maxSizeMB?: number // max file size in megabytes
  options?: LabelValueOption[]
  labelTop?: boolean
  sliderOptions?: {
    value: number
    label: string
    description: string
  }[]
  gridOptions?: {
    id: number
    price: string
    description: string
    note?: string
  }[]
  selectedGridTag?: string
  hasPreselectedGrid?: boolean
  preselectedGrid?: number
  hasSubInput?: boolean
  // New validation props
  validationRules?: ValidationRule[]
  validateOnInput?: boolean // Default: true for real-time validation
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: InputValue): void
  (e: 'validation-change', isValid: boolean, errors: string[]): void
}>()

// Validation state
const validationErrors = ref<string[]>([])
const isValid = ref(true)

// Validate input based on rules
function validateInput(value: InputValue): { isValid: boolean; errors: string[] } {
  // console.log('VALIDATING')
  const errors: string[] = []

  if (!props.validationRules || props.validationRules.length === 0) {
    console.log('no rules . . .')
    return { isValid: true, errors: [] }
  }

  const stringValue = typeof value === 'string' ? value : String(value || '')

  for (const rule of props.validationRules) {
    switch (rule.type) {
      case 'required':
        if (!value || (typeof value === 'string' && value.trim() === '')) {
          errors.push(rule.message)
        }
        break

      case 'regex':
        if (rule.pattern && stringValue && !rule.pattern.test(stringValue)) {
          errors.push(rule.message)
        }
        break

      case 'minLength':
        if (rule.minLength && stringValue.length < rule.minLength) {
          errors.push(rule.message)
        }
        break

      case 'maxLength':
        if (rule.maxLength && stringValue.length > rule.maxLength) {
          errors.push(rule.message)
        }
        break

      case 'custom':
        if (rule.validator && !rule.validator(value)) {
          errors.push(rule.message)
        }
        break
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

// Update validation state
function updateValidation(value: InputValue) {
  // console.log('updating validation')
  const validation = validateInput(value)
  validationErrors.value = validation.errors
  isValid.value = validation.isValid
  emit('validation-change', validation.isValid, validation.errors)
}

// Watch for value changes to validate
watch(
  () => props.modelValue,
  (newValue) => {
    // console.log('model value changed')
    if (props.validateOnInput !== false) {
      // console.log('YES. validate')
      updateValidation(newValue)
    }
  },
  { immediate: true },
)

function isExistingFile(value: InputValue): value is ExistingFileRef {
  return !!value && typeof value === 'object' && 'isExisting' in value
}

const fileName = computed(() => {
  if (!props.modelValue) return ''
  if (props.modelValue instanceof File) return props.modelValue.name
  if (isExistingFile(props.modelValue)) return props.modelValue.name
  return ''
})

const fileSize = computed(() => {
  if (props.modelValue instanceof File) {
    return formatFileSize(props.modelValue.size)
  }
  return ''
})

function onInput(event: Event) {
  const target = event.target as HTMLInputElement | HTMLTextAreaElement
  emit('update:modelValue', target.value)
}

function onTextareaInput(event: Event) {
  const target = event.target as HTMLTextAreaElement
  const value = target.value

  if (props.textAreaLimit) {
    const currentLength = splitter.countGraphemes(value)
    if (currentLength <= props.textAreaLimit) {
      emit('update:modelValue', value)
    } else {
      // If exceeded, truncate to the limit
      const graphemes = splitter.splitGraphemes(value)
      const truncated = graphemes.slice(0, props.textAreaLimit).join('')
      target.value = truncated
      emit('update:modelValue', truncated)
    }
  } else {
    emit('update:modelValue', value)
  }
}

function onCheckboxChange(event: Event) {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.checked)
}

const internalValue = computed({
  get: () => {
    // Find the option object that matches modelValue
    return props.options?.find((opt) => opt.value === props.modelValue) ?? null
  },
  set: (option) => {
    emit('update:modelValue', option ? option.value : '')
  },
})

const fileInputRef = ref<HTMLInputElement | null>(null)
const dragActive = ref(false)
const error = ref<string | null>(null)

function triggerFileDialog() {
  fileInputRef.value?.click()
}

function validateFile(file: File): boolean {
  error.value = null

  if (props.accept) {
    const acceptedTypes = props.accept.split(',').map((type) => type.trim().toLowerCase())
    const fileName = file.name.toLowerCase()
    const fileType = file.type.toLowerCase()

    // Check extension and MIME type
    const isAccepted = acceptedTypes.some((type) => {
      if (type.startsWith('.')) {
        return fileName.endsWith(type)
      }
      return fileType === type
    })

    if (!isAccepted) {
      error.value = `Invalid file type. Allowed: ${props.accept}`
      return false
    }
  }

  if (props.maxSizeMB && file.size > props.maxSizeMB * 1024 * 1024) {
    error.value = `File is too large. Max size is ${props.maxSizeMB} MB.`
    return false
  }

  return true
}

function onFileChange(event: Event): void {
  const target = event.target as HTMLInputElement
  if (!target.files || target.files.length === 0) {
    emit('update:modelValue', null)
    error.value = null
    return
  }
  const file = target.files[0]
  if (validateFile(file)) {
    emit('update:modelValue', file)
  } else {
    emit('update:modelValue', null)
    // Clear input so user can retry same file
    if (fileInputRef.value) fileInputRef.value.value = ''
  }
}

function onDrop(event: DragEvent) {
  event.preventDefault()
  dragActive.value = false
  if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
    const file = event.dataTransfer.files[0]
    if (validateFile(file)) {
      emit('update:modelValue', file)
    } else {
      emit('update:modelValue', null)
    }
  }
}

function onDragOver(event: DragEvent) {
  event.preventDefault()
  dragActive.value = true
}

function onDragLeave(event: DragEvent) {
  event.preventDefault()
  dragActive.value = false
}

function clearFile() {
  emit('update:modelValue', null)
  error.value = null
  if (fileInputRef.value) fileInputRef.value.value = ''
}

function formatFileSize(size: number): string {
  if (size > 1024 * 1024) return (size / (1024 * 1024)).toFixed(2) + ' MB'
  if (size > 1024) return (size / 1024).toFixed(1) + ' KB'
  return size + ' bytes'
}

const remainingCharacters = computed(() => {
  if (props.type !== 'textarea' || !props.textAreaLimit) return 0
  const valueStr = typeof props.modelValue === 'string' ? props.modelValue : ''
  const currentLength = splitter.countGraphemes(valueStr)
  return props.textAreaLimit - currentLength
})

const hour = ref('')
const minute = ref('')

if (props.type === 'time' && typeof props.modelValue === 'string') {
  const parts = props.modelValue.split(':')
  hour.value = parts[0] ?? ''
  minute.value = parts[1] ?? ''
}

watch(
  () => props.modelValue,
  (newVal) => {
    if (props.type === 'time' && typeof newVal === 'string') {
      const parts = newVal.split(':')
      hour.value = parts[0] ?? ''
      minute.value = parts[1] ?? ''
    }
  },
  { immediate: true },
)

watch([hour, minute], ([newHour, newMinute]) => {
  const h = newHour.padStart(2, '0').slice(0, 2)
  const m = newMinute.padStart(2, '0').slice(0, 2)
  emit('update:modelValue', `${h}:${m}`)
})

function onHourInput(e: Event) {
  const val = (e.target as HTMLInputElement).value
  if (/^\d{0,2}$/.test(val)) {
    const num = Number(val)
    if (num >= 0 && num <= 23) hour.value = val
  }
}

function onMinuteInput(e: Event) {
  const val = (e.target as HTMLInputElement).value
  if (/^\d{0,2}$/.test(val)) {
    const num = Number(val)
    if (num >= 0 && num <= 59) minute.value = val
  }
}

function onNumberKeydown(event: KeyboardEvent) {
  // Allow control keys: backspace, tab, arrows, delete, enter, escape
  const allowedKeys = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete', 'Enter', 'Escape']
  if (
    allowedKeys.includes(event.key) ||
    ((event.ctrlKey || event.metaKey) && ['a', 'c', 'v', 'x'].includes(event.key.toLowerCase()))
  ) {
    return // allow these keys
  }
  // Block any non-digit key
  if (!/^\d$/.test(event.key)) {
    event.preventDefault()
  }
}

const selectedSliderOption = computed(() => {
  return (
    props.sliderOptions?.find((opt) => opt.value === props.modelValue) ?? props.sliderOptions?.[0]
  )
})

const SLIDER_ACTIVE_COLOR = '#273C8C'
const SLIDER_INACTIVE_COLOR = '#dee2e6' // Bootstrap gray-200

const sliderTrackBg = computed(() => {
  return `linear-gradient(to right, ${SLIDER_ACTIVE_COLOR} 0%, ${SLIDER_ACTIVE_COLOR} ${sliderPercent.value}%, ${SLIDER_INACTIVE_COLOR} ${sliderPercent.value}%, ${SLIDER_INACTIVE_COLOR} 100%)`
})

const sliderIndex = computed(() => {
  return props.sliderOptions?.findIndex((opt) => opt.value === props.modelValue) ?? 0
})
const sliderPercent = computed(() => {
  const total = (props.sliderOptions?.length ?? 1) - 1
  return total > 0 ? Math.round((sliderIndex.value / total) * 100) : 0
})

function onSliderInput(event: Event) {
  const idx = Number((event.target as HTMLInputElement).value)
  if (!props.sliderOptions) return
  emit('update:modelValue', props.sliderOptions[idx].value)
}

const gridOptions = computed(() => props.gridOptions ?? [])

const selectedGrid = ref<number | null>(null)

if (typeof props.modelValue === 'number') {
  selectedGrid.value = props.modelValue
}

watch(
  () => props.modelValue,
  (newVal) => {
    if (typeof newVal === 'number') {
      selectedGrid.value = newVal
    } else {
      selectedGrid.value = null
    }
  },
  { immediate: true },
)

function selectGrid(id: number) {
  selectedGrid.value = id
  emit('update:modelValue', id)
}
</script>

<template>
  <div class="row">
    <!-- label and sublabel -->
    <template v-if="(title && title != '') || (subtitle && subtitle != '')">
      <div
        class="d-flex flex-column align-items-start"
        :class="[labelTop ? 'col-12 mb-2' : 'col-3']"
      >
        <span v-if="title && title != ''" class="medium-text fw-600">
          {{ title }}{{ required ? '*' : '' }}
        </span>
        <span v-if="subtitle && subtitle != ''" class="small-text subtext">
          {{ subtitle }}
        </span>
      </div>
    </template>

    <!-- actual input -->
    <div :class="[labelTop ? 'col-12' : 'col-9']">
      <div class="d-flex w-100 gap-3 h-100" :class="[labelTop ? 'flex-row' : 'flex-column']">
        <!-- main input -->
        <div :class="[hasSubInput && labelTop ? 'w-50' : 'w-100', 'h-100']">
          <template v-if="type == 'text'">
            <div class="form-group h-100 d-flex flex-column">
              <input
                type="text"
                :placeholder="placeholder"
                class="form-control mb-1"
                :class="{ 'is-invalid': validationErrors.length > 0 }"
                :value="modelValue as string"
                @input="onInput"
                :required="required ? true : undefined"
                :disabled="disabled ? true : undefined"
              />
              <!-- Validation errors -->
              <div v-if="validationErrors.length > 0" class="invalid-feedback d-flex flex-row">
                <div
                  v-for="error in validationErrors"
                  :key="error"
                  class="validation-error smaller-text"
                >
                  {{ error }}&nbsp;
                </div>
              </div>
              <template v-if="hint != null">
                <span class="smaller-text" style="color: #979797">{{ hint }}</span>
              </template>
            </div>
          </template>

          <template v-else-if="type == 'checkbox'">
            <input
              type="checkbox"
              class="form-check-input"
              :checked="modelValue as boolean"
              @change="onCheckboxChange"
              :required="required ? true : undefined"
              :disabled="disabled ? true : undefined"
            />
          </template>

          <template v-else-if="type == 'textarea'">
            <div class="form-group h-100 d-flex flex-column">
              <div class="d-flex flex-column align-items-end">
                <textarea
                  class="form-control mb-1"
                  :class="{ 'is-invalid': validationErrors.length > 0 }"
                  :value="modelValue as string"
                  @input="onTextareaInput"
                  :required="required ? true : undefined"
                  :disabled="disabled ? true : undefined"
                  :rows="textAreaRows ?? 12"
                />
                <!-- Validation errors -->
                <div v-if="validationErrors.length > 0" class="invalid-feedback d-flex flex-row">
                  <div
                    v-for="error in validationErrors"
                    :key="error"
                    class="validation-error smaller-text"
                  >
                    {{ error }}&nbsp;
                  </div>
                </div>
                <div class="w-100 d-flex flex-row justify-content-between">
                  <div>
                    <template v-if="hint != null">
                      <span class="smaller-text" style="color: #979797">{{ hint }}</span>
                    </template>
                  </div>
                  <div>
                    <template v-if="textAreaLimit != null">
                      <span
                        class="smaller-text"
                        :class="{ 'text-danger': remainingCharacters < 0 }"
                      >
                        {{ Math.max(0, remainingCharacters) }}/{{ textAreaLimit }}
                      </span>
                    </template>
                  </div>
                </div>
              </div>
            </div>
          </template>

          <template v-else-if="type === 'file'">
            <div class="d-flex flex-column">
              <div class="file-upload-input-container">
                <!-- Upload Area -->
                <div
                  class="file-upload-wrapper"
                  :class="{ disabled: !!modelValue, dragActive: dragActive }"
                  @click="!modelValue && triggerFileDialog()"
                  @dragover="!modelValue && onDragOver"
                  @dragleave="!modelValue && onDragLeave"
                  @drop="!modelValue && onDrop"
                  :aria-disabled="!!modelValue"
                  tabindex="0"
                >
                  <input
                    ref="fileInputRef"
                    type="file"
                    class="d-none"
                    @change="onFileChange"
                    :required="required ? true : undefined"
                    :disabled="!!modelValue || disabled"
                    :accept="accept"
                  />
                  <div class="upload-prompt" v-if="!modelValue">
                    <PrimaryBtn
                      btnText="Choose File"
                      :disabled="!!modelValue || disabled"
                      @click.stop.prevent="!modelValue && triggerFileDialog()"
                    />
                    <span class="drop-text">Drop file or click to choose</span>
                  </div>
                  <div v-else class="upload-prompt disabled">
                    <PrimaryBtn btnText="Choose File" :disabled="true" />
                    <span class="drop-text text-muted">File selected</span>
                  </div>
                </div>

                <div class="specs">
                  <small v-if="accept" class="file-accept">
                    *{{ accept }} (Max file: {{ maxSizeMB }} MB)
                  </small>
                </div>

                <div v-if="error" class="text-danger mt-1">{{ error }}</div>
              </div>

              <!-- File Card (shown when file is present) -->
              <div
                v-if="modelValue"
                class="file-card mt-3 d-flex align-items-center justify-content-between shadow-sm rounded p-3"
              >
                <div class="d-flex flex-row align-items-center">
                  <UploadedFileIcon />
                  <div class="d-flex flex-column">
                    <span class="file-name small-text ms-3 flex-grow-1">
                      {{ fileName }}
                    </span>
                    <span v-if="fileSize" class="file-size small-text ms-3 text-muted">
                      {{ fileSize }}
                    </span>
                  </div>
                </div>

                <DeleteIconNoBg @click.stop="clearFile" style="cursor: pointer" />
              </div>
            </div>
          </template>

          <template v-else-if="type === 'dropdown'">
            <Multiselect
              v-model="internalValue"
              :options="options ?? []"
              :searchable="false"
              :close-on-select="true"
              :show-labels="false"
              :disabled="disabled"
              :placeholder="placeholder ?? 'Select an option'"
              label="label"
              track-by="value"
              class="custom-multiselect"
            />
          </template>

          <template v-else-if="type === 'time'">
            <div class="d-flex align-items-center gap-2">
              <input
                type="number"
                class="form-control time-input"
                placeholder="hh"
                :value="hour"
                @input="onHourInput"
                @keydown="onNumberKeydown"
                :required="required ? true : undefined"
                :disabled="disabled ? true : undefined"
                aria-label="Hours"
                min="0"
                max="23"
                inputmode="numeric"
                pattern="[0-9]*"
              />
              <span>:</span>
              <input
                type="number"
                class="form-control time-input"
                placeholder="mm"
                :value="minute"
                @input="onMinuteInput"
                @keydown="onNumberKeydown"
                :required="required ? true : undefined"
                :disabled="disabled ? true : undefined"
                aria-label="Minutes"
                min="0"
                max="59"
                inputmode="numeric"
                pattern="[0-9]*"
              />
              <template v-if="hint != null">
                <span class="smaller-text" style="color: #979797">{{ hint }}</span>
              </template>
            </div>
          </template>

          <template v-else-if="type === 'slider-select'">
            <div class="slider-select-container w-100">
              <input
                type="range"
                class="form-range custom-slider"
                :min="0"
                :max="(sliderOptions?.length ?? 1) - 1"
                :step="1"
                :value="sliderIndex"
                @input="onSliderInput"
                :disabled="disabled"
                :style="{ '--slider-track-bg': sliderTrackBg }"
              />
              <div class="d-flex justify-content-between w-100 mt-2">
                <div
                  v-for="(option, idx) in sliderOptions"
                  :key="option.value"
                  class="d-flex flex-column align-items-center"
                >
                  <span :class="['slider-label', { active: idx === sliderIndex }]">|</span>
                  <span :class="['slider-label', { active: idx === sliderIndex }]">
                    {{ option.label }}
                  </span>
                </div>
              </div>
              <div class="slider-description mt-2 small-text">
                {{ selectedSliderOption?.description }}
              </div>
            </div>
          </template>

          <template v-else-if="type === 'grid-select'">
            <div class="row">
              <div v-for="(grid, index) in gridOptions" :key="index" class="col-6">
                <div
                  class="card w-100 h-100"
                  :class="{
                    selected: selectedGrid !== null && selectedGrid === grid.id,
                    disabled: disabled,
                  }"
                  @click="!disabled && selectGrid(grid.id)"
                  style="cursor: pointer"
                >
                  <template
                    v-if="
                      hasPreselectedGrid && preselectedGrid == grid.id && selectedGrid === grid.id
                    "
                  >
                    <TagComponent class="card-tag-position">
                      <template #tagContent>
                        <span class="small-text fw-600">{{ selectedGridTag ?? 'Current' }}</span>
                      </template>
                    </TagComponent>
                  </template>
                  <template v-else-if="selectedGrid === grid.id">
                    <div class="check-mark">&#x2713;</div>
                  </template>
                  <template v-else>
                    <div class="check-mark-unselected">&#x2713;</div>
                  </template>

                  <h2 class="price">{{ grid.price }}</h2>
                  <div class="d-inline-block">
                    <small class="note fw-600" v-if="grid.note">{{ grid.note }}</small>
                  </div>
                  <p class="description">{{ grid.description }}</p>
                </div>
              </div>
            </div>
          </template>
        </div>

        <!-- sub input (if exists) -->
        <template v-if="hasSubInput">
          <slot name="subinput"></slot>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.subtext {
  color: #5c5e64;
}

.validation-error {
  font-size: 0.875rem;
  color: #dc3545;
  margin-bottom: 0.25rem;
}

.validation-error:last-child {
  margin-bottom: 0;
}

.form-control {
  padding: 0.675rem 0.75rem !important;
}

.form-control.is-invalid,
.form-control.is-invalid:focus {
  border-color: #dc3545;
  box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25);
}

.invalid-feedback {
  width: 100%;
  /* margin-top: 0.25rem; */
  font-size: 0.875rem;
  color: #dc3545;
}

.invalid-feedback.d-block {
  display: block !important;
}

.file-upload-input-container {
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: 0.5rem;
}

@media (min-width: 768px) {
  .file-upload-input-container {
    flex-direction: row;
    align-items: center;
    gap: 0.5rem;
  }
}

.file-upload-wrapper {
  width: 100%;
  max-width: 24rem;
  border: 2px dashed #ccc;
  border-radius: 8px;
  padding: 1rem;
  cursor: pointer;
  user-select: none;
  position: relative;
  transition:
    border-color 0.3s,
    background-color 0.3s;
  min-width: 320px;
}

.file-upload-wrapper.dragActive {
  border-color: #4f8cff;
  background-color: #e6f0ff;
}

.file-upload-wrapper.disabled {
  pointer-events: none;
  opacity: 0.6;
}

.specs {
  margin-left: 0.5rem;
}

.upload-prompt {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
  justify-content: space-between;
}

.drop-text {
  color: #666;
}

.file-accept,
.file-size-limit {
  font-size: 0.8rem;
  color: #888;
}

.file-info {
  font-size: 0.9rem;
}

.file-name {
  font-weight: 600;
}

.time-input {
  width: 3.5rem;
  text-align: center;
  padding: 0.375rem 0.15rem;
  font-size: 1rem;
}

.file-card {
  background: #fff;
  border: 1px solid #eee;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.custom-slider {
  accent-color: #273c8c;
  height: 6px;
  width: 98% !important;
  margin-left: 0.28rem;
}

.custom-slider::-webkit-slider-thumb {
  accent-color: #273c8c;
  background: #273c8c;
  border: none;
}

.custom-slider::-moz-range-thumb {
  background: #273c8c;
  border: none;
}

.custom-slider::-ms-thumb {
  background: #273c8c;
  border: none;
}

.custom-slider::-webkit-slider-runnable-track {
  background: var(--slider-track-bg, #dee2e6);
  height: 6px;
  border-radius: 4px;
}

.custom-slider::-moz-range-track {
  background: var(--slider-track-bg, #dee2e6);
  height: 6px;
  border-radius: 4px;
}

.slider-label {
  flex: 1;
  color: #666;
}

.slider-label.active {
  color: #273c8c;
  font-weight: 700;
}

.slider-description {
  color: #555;
  min-height: 1.5em;
}

.slider-select-container {
  width: 100%;
  max-width: 30rem;
}

.card {
  flex: 0 0 auto;
  border: 0.15rem solid #ddd;
  border-radius: 1rem;
  padding: 16px;
  width: 200px;
  position: relative;
  cursor: pointer;
  scroll-snap-align: start;
  transition:
    border-color 0.3s,
    box-shadow 0.3s;
}

.card.selected {
  border-color: #273c8c;
  border-width: 0.15rem;
}

.card.disabled {
  pointer-events: none;
  opacity: 0.6;
  cursor: not-allowed !important;
}

.check-mark {
  position: absolute;
  top: 12px;
  right: 12px;
  background-color: #273c8c;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.check-mark-unselected {
  position: absolute;
  top: 12px;
  right: 12px;
  background-color: transparent;
  color: #d9d9d9;
  border-color: #d9d9d9;
  border-width: 0.1rem;
  border-style: solid;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.card-tag-position {
  position: absolute;
  top: 12px;
  right: 12px;
}

.price {
  font-weight: 700;
  font-size: 1.25rem;
  margin-bottom: 4px;
}

.description {
  font-weight: 600;
  margin-bottom: 8px;
}

.note {
  display: inline-block;
  background-color: #ebfcf2;
  color: #1d9436;
  font-size: 0.75rem;
  padding: 2px 6px;
  border-radius: 4px;
}

.form-control::placeholder {
  text-align: left;
  font-weight: normal;
  color: #717680;
}
</style>
