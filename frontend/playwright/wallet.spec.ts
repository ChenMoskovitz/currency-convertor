import {expect, Page, test} from '@playwright/test'
import {Wallet} from "./walletPage";


// SETUP (open page for every test)
test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
});

test ('show wallet', async ({page}) => {
    const wallet = new Wallet(page);
    await wallet.showWallet("1")
    await expect(page.getByTestId("user's wallet")).toBeVisible();
})
test ('deposit', async ({page}) => {
    const wallet = new Wallet(page);
    await wallet.deposit("1", "TST", 100)
    await expect(page.getByTestId("deposit-results")).toBeVisible();
})
test ('withdrawal', async ({page}) => {
    const wallet = new Wallet(page);
    await wallet.withdrawal("1", "TST", 100)
    await expect(page.getByTestId("withdrawal-results")).toBeVisible();
})