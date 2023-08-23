import { useUser } from "@supabase/auth-helpers-react";
import Link from "next/link";

export default function Navbar(){
  const user = useUser();
    return (
        <div>
                    <nav className="shadow p-4 flex flex-row justify-between">
          <div className="text-xl font-bold">#Nixie</div>
          <div>
            {user?<Link href={"/logout"}>LogOut</Link>:<Link href={"/login"}>LogIn</Link>}
          </div>
        </nav>
        </div>
    );
}