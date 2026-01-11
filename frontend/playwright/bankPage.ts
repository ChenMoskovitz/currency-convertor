import {Page} from "@playwright/test";

export class Bank{
    constructor(private page: Page) {}

    async clickShowCurrencies(){
        await this.page
            .getByRole("button", { name: /show currencies/i })
            .click();
    }
    async showRates(mainCurrency){
        await this.page.getByPlaceholder("main currency").fill(mainCurrency)
        await this.page.getByRole("button", { name: /show rates/i }).click()
    }
    async clickAddCurrency(currency: string, rate: number){
        await this.page.getByTestId("add-currency-currency").fill(currency);
        await this.page.getByTestId("add-currency-rate").fill(String(rate));
        await this.page.getByTestId("addCurrencyButton").click()
    }
    async clickDeleteCurrency(currency: string){
        await this.page.getByTestId("delete-currency-currency").fill(currency);
        await this.page.getByTestId("delete-currencyc-button").click();
    }
    async clickUpdateCurrency(currency: string, rate: number){
        await this.page.getByTestId("update-currency-currency").fill(currency);
        await this.page.getByTestId("update-currency-rate").fill(String(rate));
        await this.page.getByTestId("update-currency-button").click();
    }
    async convertInBank(convertFromCurrency: string, convertToCurrency: string, convertInBankAmount: number){
        await this.page.getByTestId("convertInBankFrom").fill(convertFromCurrency);
        await this.page.getByTestId("convertInBankTo").fill(convertToCurrency);
        await this.page.getByTestId("convertInBankAmount").fill(String(convertInBankAmount));
        await this.page.getByTestId("convertInBankButton").click()
    }

}