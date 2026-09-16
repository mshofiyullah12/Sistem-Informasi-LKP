import sys

def patch():
    with open("src/App.tsx", "r", encoding="utf-8") as f:
        content = f.read()
        
    hook = """  useEffect(() => {
    if (schoolSettings) {
      document.title = schoolSettings.namaLembaga || "Sistem Informasi LPK";
      const iconUrl = schoolSettings.faviconUrl || schoolSettings.logoUrl;
      if (iconUrl) {
        let link = document.querySelector("link[rel~='icon']");
        if (!link) {
          link = document.createElement("link");
          link.rel = "icon";
          document.head.appendChild(link);
        }
        link.href = iconUrl;
      }
    }
  }, [schoolSettings?.logoUrl, schoolSettings?.faviconUrl, schoolSettings?.namaLembaga]);
"""
    
    target_str = 'const handleUpdateSettings ='
    idx = content.find(target_str)
    
    if idx == -1:
        print("Could not find target_str")
        return
        
    new_content = content[:idx] + hook + "\n  " + content[idx:]
    
    with open("src/App.tsx", "w", encoding="utf-8") as f:
        f.write(new_content)
    print("Patched successfully!")
patch()
