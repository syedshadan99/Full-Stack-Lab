const students = {
  101: { id: 101, name: 'Ali', email: 'ali@university.edu', phone: '03001234567', completed: ['CS201', 'CS301'] },
  102: { id: 102, name: 'Sara', email: 'sara@university.edu', phone: null, completed: ['CS201'] },
  103: { id: 103, name: 'Hina', email: 'hina@university.edu', phone: '03007654321', completed: ['CS201', 'CS301'] }
};

const courses = {
  CS401: { code: 'CS401', prerequisite: 'CS301', seats: 2 },
  CS402: { code: 'CS402', prerequisite: 'CS201', seats: 0 },
  CS403: { code: 'CS403', prerequisite: null, seats: 5 }
};

const registrations = [];

function getStudent(studentId) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const student = students[studentId];
      if (!student) {
        reject(new Error('Student does not exist'));
        return;
      }
      resolve(student);
    }, 100);
  });
}

function getCourse(data) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const course = courses[data.courseCode];
      if (!course) {
        reject(new Error('Course does not exist'));
        return;
      }
      resolve({ student: data.student, course: course });
    }, 100);
  });
}

function checkPrerequisites(data) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const needed = data.course.prerequisite;
      if (needed !== null && !data.student.completed.includes(needed)) {
        reject(new Error('Prerequisite not completed: ' + needed));
        return;
      }
      resolve(data);
    }, 100);
  });
}

function checkSeats(data) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (data.course.seats <= 0) {
        reject(new Error('Course is full'));
        return;
      }
      resolve(data);
    }, 100);
  });
}

function registerStudent(data) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const alreadyRegistered = registrations.some(item => {
        return item.studentId === data.student.id && item.course === data.course.code;
      });
      if (alreadyRegistered) {
        reject(new Error('Student already registered'));
        return;
      }
      const confirmation = {
        studentId: data.student.id,
        course: data.course.code,
        status: 'REGISTERED'
      };
      registrations.push(confirmation);
      data.course.seats -= 1;
      resolve({ student: data.student, course: data.course, confirmation: confirmation });
    }, 100);
  });
}

function sendEmail(student) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!student.email) {
        reject(new Error('No email address'));
        return;
      }
      resolve('Email sent to ' + student.email);
    }, 100);
  });
}

function sendSMS(student) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!student.phone) {
        reject(new Error('No phone number'));
        return;
      }
      resolve('SMS sent to ' + student.phone);
    }, 150);
  });
}

function writeAuditLog(confirmation) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve('Audit saved for student ' + confirmation.studentId);
    }, 50);
  });
}

function sendNotifications(data) {
  const names = ['Email', 'SMS', 'Audit'];
  return Promise.allSettled([
    sendEmail(data.student),
    sendSMS(data.student),
    writeAuditLog(data.confirmation)
  ]).then(results => {
    return results.map((result, index) => {
      return { service: names[index], status: result.status };
    });
  });
}

function registerCourse(studentId, courseCode) {
  return getStudent(studentId)
    .then(student => getCourse({ student: student, courseCode: courseCode }))
    .then(data => checkPrerequisites(data))
    .then(data => checkSeats(data))
    .then(data => registerStudent(data))
    .then(data => {
      return sendNotifications(data).then(report => {
        return { confirmation: data.confirmation, notifications: report };
      });
    });
}

function serverA(courseCode, shouldFail) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldFail) {
        reject(new Error('Server A is down'));
        return;
      }
      resolve({ server: 'A', course: courses[courseCode] });
    }, 100);
  });
}

function serverB(courseCode, shouldFail) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldFail) {
        reject(new Error('Server B is down'));
        return;
      }
      resolve({ server: 'B', course: courses[courseCode] });
    }, 300);
  });
}

function getCourseFromServers(courseCode, aFails, bFails) {
  return Promise.any([serverA(courseCode, aFails), serverB(courseCode, bFails)]);
}

const tests = [
  { label: 'Normal registration', studentId: 101, course: 'CS401' },
  { label: 'Registration where SMS fails', studentId: 102, course: 'CS403' },
  { label: 'Already registered', studentId: 101, course: 'CS401' },
  { label: 'Student does not exist', studentId: 999, course: 'CS401' },
  { label: 'Prerequisite not completed', studentId: 102, course: 'CS401' },
  { label: 'Course is full', studentId: 103, course: 'CS402' },
  { label: 'Course does not exist', studentId: 101, course: 'CS999' }
];

function runServerTests() {
  console.log('--- Part C: Promise.any, server A fails ---');
  getCourseFromServers('CS401', true, false)
    .then(result => console.log('Accepted result from server ' + result.server))
    .catch(error => console.log('Error: ' + error.message))
    .then(() => {
      console.log('--- Part C: Promise.race, server A fails (for comparison) ---');
      return Promise.race([serverA('CS401', true), serverB('CS401', false)])
        .then(result => console.log('Accepted result from server ' + result.server))
        .catch(error => console.log('Error: ' + error.message));
    })
    .then(() => {
      console.log('--- Part C: Promise.any, both servers fail ---');
      return getCourseFromServers('CS401', true, true)
        .then(result => console.log(result))
        .catch(error => console.log(error.name + ': ' + error.errors.length + ' servers failed'));
    })
    .finally(() => console.log('All tests finished'));
}

function runTests(index) {
  if (index >= tests.length) {
    runServerTests();
    return;
  }
  const test = tests[index];
  console.log('--- ' + test.label + ' ---');
  registerCourse(test.studentId, test.course)
    .then(result => {
      console.log(result.confirmation);
      console.log(result.notifications);
    })
    .catch(error => console.log('Error: ' + error.message))
    .finally(() => {
      console.log('Request finished');
      runTests(index + 1);
    });
}

runTests(0);