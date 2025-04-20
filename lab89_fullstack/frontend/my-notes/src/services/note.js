import axios from "axios"

export const fetchNotes = async (filter) => {
    try {

        console.log(filter);

        var response = await axios.get("http://localhost:5201/notes", {
            params: {
                search: filter?.search,
                sortItem: filter?.sortItem,
                sortOrder: filter?.sortOrder,
            },
        });

        return response.data.notes;
    } catch (e) {
        console.error(e);
    }
};

export const createNote = async (note) => {
    try {
        var response = await axios.post("http://localhost:5201/notes", note);

        return response.status;
    } catch (e) {
        console.log("caught exception");
        console.error("Error details:", e.response?.data);
        console.error(e);
    }
};