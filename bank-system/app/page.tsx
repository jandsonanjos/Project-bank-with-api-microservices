export default function Home() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-6">
      <div className="w-full max-w-3xl bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-12 flex flex-col items-center gap-10">

        {/* Logo / Marca */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white tracking-tight">
            JAND Bank
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Simples. Seguro. Confiável.
          </p>
        </div>

        {/* Sessão principal */}
        <div className="text-center max-w-lg flex flex-col gap-4">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Bem-vindo ao seu novo banco digital
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Gerencie sua conta, faça depósitos, transferências e acompanhe suas transações com facilidade.
          </p>
        </div>

        {/* Botões */}
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
          <a
            href="/login"
            className="flex-1 h-12 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center font-medium transition"
          >
            Entrar
          </a>

          <a
            href="/register"
            className="flex-1 h-12 rounded-full border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition flex items-center justify-center font-medium"
          >
            Criar Conta
          </a>
        </div>
      </div>
    </div>
  );
}
