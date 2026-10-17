import Student from './Student.js';
import { calculateGrade, calculateAverage, calculateGPA as findGPA } from './gradeUtils.js';

function parseJson(text) {
  if (typeof text !== 'string') {
    throw new TypeError('Transcript data must be a string');
  }
  try {
    return JSON.parse(text);
  } catch (error) {
    throw new Error('Malformed JSON: ' + error.message);
  }
}

function validateCourse(course) {
  if (course === null || typeof course !== 'object') {
    throw new TypeError('Each course must be an object');
  }
  if (course.code === undefined || course.code === null || course.code === '') {
    throw new Error('Course code is missing');
  }
  if (typeof course.marks !== 'number' || Number.isNaN(course.marks)) {
    throw new TypeError('Marks must be a number for course ' + course.code);
  }
  if (course.marks < 0 || course.marks > 100) {
    throw new RangeError('Marks must be between 0 and 100 for course ' + course.code);
  }
}

function validateStudents(list) {
  if (!Array.isArray(list)) {
    throw new TypeError('Transcript data must be an array of students');
  }
  const seenIds = [];
  for (const item of list) {
    if (item === null || typeof item !== 'object') {
      throw new TypeError('Each student must be an object');
    }
    if (item.id === undefined || item.id === null) {
      throw new Error('Student ID is missing');
    }
    if (seenIds.includes(item.id)) {
      throw new Error('Duplicate student ID: ' + item.id);
    }
    seenIds.push(item.id);
    if (!Array.isArray(item.courses)) {
      throw new TypeError('Courses must be an array for student ' + item.id);
    }
    for (const course of item.courses) {
      validateCourse(course);
    }
  }
}

export function processTranscript(jsonText) {
  const list = parseJson(jsonText);
  validateStudents(list);

  const students = [];
  for (const item of list) {
    const student = new Student(item.id, item.name, item.courses);
    const courses = [];
    for (const course of student.courses) {
      courses.push({
        code: course.code,
        marks: course.marks,
        grade: calculateGrade(course.marks)
      });
    }
    students.push({
      id: student.id,
      name: student.name,
      courses: courses,
      average: calculateAverage(student.courses),
      gpa: findGPA(student.courses)
    });
  }

  return {
    totalStudents: students.length,
    students: students
  };
}

export function reportToJson(report) {
  return JSON.stringify(report, null, 2);
}
