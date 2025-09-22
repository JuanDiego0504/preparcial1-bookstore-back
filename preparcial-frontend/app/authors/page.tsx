"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";

type Author = {
  id: number;
  name: string;
  description: string;
  image: string;
  birthDate: string; 
};

const API_BASE = "http://127.0.0.1:8080/api";
const HIDDEN_KEY = "hiddenAuthorIds";

// helpers de persistencia
function readHidden(): number[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(HIDDEN_KEY);
    return raw ? (JSON.parse(raw) as number[]) : [];
  } catch {
    return [];
  }
}
function addHidden(id: number) {
  if (typeof window === "undefined") return;
  const curr = readHidden();
  if (!curr.includes(id)) {
    localStorage.setItem(HIDDEN_KEY, JSON.stringify([...curr, id]));
  }
}

export default function AuthorsPage() {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hiddenIds, setHiddenIds] = useState<number[]>([]);

  useEffect(() => {
    setHiddenIds(readHidden());
    const load = async () => {
      try {
        const res = await fetch(`${API_BASE}/authors`, { cache: "no-store" });
        if (!res.ok) throw new Error("Error cargando autores");
        const data: Author[] = await res.json();
        setAuthors(data);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const visibleAuthors = useMemo(
    () => authors.filter((a) => !hiddenIds.includes(a.id)),
    [authors, hiddenIds]
  );

  const handleDelete = async (id: number) => {
    if (!confirm("¿Seguro que deseas eliminar este autor?")) return;

    try {
      const res = await fetch(`${API_BASE}/authors/${id}`, { method: "DELETE" });
      if (res.ok) {
        // borrado real
        setAuthors((prev) => prev.filter((a) => a.id !== id));
        return;
      }
      
      addHidden(id);
      setHiddenIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
      alert(
        "Este autor tiene datos relacionados en la base y no se pudo eliminar.\nLo oculté de la lista para que no aparezca."
      );
    } catch {
      
      addHidden(id);
      setHiddenIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
      alert("Error al eliminar autor. Lo oculté de la lista.");
    }
  };

  if (loading) return <p>Cargando autores...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Autores</h1>
        <Link
          href="/authors/create"
          className="px-3 py-1 bg-green-600 text-white rounded"
        >
          + Crear Autor
        </Link>
      </div>

      {visibleAuthors.length === 0 ? (
        <p className="text-sm text-gray-500">
          No hay autores para mostrar (algunos podrían estar ocultos localmente).
        </p>
      ) : (
        <ul className="space-y-4">
          {visibleAuthors.map((author) => (
            <li
              key={author.id}
              className="border p-4 flex items-center justify-between rounded shadow"
            >
              <div className="flex items-center gap-4">
                <Image
                  src={author.image}
                  alt={author.name}
                  width={60}
                  height={60}
                  unoptimized
                  className="rounded-full object-cover"
                />
                <div>
                  <p className="font-bold">{author.name}</p>
                  <p className="text-sm text-gray-600">{author.description}</p>
                  <p className="text-xs text-gray-400">
                    Nacido: {author.birthDate}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Link
                  href={`/authors/${author.id}/edit`}
                  className="px-3 py-1 bg-yellow-500 text-white rounded"
                >
                  Editar
                </Link>
                <button
                  className="px-3 py-1 bg-red-500 text-white rounded"
                  onClick={() => handleDelete(author.id)}
                >
                  Eliminar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
