import useToken from "@galvanize-inc/jwtdown-for-react";
// import { Navbar } from "flowbite-react";


const Nav = () => {
    const { logout } = useToken("");
    const { token } = useToken();

    const handleLogout = (event) => {
        event.preventDefault();
        logout();
    }

    if (token) {
        return (
            <>
                <div>
                    <form onSubmit={(e) => handleLogout(e)}>
                        <button>Logout</button>
                    </form>
                </div>
            </>
    )
    // } else {
    //     return (
    //         <Navbar fluid rounded>
    //             <Navbar.Brand href="https://flowbite-react.com">
    //                 <img
    //                 alt="Flowbite React Logo"
    //                 className="mr-3 h-6 sm:h-9"
    //                 src="/favicon.svg"
    //                 />
    //                 <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
    //                 Flowbite React
    //                 </span>
    //             </Navbar.Brand>
    //         <div className="flex md:order-2">
    //             <Dropdown
    //             inline
    //             label={<Avatar alt="User settings" img="https://flowbite.com/docs/images/people/profile-picture-5.jpg" rounded/>}
    //             >
    //             <Dropdown.Header>
    //                 <span className="block text-sm">
    //                 Bonnie Green
    //                 </span>
    //                 <span className="block truncate text-sm font-medium">
    //                 name@flowbite.com
    //                 </span>
    //             </Dropdown.Header>
    //             <Dropdown.Item>
    //                 Dashboard
    //             </Dropdown.Item>
    //             <Dropdown.Item>
    //                 Settings
    //             </Dropdown.Item>
    //             <Dropdown.Item>
    //                 Earnings
    //             </Dropdown.Item>
    //             <Dropdown.Divider />
    //             <Dropdown.Item>
    //                 Sign out
    //             </Dropdown.Item>
    //             </Dropdown>
    //             <Navbar.Toggle />
    //         </div>
    //         <Navbar.Collapse>
    //             <Navbar.Link
    //             active
    //             href="#"
    //             >
    //             <p>
    //                 Home
    //             </p>
    //             </Navbar.Link>
    //             <Navbar.Link href="#">
    //             About
    //             </Navbar.Link>
    //             <Navbar.Link href="#">
    //             Services
    //             </Navbar.Link>
    //             <Navbar.Link href="#">
    //             Pricing
    //             </Navbar.Link>
    //             <Navbar.Link href="#">
    //             Contact
    //             </Navbar.Link>
    //         </Navbar.Collapse>
    //         </Navbar>
    //     )
    }
}


export default Nav
