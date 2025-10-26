<template>
  <div class="transparent-bg">
    <div class="modal-content">
      <img src="@/assets/download-indicator.gif" alt="loading" class="loading-icon" />
    </div>
  </div>
</template>

<style scoped>
.transparent-bg {
  position: fixed;
  background-color: rgba(0, 0, 0, 0.5); /* Black with 50% opacity */
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 99999;
  display: flex;
  justify-content: center; /* centers horizontally */
  align-items: center; /* centers vertically */
}

.loading-icon {
  width: 5rem;
}

.modal-content {
  background: #fff;
  border-radius: 12px;
  padding: 1rem;
  max-width: 6rem;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
