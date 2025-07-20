import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface IResponse {
	token: string;
	message: string;
	success: boolean;
	error: boolean;
}

interface IUser {
	data: [
		{
			id: number;
			name: string;
			email: string;
			role: string;
			phone: string;
			listings: [];
			createdAt: string;
			reviews: [];
			bookings: [];
		}
	];
	success: boolean;
	message: string;
	error: boolean;
}

export const baseApi = createApi({
	reducerPath: "api",
	baseQuery: fetchBaseQuery({
		baseUrl: process.env.NEXT_PUBLIC_API_URL,
		credentials: "include",
	}),
	tagTypes: ["login", "logout", "getProfile", "updateProfile"],
	endpoints: (builder) => ({
		login: builder.mutation<IResponse, unknown>({
			query: (data) => ({
				url: "/auth/login",
				method: "POST",
				body: data,
			}),
			invalidatesTags: ["login"],
		}),

		logout: builder.mutation<IResponse, void>({
			query: () => ({
				url: "/auth/logout",
				method: "POST",
			}),
			invalidatesTags: ["logout"],
		}),

		getProfile: builder.query<IUser, unknown>({
			query: () => ({
				url: "/auth/get-user",
				method: "GET",
				credentials: "include",
			}),
			providesTags: ["getProfile"],
		}),

		getAllUsers: builder.query<IUser, unknown>({
			query: () => ({
				url: "/auth/admin",
				method: "GET",
				credentials: "include",
			}),
			providesTags: ["getProfile"],
		}),

		updateProfile: builder.mutation<IResponse, {values:any,id:number}>({
			query: ({id,values}) => ({
				url: `/auth/admin/update/${id}`,
				method: "PATCH",
				body: values,
				credentials: "include",
			}),
			invalidatesTags: ["updateProfile"],
		})
	}),
});

export const {
	useLoginMutation,
	useLogoutMutation,
	useGetProfileQuery,
	useGetAllUsersQuery,
	useUpdateProfileMutation
} = baseApi;
