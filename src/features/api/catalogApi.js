import { createApi } from "@reduxjs/toolkit/query/react";
import { buildListBody } from "../../utils/api-query";
import { baseQueryWithReauth } from "./baseQuery";

const listPost = (url, body) => ({
  url,
  method: "POST",
  body: body ?? buildListBody(),
});

export const catalogApi = createApi({
  reducerPath: "catalogApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Instruments", "Courses", "Cart", "Orders"],
  endpoints: (builder) => ({
    getInstruments: builder.query({
      query: (args = {}) => {
        const { guest = false, ...listParams } = args;
        return listPost(
          guest ? "/admin/guestallinstumnts" : "/admin/allinstumnts",
          buildListBody(listParams)
        );
      },
      transformResponse: (res) => res?.data ?? [],
      providesTags: ["Instruments"],
    }),
    getCourses: builder.query({
      query: (args = {}) => {
        const { guest = false, ...listParams } = args;
        return listPost(
          guest ? "/admin/guestallcourses" : "/admin/allcourses",
          buildListBody(listParams)
        );
      },
      transformResponse: (res) => res?.data ?? [],
      providesTags: ["Courses"],
    }),
    getInstrumentById: builder.query({
      query: ({ id, guest = false }) => ({
        url: guest ? `/admin/guestinstumntbyid/${id}` : `/admin/instumntbyid/${id}`,
      }),
      transformResponse: (res) => res?.data,
    }),
    getCourseById: builder.query({
      query: ({ id, guest = false }) => ({
        url: guest ? `/admin/guestcoursebyid/${id}` : `/admin/coursebyid/${id}`,
      }),
      transformResponse: (res) => {
        const payload = res?.data ?? res;
        return {
          course: payload?.course_data ?? null,
          lectures: payload?.lectures_data ?? [],
        };
      },
    }),
    getMyOrders: builder.query({
      query: (listParams = {}) =>
        listPost("/user/getmyorders", buildListBody(listParams)),
      transformResponse: (res) => res?.data ?? [],
      providesTags: ["Orders"],
    }),
    addToCart: builder.mutation({
      query: ({ productId, productType }) => ({
        url: "/user/addtocart",
        method: "POST",
        body: { productId, productType },
      }),
      transformResponse: (res) => res?.data ?? { items: [] },
      invalidatesTags: ["Cart"],
    }),
    getCartItems: builder.query({
      query: () => "/user/getcartitems",
      transformResponse: (res) => res?.data ?? { items: [] },
      providesTags: ["Cart"],
    }),
    increaseCartQuantity: builder.mutation({
      query: ({ productId, productType }) => ({
        url: "/user/increasequantity",
        method: "POST",
        body: { productId, productType },
      }),
      transformResponse: (res) => res?.data ?? { items: [] },
      invalidatesTags: ["Cart"],
    }),
    decreaseCartQuantity: builder.mutation({
      query: ({ productId, productType }) => ({
        url: "/user/decreasequantity",
        method: "POST",
        body: { productId, productType },
      }),
      transformResponse: (res) => res?.data ?? { items: [] },
      invalidatesTags: ["Cart"],
    }),
    removeFromCart: builder.mutation({
      query: ({ productId, productType }) => ({
        url: "/user/removefromcart",
        method: "POST",
        body: { productId, productType },
      }),
      transformResponse: (res) => res?.data ?? { items: [] },
      invalidatesTags: ["Cart"],
    }),
    createCheckoutSession: builder.mutation({
      query: () => ({
        url: "/user/create-checkout-session",
        method: "POST",
      }),
      transformResponse: (res) => res?.data,
    }),
    verifyPayment: builder.mutation({
      query: (body) => ({
        url: "/user/verify-payment",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Cart", "Orders"],
    }),
  }),
});

export const {
  useGetInstrumentsQuery,
  useGetCoursesQuery,
  useGetInstrumentByIdQuery,
  useGetCourseByIdQuery,
  useGetMyOrdersQuery,
  useAddToCartMutation,
  useGetCartItemsQuery,
  useIncreaseCartQuantityMutation,
  useDecreaseCartQuantityMutation,
  useRemoveFromCartMutation,
  useCreateCheckoutSessionMutation,
  useVerifyPaymentMutation,
} = catalogApi;
