"use client";

import { useEffect, useState } from "react";
import { getTransactions, getAccount } from "@/src/lib/api";
import { useRouter } from "next/navigation";

export default function TransactionsPage() {
  const router = useRouter();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [account, setAccount] = useState<any>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) return router.replace("/login");

    let mounted = true;
    async function load() {
      const acc = await getAccount();
      if (!mounted) return;
      if (!acc || acc.error) {
        router.replace("/login");
        return;
      }
      setAccount(acc);

      const res = await getTransactions();
      if (!mounted) return;
      if (res.error) {
        setFeedback(res.error);
        router.replace("/login");
        return;
      }
      setTransactions(res);
      setLoading(false);
    }

    load();
    return () => { mounted = false; };
  }, [router]);

  function fmtBRL(value: number) {
    return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <header className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">ST</div>
            <div>
              <div className="text-lg font-semibold text-gray-900 dark:text-white">STY Bank</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Extrato de transações</div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm font-medium text-gray-900 dark:text-white">{account?.user?.name || account?.user?.email || 'Usuário'}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Conta: {account?.accountNumber}</div>
            </div>
            <button className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-700 rounded" onClick={()=>{ localStorage.removeItem('token'); router.push('/login'); }}>Sair</button>
          </div>
        </header>

        {feedback && <div className="mb-4 p-3 rounded bg-yellow-100 text-yellow-800">{feedback}</div>}

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-800 dark:text-gray-100">Últimas transações</h2>
            <div className="text-sm text-gray-500 dark:text-gray-400">Total: {transactions.length}</div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left table-auto">
              <thead>
                <tr className="text-sm text-gray-500 dark:text-gray-400">
                  <th className="py-2 pr-4">Data</th>
                  <th className="py-2 pr-4">Descrição</th>
                  <th className="py-2 pr-4">Tipo</th>
                  <th className="py-2 pr-4 text-right">Valor</th>
                  <th className="py-2 pr-4">Conta origem</th>
                  <th className="py-2 pr-4">Conta destino</th>
                </tr>
              </thead>
              <tbody>
                {transactions.length > 0 ? (
                  transactions.map((t:any) => (
                    <tr key={t._id} className="border-t border-gray-100 dark:border-gray-700">
                      <td className="py-3 text-sm text-gray-600 dark:text-gray-300">{new Date(t.createdAt).toLocaleString()}</td>
                      <td className="py-3 text-sm text-gray-700 dark:text-gray-100">{t.description || t.type}</td>
                      <td className="py-3 text-sm text-gray-600 dark:text-gray-300">{t.type}</td>
                      <td className={`py-3 text-sm font-semibold text-right ${t.type === 'deposit' ? 'text-green-600' : 'text-red-600'}`}>{fmtBRL(t.value)}</td>
                      <td className="py-3 text-sm text-gray-600 dark:text-gray-300">{t.fromAccount || '-'}</td>
                      <td className="py-3 text-sm text-gray-600 dark:text-gray-300">{t.toAccount || '-'}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-6 text-center text-sm text-gray-500 dark:text-gray-400">Nenhuma transação encontrada.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
