import { proxyMaterialStream } from "@/app/lib/mediaProxy";

export async function GET(request: Request, { params }: { params: Promise<{ materialId: string }> }) {
  const { materialId } = await params;
  return proxyMaterialStream(request, materialId, "video");
}
