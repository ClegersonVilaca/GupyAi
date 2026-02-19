
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Config - LEIA DO SEU ARQUIVO .ENV OU VITE CONFIG SE NECESSÁRIO
const SUPABASE_URL = 'https://zwldicrzvdwhafaadohd.supabase.co'
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY') || ''

if (!SUPABASE_ANON_KEY) {
    console.error("Por favor, defina SUPABASE_ANON_KEY para o teste.")
    Deno.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

async function testFunction() {
    console.log("Iniciando teste da função optimize-resume...")

    const { data, error } = await supabase.functions.invoke('optimize-resume', {
        body: {
            jobDescription: "Desenvolvedor React Senior com experiência em TypeScript e Node.js",
            resumeText: "Desenvolvedor Full Stack com 5 anos de experiência. Stack: React, Node, TypeScript, SQL."
        }
    })

    if (error) {
        console.error("❌ Erro na função:")
        console.error(error)

        if (error instanceof Error && 'context' in error) {
            // @ts-ignore
            const context = error.context;
            if (context && typeof context.json === 'function') {
                const body = await context.json();
                console.error("📄 Detalhes do erro (JSON Body):", body)
            }
        }
    } else {
        console.log("✅ Sucesso! Retorno:")
        console.log(data)
    }
}

testFunction()
