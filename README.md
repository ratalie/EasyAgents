# UnderRepresented Agents

**[ES]** Herramientas para hacer que los agentes de IA sean accesibles para todos.
**[EN]** Tools to make AI agents accessible to everyone.
**[PT]** Ferramentas para tornar agentes de IA acessíveis para todos.

🌐 [Wizard interactivo / Interactive wizard](https://ratalie.github.io/UnderRepresentedAgents/)

---

<details>
<summary><strong>🇪🇸 Castellano</strong></summary>

## El problema

Las herramientas de IA como Claude Code asumen que el usuario ya sabe programar, entiende terminología técnica, puede procesar bloques grandes de texto, y sabe exactamente qué pedir. Eso deja fuera a millones de personas: personas con discapacidades cognitivas, visuales o de aprendizaje, adultos mayores, personas sin formación técnica, y hablantes nativos de idiomas distintos al inglés.

## Qué es este proyecto

Un conjunto de herramientas que transforman agentes de IA en asistentes verdaderamente inclusivos:

### 1. Prompt Inclusivo (Motor Principal)
Un system prompt que convierte a cualquier agente en un asistente adaptativo que:
- No asume nivel de conocimiento
- Pregunta antes de actuar
- Explica en lenguaje simple
- Se adapta al ritmo del usuario

### 2. Modos de Accesibilidad
Configuraciones específicas para distintas necesidades:
- **Modo Lector de Pantalla**: respuestas optimizadas para tecnologías asistivas
- **Modo Lenguaje Simple**: sin jerga técnica, explicaciones claras
- **Modo Paso a Paso**: todo dividido en pasos pequeños con confirmación
- **Modo Alto Contraste Verbal**: estructura clara, sin ambigüedad

### 3. Wizard Conversacional
Un flujo guiado que permite a cualquier persona crear su primer agente de IA sin saber programar. Solo responde preguntas simples y el wizard genera todo.

### 4. Templates Listos para Usar
Plantillas de agentes pre-configurados para casos comunes:
- Agente de atención al cliente inclusivo
- Agente educativo adaptativo
- Agente asistente personal accesible

## Cómo Empezar

1. **Sin programar**: Ve al [wizard interactivo](https://ratalie.github.io/UnderRepresentedAgents/), responde las preguntas, y copia el prompt generado en tu chat de IA favorito (Claude, ChatGPT, Gemini).
2. **Con más detalle**: Lee la guía [getting-started.md](guides/getting-started.md) en lenguaje simple.
3. **Para facilitadores**: Revisa la guía [for-caregivers.md](guides/for-caregivers.md) si ayudas a otras personas a usar tecnología.

## Contribuir

Este proyecto necesita voces diversas. Si tienes experiencia vivida con discapacidad, barreras de acceso a tecnología, o trabajas con comunidades subrepresentadas, tu perspectiva es invaluable.

</details>

---

<details>
<summary><strong>🇬🇧 English</strong></summary>

## The Problem

AI tools like Claude Code assume the user already knows how to code, understands technical terminology, can process large blocks of text, and knows exactly what to ask. That leaves out millions of people: people with cognitive, visual, or learning disabilities, older adults, people without technical training, and native speakers of languages other than English.

## What is This Project

A set of tools that transform AI agents into truly inclusive assistants:

### 1. Inclusive Prompt (Core Engine)
A system prompt that turns any agent into an adaptive assistant that:
- Doesn't assume knowledge level
- Asks before acting
- Explains in plain language
- Adapts to the user's pace

### 2. Accessibility Modes
Specific configurations for different needs:
- **Screen Reader Mode**: responses optimized for assistive technologies
- **Simple Language Mode**: no jargon, clear explanations
- **Step-by-Step Mode**: everything broken into small steps with confirmation
- **High Verbal Contrast Mode**: clear structure, no ambiguity

### 3. Conversational Wizard
A guided flow that lets anyone create their first AI agent without knowing how to code. Just answer simple questions and the wizard generates everything.

### 4. Ready-to-Use Templates
Pre-configured agent templates for common cases:
- Inclusive customer support agent
- Adaptive educational agent
- Accessible personal assistant agent

## Getting Started

1. **No coding needed**: Go to the [interactive wizard](https://ratalie.github.io/UnderRepresentedAgents/), answer the questions, and copy the generated prompt into your favorite AI chat (Claude, ChatGPT, Gemini).
2. **More detail**: Read the [getting-started.md](guides/getting-started.md) guide in plain language.
3. **For facilitators**: Check the [for-caregivers.md](guides/for-caregivers.md) guide if you help other people use technology.

## Contributing

This project needs diverse voices. If you have lived experience with disability, barriers to accessing technology, or work with underrepresented communities, your perspective is invaluable.

</details>

---

<details>
<summary><strong>🇧🇷 Português</strong></summary>

## O Problema

Ferramentas de IA como Claude Code assumem que o usuário já sabe programar, entende terminologia técnica, consegue processar blocos grandes de texto, e sabe exatamente o que pedir. Isso deixa de fora milhões de pessoas: pessoas com deficiências cognitivas, visuais ou de aprendizado, idosos, pessoas sem formação técnica, e falantes nativos de idiomas diferentes do inglês.

## O que é Este Projeto

Um conjunto de ferramentas que transformam agentes de IA em assistentes verdadeiramente inclusivos:

### 1. Prompt Inclusivo (Motor Principal)
Um system prompt que transforma qualquer agente num assistente adaptativo que:
- Não assume nível de conhecimento
- Pergunta antes de agir
- Explica em linguagem simples
- Se adapta ao ritmo do usuário

### 2. Modos de Acessibilidade
Configurações específicas pra diferentes necessidades:
- **Modo Leitor de Tela**: respostas otimizadas pra tecnologias assistivas
- **Modo Linguagem Simples**: sem jargão técnico, explicações claras
- **Modo Passo a Passo**: tudo dividido em passos pequenos com confirmação
- **Modo Alto Contraste Verbal**: estrutura clara, sem ambiguidade

### 3. Wizard Conversacional
Um fluxo guiado que permite qualquer pessoa criar seu primeiro agente de IA sem saber programar. Só responde perguntas simples e o wizard gera tudo.

### 4. Templates Prontos pra Usar
Modelos de agentes pré-configurados pra casos comuns:
- Agente de atendimento ao cliente inclusivo
- Agente educativo adaptativo
- Agente assistente pessoal acessível

## Como Começar

1. **Sem programar**: Vai no [wizard interativo](https://ratalie.github.io/UnderRepresentedAgents/), responde as perguntas, e copia o prompt gerado no seu chat de IA favorito (Claude, ChatGPT, Gemini).
2. **Com mais detalhe**: Lê o guia [getting-started.md](guides/getting-started.md) em linguagem simples.
3. **Pra facilitadores**: Confere o guia [for-caregivers.md](guides/for-caregivers.md) se você ajuda outras pessoas a usar tecnologia.

## Contribuir

Esse projeto precisa de vozes diversas. Se você tem experiência vivida com deficiência, barreiras de acesso à tecnologia, ou trabalha com comunidades sub-representadas, sua perspectiva é muito valiosa.

</details>

---

## Estructura / Structure / Estrutura

```
docs/                              # Website + wizard interactivo
prompts/                           # System prompts inclusivos
  inclusive-system-prompt.md       # Motor principal
  accessibility-modes.md           # 4 modos de accesibilidad
templates/                         # Agentes listos para usar
  customer-support-agent.md        # Soporte al cliente
  educational-agent.md             # Tutor educativo
  personal-assistant-agent.md      # Asistente personal
guides/                            # Guías en lenguaje simple
  getting-started.md               # Cómo empezar
  for-caregivers.md                # Para cuidadores/facilitadores
```

## License / Licencia / Licença

MIT
