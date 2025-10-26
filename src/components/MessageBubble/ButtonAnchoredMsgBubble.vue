<template>
  <div class="message-bubble smaller-text">
    <slot />
    <span class="arrow"></span>
  </div>
</template>

<style scoped>
.message-bubble {
  display: inline-block;
  position: relative;
  background: #fff;
  border: 1px solid #ccc;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
  padding: 0.5rem 1.5rem 0.5rem 1rem;
  margin-right: 1rem; /* space for the arrow */
}

.arrow {
  position: absolute;
  top: 50%;
  right: -12px; /* adjust so arrow is outside the bubble */
  transform: translateY(-50%);
  width: 0;
  height: 0;
  border-top: 7px solid transparent;
  border-bottom: 7px solid transparent;
  border-left: 12px solid #fff; /* matches bubble bg */
  filter: drop-shadow(1px 0 0 #ccc); /* border effect */
}
</style>
