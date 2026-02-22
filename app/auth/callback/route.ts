import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  // Se houver um parâmetro "next", redireciona para lá após o login, senão vai para o dashboard
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options),
              );
            } catch {
              // O método `setAll` foi chamado de um Server Component.
              // Isto pode ser ignorado se tiveres middleware a atualizar as sessões.
            }
          },
        },
      },
    );

    // Troca o código por uma sessão
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Se houver erro, redireciona para a home com uma mensagem de erro (opcional)
  return NextResponse.redirect(`${origin}/login?error=auth_code_error`);
}
