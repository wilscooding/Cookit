import { useState, useEffect } from 'react';

const EditProfile = ({currentUser}) => {
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

    return (
        <div>Edit Form</div>
    )
}

export default EditProfile;
