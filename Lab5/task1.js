const applicants = [
  { id: 'A101', name: 'Sara Khan', age: '19', matricMarks: '91', intermediateMarks: '87', entryTest: '78', program: 'BSCS', feePaid: 'true' },
  { id: 'A102', name: 'Ahmed Ali', age: 'twenty', matricMarks: '88', intermediateMarks: '', entryTest: '72', program: 'BSSE', feePaid: 'false' },
  { id: 'A103', name: 'Hassan', age: '18', matricMarks: '76', intermediateMarks: '83', entryTest: '91', program: 'BSAI', feePaid: 'true' },
  { id: 'A104', name: 'Bilal', age: '20', matricMarks: '80', intermediateMarks: '75', entryTest: '82', program: 'BSCS', feePaid: 'false' },
  { id: 'A105', name: 'Noor', age: '21', matricMarks: '85', intermediateMarks: '90', entryTest: '55', program: 'BSSE', feePaid: 'true' },
  { id: 'A106', name: 'Fatima', age: '35', matricMarks: '90', intermediateMarks: '90', entryTest: '90', program: 'BSCS', feePaid: 'true' },
  { id: 'A107', name: 'Zain', age: '18', matricMarks: '105', intermediateMarks: '80', entryTest: '80', program: 'BSAI', feePaid: 'true' },
  { id: 'A108', name: 'Hira', age: '19', matricMarks: '70', intermediateMarks: '70', entryTest: '70', program: 'BBA', feePaid: 'true' }
];
function toNumber(value) {
  if (value === undefined || value === null) {
    return null;
  }
  if (String(value).trim() === '') {
    return null;
  }
  const number = Number(value);
  if (Number.isNaN(number)) {
    return null;
  }
  return number;
}
function isValidMarks(marks) {
  return marks !== null && marks >= 0 && marks <= 100;
}
function isSupportedProgram(program) {
  switch (program) {
    case 'BSCS':
    case 'BSSE':
    case 'BSAI':
      return true;
    default:
      return false;
  }
}
function processApplicant(applicant) {
  const age = toNumber(applicant.age);
  const matric = toNumber(applicant.matricMarks);
  const inter = toNumber(applicant.intermediateMarks);
  const test = toNumber(applicant.entryTest);
  const feePaid = applicant.feePaid === 'true';
  const errors = [];
  if (age === null) {
    errors.push('Age is missing or not a number');
  } else if (age < 17 || age > 30) {
    errors.push('Age must be between 17 and 30');
  }

  if (!isValidMarks(matric)) {
    errors.push('Matric marks are invalid');
  }
  if (!isValidMarks(inter)) {
    errors.push('Intermediate marks are invalid');
  }
  if (!isValidMarks(test)) {
    errors.push('Entry test marks are invalid');
  }
  if (!isSupportedProgram(applicant.program)) {
    errors.push('Program is not supported');
  }
  if (errors.length > 0) {
    return {
      id: applicant.id,
      name: applicant.name,
      program: applicant.program,
      merit: null,
      status: 'INVALID DATA',
      errors: errors
    };
  }
  const merit = Number((matric * 0.2 + inter * 0.3 + test * 0.5).toFixed(2));
  const eligible = merit >= 70 && test >= 60 && inter >= 60;
  let status;
  if (!eligible) {
    status = 'REJECTED';
  } else {
    status = merit >= 75 && feePaid ? 'SELECTED' : 'WAITING';
  }
  return {
    id: applicant.id,
    name: applicant.name,
    program: applicant.program,
    merit: merit,
    status: status,
    errors: []
  };
}
function processAll(list) {
  const results = [];
  for (const applicant of list) {
    results.push(processApplicant(applicant));
  }
  return results;
}
function makeSummary(results) {
  let validCount = 0;
  let invalidCount = 0;
  let totalMerit = 0;
  let highest = null;
  let lowest = null;
  const programCount = {};
  for (const result of results) {
    programCount[result.program] = (programCount[result.program] || 0) + 1;

    if (result.status === 'INVALID DATA') {
      invalidCount++;
      continue;
    }
    validCount++;
    totalMerit += result.merit;

    if (highest === null || result.merit > highest.merit) {
      highest = result;
    }
    if (lowest === null || result.merit < lowest.merit) {
      lowest = result;
    }
  }
  const average = validCount > 0 ? Number((totalMerit / validCount).toFixed(2)) : 0;
  return {
    validApplicants: validCount,
    invalidApplicants: invalidCount,
    highestMerit: highest,
    lowestMerit: lowest,
    averageMerit: average,
    applicantsPerProgram: programCount
  };
}
const results = processAll(applicants);
console.log(results);
console.log(makeSummary(results));
console.log(processAll([]));
console.log(makeSummary([]));