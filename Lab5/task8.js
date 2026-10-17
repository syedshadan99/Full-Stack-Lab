const users = [
  { id: 1, name: 'Ali', department: 'CS' },
  { id: 2, name: 'Sara', department: 'CS' },
  { id: 3, name: 'Usman', department: 'SE' },
  { id: 4, name: 'Hina', department: 'AI' },
  { id: 5, name: 'Ahmed', department: 'SE' },
  { id: 6, name: 'Zoya', department: 'AI' }
];

const courses = [
  { code: 'FSWD', title: 'Full Stack Web Development' },
  { code: 'DSA', title: 'Data Structures' },
  { code: 'DB', title: 'Database Systems' }
];

const results = [
  { studentId: 1, course: 'FSWD', marks: 82 },
  { studentId: 2, course: 'FSWD', marks: 91 },
  { studentId: 3, course: 'FSWD', marks: 47 },
  { studentId: 4, course: 'FSWD', marks: 73 },
  { studentId: 5, course: 'FSWD', marks: 64 },
  { studentId: 6, course: 'FSWD', marks: 91 }
];

const routes = {
  '/users': { status: 200, body: JSON.stringify(users) },
  '/courses': { status: 200, body: JSON.stringify(courses) },
  '/results': { status: 200, body: JSON.stringify(results) },
  '/notfound': { status: 404, body: '{"message":"Not found"}' },
  '/error': { status: 500, body: '{"message":"Server error"}' },
  '/badjson': { status: 200, body: '{ this is not json' },
  '/slow': { status: 200, body: '{"message":"slow"}', delay: 3000 }
};

class ApiError extends Error {
  constructor(message, type) {
    super(message);
    this.name = 'ApiError';
    this.type = type;
  }
}

function wait(milliseconds, signal) {
  return new Promise((resolve, reject) => {
    if (signal && signal.aborted) {
      const abortError = new Error('Request aborted');
      abortError.name = 'AbortError';
      reject(abortError);
      return;
    }
    const timer = setTimeout(resolve, milliseconds);
    if (signal) {
      signal.addEventListener('abort', () => {
        clearTimeout(timer);
        const abortError = new Error('Request aborted');
        abortError.name = 'AbortError';
        reject(abortError);
      });
    }
  });
}

async function fakeFetch(url, options = {}) {
  if (url === '/network') {
    await wait(50, options.signal);
    throw new TypeError('Failed to fetch');
  }
  const route = routes[url] || { status: 404, body: '{"message":"Unknown url"}', delay: 50 };
  await wait(route.delay || 100, options.signal);
  return {
    ok: route.status >= 200 && route.status < 300,
    status: route.status,
    body: route.body,
    async json() {
      return JSON.parse(this.body);
    }
  };
}

async function getJSON(url, fetchImplementation, options) {
  let response;
  try {
    response = await fetchImplementation(url, options);
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new ApiError('Request timed out or aborted: ' + url, 'TIMEOUT');
    }
    throw new ApiError('Network failure: ' + url, 'NETWORK');
  }

  if (!response.ok) {
    throw new ApiError('HTTP error ' + response.status + ' for ' + url, 'HTTP');
  }

  try {
    return await response.json();
  } catch (error) {
    throw new ApiError('Invalid JSON from ' + url, 'INVALID_JSON');
  }
}

async function fetchWithTimeout(url, milliseconds) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), milliseconds);
  try {
    return await getJSON(url, fakeFetch, { signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

function buildDashboard(userList, courseList, resultList) {
  if (!Array.isArray(userList) || !Array.isArray(courseList) || !Array.isArray(resultList)) {
    throw new TypeError('Users, courses and results must be arrays');
  }

  const total = resultList.reduce((sum, item) => sum + item.marks, 0);
  const overallAverage = resultList.length === 0 ? 0 : Number((total / resultList.length).toFixed(2));

  const best = resultList.reduce((top, item) => {
    return top === null || item.marks > top.marks ? item : top;
  }, null);

  let highestStudent = null;
  if (best !== null) {
    const bestUser = userList.find(user => user.id === best.studentId);
    highestStudent = {
      name: bestUser ? bestUser.name : 'Unknown',
      marks: best.marks
    };
  }

  const failedStudents = resultList.filter(item => item.marks < 50).length;

  const departments = resultList.reduce((all, item) => {
    const user = userList.find(person => person.id === item.studentId);
    const name = user ? user.department : 'Unknown';
    if (!all[name]) {
      all[name] = { students: 0, sum: 0, highest: 0, passed: 0 };
    }
    all[name].students += 1;
    all[name].sum += item.marks;
    if (item.marks > all[name].highest) {
      all[name].highest = item.marks;
    }
    if (item.marks >= 50) {
      all[name].passed += 1;
    }
    return all;
  }, {});

  Object.keys(departments).forEach(name => {
    departments[name].average = Number((departments[name].sum / departments[name].students).toFixed(2));
    delete departments[name].sum;
  });

  return {
    totalStudents: userList.length,
    totalCourses: courseList.length,
    overallAverage: overallAverage,
    highestStudent: highestStudent,
    failedStudents: failedStudents,
    departments: departments
  };
}

async function loadDashboard(fetchImplementation, urls = { users: '/users', courses: '/courses', results: '/results' }) {
  const [userList, courseList, resultList] = await Promise.all([
    getJSON(urls.users, fetchImplementation),
    getJSON(urls.courses, fetchImplementation),
    getJSON(urls.results, fetchImplementation)
  ]);
  return buildDashboard(userList, courseList, resultList);
}

async function runTest(label, work) {
  console.log('--- ' + label + ' ---');
  try {
    const result = await work();
    console.log(result);
  } catch (error) {
    const type = error.type ? ' [' + error.type + ']' : '';
    console.log(error.name + type + ': ' + error.message);
  }
}

async function main() {
  await runTest('200 success', () => getJSON('/courses', fakeFetch));
  await runTest('404 response', () => getJSON('/notfound', fakeFetch));
  await runTest('500 response', () => getJSON('/error', fakeFetch));
  await runTest('Network failure', () => getJSON('/network', fakeFetch));
  await runTest('Invalid JSON', () => getJSON('/badjson', fakeFetch));

  await runTest('Timeout: fast request', () => fetchWithTimeout('/users', 1000));
  await runTest('Timeout: slow request', () => fetchWithTimeout('/slow', 500));
  await runTest('Timeout: HTTP failure', () => fetchWithTimeout('/notfound', 1000));

  await runTest('Concurrent dashboard', async () => {
    const start = Date.now();
    const dashboard = await loadDashboard(fakeFetch);
    console.log('Time taken: about ' + (Date.now() - start) + ' ms');
    return dashboard;
  });

  await runTest('Dashboard when one service fails', () => {
    return loadDashboard(fakeFetch, { users: '/users', courses: '/error', results: '/results' });
  });

  await runTest('Empty data', () => buildDashboard([], [], []));
  await runTest('Invalid data', () => buildDashboard('text', [], []));

  console.log('All tests finished');
}

main();