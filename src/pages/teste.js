import axios from "axios";

function fetchTables() {
    axios.get("http://localhost:8080/admin/tables")
        .then((response) => {
            console.log("Dados recebidos:", response.data);
        })
        .catch((error) => {
            console.error("Error fetching tables:", error);
        });
}

fetchTables();