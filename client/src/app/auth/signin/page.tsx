import SignInForm from "@/components/common/pages/auth/SignInForm";
import React from "react";

const SignInPage = () => {
  return (
    <div className="p-5 md:p-10">
      <div className="max-w-4xl mx-auto bg-tiendaLVLight p-5 md:p-10 flex flex-col items-center rounded-md border shadow">
        <div className="text-center">
          <h3 className="text-3xl font-semibold mb-1">Iniciar sesión</h3>
          <p>
            Inicia sesión para acceder a{" "}
            <span className="text-tiendaLVPrimary font-medium">Tienda L&V</span>
          </p>
        </div>
        <SignInForm />
      </div>
    </div>
  );
};

export default SignInPage;
