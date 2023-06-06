import { useState, useEffect } from 'react';
import { Card } from "flowbite-react";


const Profile = ({currentUser}) => {
    const [userDetails, setUserDetails] = useState();

    const fetchUserDetails = async () => {
        if (currentUser !== null){
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

    return(
        <>
            <div className="flex w-full h-screen">
                <div className="flex w-full items-center justify-center">
                    <Card className="bg-gray-50">
                        <div className="flex flex-col items-center pb-5">
                            <h1 className="text-lg text-center font-normal">Profile</h1>
                            <img
                                alt="profile image"
                                className="mb-3 rounded-full shadow-lg my-5"
                                height="96"
                                src={userDetails ? userDetails.avatar : null}
                                width="96"
                            />
                            <h5 className="mb-1 text-xl font-medium my-4 text-gray-900 dark:text-white">
                                {userDetails ? userDetails.first : null} {userDetails ? userDetails.last : null}
                            </h5>
                            <h3 className="mb-1 text-md font-medium my-2 text-gray-500 dark:text-gray-400">
                                Email: {userDetails ? userDetails.email : null}
                            </h3>
                            <h3 className="mb-1 text-md font-medium my-2 text-gray-500 dark:text-gray-400">
                                Username: {userDetails ? userDetails.username : null}
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
        </>
    )
}

export default Profile;
