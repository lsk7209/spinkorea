import { useParams } from "react-router-dom";
import Home from "@/pages/Home";
import NotFound from "@/pages/NotFound";
import { getPresetIdForSlug } from "@/data/spinflow-presets";

/** /spinflow/:slug — only known preset aliases render the roulette. */
export default function SpinflowPreset() {
  const { slug } = useParams();
  return getPresetIdForSlug(slug) ? <Home /> : <NotFound />;
}
