<template>
    <div class="w-full">
        <div v-if="!loading">
            <div class="flex flex-col md:flex-row gap-2 items-center py-4">
                <div class="flex flex-1 gap-2 items-center w-full">
                    <Input class="w-full md:max-w-sm" placeholder="Filter guests..."
                        :model-value="table.getColumn('name')?.getFilterValue() as string"
                        @update:model-value="table.getColumn('name')?.setFilterValue($event)" />

                    <DropdownMenu>
                        <DropdownMenuTrigger as-child>
                            <Button variant="outline" class="w-full md:w-auto">
                                Columns
                                <ChevronDown class="ml-2 h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuCheckboxItem
                                v-for="column in table.getAllColumns().filter((column) => column.getCanHide())"
                                :key="column.id" class="capitalize" :checked="column.getIsVisible()" @update:checked="(value: any) => {
                                    column.toggleVisibility(!!value);
                                }">
                                {{ column.id }}
                            </DropdownMenuCheckboxItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                <div class="flex gap-2 items-center mt-2 md:mt-0 w-full md:w-auto" v-if="hasEditAuthority">
                    <Button variant="outline" class="w-full md:w-auto" @click="goToAddGuest">
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
                    <Button variant="secondary" class="w-full md:w-auto" @click="goToEditGuest" v-if="showEditButton">
                        Edit Selected Guest
                    </Button>
                </div>
            </div>
            <div class="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
                            <TableHead v-for="header in headerGroup.headers" :key="header.id">
                                <FlexRender v-if="!header.isPlaceholder" :render="header.column.columnDef.header"
                                    :props="header.getContext()" />
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
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
                    <Button variant="outline" size="sm" :disabled="!table.getCanPreviousPage()"
                        @click="table.previousPage()">
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
import Loader from '@/components/Loader.vue';
import type {
    ColumnDef,
    ColumnFiltersState,
    ExpandedState,
    SortingState,
    VisibilityState,
} from '@tanstack/vue-table';
import {
    FlexRender,
    getCoreRowModel,
    getExpandedRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useVueTable,
} from '@tanstack/vue-table';
import { ArrowUpDown, ChevronDown } from 'lucide-vue-next';

import { computed, h, ref } from 'vue'
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { valueUpdater } from '@/util/utils';
import { Guest } from '@/models/Guest';
import { GuestService } from '@/services/GuestService';
import { onBeforeMount } from 'vue';
import EventCircle from '@/components/data-table/EventCircle.vue';
import ConfirmAction from '@/components/data-table/ConfirmAction.vue';
import { WeddingEvent } from '@/models/WeddingEvent';
import { useNotificationStore } from '@/stores/NotificationStore';
import { useUserStore } from '@/stores/UserStore';
import { NotificationType } from '@/models/NotificationType';
import { ErrorHandler } from '@/util/error/ErrorHandler';
import { storeToRefs } from 'pinia';
import {useRouterHelper} from '@/util/composables/useRouterHelper';

const guestService = new GuestService();
const {goToRouteSecured} = useRouterHelper();
const notificationStore = useNotificationStore();
const { setMessage } = notificationStore;
const userStore = useUserStore();
const { hasEditAuthority } = storeToRefs(userStore);

const data = ref<Guest[]>([]);
const loading = ref<Boolean>(false);

onBeforeMount(async () => {
    loading.value = true;
    data.value = await guestService.getAllGuests();
    loading.value = false;
});

const columns: ColumnDef<Guest>[] = [
    {
        id: 'select',
        header: ({ table }) => h(Checkbox, {
            'checked': table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate'),
            'onUpdate:checked': (value: any) => table.toggleAllPageRowsSelected(!!value),
            'ariaLabel': 'Select all',
        }),
        cell: ({ row }) => h(Checkbox, {
            'checked': row.getIsSelected(),
            'onUpdate:checked': (value: any) => row.toggleSelected(!!value),
            'ariaLabel': 'Select row',
        }),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: 'name',
        header: ({ column }) => {
            return h(Button, {
                variant: 'ghost',
                onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
            }, () => ['Name', h(ArrowUpDown, { class: 'ml-2 h-4 w-4' })])
        },
        cell: ({ row }) => h('div', { class: 'capitalize' }, row.getValue('name')),
    },
    {
        accessorKey: 'email',
        header: ({ column }) => {
            return h(Button, {
                variant: 'ghost',
                onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
            }, () => ['Email', h(ArrowUpDown, { class: 'ml-2 h-4 w-4' })])
        },
        cell: ({ row }) => h('div', { class: 'lowercase' }, row.getValue('email')),
    },
    {
        accessorKey: 'phone',
        header: ({ column }) => {
            return h(Button, {
                variant: 'ghost',
                onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
            }, () => ['Phone Number', h(ArrowUpDown, { class: 'ml-2 h-4 w-4' })])
        },
        cell: ({ row }) => h('div', { class: 'lowercase' }, row.getValue('phone')),
    },
    {
        accessorKey: 'events',
        header: ({ column }) => {
            return h(Button, {
                variant: 'ghost',
                onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
            }, () => ['Events', h(ArrowUpDown, { class: 'ml-2 h-4 w-4' })]);
        },
        cell: ({ row }) => {
            const events: WeddingEvent[] = row.getValue('events') || [];
            const circles = events.map(event =>
                h(EventCircle, { event, key: event.id })
            );
            return h('div', { class: 'flex gap-1' }, circles);
        },
    },
]

const sorting = ref<SortingState>([])
const columnFilters = ref<ColumnFiltersState>([])
const columnVisibility = ref<VisibilityState>({})
const rowSelection = ref({})
const expanded = ref<ExpandedState>({})

const table = useVueTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    onSortingChange: updaterOrValue => valueUpdater(updaterOrValue, sorting),
    onColumnFiltersChange: updaterOrValue => valueUpdater(updaterOrValue, columnFilters),
    onColumnVisibilityChange: updaterOrValue => valueUpdater(updaterOrValue, columnVisibility),
    onRowSelectionChange: updaterOrValue => valueUpdater(updaterOrValue, rowSelection),
    onExpandedChange: updaterOrValue => valueUpdater(updaterOrValue, expanded),
    state: {
        get sorting() { return sorting.value },
        get columnFilters() { return columnFilters.value },
        get columnVisibility() { return columnVisibility.value },
        get rowSelection() { return rowSelection.value },
        get expanded() { return expanded.value },
    },
})

const showDeleteButton = computed(() => {
    return Object.keys(rowSelection.value).length > 0;
});

const showEditButton = computed(() => {
    return Object.keys(rowSelection.value).length === 1;
});

function goToAddGuest() {
    goToRouteSecured('add-guest');
}

function goToEditGuest() {
    const guestId = data.value.at(Number(Object.keys(rowSelection.value)))!.id;
    goToRouteSecured('edit-guest', {guestId: guestId});
}

async function deleteGuests() {
    if (hasEditAuthority) {
        const guestsToDelete = data.value.filter((row, idx) => Object.keys(rowSelection.value).includes(idx.toString()));
        await guestService.batchDeleteGuests(guestsToDelete);
        setMessage('Deleted user.', NotificationType.SUCCESS);
        await guestService.getAllGuests();
    } else {
        ErrorHandler.handleAuthorizationError();
    }
}



</script>