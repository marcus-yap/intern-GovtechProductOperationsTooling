<script setup lang="ts">
	import { ref, onMounted, onUnmounted, watch, computed, nextTick } from "vue";
	import { Chart, registerables } from "chart.js";

	Chart.register(...registerables);

	const props = defineProps({
		students: {
			type: [Array, Object],
			required: true,
		},
	});

	const chartInstance = ref<Chart | null>(null);
	const chartCanvas = ref<HTMLCanvasElement | null>(null);

	const isSingleStudent = computed(() => !Array.isArray(props.students));
	const studentsArray = computed(() =>
		isSingleStudent.value ? [props.students] : props.students
	);

	const chartData = computed(() => {
		const labels = Array.from({ length: 8 }, (_, i) => `Semester ${-8 + i}`);
		const avgSemesterGPA = [];
		const avgCumulativeGPA = [];
		const count = studentsArray.value.length || 1;

		for (let i = 0; i < 8; i++) {
			let totalSemester = 0;
			let totalCumulative = 0;
			studentsArray.value.forEach((student) => {
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
			labels,
			datasets: [
				{
					label: isSingleStudent.value
						? "Semester GPA"
						: "Average Semester GPA",
					data: avgSemesterGPA,
					borderColor: "purple",
					fill: false,
				},
				{
					label: isSingleStudent.value
						? "Cumulative GPA"
						: "Average Cumulative GPA",
					data: avgCumulativeGPA,
					borderColor: "darkorange",
					fill: false,
				},
			],
		};
	});

	const createChart = () => {
		if (!chartCanvas.value) return;
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
					legend: { position: "top" },
					tooltip: {
						callbacks: {
							label: (tooltipItem) => tooltipItem.raw.toFixed(2),
						},
					},
				},
			},
		});
	};

	onMounted(async () => {
		await nextTick();
		createChart();
	});

	watch(
		() => props.students,
		() => {
			if (chartInstance.value) {
				chartInstance.value.data = chartData.value;
				chartInstance.value.update();
			} else {
				createChart();
			}
		},
		{ deep: true, immediate: true }
	);

	onUnmounted(() => {
		if (chartInstance.value) {
			chartInstance.value.destroy();
		}
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
		min-width: 600px;
		margin: 20px 0;
	}
</style>
