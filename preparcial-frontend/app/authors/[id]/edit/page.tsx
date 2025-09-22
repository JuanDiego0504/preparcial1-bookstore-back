"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";


type Author = {
  id: number;
  name: string;
  description: string;
  image: string;
  birthDate: string;
};

const API_BASE = "http://127.0.0.1:8080/api";

export default function EditAuthorPage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const params = useParams();
  const id = params?.id;

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      try {
        const res = await fetch(`${API_BASE}/authors/${id}`);
        if (!res.ok) throw new Error("Error cargando autor");
        const data: Author = await res.json();
        setName(data.name);
        setDescription(data.description);
        setImage(data.image);
        setBirthDate(data.birthDate);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Error desconocido");
      }
    };
    load();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE}/authors/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description, image, birthDate }),
      });
      if (!res.ok) throw new Error("Error al actualizar el autor");
      router.push("/authors");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Editar Autor</h1>
      {error && <p className="text-red-600 mb-2">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block font-medium">Nombre</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            className="border p-2 w-full"
            required
          />
        </div>

        <div>
          <label className="block font-medium">Descripción</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="border p-2 w-full"
            required
          />
        </div>

        <div>
          <label className="block font-medium">Imagen (URL)</label>
          <input
            type="text"
            value={image}
            onChange={e => setImage(e.target.value)}
            className="border p-2 w-full"
            required
          />
        </div>

        <div>
          <label className="block font-medium">Fecha de nacimiento</label>
          <input
            type="date"
            value={birthDate}
            onChange={e => setBirthDate(e.target.value)}
            className="border p-2 w-full"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-yellow-600 text-white rounded"
        >
          {loading ? "Guardando..." : "Guardar Cambios"}
        </button>
      </form>
    </div>
  );
}
