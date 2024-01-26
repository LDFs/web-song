<template>
  <div class="outline-container" 
    :style="{borderTop: tb,borderRight: rb,borderBottom: bb,borderLeft: lb}">
    <div class="outline-left" :style="{width: leftWidth, borderRight: rb}">
      <slot name="left"></slot>
    </div>
    <div v-if="isRight" class="outline-right" :style="{width: rightWidth}">
      <slot name="right"></slot>
    </div>
  </div>
</template>

<script setup>
import {ref} from 'vue'
const props = defineProps({
  leftWidth: {
    type: String,
    default: '74%'
  },
  isRight: {
    type: Boolean,
    default: true
  },
  rightWidth: {
    type: String,
    default: '24%'
  },
  border: {
    type: String,
    default: '1'    // '1'='1 1 1 1' 上右下左, '1 0'='1 0 1 0',   
  },
  borderColor: {
    type: String,
    default: '#c1bfbf'
  }
})
const borders = props.border.split(' ')
const tb = ref('')
const rb = ref('')
const bb = ref('')
const lb = ref('')
if(borders.length == 1) {
  tb.value = rb.value = bb.value = lb.value = borders[0] === '1' ? `1px solid ${props.borderColor}` : ''
}else if(borders.length == 2){
  tb.value = bb.value = borders[0] === '1' ? `1px solid ${props.borderColor}` : ''
  rb.value = lb.value = borders[1] === '1' ? `1px solid ${props.borderColor}` : ''
}else if(borders.length == 4){
  tb.value = borders[0] === '1' ? `1px solid ${props.borderColor}` : ''
  rb.value = borders[1] === '1' ? `1px solid ${props.borderColor}` : ''
  bb.value = borders[2] === '1' ? `1px solid ${props.borderColor}` : ''
  lb.value = borders[3] === '1' ? `1px solid ${props.borderColor}` : ''
}

</script>

<style lang="scss" scoped>
.outline-container {
  width: 54vw;
  min-width: 620px;
  display: flex;
  padding: 0 1rem;
}
</style>