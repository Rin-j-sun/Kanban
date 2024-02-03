<!--Реализация функции перетаскивания-->
<script setup lang='ts'>
import { Item } from '../models/board'

let props = defineProps<{ value: Item }>()

// функция перетаскивания(драг энд дроп)
// function handleDragStart(e: DragEvent) {
//   e.dataTransfer?.setData('draggedItemId', props.value.id)
// }


</script>

<template>
  <!--    Значание для анимации перетаскивания true or false-->
  <div
    class="rounded m-2 truncate backdrop-contrast-125 hover:brightness-125 ring-1 ring-gray-light"
    :style="{ 'background-color': ('rgb(var(--color-' + props.value.color + '))') }"
    draggable="false"
    @dragstart="handleDragStart"
  >
    <div class="p-2 cursor-pointer" >
      <h1 class="font-bold text-ellipsis overflow-hidden">
        {{value.name}}
      </h1>
      <p class="text-ellipsis overflow-hidden">
        {{value.desc}}
      </p>
    </div>
  </div>
</template>


