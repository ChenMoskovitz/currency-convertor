import {Page} from "@playwright/test";

export class User{
    constructor(private page: Page) {}

    async clickShowUser(){
        await this.page
            .getByRole("button", { name: /show users/i }).click();
    }
    async addUser(firstName: string, lastName: string){
        await this.page.getByPlaceholder(/first name/i).fill(firstName);
        await this.page.getByPlaceholder(/last name/i).fill(lastName);
        await this.page.getByRole("button", { name: /add user/i }).click();
    }
    async showUser(userid: string){
        await this.page.getByTestId("show-user-id").fill(userid)
        await this.page.getByTestId("show-user-button").click();
    }
}
