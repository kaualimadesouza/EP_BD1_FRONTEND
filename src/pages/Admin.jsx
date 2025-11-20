import { useEffect, useState } from "react";
import { Database, Tag } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";
import { DataGrid } from '@mui/x-data-grid';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from "@mui/material";


const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
});

function Admin() {
    const [table, setTable] = useState("");
    const [action, setAction] = useState("insert");
    const [tables, setTables] = useState([]);
    const [showTableData, setShowTableData] = useState(false);
    const [deleteId, setDeleteId] = useState("");
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");
    const [insertSuccess, setInsertSuccess] = useState(false);

    const [rows, setRows] = useState([]);
    const [columns, setColumns] = useState([]);
    const [tableColumns, setTableColumns] = useState([]);
    const [tableColumnsInsertValue, setTableColumnsInsertValue] = useState([]);

    const [updateId, setUpdateId] = useState("");
    const [originalDataUpdate, setOriginalDataUpdate] = useState(null);
    const [updateFieldsVisible, setUpdateFieldsVisible] = useState(false);

    // Lida com a seleção de uma linha para atualização.
    async function handleChooseRow(e) {
        e.preventDefault();
        setMessage("");
        setMessageType("");
        if (!updateId) {
            setMessage("Informe o ID do registro para buscar.");
            setMessageType("error");
            setTimeout(() => {
                setMessage("");
                setMessageType("");
            }, 4000);
            return;
        }
        try {
            // Faz a requisição para obter os dados do registro pelo ID.
            const res = await axios.get(`http://localhost:8080/${table}/${updateId}`);
            setOriginalDataUpdate(res.data);
            
            // Preenche os campos editáveis com os valores atuais do registro.
            setTableColumnsInsertValue(
                tableColumns.filter(col => col !== "id").map(col => ({
                    name: col,
                    value: res.data[toCamelCase(col)] ?? ""
                }))
            );
            setUpdateFieldsVisible(true);
        } catch (err) {
            setMessage("Registro não encontrado.");
            setMessageType("error");
            setUpdateFieldsVisible(false);
            setOriginalDataUpdate(null);
            setTableColumnsInsertValue([]);
            setTimeout(() => {
                setMessage("");
                setMessageType("");
            }, 4000);
        }
    }

    // Lida com a atualização de um registro existente.
    function updateRow(e) {
        e.preventDefault();
        if (!updateId) {
            setMessage("Informe o ID do registro para atualizar.");
            setMessageType("error");
            setTimeout(() => {
                setMessage("");
                setMessageType("");
            }, 6000);
            return;
        }
        // Começa com os dados originais e sobrescreve com os valores do formulário.
        const rowData = { ...originalDataUpdate };
        tableColumnsInsertValue.forEach((col) => {
            const camelKey = toCamelCase(col.name);
            if (/date|data/i.test(col.name) && col.value) {
                rowData[camelKey] = new Date(col.value).toISOString();
            } else if (/capacidade/i.test(col.name)) {
                rowData[camelKey] = col.value !== "" ? Number(col.value) : undefined;
            } else {
                rowData[camelKey] = col.value;
            }
        });
        // Confirmação antes de enviar a requisição.
        if (window.confirm("Deseja realmente atualizar este registro?")) {
            axios.put(`http://localhost:8080/${table}/${updateId}`, rowData)
                .then((response) => {
                    setMessage("Registro atualizado com sucesso!");
                    setMessageType("success");
                    setTimeout(() => {
                        setMessage("");
                        setMessageType("");
                    }, 4000);


                    // Reseta os estados após o sucesso.
                    setUpdateId("");
                    setTableColumnsInsertValue([]);
                    setUpdateFieldsVisible(false);
                    setOriginalDataUpdate(null);
                })
                .catch((error) => {
                    setMessage("Erro ao atualizar registro.");
                    setMessageType("error");
                    setTimeout(() => {
                        setMessage("");
                        setMessageType("");
                    }, 6000);
                });
        }
    }

    // Lida com a exclusão de um registro.
    function handleDelete(e) {
        e.preventDefault();
        setMessage("");
        setMessageType("");
        axios.delete(`http://localhost:8080/${table}/${deleteId}`)
            .then((response) => {
                if (response.status === 200) {
                    setMessage(`Registro com ID: ${deleteId} deletado da tabela ${table}`);
                    setMessageType("success");
                } else {
                    setMessage("Erro ao deletar registro.");
                    setMessageType("error");
                }
                setTimeout(() => {
                    setMessage("");
                    setMessageType("");
                }, 10000);
            })
            .catch((error) => {
                if (error.response && error.response.status === 404) {
                    setMessage("ID não encontrado para exclusão.");
                } else {
                    setMessage("Erro ao deletar registro.");
                }
                setMessageType("error");
                setTimeout(() => {
                    setMessage("");
                    setMessageType("");
                }, 10000);
            });
    }

    // Busca a lista de tabelas disponíveis na API e atualiza o estado `tables`.
    function fetchTables() {
        axios.get("http://localhost:8080/admin/tables")
            .then((response) => setTables(response.data))
            .catch((error) => console.error("Error fetching tables:", error));
    }

    function formatDataForGrid(data) {
        if (!data || data.length === 0) {
            setColumns([]);
            setRows([]);
            return;
        }

        // Extrai as chaves do primeiro item para definir as colunas.
        const firstItemKeys = Object.keys(data[0]);
        const gridColumns = firstItemKeys.map((key) => ({
            field: key,
            headerName: key.replace(/_/g, ' ').toUpperCase(),
            width: 150,
            flex: 1,
        }));
        
        const gridRows = data.map((row, index) => ({
            ...row,
            id: row.id !== undefined ? row.id : index,
        }));

        setColumns(gridColumns);
        setRows(gridRows);
    }

    function showTable() {
        if (showTableData) {
            setShowTableData(false);
            setRows([]);
            setColumns([]);
        } else {
            setShowTableData(true);
            setRows([]);
            setColumns([]);
            axios.get(`http://localhost:8080/${table}`)
                .then((response) => {
                    console.log("Dados da tabela:", response.data);
                    formatDataForGrid(response.data);
                })
                .catch((error) => {
                    console.error("Error fetching table data:", error);
                    formatDataForGrid([]);
                });
        }
    }

    // Buscar a lista de tabelas disponíveis quando o componente é montado.
    useEffect(() => {
        fetchTables();
    }, []);

    // Busca os nomes das colunas da tabela selecionada na API e atualiza o estado `tableColumns`.
    function fetchTableColumns() {
        if (!table) return;
        axios.get(`http://localhost:8080/${table}/columns`)
            .then((response) => {
                setTableColumns(response.data);
            })
            .catch((error) => {
                console.error("Error fetching table columns:", error);
            });
    }

    // Lida com a mudança de valor em um campo de input do formulário.
    function handleInputChange(e, columnName) {
        const value = e.target.value;
        setTableColumnsInsertValue((prev) => {
            // Se a coluna já existe no estado, atualiza seu valor; caso contrário, adiciona.
            const found = prev.find((col) => col.name === columnName);
            if (found) {
                return prev.map((col) =>
                    col.name === columnName ? { ...col, value } : col
                );
            } else {
                return [...prev, { name: columnName, value }];
            }
        });
    }


    // Converte uma string de snake_case para camelCase (No banco esta em snake_case (data_base) e no programa em java está em camelCase (dataBase)).
    function toCamelCase(str) {
        return str.replace(/_([a-z])/g, (g) => g[1].toUpperCase())
                  .replace(/^([A-Z])/, (g) => g.toLowerCase())
                  .replace(/^([a-z])/, (g) => g.toLowerCase())
                  .replace(/(^|_)([a-z])/g, (match, p1, p2, offset) => offset === 0 ? p2.toLowerCase() : p2.toUpperCase());
    }

    // Lida com a inserção de um novo registro na tabela.
    function insertRow(e) {
        e.preventDefault();
        const rowData = {};
        tableColumnsInsertValue.forEach((col) => {
            const camelKey = toCamelCase(col.name);
            if (/date|data/i.test(col.name) && col.value) {
                rowData[camelKey] = new Date(col.value).toISOString();
            } else if (/capacidade/i.test(col.name)) {
                rowData[camelKey] = col.value !== "" ? Number(col.value) : undefined;
            } else {
                rowData[camelKey] = col.value;
            }
        });


        if (window.confirm("Deseja realmente inserir este registro? Veja o JSON na tela.")) {
            axios.post(`http://localhost:8080/${table}`, rowData)
                .then((response) => {
                    setInsertSuccess(true);
                    setTimeout(() => setInsertSuccess(false), 4000);
                    setTableColumnsInsertValue([]);
                })
                .catch((error) => {
                    console.error("Error inserting row:", error);
                    setMessage("Erro ao inserir linha.");
                    setMessageType("error");
                    setTimeout(() => {
                        setMessage("");
                        setMessageType("");
                    }, 6000);
                });
        }
    }

    useEffect(() => {
        setUpdateId("");
        setUpdateFieldsVisible(false);
        setOriginalDataUpdate(null);
        setTableColumnsInsertValue([]);
        setDeleteId("");
        setMessage("");
        setMessageType("");
        if (table) {
            fetchTableColumns();
        }
    }, [action, table]);

    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline />
            <Link to="/" className="fixed top-4 left-4 z-50 bg-zinc-800 hover:bg-zinc-700 text-white p-3 rounded-full transition-all duration-300 hover:opacity-90 hover:shadow-lg border border-zinc-700">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
            </Link>
            <div className="flex flex-col lg:flex-row bg-black min-h-screen w-full animate-fade-in">
                <div className="bg-zinc-800 min-h-[320px] lg:h-screen lg:border-r-[0.2px] border-zinc-700 border-opacity-40 lg:justify-center lg:items-center py-10 lg:py-0 flex flex-col w-full max-w-full lg:max-w-[600px] flex-shrink-0 min-w-0 gap-4 transition-all duration-300 hover:shadow-3xl hover:border-zinc-700">
                    <h1 className="font-semibold text-white px-4 text-2xl text-center">
                        Goalytics<br />Administrador page
                    </h1>
                    <div className="relative w-full px-4 sm:px-8">
                        <Database className="absolute left-12 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none z-10" />
                        <select 
                            required
                            value={table}
                            className="w-full appearance-none bg-black border border-gray-700 text-gray-300 py-3.5 pl-12 pr-12 rounded-lg focus:outline-none invalid:text-gray-500 hover:opacity-90 transition-all duration-300 cursor-pointer hover:shadow-lg"
                            onChange={(e) => setTable(e.target.value)}
                        >
                            <option value="" disabled>Selecione a Tabela</option>
                            {tables.map((table) => (
                                <option key={table} value={table}>
                                    {table}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-4 w-full px-4 sm:px-8">
                        {/* Opção "Insert" */}
                        <div>
                            <input 
                                type="radio" 
                                id="insert" 
                                name="plan" 
                                className="hidden peer" 
                                defaultChecked
                                onClick={() => fetchTableColumns()}
                                onChange={() => setAction("insert")}
                            />
                            <label 
                                htmlFor="insert"
                                className="flex justify-between items-center p-5 bg-brand-card rounded-lg border-2 cursor-pointer transition-all duration-300 border-gray-600 hover:opacity-80 hover:shadow-lg hover:border-zinc-500 peer-checked:border-purple-600"
                            >
                                <div>
                                    <h3 className="font-semibold text-white">Insert</h3>
                                </div>
                            </label>
                        </div>

                        {/* Opção "Update" */}
                        <div>
                            <input type="radio" id="update" name="plan" className="hidden peer" onChange={() => setAction("update")}/>
                            <label 
                                htmlFor="update"
                                className="flex justify-between items-center p-5 bg-brand-card rounded-lg border-2 cursor-pointer transition-all duration-300 border-gray-600 hover:opacity-80 hover:shadow-lg hover:border-zinc-500 peer-checked:border-purple-600"
                            >
                                <div>
                                    <h3 className="font-semibold text-white">Update</h3>
                                </div>
                            </label>
                        </div>

                        {/* Opção "Delete" */}
                        <div>
                            <input type="radio" id="delete" name="plan" className="hidden peer" onChange={() => setAction("delete")}/>
                            <label 
                                htmlFor="delete"
                                className="flex justify-between items-center p-5 bg-brand-card rounded-lg border-2 cursor-pointer transition-all duration-300 border-gray-600 hover:opacity-80 hover:shadow-lg hover:border-zinc-500 peer-checked:border-purple-600"
                            >
                                <div>
                                    <h3 className="font-semibold text-white">Delete</h3>
                                </div>
                            </label>
                        </div>

                        {/* Opção "Select" */}
                        <div>
                            <input type="radio" id="Select" name="plan" className="hidden peer" onChange={() => setAction("select")}/>
                            <label 
                                htmlFor="Select"
                                className="flex justify-between items-center p-5 bg-brand-card rounded-lg border-2 cursor-pointer transition-all duration-300 border-gray-600 hover:opacity-80 hover:shadow-lg hover:border-zinc-500 peer-checked:border-purple-600"
                            >
                                <div>
                                    <h3 className="font-semibold text-white">Select</h3>
                                </div>
                            </label>
                        </div>
                    </div>
                    
                </div>


                {/* Interface de "Select"*/}
                {(action === "select" && table) && (
                    <div className="w-full p-2 sm:p-4 md:p-8 lg:p-12 overflow-x-auto">
                        <div className="bg-zinc-800 w-full rounded-2xl overflow-x-auto flex flex-col p-2 sm:p-6 md:p-10 lg:p-12 transition-all duration-300 hover:shadow-3xl hover:border-zinc-700 border border-zinc-800 shadow-2xl">
                            <span className="text-white font-semibold text-2xl sm:text-3xl md:text-4xl capitalize">{action} in Table {table}</span>
                            <div className="relative w-full mt-4 sm:mt-8 overflow-x-auto flex-1 flex flex-col"> 
                                <button onClick={showTable} className="bg-blue-500 text-white py-2 px-4 rounded cursor-pointer hover:bg-blue-600 transition-all duration-300 hover:opacity-90 hover:shadow-lg mb-4 self-start">
                                    {showTableData ? "Hide Query" : "Execute Query"}
                                </button>
                                {showTableData && (
                                    <div className="flex-1 w-full min-w-[320px] overflow-x-auto"> 
                                        <DataGrid
                                            rows={rows}
                                            columns={columns}
                                            pageSizeOptions={[10, 25, 50]}
                                            initialState={{
                                                pagination: {
                                                    paginationModel: { pageSize: 10 },
                                                },
                                            }}
                                            checkboxSelection
                                            disableRowSelectionOnClick
                                            autoHeight
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Interface de "Delete"*/}
                {action === "delete" && table && (
                    <div className="w-full p-2 sm:p-4 md:p-8 lg:p-12 overflow-x-auto">
                        <div className="bg-zinc-800 w-full rounded-2xl overflow-x-auto flex flex-col p-2 sm:p-6 md:p-10 lg:p-12 transition-all duration-300 hover:shadow-3xl hover:border-zinc-700 border border-zinc-800 shadow-2xl">
                            <span className="text-white font-semibold text-2xl sm:text-3xl md:text-4xl capitalize">{action} in Table {table}</span>
                            {message && (
                                <div className={`mt-6 mb-2 px-4 py-3 rounded-lg text-center font-semibold transition-all duration-300 ${messageType === "success" ? "bg-green-600 text-white" : "bg-red-600 text-white"}`}>
                                    {message}
                                </div>
                            )}
                            <form onSubmit={handleDelete} className="mt-8 flex flex-col gap-4">                                
                                <div className="relative w-full">
                                    <Tag className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none z-10" />
                                    <input
                                        type="number"
                                        value={deleteId}
                                        onChange={(e) => setDeleteId(e.target.value)}
                                        placeholder="Enter ID to delete"
                                        className="w-full bg-black border border-gray-700 text-gray-300 py-3.5 pl-12 pr-4 rounded-lg focus:outline-none placeholder:text-gray-500 hover:opacity-90 transition-all duration-300 hover:shadow-lg"
                                    />
                                </div>
                                <button type="submit" className="cursor-pointer bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-all duration-300 hover:opacity-90 hover:shadow-lg mt-2 w-full">
                                    Delete
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                {/* Interface de "Insert"*/}
                {action === "insert" && table && tableColumns.length > 0 && (
                    <div className="w-full p-2 sm:p-4 md:p-8 lg:p-12 overflow-x-auto">
                        {insertSuccess && (
                            <div className="fixed top-8 right-8 z-50 bg-green-600 text-white px-6 py-4 rounded-lg shadow-lg font-bold text-lg animate-fade-in-out">
                                Linha inserida com sucesso!
                            </div>
                        )}
                        <form onSubmit={insertRow}>
                            <div className="flex flex-wrap gap-2 sm:gap-4 p-4 sm:p-8 md:p-12 bg-zinc-800 rounded-2xl transition-all duration-300 hover:shadow-3xl hover:border-zinc-700 border border-zinc-800 shadow-2xl">
                                {tableColumns.filter((column) => column !== "id").map((column) => {
                                    const valueObj = tableColumnsInsertValue.find((col) => col.name === column);
                                    const isDateField = /date|data/i.test(column);
                                    const isNumberField = /capacidade/i.test(column);
                                    let inputValue = valueObj ? valueObj.value : "";
                                    if (isDateField && inputValue) {
                                        if (inputValue.includes("T")) {
                                            inputValue = inputValue.split("T")[0];
                                        }
                                    }
                                    return (
                                        <div key={column} className="mb-4 min-w-[180px] sm:min-w-[220px] flex-1">
                                            <label className="block text-base font-bold text-purple-400 mb-2 tracking-wide uppercase drop-shadow">{column.replace(/_/g, ' ')}</label>
                                            <div className="relative w-full">
                                                <Tag className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none z-10" />
                                                <input
                                                    type={isDateField ? "date" : isNumberField ? "number" : "text"}
                                                    placeholder={column}
                                                    value={inputValue}
                                                    onChange={(e) => handleInputChange(e, column)}
                                                    className="w-full bg-black border border-gray-700 text-gray-300 py-3.5 pl-12 pr-4 rounded-lg focus:outline-none placeholder:text-gray-500 hover:opacity-90 transition-all duration-300 hover:shadow-lg"
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                                <button type="submit" className="cursor-pointer bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-all duration-300 hover:opacity-90 hover:shadow-lg mt-2 w-full">
                                    Insert
                                </button>
                                <div className="w-full mt-8 bg-zinc-900 rounded-lg p-4 transition-all duration-300 hover:shadow-3xl hover:border-zinc-700 border border-zinc-800 shadow-2xl">
                                    <span className="text-purple-300 font-bold">Valores digitados:</span>
                                    <ul className="mt-2 text-white">
                                        {tableColumnsInsertValue.map((col) => (
                                            <li key={col.name}>
                                                <span className="font-semibold text-purple-400">{col.name}:</span> {col.value}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                            </div>
                        </form>
                    </div>
                )}

                {/* Interface de "Update"*/}
                {action === "update" && table && tableColumns.length > 0 && (
                    <div className="w-full p-2 sm:p-4 md:p-8 lg:p-12 overflow-x-auto">
                        {message && (
                            <div className={`fixed top-8 right-8 z-50 px-6 py-4 rounded-lg shadow-lg font-bold text-lg animate-fade-in-out ${messageType === "success" ? "bg-green-600 text-white" : "bg-red-600 text-white"}`}>
                                {message}
                            </div>
                        )}
                        <form onSubmit={handleChooseRow}>
                            <div className="flex flex-wrap gap-2 sm:gap-4 p-4 sm:p-8 items-end bg-zinc-800 rounded-2xl transition-all duration-300 hover:shadow-3xl hover:border-zinc-700 border border-zinc-800 shadow-2xl">
                                <div className="mb-4 min-w-[180px] sm:min-w-[220px] flex-1 flex flex-col sm:flex-row gap-2 sm:gap-4">
                                    <label className="block text-base font-bold text-purple-400 mb-2 tracking-wide uppercase drop-shadow">ID do registro</label>
                                    <div className="relative w-full">
                                        <Tag className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none z-10" />
                                        <input
                                            type="number"
                                            placeholder="ID"
                                            value={updateId}
                                            onChange={(e) => setUpdateId(e.target.value)}
                                            className="w-full bg-black border border-gray-700 text-gray-300 py-3.5 pl-12 pr-4 rounded-lg focus:outline-none placeholder:text-gray-500 hover:opacity-90 transition-all duration-300 hover:shadow-lg"
                                            required
                                        />
                                    </div>
                                    <button type="submit" className="cursor-pointer bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-all duration-300 hover:opacity-90 hover:shadow-lg min-w-[120px] sm:min-w-[180px] mt-2 sm:mt-0">
                                        Escolher Linha
                                    </button>
                                </div>
                            </div>
                        </form>
                        {updateFieldsVisible && (
                            <form onSubmit={updateRow}>
                                <div className="flex flex-wrap gap-2 sm:gap-4 p-4 sm:p-8">
                                    {tableColumns.filter((column) => column !== "id").map((column) => {
                                        const valueObj = tableColumnsInsertValue.find((col) => col.name === column);
                                        const isDateField = /date|data/i.test(column);
                                        const isNumberField = /capacidade/i.test(column);
                                        let inputValue = valueObj ? valueObj.value : "";
                                        if (isDateField && inputValue) {
                                            if (inputValue.includes("T")) {
                                                inputValue = inputValue.split("T")[0];
                                            }
                                        }
                                        return (
                                            <div key={column} className="mb-4 min-w-[180px] sm:min-w-[220px] flex-1">
                                                <label className="block text-base font-bold text-purple-400 mb-2 tracking-wide uppercase drop-shadow">{column.replace(/_/g, ' ')}</label>
                                                <div className="relative w-full">
                                                    <Tag className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none z-10" />
                                                    <input
                                                        type={isDateField ? "date" : isNumberField ? "number" : "text"}
                                                        placeholder={column}
                                                        value={inputValue}
                                                        onChange={(e) => handleInputChange(e, column)}
                                                        className="w-full bg-black border border-gray-700 text-gray-300 py-3.5 pl-12 pr-4 rounded-lg focus:outline-none placeholder:text-gray-500 hover:opacity-90 transition-all duration-300 hover:shadow-lg"
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                                    <button type="submit" className="cursor-pointer bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-600 transition-all duration-300 hover:opacity-90 hover:shadow-lg mt-2 w-full">
                                        Update
                                    </button>
                                    <div className="w-full mt-8 bg-zinc-900 rounded-lg p-4 transition-all duration-300 hover:shadow-3xl hover:border-zinc-700 border border-zinc-800 shadow-2xl">
                                        <span className="text-purple-300 font-bold">Valores digitados:</span>
                                        <ul className="mt-2 text-white">
                                            {tableColumnsInsertValue.map((col) => (
                                                <li key={col.name}>
                                                    <span className="font-semibold text-purple-400">{col.name}:</span> {col.value}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </form>
                        )}
                    </div>
                )}
            </div>
        </ThemeProvider>
    );
}

export default Admin;
