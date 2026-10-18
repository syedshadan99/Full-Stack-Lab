const users = {
  1: { id: 1, name: 'Ali', email: 'ali@university.edu' },
  2: { id: 2, name: 'Sara', email: 'sara@university.edu' },
  3: { id: 3, name: '', email: 'wrong-email' }
};

function fakeFetch(url) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const id = url.split('/')[2];
      if (id === 'network') {
        reject(new TypeError('Failed to fetch'));
        return;
      }
      const user = users[id];
      if (!user) {
        resolve({ ok: false, status: 404 });
        return;
      }
      resolve({
        ok: true,
        status: 200,
        data: user,
        async json() {
          return this.data;
        }
      });
    }, 100);
  });
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

async function getUser(id) {
  let response;
  try {
    response = await fakeFetch('/users/' + id);
  } catch (error) {
    throw new Error('Network failure');
  }

  if (!response.ok) {
    throw new Error('HTTP error ' + response.status);
  }

  const user = await response.json();

  if (!isValidUser(user)) {
    throw new Error('Invalid user data');
  }

  return user;
}

async function showUser(label, id) {
  console.log('--- ' + label + ' ---');
  try {
    const user = await getUser(id);
    console.log(user);
  } catch (error) {
    console.log('Error: ' + error.message);
  }
}

async function main() {
  await showUser('Valid user', 1);
  await showUser('Another valid user', 2);
  await showUser('User not found', 999);
  await showUser('Invalid user data', 3);
  await showUser('Network failure', 'network');
  console.log('All tests finished');
}

main();