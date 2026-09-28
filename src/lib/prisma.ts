// faz conexão do prisma com o banco de dados pra fazer query
import { PrismaClient } from "@prisma/client";

let prisma: PrismaClient;
// saber se o prisma está em ambiente de produção ou desenvolvimento
// pra saber como ele vai instanciar  a conexão com o banco 
if(process.env.NODE_ENV === "production"){
    // inicializar novo prisma
    prisma = new PrismaClient()
    // se não estiver em produção 
}else{
    // dizer o tipo do global
    let globalWithPrisma = global as typeof globalThis & {
        prisma: PrismaClient;
    }

    if(!globalWithPrisma.prisma){
        // inicializar nova conexão 
        globalWithPrisma.prisma = new PrismaClient()
    }

    prisma = globalWithPrisma.prisma
}

// quando acessamos a variável prisma estamos instanciado uma nova conexão com o prismaClient
export default prisma

// quando usamos esse arquivo estamos comunicando com o backend que está comunicado com o banco de dados 