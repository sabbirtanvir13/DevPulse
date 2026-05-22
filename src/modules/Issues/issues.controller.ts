import type { Request, Response } from "express";
import { issueService } from "./issue.service";


class IssueController {

  // CREATE ISSUE
  create = async (req: Request, res: Response) => {
    try {
      console.log("USER:", (req as any).user);
  console.log("CREATE ISSUE HIT");
      const user = (req as any).user;

      const result = await issueService.createIssue({
        ...req.body,
        reporter_id: user.id,
      });

      return res.status(201).json({
        success: true,
        message: "Issue created successfully",
        data: result,
      });
    } catch {
      return res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  };

  // GET ALL ISSUES
  getAll = async (req: Request, res: Response) => {
    try {
      const { sort, type, status } = req.query;

      const result = await issueService.getAllIssues(
        sort as string,
        type as string,
        status as string
      );

      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch {
      return res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  };

  // GET SINGLE ISSUE
  getSingleIssue = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);

      const result = await issueService.getSingleIssue(id);

      if (!result) {
        return res.status(404).json({
          success: false,
          message: "Issue not found",
        });
      }

      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch {
      return res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  };

  // UPDATE ISSUE
  updateIssue = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const user = (req as any).user;

      const issue = await issueService.getIssueById(id);

      if (!issue) {
        return res.status(404).json({
          success: false,
          message: "Issue not found",
        });
      }

      // contributor rule
      if (user.role === "contributor") {
        if (issue.reporter_id !== user.id) {
          return res.status(403).json({
            success: false,
            message: "You can update only your own issues",
          });
        }
      }

      const result = await issueService.updateIssue(id, req.body);

      return res.status(200).json({
        success: true,
        message: "Issue updated successfully",
        data: result,
      });
    } catch {
      return res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  };

  // DELETE ISSUE
  deleteIssue = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);

      await issueService.deleteIssue(id);

      return res.status(200).json({
        success: true,
        message: "Issue deleted successfully",
      });
    } catch {
      return res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  };
}

export const issueController = new IssueController();