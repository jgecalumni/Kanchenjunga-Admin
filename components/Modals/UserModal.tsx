"use client";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Formik, Form, ErrorMessage } from "formik";
import { Eye, EyeOffIcon, Loader2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
	useLoginMutation,
	useUpdateProfileMutation,
} from "../../store/baseApi";
import { toast } from "sonner";
import * as Yup from "yup";
import { useAuth } from "@/store/AuthContext";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../ui/select";

interface UserData {
	id: number;
	name: string;
	email: string;
	phone: string;
	role: "ADMIN" | "STUDENT" | "ALUMNI";
	bookings: any[];
	listings: any[];
	reviews: any[];
	createdAt: string;
}

interface IProps {
	open: boolean;
	data: UserData | null;
	closed: () => void;
}

export const UserModal: React.FC<IProps> = ({ open, data, closed }) => {
	const [showPass, setShowPass] = useState<boolean>(false);
	const [isSignUp, setIsSignUp] = useState<boolean>(false);
	const [showPassValid, setShowPassValid] = useState<boolean>(false);
	const [isForget, setIsForget] = useState<boolean>(false);
	const [emailVerified, setEmailVerified] = useState<boolean>(false);
	const [otpVerified, setOtpVerified] = useState<boolean>(false);

	const isEditMode = !!data;

	// Validation schema based on mode (forgot password or signup/edit)
	const currentSchema = useMemo(() => {
		if (isForget) {
			if (!emailVerified) {
				return Yup.object().shape({
					email: Yup.string()
						.email("Invalid email address")
						.required("Email is required"),
				});
			} else if (!otpVerified) {
				return Yup.object().shape({
					otp: Yup.string()
						.length(6, "OTP must be 6 digits")
						.required("OTP is required"),
				});
			} else {
				return Yup.object().shape({
					password: Yup.string()
						.required("Password is required")
						.min(8, "At least 8 characters")
						.matches(/[A-Z]/, "Must include an uppercase letter")
						.matches(/[a-z]/, "Must include a lowercase letter")
						.matches(/[0-9]/, "Must include a number")
						.matches(/[!@#$%^&*]/, "Must include a special character"),
				});
			}
		} else if (isSignUp || isEditMode) {
			return Yup.object().shape({
				name: Yup.string().required("Name is required"),
				email: Yup.string()
					.email("Invalid email address")
					.required("Email is required"),
				phone: Yup.string()
					.matches(/^\d{10}$/, "Phone number must be 10 digits")
					.required("Phone number is required"),
				role: Yup.string()
					.oneOf(["STUDENT", "ALUMNI", "ADMIN"])
					.required("Role is required"),
				password: isSignUp
					? Yup.string()
							.required("Password is required")
							.min(8, "At least 8 characters")
							.matches(/[A-Z]/, "Must include an uppercase letter")
							.matches(/[a-z]/, "Must include a lowercase letter")
							.matches(/[0-9]/, "Must include a number")
							.matches(/[!@#$%^&*]/, "Must include a special character")
					: Yup.string().optional(),
			});
		} else {
			return Yup.object().shape({
				email: Yup.string()
					.email("Invalid email address")
					.required("Email is required"),
				password: Yup.string().required("Password is required"),
			});
		}
	}, [isForget, emailVerified, otpVerified, isSignUp, isEditMode]);

	// Handle form submission
	const [updateUser, { isLoading: isUpdateLoading }] =
		useUpdateProfileMutation();
	const handleSubmit = async (values: any) => {
		const res = await updateUser({
			id: data?.id || 0,
			values,
		}).unwrap();
		if (res.success) {
			toast.success(res.message);
			closed();
		}
	};

	return (
		<Dialog
			open={open}
			onOpenChange={closed}>
			<DialogContent className="sm:max-w-[425px] bg-[#fefeff] shadow-lg rounded-lg">
				<DialogHeader>
					<DialogTitle className="text-center text-2xl font-bold text-gray-800">
						{isEditMode
							? "Edit User Profile"
							: isForget
							? "Reset Password"
							: isSignUp
							? "Create an Account"
							: "Sign In"}
					</DialogTitle>
					<DialogDescription className="text-center text-gray-600">
						{isEditMode
							? "Update user details below"
							: isForget
							? "Reset your password in a few steps"
							: isSignUp
							? "Join us by filling in your details"
							: "Sign in to access your account"}
					</DialogDescription>
				</DialogHeader>

				<Formik
					initialValues={{
						name: data?.name || "",
						email: data?.email || "",
						phone: data?.phone || "",
						role: data?.role || "STUDENT",
					}}
					validationSchema={currentSchema}
					validateOnChange={true}
					validateOnBlur={true}
					onSubmit={handleSubmit}>
					{({ handleChange, values, setFieldValue, errors, touched }) => {
						return (
							<Form className="grid gap-4 p-4">
								{/* Edit Mode or Sign Up Fields */}
								{isEditMode && (
									<>
										<div className="grid gap-2">
											<Label
												htmlFor="name"
												className="text-gray-700 font-medium">
												Name
											</Label>
											<Input
												id="name"
												name="name"
												autoComplete="off"
												value={values.name}
												onChange={handleChange}
												placeholder="Enter your name"
												className="bg-white/80 border-gray-300 focus:ring-2 focus:ring-blue-500"
											/>
											<ErrorMessage
												className="text-red-500 text-sm"
												component="div"
												name="name"
											/>
										</div>
										<div className="grid gap-2">
											<Label
												htmlFor="phone"
												className="text-gray-700 font-medium">
												Phone
											</Label>
											<Input
												id="phone"
												name="phone"
												type="tel"
												value={values.phone}
												onChange={handleChange}
												placeholder="Enter 10-digit phone number"
												className="bg-white/80 border-gray-300 focus:ring-2 focus:ring-blue-500"
											/>
											<ErrorMessage
												className="text-red-500 text-sm"
												component="div"
												name="phone"
											/>
										</div>
										<div className="grid gap-2">
											<Label
												htmlFor="role"
												className="text-gray-700 font-medium">
												Role
											</Label>
											<Select
												value={values.role}
												onValueChange={(value) => setFieldValue("role", value)}>
												<SelectTrigger className="bg-white/80 border-gray-300 focus:ring-2 focus:ring-blue-500">
													<SelectValue placeholder="Select your role" />
												</SelectTrigger>
												<SelectContent>
													<SelectGroup>
														<SelectItem value="STUDENT">Student</SelectItem>
														<SelectItem value="ALUMNI">Alumni</SelectItem>
														<SelectItem value="ADMIN">Admin</SelectItem>
													</SelectGroup>
												</SelectContent>
											</Select>
											<ErrorMessage
												className="text-red-500 text-sm"
												component="div"
												name="role"
											/>
										</div>
									</>
								)}

								{/* Email Field */}
								{(!isForget || !emailVerified) && (
									<div className="grid gap-2">
										<Label
											htmlFor="email"
											className="text-gray-700 font-medium">
											Email
										</Label>
										<Input
											id="email"
											name="email"
											type="email"
											value={values.email}
											onChange={handleChange}
											placeholder="example@gmail.com"
											className="bg-white/80 border-gray-300 focus:ring-2 focus:ring-blue-500"
											disabled={isEditMode} // Prevent changing email in edit mode
										/>
										<ErrorMessage
											className="text-red-500 text-sm"
											component="div"
											name="email"
										/>
									</div>
								)}

								<DialogFooter className="mt-4 flex flex-col gap-3">
									<Button
										type="submit"
										className="w-full bg-[#091b34] hover:bg-blue-700 text-white font-semibold py-2 rounded-lg flex items-center justify-center gap-2 transition-all duration-200"
										disabled={isUpdateLoading}>
										{isUpdateLoading && (
											<Loader2
												size={16}
												className="animate-spin"
											/>
										)}
										Update Profile
									</Button>
									{!isEditMode && (
										<div className="flex justify-between items-center text-sm">
											<div
												onClick={() => setIsForget(!isForget)}
												className="cursor-pointer text-blue-600 hover:underline">
												{isForget ? "Back to Login" : "Forgot Password?"}
											</div>
											<div
												onClick={() => {
													setIsForget(false);
													setIsSignUp(!isSignUp);
												}}
												className="cursor-pointer text-blue-600 hover:underline">
												{isSignUp ? "Sign In" : "Sign Up"}
											</div>
										</div>
									)}
								</DialogFooter>
							</Form>
						);
					}}
				</Formik>
			</DialogContent>
		</Dialog>
	);
};
