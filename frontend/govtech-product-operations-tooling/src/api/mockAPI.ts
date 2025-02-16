import students from "../data/students.json";
import teachers from "../data/teachers.json";

export const fetchStudents = async () => {
	return students;
};

export const fetchTeachers = async () => {
	return teachers;
};

export const fetchStudentById = async (id) => {
	return students.find((student) => student.id === id);
};

export const fetchTeacherById = async (id) => {
	return teachers.find((teacher) => teacher.id === id);
};

export const fetchStudentsByTeacherId = async (teacherId) => {
	return students.filter((student) => student.teacherId === teacherId);
};

export const fetchTeachersByStudentId = async (studentId) => {
	return teachers.filter((teacher) => teacher.studentIds.includes(studentId));
};
