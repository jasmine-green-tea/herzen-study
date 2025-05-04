import { createSlice } from "@reduxjs/toolkit";

const todoSlice = createSlice ({
    name: "todos",
    initialState: [],
    reducers: {
        addTodo: (state, action) => {
            const newTodo = {
                id: Date.now(),
                text: action.payload.text,
                completed: false,
                dueDate: action.payload.dueDate || null
            };
            state.push(newTodo);
        },

        toggleComplete: (state, action) => {
            const { id, completed, completedAt } = action.payload;
            const todo = state.find(todo => todo.id === id);
            if (todo) {
                todo.completed = completed;
                todo.completedAt = completedAt || null;
            }
        },

        deleteTodo: (state, action) => {
            const index = state.findIndex((todo) => todo.id === action.payload);
            if (index !== -1) {
                state.splice(index, 1);
            }
        },
    },
});

export const { addTodo, toggleComplete, deleteTodo } = todoSlice.actions;
export default todoSlice.reducer;