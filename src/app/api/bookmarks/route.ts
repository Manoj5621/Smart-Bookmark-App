import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Force this route to be dynamic - never analyze at build time
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.json({ error: "Missing config" }, { status: 500 });
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    }
  });

  // Try to get token from Authorization header first, then cookies
  const authHeader = request.headers.get("authorization");
  let accessToken = authHeader?.replace("Bearer ", "");
  let refreshToken = "";

  // If no Bearer token, try cookies
  if (!accessToken) {
    const cookieHeader = request.headers.get("cookie") || "";
    accessToken = cookieHeader
      .split("; ")
      .find((c) => c.startsWith("sb-access-token="))
      ?.split("=")[1];
    refreshToken = cookieHeader
      .split("; ")
      .find((c) => c.startsWith("sb-refresh-token="))
      ?.split("=")[1] || "";
  }

  if (!accessToken) {
    return NextResponse.json({ error: "Not authenticated - no token provided" }, { status: 401 });
  }

  // Set the session
  if (refreshToken) {
    await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    });
  }

  // Get the current user
  const { data: { user }, error: userError } = await supabase.auth.getUser(accessToken);

  if (userError || !user) {
    return NextResponse.json({ error: "Invalid token or user not found" }, { status: 401 });
  }

  const { title, url } = await request.json();

  // Insert bookmark with user_id
  const { data, error } = await supabase
    .from("bookmarks")
    .insert([{ 
      title, 
      url, 
      user_id: user.id 
    }])
    .select()
    .single();

  if (error) {
    console.error('Supabase error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
