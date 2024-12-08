<template>
  <div class="w-full">
    <div v-if="!loading">
      <div class="flex flex-col md:flex-row gap-2 items-center py-4">
        <div class="w-full md:max-w-sm">
          <Input class="md:max-w-sm" placeholder="Filter guests..."
            :model-value="table.getColumn('name')?.getFilterValue() as string"
            @update:model-value="table.getColumn('name')?.setFilterValue($event)" />

        </div>
        <div class="flex flex-1 gap-2 items-center w-full">
          <DropdownMenu>
            <DropdownMenuTrigger as-child>
              <Button variant="outline" class="w-full md:w-auto">
                Columns
                <ChevronDown class="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" class="h-60 overflow-y-scroll">
              <DropdownMenuCheckboxItem v-for="column in table.getAllColumns().filter((column) => column.getCanHide())"
                :key="column.id" class="capitalize" :checked="column.getIsVisible()" @update:checked="(value) => {
                  column.toggleVisibility(!!value);
                }">
                {{ column.id }}
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <SingleSelectDropdown v-model="viewModeComputed" :selectOptions="viewModeOptions"></SingleSelectDropdown>
        </div>

        <div class="flex gap-2 items-center mt-2 md:mt-0 w-full md:w-auto" v-if="hasEditAuthority">
          <Button variant="outline" class="w-full md:w-auto" @click="goToUpdateGuest(true)">
            Add Guest
          </Button>

          <ConfirmAction alert-title="Do you want to delete these guests?" @on-confirm="deleteGuests"
            v-if="showDeleteButton">
            <Button variant="destructive" class="w-full md:w-auto">
              Delete Selected Guests
            </Button>
          </ConfirmAction>
        </div>

        <div class="flex items-center mt-2 md:mt-0 w-full md:w-auto" v-if="hasEditAuthority">
          <Button variant="secondary" class="w-full md:w-auto" @click="goToUpdateGuest(false)" v-if="showEditButton">
            Edit Selected Guest
          </Button>
        </div>
      </div>
      <div class="rounded-md border">
        <Table>
          <TableHeader class="bg-orange-200">
            <TableRow v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id"
              class="hover:bg-orange-200 border-solid border-black">
              <TableHead v-for="header in headerGroup.headers" :key="header.id">
                <FlexRender v-if="!header.isPlaceholder" :render="header.column.columnDef.header"
                  :props="header.getContext()" class="text-primary hover:bg-orange-50" />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody class="bg-orange-50">
            <template v-if="table.getRowModel().rows?.length">
              <template v-for="row in table.getRowModel().rows" :key="row.id">
                <TableRow :data-state="row.getIsSelected() && 'selected'">
                  <TableCell v-for="cell in row.getVisibleCells()" :key="cell.id">
                    <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
                  </TableCell>
                </TableRow>
                <TableRow v-if="row.getIsExpanded()">
                  <TableCell :colspan="row.getAllCells().length">
                    {{ JSON.stringify(row.original) }}
                  </TableCell>
                </TableRow>
              </template>
            </template>

            <TableRow v-else>
              <TableCell :colspan="columns.length" class="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      <div class="flex items-center justify-end space-x-2 py-4">
        <div class="flex-1 text-sm text-muted-foreground">
          {{ table.getFilteredSelectedRowModel().rows.length }} of
          {{ table.getFilteredRowModel().rows.length }} row(s) selected.
        </div>
        <div class="space-x-2">
          <Button variant="outline" size="sm" :disabled="!table.getCanPreviousPage()" @click="table.previousPage()">
            Previous
          </Button>
          <Button variant="outline" size="sm" :disabled="!table.getCanNextPage()" @click="table.nextPage()">
            Next
          </Button>
        </div>
      </div>
    </div>
    <Loader v-else />
  </div>
</template>

<script setup lang="ts">
import Loader from "@/components/Loader.vue";
import { ArrowUpDown, ChevronDown } from "lucide-vue-next";

import { computed, h, ref, watch } from "vue";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { valueUpdater } from "@/util/utils";
import { Guest } from "@/models/Guest";
import { GuestService } from "@/services/GuestService";
import { onBeforeMount } from "vue";
import ConfirmAction from "@/components/data-table/ConfirmAction.vue";
import { useNotificationStore } from "@/stores/NotificationStore";
import { useUserStore } from "@/stores/UserStore";
import { NotificationType } from "@/models/NotificationType";
import { ErrorHandler } from "@/util/error/ErrorHandler";
import { storeToRefs } from "pinia";
import { useRouterHelper } from "@/util/composables/useRouterHelper";
import { useColumnDefinition } from "@/components/data-table/useColumnDefinition";
import type {
  ColumnDef,
  ColumnFiltersState,
  ExpandedState,
  SortingState,
  VisibilityState,
} from "@tanstack/vue-table";
import {
  FlexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useVueTable,
} from "@tanstack/vue-table";
import SingleSelectDropdown from "@/components/common/SingleSelectDropdown.vue";
import { ViewModes } from "@/components/data-table/ViewModes";
import { useColumnVisibility } from "@/components/data-table/useColumnVisibility";

const guestService = new GuestService();
const { goToRouteSecured } = useRouterHelper();
const notificationStore = useNotificationStore();
const { setMessage } = notificationStore;
const userStore = useUserStore();
const { hasEditAuthority } = storeToRefs(userStore);
const { columnDefs } = useColumnDefinition();
const { viewModeColumnVisibility } = useColumnVisibility();

const data = ref<Guest[]>([]);
const loading = ref<Boolean>(false);
const viewMode = ref<ViewModes>(ViewModes.ALL_FIELDS);

onBeforeMount(async () => {
  loading.value = true;
  data.value = await guestService.getAllGuests();
  loading.value = false;
});

const columns: ColumnDef<Guest>[] = columnDefs.value;

const sorting = ref<SortingState>([]);
const columnFilters = ref<ColumnFiltersState>([]);
const columnVisibility = ref<VisibilityState>({});
const rowSelection = ref({});
const expanded = ref<ExpandedState>({});

const table = useVueTable({
  data,
  columns,
  getCoreRowModel: getCoreRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  getExpandedRowModel: getExpandedRowModel(),
  onSortingChange: (updaterOrValue) => valueUpdater(updaterOrValue, sorting),
  onColumnFiltersChange: (updaterOrValue) =>
    valueUpdater(updaterOrValue, columnFilters),
  onColumnVisibilityChange: (updaterOrValue) =>
    valueUpdater(updaterOrValue, columnVisibility),
  onRowSelectionChange: (updaterOrValue) =>
    valueUpdater(updaterOrValue, rowSelection),
  onExpandedChange: (updaterOrValue) => valueUpdater(updaterOrValue, expanded),
  state: {
    get sorting() {
      return sorting.value;
    },
    get columnFilters() {
      return columnFilters.value;
    },
    get columnVisibility() {
      return columnVisibility.value;
    },
    get rowSelection() {
      return rowSelection.value;
    },
    get expanded() {
      return expanded.value;
    },
  },
});

const showDeleteButton = computed(() => {
  return Object.keys(rowSelection.value).length > 0;
});

const showEditButton = computed(() => {
  return Object.keys(rowSelection.value).length === 1;
});

const viewModeOptions = computed(() => {
  return Object.values(ViewModes)
});

const viewModeComputed = computed<ViewModes>({
  get() {
    return viewMode.value;
  },
  set(val: ViewModes) {
    viewMode.value = val;
  }
});

watch(() => viewModeComputed.value, (newMode: ViewModes) => {
  const visibilitySettings = viewModeColumnVisibility[newMode];
  if (visibilitySettings) {
    table.setColumnVisibility(visibilitySettings);
  }
}, { immediate: true });


function goToUpdateGuest(isNew: boolean) {
  if (isNew) {
    goToRouteSecured("update-guest");
    return;
  }
  const guestId = data.value.at(Number(Object.keys(rowSelection.value)))!.id;
  goToRouteSecured("update-guest", { guestId: guestId });
}

async function deleteGuests() {
  if (hasEditAuthority) {
    const guestsToDelete = data.value.filter((row, idx) =>
      Object.keys(rowSelection.value).includes(idx.toString())
    );
    await guestService.batchDeleteGuests(guestsToDelete);
    setMessage("Deleted user.", NotificationType.SUCCESS);
    data.value = await guestService.getAllGuests();
    rowSelection.value = {};
  } else {
    ErrorHandler.handleAuthorizationError();
  }
}
</script>