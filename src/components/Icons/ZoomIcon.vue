<template>
  <svg
    width="37"
    height="36"
    viewBox="0 0 37 36"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    class="icon-edit"
  >
    <rect x="0.851562" y="0.5" width="35" height="35" rx="7.5" fill="white" class="icon-fill" />
    <rect x="0.851562" y="0.5" width="35" height="35" rx="7.5" stroke="#F1F1F1" class="icon-fill" />
    <circle
      cx="17.0156"
      cy="16.6666"
      r="4"
      stroke="#202224"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="icon-stroke"
    />
    <path
      d="M20.0156 19.6666L23.0156 22.6666"
      stroke="#202224"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="icon-stroke"
    />
    <path
      d="M15.6875 16.6667H17.0208M18.3542 16.6667H17.0208M17.0208 16.6667V15.3334M17.0208 16.6667V18"
      stroke="#202224"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="icon-stroke"
    />
  </svg>
</template>

<style scoped>
.icon-edit {
  cursor: pointer;
  transition:
    fill 0.3s ease,
    stroke 0.3s ease;
}

.icon-edit:hover .icon-fill {
  fill: #273c8c;
}

.icon-edit:hover .icon-stroke {
  stroke: #ffffff;
}
</style>
