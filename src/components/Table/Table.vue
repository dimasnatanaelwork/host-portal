<script lang="ts" setup>
import EditIcon from '@/components/Icons/EditIcon.vue'
import DeleteIcon from '@/components/Icons/DeleteIcon.vue'
import FileIcon from '../Icons/FileIcon.vue'
import { formatDateToYYYYMMDD, formatToDDMMYYYY, getFileName, handleDownload } from '@/utils/utils'
import BroadcastIcon from '../Icons/BroadcastIcon.vue'
import ChevronLeftIcon from '../Icons/ChevronLeftIcon.vue'
import ChevronRightIcon from '../Icons/ChevronRightIcon.vue'
import PaginationItem from './PaginationItem.vue'
import { useRouter } from 'vue-router'
import SmallJanuswaIcon from '../Icons/SmallJanuswaIcon.vue'
import SmallWaIcon from '../Icons/SmallWaIcon.vue'
import ChatbotStatusBadge from './ChatbotStatusBadge.vue'
import ActiveIcon from '../Icons/status/ActiveIcon.vue'
import RejectedIcon from '../Icons/status/RejectedIcon.vue'
import PauseIcon from '../Icons/status/PauseIcon.vue'
import { computed, ref, onMounted, onUnmounted } from 'vue'
import ViewIcon from '../Icons/table/ViewIcon.vue'
import PendingIcon from '../Icons/status/PendingIcon.vue'
import DownloadIcon from '../Icons/table/DownloadIcon.vue'
import IconBtn from '../Buttons/IconBtn.vue'
import UnsubscribeIcon from '../Icons/SubsTable/UnsubscribeIcon.vue'
import SubscribeIcon from '../Icons/SubsTable/SubscribeIcon.vue'
import RefreshIcon from '../Icons/SubsTable/RefreshIcon.vue'
import PayIcon from '../Icons/SubsTable/PayIcon.vue'
import { isExpired } from '../../utils/utils'
import SyncIcon from '../Icons/table/SyncIcon.vue'
import InvoiceBtn from '../Icons/table/InvoiceBtn.vue'
import ReceiptBtn from '../Icons/table/ReceiptBtn.vue'
import StatusBadge from './StatusBadge.vue'
import DropdownMenuIcon from '../Icons/table/DropdownMenuIcon.vue'

const router = useRouter()

export interface TableHeader {
  label: string
  key: string
  type?:
    | 'text'
    | 'longtext'
    | 'breaktext'
    | 'date'
    | 'phone'
    | 'email'
    | 'action'
    | 'download_btn'
    | 'download_link'
    | 'redirect_link'
    | 'route_link'
    | 'status'
    | 'success_status'
    | 'subscription_status'
    | 'connection_status'
    | 'bot_type_evo'
    | 'bot_type_waba'
    | 'custom_icon'
  customIcon?: any
}

export interface DropdownMenuItem {
  label: string
  key: string
  icon: any // Vue component for the icon
  disabled?: boolean | ((row: any) => boolean)
}

const props = defineProps<{
  headers: TableHeader[]
  rows: any[] | undefined
  hasEdit: boolean
  hasView: boolean
  hasBroadcast: boolean
  hasDelete: boolean
  hasSync: boolean
  hasInvoiceActions?: boolean
  hasSubscriptionButtons?: boolean
  hasDropdownMenu?: boolean
  dropdownMenuItems?: DropdownMenuItem[] // for static dropdown
  noDataBtnTxt?: string
  noDataMsg?: string
  currentPage?: number
  lastPage?: number
  dropdownMenuItemsKey?: string // for dynamic dropdown
}>()

interface EmitEvents {
  (e: 'edit', row: any): void
  (e: 'view', row: any): void
  (e: 'broadcast', row: any): void
  (e: 'sync', row: any): void
  (e: 'delete', row: any): void
  (e: 'download-invoice', row: any): void
  (e: 'download-receipt', row: any): void
  (e: 'renew', row: any): void
  (e: 'unsubscribe', row: any): void
  (e: 'subscribe', row: any): void
  (e: 'pay-now', row: any): void
  (e: 'dropdown-menu-click', menuKey: string, row: any): void
  (e: 'click-page', page: number): void
  (e: 'next-page'): void
  (e: 'prev-page'): void
  (e: 'no-data-func'): void
}

const emit = defineEmits<EmitEvents>()

const activePopoverId = ref<string | null>(null)
let hoverTimer: number | null = null

function onEdit(row: any) {
  emit('edit', row)
}

function onView(row: any) {
  emit('view', row)
}

function onBroadcast(row: any) {
  emit('broadcast', row)
}

function onSync(row: any) {
  emit('sync', row)
}

function onDelete(row: any) {
  emit('delete', row)
}

function onRenew(row: any) {
  emit('renew', row)
}

function onUnsubscribe(row: any) {
  emit('unsubscribe', row)
}

function onSubscribe(row: any) {
  emit('subscribe', row)
}

function onPayNow(row: any) {
  emit('pay-now', row)
}

function emitClickedPage(page: number) {
  emit('click-page', page)
}

function emitNextPage() {
  emit('next-page')
}

function emitPrevPage() {
  emit('prev-page')
}

function noDataBtnClick(): void {
  emit('no-data-func')
}

function showPopover(rowId: string) {
  if (hoverTimer) {
    clearTimeout(hoverTimer)
    hoverTimer = null
  }
  activePopoverId.value = rowId
}

function hidePopover() {
  hoverTimer = setTimeout(() => {
    activePopoverId.value = null
  }, 150) // Small delay to allow moving to popover
}

function clearHideTimer() {
  if (hoverTimer) {
    clearTimeout(hoverTimer)
    hoverTimer = null
  }
}

function keepPopoverOpen() {
  clearHideTimer()
}

function isMenuItemDisabled(item: DropdownMenuItem, row: any): boolean {
  if (typeof item.disabled === 'boolean') {
    return item.disabled
  }

  if (typeof item.disabled === 'function') {
    return item.disabled(row)
  }

  return false
}

function handleDropdownMenuClick(menuKey: string, row: any, event: Event) {
  event.stopPropagation()

  const menuItems = props.dropdownMenuItemsKey
    ? row[props.dropdownMenuItemsKey]
    : props.dropdownMenuItems

  const menuItem = menuItems?.find((item: DropdownMenuItem) => item.key === menuKey)
  if (menuItem && isMenuItemDisabled(menuItem, row)) {
    return
  }

  emit('dropdown-menu-click', menuKey, row)
  activePopoverId.value = null
}

function getRowId(row: any): string {
  return row.id || JSON.stringify(row)
}

function handleReroute(row: any, key: string) {
  const params: Record<string, any> = {}

  const idKey = key + '_id'

  if (row[idKey] !== undefined && row[idKey] !== null) {
    params.id = row[idKey]
  }

  const botTypeKey = `${key}_botType`
  if (row[botTypeKey] !== undefined && row[botTypeKey] !== null) {
    params.botType = row[botTypeKey]
  }

  const schedMsgIdKey = `${key}_schedMsgId`
  if (row[schedMsgIdKey] !== undefined && row[schedMsgIdKey] !== null) {
    params.schedMsgId = row[schedMsgIdKey]
  }

  const modeKey = `${key}_mode`
  if (row[modeKey] !== undefined && row[modeKey] !== null) {
    params.mode = row[modeKey]
  }

  router.push({
    name: key,
    params: params,
  })
}

const siblingCount = 1

const paginationRange = computed<(number | 'ellipsis')[]>(() => {
  if (!props.currentPage || !props.lastPage) return []

  const totalPageNumbers = siblingCount * 2 + 5

  if (props.lastPage <= totalPageNumbers) {
    return Array.from({ length: props.lastPage }, (_, i) => i + 1)
  }

  const leftSiblingIndex = Math.max(props.currentPage - siblingCount, 2)
  const rightSiblingIndex = Math.min(props.currentPage + siblingCount, props.lastPage - 1)

  const shouldShowLeftEllipsis = leftSiblingIndex > 2
  const shouldShowRightEllipsis = rightSiblingIndex < props.lastPage - 1

  const pages: (number | 'ellipsis')[] = []

  pages.push(1)

  if (shouldShowLeftEllipsis) {
    pages.push('ellipsis')
  } else {
    for (let i = 2; i < leftSiblingIndex; i++) {
      pages.push(i)
    }
  }

  for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
    pages.push(i)
  }

  if (shouldShowRightEllipsis) {
    pages.push('ellipsis')
  } else {
    for (let i = rightSiblingIndex + 1; i < props.lastPage; i++) {
      pages.push(i)
    }
  }

  pages.push(props.lastPage)

  return pages
})

onUnmounted(() => {
  if (hoverTimer) {
    clearTimeout(hoverTimer)
  }
})
</script>

<template>
  <div class="table-responsive p-0 border border-rad-1">
    <table class="table align-middle mb-0">
      <thead class="px-3 py-2 small-text">
        <tr>
          <th v-for="header in headers" :key="header.key" class="fw-bold px-3 py-2">
            <!-- header for evo bot type -->
            <template v-if="header.type === 'bot_type_evo'">
              <div class="d-flex flex-row">
                <span class="fw-bold me-1">{{ header.label }}</span> <SmallJanuswaIcon />
              </div>
            </template>

            <!-- header for WABA bot type -->
            <template v-else-if="header.type === 'bot_type_waba'">
              <div class="d-flex flex-row">
                <span class="fw-bold me-1">{{ header.label }}</span> <SmallWaIcon />
              </div>
            </template>

            <!-- normal header -->
            <template v-else>
              {{ header.label }}
            </template>
          </th>
          <th
            v-if="hasEdit || hasBroadcast || hasDelete || hasSubscriptionButtons || hasDropdownMenu"
            class="fw-bold px-3 py-2"
          >
            {{ hasBroadcast ? '' : 'Action' }}
          </th>
          <th v-if="hasInvoiceActions" class="fw-bold px-3 py-2">Download</th>
        </tr>
      </thead>

      <tbody class="small-text">
        <template v-if="rows && rows.length > 0">
          <tr
            v-for="row in rows"
            :key="getRowId(row)"
            :class="{ editable: hasEdit }"
            @click="hasEdit ? onEdit(row) : null"
          >
            <td v-for="header in headers" :key="header.key" class="px-3 py-2">
              <template v-if="header.type === 'download_link'">
                <template v-if="getFileName(row[header.key]) != ''">
                  <a
                    :href="row[header.key]"
                    target="_blank"
                    rel="noopener noreferrer"
                    @click.stop.prevent="handleDownload(row[header.key])"
                  >
                    <FileIcon />
                    Open
                  </a>
                </template>
                <template v-else>-</template>
              </template>

              <template v-else-if="header.type === 'redirect_link'">
                <template
                  v-if="
                    header.key === 'whatsapp_url' &&
                    row['connection_status'] != null &&
                    row['connection_status'] == false
                  "
                >
                  <span>-</span>
                </template>
                <template v-else>
                  <a :href="row[header.key]" target="_blank" rel="noopener noreferrer" @click.stop>
                    Open
                  </a>
                </template>
              </template>

              <template v-else-if="header.type === 'route_link'">
                <a
                  @click.stop.prevent="handleReroute(row, header.key)"
                  target="_blank"
                  rel="noopener noreferrer"
                  style="color: #273c8c"
                >
                  {{ row[header.key + '_name'] }}
                </a>
              </template>

              <template v-else-if="header.type == 'status' && row[header.key]">
                <div class="d-flex flex-column">
                  <StatusBadge :text="row[header.key]" :statusType="row[header.key]" />
                </div>
              </template>

              <template v-else-if="header.type == 'connection_status'">
                <template v-if="row[header.key] == true">
                  <span class="text-clamp" style="color: #1d9436">Connected</span>
                </template>
                <template v-else>
                  <span class="text-clamp" style="color: #da1e1c">Not Connected</span>
                </template>
              </template>

              <template v-else-if="header.type == 'subscription_status' && row[header.key]">
                <div class="d-flex flex-column">
                  <ChatbotStatusBadge :text="row[header.key]" :statusType="row[header.key]">
                    <!-- icons -->
                    <template #icon v-if="row[header.key] == 'active'">
                      <ActiveIcon />
                    </template>
                    <template
                      #icon
                      v-else-if="
                        row[header.key]?.includes('inactive') ||
                        row[header.key]?.includes('expired')
                      "
                    >
                      <RejectedIcon />
                    </template>
                    <template
                      #icon
                      v-else-if="
                        row[header.key]?.includes('pending_activation') ||
                        row[header.key]?.includes('pending_payment')
                      "
                    >
                      <PendingIcon />
                    </template>

                    <!-- secondary sub status -->
                    <template
                      #secondary_status
                      v-if="row['subscription_status'] === 'active' && row['is_trial'] == true"
                    >
                      <ChatbotStatusBadge text="trial_period" statusType="trial_period" />
                    </template>
                    <template
                      #secondary_status
                      v-else-if="row[header.key]?.includes('active') && row['is_paused'] == true"
                    >
                      <ChatbotStatusBadge text="chatbot_paused" statusType="chatbot_paused" />
                    </template>
                  </ChatbotStatusBadge>
                  <template v-if="row['next_billing_date']">
                    <span class="expiry-date smaller-text">
                      Next billing date: {{ formatToDDMMYYYY(new Date(row['next_billing_date'])) }}
                    </span>
                  </template>
                  <template
                    v-else-if="
                      row[header.key]?.includes('inactive') && isExpired(row['expiry_date'])
                    "
                  >
                    <span class="expiry-date smaller-text"> Your subscription ended </span>
                  </template>
                </div>
              </template>

              <template
                v-else-if="
                  (header.type == 'bot_type_evo' || header.type == 'bot_type_waba') &&
                  row[header.key]
                "
              >
                <ChatbotStatusBadge :text="row[header.key]" :statusType="row[header.key]">
                  <template
                    #icon
                    v-if="row[header.key]?.includes('active') || row[header.key] == 'approved'"
                  >
                    <ActiveIcon />
                  </template>
                  <template #icon v-else-if="row[header.key]?.includes('rejected')">
                    <RejectedIcon />
                  </template>
                  <template #icon v-else-if="row[header.key]?.includes('pause')">
                    <PauseIcon />
                  </template>
                </ChatbotStatusBadge>
              </template>

              <template v-else-if="header.type == 'success_status'">
                <template v-if="row[header.key] == 'success'">
                  <span class="text-clamp" style="color: #1d9436">Success</span>
                </template>
                <template v-else>
                  <span class="text-clamp" style="color: #da1e1c">Failed</span>
                </template>
              </template>

              <template v-else-if="header.type == 'download_btn'">
                <a
                  href="javascript:;"
                  @click.stop="handleDownload(row[header.key])"
                  title="Download"
                >
                  <DownloadIcon />
                </a>
              </template>

              <template v-else-if="header.type == 'date'">
                <span class="text-clamp">{{
                  row[header.key] ? formatToDDMMYYYY(new Date(row[header.key])) : '-'
                }}</span>
              </template>

              <template v-else-if="header.type === 'custom_icon'">
                <component :is="header.customIcon" v-if="header.customIcon && row[header.key]" />
                <span v-else>-</span>
              </template>

              <template v-else-if="header.type == 'longtext'">
                <span class="text-clamp">{{ row[header.key] ?? '-' }}</span>
              </template>

              <template v-else-if="header.type === 'breaktext'">
                <span class="text-break">{{ row[header.key] ?? '-' }}</span>
              </template>

              <!-- default cell content -->
              <template v-else>
                <span class="single-liner">{{ row[header.key] ?? '-' }}</span>
              </template>
            </td>

            <!-- action -->
            <td
              class="px-3 py-2"
              v-if="
                hasEdit ||
                hasView ||
                hasBroadcast ||
                hasDelete ||
                hasSubscriptionButtons ||
                hasInvoiceActions ||
                hasDropdownMenu
              "
            >
              <div class="d-flex flex-row align-items-center">
                <a
                  href="javascript:;"
                  class="edit-btn"
                  @click.stop="onEdit(row)"
                  title="Edit"
                  v-if="hasEdit"
                >
                  <EditIcon />
                </a>
                <a
                  class="ms-2"
                  href="javascript:;"
                  @click.stop="onView(row)"
                  title="View"
                  v-if="hasView"
                >
                  <ViewIcon />
                </a>
                <a
                  class="ms-2"
                  href="javascript:;"
                  @click.stop="onBroadcast(row)"
                  title="Broadcast"
                  v-if="hasBroadcast"
                >
                  <BroadcastIcon />
                </a>
                <a
                  class="ms-2"
                  href="javascript:;"
                  @click.stop="onSync(row)"
                  title="Sync"
                  v-if="hasSync"
                >
                  <SyncIcon />
                </a>
                <a
                  href="javascript:;"
                  class="delete-btn ms-2"
                  @click.stop="onDelete(row)"
                  title="Delete"
                  v-if="hasDelete"
                >
                  <DeleteIcon />
                </a>

                <!-- subscription buttons -->
                <template v-if="hasSubscriptionButtons">
                  <template v-if="row['subscription_status']?.includes('expired')">
                    <IconBtn btnText="Renew" @click.stop="onRenew(row)">
                      <template #btnIcon>
                        <RefreshIcon />
                      </template>
                    </IconBtn>
                  </template>
                  <template v-else-if="row['subscription_status'] === 'active'">
                    <IconBtn btnText="Cancel Plan" @click.stop="onUnsubscribe(row)">
                      <template #btnIcon>
                        <UnsubscribeIcon />
                      </template>
                    </IconBtn>
                  </template>
                  <template
                    v-else-if="
                      row['subscription_status']?.includes('pending_activation') ||
                      row['subscription_status'] === 'inactive'
                    "
                  >
                    <IconBtn btnText="Subscribe" @click.stop="onSubscribe(row)">
                      <template #btnIcon>
                        <SubscribeIcon />
                      </template>
                    </IconBtn>
                  </template>
                  <template v-else-if="row['subscription_status']?.includes('pending_payment')">
                    <IconBtn btnText="Pay Now" @click.stop="onPayNow(row)">
                      <template #btnIcon>
                        <PayIcon />
                      </template>
                    </IconBtn>
                  </template>
                </template>

                <!-- invoice actions -->
                <template v-if="hasInvoiceActions">
                  <div class="d-flex flex-row">
                    <a
                      v-if="
                        row['invoice_url'] &&
                        (row['status'] === 'paid' ||
                          row['status'] === 'pending' ||
                          row['status'] === 'pending_payment')
                      "
                      class="ms-2"
                      href="javascript:;"
                      title="Invoice"
                      @click.stop.prevent="handleDownload(row['invoice_url'])"
                    >
                      <InvoiceBtn />
                    </a>
                    <a
                      v-if="row['receipt_url'] && row['status'] === 'paid'"
                      href="javascript:;"
                      class="ms-2"
                      @click.stop.prevent="handleDownload(row['receipt_url'])"
                      title="Receipt"
                    >
                      <ReceiptBtn />
                    </a>
                  </div>
                </template>

                <!-- more dropdown menu -->
                <template v-if="hasDropdownMenu">
                  <div class="popover-container position-relative" @mouseleave="hidePopover">
                    <!-- Popover content that appears on hover -->
                    <div
                      v-if="activePopoverId === getRowId(row)"
                      class="popover-content show d-flex flex-row align-items-center gap-2"
                      @mouseenter="keepPopoverOpen"
                      @mouseleave="hidePopover"
                    >
                      <template v-if="dropdownMenuItems || dropdownMenuItemsKey">
                        <template
                          v-for="(item, index) in dropdownMenuItemsKey
                            ? row[dropdownMenuItemsKey]
                            : dropdownMenuItems"
                          :key="item.key"
                        >
                          <!-- Separator item -->
                          <div v-if="item.key === 'separator'" class="popover-separator"></div>

                          <!-- Normal menu item -->
                          <button
                            v-else
                            class="popover-item d-flex align-items-center justify-content-center"
                            :class="{
                              disabled: isMenuItemDisabled(item, row),
                              'popover-item-disabled': isMenuItemDisabled(item, row),
                            }"
                            :disabled="isMenuItemDisabled(item, row)"
                            :title="item.label"
                            @click="handleDropdownMenuClick(item.key, row, $event)"
                          >
                            <component :is="item.icon" />
                          </button>
                        </template>
                      </template>
                    </div>

                    <!-- More button trigger -->
                    <DropdownMenuIcon
                      @mouseenter="showPopover(getRowId(row))"
                      title="More"
                      class="ms-2 popover-trigger"
                    />
                  </div>
                </template>
              </div>
            </td>
          </tr>
        </template>

        <!-- no-data view -->
        <template v-else>
          <tr>
            <td
              :colspan="
                headers.length +
                (hasEdit || hasBroadcast || hasDelete || hasDropdownMenu ? 1 : 0) +
                (hasInvoiceActions ? 1 : 0)
              "
              class="text-center py-4"
            >
              <div>{{ noDataMsg ? noDataMsg : 'No data available.' }}</div>
              <template v-if="noDataBtnTxt">
                <button
                  class="btn btn-primary mt-3"
                  style="background-color: #273c8c !important"
                  @click="noDataBtnClick"
                >
                  {{ noDataBtnTxt }}
                </button>
              </template>
            </td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>

  <!-- pagination -->
  <template
    v-if="rows && rows.length > 0 && currentPage != null && lastPage != null && lastPage !== 1"
  >
    <div class="d-flex flex-row justify-content-between align-items-center mt-3">
      <!-- prev btn -->
      <div>
        <template v-if="currentPage > 1">
          <div
            class="d-flex flex-row align-items-center gap-2 pagination-next-prev-btn border me-3"
            @click.stop="emitPrevPage"
          >
            <ChevronLeftIcon />
            <span class="small-text">Previous</span>
          </div>
        </template>
      </div>

      <!-- pages -->
      <div class="d-flex flex-row align-items-center gap-1">
        <template v-for="(page, idx) in paginationRange" :key="idx">
          <PaginationItem
            v-if="page !== 'ellipsis'"
            :pageNumber="page"
            :isActive="page === currentPage"
            @click.stop="emitClickedPage(page)"
          />
          <span
            v-else
            class="pagination-ellipsis d-flex align-items-center px-2"
            style="user-select: none"
          >
            ...
          </span>
        </template>
      </div>

      <!-- next btn -->
      <div>
        <template v-if="currentPage < lastPage">
          <div
            class="d-flex flex-row align-items-center gap-2 pagination-next-prev-btn border ms-3"
            @click.stop="emitNextPage"
          >
            <span class="small-text"> Next </span>
            <ChevronRightIcon />
          </div>
        </template>
      </div>
    </div>
  </template>
</template>

<style scoped>
/* .table-responsive {
  overflow: visible !important;
} */
/* tbody tr:last-child td {
  border-bottom: none !important;
}
thead tr:first-child th:first-child {
  border-top-left-radius: 1rem;
}
thead tr:first-child th:last-child {
  border-top-right-radius: 1rem;
}
tbody tr:last-child td:first-child {
  border-bottom-left-radius: 1rem;
}
tbody tr:last-child td:last-child {
  border-bottom-right-radius: 1rem;
} */

tr.editable {
  cursor: pointer;
}

tr.editable:hover td {
  background-color: lightgray;
}

.single-liner {
  white-space: nowrap;
}

.text-clamp {
  display: -webkit-box;
  display: box;
  -webkit-box-orient: vertical;
  box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  overflow: hidden;
  text-overflow: ellipsis;
}

.pagination-next-prev-btn {
  border-radius: 0.5rem;
  padding: 0.5rem 1rem 0.5rem 1rem;
  cursor: pointer;
}

.pagination-next-prev-btn:hover {
  background-color: #273c8c;
  color: #ffffff;
}

.pagination-ellipsis {
  font-weight: bold;
  padding: 0 0.5rem;
  color: #666;
  cursor: default;
  user-select: none;
}

.expiry-date {
  text-decoration: underline;
  font-style: italic;
  color: #273c8c;
}

/* New Popover Styles */
.popover-container {
  display: inline-block;
}

.popover-content {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  background: white;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  padding: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  min-width: auto;
  white-space: nowrap;
  margin-right: 8px;
}

.popover-item {
  border: none;
  background: transparent;
  border-radius: 4px;
  padding: 6px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  color: #666;
}

.popover-item:not(.disabled):hover {
  background-color: #f8f9fa;
  color: #212529;
  transform: scale(1.1);
}

.popover-item-disabled {
  color: #6c757d !important;
  pointer-events: none;
  opacity: 0.5;
  cursor: not-allowed;
}

.popover-trigger {
  cursor: pointer;
  transition: all 0.2s ease;
}

.popover-trigger:hover {
  transform: scale(1.1);
}

.popover-separator {
  width: 1px;
  height: 20px;
  background-color: #dee2e6;
  margin: 0 2px;
}
</style>
