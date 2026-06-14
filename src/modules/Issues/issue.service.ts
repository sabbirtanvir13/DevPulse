
import { pool } from "../../db";

class IssueService {

  // CREATE ISSUE
  createIssue = async (payload: any) => {

    const { title, description, type, reporter_id } = payload;

    const result = await pool.query(
      `
      INSERT INTO issues(
        title,
        description,
        type,
        reporter_id
      )
      VALUES($1,$2,$3,$4)
      RETURNING *
      `,
      [title, description, type, reporter_id]
    );

    return result.rows[0];
  };

  // GET ALL ISSUES
  getAllIssues = async (
    sort = "newest",
    type?: string,
    status?: string
  ) => {

    let query = `SELECT * FROM issues`;

    const values: any[] = [];
    const conditions: string[] = [];

    // filter type
    if (type) {
      values.push(type);
      conditions.push(`type = $${values.length}`);
    }

    // filter status
    if (status) {
      values.push(status);
      conditions.push(`status = $${values.length}`);
    }

    // conditions
    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(" AND ")}`;
    }

    // sorting
    query +=
      sort === "oldest"
        ? ` ORDER BY created_at ASC`
        : ` ORDER BY created_at DESC`;

    const issuesResult = await pool.query(query, values);

    const issues = issuesResult.rows;

    // reporter data
    const reporterIds = [
      ...new Set(issues.map((issue) => issue.reporter_id)),
    ];

    const reporterResult = await pool.query(
      `
      SELECT id,name,role
      FROM users
      WHERE id = ANY($1)
      `,
      [reporterIds]
    );

    const reporterMap = new Map(
      reporterResult.rows.map((user) => [user.id, user])
    );

    return issues.map((issue) => ({
      id: issue.id,
      title: issue.title,
      description: issue.description,
      type: issue.type,
      status: issue.status,
      reporter: reporterMap.get(issue.reporter_id),
      created_at: issue.created_at,
      updated_at: issue.updated_at,
    }));
  };

  // GET SINGLE ISSUE
  getSingleIssue = async (id: number) => {

    const issueResult = await pool.query(
      `
      SELECT *
      FROM issues
      WHERE id = $1
      `,
      [id]
    );

    const issue = issueResult.rows[0];

    if (!issue) {
      return null;
    }

    const reporterResult = await pool.query(
      `
      SELECT id,name,role
      FROM users
      WHERE id = $1
      `,
      [issue.reporter_id]
    );

    const reporter = reporterResult.rows[0];

    return {
      id: issue.id,
      title: issue.title,
      description: issue.description,
      type: issue.type,
      status: issue.status,
      reporter,
      created_at: issue.created_at,
      updated_at: issue.updated_at,
    };
  };

  // GET ISSUE BY ID
  getIssueById = async (id: number) => {

    const result = await pool.query(
      `
      SELECT *
      FROM issues
      WHERE id = $1
      `,
      [id]
    );

    return result.rows[0];
  };




// UPDATE ISSUE
updateIssue = async (
  id: number,
  payload: {
    title?: string;
    description?: string;
    type?: string;
    status?: string;
  }
) => {

  const issue = await this.getIssueById(id);

  if (!issue) {
    return null;
  }

  const title = payload.title ?? issue.title;
  const description =
    payload.description ?? issue.description;
  const type = payload.type ?? issue.type;
  const status = payload.status ?? issue.status;

  const result = await pool.query(
    `
    UPDATE issues
    SET
      title = $1,
      description = $2,
      type = $3,
      status = $4,
      updated_at = NOW()
    WHERE id = $5
    RETURNING *
    `,
    [title, description, type, status, id]
  );

  return result.rows[0];
};


  // DELETE ISSUE
  deleteIssue = async (id: number) => {

    const result = await pool.query(
      `
      DELETE FROM issues
      WHERE id = $1
      RETURNING *
      `,
      [id]
    );

    return result.rows[0];
  };
}

export const issueService = new IssueService();