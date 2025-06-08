// This is the server component (no "use client" directive here)
import { EditPostClient } from "./edit-client";

export default function EditPostPage({ params }: { params: { id: string } }) {
  return <EditPostClient id={params.id} />;
}
