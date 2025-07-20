import { baseApi } from "../baseApi";

interface IListing {
	error: boolean;
	message: string;
	success: boolean;
	data: [
		{
			bookings: [];
			description: string;
			id: number;
			images: [
				{
					id: number;
					url: string;
				}
			];
			reviews: [];
			title: string;
			type: string;
			user: {
				id: number;
				name: string;
				email: string;
			};
			doubleOccupancy: number;
			singleOccupancy: number;
		}
	];
}
interface IResponse {
	error: boolean;
	message: string;
	success: boolean;
}

export const listingApi = baseApi
	.enhanceEndpoints({
		addTagTypes: ["Listing", "CreateListing", "UpdateListing", "DeleteListing"],
	})
	.injectEndpoints({
		endpoints: (builder) => ({
			getListings: builder.query<IListing, { search?: string }>({
				query: ({ search = "" }) => ({
					url: "/rooms",
					method: "GET",
					credentials: "include",
				}),
				providesTags: ["Listing"],
			}),
			createListing: builder.mutation<IResponse, FormData>({
				query: (formData) => ({
					url: "/rooms/create",
					method: "POST",
					body: formData,
					credentials: "include",
				}),
				invalidatesTags: ["CreateListing"],
			}),
			updateListing: builder.mutation<
				IResponse,
				{ id: number; formData: FormData }
			>({
				query: ({ id, formData }) => ({
					url: `/rooms/update/${id}`,
					method: "PATCH",
					body: formData,
					credentials: "include",
				}),
				invalidatesTags: ["UpdateListing"],
			}),
			deleteListing: builder.mutation<IResponse, { id: number }>({
				query: ({ id }) => ({
					url: `/rooms/delete/${id}`,
					method: "DELETE",
					credentials: "include",
				}),
				invalidatesTags: ["DeleteListing"],
			}),
		}),
	});
export const {
	useGetListingsQuery,
	useCreateListingMutation,
	useUpdateListingMutation,
    useDeleteListingMutation
} = listingApi;
