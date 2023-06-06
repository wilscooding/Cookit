import { useState, useEffect } from 'react';
import { Card, Label, TextInput, Button } from "flowbite-react";
import axios from "axios";


const EditProfile = ({currentUser}) => {
    const [userDetails, setUserDetails] = useState();
    const [editUser, setEditUser] = useState({});

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

    return (
        <Card>
            <div className="flex w-full h-screen">
                <div className="flex w-full items-center justify-center">
                    <form className="flex flex-col gap-4">
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="first" value="First Name"/>
                            </div>
                            <TextInput id="first" placeholder={userDetails ? userDetails.first : null}  type="text"/>
                        </div>
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="last" value="Last Name"/>
                            </div>
                            <TextInput id="last" placeholder={userDetails ? userDetails.last : null} type="text"/>
                        </div>
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="email1" value="Your email"/>
                            </div>
                            <TextInput id="email1" placeholder={userDetails ? userDetails.email : null} type="email"/>
                        </div>
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="username" value="User Name"/>
                            </div>
                            <TextInput id="username" placeholder={userDetails ? userDetails.username : null} required type="text"/>
                        </div>
                        <div>
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
                        </div>
                            <Button type="submit">
                                Submit
                            </Button>
                    </form>
                </div>
            </div>
        </Card>
    )
}

export default EditProfile;
