import { Sidebar } from "@/app/Components";

export default function PerfilLayout({ children }) {
    return (
        <div className="flex h-[90vh] gap-8">
            <Sidebar />
            {children}
        </div>
    )
}