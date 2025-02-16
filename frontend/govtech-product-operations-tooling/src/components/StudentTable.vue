<script setup lang="ts">
	import { ref, computed, h } from "vue";
	import { RouterLink } from "vue-router";
	import {
		FlexRender,
		getCoreRowModel,
		getSortedRowModel,
		useVueTable,
		createColumnHelper,
	} from "@tanstack/vue-table";

	const props = defineProps({
		students: {
			type: Array,
			required: true,
		},
	});

	const columnHelper = createColumnHelper<any>();

	const columns = [
		columnHelper.accessor("name", {
			header: "Name",
			cell: (info: any) => {
				const studentId = (info.row.original as any).id;
				const studentName = info.getValue();
				return h(
					RouterLink,
					{ to: `/students/${studentId}` },
					() => studentName
				);
			},
			enableSorting: true,
		}),
		columnHelper.accessor("cumulativeGPA", {
			header: "Cumulative GPA",
			cell: (info: any) => info.getValue(),
			enableSorting: true,
		}),
		columnHelper.accessor(
			(row: any) => row.past8SemestersGPA[row.past8SemestersGPA.length - 1],
			{
				id: "lastSemesterGPA",
				header: "Last Semester's GPA",
				cell: (info: any) => info.getValue(),
				enableSorting: true,
			}
		),
	];

	const table = useVueTable<any>({
		data: computed(() => props.students || []),
		columns,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
	});
</script>

<template>
	<div>
		<table class="table">
			<thead>
				<tr>
					<th
						v-for="header in table.getHeaderGroups()[0].headers"
						:key="header.id"
						@click="header.column.toggleSorting()"
					>
						<FlexRender
							:render="header.column.columnDef.header"
							:props="header.getContext()"
						/>
						<span v-if="header.column.getIsSorted() === 'asc'">▲</span>
						<span v-else-if="header.column.getIsSorted() === 'desc'">▼</span>
						<span v-else>⇅</span>
					</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="row in table.getRowModel().rows" :key="row.id">
					<td v-for="cell in row.getVisibleCells()" :key="cell.id">
						<FlexRender
							:render="cell.column.columnDef.cell"
							:props="cell.getContext()"
						/>
					</td>
				</tr>
			</tbody>
		</table>
	</div>
</template>

<style scoped>
	.table {
		width: 100%;
		border-collapse: collapse;
		margin: 1rem 0;
	}

	.table th,
	.table td {
		padding: 0.75rem;
		border: 1px solid #ddd;
		text-align: left;
	}

	.table th {
		background-color: #a7a7a7;
		font-weight: bold;
	}
</style>
