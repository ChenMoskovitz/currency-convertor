import {Page} from "@playwright/test";

export class Wallet{
    constructor(private page: Page) {}

    async showWallet(userid: string){
        await this.page.getByTestId("wallet-user-id").fill(userid)
        await this.page.getByTestId("show-wallet-button").click();
    }
    async deposit(userid: string, currency: string, amount: number){
        await this.page.getByTestId("deposit-user-id").fill(userid)
        await this.page.getByTestId("deposit-currency").fill(currency)
        await this.page.getByTestId("deposit-amount").fill(String(amount))
        await this.page.getByTestId("deposit-button").click()
    }
    async withdrawal(userid: string, currency: string, amount: number){
        await this.page.getByTestId("withdrawal-user-id").fill(userid)
        await this.page.getByTestId("withdrawal-currency").fill(currency)
        await this.page.getByTestId("withdrawal-amount").fill(String(amount))
        await this.page.getByTestId("withdrawal-button").click()
    }
}
