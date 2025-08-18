@@ .. @@
-import { BrowserRouter } from "react-router-dom";
-import Home from "./pages/Home.jsx";
-import Income from "./pages/Income.jsx";
-import Expense from "./pages/Expense.jsx";
-import Category from "./pages/Category.jsx";
-import Filter from "./pages/Filter.jsx";
-import Login from "./pages/login.jsx";
-import Signup from "./pages/Signup.jsx";
-import { Toaster } from "react-hot-toast";
-import { Routes, Route } from "react-router-dom";
+import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
+import { useContext, useEffect } from "react";
+import { Toaster } from "react-hot-toast";
+import { AppContext } from "./context/AppContext.jsx";
+import axiosConfig from "./util/axiosConfig.js";
+import { API_ENDPOINTS } from "./util/apiEndpoints.js";
+
+// Pages
+import Dashboard from "./pages/Dashboard.jsx";
+import Income from "./pages/Income.jsx";
+import Expense from "./pages/Expense.jsx";
+import Category from "./pages/Category.jsx";
+import Filter from "./pages/Filter.jsx";
+import Login from "./pages/Login.jsx";
+import Signup from "./pages/Signup.jsx";
+import Layout from "./components/Layout.jsx";
+
+// Protected Route Component
+const ProtectedRoute = ({ children }) => {
+  const { user } = useContext(AppContext);
+  const token = localStorage.getItem("token");
+  
+  if (!token || !user) {
+    return <Navigate to="/login" replace />;
+  }
+  
+  return <Layout>{children}</Layout>;
+};
+
+// Public Route Component (redirect if already logged in)
+const PublicRoute = ({ children }) => {
+  const { user } = useContext(AppContext);
+  const token = localStorage.getItem("token");
+  
+  if (token && user) {
+    return <Navigate to="/dashboard" replace />;
+  }
+  
+  return children;
+};
+
 const App=()=>{
+  const { user, setUser } = useContext(AppContext);
+
+  useEffect(() => {
+    const token = localStorage.getItem("token");
+    if (token && !user) {
+      // Verify token and get user data
+      axiosConfig.get("/test")
+        .then(() => {
+          // Token is valid, but we need user data
+          // For now, we'll set a placeholder - in a real app, you'd fetch user profile
+          setUser({ token });
+        })
+        .catch(() => {
+          // Token is invalid
+          localStorage.removeItem("token");
+        });
+    }
+  }, [user, setUser]);
+
   return (
     <>
-    <Toaster />
-    <BrowserRouter>
-      <Routes>
-        <Route path="/dashboard" element={<Home />} />
-        <Route path="/income" element={<Income />} />
-        <Route path="/expense" element={<Expense />} />
-        <Route path="/category" element={<Category />} />
-        <Route path="/filter" element={<Filter />} />
-        <Route path="/login" element={<Login />} />
-        <Route path="/signup" element={<Signup />} />
-      </Routes>
-    </BrowserRouter>
-    
-
+      <Toaster 
+        position="top-right"
+        toastOptions={{
+          duration: 3000,
+          style: {
+            background: '#363636',
+            color: '#fff',
+          },
+        }}
+      />
+      <BrowserRouter>
+        <Routes>
+          {/* Public Routes */}
+          <Route path="/login" element={
+            <PublicRoute>
+              <Login />
+            </PublicRoute>
+          } />
+          <Route path="/signup" element={
+            <PublicRoute>
+              <Signup />
+            </PublicRoute>
+          } />
+          
+          {/* Protected Routes */}
+          <Route path="/dashboard" element={
+            <ProtectedRoute>
+              <Dashboard />
+            </ProtectedRoute>
+          } />
+          <Route path="/income" element={
+            <ProtectedRoute>
+              <Income />
+            </ProtectedRoute>
+          } />
+          <Route path="/expense" element={
+            <ProtectedRoute>
+              <Expense />
+            </ProtectedRoute>
+          } />
+          <Route path="/category" element={
+            <ProtectedRoute>
+              <Category />
+            </ProtectedRoute>
+          } />
+          <Route path="/filter" element={
+            <ProtectedRoute>
+              <Filter />
+            </ProtectedRoute>
+          } />
+          
+          {/* Default redirect */}
+          <Route path="/" element={<Navigate to="/dashboard" replace />} />
+        </Routes>
+      </BrowserRouter>
     </>
   )
 }