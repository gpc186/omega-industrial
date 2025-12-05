export function calcularFrete(cep, subtotal = 0) {
  console.log("CEP RECEBIDO →", cep);
  const cleanCEP = (cep || '').replace(/\D/g, '');
  console.log("LIMPO →", cleanCEP);

  const prefix = parseInt(cleanCEP.substring(0, 2), 10);
  console.log("PREFIX →", prefix);

  let precoBase;
  if (prefix >= 1 && prefix <= 29) precoBase = 100.50;
  else if (prefix <= 59) precoBase = 150.50;
  else precoBase = 220.90;

  console.log("PRECO BASE →", precoBase);

  if (subtotal >= 50000) {
    return [{
      nome: "Frete Grátis",
      codigo: "FREE",
      prazo: "3-7 dias úteis",
      preco: 0.00
    }];
  }

  const econ = { nome: "Econômica", codigo: "ECON", preco: + precoBase.toFixed(2) };
  const normal = { nome: "Normal", codigo: "NORMAL", preco: + (precoBase * 1.35).toFixed(2) };
  const express = { nome: "Expressa", codigo: "EXPRESS", preco: + (precoBase * 2.0).toFixed(2) };

  return [econ, normal, express];
}
