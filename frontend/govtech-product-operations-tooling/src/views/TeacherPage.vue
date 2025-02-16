<script setup lang="ts">
	import { ref, computed, onMounted } from "vue";
	import { useRoute } from "vue-router";
	import { fetchTeacherById, fetchStudents } from "@/api/mockAPI";
	import GPAChart from "@/components/GPAChart.vue";

	const route = useRoute();
	const teacher = ref<any>(null);
	const students = ref<any[]>([]);
	const loading = ref(true);

	onMounted(async () => {
		const teacherId = Number(route.params.id);
		try {
			teacher.value = await fetchTeacherById(teacherId);
			students.value = await fetchStudents();
		} catch (error) {
			console.error("Error fetching teacher data:", error);
		} finally {
			loading.value = false;
		}
	});

	const teacherStudents = computed(() => {
		if (!teacher.value || !students.value.length) return [];
		return students.value.filter((student) =>
			teacher.value.students.includes(student.id)
		);
	});

	const avgLastSemesterGPA = computed(() => {
		if (!teacherStudents.value.length) return null;
		const sum = teacherStudents.value.reduce((acc, student) => {
			const lastSemester =
				student.past8SemestersGPA[student.past8SemestersGPA.length - 1] || 0;
			return acc + lastSemester;
		}, 0);
		return (sum / teacherStudents.value.length).toFixed(2);
	});

	const avgCumulativeGPA = computed(() => {
		if (!teacherStudents.value.length) return null;
		const sum = teacherStudents.value.reduce(
			(acc, student) => acc + student.cumulativeGPA,
			0
		);
		return (sum / teacherStudents.value.length).toFixed(2);
	});
</script>

<template>
	<div v-if="!loading && teacher">
		<h1>{{ teacher.name }}</h1>
		<p>
			Average Last Semester GPA: <strong>{{ avgLastSemesterGPA }}</strong>
		</p>
		<p>
			Average Cumulative GPA: <strong>{{ avgCumulativeGPA }}</strong>
		</p>
		<GPAChart :students="teacherStudents" />
	</div>
	<div v-else>
		<p>Loading teacher data...</p>
	</div>
</template>
