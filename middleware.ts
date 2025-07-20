import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

function parseJwt(token: string) {
	try {
		const base64Url = token.split(".")[1];
		const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
		const jsonPayload = decodeURIComponent(
			atob(base64)
				.split("")
				.map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
				.join("")
		);
		return JSON.parse(jsonPayload);
	} catch (e) {
		return null;
	}
}

export function middleware(request: NextRequest) {
	const path = request.nextUrl.pathname;
	const isPublic = path === "/login";

	const token = request.cookies.get("token")?.value || "";

	const tokenData = parseJwt(token);
    

	// If user is logged in and trying to access login page, redirect them accordingly
	if (isPublic && tokenData) {
		if (tokenData.role === "ADMIN") {
			return NextResponse.redirect(new URL("/", request.nextUrl));
		}
	}

	// If user is not logged in and trying to access a protected route
	if (!isPublic && !token) {
		return NextResponse.redirect(new URL("/login", request.nextUrl));
	}

	// Role-based access control
	if (token && tokenData) {
		if (tokenData.role === "ADMIN") {
			// admin can access all routes
			return NextResponse.next();
		} else {
			// unknown role - redirect to login
			return NextResponse.redirect(new URL("/login", request.nextUrl));
		}
	}
}

export const config = {
	matcher: [
		"/login",
		"/",
		"/bookings",
		"/listings",
		"/reviews",
		"/users",
	],
};
