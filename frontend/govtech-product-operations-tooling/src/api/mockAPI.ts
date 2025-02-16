import students from "../data/students.json";
import teachers from "../data/teachers.json";

// Add interfaces
interface Student {
	id: number;
	cumulativeGPA: number;
	past8SemestersGPA: number[];
	teacherId: number;
}
interface Teacher {
	id: number;
	name: string;
	students: number[];
}

export const fetchStudents = async (): Promise<Student[]> => {
	return students;
};

export const fetchTeachers = async (): Promise<Teacher[]> => {
	return teachers;
};

export const fetchStudentById = async (
	id: number
): Promise<Student | undefined> => {
	return students.find((student: Student) => student.id === id);
};

export const fetchTeacherById = async (
	id: number
): Promise<Teacher | undefined> => {
	return teachers.find((teacher: Teacher) => teacher.id === id);
};

export const fetchStudentsByTeacherId = async (
	teacherId: number
): Promise<Student[]> => {
	return students.filter((student: Student) => student.teacherId === teacherId);
};

export const fetchTeachersByStudentId = async (
	studentId: number
): Promise<Teacher[]> => {
	return teachers.filter((teacher: Teacher) =>
		teacher.students.includes(studentId)
	);
};
