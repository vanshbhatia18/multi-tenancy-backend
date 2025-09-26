import { createNote,getAllNotes,updateNote,deleteNote,getNote } from "../controllers/tenant.controller.js";
import { jwtVerify } from "../middlewares/auth.middleware.js";
import Router  from "express";
import { upgradePlan } from "../controllers/upgradeContoller/upgrade.controller.js";
const router = Router();

router.route("/allNotes").get(jwtVerify,getAllNotes);
router.route("/addNote").post(jwtVerify,createNote);
router.route("/:id").get(jwtVerify,getNote);
router.route("/deleteNote/:deleteId").delete(jwtVerify,deleteNote);
router.route("/:editingId").put(jwtVerify,updateNote);
router.route("/upgradePlan/:slug").put(jwtVerify,upgradePlan)
export default router;


