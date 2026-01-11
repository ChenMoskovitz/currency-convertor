import { test, expect } from '@playwright/test';

test('get users 200 OK', async ({ request }) => {
    const response = await request.get('http://127.0.0.1:8000/get_all_users');
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data).toBeDefined();
    expect(Array.isArray(data)).toBe(true);
});
test('add user 200 OK', async ({ request }) => {
    const response = await request.post('http://127.0.0.1:8000/add_user?first_name=Test&last_name=Name');
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(typeof data).toBe('object');
    expect(Array.isArray(data)).toBe(false);
    expect(data.Message).toBe('new user added');
    expect(data['User Id']).toBeDefined();
    expect(data['First Name']).toBe('Test');
    expect(data['Last Name']).toBe('Test');
})
test('get user 200 OK', async ({ request }) => {
    const response = await request.get('http://127.0.0.1:8000/get_user?user_id=1');
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(typeof data).toBe('object');
    expect(Array.isArray(data)).toBe(false);
    expect(data.id).toBe(1);
    expect(data.first_name).toBeDefined();
    expect(data.last_name).toBeDefined();
})