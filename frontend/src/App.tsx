import { User } from "./components/user";
import {Bank} from "./components/bank.tsx";
import {Wallet} from "./components/wallet.tsx";
// import { useState } from "react";
import "./App.css";

function App() {

    return (
        <div className={"page"}>
            {/* USERS */}
            <User/>
            {/* WALLET */}
            <Wallet/>
            {/* BANK */}
            <Bank/>
        </div>
    );
}
export default App;