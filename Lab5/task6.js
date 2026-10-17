const students = {
  101: { id: 101, name: 'Ali', completed: ['CS201', 'CS301'] },
  102: { id: 102, name: 'Sara', completed: ['CS201'] },
  103: { id: 103, name: 'Hina', completed: ['CS201', 'CS301'] }
};

const courses = {
  CS401: { code: 'CS401', prerequisite: 'CS301', seats: 2 },
  CS402: { code: 'CS402', prerequisite: 'CS201', seats: 0 },
  CS403: { code: 'CS403', prerequisite: null, seats: 5 }
};

const registrations = [];

function loadStudent(studentId, callback) {
  setTimeout(() => {
    const student = students[studentId];
    if (!student) {
      callback(new Error('Student does not exist'));
      return;
    }
    callback(null, student);
  }, 100);
}

function checkPrerequisites(student, courseCode, callback) {
  setTimeout(() => {
    const course = courses[courseCode];
    if (!course) {
      callback(new Error('Course does not exist'));
      return;
    }
    if (course.prerequisite !== null && !student.completed.includes(course.prerequisite)) {
      callback(new Error('Prerequisite not completed: ' + course.prerequisite));
      return;
    }
    callback(null, { student: student, course: course });
  }, 100);
}

function checkSeats(data, callback) {
  setTimeout(() => {
    if (data.course.seats <= 0) {
      callback(new Error('Course is full'));
      return;
    }
    callback(null, data);
  }, 100);
}

function registerCourse(data, callback) {
  setTimeout(() => {
    const alreadyRegistered = registrations.some(item => {
      return item.studentId === data.student.id && item.course === data.course.code;
    });
    if (alreadyRegistered) {
      callback(new Error('Student already registered'));
      return;
    }
    const confirmation = {
      studentId: data.student.id,
      course: data.course.code,
      status: 'REGISTERED'
    };
    registrations.push(confirmation);
    data.course.seats -= 1;
    callback(null, confirmation);
  }, 100);
}

function register(studentId, courseCode, finalCallback) {
  loadStudent(studentId, (error1, student) => {
    if (error1) {
      finalCallback(error1);
      return;
    }
    checkPrerequisites(student, courseCode, (error2, data) => {
      if (error2) {
        finalCallback(error2);
        return;
      }
      checkSeats(data, (error3, checkedData) => {
        if (error3) {
          finalCallback(error3);
          return;
        }
        registerCourse(checkedData, (error4, confirmation) => {
          if (error4) {
            finalCallback(error4);
            return;
          }
          finalCallback(null, confirmation);
        });
      });
    });
  });
}

const tests = [
  { label: 'Normal registration', studentId: 101, course: 'CS401' },
  { label: 'Already registered', studentId: 101, course: 'CS401' },
  { label: 'Student does not exist', studentId: 999, course: 'CS401' },
  { label: 'Prerequisite not completed', studentId: 102, course: 'CS401' },
  { label: 'Course is full', studentId: 103, course: 'CS402' },
  { label: 'Course does not exist', studentId: 101, course: 'CS999' },
  { label: 'No prerequisite needed', studentId: 103, course: 'CS403' }
];

function runTests(index) {
  if (index >= tests.length) {
    console.log('All tests finished');
    return;
  }
  const test = tests[index];
  console.log('--- ' + test.label + ' ---');
  register(test.studentId, test.course, (error, result) => {
    if (error) {
      console.log('Error: ' + error.message);
    } else {
      console.log(result);
    }
    runTests(index + 1);
  });
}

runTests(0);