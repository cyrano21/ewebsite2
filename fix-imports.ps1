$files = Get-ChildItem -Path "C:\Users\Louis Olivier\Downloads\ewebsite2-francise\components2" -Recurse -Include "*.js","*.jsx","*.ts","*.tsx"

foreach ($file in $files) {
    $content = Get-Content -Path $file.FullName -Raw
    
    # Remplacer les importations de react-router-dom par next/link
    $newContent = $content -replace "import { Link } from 'react-router-dom';", "import Link from 'next/link';"
    $newContent = $newContent -replace 'import { Link } from "react-router-dom";', "import Link from 'next/link';"
    
    # Si le contenu a été modifié, enregistrer le fichier
    if ($content -ne $newContent) {
        Write-Host "Fixing imports in $($file.FullName)"
        Set-Content -Path $file.FullName -Value $newContent
    }
}

Write-Host "All imports fixed!"
