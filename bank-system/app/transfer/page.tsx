"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { transfer } from "@/src/lib/api";

export default function TransferPage() {
  const router = useRouter();
  const [toAccount, setToAccount] = useState("");
  const [amount, setAmount] = useState<number>(0);

  async function handleTransfer(e:any) {
    e.preventDefault();
    if (!toAccount || !amount) return alert("Preencha os campos");

    const res = await transfer(toAccount, amount);
    if (res.error) return alert(res.error);

    alert(res.message || "Transferência realizada");
    router.push("/dashboard");
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Transferir</h1>

      <form onSubmit={handleTransfer}>
        <input type="text" placeholder="Conta destino (número)" value={toAccount} onChange={(e)=>setToAccount(e.target.value)} />
        <input type="number" placeholder="Valor" value={amount} onChange={(e)=>setAmount(Number(e.target.value))} />
        <button type="submit">Enviar</button>
      </form>

      <button style={{ marginTop: 10 }} onClick={()=>router.push("/dashboard")}>Voltar</button>
    </div>
  );
}
