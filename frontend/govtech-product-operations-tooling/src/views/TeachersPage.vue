<script setup lang="ts">
	import { ref, onMounted } from "vue";
	import { fetchTeachers, fetchStudents } from "@/api/mockAPI";
	import TeacherTable from "@/components/TeacherTable.vue";
	import GpaChart from "@/components/GpaChart.vue";

	const teachers = ref([]);
	const students = ref([]);
	const loading = ref(true);

	onMounted(async () => {
		try {
			teachers.value = await fetchTeachers();
			students.value = await fetchStudents();
		} catch (error) {
			console.error("Error fetching data:", error);
		} finally {
			loading.value = false;
		}
	});
</script>

<template>
	<div>
		<TeacherTable :teachers="teachers" :students="students" />
		<div v-if="!loading && students.length">
			<GpaChart :students="students" />
		</div>
	</div>
</template>
