import { ApiResponse, IExpenseCategory } from '../types';
import { axiosClient, returnErrorResponse } from './common';

export const getAllExpenseCategories = async (): Promise<
    ApiResponse<IExpenseCategory[]>
> => {
    const response = axiosClient
        .get('/expenseCategory')
        .then((resp) =>
            ApiResponse.getOkResponse<IExpenseCategory[]>(resp.data)
        )
        .catch((e) => returnErrorResponse<IExpenseCategory[]>(e));
    return response;
};
