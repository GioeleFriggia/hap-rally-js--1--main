// app/gallery/page.jsx
import GalleryDrive from "@/components/GalleryDrive";

export const metadata = {
  title: "Gallery",
  description: "Galleria foto (Google Drive) – Team Pinna Corse",
};

export default function GalleryPage() {
  return <GalleryDrive />;
}
