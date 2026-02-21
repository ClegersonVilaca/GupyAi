
import "jsr:@supabase/functions-js/edge-runtime.d.ts"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

const ABACATE_PAY_KEY = Deno.env.get('ABACATE_PAY_KEY') || ""

Deno.serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders, status: 200 })
    }

    try {
        const { user_email, user_name, baseUrl } = await req.json()
        const appUrl = (baseUrl || "http://localhost:3000").replace(/\/$/, '')

        if (!user_email) {
            return new Response(JSON.stringify({ error: 'Email do usuário é obrigatório.' }), {
                headers: { ...corsHeaders, "Content-Type": "application/json" },
                status: 400,
            })
        }

        if (!ABACATE_PAY_KEY) {
            console.error('ABACATE_PAY_KEY não está configurada.')
            return new Response(JSON.stringify({ error: 'Configuração de pagamento ausente. Contate o suporte.' }), {
                headers: { ...corsHeaders, "Content-Type": "application/json" },
                status: 500,
            })
        }

        const payload = {
            frequency: "ONE_TIME",
            methods: ["PIX", "CARD"],
            products: [
                {
                    externalId: "pro_plan_monthly",
                    name: "GupyAI Pro - Plano Mensal",
                    description: "Acesso ilimitado a todas as ferramentas do GupyAI por 30 dias.",
                    quantity: 1,
                    price: 2990 // R$ 29,90 em centavos
                }
            ],
            returnUrl: `${appUrl}/#/profile?success=true`,
            completionUrl: `${appUrl}/#/profile?payment=completed`,
            customer: {
                name: user_name || user_email.split('@')[0],
                email: user_email
            }
        }

        console.log('Sending payload to AbacatePay:', JSON.stringify(payload))

        const response = await fetch('https://api.abacatepay.com/v1/billing/create', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${ABACATE_PAY_KEY}`
            },
            body: JSON.stringify(payload)
        })

        const resText = await response.text()
        console.log('AbacatePay raw response status:', response.status, 'body:', resText)

        let data: any = {}
        try {
            data = JSON.parse(resText)
        } catch (e) {
            console.error('Failed to parse AbacatePay response:', resText)
            return new Response(JSON.stringify({ error: `Resposta inválida do AbacatePay.` }), {
                headers: { ...corsHeaders, "Content-Type": "application/json" },
                status: 502,
            })
        }

        if (!response.ok) {
            console.error('AbacatePay Error:', data)
            const errMsg = data?.message || data?.error || data?.detail || JSON.stringify(data)
            return new Response(JSON.stringify({ error: `Erro AbacatePay: ${errMsg}` }), {
                headers: { ...corsHeaders, "Content-Type": "application/json" },
                status: 400,
            })
        }

        // AbacatePay retorna a URL no campo data.url ou url
        const checkoutUrl = data?.data?.url || data?.url

        if (!checkoutUrl) {
            console.error('AbacatePay did not return URL. Full response:', data)
            return new Response(JSON.stringify({ error: 'AbacatePay não retornou URL de checkout. Verifique as configurações da conta.' }), {
                headers: { ...corsHeaders, "Content-Type": "application/json" },
                status: 502,
            })
        }

        return new Response(JSON.stringify({ url: checkoutUrl, success: true }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 200,
        })

    } catch (error: any) {
        console.error('Unexpected error creating checkout:', error.message)
        return new Response(JSON.stringify({ error: error.message || 'Erro inesperado.' }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 500,
        })
    }
})
