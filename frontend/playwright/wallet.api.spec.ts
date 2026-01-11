import { test, expect } from '@playwright/test';
import {request} from "node:http";

//TODO add failed deposit and withdrawal test


test('wallet 200 ok', async ({request}) => {
    const response = await request.get('http://127.0.0.1:8000/wallet?user_id=1');
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(typeof data).toBe('object');
    expect(Array.isArray(data.wallet)).toBe(true);
    expect(typeof data.wallet[0].currency).toBe('string');
    expect(typeof data.wallet[0].amount).toBe('number');
});

test('deposit 200 ok', async ({request}) => {
    const response = await request.post('http://127.0.0.1:8000/deposit?user_id=1&currency=TST&amount=300');
    // console.log(await response.json());
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(typeof data).toBe('object');
    expect(Array.isArray(data["user's wallet"])).toBe(true);
    const rows = data["user's wallet"];
    expect(Array.isArray(rows[0])).toBe(true);
    const row = rows[0]
    expect(typeof row[0]).toBe('number');
    expect(typeof row[1]).toBe('number');
    expect(typeof row[2]).toBe('string');
    expect(typeof row[3]).toBe('number');
})

test('withdrawal 200 0k', async ({request}) => {
    const deposit = await request.post('http://127.0.0.1:8000/deposit?user_id=1&currency=TST&amount=300')
    const response = await request.post('http://127.0.0.1:8000/withdrawal?user_id=1&currency=TST&amount=300');
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(typeof data).toBe('object');
    expect(Array.isArray(data["user's wallet"])).toBe(true);
    const rows = data["user's wallet"];
    expect(Array.isArray(rows[0])).toBe(true);
    const row = rows[0]
    expect(typeof row[0]).toBe('number');
    expect(typeof row[1]).toBe('number');
    expect(typeof row[2]).toBe('string');
    expect(typeof row[3]).toBe('number');
})

test('convert in wallet 200 0k', async ({request}) => {
    const deposit = await request.post('http://127.0.0.1:8000/deposit?user_id=1&currency=TST&amount=300')
    const response = await request.post('http://127.0.0.1:8000/convert_in_wallet?user_id=1&from_currency=TST&to_currency=qqq&amount=300');
    expect(response.status()).toBe(200);
    const data = await response.json();
    console.log(data);
    expect(typeof data).toBe('object');
    expect(Array.isArray(data.wallet)).toBe(true);
    const rows = data.wallet;
    expect(Array.isArray(rows[0])).toBe(true);
    const row = rows[0]
    expect(typeof row[0]).toBe('number');
    expect(typeof row[1]).toBe('number');
    expect(typeof row[2]).toBe('string');
    expect(typeof row[3]).toBe('number');
})


