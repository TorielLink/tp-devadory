import Login from "@/app/auth/login/page";
import Register from "@/app/auth/register/page";

export default function Home() {
    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
            <div className="max-w-5xl w-full space-x-8 flex flex-wrap justify-center gap-x-8">
                <div className="w-full h-full md:w-1/2 lg:w-1/3 p-4">
                    <Register />
                </div>
                <div className="w-full h-full md:w-1/2 lg:w-1/3 p-4">
                    <Login />
                </div>
            </div>
        </div>
    );
}
