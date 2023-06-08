import { useState, useEffect } from 'react';
import { Card } from "flowbite-react";
import useToken from "@galvanize-inc/jwtdown-for-react";
import { useNavigate } from "react-router-dom";



const Profile = () => {
    const { fetchWithCookie } = useToken();
    const { token } = useToken();
    const [ currentUser, setUser] = useState();
    const [ userDetails, setUserDetails] = useState();
    const [isLoading, setLoading] = useState(true);
    const navigate = useNavigate();


    const handleFetchWithCookie = async() => {
        const data = await fetchWithCookie(
            `${process.env.REACT_APP_COOKIT_API_HOST}/token`
        );
        if (data !== undefined){
            const currentUser = data.user
            setUser(currentUser);
        }
    }

    useEffect(() => {
            handleFetchWithCookie();
    }, [token]);

    const fetchUserDetails = async () => {
        if (currentUser !== undefined){
            const userUrl = `${process.env.REACT_APP_COOKIT_API_HOST}/api/users/${currentUser.id}`
            const userResponse = await fetch(userUrl);

            if (userResponse.ok){
                const userDetails = await userResponse.json();
                setLoading(false);

                setUserDetails(userDetails);
            }
        }
    }


    useEffect(() => {
            fetchUserDetails();
    }, [currentUser]);

    return(
        <>
            {isLoading ? (
				<div className="flex w-full h-screen">
					<div className="w-full flex items-center justify-center">
						<div role="status">
							<svg
								aria-hidden="true"
								className="inline w-24 h-24 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-orange-400 dark:fill-gray-300"
								viewBox="0 0 100 101"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
									fill="currentColor"
								/>
								<path
									d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
									fill="currentFill"
								/>
							</svg>
							<span className="sr-only">Loading...</span>
						</div>
					</div>
				</div>
			) : (
                <div className="flex w-full h-screen">
                <div className="flex w-full items-center justify-center">
                    <Card className="bg-gray-50">
                        <div className="flex flex-col items-center pb-5">
                            <h1 className="text-lg text-center font-normal">Profile</h1>
                            <img
                                alt="profile image"
                                className="mb-3 rounded-full shadow-lg my-5"
                                height="96"
                                src={userDetails.avatar}
                                width="96"
                            />
                            <h5 className="mb-1 text-xl font-medium my-4 text-gray-900 dark:text-white">
                                {userDetails.first} {userDetails.last}
                            </h5>
                            <h3 className="mb-1 text-md font-medium my-2 text-gray-500 dark:text-gray-400">
                                Email: {userDetails.email}
                            </h3>
                            <h3 className="mb-1 text-md font-medium my-2 text-gray-500 dark:text-gray-400">
                                Username: {userDetails.username}
                            </h3>
                            <a
                                className="
                                    inline-flex
                                    items-center
                                    rounded-lg
                                    bg-cyan-700
                                    px-4
                                    py-2
                                    text-center
                                    text-sm
                                    font-medium
                                    text-white
                                    hover:bg-cyan-800
                                    focus:outline-none
                                    focus:ring-4
                                    focus:ring-cyan-300
                                    dark:bg-cyan-600
                                    dark:hover:bg-cyan-700
                                    dark:focus:ring-cyan-800
                                    my-3"
                                href="/profile/edit"
                            >
                                <p>
                                Edit
                                </p>
                            </a>
                        </div>
                    </Card>
                </div>
            </div>
            )
            }

        </>
    )
}

export default Profile;
