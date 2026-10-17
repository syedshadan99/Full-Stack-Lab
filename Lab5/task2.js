const results = [
  { id: 1, name: 'Ali', department: 'CS', course: 'FSWD', marks: 82 },
  { id: 2, name: 'Sara', department: 'CS', course: 'FSWD', marks: 91 },
  { id: 3, name: 'Usman', department: 'SE', course: 'FSWD', marks: 47 },
  { id: 4, name: 'Hina', department: 'AI', course: 'FSWD', marks: 73 },
  { id: 5, name: 'Ahmed', department: 'SE', course: 'FSWD', marks: 64 },
  { id: 6, name: 'Zoya', department: 'AI', course: 'FSWD', marks: 91 }
];

function getGrade(marks) {
  if (marks >= 85) return { grade: 'A', gradePoints: 4.0 };
  if (marks >= 80) return { grade: 'A-', gradePoints: 3.67 };
  if (marks >= 75) return { grade: 'B+', gradePoints: 3.33 };
  if (marks >= 70) return { grade: 'B', gradePoints: 3.0 };
  if (marks >= 65) return { grade: 'B-', gradePoints: 2.67 };
  if (marks >= 60) return { grade: 'C+', gradePoints: 2.33 };
  if (marks >= 50) return { grade: 'C', gradePoints: 2.0 };
  return { grade: 'F', gradePoints: 0 };
}

function processResults(list) {
  return list.map(student => {
    const { grade, gradePoints } = getGrade(student.marks);
    const status = student.marks >= 50 ? 'PASS' : 'FAIL';
    return { ...student, grade, gradePoints, status };
  });
}

function rankedList(list) {
  return [...list].sort((a, b) => {
    if (b.marks !== a.marks) {
      return b.marks - a.marks;
    }
    return a.name.localeCompare(b.name);
  });
}

function departmentStats(list) {
  const stats = list.reduce((total, student) => {
    if (!total[student.department]) {
      total[student.department] = { students: 0, sum: 0, highest: 0, passed: 0 };
    }
    const dept = total[student.department];
    dept.students += 1;
    dept.sum += student.marks;
    if (student.marks > dept.highest) {
      dept.highest = student.marks;
    }
    if (student.marks >= 50) {
      dept.passed += 1;
    }
    return total;
  }, {});

  Object.keys(stats).forEach(name => {
    stats[name].average = Number((stats[name].sum / stats[name].students).toFixed(2));
    delete stats[name].sum;
  });

  return stats;
}

function overallAverage(list) {
  if (list.length === 0) {
    return 0;
  }
  const sum = list.reduce((total, student) => total + student.marks, 0);
  return sum / list.length;
}

function runQueries(list) {
  const average = overallAverage(list);
  return {
    firstAbove85: list.find(student => student.marks > 85) || null,
    firstFailedIndex: list.findIndex(student => student.marks < 50),
    anyFailed: list.some(student => student.marks < 50),
    allMarksValid: list.every(student => student.marks >= 0 && student.marks <= 100),
    aboveAverage: list.filter(student => student.marks > average),
    topThreeNames: rankedList(list).slice(0, 3).map(student => student.name)
  };
}

const processed = processResults(results);
console.log(processed);

const ranked = rankedList(results);
ranked.forEach(student => console.log(student.name, student.marks));
console.log(results.map(student => student.name));

console.log(departmentStats(results));
console.log(departmentStats([...results, { id: 7, name: 'Dania', department: 'DS', course: 'FSWD', marks: 88 }]));

console.log(runQueries(results));

console.log(processResults([]));
console.log(rankedList([]));
console.log(departmentStats([]));
console.log(runQueries([]));

console.log(runQueries([{ id: 8, name: 'Test', department: 'CS', course: 'FSWD', marks: 120 }]).allMarksValid);