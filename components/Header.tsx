import Link from "next/link";
import Image from "next/image";
import NavItems from "@/components/NavItems";
import UserDropdown from "@/components/UserDropdown";
import { searchStocks } from "@/lib/actions/finnhub.actions";

const Header = async ({ user }: { user: User }) => {
    const initialStocks = await searchStocks();

    return (
        <header className="sticky top-0 z-50 w-full h-[70px] bg-gray-800 border-b border-gray-700">
            <div className="container flex items-center justify-between h-full px-6">
                {/* Left: Logo */}
                <div className="flex-1 flex justify-start">
                    <Link href="/" className="flex items-center gap-2">
                        <Image src="/assets/icons/logo.svg" alt="FinSight logo" width={32} height={32} className="h-8 w-auto" />
                    </Link>
                </div>

                {/* Center: Navigation */}
                <nav className="hidden md:flex flex-1 justify-center">
                    <NavItems initialStocks={initialStocks} />
                </nav>

                {/* Right: User Profile */}
                <div className="flex-1 flex justify-end">
                    <UserDropdown user={user} initialStocks={initialStocks} />
                </div>
            </div>
        </header>
    )
}
export default Header
