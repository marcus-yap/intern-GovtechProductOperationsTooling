<script setup lang="ts">
	import { ref, onMounted } from "vue";
	import { fetchStudents } from "@/api/mockAPI";
	import StudentTable from "@/components/StudentTable.vue";
	import GPAChart from "@/components/GPAChart.vue";

	const students = ref<any[]>([]);
	const loading = ref(true);

	onMounted(async () => {
		try {
			students.value = await fetchStudents();
		} catch (error) {
			console.error("Error fetching students:", error);
		} finally {
			loading.value = false;
		}
	});
</script>

<template>
	<div>
		<h1>Cohort - Class of 2024</h1>
		<StudentTable :students="students" />
		<div v-if="!loading && students.length">
			<GPAChart :students="students" />
		</div>
	</div>
</template>
