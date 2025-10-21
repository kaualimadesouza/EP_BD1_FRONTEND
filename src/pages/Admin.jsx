import { useState } from "react";
import { Database, Tag } from "lucide-react";

function Admin() {
    const [table, setTable] = useState("");
    const [action, setAction] = useState("insert");

    return (
        <div className="flex bg-black h-screen">
            <div className="bg-zinc-800 h-screen lg:border-r-[0.2px] border-zinc-700 border-opacity-40 lg:justify-center lg:items-center py-20 lg:py-0 flex flex-col w-[600px] flex-shrink-0 min-w-[550px] gap-4">
                <h1 className="font-semibold text-white px-4 text-2xl text-center">
                    Goalytics<br />Administrador page
                </h1>
                <div className="relative w-full px-8">
                    <Database className="absolute left-12 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none z-10" />
                    <select 
                        required
                        value={table}
                        className="w-full appearance-none bg-black border border-gray-700 text-gray-300 py-3.5 pl-12 pr-12 rounded-lg focus:outline-none invalid:text-gray-500 hover:opacity-90 transition-all cursor-pointer"
                        onChange={(e) => setTable(e.target.value)}
                    >
                        <option value="" disabled>Selecione a Tabela</option>
                        <option value="tabela1">Jogadores</option>
                        <option value="tabela2">Times</option>
                        <option value="tabela3">Partidas</option>
                    </select>
                </div>

                <div className="space-y-4 w-full px-8">
                    <div>
                        <input 
                            type="radio" 
                            id="insert" 
                            name="plan" 
                            className="hidden peer" 
                            defaultChecked 
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

            {(action && table) && (
                <div className="w-full p-12">
                    <div className="p-12 bg-zinc-800 h-full w-full rounded-2xl">
                        <span className="text-white font-semibold text-4xl capitalize">{action} in Table {table}</span>
                        <div className="relative w-full mt-8">
                            <Tag className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none z-10" />
                            <input 
                                type="text"
                                placeholder="Digite aqui..."
                                className="w-full bg-black border border-gray-700 text-gray-300 py-3.5 pl-12 pr-4 rounded-lg focus:outline-none placeholder:text-gray-500 hover:opacity-90 transition-all"
                            />
                        </div>
                    </div>
                </div>
            )}

            
        </div>
    );
}

export default Admin; 