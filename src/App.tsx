@@ .. @@
 import { Login } from './pages/Login';
 import { Register } from './pages/Register';
 import { Dashboard } from './pages/Dashboard';
 import { Issues } from './pages/Issues';
+import { Profile } from './pages/Profile';
+import { MyIssues } from './pages/MyIssues';
 
 function App() {
@@ .. @@
             <Route
               path="/issues"
               element={
                 <ProtectedRoute>
                   <Navbar />
                   <Issues />
                 </ProtectedRoute>
               }
             />
+            <Route
+              path="/profile"
+              element={
+                <ProtectedRoute>
+                  <Navbar />
+                  <Profile />
+                </ProtectedRoute>
+              }
+            />
+            <Route
+              path="/my-issues"
+              element={
+                <ProtectedRoute>
+                  <Navbar />
+                  <MyIssues />
+                </ProtectedRoute>
+              }
+            />
             <Route path="/" element={<Navigate to="/dashboard" replace />} />
           </Routes>