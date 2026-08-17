import { redirect } from "next/navigation";

/** Backend enxuto: a raiz redireciona para o embed de voz. */
export default function Home() {
  redirect("/embed");
}
