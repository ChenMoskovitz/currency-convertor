import {expect, Page, test} from '@playwright/test'
import {User} from "./userPage";


// SETUP (open page for every test)
test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
});

test ('show users', async ({page}) => {
    const user = new User(page);
    await user.clickShowUser()
    await expect(page.getByTestId("users-list")).toBeVisible();
})
test ('add user', async ({page}) => {
    const user = new User(page);
    await user.addUser("test", "user")
    await expect(page.getByTestId("new-user")).toBeVisible();
})
test ('show user', async ({page}) => {
    const user = new User(page);
    await user.showUser("1")
    await expect(page.getByTestId("user")).toBeVisible();
})