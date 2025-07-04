

import { apiSlice } from "../../api/apiSlice";



export const profileApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createGym: builder.mutation({
      query: (formData) => ({
        url: "gym/create-profile",
        method: "POST",
        body: formData,
        credentials: "include" as const,
        // formData:true,
      }),
    }),

    // getGyms: builder.query<any[], void>({
    //   query: () => "/Allgyms",
    // }),

    // // Fetch a single doctor by ID
    // getGymById: builder.query<any, string>({
    //   query: (id) => `/single/${id}`,
    // }),

    // deleteDoctors: builder.mutation({
    //   query: (id) => ({
    //     url: `delete/${id}`,
    //     method: "DELETE",
    //     body: { id },
    //   }),
    // }),
  }),
});

export const {useCreateGymMutation} =profileApi