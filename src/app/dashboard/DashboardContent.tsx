"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

type Bookmark = {
  id: string;
  title: string;
  url: string;
  created_at: string;
};

export default function DashboardContent() {
  const router = useRouter();

  const [email, setEmail] = useState<string | null>(null);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");

  // 🔐 AUTH CHECK + LOAD DATA
  useEffect(() => {
    const init = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      setEmail(user.email ?? null);

      const { data } = await supabase
        .from("bookmarks")
        .select("*")
        .order("created_at", { ascending: false });

      setBookmarks(data ?? []);
      setLoading(false);
    };

    init();
  }, [router, supabase]);

  // ➕ ADD BOOKMARK
  const addBookmark = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !url) return;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data, error } = await supabase
      .from("bookmarks")
      .insert({
        title,
        url,
        user_id: user.id,
      })
      .select()
      .single();

    if (!error && data) {
      setBookmarks((prev) => [data, ...prev]);
      setTitle("");
      setUrl("");
    }
  };

  // ❌ DELETE BOOKMARK
  const deleteBookmark = async (id: string) => {
    await supabase.from("bookmarks").delete().eq("id", id);
    setBookmarks((prev) => prev.filter((b) => b.id !== id));
  };

  // 🚪 LOGOUT
  const logout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  // ⏳ LOADING
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-black">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-orange-50 to-red-100">
      {/* HEADER */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-black">🔖 Smart Bookmark</h1>
          <div className="flex items-center gap-4">
            <span className="text-black">{email}</span>
            <button
              onClick={logout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* ADD BOOKMARK */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4 text-black">➕ Add Bookmark</h2>

          <form onSubmit={addBookmark} className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="Bookmark title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="flex-1 border rounded-lg px-4 py-2 text-black"
            />

            <input
              type="url"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
              className="flex-1 border rounded-lg px-4 py-2 text-black"
            />

            <button
              type="submit"
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg"
            >
              Add
            </button>
          </form>
        </div>

        {/* BOOKMARK LIST */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4 text-black">
            📚 Your Bookmarks ({bookmarks.length})
          </h2>

          {bookmarks.length === 0 ? (
            <p className="text-black">No bookmarks yet.</p>
          ) : (
            <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {bookmarks.map((b) => (
                <li
                  key={b.id}
                  className="border rounded-lg p-4 flex justify-between items-start"
                >
                  <div>
                    <a
                      href={b.url}
                      target="_blank"
                      rel="noreferrer"
                      className="font-semibold underline text-black"
                    >
                      {b.title}
                    </a>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(b.created_at).toLocaleDateString()}
                    </p>
                  </div>

                  <button
                    onClick={() => deleteBookmark(b.id)}
                    className="text-red-600 text-sm"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}