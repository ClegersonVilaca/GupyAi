
import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from 'jsr:@supabase/supabase-js@2'

const supabaseUrl = Deno.env.get('SUPABASE_URL') || ""
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ""

Deno.serve(async (req) => {
    try {
        const payload = await req.json()
        console.log('AbacatePay Webhook received:', JSON.stringify(payload))

        // Validar evento. AbacatePay envia evento tipo 'billing.status.changed' ou similar
        // Verificando estrutura comum: payload.event e payload.data
        const event = payload.event
        const data = payload.data

        if (event === 'billing.status.changed' && data.status === 'paid') {
            const userEmail = data.customer.email

            const supabase = createClient(supabaseUrl, supabaseServiceKey)

            // 1. Buscar usuário pelo email
            const { data: userData, error: userError } = await supabase
                .from('profiles')
                .select('id')
                .eq('email', userEmail)
                .maybeSingle()

            // Nota: Se o email não estiver na tabela profiles (apenas auth), podemos buscar no auth.users
            // mas como temos sincronização de profiles, vamos tentar por lá primeiro.

            let userId = userData?.id

            if (!userId) {
                // Fallback: tentar buscar no auth.users via admin API se necessário
                // Por simplicidade, assumimos que o registro em profiles existe ou buscamos no auth
                const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers()
                const user = authUsers.users.find(u => u.email === userEmail)
                if (user) userId = user.id
            }

            if (userId) {
                // 2. Atualizar status Pro
                const { error: updateError } = await supabase
                    .from('profiles')
                    .update({ is_pro_user: true })
                    .eq('id', userId)

                if (updateError) throw updateError

                console.log(`User ${userEmail} (${userId}) is now PRO!`)
            } else {
                console.error(`User with email ${userEmail} not found.`)
            }
        }

        return new Response(JSON.stringify({ received: true }), {
            headers: { "Content-Type": "application/json" },
            status: 200,
        })

    } catch (error) {
        console.error('Webhook Error:', error.message)
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { "Content-Type": "application/json" },
            status: 500,
        })
    }
})
