class Person {
  constructor(name, email) {
    this.name = name;
    this.email = email;
  }

  introduce() {
    return 'Hi, I am ' + this.name + ' (' + this.email + ')';
  }
}

class Student extends Person {
  constructor(name, email, rollNo, marks) {
    super(name, email);
    this.rollNo = rollNo;
    this.marks = marks;
  }

  introduce() {
    return super.introduce() + ', Roll No: ' + this.rollNo;
  }

  getResult() {
    if (typeof this.marks !== 'number' || this.marks < 0 || this.marks > 100) {
      return 'Invalid marks';
    }
    return this.marks >= 50 ? 'PASS' : 'FAIL';
  }
}

class FacultyMember extends Person {
  constructor(name, email, employeeId, department) {
    super(name, email);
    this.employeeId = employeeId;
    this.department = department;
  }

  introduce() {
    return super.introduce() + ', Employee ID: ' + this.employeeId + ', Department: ' + this.department;
  }
}

function show(title, value) {
  console.log('--- ' + title + ' ---');
  console.log(value);
}

const users = [
  new Student('Ali', 'ali@university.edu', 'L1F24-001', 82),
  new FacultyMember('Dr. Sana', 'sana@university.edu', 'E-501', 'CS'),
  new Student('Sara', 'sara@university.edu', 'L1F24-002', 45),
  new FacultyMember('Dr. Omar', 'omar@university.edu', 'E-502', 'SE'),
  new Person('Visitor', 'visitor@example.com')
];

console.log('--- Polymorphism ---');
users.forEach(user => console.log(user.introduce()));

show('Results', users.filter(user => user instanceof Student).map(user => user.name + ': ' + user.getResult()));

const invalidStudent = new Student('Test', 'test@university.edu', 'L1F24-999', 150);
const boundaryStudent = new Student('Edge', 'edge@university.edu', 'L1F24-998', 50);
show('Invalid marks', invalidStudent.getResult());
show('Boundary marks 50', boundaryStudent.getResult());

console.log('--- instanceof ---');
console.log('Ali is Student: ' + (users[0] instanceof Student));
console.log('Ali is Person: ' + (users[0] instanceof Person));
console.log('Ali is FacultyMember: ' + (users[0] instanceof FacultyMember));
console.log('Dr. Sana is Person: ' + (users[1] instanceof Person));
console.log('Dr. Sana is Student: ' + (users[1] instanceof Student));

const guest = {
  name: 'Dr. Ahmed',
  email: 'ahmed@example.com'
};

show('call()', Person.prototype.introduce.call(guest));

const student = users[0];
const fn = student.introduce;

console.log('--- Detached method ---');
try {
  console.log(fn());
} catch (error) {
  console.log(error.name + ': ' + error.message);
}

const boundFn = student.introduce.bind(student);
show('bind()', boundFn());

const guestBound = Person.prototype.introduce.bind(guest);
show('bind() with guest', guestBound());

show('Detached method with call()', fn.call(student));