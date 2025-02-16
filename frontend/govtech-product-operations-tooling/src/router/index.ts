import { createRouter, createWebHistory } from "vue-router";
import StudentsPage from "../views/StudentsPage.vue";
import StudentPage from "../views/StudentPage.vue";
import TeachersPage from "../views/TeachersPage.vue";
import TeacherPage from "../views/TeacherPage.vue";

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{ path: "/", name: "students", component: StudentsPage },
		{ path: "/students/:id", name: "student", component: StudentPage },
		{ path: "/teachers", component: TeachersPage },
		{ path: "/teachers/:id", component: TeacherPage },
	],
});

export default router;
