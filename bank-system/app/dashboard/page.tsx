"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAccount, deposit, withdraw } from "@/src/lib/api";

export default function Dashboard() {
  const router = useRouter();
  const [account, setAccount] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState<string>("");
  const [withdrawAmount, setWithdrawAmount] = useState<string>("");
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      router.replace("/login");
      return;
    }

    let mounted = true;
    async function load() {
      const data = await getAccount();
      if (!mounted) return;
      if (data.error) {
        setFeedback(data.error);
        router.replace("/login");
        return;
      }
      setAccount(data);
      setLoading(false);
    }

    load();
    return () => { mounted = false; };
  }, [router]);

  function fmtBRL(value: number) {
    return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  }

  async function handleDeposit() {
    const val = Number(amount);
    if (!val || val <= 0) return setFeedback("Informe um valor válido para depósito.");
    setFeedback(null);
    const res = await deposit(val);
    if (res.error) return setFeedback(res.error);
    setAccount((p:any)=> ({ ...p, balance: res.balance ?? p.balance + val }));
    setAmount("");
    setFeedback(res.message || "Depósito realizado com sucesso.");
  }

  async function handleWithdraw() {
    const val = Number(withdrawAmount);
    if (!val || val <= 0) return setFeedback("Informe um valor válido para saque.");
    setFeedback(null);
    const res = await withdraw(val);
    if (res.error) return setFeedback(res.error);
    setAccount((p:any)=> ({ ...p, balance: res.balance ?? p.balance - val }));
    setWithdrawAmount("");
    setFeedback(res.message || "Saque realizado com sucesso.");
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Top header */}
        <header className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">ST</div>
            <div>
              <div className="text-lg font-semibold text-gray-900 dark:text-white">STY Bank</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Painel do cliente</div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm font-medium text-gray-900 dark:text-white">{account.user?.name || account.user?.email || 'Usuário'}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Conta: {account.accountNumber}</div>
            </div>
            <button className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-700 rounded" onClick={()=>{ localStorage.removeItem('token'); router.push('/login'); }}>Sair</button>
          </div>
        </header>

        {feedback && <div className="mb-4 p-3 rounded bg-yellow-100 text-yellow-800">{feedback}</div>}

        {/* Summary cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="text-sm text-gray-500 dark:text-gray-400">Saldo disponível</div>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400 mt-2">{fmtBRL(Number(account.balance ?? 0))}</div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="text-sm text-gray-500 dark:text-gray-400">Número da conta</div>
            <div className="text-xl font-semibold mt-2">{account.accountNumber}</div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="text-sm text-gray-500 dark:text-gray-400">Transações</div>
            <div className="text-xl font-semibold mt-2">{account.transactions?.length ?? 0}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: actions */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
              <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100">Ações rápidas</h3>
              <div className="mt-4 space-y-4">
                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-300">Depósito (R$)</label>
                  <div className="mt-2 flex gap-2">
                    <input className="flex-1 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400" type="number" value={amount} onChange={(e)=>setAmount(e.target.value)} />
                    <button className="px-3 py-2 bg-green-600 text-white rounded" onClick={handleDeposit}>Depositar</button>
                  </div>
                </div>

                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-300">Saque (R$)</label>
                  <div className="mt-2 flex gap-2">
                    <input className="flex-1 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400" type="number" value={withdrawAmount} onChange={(e)=>setWithdrawAmount(e.target.value)} />
                    <button className="px-3 py-2 bg-red-600 text-white rounded" onClick={handleWithdraw}>Sacar</button>
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
                  <button className="w-full px-4 py-2 bg-blue-600 text-white rounded" onClick={()=>router.push('/transfer')}>Transferir</button>
                  <button className="w-full mt-2 px-4 py-2 border border-gray-200 dark:border-gray-700 rounded" onClick={()=>router.push('/transactions')}>Ver extrato</button>
                </div>
              </div>
            </div>
          </div>

          {/* Right: transactions table */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100">Últimas transações</h3>
                <button className="text-sm text-blue-600" onClick={()=>router.push('/transactions')}>Ver tudo</button>
              </div>

              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-left table-auto">
                  <thead>
                    <tr className="text-sm text-gray-500 dark:text-gray-400">
                      <th className="py-2 pr-4">Data</th>
                      <th className="py-2 pr-4">Descrição</th>
                      <th className="py-2 pr-4">Tipo</th>
                      <th className="py-2 pr-4 text-right">Valor</th>
                    </tr>
                  </thead>
                  <tbody>
                    {account.transactions && account.transactions.length > 0 ? (
                      account.transactions.slice(0,10).map((t:any)=> (
                        <tr key={t._id} className="border-t border-gray-100 dark:border-gray-700">
                          <td className="py-3 text-sm text-gray-600 dark:text-gray-300">{new Date(t.createdAt).toLocaleString()}</td>
                          <td className="py-3 text-sm text-gray-700 dark:text-gray-100">{t.description || t.type}</td>
                          <td className="py-3 text-sm text-gray-600 dark:text-gray-300">{t.type}</td>
                          <td className={`py-3 text-sm font-semibold text-right ${t.type === 'deposit' ? 'text-green-600' : 'text-red-600'}`}>{fmtBRL(t.value)}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="py-6 text-center text-sm text-gray-500 dark:text-gray-400">Nenhuma transação encontrada.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
