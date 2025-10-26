import { ref } from 'vue'

import { useAuthToken } from '@/stores/useAuthToken'
import {
  type AiDoc,
  type AiChatbotDetailData,
  type AiChatbotDetailResponse,
  type AiChatbotListData,
  type AiChatbotListResponse,
  type AiDocDetailResponse,
  type AiChatbotUpdateResponse,
  type GenerateEvoQrResponse,
  type GeneratedQRData,
  type GetEvoQrStatusResponse,
  type EvoQrStatusData,
  type ForwardRuleResponse,
  type ForwardRuleData,
  type ForwardRule,
} from '@/interfaces/aichatbot'
import {
  addAiDoc,
  editAiDoc,
  fetchAIChatbotDetail,
  fetchAiChatbotList,
  fetchAIDocDetail,
  getCheckQRStatus,
  postGenerateEvoQR,
  getRetrieveForwardRule,
  postCreateForwardRule,
  postUpdateForwardRule,
  removeAiDoc,
  updateChatbotPersona,
  updateFallbackMessage,
} from '@/services/aiChatbotService'
import type { ExistingFileRef } from '@/components/Form/FormInput.vue'
import { useRouter } from 'vue-router'
import { useNonAuth } from './useNonAuth'

export function useAiChatbot() {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const aiChatbotList = ref<AiChatbotListData | null>(null)
  const aiChatbotDetail = ref<AiChatbotDetailData | null>(null)
  const aiDocDetail = ref<AiDoc | null>(null)
  const evoQrData = ref<GeneratedQRData | null>(null)
  const forwardRuleDetail = ref<ForwardRule | null>(null)
  const { token } = useAuthToken()
  const { handleReroute } = useNonAuth()

  const loadAiChatbots = async (): Promise<AiChatbotListResponse> => {
    if (!token.value) {
      error.value = 'No authentication token found. Please login.'
      return {
        status: 'error',
        status_code: 401,
        msg: error.value,
        data: { ai_chatbots: [] },
      }
    }

    loading.value = true
    error.value = null
    aiChatbotList.value = null

    try {
      const response = await fetchAiChatbotList(token.value)
      if (response.status === 'success') {
        aiChatbotList.value = response.data
      } else {
        error.value = response.msg
        if (response.status_code === 401) {
          handleReroute()
        }
      }
      return response
    } catch (err: any) {
      error.value = err.message || 'Failed to load ai chatbots.'
      return {
        status: 'error',
        status_code: 500,
        msg: error.value,
        data: { ai_chatbots: [] },
      }
    } finally {
      loading.value = false
    }
  }

  const loadAiChatbotDetail = async (chatbotID: number): Promise<AiChatbotDetailResponse> => {
    if (!token.value) {
      error.value = 'No authentication token found. Please login.'
      return {
        status: 'error',
        status_code: 401,
        msg: error.value,
        data: {} as AiChatbotDetailData,
      }
    }

    loading.value = true
    error.value = null
    aiChatbotDetail.value = null

    try {
      const response = await fetchAIChatbotDetail(token.value, chatbotID)
      if (response.status === 'success') {
        aiChatbotDetail.value = response.data
      } else {
        error.value = response.msg
        if (response.status_code === 401) {
          handleReroute()
        }
      }
      return response
    } catch (err: any) {
      error.value = err.message || 'Failed to load chatbot detail.'
      return {
        status: 'error',
        status_code: 500,
        msg: error.value,
        data: {} as AiChatbotDetailData,
      }
    } finally {
      loading.value = false
    }
  }

  const updatePersona = async (
    chatbotID: number,
    options?: {
      name?: string
      openAiPersona?: string
      openaiTemperature?: string
      queryRoomRate?: number
      isPaused?: number
    },
  ): Promise<AiChatbotUpdateResponse> => {
    if (!token.value) {
      error.value = 'No authentication token found. Please login.'
      return {
        status: 'error',
        status_code: 401,
        msg: error.value,
        data: {} as AiChatbotDetailData,
      }
    }

    loading.value = true
    error.value = null

    try {
      const updatedChatbotPersona = await updateChatbotPersona(
        token.value,
        chatbotID,
        options?.name,
        options?.openAiPersona,
        options?.openaiTemperature,
        options?.queryRoomRate,
        options?.isPaused,
      )
      if (updatedChatbotPersona.status === 'success') {
        await loadAiChatbotDetail(chatbotID)
      } else {
        error.value = updatedChatbotPersona.msg
        if (updatedChatbotPersona.status_code === 401) {
          handleReroute()
        }
      }
      return updatedChatbotPersona
    } catch (err: any) {
      error.value = err.message || 'Failed to update Persona.'
      return {
        status: 'error',
        status_code: 500,
        msg: error.value,
        data: {} as AiChatbotDetailData,
      }
    } finally {
      loading.value = false
    }
  }

  const addAiDocument = async (
    chatbotID: number,
    name: string,
    persona: string,
    file: File | ExistingFileRef | null,
  ): Promise<AiDocDetailResponse> => {
    if (!token.value) {
      error.value = 'No authentication token found. Please login.'
      return {
        status: 'error',
        status_code: 401,
        msg: error.value,
        data: {
          ai_doc: {} as AiDoc,
        },
      }
    }

    loading.value = true
    error.value = null

    try {
      const addedDocument = await addAiDoc(token.value, chatbotID, name, persona, file)
      if (addedDocument.status === 'success') {
        await loadAiChatbotDetail(chatbotID)
      } else {
        error.value = addedDocument.msg
        if (addedDocument.status_code === 401) {
          handleReroute()
        }
      }

      return addedDocument
    } catch (err: any) {
      error.value = err.message || 'Failed to add AI document.'
      return {
        status: 'error',
        status_code: 500,
        msg: error.value,
        data: {
          ai_doc: {} as AiDoc,
        },
      }
    } finally {
      loading.value = false
    }
  }

  const editAiDocument = async (
    chatbotID: number,
    aiDocId: number,
    name: string,
    persona: string,
    file: File | ExistingFileRef | null,
  ): Promise<AiDocDetailResponse> => {
    if (!token.value) {
      error.value = 'No authentication token found. Please login.'
      return {
        status: 'error',
        status_code: 401,
        msg: error.value,
        data: {
          ai_doc: {} as AiDoc,
        },
      }
    }

    loading.value = true
    error.value = null

    try {
      const updatedDocument = await editAiDoc(token.value, aiDocId, name, persona, file)
      if (updatedDocument.status === 'success') {
        await loadAiChatbotDetail(chatbotID)
      } else {
        error.value = updatedDocument.msg
        if (updatedDocument.status_code === 401) {
          handleReroute()
        }
      }

      return updatedDocument
    } catch (err: any) {
      error.value = err.message || 'Failed to update AI document.'
      return {
        status: 'error',
        status_code: 500,
        msg: error.value,
        data: {
          ai_doc: {} as AiDoc,
        },
      }
    } finally {
      loading.value = false
    }
  }

  const updateFallbackMsg = async (
    chatbotID: number,
    forwardMsgTo: string,
    forwardMsgCondition: string,
    forwardMsgResponse: string,
  ): Promise<AiChatbotUpdateResponse> => {
    if (!token.value) {
      error.value = 'No authentication token found. Please login.'
      return {
        status: 'error',
        status_code: 401,
        msg: error.value,
        data: {} as AiChatbotDetailData,
      }
    }

    loading.value = true
    error.value = null

    try {
      const updatedChatbotPersona = await updateFallbackMessage(
        token.value,
        chatbotID,
        forwardMsgTo,
        forwardMsgCondition,
        forwardMsgResponse,
      )
      if (updatedChatbotPersona.status === 'success') {
        await loadAiChatbotDetail(chatbotID)
      } else {
        error.value = updatedChatbotPersona.msg
        if (updatedChatbotPersona.status_code === 401) {
          handleReroute()
        }
      }
      return updatedChatbotPersona
    } catch (err: any) {
      error.value = err.message || 'Failed to update Fallback Message.'
      return {
        status: 'error',
        status_code: 500,
        msg: error.value,
        data: {} as AiChatbotDetailData,
      }
    } finally {
      loading.value = false
    }
  }

  const loadAiDoc = async (aiDocID: number): Promise<AiDocDetailResponse> => {
    if (!token.value) {
      error.value = 'No authentication token found. Please login.'
      return {
        status: 'error',
        status_code: 401,
        msg: error.value,
        data: {
          ai_doc: {} as AiDoc,
        },
      }
    }

    loading.value = true
    error.value = null
    aiDocDetail.value = null

    try {
      const response = await fetchAIDocDetail(token.value, aiDocID)
      if (response.status === 'success') {
        aiDocDetail.value = response.data.ai_doc
      } else {
        error.value = response.msg
        if (response.status_code === 401) {
          handleReroute()
        }
      }
      return response
    } catch (err: any) {
      error.value = err.message || 'Failed to load chatbot detail.'
      return {
        status: 'error',
        status_code: 500,
        msg: error.value,
        data: {
          ai_doc: {} as AiDoc,
        },
      }
    } finally {
      loading.value = false
    }
  }

  const removeAiDocAndReload = async (
    chatbotID: number,
    aiDocID: number,
  ): Promise<AiChatbotDetailResponse> => {
    if (!token.value) {
      error.value = 'No authentication token found. Please login.'
      return {
        status: 'error',
        status_code: 401,
        msg: error.value,
        data: {} as AiChatbotDetailData,
      }
    }

    loading.value = true
    error.value = null

    try {
      const removeResponse = await removeAiDoc(token.value, aiDocID)
      if (removeResponse.status === 'success') {
        await loadAiChatbotDetail(chatbotID)
      } else {
        error.value = removeResponse.msg
        if (removeResponse.status_code === 401) {
          handleReroute()
        }
      }
      return removeResponse
    } catch (err: any) {
      error.value = err.message || 'Failed to remove AI document.'
      return {
        status: 'error',
        status_code: 500,
        msg: error.value,
        data: {} as AiChatbotDetailData,
      }
    } finally {
      loading.value = false
    }
  }

  const generateEvoQR = async (aibotId: number): Promise<GenerateEvoQrResponse> => {
    if (!token.value) {
      error.value = 'No authentication token found. Please login.'
      return {
        status: 'error',
        status_code: 401,
        msg: error.value,
        data: {} as GeneratedQRData,
      }
    }

    loading.value = true
    error.value = null

    try {
      const res = await postGenerateEvoQR(token.value, aibotId)
      if (res.status !== 'success') {
        error.value = res.msg
        if (res.status_code === 401) {
          handleReroute()
        }
      } else {
        evoQrData.value = res.data
      }

      return res
    } catch (err: any) {
      error.value = err.message || 'Failed to generate qr.'
      return {
        status: 'error',
        status_code: 500,
        msg: error.value,
        data: {} as GeneratedQRData,
      }
    } finally {
      loading.value = false
    }
  }

  const loadForwardRule = async (
    aibotId: number,
    forwardRuleId: number,
  ): Promise<ForwardRuleResponse> => {
    if (!token.value) {
      error.value = 'No authentication token found. Please login.'
      return {
        status: 'error',
        status_code: 401,
        msg: error.value,
        data: {} as ForwardRuleData,
      }
    }

    loading.value = true
    error.value = null
    forwardRuleDetail.value = null

    try {
      const response = await getRetrieveForwardRule(token.value, aibotId, forwardRuleId)
      if (response.status === 'success') {
        forwardRuleDetail.value = response.data.forward_rule
      } else {
        error.value = response.msg
        if (response.status_code === 401) {
          handleReroute()
        }
      }
      return response
    } catch (err: any) {
      error.value = err.message || 'Failed to load forward rule detail.'
      return {
        status: 'error',
        status_code: 500,
        msg: error.value,

        data: {} as ForwardRuleData,
      }
    } finally {
      loading.value = false
    }
  }

  const checkQrStatus = async (aibotId: number): Promise<GetEvoQrStatusResponse> => {
    if (!token.value) {
      error.value = 'No authentication token found. Please login.'
      return {
        status: 'error',
        status_code: 401,
        msg: error.value,
        data: {} as EvoQrStatusData,
      }
    }

    loading.value = true
    error.value = null

    try {
      const res = await getCheckQRStatus(token.value, aibotId)
      if (res.status !== 'success') {
        error.value = res.msg
        if (res.status_code === 401) {
          handleReroute()
        }
      }

      return res
    } catch (err: any) {
      error.value = err.message || 'Failed to check qr status.'
      return {
        status: 'error',
        status_code: 500,
        msg: error.value,
        data: {} as EvoQrStatusData,
      }
    } finally {
      loading.value = false
    }
  }
  const createForwardRule = async (
    aiBotId: number,
    forwardRuleTitle: string,
    forwardMsgTo: string,
    functionInstruction: string,
    forwardMsgResponse: string,
    isEnable: number,
  ): Promise<ForwardRuleResponse> => {
    if (!token.value) {
      error.value = 'No authentication token found. Please login.'
      return {
        status: 'error',
        status_code: 401,
        msg: error.value,

        data: {} as ForwardRuleData,
      }
    }

    loading.value = true
    error.value = null

    forwardRuleDetail.value = null

    try {
      const response = await postCreateForwardRule(
        token.value,
        aiBotId,
        forwardRuleTitle,
        forwardMsgTo,
        functionInstruction,
        forwardMsgResponse,
        isEnable,
      )
      if (response.status !== 'success') {
        error.value = response.msg
        if (response.status_code === 401) {
          handleReroute()
        }
      }
      return response
    } catch (err: any) {
      error.value = err.message || 'Failed to create forward rule.'
      return {
        status: 'error',
        status_code: 500,
        msg: error.value,

        data: {} as ForwardRuleData,
      }
    } finally {
      loading.value = false
    }
  }

  const updateForwardRule = async (
    aiBotId: number,
    forwardRuleId: number,
    forwardRuleTitle: string,
    forwardMsgTo: string,
    functionInstruction: string,
    forwardMsgResponse: string,
    isEnable: number,
  ): Promise<ForwardRuleResponse> => {
    if (!token.value) {
      error.value = 'No authentication token found. Please login.'
      return {
        status: 'error',
        status_code: 401,
        msg: error.value,
        data: {} as ForwardRuleData,
      }
    }

    loading.value = true
    error.value = null
    forwardRuleDetail.value = null

    try {
      const response = await postUpdateForwardRule(
        token.value,
        aiBotId,
        forwardRuleId,
        forwardRuleTitle,
        forwardMsgTo,
        functionInstruction,
        forwardMsgResponse,
        isEnable,
      )
      if (response.status !== 'success') {
        error.value = response.msg
        if (response.status_code === 401) {
          handleReroute()
        }
      }
      return response
    } catch (err: any) {
      error.value = err.message || 'Failed to update forward rule.'
      return {
        status: 'error',
        status_code: 500,
        msg: error.value,
        data: {} as ForwardRuleData,
      }
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    aiChatbotList,
    aiChatbotDetail,
    aiDocDetail,
    evoQrData,
    loadAiChatbots,
    loadAiChatbotDetail,
    updatePersona,
    addAiDocument,
    editAiDocument,
    updateFallbackMsg,
    loadAiDoc,
    removeAiDocAndReload,
    generateEvoQR,
    checkQrStatus,
    forwardRuleDetail,
    loadForwardRule,
    createForwardRule,
    updateForwardRule,
  }
}
