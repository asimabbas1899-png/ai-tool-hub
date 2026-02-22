import React from "react";
import ReactDOM from "react-dom/client";

function App() {
return (
<div style={{ fontFamily: "system-ui", padding: 16 }}>
<h1 style={{ margin: 0 }}>AI Tool Hub</h1>
<p style={{ marginTop: 8 }}>
Deployed ✅ Next we’ll add “Add link”, extraction, local storage, and credits packs.
</p>
</div>
);
}

ReactDOM.createRoot(document.getElementById("root")!).render(
<React.StrictMode>
<App />
</React.StrictMode>
);
