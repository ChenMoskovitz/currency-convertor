import {expect, Page, test} from '@playwright/test'
import {Bank} from "./bankPage";

// SETUP (open page for every test)
test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
});

test ('show currencies', async ({page}) => {
    const bank = new Bank(page);
    await bank.clickShowCurrencies()
    await expect(page.getByTestId("currency-list")).toBeVisible();
    await page.waitForTimeout(3000);
})
test ('show rates', async ({page}) => {
    const bank = new Bank(page);
    await bank.showRates("TST")
    await expect(page.getByTestId("show-rates-result")).toBeVisible();
})
test ('add currency', async ({page}) => {
    const bank = new Bank(page);
    await bank.clickAddCurrency("play", 5)
    await expect(page.getByTestId("add-currency-result")).toBeVisible();
})
test ('delete currency', async ({page}) => {
    const bank = new Bank(page);
    await bank.clickDeleteCurrency("play")
    await expect(page.getByTestId("delete-currency-result")).toBeVisible();
})
test ('update currency', async ({page}) => {
    const bank = new Bank(page);
    await bank.clickUpdateCurrency("TST", 4)
    await expect(page.getByTestId("update-currency-result")).toBeVisible();
})
test ('convert in bank', async ({page}) => {
    const bank = new Bank(page);
    await bank.convertInBank("TST", "TST", 100)
    await expect(page.getByTestId("convert-in-bank-result")).toBeVisible();
})