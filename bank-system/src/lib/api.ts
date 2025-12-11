const API_URL = "http://localhost:4000";

export async function registerUser(data: any) {
  try {
    const res = await fetch(`${API_URL}/users/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    
    if (!res.ok) {
      const error = await res.json();
      return error;
    }
    
    return res.json();
  } catch (err: any) {
    return { error: "Erro de conexão com o servidor" };
  }
}

export async function loginUser(data: any) {
  try {
    const res = await fetch(`${API_URL}/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const error = await res.json();
      return error;
    }

    return res.json();
  } catch (err: any) {
    return { error: "Erro de conexão com o servidor" };
  }
}

export async function getAccount() {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const res = await fetch(`${API_URL}/account`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}

export async function deposit(amount: number) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/account/deposit`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ amount }),
  });
  return res.json();
}

export async function withdraw(amount: number) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/account/withdraw`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ amount }),
  });
  return res.json();
}

export async function transfer(toAccountNumber: string, amount: number) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/account/transfer`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ toAccountNumber, amount }),
  });
  return res.json();
}

export async function getTransactions() {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/account/transactions`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}
