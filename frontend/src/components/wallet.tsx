import {getWallet, convertInWallet, deposit, withdrawal} from "../api.ts";
import {useState} from "react";

export function Wallet() {

    // get wallet
    const [wallet, setWallet] = useState<any[]>([]);
    const [loadingWallet, setLoadingWallet] = useState(true);
    const [walletUserId, setWalletUserId] = useState("");
    // deposit
    type WalletRow = [number, number, string, number];
    type DepositResponse = {
        "user's wallet": WalletRow[];
    };
    const [loadingDeposit, setLoadingDeposit] = useState(true);
    const [depositUser, setDepositUser] = useState("");
    const [depositCurrency, setDepositCurrency] = useState("");
    const [depositAmount, setDepositAmount] = useState(0);
    const [depositResult, setDepositResult] = useState<DepositResponse | null>(null);
    // withdrawal
    type WithdrawalResponse = {
        "user's wallet": WalletRow[];
    };
    const [loadingWithdrawal, setLoadingWithdrawal] = useState(true);
    const [withdrawalUser, setWithdrawalUser] = useState("");
    const [withdrawalCurrency, setWithdrawalCurrency] = useState("");
    const [withdrawAmount, setWithdrawAmount] = useState(0);
    const [withdrawalResult, setWithdrawalResult] = useState<WithdrawalResponse | null>(null);
    // convert in wallet
    type ConvertInWalletResponse = {
        user_id: number;
        wallet: WalletRow[];
    };
    const [loadingConvertInWallet, setLoadingConvertInWallet] = useState(true);
    const [convertInWalletUserId, setConvertInWalletUserId] = useState("");
    const [convertInWalletFromCurrency, setConvertInWalletFromCurrency] = useState("");
    const [convertInWalletToCurrency, setConvertInWalletToCurrency] = useState("");
    const [convertInWalletAmount, setConvertInWalletAmount] = useState(0);
    const [concertInWalletResult, setConcertInWalletResult] = useState<ConvertInWalletResponse | null>(null);
    //CONVERT IN WALLET
    const handleFetchConvertInWallet = async () => {
        try{
            setLoadingConvertInWallet(true);
            const data = await convertInWallet(
                encodeURIComponent(convertInWalletUserId),
                encodeURIComponent(convertInWalletFromCurrency),
                encodeURIComponent(convertInWalletToCurrency),
                encodeURIComponent(convertInWalletAmount),
            );
            setConcertInWalletResult(data);
        }
        catch(error){
            console.error("Error fetching convert in wallet", error);
        }
        finally {
            setLoadingConvertInWallet(false);
        }
    }
    //WITHDRAWAL
    const handleFetchWithdrawal = async () => {
        try{
            setLoadingWithdrawal(true);
            const data = await withdrawal(
                encodeURIComponent(withdrawalUser),
                encodeURIComponent(withdrawalCurrency),
                encodeURIComponent(withdrawAmount),
            );
            setWithdrawalResult(data)
        }
        catch(error){
            console.error("Error fetching withdrawal", error);
        }
        finally {
            setLoadingWithdrawal(false);
        }
    }
    // DEPOSIT
    const handleFetchDeposit = async () => {
        try{
            setLoadingDeposit(true);
            const data = await deposit(
                encodeURIComponent(depositUser),
                encodeURIComponent(depositCurrency),
                encodeURIComponent(depositAmount)
            );
            setDepositResult(data);
        }
        catch (error) {
            console.error("Error while deposit", error);
        }
        finally {
            setLoadingDeposit(false);
        }
    }
    // GET A USER WALLET:
    const handleFetchWallet = async() => {
        try{
            setLoadingWallet(true);
            const data = await getWallet(walletUserId);
            setWallet(data.wallet);
        }
        catch (error) {
            console.error("Error while fetching wallets", error);
        }
        finally {
            setLoadingWallet(false);
        }
    }


    return(
        <div>
            <div className={"section"}>
                <p className={"title"}>Wallet</p>
                <div className={"sectionBody"}>
                    {/*get wallet*/}
                    <div className={"action"}>
                        <div className={"request"}>
                            <button className={"button"} onClick={handleFetchWallet} data-testid="show-wallet-button">
                                Show Wallet
                            </button>
                            <input data-testid = "wallet-user-id"
                                   className={"input"}
                                   type="number"
                                   placeholder="Enter user id"
                                   value={walletUserId}
                                   onChange={(e) => setWalletUserId(e.target.value)}
                            />
                        </div>
                        <div className={"response"}>
                            { loadingWallet ? (
                                <p></p>
                            ): (
                                <ul data-testid="user's wallet">
                                    {wallet.map((item) =>(
                                        <li key={item.currency}>
                                            {item.currency} - {item.amount}
                                        </li>
                                    ) )}
                                </ul>
                            )}
                        </div>
                    </div>
                    {/*deposit*/}
                    <div className={"action"}>
                        <div className={"request"}>
                            <button className={"button"} onClick={handleFetchDeposit} data-testid="deposit-button">
                                Deposit
                            </button>
                            <input data-testid= "deposit-user-id"
                                   className={"input"}
                                   type="number"
                                   placeholder="Enter user id"
                                   value={depositUser}
                                   onChange={(e) => setDepositUser(e.target.value)}
                            />
                            <input data-testid= "deposit-currency"
                                   className={"input"}
                                   type="text"
                                   placeholder="Enter currency"
                                   value={depositCurrency}
                                   onChange={(e) => setDepositCurrency(e.target.value)}
                            />
                            <input data-testid= "deposit-amount"
                                   className={"input"}
                                   type="number"
                                   placeholder="Enter amount"
                                   value={depositAmount}
                                   onChange={(e) => setDepositAmount(e.target.value)}
                            />
                        </div>
                        <div className={"response"}>
                            { loadingDeposit ? (
                                <p></p>
                            ) : (
                                depositResult? (
                                    <>
                                        <p>{depositUser}</p>

                                        <ul data-testid="deposit-results">
                                            {depositResult["user's wallet"].map(
                                                ([walletId, userId, currency, amount]) => (
                                                    <li key={walletId}>
                                                        {currency}: {amount}
                                                    </li>
                                                )
                                            )}
                                        </ul>
                                    </>

                                ) : (
                                    <p>Deposit Error</p>
                                )
                            )
                            }

                        </div>
                    </div>
                    {/*withdrawal*/}
                    <div className={"action"}>
                        <div className={"request"}>
                            <button className={"button"} onClick={handleFetchWithdrawal} data-testid="withdrawal-button">
                                Withdrawal
                            </button>
                            <input data-testid="withdrawal-user-id"
                                   className={"input"}
                                   type="number"
                                   placeholder="Enter user id"
                                   value={withdrawalUser}
                                   onChange={(e) => setWithdrawalUser(e.target.value)}
                            />
                            <input data-testid="withdrawal-currency"
                                   className={"input"}
                                   type="text"
                                   placeholder="Enter currency"
                                   value={withdrawalCurrency}
                                   onChange={(e) => setWithdrawalCurrency(e.target.value)}
                            />
                            <input data-testid="withdrawal-amount"
                                   className={"input"}
                                   type="number"
                                   placeholder="Enter amount"
                                   value={withdrawAmount}
                                   onChange={(e) => setWithdrawAmount(e.target.value)}
                            />
                        </div>
                        <div className={"response"}>
                            { loadingWithdrawal ? (
                                <p></p>
                            ) : (
                                withdrawalResult? (
                                    <>
                                        <p>{withdrawalUser}</p>
                                        <ul data-testid="withdrawal-results">
                                            {withdrawalResult["user's wallet"].map(
                                                ([walletId, userId, currency, amount]) => (
                                                    <li key={walletId}>
                                                        {currency}: {amount}
                                                    </li>
                                                )
                                            )}
                                        </ul>
                                    </>

                                ) : (
                                    <p>Deposit Error</p>
                                )
                            )
                            }

                        </div>
                    </div>
                    {/*convert in wallet*/}
                    <div className={"action"}>
                        <div className={"request"}>
                            <button className={"button"} onClick={handleFetchConvertInWallet}>
                                convert in wallet
                            </button>
                            <input className={"input"}
                                   type="number"
                                   placeholder="Enter user id"
                                   value={convertInWalletUserId}
                                   onChange={(e) => setConvertInWalletUserId(e.target.value)}
                            />
                            <input className={"input"}
                                   type="text"
                                   placeholder="Enter from currency"
                                   value={convertInWalletFromCurrency}
                                   onChange={(e) => setConvertInWalletFromCurrency(e.target.value)}
                            />
                            <input className={"input"}
                                   type={"text"}
                                   placeholder="Enter to currency"
                                   value={convertInWalletToCurrency}
                                   onChange={(e) => setConvertInWalletToCurrency(e.target.value)}
                            />
                            <input className={"input"}
                                   type="number"
                                   placeholder="Enter amount"
                                   value={convertInWalletAmount}
                                   onChange={(e) => setConvertInWalletAmount(e.target.value)}
                            />
                        </div>
                        <div className={"response"}>
                            { loadingConvertInWallet ? (
                                <p></p>
                            ):( concertInWalletResult? (
                                    <>
                                        <p>{convertInWalletUserId}</p>
                                        <ul>
                                            {concertInWalletResult["wallet"].map(
                                                ([walletId, userId, currency, amount]) => (
                                                    <li key={walletId}>
                                                        {currency}: {amount}
                                                    </li>
                                                )
                                            )}
                                        </ul>
                                    </>
                                ):(
                                    <p>Convert in wallet error</p>
                                )
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}