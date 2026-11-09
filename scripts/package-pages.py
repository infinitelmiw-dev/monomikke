"""Create a dependency-free GitHub Pages bundle outside the checkout."""
from pathlib import Path
import zipfile

root = Path(__file__).resolve().parent.parent
output = root.parent / 'monomikke-pages.zip'
files = ('index.html', 'style.css', 'generator.js', 'knowledge.js', 'topics.js', 'purchase.js', 'product.js', 'library-data.js', 'library-ui.js', 'carousel.js', 'brand-layout.js', 'image-loader.js', 'carousel-ui.js', 'app.js', 'easy-post.js', 'easy-ui.js', '.nojekyll')
with zipfile.ZipFile(output, 'w', zipfile.ZIP_DEFLATED) as bundle:
    for name in files:
        bundle.write(root / name, name)
    for asset in sorted((root / 'assets' / 'fonts').glob('*')):
        bundle.write(asset, asset.relative_to(root).as_posix())
print(output)
