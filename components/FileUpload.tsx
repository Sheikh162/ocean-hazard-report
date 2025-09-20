// // components/FileUpload.tsx
// 'use client';

// import { UploadDropzone } from "@uploadthing/react";
// import { OurFileRouter } from "@/app/api/uploadthing/core";
// import { useState } from "react";
// import { toast } from "sonner";
// import { Button } from "./ui/button";
// import { Trash2, File as FileIcon } from "lucide-react";
// import Link from "next/link";
// import { Attachment } from "@prisma/client";
// import axios from "axios";

// interface FileUploadProps {
//   reportId: string;
//   initialAttachments: Attachment[];
// }

// export function FileUpload({ reportId, initialAttachments }: FileUploadProps) {
//   const [attachments, setAttachments] = useState<Attachment[]>(initialAttachments);

//   const handleDelete = async (attachmentId: string) => {
//     try {
//         // Here you would call an API route to delete the attachment from your DB and storage
//         // For example: await axios.delete(`/api/attachments/${attachmentId}`);
//         setAttachments((prev) => prev.filter((a) => a.id !== attachmentId));
//         toast.success("Attachment deleted.");
//     } catch (error) {
//         toast.error("Failed to delete attachment.");
//     }
//   }

//   return (
//     <div className="space-y-6">
//       <div>
//         <h4 className="font-medium text-muted-foreground mb-2">
//           Attached Documents
//         </h4>
//         {attachments.length > 0 ? (
//           <ul className="space-y-2">
//             {attachments.map((attachment) => (
//               <li key={attachment.id} className="flex items-center justify-between p-2 border rounded-md">
//                 <Link href={attachment.url} target="_blank" className="flex items-center gap-2 hover:underline">
//                   <FileIcon className="h-4 w-4" />
//                   <span>{attachment.fileName}</span>
//                 </Link>
//                 <Button variant="ghost" size="icon" onClick={() => handleDelete(attachment.id)}>
//                   <Trash2 className="h-4 w-4 text-destructive" />
//                 </Button>
//               </li>
//             ))}
//           </ul>
//         ) : (
//           <p className="text-sm text-muted-foreground">No documents attached yet.</p>
//         )}
//       </div>

//       <UploadDropzone<OurFileRouter>
//         endpoint="reportAttachment"
//         onClientUploadComplete={(res) => {
//           if (res) {
//             // Here you would typically make an API call to save the new attachment URL to your database,
//             // associated with the current reportId.
//             // For example: axios.post(`/api/me/reports/${reportId}/attachments`, { attachments: res });
//             const newAttachments = res.map(file => ({
//                 id: Math.random().toString(), // temp id
//                 reportId: reportId,
//                 fileName: file.name,
//                 url: file.url,
//                 createdAt: new Date(),
//             }));
//             setAttachments((prev) => [...prev, ...newAttachments]);
//             toast.success("File(s) uploaded successfully!");
//           }
//         }}
//         onUploadError={(error: Error) => {
//           toast.error(`Upload Failed: ${error.message}`);
//         }}
//       />
//     </div>
//   );
// }
