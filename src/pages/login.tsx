import type { NextPage } from "next";
import Link from "next/link";

const Login: NextPage = () => {
  return (
    <div>
      <main className="mx-auto mt-20 space-x-10 max-w-4xl">
        <Link href="http://localhost:3000/api/v1/auth/login">
          <a>Login</a>
        </Link>
        <Link href="http://localhost:3000/api/v1/auth/logout">
          <a>Logout</a>
        </Link>
      </main>
    </div>
  );
};

export default Login;
