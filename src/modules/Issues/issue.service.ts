import { pool } from "../../db";

class IssueService {
  // CREATE
  createIssue = async (payload: any) => {
    const { title, description, type, reporter_id } = payload;

    const result = await pool.query(
      `
      INSERT INTO issues (title, description, type, reporter_id)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
      `,
      [title, description, type, reporter_id]
    );
   console.log("SERVICE HIT", result);
    return result.rows[0];
  };

  

  // GET ALL
  getAllIssues = async (
    sort = "newest",
    type?: string,
    status?: string
  ) => {
    let query = `SELECT * FROM issues`;
    const values: any[] = [];
    const conditions: string[] = [];

    if (type) {
      values.push(type);
      conditions.push(`type = $${values.length}`);
    }

    if (status) {
      values.push(status);
      conditions.push(`status = $${values.length}`);
    }

    if (conditions.length) {
      query += ` WHERE ${conditions.join(" AND ")}`;
    }

    query +=
      sort === "oldest"
        ? ` ORDER BY created_at ASC`
        : ` ORDER BY created_at DESC`;

    const result = await pool.query(query, values);
    return result.rows;
  };

  // GET SINGLE
  getSingleIssue = async (id: number) => {
    const result = await pool.query(
      `SELECT * FROM issues WHERE id=$1`,
      [id]
    );

    return result.rows[0] || null;
  };

  // GET BY ID (for auth check)
  getIssueById = async (id: number) => {
    const result = await pool.query(
      `SELECT * FROM issues WHERE id=$1`,
      [id]
    );

    return result.rows[0];
  };

  // UPDATE
  updateIssue = async (id: number, payload: any) => {
    const { title, description, type } = payload;

    const result = await pool.query(
      `
      UPDATE issues
      SET title=$1, description=$2, type=$3, updated_at=NOW()
      WHERE id=$4
      RETURNING *;
      `,
      [title, description, type, id]
    );

    return result.rows[0];
  };

  // DELETE
  deleteIssue = async (id: number) => {
    const result = await pool.query(
      `DELETE FROM issues WHERE id=$1 RETURNING *`,
      [id]
    );

    return result.rows[0];
  };
}

export const issueService = new IssueService();