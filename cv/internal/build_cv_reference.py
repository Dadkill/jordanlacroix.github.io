"""One-page CV; selectable text, embedded fonts, explicit geometric layout."""
from pathlib import Path
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.colors import HexColor
from reportlab.platypus import Paragraph
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.utils import ImageReader
from pypdf import PdfReader

BASE=Path(__file__).resolve().parents[1]
ROOT=BASE.parent
for name,file in [('Body','JL-Manrope.ttf'),('Bold','JL-Manrope-Bold.ttf'),('Display','JL-Syne.ttf')]:
    pdfmetrics.registerFont(TTFont(name,str(BASE/'internal/fonts'/file)))
pdfmetrics.registerFontFamily('Body',normal='Body',bold='Bold',italic='Body',boldItalic='Bold')
W,H=595.276,841.89
PAPER='#E8ECF2'; WHITE='#FAFBFD'; INK='#233349'; BLUE='#315D9C'; AMBER='#D7AD64'; MUTED='#516078'; LIGHT='#D7E1F1'
DEST=ROOT/'public/CV-Jordan-Lacroix.pdf'
c=canvas.Canvas(str(DEST),pagesize=(W,H),pageCompression=1)
c.setTitle('Jordan Lacroix | Data Team Lead RM & BI / DPO')
c.setAuthor('Jordan Lacroix')
c.setSubject('Parcours professionnel, responsabilités, compétences et formation')
boxes=[]

def rect(x,y,w,h,color):
    c.setFillColor(HexColor(color)); c.rect(x,H-y-h,w,h,fill=1,stroke=0)
def line(x,y,x2,y2,color=LIGHT,width=.6):
    c.setStrokeColor(HexColor(color)); c.setLineWidth(width); c.line(x,H-y,x2,H-y2)
def text(t,x,y,size=10,font='Body',color=INK):
    assert x+pdfmetrics.stringWidth(t,font,size)<W-15,(t,x,size)
    c.setFillColor(HexColor(color)); c.setFont(font,size); c.drawString(x,H-y-size,t)
def fit(t,x,y,w,size=28,font='Display',color=INK):
    text(t,x,y,min(size,size*w/pdfmetrics.stringWidth(t,font,size)),font,color)
def para(t,x,y,w,size=10.1,leading=15.2,color=INK,font='Body'):
    style=ParagraphStyle('p',fontName=font,fontSize=size,leading=leading,textColor=HexColor(color),spaceAfter=0)
    p=Paragraph(t,style); _,h=p.wrap(w,1000)
    assert y+h < H-20,(t,y+h)
    p.drawOn(c,x,H-y-h); boxes.append((c.getPageNumber(),x,y,w,h,t))
    return y+h
def label(t,x,y,color=BLUE): text(t,x,y,8.2,'Bold',color)
def heading(t,x,y,w):
    text(t,x,y,21,'Display'); line(x,y+29,x+w,y+29,'#B8C5D8'); return y+40
def bullet(t,x,y,w,size=10.1,color=INK):
    c.setFillColor(HexColor(AMBER)); c.circle(x+2,H-y-7,1.6,fill=1,stroke=0)
    return para(t,x+13,y,w-13,size=size,color=color)+7
def footer(n):
    text('JORDAN LACROIX',235,806,7.5,'Bold',MUTED)
    text(f'CURRICULUM VITAE / {n:02d}',435,806,7.5,'Body',MUTED)
def mark(x,y):
    # A quiet dot matrix echoes the portfolio's particle language.
    for row in range(5):
        for col in range(8):
            c.setFillColor(HexColor(AMBER if (row+col)%7==0 else '#6686B1'))
            c.circle(x+col*12,H-y-row*12,1.2,fill=1,stroke=0)

# One page: retain the portrait-led composition while reducing repetition.
rect(0,0,W,H,PAPER); rect(0,0,207,H,BLUE)
c.saveState()
path=c.beginPath(); path.roundRect(31,H-203,145,166,72)
c.clipPath(path,stroke=0,fill=0)
c.drawImage(ImageReader(str(ROOT/'public/jordan-lacroix.png')),14,H-210,179,179,mask='auto')
c.restoreState()
c.setStrokeColor(HexColor(AMBER)); c.setLineWidth(1)
c.roundRect(25,H-209,157,178,78,fill=0,stroke=1)
fit('JORDAN',26,227,155,28,'Display',WHITE)
fit('LACROIX',26,257,155,28,'Display',WHITE)
rect(28,297,33,3,AMBER)
para('Data Team Lead<br/>RM &amp; BI / DPO',28,315,152,14.5,20,WHITE,'Bold')
label('CONTACT',28,381,AMBER)
para('Marseille · Aix-en-Provence',28,402,155,9,14,WHITE)
para('contact@jordanlacroix.fr',28,426,155,9,14,WHITE)
c.linkURL('mailto:contact@jordanlacroix.fr',(28,H-441,183,H-425),relative=0)
para('linkedin.com/in/jordan-lacroix',28,450,155,8.3,13,WHITE)
c.linkURL('https://www.linkedin.com/in/jordan-lacroix/',(28,H-467,183,H-449),relative=0)
label('TECHNIQUE & MÉTHODES',28,496,AMBER)
para('<b>Tableau · GoogleSQL / BigQuery</b><br/>Python, R, SQL, NoSQL, PySpark<br/>Java, Kotlin, PHP<br/>MERISE, UML, GANTT<br/>Agile / Scrum, API REST',28,518,156,9.1,15,WHITE)
label('LANGUES',28,624,AMBER)
para('Français · Langue maternelle<br/>Anglais · TOEIC 900/990<br/>Listening &amp; Reading, juin 2021',28,647,153,9,14,WHITE)
label('CENTRES D’INTÉRÊT',28,711,AMBER)
para('Animation radio · Astronomie<br/>Sciences · Traduction<br/>Actualité technologique',28,733,153,9,14,WHITE)
mark(30,799)
label('DATA / BI / GOUVERNANCE',235,33)
para('Data, BI<br/>&amp; conformité.',235,56,326,24,29,INK,'Display')
para('Je pilote le périmètre Data RM &amp; BI chez ECG et j’accompagne les départements dans leur mise en conformité avec le RGPD, en tant que DPO Groupe.',235,134,324,9.7,14)
line(235,191,559,191,'#B8C5D8')
label('EUROPEAN CAMPING GROUP',235,206)
fit('ECG',495,201,64,23,'Display',BLUE)
text('Data Team Lead RM & BI / DPO',235,231,11.6,'Bold')
text('Depuis septembre 2025 · Aix-en-Provence',235,253,9,'Body',MUTED)
text('Data Manager / DPO',235,277,10.3,'Bold')
text('Janvier 2023 à août 2025',235,295,9,'Body',MUTED)
y=para('<b>Data.</b> Pilotage du périmètre RM &amp; BI, organisation des sujets avec l’équipe et coordination des besoins métier.',235,323,324,9.4,14)
y=para('<b>BI.</b> Analyses avec Tableau et GoogleSQL / BigQuery. Étude des usages et rationalisation des reportings.',235,y+9,324,9.4,14)
y=para('<b>DPO.</b> Audits des traitements, structuration du registre et veille européenne, avec les équipes juridiques et métiers.',235,y+9,324,9.4,14)
assert y<446,y
line(235,446,559,446,'#B8C5D8')
text('Airbus Helicopters',235,461,12.5,'Bold')
text('Marignane · 2019 à 2021',235,482,8.7,'Body',MUTED)
y=para('<b>Consultant à la gouvernance des données</b><br/>Sept. 2019 à sept. 2021 · Alternance<br/>Digital Office : transformation numérique et mise en place des processus de data governance.',235,504,324,9.1,13.1)
y=para('<b>Architecte des systèmes d’information</b><br/>Avr. à août 2019 · Stage<br/>Gestion de projet et développement de modules de l’application web EDGE, Quality Prototypes France.',235,y+9,324,9.1,13.1)
assert y<621,y
text('HighCo / HighConnexion',235,632,12.5,'Bold')
y=para('<b>Développeur Android</b> · Aix-en-Provence<br/>Stages : mai-juin 2017, janv.-févr. 2018 ; CDD : juil.-août 2018.<br/>Applications football et radio Rouge, prototype en réalité augmentée et évolutions fonctionnelles pour la RTM.',235,655,324,9.1,13.1)
assert y<715,y
line(235,721,559,721,'#B8C5D8')
label('FORMATION',235,736)
para('<b>Master MIAGE I2D</b> · 2019-2021<br/>Données et décisions, Aix-Marseille<br/><b>Licence MIAGE</b> · 2018-2019<br/><b>BTS SIO</b> · Marie Curie, 2016-2018<br/>Major académique Aix-Marseille',235,755,185,8.3,11.9)
label('CERTIFICATIONS',433,736)
para('<b>PRINCE2 Foundation</b><br/>Mai 2021<br/><b>ITIL v3 Foundation</b>',433,755,130,8.3,11.9)
c.save()
reader=PdfReader(DEST)
assert len(reader.pages)==1
content=reader.pages[0].extract_text()
for required in ['GoogleSQL','BigQuery','Airbus','HighCo','900/990','PRINCE2','ITIL','MIAGE','RGPD']:
    assert required in content,required
for forbidden in ['PostgreSQL','—','tableau de bord dédié']:
    assert forbidden not in content,forbidden
print('CV generated:',DEST,'| 1 page, searchable text, embedded fonts and contact links')
