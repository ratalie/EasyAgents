# UnderRepresented Agents

Herramientas y prompts para hacer que los agentes de IA sean accesibles para todos.

🌐 [Prueba el wizard interactivo](https://ratalie.github.io/UnderRepresentedAgents/) — crea tu asistente sin programar.

## El problema

Las herramientas de IA como Claude Code asumen que el usuario ya sabe programar, entiende
terminología técnica, puede procesar bloques grandes de texto, y sabe exactamente qué pedir.
Eso deja fuera a millones de personas: personas con discapacidades cognitivas, visuales o de
aprendizaje, adultos mayores, personas sin formación técnica, y hablantes nativos de idiomas
distintos al inglés.

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
Un flujo guiado que permite a cualquier persona crear su primer agente de IA
sin saber programar. Solo responde preguntas simples y el wizard genera todo.

### 4. Templates Listos para Usar
Plantillas de agentes pre-configurados para casos comunes:
- Agente de atención al cliente inclusivo
- Agente educativo adaptativo
- Agente asistente personal accesible

## Estructura del Proyecto

```
docs/
  index.html                    # Página web con el wizard interactivo
  style.css                     # Estilos de la página
  wizard.js                     # Lógica del wizard
  i18n.js                       # Traducciones (ES/EN/PT)
prompts/
  inclusive-system-prompt.md    # El prompt principal inclusivo
  accessibility-modes.md        # Modos de accesibilidad configurables
wizard/
  agent-wizard.md               # Flujo del wizard conversacional
templates/
  customer-support-agent.md     # Template: agente de soporte
  educational-agent.md          # Template: agente educativo
  personal-assistant-agent.md   # Template: asistente personal
guides/
  getting-started.md            # Guía de inicio en lenguaje simple
  for-caregivers.md             # Guía para cuidadores y facilitadores
```

## Cómo Empezar

Lee la guía [getting-started.md](guides/getting-started.md) — está escrita en
lenguaje simple, sin jerga técnica.

Si eres desarrollador o facilitador, revisa los prompts en la carpeta `prompts/`
para entender cómo funciona el motor inclusivo.

## Contribuir

Este proyecto necesita voces diversas. Si tienes experiencia vivida con
discapacidad, barreras de acceso a tecnología, o trabajas con comunidades
subrepresentadas, tu perspectiva es invaluable.

## Licencia

MIT
