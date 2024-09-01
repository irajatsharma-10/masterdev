import { apiConnector } from "../apiconnector"
import { toast } from "react-hot-toast"
import { setUser } from "../../redux/slices/profileSlice"
import { settingsEndpoints } from "../apis"

const { UPDATE_PROFILE_API } = settingsEndpoints

export function updateProfile(token, formData) {
    return async (dispatch) => {
        const toastId = toast.loading("Loading...")
        try {
            // PUT request to update the data
            const response = await apiConnector("PUT", UPDATE_PROFILE_API, formData, {
                Authorisation: `Bearer ${token}`, 
            })
            console.log("UPDATE_PROFILE_API API RESPONSE............", response)

            if (!response.data.success) {
                throw new Error(response.data.message)
            }

            // Update the Redux store with new user details
            dispatch(
                setUser({ ...response.data.updatedUserDetails })
            )

            // Display success message
            toast.success("Profile Updated Successfully")
        } catch (error) {
            console.log("UPDATE_PROFILE_API API ERROR............", error)
            // Improved error handling
            const errorMessage = error.response?.data?.message || "Could Not Update Profile";
            toast.error(errorMessage)
        }
        toast.dismiss(toastId)
    }
}
