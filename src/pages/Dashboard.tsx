@@ .. @@
   const handleBrowseIssues = () => {
     navigate('/issues');
   };
 
+  const handleViewMyIssues = () => {
+    navigate('/my-issues');
+  };
+
+  const handleUpdateProfile = () => {
+    navigate('/profile');
+  };
+
   return (
@@ .. @@
               <button 
                 onClick={handleBrowseIssues}
                 className="w-full p-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-lg hover:from-blue-500/30 hover:to-purple-500/30 transition-all duration-200 text-left group"
               >
                 <div className="flex items-center">
                   <Briefcase className="h-5 w-5 text-blue-400 mr-3 group-hover:scale-110 transition-transform duration-200" />
                   <div>
                     <p className="font-medium text-white">Browse Available Issues</p>
                     <p className="text-sm text-gray-400">Find new challenges to work on</p>
                   </div>
                 </div>
               </button>
 
-              <button className="w-full p-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-lg hover:from-green-500/30 hover:to-emerald-500/30 transition-all duration-200 text-left group">
+              <button 
+                onClick={handleViewMyIssues}
+                className="w-full p-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-lg hover:from-green-500/30 hover:to-emerald-500/30 transition-all duration-200 text-left group"
+              >
                 <div className="flex items-center">
                   <CheckCircle className="h-5 w-5 text-green-400 mr-3 group-hover:scale-110 transition-transform duration-200" />
                   <div>
                     <p className="font-medium text-white">View My Claimed Issues</p>
                     <p className="text-sm text-gray-400">Track your current work</p>
                   </div>
                 </div>
               </button>
 
-              <button className="w-full p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-lg hover:from-purple-500/30 hover:to-pink-500/30 transition-all duration-200 text-left group">
+              <button 
+                onClick={handleUpdateProfile}
+                className="w-full p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-lg hover:from-purple-500/30 hover:to-pink-500/30 transition-all duration-200 text-left group"
+              >
                 <div className="flex items-center">
                   <User className="h-5 w-5 text-purple-400 mr-3 group-hover:scale-110 transition-transform duration-200" />
                   <div>
                     <p className="font-medium text-white">Update Profile</p>
                     <p className="text-sm text-gray-400">Manage your account settings</p>
                   </div>
                 </div>
               </button>