import useToken from "@galvanize-inc/jwtdown-for-react";
import { Navbar, Dropdown, Avatar } from "flowbite-react";
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
// import { Link } from "react-router-dom";
import icons from "./constants/icons";

const Nav = () => {
	const { fetchWithCookie } = useToken();
	const { token } = useToken();
	const [currentUser, setUser] = React.useState();
	const [userDetails, setUserDetails] = React.useState();
	const navigate = useNavigate();
	const { logout } = useToken();

    useEffect(() => {
        const handleFetchWithCookie = async() => {
        const data = await fetchWithCookie(
            `${process.env.REACT_APP_COOKIT_API_HOST}/token`
        );
        if (data !== undefined){
            const currentUser = data.user
            setUser(currentUser);
        } else {
            navigate("/signup")
        }
    }
        handleFetchWithCookie();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);

	useEffect(() => {
		const fetchUserDetails = async () => {
			if (currentUser !== undefined) {
				const userUrl = `${process.env.REACT_APP_COOKIT_API_HOST}/api/users/${currentUser.id}`;
				const userResponse = await fetch(userUrl);

				if (userResponse.ok) {
					const userDetails = await userResponse.json();

					setUserDetails(userDetails);
				}
			}
		};
		fetchUserDetails();
	}, [currentUser]);

	const handleLogout = (event) => {
		logout();
		navigate("/login");
	};
	return (
		<>
			<Navbar fluid rounded>
				<Navbar.Brand href="https://flowbite-react.com">
					<img
						alt="A stylized CI with an icon of a knife and fork"
						className="mr-3 h-6 sm:h-9"
						src={icons.CookIt}
					/>
					<span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
						CookIt
					</span>
				</Navbar.Brand>
				<div className="flex md:order-2">
					{token ? (
						// If user is logged in, display user avatar and dropdown
						<Dropdown
							inline
							label={
								<Avatar
									alt="User settings"
									img={
										userDetails ? userDetails.avatar : null
									}
									rounded
								/>
							}
						>
							<Dropdown.Header>
								<span className="block text-sm">
									{userDetails ? userDetails.first : null}{" "}
									{userDetails ? userDetails.last : null}
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
					) : (
						// If user is not logged in, display login and signup links
						<>
							<Navbar.Link
								href="/login"
								className="rounded-lg bg-green-400 px-3 py-2 text-white font-semibold mx-2"
							>
								Login
							</Navbar.Link>
							<Navbar.Link
								href="/signup"
								className="rounded-lg bg-green-400 px-3 py-2 text-white font-semibold mx-2"
							>
								Signup
							</Navbar.Link>
						</>
					)}
					<Navbar.Toggle />
				</div>
				{token && (
					// Only show the Navbar.Collapse if the user is logged in
					<Navbar.Collapse>
						<Navbar.Link active href="/">
							Home
						</Navbar.Link>
						<Navbar.Link href="/myrecipes">My Recipes</Navbar.Link>
						<Navbar.Link href="/myingredients">
							Inventory
						</Navbar.Link>
						<Navbar.Link href="/grocerylist">
							Grocery List
						</Navbar.Link>
						<Navbar.Link href="#">Suggest Recipes</Navbar.Link>
					</Navbar.Collapse>
				)}
			</Navbar>
		</>
	);
};

export default Nav;
