import { useState } from 'react';
import useToken from '@galvanize-inc/jwtdown-for-react';
import { useNavigate } from 'react-router-dom';
import { Button, Label } from 'flowbite-react';

const SignupForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const { register } = useToken("");
    const navigate = useNavigate();

    let passwordsMatch = false
    if (password === confirmPassword) {
      passwordsMatch = true
    }
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
				<div className="flex w-full h-screen">
					<div className="w-full flex items-center justify-center lg:w-1/2">
						<form
							className="flex max-w-md flex-col gap-4"
							onSubmit={(e) => handleSignup(e)}
						>
							<div>
								<div className="mb-2 block">
									<Label htmlFor="email2" value="Your email" />
								</div>
								<div class="relative">
									<div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
										<svg
											aria-hidden="true"
											className="w-5 h-5 text-gray-500 dark:text-gray-400"
											fill="currentColor"
											viewBox="0 0 20 20"
											xmlns="http://www.w3.org/2000/svg"
										>
											<path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
											<path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
										</svg>
									</div>
									<input
										type="email"
										id="email-address-icon"
										className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-orange-400 focus:border-orange-400 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-orange-400 dark:focus:border-orange-400"
										placeholder="name@email.com"
										onChange={(e) => {
											setEmail(e.target.value);
										}}
									/>
								</div>
							</div>
							<div>
								<div className="mb-2 block">
									<Label htmlFor="password2" value="Your password" />
								</div>
								<input
									type="password"
									id="password"
									className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-orange-400 focus:border-orange-400 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-orange-400 dark:focus:border-orange-400 dark:shadow-sm-light"
									onChange={(e) => {
										setPassword(e.target.value);
									}}
									required
								></input>
							</div>
							<div>
								<div className="mb-2 block">
									<Label htmlFor="repeat-password" value="Repeat password" />
								</div>
								<input
									type="password"
									id="password"
									className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-orange-400 focus:border-orange-400 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-orange-400 dark:focus:border-orange-400 dark:shadow-sm-light"
									onChange={(e) => {
										setConfirmPassword(e.target.value);
									}}
									required
								></input>
							</div>
              {passwordsMatch
                ? <Button color="light" type="submit">Register new account</Button>
                : <Button color="light" type="submit" disabled>Passwords don't match!</Button>
              }
						</form>
					</div>
					<div className="hidden relative lg:flex h-full w-1/2 items-center justify-center">
						<div className="w-full h-full bg-gradient-to-tr from-orange-400 to-yellow-300"></div>
					</div>
				</div>
			</>
		);
}

export default SignupForm
