import { ContentIdea } from "./types";

console.log('Initializing Gemini Service...');

// Get API key from environment variable
const apiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY ||
  (import.meta as any).env?.GEMINI_API_KEY ||
  process.env.VITE_GEMINI_API_KEY ||
  process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error('⚠️ GEMINI_API_KEY not found! Please add it to your .env.local file');
}

export async function generateCaption(topic: string, tone: string = 'profissional'): Promise<string> {
  try {
    if (!apiKey) return "Erro: Chave de API não configurada.";

    const prompt = `Escreva uma legenda curta e engajadora para um post de Instagram sobre: "${topic}".
        Tom de voz: ${tone}.
        Inclua 3-5 hashtags relevantes. Use emojis.`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "Erro ao gerar legenda.";
  } catch (error) {
    console.error("Error generating caption:", error);
    return "Erro ao gerar legenda. Tente novamente.";
  }
}

export async function generateContentIdeas(niche: string, goal: string): Promise<ContentIdea[]> {
  try {
    if (!apiKey) {
      console.error('Cannot generate ideas: API key is missing');
      return getMockIdeas(niche, goal);
    }

    console.log('Generating content ideas with Gemini API (REST)...');

    const prompt = `ATUE COMO UM ESPECIALISTA EM MARKETING DE CONTEÚDO E ESTRATÉGIA DIGITAL.
    
    Seu objetivo é criar um planejamento de conteúdo de ALTO IMPACTO para um perfil no nicho: "${niche.toUpperCase()}" com o objetivo específico de: "${goal.toUpperCase()}".

    REGRAS CRITICAS:
    1. O conteúdo DEVE respirar o nicho "${niche}". Use termos técnicos, gírias e dores específicas desse público.
    2. Nada de conteúdo genérico. Cada ideia deve ser algo que um especialista postaria.
    3. Para o objetivo "${goal}", foque em estratégias comprovadas (ex: se for vendas, use gatilhos mentais; se for engajamento, use polêmicas ou identificação).

    Gere 6 ideias diversificadas seguindo este formato JSON estrito:

    Para cada ideia, retorne:
    - id: string única
    - type: escolha estratégica entre "Reels", "Carousel", "Story", "Static", "Promo"
    - title: Título magnético (clickbait ético)
    - hook: A primeira frase do vídeo/legenda que vai impedir o scroll
    - description: A lógica por trás dessa ideia (por que ela vai funcionar?)
    - caption: Legenda completa e persuasiva, já formatada com espaços, emojis estratégicos e hashtags do nicho "${niche}"
    - callToAction: CTA claro e imperativo
    - structure: Array de strings com o roteiro passo-a-passo (obrigatório para Reels e Carrossel)
    - bestTime: Sugestão do melhor dia da semana e horário para postar essa ideia (ex: "Terça-feira às 18:00") - justifique mentalmente baseado no comportamento do público de "${niche}"

    Retorne APENAS o array JSON válido com 6 objetos.
    `;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          temperature: 0.9,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 8192,
          // responseMimeType: "application/json" // Removing this to avoid 400 Bad Request if schema is missing
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API Error Body:', errorText);
      throw new Error(`Gemini API Error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    console.log('Gemini API response received');

    // Parse the JSON response text
    // API returns candidates[0].content.parts[0].text
    let textStats = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!textStats) throw new Error('No content generated');

    // Remove code blocks if present (Markdown cleanup)
    textStats = textStats.replace(/```json/g, '').replace(/```/g, '').trim();

    const ideas = JSON.parse(textStats);

    if (!Array.isArray(ideas) || ideas.length === 0) {
      console.warn('Invalid response format, using mock data');
      return getMockIdeas(niche, goal);
    }

    return ideas;
  } catch (error) {
    console.error("Error generating ideas:", error);
    console.log('Falling back to mock data');
    return getMockIdeas(niche, goal);
  }
}

export async function generateBrainstorm(niche: string): Promise<string[]> {
  try {
    if (!apiKey) throw new Error('API key needed');

    const prompt = `Gere uma lista de 10 ideias de conteúdo criativas e MUITO ÚTEIS para o nicho de "${niche}". Retorne apenas a lista em texto simples, uma por linha.`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    // Split by newlines and clean up
    return text.split('\n').filter(line => line.trim().length > 0).map(line => line.replace(/^[-*•\d\.]+\s*/, '').trim());
  } catch (error) {
    console.error("Error generating brainstorm:", error);
    return [
      "5 Erros comuns que iniciantes cometem",
      "Como fazer X em metade do tempo",
      "Bastidores do meu dia a dia",
      "Análise de ferramentas essenciais",
      "Tutorial passo a passo para iniciantes",
      "Mitos vs Verdades do nicho",
      "Minha opinião polêmica sobre X",
      "Dica rápida de 1 minuto",
      "Checklist definitivo",
      "História de superação"
    ];
  }
}

export async function generateQuickScript(topic: string): Promise<string> {
  try {
    if (!apiKey) throw new Error('API key needed');

    const prompt = `Crie um roteiro curto e direto (formato Reels/TikTok) de 60 segundos sobre o tema: "${topic}".
    Estrutura:
    - Gancho (3s)
    - Desenvolvimento (45s)
    - CTA (12s)
    Seja informal e direto.`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || 'Erro ao gerar roteiro.';
  } catch (error) {
    console.error("Error generating script:", error);
    return `Roteiro sobre ${topic}\n\n1. Gancho: Você sabia que...\n2. Corpo: Acontece que...\n3. CTA: Me siga para mais!`;
  }
}

// Mock data for testing when API is not available
function getMockIdeas(niche: string = 'Geral', goal: string = 'Engajamento'): ContentIdea[] {
  const safeNiche = niche || 'Geral';

  return [
    {
      id: "mock-1",
      type: "Reels",
      title: `5 Erros que Estão Sabotando Seus Resultados em ${safeNiche}`,
      hook: `Você está cometendo esses erros no seu nicho de ${safeNiche} sem perceber?`,
      description: `Um vídeo rápido e dinâmico que revela os principais erros que impedem o progresso em ${safeNiche}`,
      caption: `🚨 Pare de sabotar seus resultados! Esses 5 erros são mais comuns do que você imagina no mundo de ${safeNiche}... Qual deles você já cometeu? \n\n#${safeNiche.toLowerCase().replace(/\s/g, '')} #dicas #sucesso`,
      callToAction: "Salve este post para não esquecer!",
      structure: ["Intro com pergunta impactante", "Erro 1", "Erro 2", "Erro 3", "Erro 4", "Erro 5", "CTA final"],
      bestTime: "Segunda-feira às 19:00 - Horário de pico para engajamento rápido"
    },
    {
      id: "mock-2",
      type: "Carousel",
      title: `Guia Completo: Como Dominar ${safeNiche}`,
      hook: `Seus métodos de ${safeNiche} estão realmente funcionando?`,
      description: `Um carrossel educativo que ensina passo a passo como ter sucesso com ${safeNiche}`,
      caption: `📚 GUIA COMPLETO para dominar ${safeNiche}! Deslize para aprender cada etapa ➡️\n\nSalve para consultar sempre que precisar! 🔖\n\n#${safeNiche.toLowerCase().replace(/\s/g, '')} #guia #dicas #passoapasso`,
      callToAction: "Compartilhe com quem precisa ver isso!",
      structure: ["Capa com título", "Passo 1: Fundamentos", "Passo 2: Estratégia", "Passo 3: Aplicação", "Passo 4: Otimização", "Passo 5: Resultados"],
      bestTime: "Quarta-feira às 12:00 - Ideal para salvar e ler depois"
    },
    {
      id: "mock-3",
      type: "Story",
      title: `Bastidores: Dia a Dia em ${safeNiche}`,
      hook: "Quer saber como é minha rotina profissional?",
      description: `Uma série de stories mostrando os bastidores do trabalho com ${safeNiche}, criando conexão e autoridade`,
      caption: `☀️ Meus bastidores revelados! Acompanhe como aplico as melhores práticas de ${safeNiche}... #${safeNiche.toLowerCase().replace(/\s/g, '')} #bastidores #rotina`,
      callToAction: "Responda: qual parte você vai implementar?",
      structure: ["Bom dia com contexto", "Mostrando processo de trabalho", "Dica rápida do dia", "Resultado obtido", "Enquete para seguidores"],
      bestTime: "Todos os dias às 09:00 - Começo do dia"
    },
    {
      id: "mock-4",
      type: "Static",
      title: `Mito vs Verdade sobre ${safeNiche}`,
      hook: "A verdade que ninguém te conta!",
      description: "Post informativo desmistificando uma crença comum do nicho",
      caption: `✨ MITO x VERDADE! Muita gente acredita nisso, mas a realidade de ${safeNiche} é outra.\n\nVocê sabia disso? Comente abaixo! 👇\n\n#${safeNiche.toLowerCase().replace(/\s/g, '')} #mitoseverdades #conhecimento`,
      callToAction: "Marque alguém que precisa saber disso!",
      structure: [],
      bestTime: "Quinta-feira às 20:00 - Discussões noturnas"
    },
    {
      id: "mock-5",
      type: "Reels",
      title: `Tutorial Rápido: Dica de Ouro para ${safeNiche}`,
      hook: "Economize tempo com esse truque!",
      description: `Vídeo demonstrando uma técnica eficiente para melhorar resultados em ${safeNiche}`,
      caption: `⏱️ Dica rápida que muda o jogo em ${safeNiche}! Simples e eficiente 🔥\n\nJá testou essa técnica?\n\n#${safeNiche.toLowerCase().replace(/\s/g, '')} #tutorial #hacks`,
      callToAction: "Comente '🔥' se você vai testar hoje!",
      structure: ["Apresentação do problema", "Demonstração da solução", "Resultado final", "CTA"],
      bestTime: "Sexta-feira às 18:00 - Dica para o fim de semana"
    },
    {
      id: "mock-6",
      type: "Promo",
      title: `Oferta Especial: Consultoria em ${safeNiche}`,
      hook: `Chegou a hora de transformar seus resultados em ${safeNiche}!`,
      description: `Post promocional oferecendo serviços ou produtos relacionados ao objetivo de ${goal}`,
      caption: `🎯 VAGAS ABERTAS! Leve seu conhecimento em ${safeNiche} para o próximo nível com foco em ${goal} 💪\n\n✅ Personalizado para você\n✅ Suporte exclusivo\n\n🔥 Link na bio! ⬆️\n\n#${safeNiche.toLowerCase().replace(/\s/g, '')} #promo #oportunidade`,
      callToAction: "Clique no link da bio e garanta sua vaga!",
      structure: [],
      bestTime: "Segunda-feira às 08:00 - Abertura de vendas"
    }
  ];
}
