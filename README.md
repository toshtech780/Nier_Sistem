<div align="center">

# 🪽 NIER SYSTEM // YoRHa Telegram Management Bot 🪽

[![Node.js](https://img.shields.io/badge/Node.js-v18%2B-green?style=for-the-badge&logo=nodedotjs)](https://nodejs.org/)
[![Telegraf](https://img.shields.io/badge/Telegraf-v4-blue?style=for-the-badge&logo=telegram)](https://telegraf.js.org/)
[![Termux](https://img.shields.io/badge/Termux-Supported-black?style=for-the-badge&logo=android)](https://termux.dev/)
[![License](https://img.shields.io/badge/License-MIT-red?style=for-the-badge)](LICENSE)

*“Everything that lives is designed to end. We are perpetually trapped in a never-ending spiral of life and death.”*

</div>

---

## 📖 Sobre o Projeto

O **Nier System** é um bot de gerenciamento de grupos para Telegram construído em **Node.js** utilizando o framework **Telegraf**. Desenvolvido com inspiração estética no universo de **NieR: Automata / YoRHa Command**, o bot possui uma interface elegante via CLI, menus inline interativos e um sistema avançado de módulos com auto-reload e gerenciamento de reconexão.

### 🌟 Destaques & Funcionalidades
- 🪽 **Interface YoRHa Styled**: Design estilizado em mensagens, botões inline e logs no console.
- ⚡ **Hot-Reload Automático**: Detecção recursiva de alterações em tempo real para scripts em `src/` sem derrubar a sessão do bot.
- 📂 **Carregador de Comandos por Categorias**: Estruturação automática baseada na organização de pastas (`membros/`, `admins/`, `dono/`).
- 🖥️ **Console Logger Profissional**: Painel ANSI estilizado com métricas de tempo de execução (`ms`), IDs de usuários, grupos e tratamento de erros.
- 🛡️ **Conexão Resiliente**: Sistema de retry de conexões com gerenciador de tentativas e controle de vazamento de listeners TLS.

---

## 📁 Estrutura do Projeto

```text
Nier_Sistem/
├── comandos/            # Categorias de comandos
│   ├── admins/          # Comandos administrativos
│   ├── dono/            # Comandos exclusivos do proprietário
│   └── membros/         # Comandos de uso geral (/start, /menu, etc.)
├── src/
│   ├── conexao.js       # Gerenciador de conexão e reconexão automatizada
│   ├── logger.js        # Painel ANSI do console estilo YoRHa
│   ├── menu.js          # Textos e definições de layouts interativos
│   ├── plugin.js        # Plugin loader com monitor recursivo de auto-reload
│   └── utils.js         # Funções auxiliares para envio de mensagens
├── config.js            # Credenciais (Token, ID do Dono, Prefixo)
├── nier.js              # Ponto de entrada (Entrypoint) principal do bot
├── start.sh             # Script de inicialização Bash com auto-restart
├── README.md            # Documentação principal
└── package.json         # Dependências e scripts Node.js


# 1. Atualizar pacotes do sistema e instalar dependências básicas
pkg update && pkg upgrade -y
pkg install nodejs git -y

# 2. Clonar o repositório
git clone [https://github.com/toshtech780/Nier_Sistem.git](https://github.com/toshtech780/Nier_Sistem.git)
cd Nier_Sistem

# 3. Instalar dependências da aplicação
npm install

# 4. Dar permissão de execução ao script de inicialização
npm start

# 5. Iniciar o bot com protocolo Auto-Restart
sh start.sh


