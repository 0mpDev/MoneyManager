@@ .. @@
-export const BASE_URL = "http://localhost:8080/api/v1.0";
+export const BASE_URL = "http://localhost:9090/api/v1.0";
 
 export const API_ENDPOINTS = {
     LOGIN: "/login",
-    REGISTER: "/register"
+    REGISTER: "/register",
+    DASHBOARD: "/dashboard",
+    CATEGORIES: "/categories",
+    INCOMES: "/incomes",
+    EXPENSES: "/expenses",
+    FILTER: "/filter",
+    TEST: "/test",
+    UPLOAD_IMAGE: "https://api.cloudinary.com/v1_1/dqy2ts9h7/image/upload"
 };