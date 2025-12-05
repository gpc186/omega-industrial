export function calcularFrete(cep, subtotal = 0) {
  const cleanCEP = (cep || '').replace(/\D/g, '');
  if (cleanCEP.length < 8) return null;

  const prefix = parseInt(cleanCEP.substring(0, 2), 10);

  let precoBase;
  if (prefix >= 1 && prefix <= 29) precoBase = 100.50;
  else if (prefix <= 59) precoBase = 150.50;
  else precoBase = 220.90;

  if (subtotal >= 50000) {
    return [{
      nome: "Frete Grátis",
      codigo: "FREE",
      prazo: "3-7 dias úteis",
      preco: 0.00
    }];
  }

  const econ = { nome: "Econômica", codigo: "ECON", prazo: "7-12 dias úteis", preco: + precoBase.toFixed(2) };
  const normal = { nome: "Normal", codigo: "NORMAL", prazo: "4-8 dias úteis", preco: + (precoBase * 1.35).toFixed(2) };
  const express = { nome: "Expressa", codigo: "EXPRESS", prazo: "1-3 dias úteis", preco: + (precoBase * 2.0).toFixed(2) };

  return [econ, normal, express];
}
