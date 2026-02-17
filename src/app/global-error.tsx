"use client";

export const revalidate = 0;

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div style={{ textAlign: "center", padding: "50px" }}>
          <h2>Qualcosa è andato storto!</h2>
          <p>{error.message}</p>
          <button onClick={() => reset()}>Riprova</button>
        </div>
      </body>
    </html>
  );
}
