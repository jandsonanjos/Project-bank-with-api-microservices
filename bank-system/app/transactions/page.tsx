"use client";

import { useEffect, useState } from "react";
import { getTransactions } from "@/src/lib/api";
import { useRouter } from "next/navigation";

export default function TransactionsPage() {
  const router = useRouter();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return router.replace("/login");

    async function load() {
      const res = await getTransactions();
      if (res.error) {
        alert(res.error);
        router.replace("/login");
        return;
      }
      setTransactions(res);
      setLoading(false);
    }
    load();
  }, [router]);

  if (loading) return <p>Carregando...</p>;

  return (
    <div style={{ padding: 20 }}>
      <h1>Extrato</h1>

      {transactions.length === 0 && <p>Sem operações</p>}

      <ul>
        {transactions.map((t:any) => (
          <li key={t._id}>
            <strong>{t.type}</strong> — R$ {t.value} — {new Date(t.createdAt).toLocaleString()}
            {t.fromAccount && <span> — De: {t.fromAccount}</span>}
            {t.toAccount && <span> — Para: {t.toAccount}</span>}
          </li>
        ))}
      </ul>

      <button onClick={()=>router.push("/dashboard")}>Voltar</button>
    </div>
  );
}
