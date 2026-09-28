"use client"

import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/input'
import { api } from '@/lib/api'
import { useRouter } from 'next/navigation'

const schema = z.object({
    name: z.string().min(1, "o campo nome é obrigatório"),
    email: z.string().email("digite um email valido").min(1, "o email é obrigatorio"),
    phone: z.string().refine((value) => {
        return /^(?:\(\d{2}\)\s?)?\d{9}$/.test(value) || /^\d{2}\s\d{9}$/.test(value) || /^\d{11}$/.test(value)
    }, {
        message: "o telefone deve estar (DD) 999999999"
    }),
    address: z.string(),
})

type FormData = z.infer<typeof schema>

export function NewCustomerForm({ userId }: { userId: string }) {
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema)
    })

    const router = useRouter()

    // fazer requisição 
    async function handleRegisterCustomer(data: FormData) {
        // post: cadastrar 
        await api.post("/api/customer", {
            // mandar o json
            name: data.name,
            phone: data.phone,
            email: data.email,
            address: data.address,
            userId: userId
        })

        router.refresh()
        router.replace("/dashboard/customer")
    }

    return (
        <form className='flex flex-col mt-6' onSubmit={handleSubmit(handleRegisterCustomer)}>
            <label className='mb-1 text-lg font-medium'>nome completo</label>
            <Input
                type='text'
                name='name'
                placeholder='Digite o nome completo'
                error={errors.name?.message}
                register={register}
            />

            <div className='flex gap-2 my-2 flex-col sm:flex-row'>
                <div className='flex-1'>
                    <label className='mb-1 text-lg font-medium'>Telefone</label>
                    <Input
                        type='number'
                        name='phone'
                        placeholder='Exemplo (DD) 999101900'
                        error={errors.phone?.message}
                        register={register}
                    />
                </div>

                <div className='flex-1'>
                    <label className='mb-1 text-lg font-medium'>Email</label>
                    <Input
                        type='email'
                        name='email'
                        placeholder='Digite o email'
                        error={errors.email?.message}
                        register={register}
                    />
                </div>
            </div>

            <label className='mb-1 text-lg font-medium'>Endereço completo</label>
            <Input
                type='text'
                name='address'
                placeholder='Digite o endereço do cliente...'
                error={errors.address?.message}
                register={register}
            />

            <button type="submit" className='bg-blue-500 my-4 px-2 h-11 rounded text-white font-bold'>Cadastrar</button>
        </form>
    )
}