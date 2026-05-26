import { createApi } from "@reduxjs/toolkit/query/react";
import { buildListBody } from "../../utils/api-query";
import { baseQueryWithReauth } from "./baseQuery";

const listPost = (url, body) => ({
  url,
  method: "POST",
  body: body ?? buildListBody(),
});

export const adminApi = createApi({
  reducerPath: "adminApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    "AdminUsers",
    "AdminOrders",
    "AdminInstruments",
    "AdminCourses",
    "Dashboard",
    "CourseDetail",
  ],
  endpoints: (builder) => ({
    getAllUsers: builder.query({
      query: (listParams = {}) => listPost("/admin/allusers", buildListBody(listParams)),
      transformResponse: (res) => ({
        data: res?.data ?? [],
        totalDataCount: res?.totalDataCount ?? 0,
        success: res?.success,
      }),
      providesTags: ["AdminUsers"],
    }),
    getAllUserOrders: builder.query({
      query: (listParams = {}) =>
        listPost("/admin/allusersorders", buildListBody(listParams)),
      transformResponse: (res) => ({
        data: res?.data ?? [],
        totalDataCount: res?.totalDataCount ?? 0,
        success: res?.success,
      }),
      providesTags: ["AdminOrders"],
    }),
    getAdminUserById: builder.query({
      query: (id) => `/admin/user/${id}`,
      transformResponse: (res) => res?.data ?? null,
    }),
    getAdminOrderById: builder.query({
      query: (id) => `/admin/order/${id}`,
      transformResponse: (res) => res?.data ?? null,
    }),
    getAdminInstruments: builder.query({
      query: (listParams = {}) =>
        listPost("/admin/allinstumnts", buildListBody(listParams)),
      transformResponse: (res) => ({
        data: res?.data ?? [],
        totalDataCount: res?.totalDataCount ?? 0,
        success: res?.success,
      }),
      providesTags: ["AdminInstruments"],
    }),
    getAdminCourses: builder.query({
      query: (listParams = {}) =>
        listPost("/admin/allcourses", buildListBody(listParams)),
      transformResponse: (res) => ({
        data: res?.data ?? [],
        totalDataCount: res?.totalDataCount ?? 0,
        success: res?.success,
      }),
      providesTags: ["AdminCourses"],
    }),
    getDashboardSummary: builder.query({
      query: () => "/admin/getdashboardsummary",
      transformResponse: (res) => res?.data ?? null,
      providesTags: ["Dashboard"],
    }),

    checkInstrumentTitle: builder.mutation({
      query: (body) => ({
        url: "/admin/checkinstrumenttitle",
        method: "POST",
        body,
      }),
    }),
    checkCourseTitle: builder.mutation({
      query: (body) => ({
        url: "/admin/checkcoursetitle",
        method: "POST",
        body,
      }),
    }),
    createInstrument: builder.mutation({
      query: (body) => ({ url: "/admin/addinstrument", method: "POST", body }),
      invalidatesTags: ["AdminInstruments", "Dashboard"],
    }),
    updateInstrument: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/admin/updateinstrument/${id}`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["AdminInstruments", "Dashboard"],
    }),
    deleteInstrument: builder.mutation({
      query: (id) => ({ url: `/admin/deleteinstrument/${id}`, method: "DELETE" }),
      invalidatesTags: ["AdminInstruments", "AdminCourses", "Dashboard"],
    }),
    createCourse: builder.mutation({
      query: (body) => ({ url: "/admin/createcourse", method: "POST", body }),
      invalidatesTags: ["AdminCourses", "Dashboard"],
    }),
    updateCourse: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/admin/updatecourse/${id}`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["AdminCourses", "CourseDetail", "Dashboard"],
    }),
    deleteCourse: builder.mutation({
      query: (id) => ({ url: `/admin/deletecourse/${id}`, method: "DELETE" }),
      invalidatesTags: ["AdminCourses", "CourseDetail", "Dashboard"],
    }),
    addLecture: builder.mutation({
      query: (body) => ({ url: "/admin/addlecture", method: "POST", body }),
      invalidatesTags: ["CourseDetail", "AdminCourses"],
    }),
    updateLecture: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/admin/updatelecture/${id}`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["CourseDetail"],
    }),
    deleteLecture: builder.mutation({
      query: (id) => ({ url: `/admin/deletelecture/${id}`, method: "DELETE" }),
      invalidatesTags: ["CourseDetail"],
    }),
  }),
});

export const {
  useLazyGetAllUsersQuery,
  useLazyGetAllUserOrdersQuery,
  useGetAdminUserByIdQuery,
  useGetAdminOrderByIdQuery,
  useLazyGetAdminInstrumentsQuery,
  useLazyGetAdminCoursesQuery,
  useGetDashboardSummaryQuery,
  useCheckInstrumentTitleMutation,
  useCheckCourseTitleMutation,
  useCreateInstrumentMutation,
  useUpdateInstrumentMutation,
  useDeleteInstrumentMutation,
  useCreateCourseMutation,
  useUpdateCourseMutation,
  useDeleteCourseMutation,
  useAddLectureMutation,
  useUpdateLectureMutation,
  useDeleteLectureMutation,
} = adminApi;
