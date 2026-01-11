import {addCurrency, convert, deleteCurrency, getAllCurrencies, rates, updateCurrency} from "../api.ts";
import {useState} from "react";

export function Bank(){
    //update currency
    const [loadingUpdateCurrencies, setLoadingUpdateCurrencies] = useState<boolean>(true)
    const [currencyToUpdate, setCurrencyToUpdate] = useState("");
    const [updatedRate, setUpdateRate] = useState(0)
    const [updateCurrencyResults, setUpdateCurrencyResults] = useState<any[]>([]);
    //delete currency
    const [loadingDeleteCurrency, setLoadingDeleteCurrency] = useState<boolean>(true);
    const [currencyToDelete, setCurrencyToDelete] = useState("");
    const [deleteCurrencyResult, setDeleteCurrencyResult] = useState<any[]>([]);
    // get all currencies
    const [currencies, setCurrencies] = useState<any[]>([]);
    const [loadingCurrencies, setLoadingCurrencies] = useState(true);
    //add currency
    const [loadingAddCurrency, setLoadingAddCurrency] = useState(true);
    const [addCurrencyCode, setAddCurrencyCode] = useState("");
    const [addCurrencyRate, setAddCurrencyRate] = useState(0);
    const [AddCurrencyResult, setAddCurrencyResult] = useState<any[]>([]);
    // convert
    type ConvertResponse = {
        "from currency": string;
        "to currency": string;
        amount: number;
        converted_amount: number;
    };
    const [convertResult, setConvertResult] = useState< ConvertResponse | null>(null);
    const [loadingConvert, setLoadingConvert] = useState(true);
    const [fromCurrency, setFromCurrency] = useState("");
    const [toCurrency, setToCurrency] = useState("");
    const [amount, setAmount] = useState(0);
    // rates
    type RatesResponse = {
        rates: Record<string, number>;
    };
    const [ratesResult, setRatesResult] = useState< RatesResponse | null>(null);
    const [loadingRates, setLoadingRates] = useState(true);
    const [mainCurrency, setMainCurrency] = useState("");

    // UPDATE CURRENCY
    const handleFetchUpdateCurrencies = async () => {
        try{
            setLoadingUpdateCurrencies(true);
            const data = await updateCurrency(
                encodeURIComponent(currencyToUpdate),
                encodeURIComponent(updatedRate)
            );
            setUpdateCurrencyResults(data);
        }
        catch(error){
            console.error("error while fetching update currency: ", error);
        }
        finally {
            setLoadingUpdateCurrencies(false);
        }
    }
    // GET ALL CURRENCIES
    const handleFetchCurrencies = async() => {
        try{
            setLoadingCurrencies(true);
            const data = await getAllCurrencies();
            setCurrencies(data.currencies);
        }
        catch (error) {
            console.error("Error while fetching currency");
        }
        finally {
            setLoadingCurrencies(false);
        }

    }
    // RATES
    const handleFetchRates = async() => {
        try{
            setLoadingRates(true);
            const data = await rates(mainCurrency);
            setRatesResult(data);
        }
        catch (error) {
            console.error("Error while fetching rates", error);
        }
        finally {
            setLoadingRates(false);
        }
    }
    //ADD CURRENCY
    const handleFetchAddCurrency = async () => {
        try{
            setLoadingAddCurrency(true);
            const data = await addCurrency(
                encodeURIComponent(addCurrencyCode),
                encodeURIComponent(addCurrencyRate),
            )
            setAddCurrencyResult(data)
            setLoadingAddCurrency(false);
        }
        catch(error){
            console.error("Error while fetching add currency", error)
        }
        finally {
            setLoadingAddCurrency(false);
        }
    }
    // CONVERT
    const handleFetchConvert = async() => {
        try{
            setLoadingConvert(true);
            const data = await convert(fromCurrency, toCurrency, amount);
            setConvertResult(data);
        }
        catch (error) {
            console.error("Error while fetching convert ", error);
        }
        finally {
            setLoadingConvert(false);
        }
    }
    //DELETE CURRENCY
    const handleFetchDeleteCurrency = async () => {
        try{
            setLoadingDeleteCurrency(true);
            const data = await deleteCurrency(
                encodeURIComponent(currencyToDelete),
            )
            setDeleteCurrencyResult(data)
        }
        catch(error){
            console.error("Error while fetching delete currency", error);
        }
        finally {
            setLoadingDeleteCurrency(false);
        }
    }

    return(
        <div>

            <div className={"section"}>
                <p className={"title"}>Bank</p>
                <div className={"sectionBody"}>
                    {/*Get currencies*/}
                    <div className={"action"}>
                        <div className={"request"}>
                            <button className={"button"} onClick={handleFetchCurrencies}>
                                Show Currencies
                            </button>
                        </div>
                        <div className={"response"}>
                            { loadingCurrencies ? (
                                <p></p>
                            ): (
                                <ul data-testid="currency-list">
                                    {currencies.map(([code, rate]) =>((
                                            <li key={code}>
                                                {code} - {rate}
                                            </li>
                                        )
                                    ))}
                                </ul>

                            )}
                        </div>
                    </div>
                    {/*Convert*/}
                    <div className={"action"}>
                        <div className={"request"}>
                            <button className={"button"} onClick={handleFetchConvert} data-testid="convertInBankButton">
                                Convert
                            </button>
                            <input data-testId = "convertInBankFrom"
                                   className={"input"}
                                   type="string"
                                   placeholder="Enter from currency"
                                   value={fromCurrency}
                                   onChange={(e) => setFromCurrency(e.target.value)}
                            />
                            <input data-testId = "convertInBankTo"
                                   className={"input"}
                                   type="string"
                                   placeholder="Enter to currency"
                                   value={toCurrency}
                                   onChange={(e) => setToCurrency(e.target.value)}
                            />
                            <input data-testId = "convertInBankAmount"
                                   className={"input"}
                                   type="string"
                                   placeholder="Enter amount"
                                   value={amount}
                                   onChange={(e) => setAmount(e.target.value)}
                            />
                        </div>
                        <div className={"response"}>
                            { loadingConvert ? (
                                <p></p>
                            ) : convertResult ?(
                                <div data-testid="convert-in-bank-result">
                                    <p>from currency: {convertResult["from currency"]}</p>
                                    <p>to currency: {convertResult["to currency"]}</p>
                                    <p>amount to convert: {convertResult.amount}</p>
                                    <p>converted amount: {convertResult.converted_amount}</p>
                                </div>
                            ) : (
                                <p>Error</p>
                            )}
                        </div>
                    </div>
                    {/*Rates*/}
                    <div className={"action"}>
                        <div className={"request"}>
                            <button className={"button"} onClick={handleFetchRates}>
                                Show Rates
                            </button>
                            <input className={"input"}
                                   type="string"
                                   placeholder="main currency"
                                   value={mainCurrency}
                                   onChange={(e) => setMainCurrency(e.target.value)}
                            />
                        </div>
                        <div className={"response"}>
                            {loadingRates ? (
                                <p></p>
                            ) : ratesResult ? (
                                <div data-testid="show-rates-result">
                                    {Object.entries(ratesResult.rates).map(([pair, rate]) => (
                                        <p key={pair}>
                                            {pair}: {rate}
                                        </p>
                                    ))
                                    }
                                </div>
                            ) : (
                                <p>Error</p>
                            )}
                        </div>

                    </div>
                    {/*add currency*/}
                    <div className={"action"}>
                        <div className={"request"}>
                            <button className={"button"} onClick={handleFetchAddCurrency} data-testid="addCurrencyButton">
                                add currency
                            </button>
                            <input data-testid = "add-currency-currency"
                                   className={"input"}
                                   type={"text"}
                                   placeholder="Enter currency code"
                                   value={addCurrencyCode}
                                   onChange={(e) => setAddCurrencyCode(e.target.value)}
                            />
                            <input data-testid = "add-currency-rate"
                                   className={"input"}
                                   type="number"
                                   placeholder="Enter currency rate"
                                   value={addCurrencyRate}
                                   onChange={(e) => setAddCurrencyRate(e.target.value)}
                            />
                        </div>
                        <div className={"response"}>
                            { loadingAddCurrency ? (
                                <p></p>
                            ): (
                                <ul data-testid="add-currency-result">
                                    {(AddCurrencyResult?.["All currencies"] ?? []).map(([code, rate]) => (
                                        <li key={code}>
                                            {code} - {rate}
                                        </li>
                                    ))}
                                </ul>
                            )}

                        </div>
                    </div>
                    {/*delete currency*/}
                    <div className={"action"}>
                        <div className={"request"}>
                            <button className={"button"} onClick={handleFetchDeleteCurrency} data-testid="delete-currencyc-button">
                                delete currency
                            </button>
                            <input data-testid="delete-currency-currency"
                                   className={"input"}
                                   type="text"
                                   placeholder="Enter currency to delete"
                                   value={currencyToDelete}
                                   onChange={(e) => setCurrencyToDelete(e.target.value)}
                            />
                        </div>
                        <div className={"response"}>
                            {loadingDeleteCurrency ? (
                                <p></p>
                            ) : (
                                deleteCurrencyResult ? (
                                    <ul data-testid="delete-currency-result">
                                        {deleteCurrencyResult?.["All currencies"]?.map(([code, rate]) => (
                                            <li key={code}>
                                                {code} - {rate}
                                            </li>
                                        ))}
                                    </ul>
                                ) :(
                                    <p>Error</p>
                                )
                            )}
                        </div>
                    </div>
                    {/*update currency*/}
                    <div className={"action"}>
                        <div className={"request"}>
                            <button className={"button"} onClick={handleFetchUpdateCurrencies} data-testid="update-currency-button">
                                update currencies
                            </button>
                            <input data-testid="update-currency-currency"
                                   className={"input"}
                                   type="text"
                                   placeholder="Enter currency to update"
                                   value={currencyToUpdate}
                                   onChange={(e) => setCurrencyToUpdate(e.target.value)}/>
                            <input data-testid="update-currency-rate"
                                   className={"input"}
                                   type="number"
                                   placeholder="Enter currency rate"
                                   value={updatedRate}
                                   onChange={(e) => setUpdateRate(Number(e.target.value))}/>
                        </div>
                        <div className="response">
                            {loadingUpdateCurrencies? (
                                <p></p>
                            ) : ( updateCurrencyResults? (
                                    <ul data-testid="update-currency-result">
                                        {(updateCurrencyResults?.["All currencies"] ?? []).map(([code, rate]) => (
                                            <li key={code}>{code} - {rate}</li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p>Error</p>
                                )

                            )}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}