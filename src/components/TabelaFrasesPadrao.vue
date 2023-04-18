<template>
    <div>
        <div ref="tableFrase"></div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue';
import { useStore } from "../stores/Store";
import { TabulatorFull as Tabulator } from "tabulator-tables";
import type { RowComponent } from "tabulator-tables";

const store = useStore();
const tableFrase = ref<HTMLDivElement>();
const tabulatorFrase = ref<Tabulator>();

const initTable = () => {
    tabulatorFrase.value = new Tabulator(tableFrase.value!, {
        layout: 'fitDataFill',
        height: '350px',
        rowHeight: 25,
        data: filteredData.value,
        selectable: true,
        selectableRollingSelection: false,
        selectableRangeMode: "click",
        reactiveData: true,
        columns: [
            { title: "Codigo", field: "codTexto" },
            { title: "Frase", field: "texto", width: 500 },
        ],
    });
    tabulatorFrase.value.on("rowDblClick", (e: Event, row: RowComponent) => {
        store.frase = row.getData().texto;
        store.codFrase = row.getData().codTexto;
        e.preventDefault();
    });
};

watch(store, () => {
    if (store.codFrase == 0) {
        tabulatorFrase.value?.deselectRow();
    }
});

const filteredData = computed(() => {
    return store.getTextoPadrao().filter((o: any) => o.texto !== '');
});

watch(filteredData, (newVal) => {
    if (tabulatorFrase.value) {
        tabulatorFrase.value.setData(newVal);
    }
});

onMounted(() => {
    initTable();
});
</script>

<style>
.tabulator .tabulator-header .tabulator-col {
    background-color: #4d4d4d !important;
    color: #ffffff;
}

.tabulator .tabulator-row:hover {
    background-color: #2672b5;
    color: #ffffff;
}

.tabulator .tabulator-selected {
    background-color: #0b2d4f;
    color: #ffffff;
}

.tabulator .tabulator-editing {
    background-color: #2672b5;
    color: #ffffff !important;
}

.tabulator-header {
    background-color: #4d4d4d !important;
}

.tabulator-cell {
    user-select: none;
}

.tabulator-row {
    user-select: text;
}
</style>