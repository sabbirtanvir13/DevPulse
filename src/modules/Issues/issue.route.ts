
import { Router } from "express";
import auth from "../../middleware/auth.middleware";
import { isMaintainer } from "../../middleware/isMaintainer";
import { issueController } from "./issues.controller";

const router = Router();

// create issue
router.post(
  "/",
  auth(),
  issueController.create
);

// get all issues
router.get(
  "/",
  issueController.getAll
);

// get single issue
router.get(
  "/:id",
  issueController.getSingleIssue
);

// update issue
router.patch(
  "/:id",
  auth(),
  issueController.updateIssue
);

// delete issue
router.delete(
  "/:id",
  auth(),
  isMaintainer,
  issueController.deleteIssue
);

export const issueRouter = router;