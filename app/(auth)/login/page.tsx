"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLoginMutation } from "@/store/baseApi";
import { toast } from "sonner";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Page() {
	const [login, { error, isError, isLoading }] = useLoginMutation();
	const router = useRouter();

	const initialValues = { email: "", password: "" };

	const validationSchema = Yup.object({
		email: Yup.string().email("Invalid email").required("Required"),
		password: Yup.string().min(6, "Minimum 6 characters").required("Required"),
	});

	const handleSubmit = async (values: any) => {
		try {
			const response = await login(values).unwrap();
			if (response.success) {
                router.push("/");
				setTimeout(() => {
					toast.success(response.message);
				}, 1000);
			}
		} catch (err) {
			console.error("Login failed:", err);
			// Handle error appropriately, e.g., show a notification
		}
	};
	useEffect(() => {
		if (isError) {
			toast.error((error as any).data?.message || "Login failed");
		}
	}, [error, isError]);

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
			<div className="w-full max-w-5xl bg-white shadow-xl rounded-lg overflow-hidden flex flex-col md:flex-row">
				{/* Clipped Image Left Side */}
				<div className="relative w-full md:w-1/2 h-64 md:h-auto">
					<div
						className="absolute inset-0 bg-cover bg-center"
						style={{
							backgroundImage: "url('/images/heroImage.png')",
							clipPath: "polygon(0 0, 0% 100%, 100% 0)",
						}}
					/>
				</div>

				{/* Form Section */}
				<div className="w-full md:w-1/2 p-6 sm:p-8 md:p-12">
					<Card className="w-full shadow-none">
						<CardHeader>
							<CardTitle className="text-2xl md:text-3xl font-bold text-gray-800">
								Login to your account
							</CardTitle>
						</CardHeader>
						<CardContent>
							<Formik
								initialValues={initialValues}
								validationSchema={validationSchema}
								onSubmit={handleSubmit}>
								<Form className="space-y-5">
									<div className="space-y-2">
										<Label htmlFor="email">Email</Label>
										<Field
											as={Input}
											type="email"
											name="email"
											placeholder="you@example.com"
										/>
										<ErrorMessage
											name="email"
											component="div"
											className="text-sm text-red-500"
										/>
									</div>

									<div className="space-y-2">
										<Label htmlFor="password">Password</Label>
										<Field
											as={Input}
											type="password"
											name="password"
											placeholder="••••••••"
										/>
										<ErrorMessage
											name="password"
											component="div"
											className="text-sm text-red-500"
										/>
									</div>

									<Button
										type="submit"
										disabled={isLoading}
										className="w-full">
										<Loader2
											className={`mr-2 ${
												isLoading ? "animate-spin" : "hidden"
											}`}
										/>
										{isLoading ? "Logging in..." : "Login"}
									</Button>
								</Form>
							</Formik>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
