import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setCredentials, logout } from "./authSlice";

const buildQuery = (base, params = {}) => {
  const qs = Object.entries(params)
    .filter(([_, v]) => v !== undefined && v !== null && v !== "")
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join("&");
  return qs ? `${base}?${qs}` : base;
};

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE || "http://localhost:8000",
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),

  tagTypes: ["Vessels", "Data", "Aggregate", "Hscode"],

  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "/api/login/",
        method: "POST",
        body: credentials,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;

          dispatch(
            setCredentials({
              token: data.token,
              username: data.username,
              role: data.role, 
              process_ids: data.process_ids || [], 
              form_ids: data.form_ids || [],       
            })
          );
        } catch (err) {
          console.error("Login failed", err);
        }
      },
    }),

    register: builder.mutation({
      query: (newUser) => ({
        url: "/api/register/",
        method: "POST",
        body: newUser,
      }),
    }),

    logout: builder.mutation({
      query: () => ({
        url: "/api/logout/",
        method: "POST",
      }),
      async onQueryStarted(arg, { dispatch }) {
        dispatch(logout());
      },
    }),

    //  Vessel list
    getVessels: builder.query({
      query: () => `/vessels/`,
      providesTags: ["Vessels"],
    }),

    //  Vessel filtered view
    getData: builder.query({
      query: ({ vessel = "", start = "", end = "" } = {}) =>
        buildQuery(`/vessel_data/view/`, { vessel, start, end }),
      providesTags: ["Data"],
    }),

    //  Admin aggregate
    getAggregate: builder.query({
      query: ({ start = "", end = "" } = {}) =>
        buildQuery(`/vessel_data/aggregate/`, { start, end }),
      providesTags: ["Aggregate"],
    }),

    //  Admin vessel full list
    getDataList: builder.query({
      query: () => `/vessel_data/`,
      providesTags: ["Data"],
    }),

    // get hscode list
    getHscodeList: builder.query({
      query: () => `/hscode/list`,
      providesTags: ["Hscode"],
    }),

    //  Create vessel record
    createData: builder.mutation({
      query: (body) => ({
        url: `/vessel_data/create/`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Data", "Aggregate"],
    }),


          // update vessel record
        updateData: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/vessel_data/update/${id}/`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Data", "Aggregate"],
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
  useGetVesselsQuery,
  useGetDataQuery,
  useGetHscodeListQuery,
  useGetAggregateQuery,
  useGetDataListQuery,
  useCreateDataMutation,
  useUpdateDataMutation,
} = apiSlice;
