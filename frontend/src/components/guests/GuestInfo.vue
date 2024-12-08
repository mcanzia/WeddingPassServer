<template>
    <div>
        <Card class="w-[90vw] justify-self-center bg-inherit border-none" v-if="!loading">
            <CardHeader class="flex flex-col items-center justify-center">
                <CardTitle class="text-2xl uppercase italic">
                    Guests In Party
                </CardTitle>
            </CardHeader>
            <CardContent>
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
                                            <FlexRender :render="cell.column.columnDef.cell"
                                                :props="cell.getContext()" />
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
            </CardContent>
        </Card>
        <Loader v-else />
    </div>
</template>

<script setup lang="ts">
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Guest } from '@/models/Guest';
import { GuestService } from '@/services/GuestService';
import { onMounted, ref } from 'vue';
import { useUserStore } from '@/stores/UserStore';
import { storeToRefs } from 'pinia';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
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
import { valueUpdater } from "@/util/utils";
import { useColumnDefinition } from '@/components/data-table/useColumnDefinition';
import Loader from '@/components/Loader.vue';

const userStore = useUserStore();
const { loggedInGuest } = storeToRefs(userStore);
const { partyColumnDefs } = useColumnDefinition();

const data = ref<Guest[]>([]);
const loading = ref<boolean>(false);

onMounted(async () => {
    loading.value = true;
    const guestService = new GuestService();
    data.value = await guestService.fetchPartyMembers(loggedInGuest.value);
    loading.value = false;
});

const columns: ColumnDef<Guest>[] = partyColumnDefs.value;

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

</script>