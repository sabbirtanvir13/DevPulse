import { Router } from "express";
import auth from "../../middleware/auth.middleware.js";
import { issueController } from "./issues.controller.js";
import { isMaintainer } from "../../middleware/isMaintainer.js";

const router = Router();



// Create issue
router.post("/", auth(), issueController.create);

// Get all issues
router.get("/", issueController.getAll);

// Get single issue
router.get("/:id", issueController.getSingleIssue);

// Update issue
router.patch("/:id", auth(), issueController.updateIssue);

// Delete issue
router.delete("/:id", auth(), isMaintainer, issueController.deleteIssue);


export const issueRouter= router