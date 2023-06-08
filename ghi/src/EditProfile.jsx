import { useState, useEffect } from 'react';
import { Card, Label, TextInput, Button } from "flowbite-react";
import axios from "axios";
import useToken from "@galvanize-inc/jwtdown-for-react";
import { useNavigate } from "react-router-dom";


const EditProfile = () => {
    const { fetchWithCookie } = useToken();
    const { token } = useToken();
    const [ currentUser, setUser] = useState();
    const [ userDetails, setUserDetails] = useState();
    const [isLoading, setLoading] = useState(true);
    const navigate = useNavigate();

    const handleFetchWithCookie = async() => {
        const data = await fetchWithCookie(
            `${process.env.REACT_APP_SAMPLE_SERVICE_API_HOST}/token`
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
            const userUrl = `${process.env.REACT_APP_SAMPLE_SERVICE_API_HOST}/api/users/${currentUser.id}`
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

    const handleSubmit = (event) => {
        event.preventDefault();
        try {
        axios.put(`${process.env.REACT_APP_SAMPLE_SERVICE_API_HOST}/api/users/${currentUser.id}`, userDetails)
        .then(res => {navigate('/profile')})
        } catch(error) {
            console.error(error)
        }
    }

    const handleFirst = (event) => {
        setUserDetails({...userDetails, first: event.target.value})
    }

    const handleLast = (event) => {
        setUserDetails({...userDetails, last: event.target.value})
    }

    const handleEmail = (event) => {
        setUserDetails({...userDetails, email: event.target.value})
    }

    const handleUsername = (event) => {
        setUserDetails({...userDetails, username: event.target.value})
    }

    const handleAvatar = (event) => {
        setUserDetails({...userDetails, avatar: event.target.value})
    }

    return (
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
            <div className="flex w-full">
                <div className="flex w-full items-center justify-center mt-10">
                    <Card className="p-4">
                        <div className="flex-col">
                            <div>
                                <div className="mb-6 block">
                                    <h1 className="text-4xl">Edit Profile</h1>
                                </div>
                                <form className="flex max-w-md flex-col gap-4" onSubmit={handleSubmit}>
                                    <div className="w-full items-center">
                                        {userDetails.avatar && (
                                            <img
                                                className="mt-5 m-auto rounded-full shadow-lg"
                                                alt="profile image"
                                                height="96"
                                                width="96"
                                                src={userDetails.avatar}>
                                            </img>
                                        )}
                                    </div>
                                    <div>
                                        <div className="mb-2 block">
                                            <Label htmlFor="username" value="Avatar"/>
                                        </div>
                                        <TextInput id="avatar" value={userDetails.avatar} onChange={handleAvatar} type="text"/>
                                    </div>
                                    <div>
                                        <div className="mb-2 block">
                                            <Label htmlFor="first" value="First Name"/>
                                        </div>
                                        <TextInput id="first" value={userDetails.first} onChange={handleFirst}  type="text"/>
                                    </div>
                                    <div>
                                        <div className="mb-2 block">
                                            <Label htmlFor="last" value="Last Name"/>
                                        </div>
                                        <TextInput id="last" value={userDetails.last} onChange={handleLast} type="text"/>
                                    </div>
                                    <div>
                                        <div className="mb-2 block">
                                            <Label htmlFor="email1" value="Your email"/>
                                        </div>
                                        <TextInput id="email1" value={userDetails.email} onChange={handleEmail} type="email"/>
                                    </div>
                                    <div>
                                        <div className="mb-2 block">
                                            <Label htmlFor="username" value="Username"/>
                                        </div>
                                        <TextInput id="username" value={userDetails.username} onChange={handleUsername} type="text"/>
                                    </div>
                                    {/* <div>
                                        <div className="mb-2 block">
                                            <Label htmlFor="password" value="Change Password"/>
                                        </div>
                                        <TextInput id="password1" type="password"/>
                                    </div>
                                    <div>
                                        <div className="mb-2 block">
                                            <Label htmlFor="password2" value="Re-enter New Password"/>
                                        </div>
                                        <TextInput id="password2" type="password"/>
                                    </div> */}
                                    <Button type="submit">
                                        Submit
                                    </Button>
                                </form>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
            )
        }
        </>
    );
};

export default EditProfile;
