@@ .. @@
   private determineDifficulty(labels: Array<{ name: string; color: string }>): 'Easy' | 'Medium' | 'Hard' {
     const labelNames = labels.map(label => label.name.toLowerCase());
     
-    if (labelNames.some(name => 
-      name.includes('good first issue') || 
-      name.includes('beginner') || 
-      name.includes('easy') ||
-      name.includes('starter')
-    )) {
-      return 'Easy';
-    }
-    
-    if (labelNames.some(name => 
-      name.includes('hard') || 
-      name.includes('complex') || 
-      name.includes('expert') ||
-      name.includes('advanced')
-    )) {
-      return 'Hard';
-    }
-    
-    return 'Medium';
+    // Always return Medium for GitHub issues as requested
+    return 'Medium';
   }