import useToken from "@galvanize-inc/jwtdown-for-react";
import { Navbar, Dropdown, Avatar } from "flowbite-react";
import { useState, useEffect } from "react";
import icons from "./constants/icons";
import { useNavigate } from "react-router-dom";

const Nav = ({currentUser}) => {
  const { logout } = useToken("");
  const { fetchWithCookie } = useToken();
  const { token } = useToken();
  const [user, setUser] = useState();
  const [userDetails, setUserDetails] = useState();
  const navigate = useNavigate()

  const handleFetchWithCookie = async () => {
    const data = await fetchWithCookie(
      `${process.env.REACT_APP_SAMPLE_SERVICE_API_HOST}/token`
    );
    if (data !== undefined) {
      const user = data.user;
      setUser(user);
    }
  };

  useEffect(() => {
    handleFetchWithCookie();
  }, [token]);

  const fetchUserDetails = async () => {
    if (user !== undefined) {
      const userUrl = `${process.env.REACT_APP_SAMPLE_SERVICE_API_HOST}/api/users/${user.id}`;
      const userResponse = await fetch(userUrl);

      if (userResponse.ok) {
        const userDetails = await userResponse.json();

        setUserDetails({
          first: userDetails.first,
          last: userDetails.last,
          avatar: userDetails.avatar,
          email: userDetails.email,
          username: userDetails.username,
        });
      }
    }
  };

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
                    alt="CookIt Logo"
                    className="mr-2 h-8 sm:h-9"
                    src={icons.CookIt}
                    />
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
                    Settings
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onClick={handleLogout} href="/">
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
