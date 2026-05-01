import { createContext, useContext, useState } from "react"

const AdminSearchContext = createContext();

export const AdminSearchProvider = ({ children }) => {
    const [search, setSearch] = useState("");

    return (
        <AdminSearchContext.Provider value={{ search, setSearch }}>
            {children}
        </AdminSearchContext.Provider>
    );
};

export const useAdminSearch = () => useContext(AdminSearchContext);