import useToken from "@galvanize-inc/jwtdown-for-react";
import { Navbar, Dropdown, Avatar } from "flowbite-react";
import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";


const Nav = () => {
    const { fetchWithCookie } = useToken();
    const { token } = useToken();
    const [ currentUser, setUser] = useState();
    const [ userDetails, setUserDetails] = useState();
    const navigate = useNavigate();
    const { logout } = useToken();

    const handleFetchWithCookie = async() => {
        const data = await fetchWithCookie(
            `${process.env.REACT_APP_SAMPLE_SERVICE_API_HOST}/token`
        );
        if (data !== undefined){
            const currentUser = data.user
            setUser(currentUser);
        }
    }

    useEffect (() => {
        handleFetchWithCookie();
    }, [token]);

    const fetchUserDetails = async () => {
        if (currentUser !== undefined){
            const userUrl = `${process.env.REACT_APP_SAMPLE_SERVICE_API_HOST}/api/users/${currentUser.id}`
            const userResponse = await fetch(userUrl);

            if (userResponse.ok){
                const userDetails = await userResponse.json();

                setUserDetails(
                    {
                        "first": userDetails.first,
                        "last": userDetails.last,
                        "avatar": userDetails.avatar,
                        "email": userDetails.email,
                        "username": userDetails.username,
                }
                );
            }
        }
    }

    useEffect(() => {
        fetchUserDetails();
    }, [currentUser])

    const handleLogout = (event) => {
        logout();
        navigate("/");
    }

    if (token) {
        return (
            <Navbar fluid rounded>
                <Navbar.Brand href="https://flowbite-react.com">
                    <img
                    alt="Flowbite React Logo"
                    className="mr-3 h-6 sm:h-9"
                    src="https://www.flowbite-react.com/favicon.svg"
                    />
                    <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
                    CookIt
                    </span>
                </Navbar.Brand>
            <div className="flex md:order-2">
                <Dropdown
                inline
                label={<Avatar alt="User settings" img={userDetails ? userDetails.avatar : null} rounded/>}
                >
                <Dropdown.Header>
                    <span className="block text-sm">
                    {userDetails ? userDetails.first : null} {userDetails ? userDetails.last : null}
                    </span>
                    <span className="block truncate text-sm font-medium">
                    {userDetails ? userDetails.email : null}
                    </span>
                </Dropdown.Header>
                <Dropdown.Item>
                    <Link to="/profile">Settings</Link>
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onClick={handleLogout}>
                    Sign out
                </Dropdown.Item>
                </Dropdown>
                <Navbar.Toggle />
            </div>
            <Navbar.Collapse>
                <Navbar.Link active href="/">
                    Home
                </Navbar.Link>
                <Navbar.Link href="/myrecipes">
                    My Recipes
                </Navbar.Link>
                <Navbar.Link href="/myingredients">
                    Inventory
                </Navbar.Link>
                <Navbar.Link href="/grocerylist">
                    Grocery List
                </Navbar.Link>
                <Navbar.Link href="#">
                    Suggest Recipes
                </Navbar.Link>
            </Navbar.Collapse>
            </Navbar>
    )
    } else {
        return (
            <div></div>
        )
    }
}


export default Nav
