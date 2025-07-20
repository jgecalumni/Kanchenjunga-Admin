"use client";

import { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useGetProfileQuery } from "./baseApi";

interface AuthContextType {
	token: string | null;
	data: any;
	refreshTokenFromCookie: () => void;
	refetch: () => void;
}

const AuthContext = createContext<AuthContextType>({
	token: null,
	data: null,
	refreshTokenFromCookie: () => {},
	refetch: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const { data, refetch } = useGetProfileQuery({});
	const [token, setToken] = useState<string | null>(null);
	const refreshTokenFromCookie = () => {
		const cookieToken = Cookies.get("token") || null;
		setToken(cookieToken);
		refetch();
	};

	useEffect(() => {
		refreshTokenFromCookie(); // on first load
	}, []);

	return (
		<AuthContext.Provider
			value={{ token, refreshTokenFromCookie, data, refetch }}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => useContext(AuthContext);
