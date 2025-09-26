import mongoose ,{Schema} from "mongoose"

const tenantSchema = new Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  plan: { type: String, enum: ["FREE", "PRO"], default: "FREE" },
});

export const Tenant = mongoose.model("Tenant",tenantSchema)