import { Button } from '@/components/ui/button';
import useAuthStore from '@/store/useAuthStore';
import { ShieldX } from 'lucide-react';
import { useNavigate } from 'react-router';

export default function AccessDenied() {
    const { logout } = useAuthStore();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            <div className="text-center max-w-md p-8 bg-white rounded-2xl shadow-2xl border border-slate-200">
                <div className="mb-6">
                    <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                        <ShieldX className="w-12 h-12 text-red-600" />
                    </div>
                </div>

                <h1 className="text-3xl font-bold text-gray-900 mb-3">
                    Acceso Denegado
                </h1>

                <p className="text-gray-600 mb-6 leading-relaxed">
                    Solo los administradores pueden acceder al panel de control.
                    Por favor, inicia sesión con una cuenta de administrador.
                </p>

                <Button
                    onClick={handleLogout}
                    className="w-full"
                    variant="destructive"
                    size="lg"
                >
                    Cerrar Sesión
                </Button>
            </div>
        </div>
    );
}
