<template>
  <!-- <svg
    class="icon-edit"
    width="37"
    height="37"
    viewBox="0 0 37 37"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect class="icon-fill" x="0.200195" y="0.5" width="36" height="36" rx="18" fill="#F1F1F1" />
    <path
      class="icon-stroke"
      d="M18.2 13.1667H14.8667C13.7621 13.1667 12.8667 14.0621 12.8667 15.1667V21.8334C12.8667 22.9379 13.7621 23.8334 14.8667 23.8334H21.5334C22.6379 23.8334 23.5334 22.9379 23.5334 21.8334V18.5M22.4762 16.1095L23.2 15.3857C23.7207 14.865 23.7207 14.0207 23.2 13.5C22.6793 12.9793 21.8351 12.9793 21.3144 13.5L20.5906 14.2239M22.4762 16.1095L18.452 20.1337C18.2659 20.3199 18.0288 20.4467 17.7707 20.4984L15.8095 20.8906L16.2017 18.9294C16.2534 18.6713 16.3802 18.4342 16.5664 18.2481L20.5906 14.2239M22.4762 16.1095L20.5906 14.2239"
      stroke="#202224"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg> -->
  <svg
    width="36"
    height="36"
    viewBox="0 0 36 36"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    class="icon-edit"
  >
    <rect x="0.5" y="0.5" width="35" height="35" rx="7.5" fill="white" class="icon-fill" />
    <rect x="0.5" y="0.5" width="35" height="35" rx="7.5" stroke="#F1F1F1" class="icon-stroke" />
    <path
      d="M18.0013 12.6666H14.668C13.5634 12.6666 12.668 13.562 12.668 14.6666V21.3332C12.668 22.4378 13.5634 23.3332 14.668 23.3332H21.3346C22.4392 23.3332 23.3346 22.4378 23.3346 21.3332V17.9999M22.2775 15.6094L23.0013 14.8855C23.522 14.3648 23.522 13.5206 23.0013 12.9999C22.4806 12.4792 21.6363 12.4792 21.1156 12.9999L20.3918 13.7238M22.2775 15.6094L18.2533 19.6336C18.0671 19.8197 17.8301 19.9466 17.5719 19.9982L15.6108 20.3905L16.003 18.4293C16.0546 18.1712 16.1815 17.9341 16.3676 17.748L20.3918 13.7238M22.2775 15.6094L20.3918 13.7238"
      stroke="#202224"
      stroke-width="1.2"
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
