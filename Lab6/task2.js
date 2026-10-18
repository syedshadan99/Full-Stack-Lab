const users = {
  1: { id: 1, name: 'Ali', email: 'ali@university.edu' },
  2: { id: 2, name: 'Sara', email: 'sara@university.edu' },
  3: { id: 3, name: '', email: 'wrong-email' }
};

const courses = {
  FSWD: { code: 'FSWD', title: 'Full Stack Web Development', credits: 3 },
  DSA: { code: 'DSA', title: 'Data Structures', credits: 3 },
  BAD: { code: '', title: '', credits: -1 }
};

function fakeFetch(url) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const parts = url.split('/');
      const table = parts[1] === 'users' ? users : courses;
      if (parts[2] === 'network') {
        reject(new TypeError('Failed to fetch'));
        return;
      }
      const item = table[parts[2]];
      if (!item) {
        resolve({ ok: false, status: 404 });
        return;
      }
      resolve({
        ok: true,
        status: 200,
        data: item,
        async json() {
          return this.data;
        }
      });
    }, 100);
  });
}

async function getData(url) {
  let response;
  try {
    response = await fakeFetch(url);
  } catch (error) {
    throw new Error('Network failure for ' + url);
  }
  if (!response.ok) {
    throw new Error('HTTP error ' + response.status + ' for ' + url);
  }
  return response.json();
}

function fetchUser(id) {
  return getData('/users/' + id);
}

function fetchCourse(code) {
  return getData('/courses/' + code);
}

function isValidUser(user) {
  return (
    user !== null &&
    typeof user === 'object' &&
    typeof user.id === 'number' &&
    typeof user.name === 'string' &&
    user.name !== '' &&
    typeof user.email === 'string' &&
    user.email.includes('@')
  );
}

function isValidCourse(course) {
  return (
    course !== null &&
    typeof course === 'object' &&
    typeof course.code === 'string' &&
    course.code !== '' &&
    typeof course.title === 'string' &&
    course.title !== '' &&
    typeof course.credits === 'number' &&
    course.credits > 0
  );
}

async function loadDetails(userId, courseCode) {
  const [user, course] = await Promise.all([
    fetchUser(userId),
    fetchCourse(courseCode)
  ]);

  if (!isValidUser(user)) {
    throw new Error('User details are not valid');
  }
  if (!isValidCourse(course)) {
    throw new Error('Course details are not valid');
  }

  return { user: user, course: course };
}

async function showDetails(label, userId, courseCode) {
  console.log('--- ' + label + ' ---');
  try {
    const result = await loadDetails(userId, courseCode);
    console.log('Accepted');
    console.log(result);
  } catch (error) {
    console.log('Rejected: ' + error.message);
  }
}

async function main() {
  await showDetails('Both valid', 1, 'FSWD');
  await showDetails('User invalid', 3, 'FSWD');
  await showDetails('Course invalid', 1, 'BAD');
  await showDetails('Both invalid', 3, 'BAD');
  await showDetails('User not found', 999, 'FSWD');
  await showDetails('Course not found', 1, 'XYZ');
  await showDetails('Network failure', 'network', 'FSWD');
  console.log('All tests finished');
}

main();