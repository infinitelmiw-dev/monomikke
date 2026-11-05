"""Create a dependency-free GitHub Pages bundle outside the checkout."""
from pathlib import Path
import zipfile

root = Path(__file__).resolve().parent.parent
output = root.parent / 'monomikke-pages.zip'
files = ('index.html', 'style.css', 'generator.js', 'knowledge.js', 'topics.js', 'carousel.js', 'carousel-ui.js', 'app.js', '.nojekyll')
with zipfile.ZipFile(output, 'w', zipfile.ZIP_DEFLATED) as bundle:
    for name in files:
        bundle.write(root / name, name)
print(output)
