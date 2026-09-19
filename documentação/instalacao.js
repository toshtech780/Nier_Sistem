# Update do sistema e instalação do Node.js e Git

pkg update && pkg upgrade -y
pkg install nodejs git -y

# Entrar na pasta do projeto (caso já tenha baixado/clonado

cd /storage/emulated/0/Download/Nier_Sistem

# Instalar as dependências do bot opcional caso nao tenha módulo 

npm install

# Iniciar o bot

sh start.sh





