# Configuração Google Sheets para Formulário de Contato

## Passo 1: Criar Planilha Google Sheets

1. Acesse [Google Sheets](https://sheets.google.com)
2. Crie nova planilha com nome: **"Contatos Landing Page"**
3. Na primeira linha (cabeçalho), adicione estas colunas:
   - A1: `Data/Hora`
   - B1: `Nome`
   - C1: `Email`
   - D1: `Empresa`
   - E1: `Serviço`
   - F1: `Mensagem`

## Passo 2: Criar Google Apps Script

1. Na planilha, clique em **Extensões > Apps Script**
2. Delete todo o código existente
3. Cole o código abaixo:

```javascript
function doPost(e) {
  try {
    // Abre a planilha ativa
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Parse dos dados recebidos
    var data = JSON.parse(e.postData.contents);
    
    // Adiciona nova linha com os dados
    sheet.appendRow([
      new Date(),           // Data/Hora
      data.nome,            // Nome
      data.email,           // Email
      data.empresa || '-',  // Empresa (opcional)
      data.servico,         // Serviço
      data.mensagem         // Mensagem
    ]);
    
    // Retorna sucesso
    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // Retorna erro
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput("API está funcionando!")
    .setMimeType(ContentService.MimeType.TEXT);
}
```

4. Clique em **Salvar** (ícone de disquete)
5. Dê um nome ao projeto: **"API Formulário Contato"**

## Passo 3: Deploy do Script

1. Clique em **Implantar > Nova implantação**
2. Clique no ícone de **engrenagem** ⚙️ ao lado de "Selecionar tipo"
3. Escolha **Aplicativo da Web**
4. Configure:
   - **Descrição**: "API de Contato Landing Page"
   - **Executar como**: Eu (seu email)
   - **Quem tem acesso**: Qualquer pessoa
5. Clique em **Implantar**
6. **COPIE A URL** que aparece (algo como: `https://script.google.com/macros/s/XXXXX/exec`)
7. Clique em **Concluído**

## Passo 4: Testar o Script

1. Abra a URL copiada no navegador
2. Deve aparecer: "API está funcionando!"
3. Autorize o acesso quando solicitado

## Passo 5: Configurar o Site

A URL copiada no Passo 3 já foi adicionada automaticamente ao arquivo `script.js`.

Procure por esta linha e **substitua pela sua URL**:

```javascript
const GOOGLE_SCRIPT_URL = 'COLE_SUA_URL_AQUI';
```

## Testar o Formulário

1. Acesse seu site pelo ngrok
2. Preencha o formulário de contato
3. Clique em "Enviar Mensagem"
4. Verifique se os dados apareceram na planilha Google Sheets

## Solução de Problemas

**Erro "Script function not found":**
- Verifique se salvou o script corretamente
- Certifique-se que o nome da função é `doPost`

**Erro de permissão:**
- Volte no Deploy e confirme "Quem tem acesso: Qualquer pessoa"

**Dados não chegam:**
- Verifique se a URL no script.js está correta
- Abra o Console do navegador (F12) para ver erros

## Segurança

⚠️ **IMPORTANTE**: Esta configuração expõe um endpoint público. Para produção, considere:
- Adicionar validação de origem (CORS)
- Implementar rate limiting
- Adicionar captcha (reCAPTCHA)

---

**Dúvidas?** Entre em contato: contato@arovinastudio.com.br
