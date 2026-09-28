import { Container } from "@/components/container";
import { getServerSession } from 'next-auth'
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from 'next/link'
import { CardCustomer } from "./components/card";
import prismaClient from '@/lib/prisma'

export default async function Customer() {
    const session = await getServerSession(authOptions)

    console.log(session)
    if (!session || !session.user) {
        redirect("/")
    }

    const customers = await prismaClient.customer.findMany({
        where:{
            userId: session.user.id
        }
    })
    console.log(customers)

    return (
        <Container>
            <main className="mt-9 mb-2">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold">Meus clientes</h1>
                    <Link href="/dashboard/customer/new" className="bg-blue-500 text-white px-4 py-1 rounded">
                        Novo cliente
                    </Link>
                </div>
                <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mt-2">
                    {customers.map(customer => (
                        <CardCustomer customer={customer} key={customer.id}/>
                    ))}
                    
                </section>

                {customers.length === 0 && (
                    <h1 className="text-gray-600">Voce ainda não possui cliente</h1>
                )}
            </main>
        </Container>
    )
}