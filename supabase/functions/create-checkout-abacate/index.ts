
import "jsr:@supabase/functions-js/edge-runtime.d.ts"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const ABACATE_PAY_KEY = Deno.env.get('ABACATE_PAY_KEY') || ""

Deno.serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const { user_email, user_name } = await req.json()

        if (!ABACATE_PAY_KEY) {
            throw new Error('ABACATE_PAY_KEY não configurada no Supabase.')
        }

        const payload: any = {
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
            returnUrl: "http://localhost:3000/profile?success=true",
            completionUrl: "http://localhost:3000/profile?payment=completed",
            customer: {
                name: user_name,
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
        console.log('AbacatePay raw response:', resText)

        let data
        try {
            data = JSON.parse(resText)
        } catch (e) {
            throw new Error(`Resposta inválida do AbacatePay: ${resText}`)
        }

        if (!response.ok) {
            console.error('AbacatePay Error Object:', data)
            throw new Error(`Erro AbacatePay: ${data.message || data.error || JSON.stringify(data)}`)
        }

        const checkoutUrl = data.data?.url || data.url

        return new Response(JSON.stringify({ url: checkoutUrl }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        })

    } catch (error) {
        console.error('Error creating checkout:', error.message)
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 500,
        })
    }
})
