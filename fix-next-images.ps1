$targetFile = "C:\Users\Louis Olivier\Downloads\ewebsite2-francise\components2\banners\EcomBestInMarketBanner.tsx"

# Lire le contenu du fichier
$content = Get-Content -Path $targetFile -Raw

# 1. Ajouter l'importation du composant Image de Next.js
if ($content -notmatch "import Image from 'next/image'") {
    $content = $content -replace "import product from 'assets/img/e-commerce/5.png';", "import product from 'assets/img/e-commerce/5.png';`nimport Image from 'next/image';"
}

# 2. Remplacer la balise img par le composant Image
$content = $content -replace "<img src={product} alt="""" className=""w-100 w-sm-75"" />", "<Image src={product} alt="""" className=""w-100 w-sm-75"" width={500} height={300} />"

# Écrire le contenu modifié dans le fichier
Set-Content -Path $targetFile -Value $content

Write-Host "Fixed image import in $targetFile"
