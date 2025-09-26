     import { Tenant } from "../models /tenant.model.js";
     import {Note} from "../models /notes.model.js"






export const createNote = async(req,res) => {
  try {
   
    const tenant = await Tenant.findById(req.user.tenantId);
    if (!tenant) return res.status(404).json({ message: "Tenant not found" });

    // Free plan limit
    if (tenant.plan === "FREE") {
      const count = await Note.countDocuments({ tenantId: tenant._id });
      if (count >= 3) return res.status(403).json({ message: "Free plan limit reached. Upgrade to PRO." });
    }

    const { title, content } = req.body;
    const note = await Note.create({ title, content, tenantId: tenant._id, userId: req.user.id });
    res.status(201).json({data:note,message:"note created",success:true});
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
}

export const getAllNotes= async (req,res)=> {
  try {
   
    const notes = await Note.find({ tenantId: req.user.tenantId }).populate({
      path:"userId",
      select:"role username"
    }).populate({
      path:"tenantId",
      select:"plan slug"
    });
   
    res.status(201).json({message:"fetched all notes",
    success: true,
    data: notes
  });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message,
  success:false });
  }
}
export const getNote = async(req,res)=> {
  try {
    
    const note = await Note.findOne({ _id: req.params.id, tenantId: req.user.tenantId }).populate({
      path:"tenantId",
      select:"name"
    });
    
    if (!note) return res.status(404).json({ message: " found" });
    res.status(201).json({
      data:note,
      message:"note fetched",
      success:true
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message,success:false });
  }
}

export const updateNote = async(req,res) => {
  try {
    
    
    const note = await Note.findOneAndUpdate(
      { _id: req.params.editingId, tenantId: req.user.tenantId },
      req.body,
      { new: true }
    );
    
    if (!note) return res.status(404).json({ message: "Note not found" });
    res.status(201).json({
      message: "note successfully updated",
      success:true,
      data:note
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message ,success:false});
  }
}


export const deleteNote = async(req,res)=> {
  try {
    
    const note = await Note.findOneAndDelete({ _id: req.params.deleteId, tenantId: req.user.tenantId });
      
    if (!note) return res.status(404).json({ message: "Note not found" });
    res.status(201).json({ message: "Note deleted",
             success:true,
         data:note });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
}