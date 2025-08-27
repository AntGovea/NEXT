import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const signInEmailPassword = async (email: string, password: string) => {
    console.log('signInEmailPassword')
    console.log(email)
    console.log(password)
    if (!email || !password) return null;

    console.log('tenemos valores')
    const user = await prisma.user.findUnique({ where: { email } });

    console.log(`usuario encontrado`, user)

    if (!user) {
        console.log('usuario no existente')

        const dbUser = await createUser(email, password);

        console.log('usuario nuevo creado')
        console.log(dbUser)
        return dbUser;
    }

    if (!bcrypt.compareSync(password, password ?? '')) {
        return null;
    }
    console.log('todo correcto , validacion aceptada')
    return user;
}






const createUser = async (email: string, password: string) => {
    const user = await prisma.user.create({
        data: {
            email: email,
            password: bcrypt.hashSync(password),
            name: email.split('@')[0],

        }
    })
    return user;
}