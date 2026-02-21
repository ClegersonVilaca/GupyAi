import "jsr:@supabase/functions-js/edge-runtime.d.ts"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Groq API - gratuito, sem cartão de crédito. Obtenha em console.groq.com
const GROQ_API_KEY = Deno.env.get('GROQ_API_KEY') || ""

Deno.serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const { jobDescription, resumeText } = await req.json()

        if (!GROQ_API_KEY) {
            throw new Error('GROQ_API_KEY nao configurada. Configure a variavel de ambiente GROQ_API_KEY com sua chave gratuita do console.groq.com')
        }

        if (!jobDescription || !resumeText) {
            throw new Error('jobDescription e resumeText sao obrigatorios')
        }

        const prompt = `Voce e um especialista em recrutamento e no algoritmo ATS da Gupy.
Analise o curriculo abaixo em relacao a descricao da vaga fornecida.

Descricao da Vaga:
${jobDescription}

Curriculo:
${resumeText}

Retorne SOMENTE um objeto JSON valido, sem nenhum texto antes ou depois, sem markdown, sem blocos de codigo, apenas o JSON puro com esta estrutura exata:
{
  "score": number,
  "hardSkills": number,
  "softSkills": number,
  "keywordsMatch": "string%",
  "formattingScore": number,
  "missingKeywords": [{"title":"string","sub":"string"}],
  "strengths": ["string"],
  "suggestions": [{"title":"string","desc":"string","type":"content"}],
  "parsedResume": {
    "name": "string",
    "email": "string",
    "phone": "string",
    "location": "string",
    "linkedin": "string",
    "website": "string",
    "summary": "string",
    "experience": [{"company":"string","position":"string","period":"string","location":"string","description":"string"}],
    "education": [{"institution":"string","degree":"string","period":"string","description":"string"}],
    "skills": "string[]",
    "languages": [{"language":"string","level":"string"}]
  }
}

Regras:
- score: compatibilidade geral de 0 a 100
- hardSkills: nota tecnica de 0 a 10
- softSkills: nota comportamental de 0 a 10
- keywordsMatch: porcentagem de palavras-chave encontradas (ex: "72%")
- formattingScore: qualidade da formatacao de 0 a 100
- missingKeywords: lista de competencias tecnicas ausentes no curriculo mas presentes na vaga
- strengths: lista de pontos fortes identificados no curriculo
- suggestions: sugestoes de melhoria (type pode ser "content", "formatting" ou "language")
- parsedResume: extraia os dados estruturados do texto do curriculo fornecido para preencher o editor automaticamente.`

        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${GROQ_API_KEY}`
            },
            body: JSON.stringify({
                model: 'llama-3.3-70b-versatile',
                messages: [
                    {
                        role: 'system',
                        content: 'Voce e um especialista em recrutamento e ATS. Sempre responda APENAS com JSON valido, sem texto adicional, sem markdown.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.3,
                max_tokens: 2048,
                response_format: { type: 'json_object' }
            })
        })

        if (!response.ok) {
            const errorData = await response.json()
            console.error('Groq API error:', JSON.stringify(errorData))
            throw new Error(`Groq API error: ${errorData?.error?.message || JSON.stringify(errorData)}`)
        }

        const result = await response.json()
        const content = result.choices[0]?.message?.content

        if (!content) {
            throw new Error('Resposta vazia da IA')
        }

        // Parse JSON safely
        let jsonResponse
        try {
            jsonResponse = JSON.parse(content.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim())
        } catch (e) {
            console.error('Error parsing Groq response:', content)
            throw new Error('Falha ao processar resposta da IA. Tente novamente.')
        }

        return new Response(JSON.stringify(jsonResponse), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        })

    } catch (error) {
        console.error('Error in optimize-resume:', error.message)
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 500,
        })
    }
})
