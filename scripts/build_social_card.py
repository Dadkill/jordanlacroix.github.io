"""Render the share card with the portfolio's local fonts. Requires Pillow."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
import math

ROOT = Path(__file__).resolve().parents[1]
SCALE = 2
image = Image.new("RGB", (1200*SCALE, 630*SCALE), "#171D29")
draw = ImageDraw.Draw(image)
fonts = ROOT / "cv/internal/fonts"

def font(name, size):
    return ImageFont.truetype(str(fonts / name), round(size*SCALE))

def label(value, x, y, size, color="#EEF1F7", display=False):
    face = font("JL-Syne.ttf" if display else "JL-Manrope.ttf", size)
    draw.text((x*SCALE, y*SCALE), value, font=face, fill=color)

def stroke(points, color="#6F9FFF", width=2):
    draw.line([(round(x*SCALE), round(y*SCALE)) for x,y in points],
              fill=color, width=round(width*SCALE), joint="curve")

def dot(x,y,r=2,color="#6F9FFF"):
    draw.ellipse(((x-r)*SCALE,(y-r)*SCALE,(x+r)*SCALE,(y+r)*SCALE), fill=color)

label("Data Team Lead RM & BI · DPO Groupe chez ECG", 64, 52, 21, "#B1BBCE")
label("JORDAN", 55, 142, 100, display=True)
label("LACROIX", 55, 258, 100, "#6F9FFF", display=True)
draw.rectangle((821*SCALE,337*SCALE,834*SCALE,350*SCALE),fill="#DEB46E")
label("Data, Business Intelligence", 64, 428, 27)
label("& protection des données", 64, 469, 27)
stroke([(64,552),(1136,552)],"#39445A",1)
label("jordanlacroix.fr",64,578,20,"#DEB46E")
label("Jordan Lacroix",973,578,17,"#B1BBCE")

# Database: stacked ellipses and the two sides of a cylinder.
for cy in (142,175,208):
    for i in range(80):
        a=math.tau*i/80
        dot(1000+78*math.cos(a),cy+23*math.sin(a),1.7)
for x in (922,1078):
    for y in range(143,208,5): dot(x,y,1.7)
# BI: a bar chart, aligned on a common baseline.
for j,h in enumerate((29,51,40,69,86)):
    x=923+j*32
    for y in range(329-h,329,6):
        for dx in (0,6,12): dot(x+dx,y,1.65)
# Protection: shield outline and check.
outline=[(1000,367),(1061,389),(1054,445),(1036,472),(1000,493),
         (964,472),(946,445),(939,389),(1000,367)]
for (ax,ay),(bx,by) in zip(outline,outline[1:]):
    count=max(1,round(math.hypot(bx-ax,by-ay)/5))
    for i in range(count):
        dot(ax+(bx-ax)*i/count,ay+(by-ay)*i/count,1.7)
stroke([(974,428),(993,446),(1028,406)],"#DEB46E",4)

image.resize((1200,630),Image.Resampling.LANCZOS).save(
    ROOT / "public/social-card.png", optimize=True
)
print("Created public/social-card.png (1200 × 630)")
