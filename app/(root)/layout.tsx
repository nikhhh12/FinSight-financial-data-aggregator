import Header from "@/components/Header";
import { auth } from "@/lib/better-auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createHash } from 'crypto';

const Layout = async ({ children }: { children: React.ReactNode }) => {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user) redirect('/sign-in');

    const userImage = session.user.image || `https://www.gravatar.com/avatar/${createHash('md5').update(session.user.email.toLowerCase().trim()).digest('hex')}?d=mp`;

    const user = {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        image: userImage,
    }

    return (
        <main className="min-h-screen text-gray-400">
            <Header user={user} />

            <div className="container py-10">
                {children}
            </div>
        </main>
    )
}
export default Layout
