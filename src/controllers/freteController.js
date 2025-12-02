exports.calcularFrete = async (req, res) => {
    try {
        const { cep, pesoTotal = 1 } = req.body;

        if (!cep) {
            return res.status(400).json({
                ok: false,
                error: "CEP é obrigatório."
            });
        }

        // Simulação realista baseada no CEP
        const isSP = cep.startsWith("01") || cep.startsWith("02") || cep.startsWith("03");

        const multiplicador = pesoTotal > 1
            ? 1 + (pesoTotal - 1) * 0.18  // cada 1kg aumenta 18%
            : 1;

        const basePrice = isSP ? 19.90 : 29.90;

        const fretes = [
            {
                nome: "PAC - Correios",
                preco: parseFloat((basePrice * multiplicador).toFixed(2)),
                prazo: isSP ? "5-7 dias úteis" : "7-12 dias úteis",
                codigo: "PAC"
            },
            {
                nome: "SEDEX - Correios",
                preco: parseFloat((basePrice * 1.5 * multiplicador).toFixed(2)),
                prazo: isSP ? "1-3 dias úteis" : "3-5 dias úteis",
                codigo: "SEDEX"
            },
            {
                nome: "Transportadora",
                preco: parseFloat((basePrice * 1.2 * multiplicador).toFixed(2)),
                prazo: isSP ? "3-6 dias úteis" : "5-9 dias úteis",
                codigo: "TRANSP"
            }
        ];

        return res.status(200).json({
            ok: true,
            fretes
        });

    } catch (err) {
        console.error("Erro ao calcular frete:", err);
        return res.status(500).json({
            ok: false,
            error: "Erro interno ao calcular frete."
        });
    }
};
