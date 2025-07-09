@@ .. @@
 import React from 'react';
 import { Link, useLocation } from 'react-router-dom';
-import { Github, LogOut, User, Briefcase } from 'lucide-react';
+import { Github, LogOut, User, Briefcase, Settings, FileText } from 'lucide-react';
 import { useAuth } from '../hooks/useAuth';
 
 export const Navbar: React.FC = () => {
@@ .. @@
           {/* Navigation Links */}
           <div className="flex items-center space-x-1">
             <Link
               to="/dashboard"
               className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                 isActive('/dashboard')
                   ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                   : 'text-gray-300 hover:text-white hover:bg-gray-800'
               }`}
             >
               <User className="h-4 w-4 mr-2" />
               Dashboard
             </Link>
             
             <Link
               to="/issues"
               className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                 isActive('/issues')
                   ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                   : 'text-gray-300 hover:text-white hover:bg-gray-800'
               }`}
             >
               <Briefcase className="h-4 w-4 mr-2" />
               Issues
             </Link>
+            
+            <Link
+              to="/my-issues"
+              className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
+                isActive('/my-issues')
+                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
+                  : 'text-gray-300 hover:text-white hover:bg-gray-800'
+              }`}
+            >
+              <FileText className="h-4 w-4 mr-2" />
+              My Issues
+            </Link>
+            
+            <Link
+              to="/profile"
+              className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
+                isActive('/profile')
+                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
+                  : 'text-gray-300 hover:text-white hover:bg-gray-800'
+              }`}
+            >
+              <Settings className="h-4 w-4 mr-2" />
+              Profile
+            </Link>
           </div>