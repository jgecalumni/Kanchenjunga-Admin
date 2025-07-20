import { baseApi } from "../baseApi";

interface IBooking {
	error: boolean;
	message: string;
	success: boolean;
	data: [
		{
			listing: {
				id: number;
				description: string;
				doubleOccupancy: number;
				singleOccupancy: number;
				images: [
					{
						id: number;
						url: string;
					}
				];
				title: string;
				type: string;
			};

			id: number;
			images: [
				{
					id: number;
					url: string;
				}
			];
			startDate: string;
			endDate: string;
			total: number;
			type: string;
			listingId: number;
			user: {
				id: number;
				name: string;
				email: string;
				role: string;
				phone: string;
			};
		}
	];
}
interface IResponse {
	error: boolean;
	message: string;
	success: boolean;
}

export const BookingApi = baseApi
	.enhanceEndpoints({
		addTagTypes: [
			"Bookings",
			
			"DeleteBookings",
		],
	})
	.injectEndpoints({
		endpoints: (builder) => ({
			getBookings: builder.query<IBooking, { search?: string }>({
				query: ({ search = "" }) => ({
					url: "/bookings",
					method: "GET",
					credentials: "include",
				}),
				providesTags: ["Bookings"],
			}),
			deleteBooking: builder.mutation<IResponse, number>({
				query: (id) => ({
					url: `/bookings/delete/${id}`,
					method: "DELETE",
					credentials: "include",
				}),
				invalidatesTags: ["DeleteBookings"],
			}),
		}),
	});
export const { useGetBookingsQuery,useDeleteBookingMutation } = BookingApi;
