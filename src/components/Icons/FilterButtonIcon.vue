<template>
  <svg
    width="40"
    height="40"
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    class="icon-edit"
  >
    <rect x="0.5" y="0.5" width="39" height="39" rx="7.5" fill="white" class="icon-fill" />
    <rect x="0.5" y="0.5" width="39" height="39" rx="7.5" stroke="#D5D7DA" class="icon-stroke" />
    <path
      d="M18.3333 24.9997H27.5M12.5 24.9997H15M15 24.9997V26.6663M15 24.9997V23.333M26.6667 19.9997H27.5M12.5 19.9997H23.3333M23.3333 19.9997V21.6663M23.3333 19.9997V18.333M21.6667 14.9997H27.5M12.5 14.9997H18.3333M18.3333 14.9997V16.6663M18.3333 14.9997V13.333"
      stroke="#202224"
      stroke-width="2"
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
  fill: #ffffff;
}
</style>
