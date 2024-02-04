<!--Один контейнер-->
<script setup lang='ts'>
import { ref, defineEmits, watch, onMounted } from 'vue'
import { Stage } from 'src/models/board'

import ItemContainer from './ItemContainer.vue'
import EditableValue from './base/EditableValue.vue'
import AdditionPlaceholder from './base/AdditionPlaceholder.vue'

const props = defineProps<{ value: Stage, index: number }>()
const emit = defineEmits<{
  (eventName: 'add-item') : void,
  (eventName: 'open-item', stageIndex: number) : void,
  (eventName: 'move-item', stageIndex: number, itemId: string) : void,
  (eventName: 'save-name', name: string) : void
}>()

const stageName = ref(props.value.name)
watch(stageName, () => save())

function handleDrop(e: DragEvent) {
  let itemId = e.dataTransfer?.getData('draggedItemId')
  if (itemId) emit('move-item', props.index, itemId)
}

function save() {
  stageName.value.length > 0 ? stageName.value : props.value.name
  emit('save-name', stageName.value)
}
</script>

<!--    Сам контейнер-->
<template>

  <div
    @drop="handleDrop"
    @dragenter.prevent @dragover.prevent
    class="containeer"
  >
    <div class="h-full">
      <h2 class="containeer_title" >
        <editable-value label="">
          <template #display>
            <span>{{stageName}}</span>
          </template>
          <template #edit>
            <input
              v-model="stageName"
              class="w-full text-center -mx-2"
              maxlength="240"
            />
          </template>
        </editable-value>
      </h2>

<!--      Отображение добавления задачи-->
      <div class="grid grid-flow-row gap-1 auto-rows-max">
        <item-container
          v-for="(item, i) in value.items"
          :key="'item-'+ item.name + item.created"
          :value="item"
          @click="$emit('open-item', i)"
        />
        <addition-placeholder @click="$emit('add-item')" />
      </div>
      </div>
  </div>
</template>

