import { act, useEffect, useState } from "react";
import { Database, Tag } from "lucide-react";
import axios from "axios";

// 1. IMPORTE A DATAGRID E OS ITENS DO TEMA
import { DataGrid } from '@mui/x-data-grid';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from "@mui/material";

// 2. CRIE UM TEMA ESCURO PARA A MUI
// Isso fará a tabela combinar com o seu layout escuro
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
    const [messageType, setMessageType] = useState(""); // 'success' ou 'error'
    const [insertSuccess, setInsertSuccess] = useState(false);
    // Estados para os dados da tabela em caso de Select
    const [rows, setRows] = useState([]);
    const [columns, setColumns] = useState([]);
    const [tableColumns, setTableColumns] = useState([]);
    const [tableColumnsInsertValue, setTableColumnsInsertValue] = useState([]);
    // Estado para o ID do update
    const [updateId, setUpdateId] = useState("");
    const [originalDataUpdate, setOriginalDataUpdate] = useState(null);
    const [updateFieldsVisible, setUpdateFieldsVisible] = useState(false);
    // Função para buscar dados do registro a ser atualizado
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
            const res = await axios.get(`http://localhost:8080/${table}/${updateId}`);
            setOriginalDataUpdate(res.data);
            // Preenche os campos editáveis com os valores atuais
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

    // Função para atualizar um registro
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
        // Começa com os dados originais
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
        if (window.confirm("Deseja realmente atualizar este registro?")) {
            axios.put(`http://localhost:8080/${table}/${updateId}`, rowData)
                .then((response) => {
                    setMessage("Registro atualizado com sucesso!");
                    setMessageType("success");
                    setTimeout(() => {
                        setMessage("");
                        setMessageType("");
                    }, 4000);
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

    function fetchTables() {
        axios.get("http://localhost:8080/admin/tables")
            .then((response) => setTables(response.data))
            .catch((error) => console.error("Error fetching tables:", error));
    }

    // Função para formatar os dados para a DataGrid
    function formatDataForGrid(data) {
        if (!data || data.length === 0) {
            setColumns([]);
            setRows([]);
            return;
        }

        const firstItemKeys = Object.keys(data[0]);
        const gridColumns = firstItemKeys.map((key) => ({
            field: key,
            headerName: key.replace(/_/g, ' ').toUpperCase(),
            width: 150,
            flex: 1,
        }));
        
        const gridRows = data.map((row, index) => ({
            ...row,
            id: row.id !== undefined ? row.id : index, // Garante um ID único
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
                    // 3. Formate os dados recebidos
                    formatDataForGrid(response.data);
                })
                .catch((error) => {
                    console.error("Error fetching table data:", error);
                    formatDataForGrid([]); // Limpa em caso de erro
                });
        }
    }

    useEffect(() => {
        fetchTables();
    }, []);

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

    // Atualiza o valor do input correspondente à coluna
    function handleInputChange(e, columnName) {
        const value = e.target.value;
        setTableColumnsInsertValue((prev) => {
            // Se já existe, atualiza; se não, adiciona
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

    const [jsonPreview, setJsonPreview] = useState(null);

    // Função para converter snake_case ou outros formatos para camelCase
    function toCamelCase(str) {
        return str.replace(/_([a-z])/g, (g) => g[1].toUpperCase())
                  .replace(/^([A-Z])/, (g) => g.toLowerCase())
                  .replace(/^([a-z])/, (g) => g.toLowerCase())
                  .replace(/(^|_)([a-z])/g, (match, p1, p2, offset) => offset === 0 ? p2.toLowerCase() : p2.toUpperCase());
    }

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

        setJsonPreview(rowData); // Mostra o JSON na tela

        // Só envia para o backend após confirmação do usuário
        if (window.confirm("Deseja realmente inserir este registro? Veja o JSON na tela.")) {
            axios.post(`http://localhost:8080/${table}`, rowData)
                .then((response) => {
                    setInsertSuccess(true);
                    setTimeout(() => setInsertSuccess(false), 4000);
                    setTableColumnsInsertValue([]);
                    setJsonPreview(null);
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

    // Sempre que trocar de ação, reseta os estados relevantes
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
        // 4. APLIQUE O TEMA DA MUI NO SEU COMPONENTE
        <ThemeProvider theme={darkTheme}>
            <CssBaseline /> {/* Reseta o CSS para o tema dark funcionar bem */}
            <div className="flex flex-col lg:flex-row bg-black min-h-screen w-full">
                {/* --- SUA SIDEBAR (SEM MUDANÇAS) --- */}
                <div className="bg-zinc-800 min-h-[320px] lg:h-screen lg:border-r-[0.2px] border-zinc-700 border-opacity-40 lg:justify-center lg:items-center py-10 lg:py-0 flex flex-col w-full max-w-full lg:max-w-[600px] flex-shrink-0 min-w-0 gap-4">
                    <h1 className="font-semibold text-white px-4 text-2xl text-center">
                        Goalytics<br />Administrador page
                    </h1>
                    <div className="relative w-full px-4 sm:px-8">
                        <Database className="absolute left-12 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none z-10" />
                        <select 
                            required
                            value={table}
                            className="w-full appearance-none bg-black border border-gray-700 text-gray-300 py-3.5 pl-12 pr-12 rounded-lg focus:outline-none invalid:text-gray-500 hover:opacity-90 transition-all cursor-pointer"
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
                                className="flex justify-between items-center p-5 bg-brand-card rounded-lg border-2 cursor-pointer transition-colors border-gray-600 hover:opacity-80 peer-checked:border-purple-600"
                            >
                                <div>
                                    <h3 className="font-semibold text-white">Insert</h3>
                                </div>
                            </label>
                        </div>

                        <div>
                            <input type="radio" id="update" name="plan" className="hidden peer" onChange={() => setAction("update")}/>
                            <label 
                                htmlFor="update"
                                className="flex justify-between items-center p-5 bg-brand-card rounded-lg border-2 cursor-pointer transition-colors border-gray-600 hover:opacity-80 peer-checked:border-purple-600"
                            >
                                <div>
                                    <h3 className="font-semibold text-white">Update</h3>
                                </div>
                            </label>
                        </div>

                        <div>
                            <input type="radio" id="delete" name="plan" className="hidden peer" onChange={() => setAction("delete")}/>
                            <label 
                                htmlFor="delete"
                                className="flex justify-between items-center p-5 bg-brand-card rounded-lg border-2 cursor-pointer transition-colors border-gray-600 hover:opacity-80 peer-checked:border-purple-600"
                            >
                                <div>
                                    <h3 className="font-semibold text-white">Delete</h3>
                                </div>
                            </label>
                        </div>

                        <div>
                            <input type="radio" id="Select" name="plan" className="hidden peer" onChange={() => setAction("select")}/>
                            <label 
                                htmlFor="Select"
                                className="flex justify-between items-center p-5 bg-brand-card rounded-lg border-2 cursor-pointer transition-colors border-gray-600 hover:opacity-80 peer-checked:border-purple-600"
                            >
                                <div>
                                    <h3 className="font-semibold text-white">Select</h3>
                                </div>
                            </label>
                        </div>
                    </div>
                    
                </div>


                {(action === "select" && table) && (
                    <div className="w-full p-2 sm:p-4 md:p-8 lg:p-12 overflow-x-auto">
                        <div className="bg-zinc-800 w-full rounded-2xl overflow-x-auto flex flex-col p-2 sm:p-6 md:p-10 lg:p-12">
                            <span className="text-white font-semibold text-2xl sm:text-3xl md:text-4xl capitalize">{action} in Table {table}</span>
                            {/* 5. Wrapper para o botão e a tabela */}
                            <div className="relative w-full mt-4 sm:mt-8 overflow-x-auto flex-1 flex flex-col"> 
                                <button onClick={showTable} className="bg-blue-500 text-white py-2 px-4 rounded cursor-pointer hover:bg-blue-600 mb-4 self-start">
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

                {action === "delete" && table && (
                    <div className="w-full p-2 sm:p-4 md:p-8 lg:p-12 overflow-x-auto">
                        <div className="bg-zinc-800 w-full rounded-2xl overflow-x-auto flex flex-col p-2 sm:p-6 md:p-10 lg:p-12">
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
                                        className="w-full bg-black border border-gray-700 text-gray-300 py-3.5 pl-12 pr-4 rounded-lg focus:outline-none placeholder:text-gray-500 hover:opacity-90 transition-all"
                                    />
                                </div>
                                <button type="submit" className="cursor-pointer bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-all mt-2 w-full">
                                    Delete
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                {action === "insert" && table && tableColumns.length > 0 && (
                    <div className="w-full p-2 sm:p-4 md:p-8 lg:p-12 overflow-x-auto">
                        {/* Popup de sucesso */}
                        {insertSuccess && (
                            <div className="fixed top-8 right-8 z-50 bg-green-600 text-white px-6 py-4 rounded-lg shadow-lg font-bold text-lg animate-fade-in-out">
                                Linha inserida com sucesso!
                            </div>
                        )}
                        <form onSubmit={insertRow}>
                            <div className="flex flex-wrap gap-2 sm:gap-4 p-4 sm:p-8 md:p-12">
                                {tableColumns.filter((column) => column !== "id").map((column) => {
                                    const valueObj = tableColumnsInsertValue.find((col) => col.name === column);
                                    const isDateField = /date|data/i.test(column);
                                    const isNumberField = /capacidade/i.test(column);
                                    let inputValue = valueObj ? valueObj.value : "";
                                    if (isDateField && inputValue) {
                                        // Se vier em formato ISO, corta só a data
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
                                                    className="w-full bg-black border border-gray-700 text-gray-300 py-3.5 pl-12 pr-4 rounded-lg focus:outline-none placeholder:text-gray-500 hover:opacity-90 transition-all"
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                                <button type="submit" className="cursor-pointer bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-all mt-2 w-full">
                                    Insert
                                </button>
                                {/* Exibe os valores digitados de forma legível */}
                                <div className="w-full mt-8 bg-zinc-900 rounded-lg p-4">
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

                {action === "update" && table && tableColumns.length > 0 && (
                    <div className="w-full p-2 sm:p-4 md:p-8 lg:p-12 overflow-x-auto">
                        {message && (
                            <div className={`fixed top-8 right-8 z-50 px-6 py-4 rounded-lg shadow-lg font-bold text-lg animate-fade-in-out ${messageType === "success" ? "bg-green-600 text-white" : "bg-red-600 text-white"}`}>
                                {message}
                            </div>
                        )}
                        {/* Passo 1: pedir ID e botão Escolher Linha */}
                        <form onSubmit={handleChooseRow}>
                            <div className="flex flex-wrap gap-2 sm:gap-4 p-4 sm:p-8 items-end">
                                <div className="mb-4 min-w-[180px] sm:min-w-[220px] flex-1 flex flex-col sm:flex-row gap-2 sm:gap-4">
                                    <label className="block text-base font-bold text-purple-400 mb-2 tracking-wide uppercase drop-shadow">ID do registro</label>
                                    <div className="relative w-full">
                                        <Tag className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none z-10" />
                                        <input
                                            type="number"
                                            placeholder="ID"
                                            value={updateId}
                                            onChange={(e) => setUpdateId(e.target.value)}
                                            className="w-full bg-black border border-gray-700 text-gray-300 py-3.5 pl-12 pr-4 rounded-lg focus:outline-none placeholder:text-gray-500 hover:opacity-90 transition-all"
                                            required
                                        />
                                    </div>
                                    <button type="submit" className="cursor-pointer bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-all min-w-[120px] sm:min-w-[180px] mt-2 sm:mt-0">
                                        Escolher Linha
                                    </button>
                                </div>
                            </div>
                        </form>
                        {/* Passo 2: se linha escolhida, mostra campos preenchidos */}
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
                                                        className="w-full bg-black border border-gray-700 text-gray-300 py-3.5 pl-12 pr-4 rounded-lg focus:outline-none placeholder:text-gray-500 hover:opacity-90 transition-all"
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                                    <button type="submit" className="cursor-pointer bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-600 transition-all mt-2 w-full">
                                        Update
                                    </button>
                                    {/* Exibe os valores digitados de forma legível */}
                                    <div className="w-full mt-8 bg-zinc-900 rounded-lg p-4">
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