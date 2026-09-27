"""Build the seam-free Outfit 900 subset. Requires fonttools, skia-pathops, brotli.

Usage: python tools/build-display-font.py path/to/Outfit-variable.ttf
Source: https://github.com/google/fonts/tree/main/ofl/outfit
License: assets/fonts/OFL.txt
"""
import sys
from pathlib import Path

from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools.ttLib.removeOverlaps import removeOverlaps
from fontTools.subset import Options, Subsetter

font = instantiateVariableFont(TTFont(sys.argv[1]), {"wght": 900}, inplace=True)
removeOverlaps(font)
options = Options()
options.name_IDs = [0, 1, 2, 3, 4, 5, 6, 13, 14]
subsetter = Subsetter(options=options)
subsetter.populate(text="OSP ")
subsetter.subset(font)
names = {1: "OSP Display", 2: "Black", 3: "OSP Display Black 1.0", 4: "OSP Display Black", 6: "OSPDisplay-Black"}
for record in font["name"].names:
    if record.nameID in names:
        record.string = names[record.nameID].encode(record.getEncoding())
font.flavor = "woff2"
output = Path(__file__).resolve().parents[1] / "assets/fonts/osp-display-900.woff2"
font.save(output)
print(f"Saved {output} ({output.stat().st_size} bytes)")
