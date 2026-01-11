
const API_URL = "http://127.0.0.1:8000";

//BANK//////////////////////////////////////////////////////////////////////////////////////////
//update currency
export async function updateCurrency(currency, new_rate) {
    const response = await fetch(`${API_URL}/update_currency?currency=${currency}&new_rate=${new_rate}`,
        {method: "PUT"});
    if (!response.ok) {
        throw new Error("Could not update currency");
    }
    return await response.json();
}

//delete currency
export async function deleteCurrency(currency){
    const response = await fetch(`${API_URL}/delete_currency?currency=${currency}`,
        {method: "DELETE"});
    if (!response.ok) {
        throw new Error("failed to delete currency " + currency);
    }
    return await response.json();
}
// get all currencies
export async function getAllCurrencies(){
    const response = await fetch(`${API_URL}/currencies`);
    if (!response.ok) {
        throw new Error("Failed to fetch currencies");
    }
    return await response.json();
}
// rates
export async function rates(main_currency){
    const response = await fetch(`${API_URL}/rates?main_currency=${main_currency}`)
    if (!response.ok) {
        throw new Error("Failed to fetch rates");
    }
    return await response.json();
}
//add currency
export async function addCurrency(currency, rate){
    const response = await fetch(`${API_URL}/add_currency?currency=${currency}&rate=${rate}`,
        { method: "POST"});
    if (!response.ok) {
        throw new Error("Failed to add currency");
    }
    return await response.json();
}
//convert
export async function convert(from_currency, to_currency, amount){
    const response = await fetch(`${API_URL}/convert?from_currency=${from_currency}&to_currency=${to_currency}&amount=${amount}`);
    if (!response.ok) {
        throw new Error("Failed to convert to currency to currency");
    }
    return await response.json();
}
//USERS//////////////////////////////////////////////////////////////////////////////////////////
// get all users
export async function getAllUsers() {
    const response = await fetch(`${API_URL}/get_all_users`);
    if (!response.ok) {
        throw new Error("Failed to fetch users");
    }
    return await response.json();
}
// get user
export async function getUser(user_id){
    const response = await fetch(`${API_URL}/get_user?user_id=${user_id}`);
    if (!response.ok) {
        throw new Error("Failed to fetch user");
    }
    return await response.json();
}
// add user
export async function addUser(first_name: string, last_name: string){
    const response = await fetch(
        `${API_URL}/add_user?first_name=${first_name}&last_name=${last_name}`,
        { method: "POST" }
    );
    if (!response.ok) {
        throw new Error("Failed to add user");
    }
    return await response.json();
}
//WALLET//////////////////////////////////////////////////////////////////////////////////////////
//get wallet
export async function getWallet(user_id){
    const response = await fetch(`${API_URL}/wallet?user_id=${user_id}`);
    if (!response.ok) {
        throw new Error("Failed to fetch wallet");
    }
    return await response.json();
}
//deposit
export async function deposit(user_id, currency, amount){
    const response = await fetch(`${API_URL}/deposit?user_id=${user_id}&currency=${currency}&amount=${amount}`,
        { method: "POST" }
    );
    if (!response.ok) {
        throw new Error("Failed to deposit");
    }
    return await response.json();
}
//withdrawal
export async function withdrawal(user_id, currency, amount){
    const response = await fetch(`${API_URL}/withdrawal?user_id=${user_id}&currency=${currency}&amount=${amount}`,
        {method: "POST",}
    );
    if (!response.ok) {
      throw new Error("Failed to withdrawal");
    }
    return await response.json();
}
//convert in wallet
export async function convertInWallet(user_id, from_currency, to_currency, amount){
    const response = await fetch(`${API_URL}/convert_in_wallet?user_id=${user_id}&from_currency=${from_currency}&to_currency=${to_currency}&amount=${amount}`,
        { method: "POST",});
    if (!response.ok) {
        throw new Error("Failed to convert in wallet");
    }
    return await response.json();
}
