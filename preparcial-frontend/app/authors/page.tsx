"use client";
import { useEffect, useState } from "react";
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

export default function AuthorsPage() {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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

  const handleDelete = async (id: number) => {
    if (!confirm("¿Seguro que deseas eliminar este autor?")) return;

    try {
      const res = await fetch(`${API_BASE}/authors/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Error eliminando autor");
      setAuthors(prev => prev.filter(a => a.id !== id));
    } catch {
      alert("Error al eliminar autor");
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

      <ul className="space-y-4">
        {authors.map(author => (
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
    </div>
  );
}
