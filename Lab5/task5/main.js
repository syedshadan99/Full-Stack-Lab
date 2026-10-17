import Student from './Student.js';
import { processTranscript, reportToJson as toJson } from './transcriptService.js';

function runTest(label, input) {
  console.log('--- ' + label + ' ---');
  try {
    const report = processTranscript(input);
    console.log(toJson(report));
  } catch (error) {
    console.log(error.name + ': ' + error.message);
  } finally {
    console.log('Test finished');
  }
}

const sampleStudent = new Student(1, 'Demo', []);
console.log(sampleStudent);

const validData = `
[
  {
    "id": 101,
    "name": "Ali",
    "courses": [
      { "code": "CS301", "marks": 81 },
      { "code": "CS302", "marks": 74 }
    ]
  }
]
`;

const boundaryData = `
[
  {
    "id": 102,
    "name": "Sara",
    "courses": [
      { "code": "CS301", "marks": 0 },
      { "code": "CS302", "marks": 100 }
    ]
  }
]
`;

const noCoursesData = '[{ "id": 103, "name": "Hina", "courses": [] }]';
const malformedData = '[{ "id": 101, "name": "Ali", ';
const missingIdData = '[{ "name": "Ali", "courses": [] }]';
const duplicateIdData = '[{ "id": 1, "name": "A", "courses": [] }, { "id": 1, "name": "B", "courses": [] }]';
const highMarksData = '[{ "id": 1, "name": "A", "courses": [{ "code": "CS301", "marks": 101 }] }]';
const lowMarksData = '[{ "id": 1, "name": "A", "courses": [{ "code": "CS301", "marks": -5 }] }]';
const missingCodeData = '[{ "id": 1, "name": "A", "courses": [{ "marks": 70 }] }]';
const textMarksData = '[{ "id": 1, "name": "A", "courses": [{ "code": "CS301", "marks": "70" }] }]';
const notArrayData = '{ "id": 1 }';

runTest('Valid data', validData);
runTest('Boundary marks 0 and 100', boundaryData);
runTest('Student with no courses', noCoursesData);
runTest('Malformed JSON', malformedData);
runTest('Missing ID', missingIdData);
runTest('Duplicate ID', duplicateIdData);
runTest('Marks above 100', highMarksData);
runTest('Marks below 0', lowMarksData);
runTest('Missing course code', missingCodeData);
runTest('Marks as text', textMarksData);
runTest('Not an array', notArrayData);
runTest('Input is not a string', 123);
