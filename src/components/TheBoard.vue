<!--Создание карточки задачи-->
<script setup lang='ts'>
import { onBeforeMount, onMounted } from 'vue'
import { computed } from '@vue/reactivity'
import { storeToRefs } from 'pinia'
import { useBoardStore } from '../store/board'
import { Stage } from '../models/board'
import StageContainer from './StageContainer.vue'
import ItemModal from './ItemModal.vue'
import AdditionPlaceholder from './base/AdditionPlaceholder.vue'


let boardStore = useBoardStore()
const { board, ready, selectedItem, selectedStageIndex } = storeToRefs(boardStore)

onBeforeMount(async () => boardStore.fetch())
onMounted(() => {
  const idFromUrl = decodeURI(window.location.hash.substring(1))
  if (window.location.hash.length > 1) boardStore.selectItemById(idFromUrl)
})
boardStore.$subscribe(boardStore.save)

// Вычисление количества столбцов
const firstStage = computed(() => selectedStageIndex.value == 0)
const lastStage = computed(() => selectedStageIndex.value == board.value.stages.length - 1)
const amount = computed(() => board.value.stages?.length)
// максимальное количество столбцов
const maxAmount = 4

//#region Stage Actions

// Функция добавления нового столбца
function addStage() {
  if (amount.value == maxAmount) return
  const newStage: Stage = { name: 'Stage ' + (amount.value + 1), items: [] }
  boardStore.$patch(state => state.board.stages.push(newStage))
}

function editStageName(stageIndex: number, name: string) {
  boardStore.$patch(state => state.board.stages[stageIndex].name = name)
}

//#endregion

//#region Item Actions

function clearItemSelection() {
  boardStore.$patch(state => {
    state.selectedStageIndex = -1
    state.selectedItemIndex = -1
    state.selectedItem = null
  })
}

function setItemSelection(stageIndex: number, itemIndex: number) {
  clearItemSelection()
  setTimeout(() => {
    selectedStageIndex.value = stageIndex

    if (itemIndex > -1) {
      boardStore.$patch(state => {
        state.selectedItemIndex = itemIndex
        state.selectedItem = state.board.stages[stageIndex].items[itemIndex]
      })
    } else {
      boardStore.$patch(state => {
        const newItem = {
          id: Date.now().toString(36),
          name: 'Название задачи',
          desc: 'Описание',
          deadline: 'Дедлайн',
          // color: 'blue',
          updated: new Date().getTime(),
          created: new Date().getTime()
        }
        state.selectedItemIndex = state.board
          .stages[selectedStageIndex.value]
          .items
          .push(newItem) - 1
        state.selectedItem = newItem
      })
    }
  }, 1)
}

function moveItem(toStageIndex: number, itemId?: string) {
  if (itemId) boardStore.selectItemById(itemId)
  boardStore.$patch(state => {

    if (state.selectedItem) {
      const newItemIndex = state.board
        .stages[toStageIndex]
        .items
        .push(state.selectedItem) - 1

      state.board
        .stages[state.selectedStageIndex]
        .items.splice(state.selectedItemIndex, 1)

      state.selectedStageIndex = toStageIndex
      state.selectedItemIndex = newItemIndex
    }
  })
  clearItemSelection()
}

// Функция удаления задачи
function deleteItem() {
  boardStore.$patch(state => {
    state.board
      .stages[state.selectedStageIndex]
      .items.splice(state.selectedItemIndex, 1)
  })
  clearItemSelection()
}

//#endregion
</script>

<template>
    <div v-if="ready" class="flex h-screen flex-row gap-6 p-6 pt-12 -mt-5 antialiased">
    <stage-container
      v-for="(stage, i) in board.stages"
      :key="'stage-' + stage.name + i"
      :value="stage"
      :index="i"
      @add-item="setItemSelection(i, -1)"
      @open-item="(itemIndex: number) => setItemSelection(i, itemIndex)"
      @move-item="moveItem"
      @save-name="(name: string) => editStageName(i, name)"
    />

    <addition-placeholder
      v-if="amount != maxAmount"
      @click="addStage"
    />

    <item-modal
      v-if="selectedItem"
      v-model="selectedItem"
      :first="firstStage"
      :last="lastStage"
      @regress="moveItem(selectedStageIndex - 1)"
      @progress="moveItem(selectedStageIndex + 1)"
      @delete="deleteItem"
      @closed="clearItemSelection"
      @update:model-value="() => { }"
    />
  </div>
</template>

