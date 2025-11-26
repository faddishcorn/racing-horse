import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:4000'; // Assuming default port is 3000, check .env if needed
let cookie = '';

async function request(method, path, body = null) {
    const headers = { 'Content-Type': 'application/json' };
    if (cookie) headers['Cookie'] = cookie;

    const options = {
        method,
        headers,
        body: body ? JSON.stringify(body) : null,
    };

    const res = await fetch(`${BASE_URL}${path}`, options);

    // Update cookie if set-cookie header is present
    const setCookie = res.headers.get('set-cookie');
    if (setCookie) {
        cookie = setCookie.split(';')[0];
    }

    const data = await res.json();
    return { status: res.status, data };
}

async function run() {
    console.log('Starting verification...');
    const email = `test_${Date.now()}@example.com`;
    const password = 'password123';

    // 1. Register
    console.log(`1. Registering user: ${email}`);
    const regRes = await request('POST', '/api/auth/register', { email, password });
    if (regRes.status !== 201) {
        console.error('Registration failed:', regRes.data);
        process.exit(1);
    }
    console.log('Registration success:', regRes.data);
    if (!Array.isArray(regRes.data.user.favorites) || typeof regRes.data.user.notes !== 'object') {
        console.error('Invalid response structure for register');
        process.exit(1);
    }

    // 2. Login (Already logged in via register, but testing login endpoint)
    console.log('2. Logging in...');
    const loginRes = await request('POST', '/api/auth/login', { email, password });
    if (loginRes.status !== 200) {
        console.error('Login failed:', loginRes.data);
        process.exit(1);
    }
    console.log('Login success');

    // 3. Toggle Favorite
    const hrNo = '000123';
    console.log(`3. Toggling favorite for hrNo: ${hrNo}`);
    const favRes = await request('POST', '/api/users/favorites/toggle', { hrNo });
    if (favRes.status !== 200) {
        console.error('Toggle favorite failed:', favRes.data);
        process.exit(1);
    }
    console.log('Toggle favorite success:', favRes.data);
    if (!favRes.data.favorites.includes(hrNo)) {
        console.error('Favorite not added');
        process.exit(1);
    }

    // 4. Save Note
    const noteContent = 'This is a test note';
    console.log(`4. Saving note for hrNo: ${hrNo}`);
    const noteRes = await request('POST', '/api/users/notes', { hrNo, note: noteContent });
    if (noteRes.status !== 200) {
        console.error('Save note failed:', noteRes.data);
        process.exit(1);
    }
    console.log('Save note success:', noteRes.data);
    if (noteRes.data.notes[hrNo] !== noteContent) {
        console.error('Note not saved correctly');
        process.exit(1);
    }

    // 5. Get Session/Me
    console.log('5. Verifying session data...');
    const meRes = await request('GET', '/api/users/me');
    if (meRes.status !== 200) {
        console.error('Get me failed:', meRes.data);
        process.exit(1);
    }
    console.log('Get me success:', meRes.data);
    if (!meRes.data.favorites.includes(hrNo) || meRes.data.notes[hrNo] !== noteContent) {
        console.error('Session data mismatch');
        process.exit(1);
    }

    console.log('Verification passed!');
}

run().catch(console.error);
