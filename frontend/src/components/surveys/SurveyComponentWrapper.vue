<template>
  <div class="grid grid-flow-row-dense grid-cols-6">
    <div class="col-span-1 flex flex-col items-center justify-center space-y-2">
      <ion-icon
        name="ellipsis-vertical"
        class="kanban-handle cursor-pointer"
      ></ion-icon>
      <!-- <IconButton icon="caret-up" />
            <IconButton icon="caret-down" /> -->
    </div>
    <div class="grid gap-2 col-span-4">
      <input
        v-model="componentLabelComputed"
        placeholder="Enter Field Title Here"
        class="bg-inherit border-0 outline-transparent"
      />
      <div
        v-if="infoLookupField"
        class="italic text-sm"
      >Populated by <span class="text-lime-500">{{ infoLookupField }}</span> field</div>
      <div
        v-if="triggerField"
        class="italic text-sm text-yellow-200"
      >Field triggered by {{ triggerField }}</div>
      <slot></slot>
    </div>
    <div
      v-if="hasAddChild"
      class="col-span-1 flex flex-col items-center justify-center space-y-2"
    >
      <IconButton
        @click="remove"
        icon="close"
      />
      <IconButton
        @click="openAddChildMode"
        icon="trail-sign"
      />
    </div>
    <div
      v-else
      class="col-span-1 flex justify-center"
    >
      <IconButton
        @click="remove"
        icon="close"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import IconButton from "@/components/common/IconButton.vue";
import { useSurveyStore } from "@/components/surveys/SurveyStore";
import { storeToRefs } from "pinia";

const emit = defineEmits(["remove", "openAddChild", "update:componentLabel"]);

const props = defineProps({
  componentLabel: {
    type: String,
    required: false,
    default: () => "",
  },
  hasAddChild: {
    type: Boolean,
    required: false,
    default: () => false,
  },
  triggerField: {
    type: String,
    required: false,
    default: () => "",
  },
  componentId: {
    type: String,
    required: false,
    default: () => null,
  },
  infoLookupField: {
    type: String,
    required: false,
    default: () => null,
  },
});

const { savedStatus } = storeToRefs(useSurveyStore());

const componentLabelComputed = computed({
  get() {
    return props.componentLabel;
  },
  set(val) {
    emit("update:componentLabel", val);
    savedStatus.value = false;
  },
});

function remove() {
  emit("remove", props.componentId);
}

function openAddChildMode() {
  emit("openAddChild", props.componentId);
}
</script>