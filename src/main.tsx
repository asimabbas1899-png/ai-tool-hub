import React, { useEffect, useMemo, useState } from "react";
import ReactDOM from "react-dom/client";

type Tool = {
id: string;
url: string; // locked
createdAt: number;
name: string;
description: string;
category: string;
tags: string[];
usefulness: number;
popularity: number;
};

const STORAGE_KEY = "ai-tool-hub:v1";

function normalizeUrl(input: string) {
return input
.trim()
.replace(/^https?:\/\//i, "")
.replace(/^www\./i, "")
.replace(/\/+$/g, "")
.toLowerCase();
}

function App() {
const [theme, setTheme] = useState<"light" | "dark">("light");
const [query, setQuery] = useState("");
const [tools, setTools] = useState<Tool[]>([]);
const [isModalOpen, setIsModalOpen] = useState(false);
const [newUrl, setNewUrl] = useState("");
const [error, setError] = useState<string | null>(null);
const [selectedId, setSelectedId] = useState<string | null>(null);

useEffect(() => {
const raw = localStorage.getItem(STORAGE_KEY);
if (raw) setTools(JSON.parse(raw));
}, []);

useEffect(() => {
localStorage.setItem(STORAGE_KEY, JSON.stringify(tools));
}, [tools]);

useEffect(() => {
document.documentElement.dataset.theme = theme;
}, [theme]);

const filtered = useMemo(() => {
const q = query.trim().toLowerCase();
return tools
.slice()
.sort((a, b) => b.createdAt - a.createdAt)
.filter((t) => {
if (!q) return true;
return (
t.name.toLowerCase().includes(q) ||
t.description.toLowerCase().includes(q) ||
t.category.toLowerCase().includes(q) ||
t.tags.join(" ").toLowerCase().includes(q) ||
t.url.toLowerCase().includes(q)
);
});
}, [tools, query]);

const selected = useMemo(() => {
return tools.find((t) => t.id === selectedId) || null;
}, [tools, selectedId]);

function addTool() {
setError(null);
const normalized = normalizeUrl(newUrl);
if (!normalized) {
setError("Paste a valid link.");
return;
}
const exists = tools.some((t) => normalizeUrl(t.url) === normalized);
if (exists) {
setError("This link already exists in your library.");
return;
}

const now = Date.now();
const tool: Tool = {
id: crypto.randomUUID(),
url: newUrl.trim(),
createdAt: now,
name: normalized.split("/")[0] || "New tool",
description: "",
category: "",
tags: [],
usefulness: Math.floor(35 + Math.random() * 50),
popularity: Math.floor(35 + Math.random() * 50)
};

setTools((prev) => [tool, ...prev]);
setIsModalOpen(false);
setNewUrl("");
}

const colors =
theme === "dark"
? {
bg: "#0b0c10",
card: "#14161f",
text: "#f3f4f6",
sub: "#a1a1aa",
border: "rgba(255,255,255,0.08)",
yellowBg: "rgba(250, 204, 21, 0.16)",
yellowText: "#fde68a",
btn: "#ff979d"
}
: {
bg: "#ffffff",
card: "#ffffff",
text: "#111827",
sub: "#6b7280",
border: "rgba(0,0,0,0.08)",
yellowBg: "rgba(250, 204, 21, 0.22)",
yellowText: "#92400e",
btn: "#ff5d6a"
};

if (selected) {
return (
<div style={{ minHeight: "100vh", background: colors.bg, color: colors.text }}>
<div style={{ maxWidth: 980, margin: "0 auto", padding: 16 }}>
<button
onClick={() => setSelectedId(null)}
style={{
border: `1px solid ${colors.border}`,
background: "transparent",
color: colors.text,
padding: "8px 10px",
borderRadius: 10,
cursor: "pointer",
fontWeight: 800
}}
>
Back
</button>
<div style={{ fontSize: 12, color: colors.sub, marginTop: 10 }}>Saved</div>
<div style={{ height: 12 }} />

<div style={{ fontWeight: 900, fontSize: 18 }}>
{selected.name || "Untitled"}
</div>

<div style={{ marginTop: 8, fontSize: 13, color: colors.sub, wordBreak: "break-word" }}>
{selected.url}
</div>

<div style={{ height: 14 }} />

<div style={{ fontSize: 12, color: colors.sub }}>Name</div>
<input
value={selected.name}
onChange={(e) => {
const v = e.target.value;
setTools((prev) =>
prev.map((t) => (t.id === selected.id ? { ...t, name: v } : t))
);
}}
style={{
width: "100%",
padding: "12px 12px",
borderRadius: 12,
border: `1px solid ${colors.border}`,
outline: "none",
background: theme === "dark" ? "#0f1118" : "#fff",
color: colors.text
}}
/>

<div style={{ height: 12 }} />

<div style={{ fontSize: 12, color: colors.sub }}>Description</div>
<textarea
value={selected.description}
onChange={(e) => {
const v = e.target.value;
setTools((prev) =>
prev.map((t) => (t.id === selected.id ? { ...t, description: v } : t))
);
}}
rows={6}
style={{
width: "100%",
padding: "12px 12px",
borderRadius: 12,
border: `1px solid ${colors.border}`,
outline: "none",
background: theme === "dark" ? "#0f1118" : "#fff",
color: colors.text
}}
/>
  <div style={{ height: 12 }} />

<div style={{ fontSize: 12, color: colors.sub }}>Category</div>
<input
value={selected.category}
onChange={(e) => {
const v = e.target.value;
setTools((prev) =>
prev.map((t) => (t.id === selected.id ? { ...t, category: v } : t))
);
}}
placeholder="e.g. Writing"
style={{
width: "100%",
padding: "12px 12px",
borderRadius: 12,
border: `1px solid ${colors.border}`,
outline: "none",
background: theme === "dark" ? "#0f1118" : "#fff",
color: colors.text
}}
/>

<div style={{ height: 12 }} />

<div style={{ fontSize: 12, color: colors.sub }}>Tags (comma separated)</div>
<input
value={selected.tags.join(", ")}
onChange={(e) => {
const tags = e.target.value
.split(",")
.map((x) => x.trim())
.filter(Boolean);
setTools((prev) =>
prev.map((t) => (t.id === selected.id ? { ...t, tags } : t))
);
}}
placeholder="e.g. SEO, Email, Copywriting"
style={{
width: "100%",
padding: "12px 12px",
borderRadius: 12,
border: `1px solid ${colors.border}`,
outline: "none",
background: theme === "dark" ? "#0f1118" : "#fff",
color: colors.text
}}
/>

<div style={{ height: 14 }} />

<div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
<div style={{ flex: 1, minWidth: 220 }}>
<div style={{ display: "flex", justifyContent: "space-between" }}>
<div style={{ fontSize: 12, color: colors.sub }}>Usefulness</div>
<div style={{ fontSize: 12, color: colors.sub }}>{selected.usefulness}%</div>
</div>
<input
type="range"
min={0}
max={100}
value={selected.usefulness}
onChange={(e) => {
const v = Number(e.target.value);
setTools((prev) =>
prev.map((t) => (t.id === selected.id ? { ...t, usefulness: v } : t))
);
}}
style={{
width: "100%",
marginTop: 6,
accentColor: theme === "dark" ? "#ff979d" : "#ff5d6a"
}}
/>
</div>

<div style={{ flex: 1, minWidth: 220 }}>
<div style={{ display: "flex", justifyContent: "space-between" }}>
<div style={{ fontSize: 12, color: colors.sub }}>Popularity</div>
<div style={{ fontSize: 12, color: colors.sub }}>{selected.popularity}%</div>
</div>
<input
type="range"
min={0}
max={100}
value={selected.popularity}
onChange={(e) => {
const v = Number(e.target.value);
setTools((prev) =>
prev.map((t) => (t.id === selected.id ? { ...t, popularity: v } : t))
);
}}
style={{
width: "100%",
marginTop: 6,
accentColor: theme === "dark" ? "#a78bfa" : "#7c3aed"
}}
/>
</div>
</div>
</div>
</div>
);
}

return (
<div style={{ minHeight: "100vh", background: colors.bg, color: colors.text }}>
<div style={{ maxWidth: 980, margin: "0 auto", padding: 16 }}>
<div style={{ display: "flex", alignItems: "center", gap: 12 }}>
<div style={{ flex: 1 }}>
<div style={{ fontSize: 18, fontWeight: 700 }}>AI Tool Hub</div>
<div style={{ fontSize: 13, color: colors.sub, marginTop: 2 }}>
Your personal AI tools library
</div>
</div>

<button
onClick={() => setTheme((t) => (t === "light" ? "dark" : "light"))}
style={{
border: `1px solid ${colors.border}`,
background: "transparent",
color: colors.text,
padding: "8px 10px",
borderRadius: 10,
cursor: "pointer"
}}
>
{theme === "light" ? "Dark" : "Light"}
</button>

<button
onClick={() => {
setError(null);
setIsModalOpen(true);
}}
style={{
border: "none",
background: colors.btn,
color: "#fff",
padding: "10px 12px",
borderRadius: 10,
cursor: "pointer",
fontWeight: 700
}}
>
Add link
</button>
</div>

<div style={{ height: 14 }} />

<input
value={query}
onChange={(e) => setQuery(e.target.value)}
placeholder="Search tools, tags, category..."
style={{
width: "100%",
padding: "12px 12px",
borderRadius: 12,
border: `1px solid ${colors.border}`,
outline: "none",
background: theme === "dark" ? "#0f1118" : "#fff",
color: colors.text
}}
/>

<div style={{ height: 12 }} />

<div
style={{
background: colors.yellowBg,
border: `1px solid ${colors.border}`,
color: colors.yellowText,
padding: 12,
borderRadius: 12,
fontSize: 13
}}
>
Some details may be unavailable (logins/dynamic pages).
</div>

<div style={{ height: 14 }} />

{filtered.length === 0 ? (
<div
style={{
border: `1px dashed ${colors.border}`,
borderRadius: 14,
padding: 18,
color: colors.sub
}}
>
No tools yet. Tap “Add link” to start.
</div>
) : (
<div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 12 }}>
{filtered.map((t) => (
<div
key={t.id}
onClick={() => setSelectedId(t.id)}
style={{
background: colors.card,
border: `1px solid ${colors.border}`,
borderRadius: 14,
padding: 14
}}
>
<div style={{ display: "flex", gap: 10, alignItems: "baseline" }}>
<div style={{ fontWeight: 800 }}>{t.name || "Untitled"}</div>
{t.category ? (
<div
style={{
fontSize: 12,
padding: "2px 8px",
borderRadius: 999,
border: `1px solid ${colors.border}`,
color: colors.sub
}}
>
{t.category}
</div>
) : null}
</div>
<div style={{ marginTop: 6, fontSize: 13, color: colors.sub }}>
{t.url}
</div>
{t.description ? (
<div style={{ marginTop: 10, fontSize: 14, lineHeight: 1.35 }}>
{t.description}
</div>
) : null}
</div>
))}
</div>
)}

{isModalOpen ? (
<div
onClick={() => setIsModalOpen(false)}
style={{
position: "fixed",
inset: 0,
background: "rgba(0,0,0,0.45)",
display: "flex",
alignItems: "flex-end",
justifyContent: "center",
padding: 16
}}
>
<div
onClick={(e) => e.stopPropagation()}
style={{
width: "100%",
maxWidth: 980,
background: colors.card,
border: `1px solid ${colors.border}`,
borderRadius: 16,
padding: 14
}}
>
<div style={{ fontWeight: 800 }}>Add a tool</div>
<div style={{ marginTop: 10 }}>
<input
value={newUrl}
onChange={(e) => setNewUrl(e.target.value)}
placeholder="Paste the official tool URL..."
style={{
width: "100%",
padding: "12px 12px",
borderRadius: 12,
border: `1px solid ${colors.border}`,
outline: "none",
background: theme === "dark" ? "#0f1118" : "#fff",
color: colors.text
}}
/>
{error ? (
<div style={{ marginTop: 8, color: theme === "dark" ? "#fca5a5" : "#b91c1c", fontSize: 13 }}>
{error}
</div>
) : null}
</div>

<div style={{ display: "flex", gap: 10, marginTop: 12 }}>
<button
onClick={() => setIsModalOpen(false)}
style={{
flex: 1,
border: `1px solid ${colors.border}`,
background: "transparent",
color: colors.text,
padding: "10px 12px",
borderRadius: 12,
cursor: "pointer",
fontWeight: 700
}}
>
Cancel
</button>
<button
onClick={addTool}
style={{
flex: 1,
border: "none",
background: colors.btn,
color: "#fff",
padding: "10px 12px",
borderRadius: 12,
cursor: "pointer",
fontWeight: 800
}}
>
Add
</button>
</div>
</div>
</div>
) : null}
</div>
</div>
);
}

ReactDOM.createRoot(document.getElementById("root")!).render(
<React.StrictMode>
<App />
</React.StrictMode>
);
