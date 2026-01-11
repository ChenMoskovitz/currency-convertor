import { test, expect } from '@playwright/test';

test ('get convert 200 OK', async ({request}) => {
    const response = await request.get('http://127.0.0.1:8000/convert?from_currency=TST&to_currency=QQQ&amount=300');
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(typeof data).toEqual('object');
    expect(data).not.toBe(undefined);
    expect(Array.isArray(data)).toBe(false);
    expect(data).toHaveProperty('from currency');
    expect(data).toHaveProperty('to currency');
    expect(data).toHaveProperty('amount');
    expect(data).toHaveProperty('converted_amount');
})

test ('get currencies 200 OK', async ({ request }) => {
    const response = await request.get('http://127.0.0.1:8000/currencies');
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(Array.isArray(data.currencies)).toBe(true);
    if (data.currencies >= 0) {
        const currency = data.currencies[0];
        expect(Array.isArray(currency)).toBe(true);
        expect(typeof currency[0]).toBe('string');
        expect(typeof currency[1]).toBe('number');
    }
})

test('get rates 200 OK', async ({ request }) => {
    const response = await request.get('http://127.0.0.1:8000/rates?main_currency=TST');
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(typeof data.rates).toBe('object');
    const conversion_rate = Object.entries(data.rates);
    const [pair, rate] = conversion_rate[0];
    expect(typeof pair).toBe('string');
    expect(typeof rate).toBe('number');
})

test ('add currency 200 OK', async ({ request }) => {
    const response = await request.post('http://127.0.0.1:8000/add_currency?currency=plao&rate=2');
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(typeof data).toBe('object');
    const currencies = data['All currencies'];
    expect(Array.isArray(currencies)).toBe(true);
    if (currencies.length > 0) {
        const [code, rate] = currencies[0];
        expect(typeof code).toBe('string');
        expect(typeof rate).toBe('number');
    }
})

test ('update currency 200 OK', async ({ request }) => {
    const response = await request.put('http://127.0.0.1:8000/update_currency?currency=PLAO&new_rate=3');
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty('message');
    expect(data).toHaveProperty('All currencies');
    expect(typeof data.message).toBe('string');
    expect(Array.isArray(data['All currencies'])).toBe(true);
    const currency = "PLAO"
    expect(data.message.toLowerCase()).toContain(currency.toLowerCase());
    expect(data.message.toLowerCase()).toContain('updated');
    for (const item of data['All currencies']) {
        expect(Array.isArray(item)).toBe(true);
        expect(item).toHaveLength(2);
        const [code, rate] = item;
        expect(typeof code).toBe('string');
        expect(typeof rate).toBe('number');
    }

})

test ('delete currency 200 OK', async ({ request }) => {
    const response = await request.delete('http://127.0.0.1:8000/delete_currency?currency=plao');
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(typeof data).toBe('object');
    expect(data).toHaveProperty('message');
    expect(data).toHaveProperty('All currencies');
    expect(typeof data.message).toBe('string');
    expect(Array.isArray(data["All currencies"])).toBe(true);
    const deletedCurrencies = "plao";
    expect(data.message.toLowerCase()).toContain(deletedCurrencies.toLowerCase());
    for (const item of data["All currencies"]) {
        expect(Array.isArray(item)).toBe(true);
        expect(item).toHaveLength(2);

        const [code, rate] = item;
        expect(typeof code).toBe('string');
        expect(typeof rate).toBe('number');
    }
})


