import { useState } from 'react';
import useToken from '@galvanize-inc/jwtdown-for-react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'flowbite-react';
import { gray } from 'tailwindcss/colors';

const SignupForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { register } = useToken("");
    const navigate = useNavigate();

    const username = email

    const handleSignup = (event) => {
        event.preventDefault();
        const userData = {
            email: username,
            username:username,
            password: password,
        };

        register(
            userData,
            `${process.env.REACT_APP_SAMPLE_SERVICE_API_HOST}/api/users`
        );


        event.target.reset();
        navigate("/");

    };


    return (
			<>
				<div>
					<h5 className="card-header">Signup</h5>
					<h1 className="text-3xl font-bold underline">Hello World</h1>
					<div className="card-body">
						<form onSubmit={(e) => handleSignup(e)}>
							<div className="mb-3">
								<label className="form-label">email</label>
								<input
									name="email"
									type="text"
									className="form-control"
									onChange={(e) => {
										setEmail(e.target.value);
									}}
								/>
							</div>
							<div className="mb-3">
								<label className="form-label">password</label>
								<input
									name="password"
									type="password"
									className="form-control"
									onChange={(e) => {
										setPassword(e.target.value);
									}}
								/>
							</div>
							<div>
								<input
									className="btn btn-primary"
									type="submit"
									value="Register"
								/>
							</div>
						</form>
					</div>
				</div>
			</>
		);
}

export default SignupForm
