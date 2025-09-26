import { Tenant } from "../../models /tenant.model.js";




export const upgradePlan = async(req,res)=> {
  try {
    
    if (req.user.role !== "ADMIN") return res.status(403).json({ message: "Only admins can upgrade plan" });

    const tenant = await Tenant.findOne({ slug: req.params.slug });
    if (!tenant) return res.status(404).json({ message: "Tenant not found" ,success:false});

    tenant.plan = "PRO";
    await tenant.save();

    res.status(201).json({ message: "Tenant upgraded to PRO", plan: tenant.plan });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
}