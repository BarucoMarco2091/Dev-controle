import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prismaClient from '@/lib/prisma'

// criar rota backend pra atualizar o chamado
//patch: atualizar pedaço da rota  
export async function PATCH(request: Request) {
    const session = await getServerSession(authOptions)

    if(!session || !session.user) {
        return NextResponse.json({ error: "Not authorized" }, { status: 401 })
    }

    // mandar o id do chamado pra saber onde clicou
    const { id } = await request.json()

    // buscar ticket 
    const findTicket = await prismaClient.ticket.findFirst({
        where:{
            id: id as string
        }
    })

    if(!findTicket){
        return NextResponse.json({ error: "failed update ticket" }, { status: 400 })
    }
    // atualizar 
    try{
        await prismaClient.ticket.update({
            where:{
                id: id as string
            },
            data:{
                status: "fechado"
            }
        })

        return NextResponse.json({ message: "chamado atualizado " })
    }catch(err){
        return NextResponse.json({ error: "failed update ticket" }, { status: 400 })
    }
}