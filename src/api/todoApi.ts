import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { TodoList, TodoItem } from '../types/api';
import { camelizeKeys } from '../utils/camelize';

export const todoApi = createApi({
  reducerPath: 'todoApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api',
    prepareHeaders: (headers) => {
      headers.set('Accept', 'application/json');
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['TodoList', 'TodoItem'],
  endpoints: (builder) => ({
    getTodoLists: builder.query<TodoList[], void>({
      query: () => '/todolists.json',
      transformResponse: (response: unknown) => camelizeKeys<TodoList[]>(response),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'TodoList' as const, id })),
              { type: 'TodoList', id: 'LIST' },
            ]
          : [{ type: 'TodoList', id: 'LIST' }],
    }),

    getTodoItems: builder.query<TodoItem[], number>({
      query: (listId) => `/todolists/${listId}/todoitems.json`,
      transformResponse: (response: unknown) => camelizeKeys<TodoItem[]>(response),
      providesTags: (result, _error, listId) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'TodoItem' as const, id })),
              { type: 'TodoItem', id: `LIST-${listId}` },
            ]
          : [{ type: 'TodoItem', id: `LIST-${listId}` }],
    }),

    createTodoList: builder.mutation<TodoList, string>({
      query: (name) => ({
        url: '/todolists.json',
        method: 'POST',
        body: { todo_list: { name } },
      }),
      transformResponse: (response: unknown) => camelizeKeys<TodoList>(response),
      invalidatesTags: [{ type: 'TodoList', id: 'LIST' }],
    }),

    updateTodoList: builder.mutation<TodoList, { id: number; name: string }>({
      query: ({ id, name }) => ({
        url: `/todolists/${id}.json`,
        method: 'PATCH',
        body: { todo_list: { name } },
      }),
      transformResponse: (response: unknown) => camelizeKeys<TodoList>(response),
      invalidatesTags: (result) =>
        result ? [{ type: 'TodoList', id: result.id }, { type: 'TodoList', id: 'LIST' }] : [],
    }),

    deleteTodoList: builder.mutation<void, number>({
      query: (id) => ({
        url: `/todolists/${id}.json`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'TodoList', id: 'LIST' }],
    }),

    createTodoItem: builder.mutation<TodoItem, { listId: number; description: string }>({
      query: ({ listId, description }) => ({
        url: `/todolists/${listId}/todoitems.json`,
        method: 'POST',
        body: { todo_item: { description } },
      }),
      transformResponse: (response: unknown) => camelizeKeys<TodoItem>(response),
      invalidatesTags: (_result, _error, { listId }) => [
        { type: 'TodoItem', id: `LIST-${listId}` },
      ],
    }),

    updateTodoItem: builder.mutation<
      TodoItem,
      { listId: number; itemId: number; updates: Partial<Pick<TodoItem, 'description' | 'completed'>> }
    >({
      query: ({ listId, itemId, updates }) => ({
        url: `/todolists/${listId}/todoitems/${itemId}.json`,
        method: 'PATCH',
        body: { todo_item: updates },
      }),
      transformResponse: (response: unknown) => camelizeKeys<TodoItem>(response),
      invalidatesTags: (result, _error, { listId }) =>
        result ? [{ type: 'TodoItem', id: result.id }, { type: 'TodoItem', id: `LIST-${listId}` }] : [],
    }),

    deleteTodoItem: builder.mutation<void, { listId: number; itemId: number }>({
      query: ({ listId, itemId }) => ({
        url: `/todolists/${listId}/todoitems/${itemId}.json`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, { listId }) => [
        { type: 'TodoItem', id: `LIST-${listId}` },
      ],
    }),

    completeAllItems: builder.mutation<void, number>({
      query: (listId) => ({
        url: `/todolists/${listId}/complete_all.json`,
        method: 'POST',
      }),
    }),
  }),
});

export const {
  useGetTodoListsQuery,
  useGetTodoItemsQuery,
  useCreateTodoListMutation,
  useUpdateTodoListMutation,
  useDeleteTodoListMutation,
  useCreateTodoItemMutation,
  useUpdateTodoItemMutation,
  useDeleteTodoItemMutation,
  useCompleteAllItemsMutation,
} = todoApi;
