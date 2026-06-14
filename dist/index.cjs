
   import { createRequire } from 'module';
   const require = createRequire(import.meta.url);
  
"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// src/app.ts
var import_express4 = __toESM(require("express"), 1);

// src/modules/user/user.route.ts
var import_express = require("express");

// src/db/index.ts
var import_pg = require("pg");

// src/config/index.ts
var import_dotenv = __toESM(require("dotenv"), 1);
var import_process = require("process");
import_dotenv.default.config({ quiet: true });
var config = {
  port: import_process.env.PORT,
  database_url: import_process.env.DATABASE_URL,
  secret: import_process.env.JWT_SECRET
};
console.log(process.env.PORT);
var config_default = config;

// src/db/index.ts
var pool = new import_pg.Pool({
  connectionString: config_default.database_url
});
var initDB = async () => {
  await pool.query(
    `
   CREATE TABLE IF NOT EXISTS users(
      id SERIAL UNIQUE PRIMARY KEY,
      name VARCHAR(50) NOT NULL,
      email VARCHAR(50) UNIQUE NOT NULL,
      password VARCHAR(255)  NOT NULL,
      role VARCHAR(30) NOT NULL DEFAULT 'contributor' ,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
      )
    `
  );
  await pool.query(`
      CREATE TABLE IF NOT EXISTS issues(
      id SERIAL UNIQUE  PRIMARY KEY,
      title VARCHAR(150) NOT NULL,
      description TEXT NOT NULL 
      CHECK(LENGTH(description) >=20),
       type VARCHAR(20) NOT NULL
       CHECK(type IN ('bug','feature_request')) ,
      status VARCHAR(15) NOT NULL DEFAULT 'open'
      CHECK(status IN ('open','in_progress','resolved')) ,
      reporter_id INTEGER NOT NULL,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
      )
      `);
  console.log("DataBase connected ");
};

// src/modules/user/user.service.ts
var import_bcrypt = __toESM(require("bcrypt"), 1);
var createUserIntoDB = async (paylood) => {
  const { name, email, password, role } = paylood;
  const hashPassword = await import_bcrypt.default.hash(password, 20);
  const result = await pool.query(
    `
      INSERT INTO users(name,email,password,role)
      VALUES($1,$2,$3,$4)
      RETURNING *
      `,
    [name, email, hashPassword, role]
  );
  delete result.rows[0].password;
  return result;
};
var getAllUsersFromDB = async () => {
  const result = await pool.query(`
      SELECT * FROM users  
        `);
  return result;
};
var getSingleUserFromDB = async (id) => {
  const result = await pool.query(
    `
         SELECT * FROM users WHERE id =$1
        `,
    [id]
  );
  return result;
};
var userService = {
  createUserIntoDB,
  getAllUsersFromDB,
  getSingleUserFromDB
};

// src/modules/user/user.controller.ts
var createUser = async (req, res) => {
  try {
    const result = await userService.createUserIntoDB(req.body);
    res.status(201).json({
      success: true,
      message: "User Created successfully!",
      data: result.rows[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
var getAllUser = async (req, res) => {
  try {
    const result = await userService.getAllUsersFromDB();
    res.status(200).json({
      success: true,
      message: "Users retrived successfully!",
      data: result.rows
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      error
    });
  }
};
var getSingleUser = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await userService.getSingleUserFromDB(id);
    if (result.rows.length === 0) {
      res.status(500).json({
        success: false,
        message: "User Not Found!",
        data: {}
      });
    }
    res.status(200).json({
      success: true,
      message: "User retrived successfully!",
      data: result.rows[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      error
    });
  }
};
var userController = {
  createUser,
  getAllUser,
  getSingleUser
};

// src/middleware/auth.middleware.ts
var import_jsonwebtoken = __toESM(require("jsonwebtoken"), 1);
var auth = () => {
  return async (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access!!"
      });
    }
    const jwtToken = token.split(" ")[1];
    if (!jwtToken) {
      return res.status(401).json({
        success: false,
        message: "Token missing"
      });
    }
    try {
      const decoded = import_jsonwebtoken.default.verify(
        jwtToken,
        config_default.secret
      );
      const userData = await pool.query(
        `SELECT * FROM users WHERE id=$1`,
        [decoded.id]
      );
      if (userData.rows.length === 0) {
        return res.status(401).json({
          success: false,
          message: "User not found"
        });
      }
      req.user = userData.rows[0];
      console.log("USER SET:", req.user);
      next();
    } catch (error) {
      console.log("JWT ERROR:", error);
      return res.status(401).json({
        success: false,
        message: "Invalid token"
      });
    }
  };
};
var auth_middleware_default = auth;

// src/modules/user/user.route.ts
var router = (0, import_express.Router)();
router.post("/", userController.createUser);
router.get("/", auth_middleware_default(), userController.getAllUser);
router.get("/:id", userController.getSingleUser);
var userRouter = router;

// src/modules/auth/auth.route.ts
var import_express2 = require("express");

// src/modules/auth/auth.service.ts
var import_jsonwebtoken2 = __toESM(require("jsonwebtoken"), 1);
var import_bcrypt2 = __toESM(require("bcrypt"), 1);
var loginUserIntoDB = async (payload) => {
  const { email, password } = payload;
  const userData = await pool.query(
    `SELECT * FROM users WHERE email=$1`,
    [email]
  );
  if (userData.rows.length === 0) {
    throw new Error("Invalid Credentials!");
  }
  const user = userData.rows[0];
  const matchPassword = await import_bcrypt2.default.compare(
    password,
    user.password
  );
  if (!matchPassword) {
    throw new Error("Invalid Credentials!");
  }
  const jwtPayload = {
    id: user.id,
    name: user.name,
    role: user.role,
    email: user.email
  };
  const token = import_jsonwebtoken2.default.sign(
    jwtPayload,
    config_default.secret,
    {
      expiresIn: "1d"
    }
  );
  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  };
};
var createUserIntoDB2 = async (payload) => {
  const { name, email, password, role } = payload;
  const hashedPassword = await import_bcrypt2.default.hash(password, 10);
  const result = await pool.query(
    `
    INSERT INTO users(name,email,password,role)
    VALUES($1,$2,$3,$4)
    RETURNING id,name,email,role,created_at,updated_at
    `,
    [name, email, hashedPassword, role]
  );
  return result.rows[0];
};
var authService = {
  loginUserIntoDB,
  createUserIntoDB: createUserIntoDB2
};

// src/modules/auth/auth.controller.ts
var loginUser = async (req, res) => {
  try {
    const result = await authService.loginUserIntoDB(req.body);
    res.status(200).json({
      success: true,
      message: "Login successful",
      data: result
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message
    });
  }
};
var createUser2 = async (req, res) => {
  try {
    const result = await authService.createUserIntoDB(req.body);
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
var authController = {
  loginUser,
  createUser: createUser2
};

// src/modules/auth/auth.route.ts
var router2 = (0, import_express2.Router)();
router2.post("/login", authController.loginUser);
router2.post("/signup", authController.createUser);
var authRouter = router2;

// src/middleware/logger.ts
var import_fs = __toESM(require("fs"), 1);
var logger = (req, res, next) => {
  console.log("mathed_url_time", req.method, req.url, Date.now());
  const log = ` 
Method ->${req.method} Time ->${Date.now()} Url${req.url}
 `;
  import_fs.default.appendFile("logger.txt", log, (error) => {
    console.log(error);
  });
  next();
};
var logger_default = logger;

// src/modules/Issues/issue.route.ts
var import_express3 = require("express");

// src/middleware/isMaintainer.ts
var isMaintainer = (req, res, next) => {
  const user = req.user;
  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  if (user.role !== "maintainer") {
    return res.status(403).json({ message: "Only maintainer allowed" });
  }
  next();
};

// src/modules/Issues/issue.service.ts
var IssueService = class {
  // CREATE ISSUE
  createIssue = async (payload) => {
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
  getAllIssues = async (sort = "newest", type, status) => {
    let query = `SELECT * FROM issues`;
    const values = [];
    const conditions = [];
    if (type) {
      values.push(type);
      conditions.push(`type = $${values.length}`);
    }
    if (status) {
      values.push(status);
      conditions.push(`status = $${values.length}`);
    }
    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(" AND ")}`;
    }
    query += sort === "oldest" ? ` ORDER BY created_at ASC` : ` ORDER BY created_at DESC`;
    const issuesResult = await pool.query(query, values);
    const issues = issuesResult.rows;
    const reporterIds = [
      ...new Set(issues.map((issue) => issue.reporter_id))
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
      updated_at: issue.updated_at
    }));
  };
  // GET SINGLE ISSUE
  getSingleIssue = async (id) => {
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
      updated_at: issue.updated_at
    };
  };
  // GET ISSUE BY ID
  getIssueById = async (id) => {
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
  updateIssue = async (id, payload) => {
    const issue = await this.getIssueById(id);
    if (!issue) {
      return null;
    }
    const title = payload.title ?? issue.title;
    const description = payload.description ?? issue.description;
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
  deleteIssue = async (id) => {
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
};
var issueService = new IssueService();

// src/modules/Issues/issues.controller.ts
var IssueController = class {
  // CREATE ISSUE
  create = async (req, res) => {
    try {
      const user = req.user;
      const { title, description, type } = req.body;
      if (!title || !description || !type) {
        return res.status(400).json({
          success: false,
          message: "All fields are required"
        });
      }
      if (typeof title !== "string" || title.trim().length === 0 || title.trim().length > 150) {
        return res.status(400).json({
          success: false,
          message: "Title cannot exceed 150 characters"
        });
      }
      if (typeof description !== "string" || description.trim().length < 20) {
        return res.status(400).json({
          success: false,
          message: "Description must be at least 20 characters"
        });
      }
      if (typeof type !== "string" || !["bug", "feature_request"].includes(type)) {
        return res.status(400).json({
          success: false,
          message: "Invalid issue type"
        });
      }
      const result = await issueService.createIssue({
        title,
        description,
        type,
        reporter_id: user.id
      });
      const issueWithReporter = await issueService.getSingleIssue(result.id);
      return res.status(201).json({
        success: true,
        message: "Issue created successfully",
        data: issueWithReporter
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: error.message || "Server error"
      });
    }
  };
  // GET ALL ISSUES
  getAll = async (req, res) => {
    try {
      const { sort, type, status } = req.query;
      const result = await issueService.getAllIssues(
        sort,
        type,
        status
      );
      return res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message || "Server error"
      });
    }
  };
  // GET SINGLE ISSUE
  getSingleIssue = async (req, res) => {
    try {
      const id = Number(req.params.id);
      if (isNaN(id) || id <= 0 || !Number.isInteger(id)) {
        return res.status(404).json({
          success: false,
          message: "Issue not found"
        });
      }
      const result = await issueService.getSingleIssue(id);
      if (!result) {
        return res.status(404).json({
          success: false,
          message: "Issue not found"
        });
      }
      return res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message || "Server error"
      });
    }
  };
  // UPDATE ISSUE
  updateIssue = async (req, res) => {
    try {
      const id = Number(req.params.id);
      if (isNaN(id) || id <= 0 || !Number.isInteger(id)) {
        return res.status(404).json({
          success: false,
          message: "Issue not found"
        });
      }
      const user = req.user;
      const issue = await issueService.getIssueById(id);
      if (!issue) {
        return res.status(404).json({
          success: false,
          message: "Issue not found"
        });
      }
      if (user.role !== "maintainer" && user.role !== "contributor") {
        return res.status(403).json({
          success: false,
          message: "You do not have permission to update issues"
        });
      }
      if (user.role === "contributor") {
        if (issue.reporter_id !== user.id) {
          return res.status(403).json({
            success: false,
            message: "You can update only your own issues"
          });
        }
        if (issue.status !== "open") {
          return res.status(403).json({
            success: false,
            message: "Only open issues can be updated"
          });
        }
      }
      const { title, description, type, status } = req.body;
      if (title !== void 0 && (typeof title !== "string" || title.trim().length === 0 || title.trim().length > 150)) {
        return res.status(400).json({
          success: false,
          message: "Title cannot exceed 150 characters"
        });
      }
      if (description !== void 0 && (typeof description !== "string" || description.trim().length < 20)) {
        return res.status(400).json({
          success: false,
          message: "Description must be at least 20 characters"
        });
      }
      if (type !== void 0 && (typeof type !== "string" || !["bug", "feature_request"].includes(type))) {
        return res.status(400).json({
          success: false,
          message: "Invalid issue type"
        });
      }
      if (status !== void 0 && (typeof status !== "string" || !["open", "in_progress", "resolved"].includes(status))) {
        return res.status(400).json({
          success: false,
          message: "Invalid issue status"
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
        data: issueWithReporter
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message || "Server error"
      });
    }
  };
  // DELETE ISSUE
  deleteIssue = async (req, res) => {
    try {
      const id = Number(req.params.id);
      const issue = await issueService.deleteIssue(id);
      if (!issue) {
        return res.status(404).json({
          success: false,
          message: "Issue not found"
        });
      }
      return res.status(200).json({
        success: true,
        message: "Issue deleted successfully"
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message || "Server error"
      });
    }
  };
};
var issueController = new IssueController();

// src/modules/Issues/issue.route.ts
var router3 = (0, import_express3.Router)();
router3.post(
  "/",
  auth_middleware_default(),
  issueController.create
);
router3.get(
  "/",
  issueController.getAll
);
router3.get(
  "/:id",
  issueController.getSingleIssue
);
router3.patch(
  "/:id",
  auth_middleware_default(),
  issueController.updateIssue
);
router3.delete(
  "/:id",
  auth_middleware_default(),
  isMaintainer,
  issueController.deleteIssue
);
var issueRouter = router3;

// src/app.ts
var import_cors = __toESM(require("cors"), 1);

// src/middleware/globalErrorHandler.ts
var globalErrorHandler = (err, req, res, next) => {
  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error"
  });
};
var globalErrorHandler_default = globalErrorHandler;

// src/app.ts
var app = (0, import_express4.default)();
app.use(import_express4.default.json());
app.use(logger_default);
app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.use(
  (0, import_cors.default)({
    origin: "http://localhost:5000"
  })
);
app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/issues", issueRouter);
app.use(globalErrorHandler_default);
var app_default = app;

// src/index.ts
var main = async () => {
  initDB();
  app_default.listen(config_default.port, () => {
    console.log(`server is runnig on port ${config_default.port}`);
  });
};
main();
//# sourceMappingURL=index.cjs.map