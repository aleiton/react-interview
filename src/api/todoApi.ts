import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { TodoList, TodoItem, PaginatedTodoItems } from '../types/api';
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

    getTodoItems: builder.query<PaginatedTodoItems, { listId: number; cursor?: number }>({
      query: ({ listId, cursor }) => {
        const params = new URLSearchParams({ per_page: '50' });
        if (cursor != null) params.set('after_id', String(cursor));
        return `/todolists/${listId}/todoitems.json?${params}`;
      },
      transformResponse: (response: unknown) =>
        camelizeKeys<PaginatedTodoItems>(response),
      serializeQueryArgs: ({ queryArgs }) => queryArgs.listId,
      merge: (currentCache, newItems) => {
        const newItemMap = new Map(newItems.items.map((item) => [item.id, item]));
        currentCache.items = currentCache.items.map((item) =>
          newItemMap.get(item.id) ?? item,
        );
        const existingIds = new Set(currentCache.items.map((item) => item.id));
        const uniqueNewItems = newItems.items.filter(
          (item) => !existingIds.has(item.id),
        );
        currentCache.items.push(...uniqueNewItems);
        currentCache.meta = newItems.meta;
      },
      forceRefetch: ({ currentArg, previousArg }) =>
        currentArg?.cursor !== previousArg?.cursor || currentArg?.listId !== previousArg?.listId,
      providesTags: (result, _error, { listId }) =>
        result
          ? [
              ...result.items.map(({ id }) => ({ type: 'TodoItem' as const, id })),
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
      async onQueryStarted({ listId, itemId, updates }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          todoApi.util.updateQueryData(
            'getTodoItems',
            { listId } as { listId: number; cursor?: number },
            (draft) => {
              const item = draft.items.find((i) => i.id === itemId);
              if (item) {
                const wasCompleted = item.completed;
                Object.assign(item, updates);
                if (updates.completed !== undefined && updates.completed !== wasCompleted) {
                  draft.meta.incompleteCount += updates.completed ? -1 : 1;
                }
              }
            },
          ),
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
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
      invalidatesTags: (_result, _error, listId) => [
        { type: 'TodoItem', id: `LIST-${listId}` },
      ],
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
