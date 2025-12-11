import SignUpForm from "@/components/common/pages/auth/SignUpForm";
import React from "react";

const SignUpPage = () => {
  return (
    <div className="p-5 md:p-10">
      <div className="max-w-4xl mx-auto bg-babyshopWhite p-5 md:p-10 flex flex-col items-center rounded-md border shadow">
        <div className="text-center">
          <h3 className="text-2xl font-semibold mb-1">Registrarse</h3>
          <p>
            Registra tu correo electrónico para acceder a{" "}
            <span className="text-babyshopSky font-medium">Tienda L&V</span>
          </p>
        </div>
        <SignUpForm />
      </div>
    </div>
  );
};

export default SignUpPage;
