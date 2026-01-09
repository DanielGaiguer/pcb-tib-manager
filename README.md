# Gerenciador de Ponteiras PCB

## 📌 Sobre o Projeto

O **Gerenciador de Ponteiras PCB** é uma aplicação front-end desenvolvida com **React e TypeScript**, criada para facilitar o controle e a organização de ponteiras utilizadas em projetos com placas de circuito impresso (PCB).

O projeto nasceu da necessidade de manter informações **centralizadas, acessíveis e persistentes em nuvem**, evitando anotações manuais e perda de dados durante estudos e trabalhos práticos com eletrônica. Para isso, a aplicação utiliza **integração com o Google Sheets**, onde todos os dados são salvos e carregados.

---

## 🎯 Problema Resolvido

Durante o uso frequente de ponteiras PCB, é comum perder informações como tipo, finalidade ou observações importantes, especialmente quando esses dados ficam espalhados em anotações locais. Este projeto resolve esse problema ao oferecer:

* Um local único para cadastro de ponteiras
* Visualização clara e organizada dos dados
* Persistência em nuvem via Google Sheets
* Acesso aos dados a partir de diferentes dispositivos
* Interface simples e intuitiva

---

## 🚀 Funcionalidades

* Cadastro de ponteiras PCB
* Listagem dinâmica dos registros
* Visualização de detalhes
* Edição de informações
* Remoção de registros
* **Persistência de dados via Google Sheets**
* **Carregamento automático dos dados a partir da planilha**
* Estados de loading e controle de interface durante operações assíncronas

---

## 🛠️ Tecnologias Utilizadas

* **React** – Criação da interface e componentes
* **TypeScript** – Tipagem estática e segurança
* **Hooks (useState, useEffect, useRef)** – Controle de estado e ciclo de vida
* **Google Sheets API** – Armazenamento e leitura dos dados em nuvem
* **CSS** – Estilização da aplicação

---

## 🧱 Arquitetura e Organização

O projeto segue uma organização baseada em responsabilidade única:

* **Types**: definição dos contratos de dados e tipagem das respostas da API
* **Components**: componentes reutilizáveis (formulários, listas, detalhes)
* **Services / Storage**: funções responsáveis pela comunicação com o Google Sheets (leitura e escrita de dados)

Essa estrutura facilita a manutenção, a leitura do código e a escalabilidade da aplicação.

---

## 🔄 Fluxo da Aplicação

1. A aplicação realiza a **leitura inicial dos dados no Google Sheets**
2. Os registros são carregados e exibidos na interface
3. O usuário interage com a aplicação para criar, editar ou remover ponteiras
4. Cada alteração é **sincronizada automaticamente com a planilha**
5. A interface reflete os dados sempre atualizados

---

## ✅ Boas Práticas Aplicadas

* Tipagem forte com TypeScript
* Componentização e reutilização de código
* Separação clara de responsabilidades
* Abstração da lógica de integração com serviços externos
* Tratamento de estados assíncronos (loading e erro)
* Código legível, organizado e de fácil manutenção

---

## 📈 Possíveis Evoluções

* Autenticação de usuários (OAuth / Google)
* Controle de permissões de acesso à planilha
* Migração para backend próprio (API REST ou GraphQL)
* Banco de dados relacional ou NoSQL
* Filtros, busca e ordenação avançada
* Exportação de dados (CSV / PDF)

---

## 🧠 Aprendizados

Este projeto reforçou conceitos importantes de desenvolvimento front-end moderno, como:

* Gerenciamento de estado com React Hooks
* Integração com APIs externas (Google Sheets)
* Manipulação de dados assíncronos
* Importância da tipagem com TypeScript
* Organização de projetos escaláveis

---

## 🏁 Conclusão

O **Gerenciador de Ponteiras PCB** é um projeto sólido para portfólio, demonstrando domínio de **React**, **TypeScript** e **integração com serviços externos**. Ele resolve um problema real, possui arquitetura clara e evidencia a capacidade de trabalhar com **persistência de dados em nuvem**, estando preparado para evoluções futuras.

> Projeto desenvolvido com foco em aprendizado prático, organização, integração e escalabilidade.
