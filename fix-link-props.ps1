$files = Get-ChildItem -Path "C:\Users\Louis Olivier\Downloads\ewebsite2-francise\components2" -Recurse -Include "*.js","*.jsx","*.ts","*.tsx"

foreach ($file in $files) {
    $content = Get-Content -Path $file.FullName -Raw
    
    # Remplacer l'attribut to par href
    $newContent = $content -replace "to=", "href="
    
    # Si le contenu a été modifié, enregistrer le fichier
    if ($content -ne $newContent) {
        Write-Host "Fixing Link props in $($file.FullName)"
        Set-Content -Path $file.FullName -Value $newContent
    }
}

Write-Host "All Link props fixed!"
