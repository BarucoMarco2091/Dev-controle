// rota backend -> sempre parte do /api
import { NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import prismaClient from '@/lib/prisma'
import { error } from 'console'

// listar clientes 
export async function GET(request: Request) {
    // receber email através do parametro da rota
    const { searchParams } = new URL(request.url)
    const customerEmail = searchParams.get("email")

    // validação 
    if (!customerEmail || customerEmail === "") {
        return NextResponse.json({ error: "Customer not found" }, { status: 400 })
    }

    try {
        const customer = await prismaClient.customer.findFirst({
            where: {
                email: customerEmail
            }
        })

        return NextResponse.json(customer)
    } catch (err) {
        return NextResponse.json({ error: "Customer not found" }, { status: 400 })
    }

    return NextResponse.json({ message: "Recebido" })
}

// fazer requisição http para deletar passando o id
export async function DELETE(request: Request) {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
        return NextResponse.json({ error: "not authorized" }, { status: 401 })
    }

    // pegar o parametro da rota
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("id")
    console.log(userId)

    if (!userId) {
        return NextResponse.json({ error: "failed delete customer" }, { status: 400 })
    }

    // impedir que delete cliente com chamado aberto 
    const findTickets = await prismaClient.ticket.findFirst({
        where: {
            customerId: userId
        }
    })

    if (findTickets) {
        return NextResponse.json({ error: "failed delete customer" }, { status: 400 })
    }

    try {
        await prismaClient.customer.delete({
            where: {
                id: userId as string
            }
        })
        return NextResponse.json({ message: "Cliente deletado " })
    } catch (err) {
        console.log(err)
        return NextResponse.json({ error: "failed delete customer" }, { status: 400 })
    }
}

// POST: rota para cadastrar no backend
// rota do tipo post precisa do insonia para testar 
export async function POST(request: Request) {
    // verificar se está logado
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
        return NextResponse.json({ error: "not authorized" }, { status: 401 })
    }

    const { name, email, phone, address, userId } = await request.json()

    // cadastrar no banco de dados
    try {
        // fazer requisição 
        // prismaClient.model.criarnovoregistro
        await prismaClient.customer.create({
            // propriedade data obrigatório pelo prisma
            data: {
                // como os 2 name sao = posso passar o nome da propriedade
                name,
                phone,
                email,
                address: address ? address : "",
                userId: userId
            }
        })
        return NextResponse.json({ message: "cliente cadastrado" })
    } catch (err) {
        return NextResponse.json({ error: "failed" }, { status: 400 })
    }


}