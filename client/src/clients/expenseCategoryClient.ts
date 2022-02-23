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

export const createExpenseCategory = async (
    expenseCategory: IExpenseCategory
): Promise<ApiResponse<IExpenseCategory>> => {
    const response = axiosClient
        .post('/expenseCategory', { expenseCategory: expenseCategory })
        .then((resp) => ApiResponse.getOkResponse<IExpenseCategory>(resp.data))
        .catch((e) => returnErrorResponse<IExpenseCategory>(e));
    return response;
};

export const modifyExpenseCategory = async (
    expenseCategory: IExpenseCategory,
    expenseCategoryId: string
): Promise<ApiResponse<IExpenseCategory>> => {
    const response = axiosClient
        .patch('/expenseCategory', {
            expenseCategory: expenseCategory,
            expenseCategoryId: expenseCategoryId,
        })
        .then((resp) => ApiResponse.getOkResponse<IExpenseCategory>(resp.data))
        .catch((e) => returnErrorResponse<IExpenseCategory>(e));
    return response;
};

export const deleteExpenseCategory = async (
    expenseCategoryId: string
): Promise<ApiResponse<void>> => {
    const response = axiosClient
        .delete(`/expenseCategory/${expenseCategoryId}`)
        .then((resp) => ApiResponse.getOkResponse<void>(resp.data))
        .catch((e) => returnErrorResponse<void>(e));
    return response;
};
