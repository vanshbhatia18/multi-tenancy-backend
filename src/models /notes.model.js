import mongoose ,{Schema}from "mongoose";

const NoteSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String },
  tenantId: { type: mongoose.Schema.Types.ObjectId, ref: "Tenant", required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
}, { timestamps: true });

export const Note = mongoose.model("Note", NoteSchema);
