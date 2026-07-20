import os

files = [
    "dashboard/src/app/relocation/page.tsx",
    "dashboard/src/app/document/page.tsx",
    "dashboard/src/app/matchmaking/page.tsx",
    "dashboard/src/app/banking/page.tsx"
]

for file_path in files:
    with open(file_path, "r") as f:
        content = f.read()

    # Add import
    import_stmt = "import AuthGuard from '@/components/AuthGuard';\n"
    if import_stmt not in content:
        # Find the last import
        lines = content.split('\n')
        last_import_idx = -1
        for i, line in enumerate(lines):
            if line.startswith("import "):
                last_import_idx = i
        if last_import_idx != -1:
            lines.insert(last_import_idx + 1, import_stmt)
            content = '\n'.join(lines)
    
    # Replace return
    if "<AuthGuard>" not in content:
        content = content.replace(
            "return (\n    <div className=\"min-h-screen",
            "return (\n    <AuthGuard>\n      <div className=\"min-h-screen"
        )
        content = content.replace(
            "    </div>\n  );\n}",
            "    </div>\n    </AuthGuard>\n  );\n}"
        )
        
    with open(file_path, "w") as f:
        f.write(content)

print("Done")
