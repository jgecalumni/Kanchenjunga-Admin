import { baseApi } from "../baseApi";

interface IReview {
	error: boolean;
	message: string;
	success: boolean;
	data: {
		booking: number;
		users: number;
		listings: number;
		totalRevenue: number;
	};
}

export const countApi = baseApi
	.enhanceEndpoints({
		addTagTypes: ["counts"],
	})
	.injectEndpoints({
		endpoints: (builder) => ({
			getCounts: builder.query<IReview, { search?: string }>({
				query: ({ search = "" }) => ({
					url: "/counts",
					method: "GET",
					credentials: "include",
				}),
				providesTags: ["counts"],
			}),
		}),
	});
export const { useGetCountsQuery } = countApi;
