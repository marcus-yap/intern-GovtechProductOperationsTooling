<script setup lang="ts">
	import { ref, onMounted, onUnmounted, watch, computed } from "vue";
	import { Chart, registerables } from "chart.js";

	Chart.register(...registerables);

	const props = defineProps({
		students: {
			type: Array,
			required: true,
		},
	});

	const chartInstance = ref<Chart | null>(null);
	const chartCanvas = ref<HTMLCanvasElement | null>(null);

	const chartData = computed(() => {
		const avgSemesterGPA = [];
		const avgCumulativeGPA = [];
		const count = props.students.length;

		for (let i = 0; i < 8; i++) {
			let totalSemester = 0;
			let totalCumulative = 0;
			props.students.forEach((student) => {
				totalSemester += student.past8SemestersGPA[i] || 0;
				let perStudentSum = 0;
				for (let j = 0; j <= i; j++) {
					perStudentSum += student.past8SemestersGPA[j] || 0;
				}
				totalCumulative += perStudentSum / (i + 1);
			});
			avgSemesterGPA.push(totalSemester / count);
			avgCumulativeGPA.push(totalCumulative / count);
		}

		return {
			labels: Array.from({ length: 8 }, (_, i) =>
				i < 7 ? `Semester ${-8 + i}` : "Last Semester"
			),
			datasets: [
				{
					label: "Average Semester GPA (Past 8 Semesters)",
					data: avgSemesterGPA,
					borderColor: "purple",
					fill: false,
				},
				{
					label: "Average Cumulative GPA (Past 8 Semesters)",
					data: avgCumulativeGPA,
					borderColor: "darkorange",
					fill: false,
				},
			],
		};
	});

	const createChart = () => {
		if (!chartCanvas.value || !props.students.length) return;

		if (chartInstance.value) {
			chartInstance.value.destroy();
		}

		chartInstance.value = new Chart(chartCanvas.value, {
			type: "line",
			data: chartData.value,
			options: {
				responsive: true,
				maintainAspectRatio: false,
				plugins: {
					legend: {
						position: "top",
					},
					tooltip: {
						callbacks: {
							label: (tooltipItem) => tooltipItem.raw.toFixed(2),
						},
					},
				},
			},
		});
	};

	// Cleanup chart when component is unmounted
	onUnmounted(() => {
		if (chartInstance.value) {
			chartInstance.value.destroy();
		}
	});

	// Watch for changes in students prop and re-render the chart
	watch(
		() => props.students,
		(newStudents) => {
			if (newStudents?.length) {
				createChart();
			}
		},
		{ deep: true, immediate: true } // This will run on component mount
	);

	onMounted(() => {
		createChart();
	});
</script>

<template>
	<div class="chart-container">
		<canvas ref="chartCanvas"></canvas>
	</div>
</template>

<style scoped>
	.chart-container {
		position: relative;
		height: 400px;
		width: 100%;
		margin: 20px 0;
	}
</style>
