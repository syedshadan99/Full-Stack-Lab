const student = {
  id: 101,
  name: 'Ali',
  marks: 0,
  scholarship: false,
  address: {
    city: 'Islamabad',
    sector: 'F-10'
  },
  contact: {
    email: 'ali@university.edu'
  }
};

const update = {
  name: 'Ali Khan',
  address: {
    city: 'Rawalpindi'
  },
  contact: {
    phone: '03001234567'
  }
};

function updateStudent(oldStudent, changes) {
  const safeChanges = changes ?? {};
  const { address: oldAddress = {}, contact: oldContact = {}, ...oldRest } = oldStudent;
  const { address: newAddress, contact: newContact, ...newRest } = safeChanges;

  return {
    ...oldRest,
    ...newRest,
    address: { ...oldAddress, ...newAddress },
    contact: { ...oldContact, ...newContact }
  };
}

function showLines(title, ...lines) {
  console.log('--- ' + title + ' ---');
  for (const line of lines) {
    console.log(line);
  }
}

function makeCheck(label, isSame) {
  return { label, isSame };
}

const updated = updateStudent(student, update);

showLines('Original student', student);
showLines('Updated student', updated);

const { name: studentName, address: { city, sector } } = updated;
const [firstName, lastName = 'No last name'] = studentName.split(' ');
const { scholarship = true, marks = 100 } = updated;

showLines(
  'Destructuring',
  'Name: ' + studentName,
  'City: ' + city,
  'Sector: ' + sector,
  'First name: ' + firstName,
  'Last name: ' + lastName,
  'Scholarship: ' + scholarship,
  'Marks: ' + marks
);

showLines(
  'Optional chaining and nullish coalescing',
  'Phone: ' + updated.contact?.phone,
  'Guardian name: ' + updated.guardian?.name,
  'Guardian name with default: ' + (updated.guardian?.name ?? 'Not given'),
  'Marks with ?? : ' + (updated.marks ?? 50),
  'Marks with || : ' + (updated.marks || 50)
);

const zeroUpdate = { marks: 0, scholarship: false, name: '' };
const richStudent = { ...student, marks: 80, scholarship: true };
const zeroResult = updateStudent(richStudent, zeroUpdate);

showLines(
  'Falsy values test',
  'Before: marks ' + richStudent.marks + ', scholarship ' + richStudent.scholarship + ', name ' + richStudent.name,
  'After: marks ' + zeroResult.marks + ', scholarship ' + zeroResult.scholarship + ', name "' + zeroResult.name + '"'
);

const emptyResult = updateStudent(student, {});
const nullResult = updateStudent(student, null);

showLines('Empty update', emptyResult);
showLines('Null update', nullResult);

const checks = [
  makeCheck('original vs updated', student === updated),
  makeCheck('original address vs updated address', student.address === updated.address),
  makeCheck('original contact vs updated contact', student.contact === updated.contact)
];

showLines('Reference check', ...checks.map(check => check.label + ': ' + (check.isSame ? 'SAME' : 'DIFFERENT')));

const shallowCopy = { ...student };
showLines(
  'Why nested copy is needed',
  'Shallow copy address same as original: ' + (shallowCopy.address === student.address)
);

showLines('Original after update (should not change)', student);