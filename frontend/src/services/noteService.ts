import axios from 'axios';

const BASE_URL = 'https://note-app-backend-vg9k.onrender.com/api/notes';

export const noteService = {
    getNotes: (token: string) =>
        axios.get(BASE_URL, {
            headers: { Authorization: `Bearer ${token}` },
        }),
    createNote: (note: { title: string; content: string }, token: string) =>
        axios.post(`${BASE_URL}`, note, {
            headers: { Authorization: `Bearer ${token}` },
        }),

    deleteNote: (id: string, token: string) =>
        axios.delete(`${BASE_URL}/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        }),
    updateNote: (
        id: string,
        updatedData: { title: string; content: string },
        token: string
    ) =>
        axios.put(`${BASE_URL}/${id}`, updatedData, {
            headers: { Authorization: `Bearer ${token}` },
        }),
};
