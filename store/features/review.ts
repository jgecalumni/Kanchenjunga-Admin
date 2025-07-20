import { baseApi } from "../baseApi";

interface IReview {
    error: boolean;
    message: string;
    success: boolean;
    data: [
        {
            id: number;
            content:string,
            createdAt: string;
            rating: number;
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

export const ReviewApi = baseApi
    .enhanceEndpoints({
        addTagTypes: [
            "Reviews",
            "DeleteReviews",
        ],
    })
    .injectEndpoints({
        endpoints: (builder) => ({
            getReviews: builder.query<IReview, { search?: string }>({
                query: ({ search = "" }) => ({
                    url: "/reviews",
                    method: "GET",
                    credentials: "include",
                }),
                providesTags: ["Reviews"],
            }),
            deleteReview: builder.mutation<IResponse, number>({
                query: (id) => ({
                    url: `/reviews/delete/${id}`,
                    method: "DELETE",
                    credentials: "include",
                }),
                invalidatesTags: ["DeleteReviews"],
            }),
        }),
    });
export const { useGetReviewsQuery,useDeleteReviewMutation} = ReviewApi;
