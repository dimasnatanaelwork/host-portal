import { createRouter, createWebHistory } from 'vue-router'
import Auth from '@/views/Auth/Auth.vue'
import AiChatbot from '@/views/Dashboard/AiChatbot/Index.vue'
import AiChatbotDetail from '@/views/Dashboard/AiChatbot/Detail.vue'
import PropertyList from '@/views/Dashboard/Property/Index.vue'
import propertyDetails from '@/views/Dashboard/Property/Detail.vue'
import PersonaForm from '@/views/Dashboard/AiChatbot/Forms/Persona.vue'
import AIDocsForm from '@/views/Dashboard/AiChatbot/Forms/AIDocs.vue'
import FallbackMessageForm from '@/views/Dashboard/AiChatbot/Forms/FallbackMessage.vue'
import PropertyIntegration from '@/views/Dashboard/Property/EditForms/PropertyIntegrationForm.vue'
import PropertyInfo from '@/views/Dashboard/Property/EditForms/Info.vue'
import RoomForm from '@/views/Dashboard/Property/EditForms/RoomForm.vue'
import PrivacyPolicy from '@/views/Auth/PrivacyPolicy.vue'
import TermsOfService from '@/views/Auth/TermsOfService.vue'
import BookingList from '@/views/Dashboard/Booking/Index.vue'
import ScheduledMessage from '@/views/Dashboard/Property/EditForms/ScheduledMessage.vue'
import BookingDetail from '@/views/Dashboard/Booking/Detail.vue'
import Subscription from '@/views/Dashboard/Subscription/Index.vue'
import PlanNPricing from '@/views/Dashboard/PlanNPricing/Index.vue'
import PaymentProcessDone from '@/views/PaymentDone/Index.vue'
import Billing from '@/views/Dashboard/Billing/Index.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'auth',
      component: Auth,
    },
    {
      path: '/privacy-policy',
      name: 'PrivacyPolicy',
      component: PrivacyPolicy,
    },
    {
      path: '/terms-of-service',
      name: 'TermsOfService',
      component: TermsOfService,
    },
    {
      path: '/ai-chatbot',
      name: 'AIChatbotList',
      component: AiChatbot,
    },
    {
      path: '/ai-chatbot/details/:id',
      name: 'AiChatbotDetail',
      component: AiChatbotDetail,
      props: (route) => ({ id: Number(route.params.id) }),
    },
    {
      path: '/ai-chatbot/details/persona/:id/:mode',
      name: 'PersonaForm',
      component: PersonaForm,
      props: (route) => ({ id: Number(route.params.id), mode: route.params.mode }),
    },
    {
      path: '/ai-chatbot/details/ai-docs/:id/:mode/:chatbotName/:chatbotId',
      name: 'AIDocsForm',
      component: AIDocsForm,
      props: (route) => ({
        id: Number(route.params.id),
        mode: route.params.mode,
        chatbotName: route.params.chatbotName,
        chatbotId: Number(route.params.chatbotId),
      }),
    },
    {
      path: '/ai-chatbot/details/fallback-message/:id/:mode/:chatbotName/:chatbotId',
      name: 'FallbackMessageForm',
      component: FallbackMessageForm,
      props: (route) => ({
        id: Number(route.params.id),
        mode: route.params.mode,
        chatbotName: route.params.chatbotName,
        chatbotId: Number(route.params.chatbotId),
      }),
    },
    {
      path: '/property',
      name: 'PropertyList',
      component: PropertyList,
    },
    {
      path: '/property/details/:id', // /:botType
      name: 'propertyDetails',
      component: propertyDetails,
      props: (route) => ({ id: Number(route.params.id) }), // , botType: route.params.botType
    },
    {
      path: '/property/details/integration/:id',
      name: 'PropertyIntegration',
      component: PropertyIntegration,
      props: (route) => ({ id: Number(route.params.id) }),
    },
    {
      path: '/property/details/info/:id/:mode',
      name: 'PropertyInfo',
      component: PropertyInfo,
      props: (route) => ({ id: Number(route.params.id), mode: route.params.mode }),
    },
    {
      path: '/property/details/scheduled-message/:id/:mode/:schedMsgId/:botType',
      name: 'ScheduledMessage',
      component: ScheduledMessage,
      props: (route) => ({
        id: Number(route.params.id),
        mode: route.params.mode,
        botType: route.params.botType,
        schedMsgId: Number(route.params.schedMsgId),
      }),
    },
    {
      path: '/property/details/:id/:mode/room/:roomId',
      name: 'RoomForm',
      component: RoomForm,
      props: (route) => ({
        id: Number(route.params.id),
        mode: route.params.mode,
        roomId: Number(route.params.roomId),
      }),
    },
    {
      path: '/booking',
      name: 'BookingList',
      component: BookingList,
    },
    {
      path: '/booking/details/:id',
      name: 'BookingDetail',
      component: BookingDetail,
      props: (route) => ({ id: Number(route.params.id) }),
    },
    {
      path: '/subscription',
      name: 'Subscription',
      component: Subscription,
    },
    {
      path: '/billing',
      name: 'Billing',
      component: Billing,
    },
    {
      path: '/plan-and-pricing/:botId/:mode',
      name: 'PlanNPricing',
      component: PlanNPricing,
      props: (route) => ({
        botId: Number(route.params.botId),
        mode: route.params.mode,
      }),
    },
    {
      path: '/payment-process-done',
      name: 'PaymentProcessDone',
      component: PaymentProcessDone,
      props: (route) => ({
        status: route.query.status,
        orderUuid: route.query.order_uuid,
      }),
    },
  ],
})

export default router
