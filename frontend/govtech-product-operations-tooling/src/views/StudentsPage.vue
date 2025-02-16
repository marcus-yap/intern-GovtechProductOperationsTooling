<script setup lang="ts">
	import { ref, onMounted } from "vue";
	import { fetchStudents } from "@/api/mockAPI";
	import StudentTable from "@/components/StudentTable.vue";
	import GpaChart from "@/components/GpaChart.vue";

	const students = ref([]);
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
		<StudentTable :students="students" />
		<div v-if="!loading && students.length">
			<GpaChart :students="students" />
		</div>
	</div>
</template>
