// NOTE: This service now returns dummy data for local development / testing.
// All real network calls were removed and replaced with typed mock responses.
// If you need to re-enable real API calls, restore axios usage and HOST_URL requests.
import axios from 'axios'
import type {
  AiChatbot,
  AiChatbotDetailData,
  AiChatbotDetailResponse,
  AiChatbotListResponse,
  AiChatbotUpdateResponse,
  AiDoc,
  AiDocDetailResponse,
  EvoQrStatusData,
  GeneratedQRData,
  GenerateEvoQrResponse,
  GetEvoQrStatusResponse,
  ForwardRuleData,
  ForwardRuleResponse,
} from '@/interfaces/aichatbot'
import type { ExistingFileRef } from '@/components/Form/FormInput.vue'

const HOST_URL = import.meta.env.VITE_API_HOST

export async function fetchAiChatbotList(token: string): Promise<AiChatbotListResponse> {
  // Return dummy list
  return {
    status: 'success',
    status_code: 200,
    msg: null,
    data: {
      ai_chatbots: [
        {
          id: 1,
          name: 'Demo Bot',
          openai_persona: 'Helpful assistant',
          openai_model: 'gpt-4',
          openai_temperature: '0.7',
          evolution_instance_mobile: '+1234567890',
          evolution_instance_name: 'demo-evo',
          evolution_instance_id: 'evo-1',
          evolution_instance_state: 'connected',
          openai_merchant_info: {},
          evolution_intgration_type: 'whatsapp',
          evolution_waba_token: null,
          waba_id: null,
          chatwoot_account_id: '',
          chatwoot_token: '',
          chatwoot_url: '',
          forward_message_to: '',
          forward_message_condition: '',
          forward_message_response: '',
          subscription: {} as any,
          subscription_packages: {} as any,
          isms: { username: null, isms_password: null, isms_sendid: null },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          ai_docs: [],
          billing_charges: [],
          yearly_billing_charges: [],
          query_room_rate: 0,
        },
      ],
    },
  }
}

export async function fetchAIChatbotDetail(
  token: string,
  chatbotID: number,
): Promise<AiChatbotDetailResponse> {
  // Return dummy detail
  return {
    status: 'success',
    status_code: 200,
    msg: null,
    data: {
      ai_chatbot: {
        id: chatbotID,
        name: `Demo Bot ${chatbotID}`,
        openai_persona: 'Helpful assistant',
        openai_model: 'gpt-4',
        openai_temperature: '0.7',
        evolution_instance_mobile: '+1234567890',
        evolution_instance_name: 'demo-evo',
        evolution_instance_id: 'evo-1',
        evolution_instance_state: 'connected',
        openai_merchant_info: {},
        evolution_intgration_type: 'whatsapp',
        evolution_waba_token: null,
        waba_id: null,
        chatwoot_account_id: '',
        chatwoot_token: '',
        chatwoot_url: '',
        forward_message_to: '',
        forward_message_condition: '',
        forward_message_response: '',
        subscription: {} as any,
        subscription_packages: {} as any,
        isms: { username: null, isms_password: null, isms_sendid: null },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        ai_docs: [],
        billing_charges: [],
        yearly_billing_charges: [],
        query_room_rate: 0,
      },
      hotels: [],
      forward_rules: [],
    },
  }
}

export async function fetchAIDocDetail(
  token: string,
  aiDocID: number,
): Promise<AiDocDetailResponse> {
  return {
    status: 'success',
    status_code: 200,
    msg: null,
    data: {
      ai_doc: {
        id: aiDocID,
        name: `Sample Doc ${aiDocID}`,
        persona: 'Reference persona',
        doc_url: `https://example.com/docs/${aiDocID}`,
      },
    },
  }
}

export async function updateChatbotPersona(
  token: string,
  aiBotId: number,
  name?: string,
  openAiPersona?: string,
  openaiTemperature?: string,
  queryRoomRate?: number,
  isPaused?: number,
): Promise<AiChatbotUpdateResponse> {
  const formData = new FormData()
  formData.append('aibot_id', aiBotId.toString())
  if (name !== undefined) {
    formData.append('name', name)
  }
  if (openAiPersona !== undefined) {
    formData.append('openai_persona', openAiPersona)
  }
  if (openaiTemperature !== undefined) {
    formData.append('openai_temperature', openaiTemperature)
  }
  if (queryRoomRate !== undefined) {
    formData.append('query_room_rate', queryRoomRate.toString())
  }
  if (isPaused !== undefined) {
    formData.append('is_paused', isPaused.toString())
  }

  // Return updated dummy chatbot
  return {
    status: 'success',
    status_code: 200,
    msg: null,
    data: {
      ai_chatbot: {
        id: aiBotId,
        name: name ?? `Demo Bot ${aiBotId}`,
        openai_persona: openAiPersona ?? 'Helpful assistant',
        openai_model: 'gpt-4',
        openai_temperature: openaiTemperature ?? '0.7',
        evolution_instance_mobile: '+1234567890',
        evolution_instance_name: 'demo-evo',
        evolution_instance_id: 'evo-1',
        evolution_instance_state: 'connected',
        openai_merchant_info: {},
        evolution_intgration_type: 'whatsapp',
        evolution_waba_token: null,
        waba_id: null,
        chatwoot_account_id: '',
        chatwoot_token: '',
        chatwoot_url: '',
        forward_message_to: '',
        forward_message_condition: '',
        forward_message_response: '',
        subscription: {} as any,
        subscription_packages: {} as any,
        isms: { username: null, isms_password: null, isms_sendid: null },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        ai_docs: [],
        billing_charges: [],
        yearly_billing_charges: [],
        query_room_rate: queryRoomRate ?? 0,
      },
    },
  }
}

export async function addAiDoc(
  token: string,
  aiBotId: number,
  name: string,
  persona: string,
  file: File | ExistingFileRef | null,
): Promise<AiDocDetailResponse> {
  const formData = new FormData()
  formData.append('name', name)
  formData.append('persona', persona)
  formData.append('aibot_id', aiBotId.toString())

  if (file instanceof File) {
    formData.append('file', file)
  }

  // Return created dummy doc
  return {
    status: 'success',
    status_code: 200,
    msg: null,
    data: {
      ai_doc: {
        id: Math.floor(Math.random() * 10000),
        name,
        persona,
        doc_url: file instanceof File ? `file://${file.name}` : `https://example.com/docs/${name}`,
      },
    },
  }
}

export async function editAiDoc(
  token: string,
  aiDocId: number,
  name: string,
  persona: string,
  file: File | ExistingFileRef | null,
): Promise<AiDocDetailResponse> {
  const formData = new FormData()
  formData.append('name', name)
  formData.append('persona', persona)
  formData.append('aidoc_id', aiDocId.toString())

  if (file instanceof File) {
    formData.append('file', file)
  }

  return {
    status: 'success',
    status_code: 200,
    msg: null,
    data: {
      ai_doc: {
        id: aiDocId,
        name,
        persona,
        doc_url:
          file instanceof File ? `file://${file.name}` : `https://example.com/docs/${aiDocId}`,
      },
    },
  }
}

export async function updateFallbackMessage(
  token: string,
  aiBotId: number,
  forwardMsgTo: string,
  forwardMsgCondition: string,
  forwardMsgResponse: string,
): Promise<AiChatbotUpdateResponse> {
  const formData = new FormData()
  formData.append('forward_message_to', forwardMsgTo)
  formData.append('forward_message_condition', forwardMsgCondition)
  formData.append('forward_message_response', forwardMsgResponse)
  formData.append('aibot_id', aiBotId.toString())

  return {
    status: 'success',
    status_code: 200,
    msg: null,
    data: {
      ai_chatbot: {
        id: aiBotId,
        name: `Demo Bot ${aiBotId}`,
        openai_persona: '',
        openai_model: 'gpt-4',
        openai_temperature: '0.7',
        evolution_instance_mobile: '',
        evolution_instance_name: '',
        evolution_instance_id: '',
        evolution_instance_state: 'connected',
        openai_merchant_info: {},
        evolution_intgration_type: '',
        evolution_waba_token: null,
        waba_id: null,
        chatwoot_account_id: '',
        chatwoot_token: '',
        chatwoot_url: '',
        forward_message_to: forwardMsgTo,
        forward_message_condition: forwardMsgCondition,
        forward_message_response: forwardMsgResponse,
        subscription: {} as any,
        subscription_packages: {} as any,
        isms: { username: null, isms_password: null, isms_sendid: null },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        ai_docs: [],
        billing_charges: [],
        yearly_billing_charges: [],
        query_room_rate: 0,
      },
    },
  }
}

export async function removeAiDoc(
  token: string,
  aiDocID: number,
): Promise<AiChatbotDetailResponse> {
  return {
    status: 'success',
    status_code: 200,
    msg: null,
    data: {
      ai_chatbot: {
        id: 0,
        name: '',
        openai_persona: '',
        openai_model: 'gpt-4',
        openai_temperature: '0.7',
        evolution_instance_mobile: '',
        evolution_instance_name: '',
        evolution_instance_id: '',
        evolution_instance_state: 'connected',
        openai_merchant_info: {},
        evolution_intgration_type: '',
        evolution_waba_token: null,
        waba_id: null,
        chatwoot_account_id: '',
        chatwoot_token: '',
        chatwoot_url: '',
        forward_message_to: '',
        forward_message_condition: '',
        forward_message_response: '',
        subscription: {} as any,
        subscription_packages: {} as any,
        isms: { username: null, isms_password: null, isms_sendid: null },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        ai_docs: [],
        billing_charges: [],
        yearly_billing_charges: [],
        query_room_rate: 0,
      },
      hotels: [],
      forward_rules: [],
    },
  }
}

export async function postGenerateEvoQR(
  token: string,
  aibotId: number,
): Promise<GenerateEvoQrResponse> {
  // Return dummy generated QR
  return {
    status: 'success',
    status_code: 200,
    msg: null,
    data: {
      merchant: {
        id: 1,
        payment_user_id: 1,
        is_official: 0,
        name: 'Demo Merchant',
        wabot_instance_id: null,
        wabot_access_token: null,
        bukku_access_token: null,
        bukku_subdomain: null,
        openai_persona: null,
        recommend_openai_persona: null,
        query_room_rate: 0,
        need_ai_suggest: 0,
        recommend_openai_updated_at: null,
        total_first_charges: '0',
        total_yearly_first_charges: '0',
        total_yearly_charges: '0',
        total_monthly_charges: '0',
        openai_model: 'gpt-4',
        fine_tuned_model: '',
        free_days: 0,
        collect_passport_id: 0,
        issue_invoice: 0,
        store_carplate: 0,
        openai_temperature: '0.7',
        evolution_instance_mobile: '',
        evolution_instance_name: '',
        evolution_instance_id: '',
        evolution_instance_state: '',
        openai_merchant_info: [],
        openai_image_recognition: 0,
        chat_type: '',
        use_openai_assistant: 0,
        openai_assistant_id: null,
        vector_store_id: null,
        notify_mobile_no: null,
        evolution_intgration_type: '',
        evolution_waba_token: null,
        waba_id: null,
        chatwoot_account_id: null,
        chatwoot_token: null,
        chatwoot_url: null,
        use_file_search: 0,
        store_image: 0,
        including_lead_info: 0,
        ai_start_command: '',
        ai_stop_command: '',
        is_support_careplus: 0,
        careplus_member_access_token: null,
        careplus_merchant_access_token: null,
        openai_audio_recognition: 0,
        forward_message_to: '',
        forward_message_condition: '',
        forward_message_response: '',
        webchat_active: 0,
        webchat_maincolor: '',
        webchat_msgcolor: '',
        webchat_logo: '',
        webchat_maintitle_active: 0,
        webchat_maintitle: '',
        webchat_introduction: null,
        webchat_sub_introduction: null,
        call_to_actions: null,
        webchat_sound: 0,
        webchat_textcolor: '',
        subscription_expired_at: new Date().toISOString(),
        subscription_status: 'active',
        unsubscribed_at: new Date().toISOString(),
        isms_username: '',
        isms_password: '',
        isms_sendid: '',
        first_payment: 0,
        is_paused: 0,
        twoc2p_card_token: '',
        twoc2p_card_no: '',
        package_type: '',
        deleted_at: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        is_chat_gpt5: false,
        hotel: {} as any,
      },
      qrcode: {
        pairingCode: null,
        code: `QR_${aibotId}_${Date.now()}`,
        base64: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA',
        count: 1,
      },
    },
  }
}

// /api/aibots/forwardRule/create
export async function postCreateForwardRule(
  token: string,
  aiBotId: number,
  forwardRuleTitle: string,
  forwardMsgTo: string,
  functionInstruction: string,
  forwardMsgResponse: string,
  isEnable: number,
): Promise<ForwardRuleResponse> {
  const formData = new FormData()
  formData.append('aibot_id', aiBotId.toString())
  formData.append('title', forwardRuleTitle)
  formData.append('forward_message_to', forwardMsgTo)
  formData.append('function_instruction', functionInstruction)
  formData.append('forward_message_response', forwardMsgResponse)
  formData.append('is_enable', isEnable.toString())

  return {
    status: 'success',
    status_code: 200,
    msg: null,
    data: {
      forward_rule: {
        id: Math.floor(Math.random() * 10000),
        title: forwardRuleTitle,
        forward_message_to: forwardMsgTo,
        function_instruction: functionInstruction,
        forward_message_response: forwardMsgResponse,
        params: [],
        is_enable: isEnable,
        created_at: new Date().toISOString(),
      },
    },
  }
}

export async function getCheckQRStatus(
  token: string,
  aibotId: number,
): Promise<GetEvoQrStatusResponse> {
  // Return a cycling dummy status between 'open' and 'connecting'
  const state: 'open' | 'connecting' | null = Math.random() > 0.5 ? 'open' : 'connecting'
  return {
    status: 'success',
    status_code: 200,
    msg: null,
    data: { state },
  }
}

// /api/aibots/forwardRule/update
export async function postUpdateForwardRule(
  token: string,
  aiBotId: number,
  forwardRuleId: number,
  forwardRuleTitle: string,
  forwardMsgTo: string,
  functionInstruction: string,
  forwardMsgResponse: string,
  isEnable: number,
): Promise<ForwardRuleResponse> {
  const formData = new FormData()
  formData.append('aibot_id', aiBotId.toString())
  formData.append('forward_rule_id', forwardRuleId.toString())
  formData.append('title', forwardRuleTitle)
  formData.append('forward_message_to', forwardMsgTo)
  formData.append('function_instruction', functionInstruction)
  formData.append('forward_message_response', forwardMsgResponse)
  formData.append('is_enable', isEnable.toString())

  return {
    status: 'success',
    status_code: 200,
    msg: null,
    data: {
      forward_rule: {
        id: forwardRuleId,
        title: forwardRuleTitle,
        forward_message_to: forwardMsgTo,
        function_instruction: functionInstruction,
        forward_message_response: forwardMsgResponse,
        params: [],
        is_enable: isEnable,
        created_at: new Date().toISOString(),
      },
    },
  }
}

// /api/aibots/forwardRule/detail?forward_rule_id=3&aibot_id=1
export async function getRetrieveForwardRule(
  token: string,
  aiBotId: number,
  forwardRuleId: number,
): Promise<ForwardRuleResponse> {
  return {
    status: 'success',
    status_code: 200,
    msg: null,
    data: {
      forward_rule: {
        id: forwardRuleId,
        title: `Rule ${forwardRuleId}`,
        forward_message_to: 'owner',
        function_instruction: '',
        forward_message_response: 'Forwarded message',
        params: [],
        is_enable: 1,
        created_at: new Date().toISOString(),
      },
    },
  }
}
