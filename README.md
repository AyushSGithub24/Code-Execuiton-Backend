# 🧠 Code Execution Service

A lightweight, secure, and efficient code execution engine designed to run user-submitted code inside isolated Docker containers. Perfect for online judges, code battles, and learning platforms.

---

## 📂 Folder Structure

```
code-execution-service/
├── node_modules/
├── outputs/                  # Execution outputs
├── submissions/              # Code submission files
├── index.js                  # Main entry point (worker)
├── package.json              # Node.js dependencies
├── Container-logic/
│   └── App/
│       ├── engine            # Execution logic (inside Docker)
│       └── dockerfile        # Docker image setup
```

---

## 🚀 How to Run Locally

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/code-execution-service.git
cd code-execution-service
```

---

### 2. Pull Docker Image

Make sure Docker is installed and running, then pull the prebuilt image:

```bash
docker pull ayushgupta712005/judge-runner:latest
```

---

### 3. Open Project in VS Code

```bash
code .
```

---

### 4. Start Docker Container

From inside the `code-execution-service` directory, run the container:

```bash
docker run -d --name judge-python \
  -v ${PWD}/submissions:/app/submissions \
  -v ${PWD}/outputs:/app/outputs \
  ayushgupta712005/judge-runner:latest
```

✅ This:

* Mounts `submissions` and `outputs` to the container
* Runs the image in background mode

---

### 5. Start Redis Server

You can either start Redis locally or use Docker:

```bash
docker run -d --name redis -p 6379:6379 redis
```

---

### 6. Push a Job to the Redis `submit` Queue

You can push this JSON payload using `redis-cli` or a GUI like RedisInsight:

```json
{
  "language": "java",
  "input": "import java.util.*;\npublic class Main\n{   \n\tpublic static void main(String[] args) {\n\t\tScanner s=new Scanner(System.in);\n\t\tString str=s.nextLine();\n\t\tSystem.out.println(isValid(str));\n\t}\n\t public static boolean isValid(String s) {\n        int i = -1;\n        char[] stack = new char[s.length()];\n        for (char ch : s.toCharArray()) {\n            if (ch == '(' || ch == '{' || ch == '[')\n                stack[++i] = ch;\n            else {\n                if (i >= 0\n                    && ((stack[i] == '(' && ch == ')')\n                        || (stack[i] == '{' && ch == '}')\n                        || (stack[i] == '[' && ch == ']')))\n                    i--;\n                else\n                    return false;\n            }\n        }\n        return i == -1;\n    }\n}",
  "TestCase": [
    { "input": "()", "output": "true", "isHidden": false },
    { "input": "()[]{}", "output": "true", "isHidden": false },
    { "input": "(]", "output": "false", "isHidden": true }
  ],
  "id": "2134516",
  "timeLimit": 500
}
```

---

### 7. Start the Execution Engine

From the root directory (`code-execution-service`), run:

```bash
node index.js
```

This script:

* Reads from the Redis `submit` queue
* Executes code using the Docker container
* Compares output with test cases
* Pushes result to a `result` queue

---

## 🧪 Sample Output (Pushed to `result` Queue)

```json
{
  "id": "2134516",
  "status": "Passed",
  "passedTestCases": 2,
  "totalTestCases": 3,
  "timeTaken": "420ms"
}
```

---

## 📦 Docker Image

👉 [`ayushgupta712005/judge-runner`](https://hub.docker.com/r/ayushgupta712005/judge-runner)

---

## 🙌 Contribution

Open to feature improvements (e.g., multi-language support, better test case diffing, etc.) via PRs or suggestions!

---

