


import type { Request, Response } from "express";
import { issueService } from "./issue.service";

class IssueController {

  // CREATE ISSUE
  create = async (req: Request, res: Response) => {
    try {
      const user = req.user;

      const { title, description, type } = req.body;

      // validation
      if (!title || !description || !type) {
        return res.status(400).json({
          success: false,
          message: "All fields are required",
        });
      }

      if (typeof title !== "string" || title.trim().length === 0 || title.trim().length > 150) {
        return res.status(400).json({
          success: false,
          message: "Title cannot exceed 150 characters",
        });
      }

      if (typeof description !== "string" || description.trim().length < 20) {
        return res.status(400).json({
          success: false,
          message: "Description must be at least 20 characters",
        });
      }

      if (typeof type !== "string" || !["bug", "feature_request"].includes(type)) {
        return res.status(400).json({
          success: false,
          message: "Invalid issue type",
        });
      }

      const result = await issueService.createIssue({
        title,
        description,
        type,
        reporter_id: user.id,
      });

      const issueWithReporter = await issueService.getSingleIssue(result.id);

      return res.status(201).json({
        success: true,
        message: "Issue created successfully",
        data: issueWithReporter,
      });

    } catch (error: any) {
      console.log(error);

      return res.status(500).json({
        success: false,
        message: error.message || "Server error",
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

    } catch (error: any) {

      return res.status(500).json({
        success: false,
        message: error.message || "Server error",
      });
    }
  };

  // GET SINGLE ISSUE
  getSingleIssue = async (req: Request, res: Response) => {
    try {

      const id = Number(req.params.id);

      if (isNaN(id) || id <= 0 || !Number.isInteger(id)) {
        return res.status(404).json({
          success: false,
          message: "Issue not found",
        });
      }

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

    } catch (error: any) {

      return res.status(500).json({
        success: false,
        message: error.message || "Server error",
      });
    }
  };



  // UPDATE ISSUE
updateIssue = async (req: Request, res: Response) => {
  try {

    const id = Number(req.params.id);

    if (isNaN(id) || id <= 0 || !Number.isInteger(id)) {
      return res.status(404).json({
        success: false,
        message: "Issue not found",
      });
    }

    const user = req.user;

    const issue = await issueService.getIssueById(id);

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: "Issue not found",
      });
    }

    // Role validation
    if (user.role !== "maintainer" && user.role !== "contributor") {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to update issues",
      });
    }

    // contributor permissions
    if (user.role === "contributor") {

      // own issue only
      if (issue.reporter_id !== user.id) {
        return res.status(403).json({
          success: false,
          message: "You can update only your own issues",
        });
      }

      // only open issue
      if (issue.status !== "open") {
        return res.status(403).json({
          success: false,
          message: "Only open issues can be updated",
        });
      }
    }

    const { title, description, type, status } = req.body;

    // validation
    if (
      title !== undefined &&
      (typeof title !== "string" || title.trim().length === 0 || title.trim().length > 150)
    ) {
      return res.status(400).json({
        success: false,
        message: "Title cannot exceed 150 characters",
      });
    }

    if (
      description !== undefined &&
      (typeof description !== "string" || description.trim().length < 20)
    ) {
      return res.status(400).json({
        success: false,
        message: "Description must be at least 20 characters",
      });
    }

    if (
      type !== undefined &&
      (typeof type !== "string" || !["bug", "feature_request"].includes(type))
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid issue type",
      });
    }

    if (
      status !== undefined &&
      (typeof status !== "string" || !["open", "in_progress", "resolved"].includes(status))
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid issue status",
      });
    }

    await issueService.updateIssue(
      id,
      req.body
    );

    const issueWithReporter = await issueService.getSingleIssue(id);

    return res.status(200).json({
      success: true,
      message: "Issue updated successfully",
      data: issueWithReporter,
    });

  } catch (error: any) {

    return res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

  // DELETE ISSUE
  deleteIssue = async (req: Request, res: Response) => {
    try {

      const id = Number(req.params.id);

      const issue = await issueService.deleteIssue(id);

      if (!issue) {
        return res.status(404).json({
          success: false,
          message: "Issue not found",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Issue deleted successfully",
      });

    } catch (error: any) {

      return res.status(500).json({
        success: false,
        message: error.message || "Server error",
      });
    }
  };
}

export const issueController = new IssueController();