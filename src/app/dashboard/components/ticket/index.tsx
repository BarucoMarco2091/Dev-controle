"use client"

import { CustomerProps } from "@/utils/customer.type";
import { TicketProps } from "@/utils/ticket.type"
import { FiCheckSquare, FiFile } from "react-icons/fi"
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";

interface TicketItemProps{
    ticket: TicketProps;
    customer: CustomerProps | null
}

export function TicketItem({ customer, ticket }: TicketItemProps) {
    const router = useRouter()

    async function handleChangeStatus() {
        try{
            const response = await api.patch("/api/ticket", {
                id: ticket.id,
            })
            router.refresh()
        }catch(err){
            console.log(err)
        }
    }

    return(
        <>
            <tr className="border-b-2 border-b-slate-200 h-16 last:border-b-0 bg-slate-100 hover:bg-gray-200 duration-200">
                <td className="text-left pl-1">
                    {customer?.name}
                </td>
                <td className="text-left hidden sm:table-cell">
                    {ticket.created_at?.toLocaleDateString("pt-br")}
                </td>
                <td className="text-left">
                    <span className="bg-green-500 px-2 py-1 rounded">{ticket.status}</span>
                </td>
                <td className="text-left">
                    <button className="mr-2" onClick={handleChangeStatus}>
                        <FiCheckSquare size={24} color="#131313"/>
                    </button>
                    <button>
                        <FiFile size={24} color="#3b82f6"/>
                    </button>
                </td>
            </tr>
        </>
    )
}