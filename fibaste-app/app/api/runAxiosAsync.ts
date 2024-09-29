import { AxiosError, AxiosResponse } from "axios";
import { showMessage } from "react-native-flash-message";

type SuccessResponse<T> = {
    data: T,
    error: null,
};

type ErrorResponse<E> = {
    data: null,
    error: E,
};

export const runAxiosAsync = async <T>(
    promise: Promise<AxiosResponse<T>>
): Promise<T | null> => {
    try {
        const response = await promise;

        // Log the response for debugging purposes
        //console.log('Success Response:', response);

        return response.data;
    } catch (error) {
        let message = (error as any).message || 'An unexpected error occured';

        if (error instanceof AxiosError) {
            const response = error.response;

            if (response) {
                //console.log('Error Response:', response);

                // Accessing the message safely (this may very depending on your API)
                message = response.data?.message || 'Server error occured';
            }
        }

        // Show error message to the user
        showMessage({ message, type: 'danger' });

        // Log the error for further debugging
        console.log('Caught error:', error);
    }

    return null;
};