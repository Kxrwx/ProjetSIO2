
import ButtonLogout from "../components/Logout";

export default function Navigation() {
    return (
   <nav className="flex justify-between items-center px-8 py-4 bg-white shadow-lg shadow-blue-300">
        <a className="text-black hover:text-blue-500 " href="/infoadminaccount">Dashboard Admin</a>
        <ButtonLogout/>
      </nav>
    )
};
