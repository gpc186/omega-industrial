const mockOrders = [
    {
        id: 1,
        user_id: 1,
        order_numero: 'OP-1704067200000-123',
        total_preco: 150.00,
        notes: null,
        status: 'completed',
        frete: 15.00,
        data_compra: '2023-12-01 10:00:00',
        usuario_nome: 'Cliente A',
        usuario_cnpj: '11.111.111/0001-11',
        items: [
            { product_id: 1, quantidade: 2, preco_unidade: 50.00, produto_nome: 'Óleo Lubrificante X', subtotal: 100.00 },
            { product_id: 2, quantidade: 1, preco_unidade: 35.00, produto_nome: 'Filtro de Ar Y', subtotal: 35.00 }
        ]
    },
    {
        id: 2,
        user_id: 2,
        order_numero: 'OP-1706745600000-456',
        total_preco: 250.00,
        notes: 'Urgente',
        status: 'pending',
        frete: 20.00,
        data_compra: '2024-01-05 15:30:00',
        usuario_nome: 'Cliente B',
        usuario_cnpj: '22.222.222/0001-22',
        items: [
            { product_id: 3, quantidade: 5, preco_unidade: 40.00, produto_nome: 'Graxa Industrial Z', subtotal: 200.00 },
            { product_id: 1, quantidade: 1, preco_unidade: 50.00, produto_nome: 'Óleo Lubrificante X', subtotal: 50.00 }
        ]
    },
    {
        id: 3,
        user_id: 1,
        order_numero: 'OP-1709251200000-789',
        total_preco: 50.00,
        notes: null,
        status: 'completed',
        frete: 10.00,
        data_compra: '2024-02-10 08:00:00',
        usuario_nome: 'Cliente A',
        usuario_cnpj: '11.111.111/0001-11',
        items: [
            { product_id: 2, quantidade: 1, preco_unidade: 35.00, produto_nome: 'Filtro de Ar Y', subtotal: 35.00 }
        ]
    },
    {
        id: 4,
        user_id: 3,
        order_numero: 'OP-1711929600000-101',
        total_preco: 100.00,
        notes: null,
        status: 'completed',
        frete: 12.00,
        data_compra: '2024-03-15 12:00:00',
        usuario_nome: 'Cliente C',
        usuario_cnpj: '33.333.333/0001-33',
        items: [
            { product_id: 4, quantidade: 1, preco_unidade: 100.00, produto_nome: 'Aditivo W', subtotal: 100.00 }
        ]
    }
];

const mockProducts = [
    { id: 1, nome: 'Óleo Lubrificante X', preco: 50.00, quantidade: 150, category_id: 1, image_urls: '["url1", "url2"]' },
    { id: 2, nome: 'Filtro de Ar Y', preco: 35.00, quantidade: 50, category_id: 2, image_urls: '["url3", "url4"]' },
    { id: 3, nome: 'Graxa Industrial Z', preco: 40.00, quantidade: 10, category_id: 1, image_urls: '["url5", "url6"]' },
    { id: 4, nome: 'Aditivo W', preco: 100.00, quantidade: 5, category_id: 3, image_urls: '["url7", "url8"]' }
];

const mockUsers = [
    { id: 1, nome: 'Cliente A', email: 'clienteA@teste.com', CNPJ: '11.111.111/0001-11', role: 'user', created_at: '2023-11-01 09:00:00' },
    { id: 2, nome: 'Cliente B', email: 'clienteB@teste.com', CNPJ: '22.222.222/0001-22', role: 'user', created_at: '2024-01-01 10:00:00' },
    { id: 3, nome: 'Cliente C', email: 'clienteC@teste.com', CNPJ: '33.333.333/0001-33', role: 'user', created_at: '2024-03-01 11:00:00' },
    { id: 4, nome: 'Admin', email: 'admin@teste.com', CNPJ: '00.000.000/0001-00', role: 'adm', created_at: '2023-10-01 08:00:00' }
];

module.exports = { mockOrders, mockProducts, mockUsers };
