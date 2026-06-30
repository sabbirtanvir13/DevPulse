async function runTest() {
  const email = `testuser_${Date.now()}@example.com`;
  const password = "password123";
  const apiUrl = "http://localhost:5000/api";

  console.log("Registering user...");
  const signupRes = await fetch(`${apiUrl}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "Test User",
      email,
      password,
      role: "contributor"
    })
  });
  const signupData = await signupRes.json();
  console.log("Signup Response:", signupData);

  console.log("Logging in...");
  const loginRes = await fetch(`${apiUrl}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });
  const loginData = await loginRes.json();
  console.log("Login Response status:", loginData.success);

  if (!loginData.success) {
    console.error("Login failed!", loginData);
    return;
  }

  const token = loginData.data.token;

  console.log("Creating issue...");
  const issueRes = await fetch(`${apiUrl}/issues`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `${token}`
    },
    body: JSON.stringify({
      title: "Database connection timeout under load",
      description: "Pool exhausts after 50+ concurrent queries, causing 500 errors",
      type: "bug"
    })
  });
  
  const issueStatus = issueRes.status;
  const issueData = await issueRes.json();
  
  console.log(`\n=== API RESPONSE (${issueStatus}) ===`);
  console.log(JSON.stringify(issueData, null, 2));
}

runTest().catch(console.error);
