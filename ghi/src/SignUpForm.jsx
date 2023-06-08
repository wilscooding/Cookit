import { useState, useEffect } from "react";
import useToken from "@galvanize-inc/jwtdown-for-react";
import { useNavigate } from "react-router-dom";
import { Button, Label, Card } from "flowbite-react";
import { Link } from "react-router-dom";
import icons from "./constants/icons";

const SignupForm = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const { register } = useToken("");
	const navigate = useNavigate();
	const [isLoading, setLoading] = useState(true);

	let passwordsMatch = false;
	if (password === confirmPassword) {
		passwordsMatch = true;
	}
	const username = email;

	const handleSignup = async (event) => {
		event.preventDefault();
		const userData = {
			email: username,
			username: username,
			password: password,
		};

		register(
			userData,
			`${process.env.REACT_APP_SAMPLE_SERVICE_API_HOST}/api/users`
		);

		event.target.reset();
		navigate("/");
	};

	useEffect(() => {
		const onPageLoad = () => {
			setLoading(false);
		};

		if (document.readyState === "complete") {
			onPageLoad();
		} else {
			window.addEventListener("load", onPageLoad);
			return () => window.removeEventListener("load", onPageLoad);
		}
	}, []);

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
				<div className="flex w-full h-screen">
					<div className="w-full flex items-center justify-center lg:w-1/2">
						<Card className="bg-gray-50">
							<div className="flex max-w-md justify-center">
								<img className="w-24 h-24" src={icons.CookIt} />
							</div>
							<h1 className="text-2xl text-center font-bold">
								Create an Account
							</h1>
							<form
								className="flex max-w-md flex-col gap-4"
								onSubmit={(e) => handleSignup(e)}
							>
								<div>
									<div className="mb-2 block">
										<Label htmlFor="email2" value="Your email" />
									</div>
									<div className="relative">
										<div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
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
											required
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
								{passwordsMatch ? (
									<Button color="light" type="submit">
										Register new account
									</Button>
								) : (
									<Button color="light" type="submit" disabled>
										Passwords don't match!
									</Button>
								)}
								<div className="text-center">
									Already have an account?{" "}
									<Link
										className=" underline font-medium text-blue-600 dark:text-blue-500 hover:underline"
										to="/login"
									>
										Login
									</Link>
								</div>
							</form>
						</Card>
					</div>
					<div className="hidden relative lg:flex h-full w-1/2 items-center justify-center">
						<div className="w-full h-full bg-gradient-to-tr from-orange-400 to-yellow-300 overflow-hidden">
							<div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
								<div className="grid gap-4">
									<div>
										<img
											className="h-full max-w-full rounded-lg"
											src="https://images.pexels.com/photos/1410235/pexels-photo-1410235.jpeg"
											alt=""
										/>
									</div>
									<div>
										<img
											className="h-full max-w-full rounded-lg"
											src="https://images.pexels.com/photos/842571/pexels-photo-842571.jpeg"
											alt=""
										/>
									</div>
									<div>
										<img
											className="h-full max-w-full rounded-lg"
											src="https://images.pexels.com/photos/3184188/pexels-photo-3184188.jpeg"
											alt=""
										/>
									</div>
								</div>
								<div className="grid gap-4">
									<div>
										<img
											className="h-full max-w-full rounded-lg"
											src="https://images.pexels.com/photos/541216/pexels-photo-541216.jpeg"
											alt=""
										/>
									</div>
									<div>
										<img
											className="h-full max-w-full rounded-lg"
											src="https://images.pexels.com/photos/2641886/pexels-photo-2641886.jpeg"
											alt=""
										/>
									</div>
									<div>
										<img
											className="h-full max-w-full rounded-lg"
											src="https://images.pexels.com/photos/1633578/pexels-photo-1633578.jpeg"
											alt=""
										/>
									</div>
								</div>
								<div className="grid gap-4">
									<div>
										<img
											className="h-full max-w-full rounded-lg"
											src="https://images.pexels.com/photos/1211887/pexels-photo-1211887.jpeg"
											alt=""
										/>
									</div>
									<div>
										<img
											className="h-full max-w-full rounded-lg"
											src="https://images.pexels.com/photos/1633525/pexels-photo-1633525.jpeg"
											alt=""
										/>
									</div>
									<div>
										<img
											className="h-full max-w-full rounded-lg"
											src="https://images.pexels.com/photos/414262/pexels-photo-414262.jpeg"
											alt=""
										/>
									</div>
									<div>
										<img
											className="h-full max-w-full rounded-lg"
											src="https://images.pexels.com/photos/3434523/pexels-photo-3434523.jpeg"
											alt=""
										/>
									</div>
								</div>
								<div className="grid gap-4">
									<div>
										<img
											className="h-full max-w-full rounded-lg"
											src="https://images.pexels.com/photos/2454533/pexels-photo-2454533.jpeg"
											alt=""
										/>
									</div>
									<div>
										<img
											className="h-full max-w-full rounded-lg"
											src="https://images.pexels.com/photos/16958625/pexels-photo-16958625.jpeg"
											alt=""
										/>
									</div>
									<div>
										<img
											className="h-full max-w-full rounded-lg"
											src="https://images.pexels.com/photos/3659862/pexels-photo-3659862.jpeg"
											alt=""
										/>
									</div>
									<div>
										<img
											className="h-full max-w-full rounded-lg"
											src="https://images.pexels.com/photos/16890470/pexels-photo-16890470.jpeg"
											alt=""
										/>
									</div>
								</div>
								<div className="grid gap-4">
									<div>
										<img
											className="h-full max-w-full rounded-lg"
											src="https://images.pexels.com/photos/3434523/pexels-photo-3434523.jpeg"
											alt=""
										/>
									</div>
									<div>
										<img
											className="h-full max-w-full rounded-lg"
											src="https://images.pexels.com/photos/916925/pexels-photo-916925.jpeg"
											alt=""
										/>
									</div>
									<div>
										<img
											className="h-full max-w-full rounded-lg"
											src="https://images.pexels.com/photos/1251208/pexels-photo-1251208.jpeg"
											alt=""
										/>
									</div>
								</div>
								<div className="grid gap-4">
									<div>
										<img
											className="h-full max-w-full rounded-lg"
											src="https://images.pexels.com/photos/2015097/pexels-photo-2015097.jpeg"
											alt=""
										/>
									</div>
									<div>
										<img
											className="h-full max-w-full rounded-lg"
											src="https://images.pexels.com/photos/16890470/pexels-photo-16890470.jpeg"
											alt=""
										/>
									</div>
									<div className="grid gap-4">
										<div>
											<img
												className="h-full max-w-full rounded-lg"
												src="https://images.pexels.com/photos/1410235/pexels-photo-1410235.jpeg"
												alt=""
											/>
										</div>
										<div>
											<img
												className="h-full max-w-full rounded-lg"
												src="https://images.pexels.com/photos/842571/pexels-photo-842571.jpeg"
												alt=""
											/>
										</div>
										<div>
											<img
												className="h-full max-w-full rounded-lg"
												src="https://images.pexels.com/photos/3184188/pexels-photo-3184188.jpeg"
												alt=""
											/>
										</div>
									</div>
									<div className="grid gap-4">
										<div>
											<img
												className="h-full max-w-full rounded-lg"
												src="https://images.pexels.com/photos/1410235/pexels-photo-1410235.jpeg"
												alt=""
											/>
										</div>
										<div>
											<img
												className="h-full max-w-full rounded-lg"
												src="https://images.pexels.com/photos/842571/pexels-photo-842571.jpeg"
												alt=""
											/>
										</div>
										<div>
											<img
												className="h-full max-w-full rounded-lg"
												src="https://images.pexels.com/photos/3184188/pexels-photo-3184188.jpeg"
												alt=""
											/>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			)}
		</>
	);
};

export default SignupForm;
