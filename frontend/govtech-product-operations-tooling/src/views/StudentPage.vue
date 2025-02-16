<script setup lang="ts">
	import { ref, onMounted } from "vue";
	import { useRoute } from "vue-router";
	import { fetchStudentById } from "@/api/mockAPI";
	import GpaChart from "@/components/GpaChart.vue";

	const route = useRoute();
	const student = ref<any>(null);
	const loading = ref(true);

	onMounted(async () => {
		const studentId = Number(route.params.id);
		try {
			student.value = await fetchStudentById(studentId);
		} catch (error) {
			console.error("Error fetching student:", error);
		} finally {
			loading.value = false;
		}
	});
</script>

<template>
	<div>
		<div v-if="!loading && student">
			<h1>{{ student.name }}</h1>
			<p>Cumulative GPA: {{ student.cumulativeGPA }}</p>
			<p>
				Last Semester's GPA:
				{{ student.past8SemestersGPA[student.past8SemestersGPA.length - 1] }}
			</p>
			<GpaChart :students="student" />
		</div>
	</div>
</template>
