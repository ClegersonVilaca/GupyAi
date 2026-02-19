# Instruções para Debug do Erro

Eu atualizei o tratamento de erro da aplicação para mostrar **exatamente** o que está acontecendo.

1.  **Atualize a página** (F5) no navegador.
2.  Tente enviar o currículo novamente.
3.  Se der erro, o alerta mostrará uma mensagem técnica (ex: `Gemini API error: ...`).
4.  **Me informe essa mensagem** para eu corrigir.

Se o erro for `400 Bad Request`, pode ser o formato do JSON.
Se for `403 Forbidden` ou `401 Unauthorized`, é a chave de API.
Se for `500`, é erro interno no servidor do Google.
