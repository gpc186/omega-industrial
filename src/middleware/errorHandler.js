// Middleware para tratar erros do banco de dados

function errorHandler(error, req, res, next) {
  console.error(' Erro:', error);

  // Erro de conexão com banco
  if (error.code === 'PROTOCOL_CONNECTION_LOST') {
    return res.status(503).json({
      error: 'Conexão com banco perdida'
    });
  }

  // Erro de duplicação (UNIQUE constraint)
  if (error.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({
      error: 'Registro duplicado',
      details: error.sqlMessage
    });
  }

  // Erro de foreign key
  if (error.code === 'ER_NO_REFERENCED_ROW_2') {
    return res.status(400).json({
      error: 'Registro relacionado não encontrado'
    });
  }

  // Erro de sintaxe SQL
  if (error.code === 'ER_PARSE_ERROR') {
    return res.status(500).json({
      error: 'Erro na query SQL',
      details: process.env.NODE_ENV === 'development' ? error.sqlMessage : undefined
    });
  }

  // Erro genérico
  res.status(500).json({
    error: 'Erro interno do servidor',
    message: process.env.NODE_ENV === 'development' ? error.message : undefined
  });
}

module.exports = errorHandler;