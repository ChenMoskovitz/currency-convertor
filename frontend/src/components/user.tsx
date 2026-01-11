import {getAllUsers, getUser, addUser} from "../api.ts";
import {useState} from "react";

export function User(){

    // get users by id
    const [user, setUser] = useState<any[]>([]);
    const [loadingUser, setLoadingUser] = useState(true);
    const [userId, setUserId] = useState("");
    // get all users
    const [users, setUsers] = useState<any[]>([]);
    const [loadingUsers, setLoadingUsers] = useState(true);
    // add user
    type addUserResponse = {
        Message: string;
        "User_id": number;
        "First_name": string;
        "Last_name": string;
    };
    const [loadingAddUser, setLoadingAddUser] = useState(true);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [newUser, setNewUser] = useState<addUserResponse | null>(null);

    // GET USER BY ID
    const handleFetchUser = async() => {
        try {
            setLoadingUser(true);
            const data = await getUser(userId);
            setUser(data);
        }
        catch (error) {
            console.error("Error while fetching user", error);
        }
        finally {
            setLoadingUser(false);
        }
    }
    // GET ALL USERS
    const handleFetchUsers = async() => {
        try {
            setLoadingUsers(true);
            const data = await getAllUsers();
            setUsers(data);
        }
        catch (error) {
            console.error("Error while fetching users", error);
        }
        finally {
            setLoadingUsers(false);
        }
    }
    // ADD USER
    const handleAddUser = async() => {
        try{
            setLoadingAddUser(true);
            const data = await addUser(
                encodeURIComponent(firstName),
                encodeURIComponent(lastName)
            );
            setNewUser(data);
        }
        catch (error) {
            console.error("Error while adding user", error);
        }
        finally {
            setLoadingAddUser(false);
        }
    }

    return(
        <div>
            <div className={"section"}>
                <p className={"title"}>Users</p>
                <div className={"sectionBody"}>
                    {/*get users*/}
                    <div className={"action"}>
                        <div className={"request"}>
                            <button className={"button"} onClick={handleFetchUsers}>
                                Show Users
                            </button>
                        </div>
                        <div className={"response"}>
                            { loadingUsers ? (
                                <p></p>
                            ): (
                                <ul data-testid = "users-list">
                                    {users.map(([userid, firstname, lastname]) =>((
                                            <li key={userid}>
                                                {userid} - {firstname} {lastname}
                                            </li>
                                        )
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                    {/*add user*/}
                    <div className={"action"}>
                        <div className={"request"}>
                            <button className={"button"} onClick={handleAddUser}>
                                Add User
                            </button>
                            <input  className={"input"}
                                    type={"text"}
                                    placeholder={"First Name"}
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                            />
                            <input  className={"input"}
                                    type={"text"}
                                    placeholder={"Last Name"}
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                            />
                        </div>
                        <div className={"response"}>
                            {loadingAddUser ? (
                                <p></p>
                            ) : (
                                newUser? (
                                    <div data-testid="new-user">
                                        <p>message: {newUser.Message}</p>
                                        <p>user id: {newUser.User_id}</p>
                                        <p>first name: {newUser.First_name}</p>
                                        <p>last name: {newUser.Last_name}</p>
                                    </div>
                                ) : (
                                    <p> Errorjghjghjhgjgh </p>
                                )
                            )}
                        </div>
                    </div>
                    {/*get user*/}
                    <div className={"action"}>
                        <div className={"request"}>
                            <button className={"button"} onClick={handleFetchUser} data-testid="show-user-button">
                                Show User
                            </button>
                            <input data-testid="show-user-id"
                                   className={"input"}
                                   type="number"
                                   placeholder="Enter user id"
                                   value={userId}
                                   onChange={(e) => setUserId(e.target.value)}
                            />
                        </div>
                        <div className={"response"}>
                            {loadingUser ? (
                                <p></p>
                            ) : user.id? (
                                <div data-testid="user">
                                    <p><strong>ID:</strong> {user.id}</p>
                                    <p><strong>First name:</strong> {user.first_name}</p>
                                    <p><strong>Last name:</strong> {user.last_name}</p>
                                </div>
                            ) : (
                                <p>There is no such user</p>) }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}