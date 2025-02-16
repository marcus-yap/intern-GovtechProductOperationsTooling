<script setup lang="ts">
	import { computed, h, ref } from "vue";
	import { RouterLink } from "vue-router";
	import {
		FlexRender,
		getCoreRowModel,
		getSortedRowModel,
		useVueTable,
		createColumnHelper,
	} from "@tanstack/vue-table";

	const props = defineProps({
		teachers: {
			type: Array,
			required: true,
		},
		students: {
			type: Array,
			required: true,
		},
	});

	const columnHelper = createColumnHelper();

	const getAverageGPA = (teacher, type) => {
		const teacherStudents = props.students.filter((student) =>
			teacher.students.includes(student.id)
		);

		if (teacherStudents.length === 0) return null;

		if (type === "semester") {
			const total = teacherStudents.reduce(
				(sum, student) =>
					sum +
					(student.past8SemestersGPA[student.past8SemestersGPA.length - 1] ||
						0),
				0
			);
			return total / teacherStudents.length;
		}

		if (type === "cumulative") {
			const total = teacherStudents.reduce(
				(sum, student) => sum + student.cumulativeGPA,
				0
			);
			return total / teacherStudents.length;
		}
		return null;
	};

	const columns = [
		columnHelper.accessor("name", {
			header: "Name",
			cell: (info) => {
				const teacherId = info.row.original.id;
				const teacherName = info.getValue();
				return h(
					RouterLink,
					{ to: `/teachers/${teacherId}` },
					() => teacherName
				);
			},
			enableSorting: true,
		}),
		columnHelper.accessor(
			(row) => {
				const gpa = getAverageGPA(row, "semester");
				return gpa != null ? gpa.toFixed(2) : "N/A";
			},
			{
				id: "avgLastSemesterGPA",
				header: "Avg Last Semester GPA",
				enableSorting: true,
			}
		),
		columnHelper.accessor(
			(row) => {
				const gpa = getAverageGPA(row, "cumulative");
				return gpa != null ? gpa.toFixed(2) : "N/A";
			},
			{
				id: "avgCumulativeGPA",
				header: "Avg Cumulative GPA",
				enableSorting: true,
			}
		),
	];

	const tableData = computed(() => {
		return props.teachers.map((teacher) => ({
			...teacher,
			avgLastSemesterGPA: getAverageGPA(teacher, "semester").value,
			avgCumulativeGPA: getAverageGPA(teacher, "cumulative").value,
		}));
	});

	const table = useVueTable({
		data: computed(() => props.teachers || []),
		columns,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
	});
</script>

<template>
	<div>
		<table class="table" v-if="props.students.length > 0">
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
		<p v-else>Loading...</p>
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
