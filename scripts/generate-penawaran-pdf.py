from reportlab.lib.pagesizes import A4
from reportlab.lib.units import cm, mm
from reportlab.lib.colors import HexColor
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_JUSTIFY
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
)
from reportlab.pdfgen import canvas
import os

# ── Brand Colors ──
PRIMARY = HexColor('#0F1923')
ACCENT = HexColor('#C8A44E')
ACCENT_LIGHT = HexColor('#E8D5A0')
WHITE = HexColor('#FFFFFF')
OFF_WHITE = HexColor('#FAFAF8')
TEXT_DARK = HexColor('#1A1A1A')
TEXT_BODY = HexColor('#3A3A3A')
TEXT_MUTED = HexColor('#7A7A7A')
BORDER = HexColor('#E0DDD6')
SECTION_BG = HexColor('#F8F6F2')

output_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'Penawaran_Jasa_Website_Aniraza.pdf')
WIDTH, HEIGHT = A4


def draw_background(c, doc):
    c.saveState()
    c.setFillColor(OFF_WHITE)
    c.rect(0, 0, WIDTH, HEIGHT, fill=True, stroke=False)
    # Top header bar
    c.setFillColor(PRIMARY)
    c.rect(0, HEIGHT - 3.2 * cm, WIDTH, 3.2 * cm, fill=True, stroke=False)
    # Gold accent line
    c.setFillColor(ACCENT)
    c.rect(0, HEIGHT - 3.2 * cm - 2.5 * mm, WIDTH, 2.5 * mm, fill=True, stroke=False)
    # Brand left
    c.setFillColor(WHITE)
    c.setFont('Helvetica-Bold', 11)
    c.drawString(2.5 * cm, HEIGHT - 1.4 * cm, 'ANIRAZA AGENCY')
    c.setFillColor(ACCENT_LIGHT)
    c.setFont('Helvetica', 7.5)
    c.drawString(2.5 * cm, HEIGHT - 2 * cm, 'Digital Marketing & Web Development')
    # Contact right
    c.setFillColor(HexColor('#A0A0A0'))
    c.setFont('Helvetica', 7.5)
    c.drawRightString(WIDTH - 2.5 * cm, HEIGHT - 1.4 * cm, '081314566100')
    c.drawRightString(WIDTH - 2.5 * cm, HEIGHT - 2 * cm, 'aniraza.agency')
    # Footer bar
    c.setFillColor(PRIMARY)
    c.rect(0, 0, WIDTH, 1.5 * cm, fill=True, stroke=False)
    c.setFillColor(TEXT_MUTED)
    c.setFont('Helvetica', 7)
    c.drawCentredString(WIDTH / 2, 0.65 * cm,
                        '\u00a9 2026 Aniraza Agency  \u2022  Proposal ini bersifat rahasia dan ditujukan khusus untuk penerima')
    # Gold line above footer
    c.setFillColor(ACCENT)
    c.rect(0, 1.5 * cm, WIDTH, 1 * mm, fill=True, stroke=False)
    c.restoreState()


doc = SimpleDocTemplate(
    output_path,
    pagesize=A4,
    topMargin=4 * cm,
    bottomMargin=2.5 * cm,
    leftMargin=2.5 * cm,
    rightMargin=2.5 * cm,
)

# ── Styles ──
s_label = ParagraphStyle('Label', fontName='Helvetica-Bold', fontSize=8, leading=12,
                          textColor=ACCENT, spaceBefore=24, spaceAfter=4)
s_title = ParagraphStyle('Title', fontName='Helvetica-Bold', fontSize=15, leading=20,
                          textColor=PRIMARY, spaceAfter=10)
s_hero_title = ParagraphStyle('HeroTitle', fontName='Helvetica-Bold', fontSize=24, leading=30,
                               textColor=PRIMARY)
s_hero_sub = ParagraphStyle('HeroSub', fontName='Helvetica', fontSize=11, leading=17,
                             textColor=TEXT_MUTED)
s_body = ParagraphStyle('Body', fontName='Helvetica', fontSize=10, leading=16,
                         textColor=TEXT_BODY, alignment=TA_JUSTIFY, spaceAfter=6)
s_note = ParagraphStyle('Note', fontName='Helvetica-Oblique', fontSize=8.5, leading=13,
                         textColor=TEXT_MUTED, spaceAfter=4)
s_feat_t = ParagraphStyle('FeatT', fontName='Helvetica-Bold', fontSize=10, leading=14,
                           textColor=PRIMARY, spaceAfter=2)
s_feat_d = ParagraphStyle('FeatD', fontName='Helvetica', fontSize=9, leading=13,
                           textColor=TEXT_MUTED)
s_closing = ParagraphStyle('Closing', fontName='Helvetica-Bold', fontSize=12, leading=16,
                            textColor=PRIMARY, spaceAfter=2)


def cell(text, bold=False, center=False, color=None, sz=9.5):
    return Paragraph(text, ParagraphStyle(
        'c', fontName='Helvetica-Bold' if bold else 'Helvetica',
        fontSize=sz, leading=sz + 5,
        textColor=color or TEXT_BODY,
        alignment=TA_CENTER if center else TA_LEFT))


def gold_div():
    return HRFlowable(width="30%", thickness=1.5, color=ACCENT, spaceAfter=6, spaceBefore=6)


def thin_div():
    return HRFlowable(width="100%", thickness=0.5, color=BORDER, spaceAfter=10, spaceBefore=10)


elements = []

# ================================================================
# HERO
# ================================================================
elements.append(Spacer(1, 8))
elements.append(Paragraph('PROPOSAL', s_label))
elements.append(Paragraph('Penawaran Jasa<br/>Pembuatan Website', s_hero_title))
elements.append(Spacer(1, 8))
elements.append(gold_div())
elements.append(Spacer(1, 8))
elements.append(Paragraph(
    'Solusi website profesional untuk mengembangkan bisnis Anda ke ranah digital \u2014 '
    'dirancang dengan standar modern, responsif, dan siap bersaing.', s_hero_sub))
elements.append(Spacer(1, 28))

# ================================================================
# TENTANG KAMI
# ================================================================
elements.append(Paragraph('TENTANG KAMI', s_label))
elements.append(Paragraph('Mengapa Memilih Aniraza Agency?', s_title))
elements.append(Paragraph(
    'Aniraza Agency adalah agensi digital marketing yang telah berpengalaman menangani '
    'pembuatan website secara profesional untuk berbagai industri. Kami menggabungkan '
    '<b>desain modern</b>, <b>teknologi terkini</b>, dan <b>strategi digital yang tepat</b> '
    'untuk memastikan website Anda tidak hanya tampil menarik, tetapi juga menghasilkan '
    'hasil nyata bagi bisnis.', s_body))
elements.append(Spacer(1, 6))

usp = [
    [cell('\u2726  Desain custom &amp; modern', sz=9),
     cell('\u2726  Mobile-friendly &amp; fast loading', sz=9)],
    [cell('\u2726  SEO-ready dari hari pertama', sz=9),
     cell('\u2726  Maintenance &amp; support 3 tahun', sz=9)],
    [cell('\u2726  Proses transparan &amp; komunikatif', sz=9),
     cell('\u2726  Harga kompetitif, kualitas premium', sz=9)],
]
t = Table(usp, colWidths=[doc.width / 2] * 2)
t.setStyle(TableStyle([
    ('TOPPADDING', (0, 0), (-1, -1), 4),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
    ('LEFTPADDING', (0, 0), (-1, -1), 4),
]))
elements.append(t)
elements.append(Spacer(1, 24))

from reportlab.platypus import PageBreak
elements.append(PageBreak())

# ================================================================
# PAKET
# ================================================================
elements.append(Paragraph('PAKET PENAWARAN', s_label))
elements.append(Paragraph('Website Pro', s_title))

# Price card
pc = [
    [Paragraph('INVESTASI', ParagraphStyle('', fontName='Helvetica', fontSize=8,
               leading=12, textColor=ACCENT_LIGHT, alignment=TA_CENTER))],
    [Paragraph('Rp 9.000.000', ParagraphStyle('', fontName='Helvetica-Bold', fontSize=26,
               leading=32, textColor=WHITE, alignment=TA_CENTER))],
]
pc_t = Table(pc, colWidths=[doc.width])
pc_t.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, -1), PRIMARY),
    ('TOPPADDING', (0, 0), (0, 0), 14),
    ('TOPPADDING', (0, 1), (0, 1), 2),
    ('TOPPADDING', (0, 2), (0, 2), 4),
    ('BOTTOMPADDING', (0, 2), (0, 2), 14),
    ('LEFTPADDING', (0, 0), (-1, -1), 20),
    ('RIGHTPADDING', (0, 0), (-1, -1), 20),
    ('ROUNDEDCORNERS', [6, 6, 6, 6]),
]))
elements.append(pc_t)
elements.append(Spacer(1, 16))

# Detail table
rows = [
    ['Estimasi Pengerjaan', '7 \u2013 14 hari kerja'],
    ['Jumlah Halaman', 'Lebih dari 20 halaman'],
    ['Maintenance', '3 tahun gratis (minor upgrade &amp; bug fix)'],
    ['Email Profesional', '20 akun email bisnis'],
    ['Domain &amp; Hosting', 'Gratis 1 tahun pertama'],
    ['Desain', 'Custom, modern &amp; mobile-friendly'],
    ['Konten Dasar', 'Informasi perusahaan &amp; artikel basic'],
    ['Integrasi', 'QRIS, Social Media &amp; WhatsApp'],
]
td = [[cell(l, bold=True, color=PRIMARY, sz=9.5), cell(v, sz=9.5)] for l, v in rows]
dt = Table(td, colWidths=[5 * cm, doc.width - 5 * cm])
dt.setStyle(TableStyle([
    ('TOPPADDING', (0, 0), (-1, -1), 8),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
    ('LEFTPADDING', (0, 0), (-1, -1), 12),
    ('RIGHTPADDING', (0, 0), (-1, -1), 12),
    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ('LINEBELOW', (0, 0), (-1, -1), 0.5, BORDER),
    ('LINEABOVE', (0, 0), (-1, 0), 0.5, BORDER),
    *[('BACKGROUND', (0, i), (-1, i), SECTION_BG) for i in range(0, len(rows), 2)],
]))
elements.append(dt)
elements.append(Spacer(1, 24))

# ================================================================
# SYARAT & KETENTUAN
# ================================================================
elements.append(Paragraph('SYARAT &amp; KETENTUAN', s_label))
elements.append(Paragraph('Informasi Penting', s_title))

terms = [
    ['Revisi Minor', 'Perubahan warna, font, teks/copywriting, penggantian gambar, dan perbaikan spacing/alignment. '
     'Perubahan struktur halaman atau penambahan fitur baru dihitung sebagai project terpisah dan dikenakan biaya tambahan.'],
    ['Konten &amp; Materi', 'Konten teks, foto produk, dan logo disediakan oleh client. '
     'Kami bantu susun &amp; optimasi untuk tampilan website.'],
    ['Perpanjangan', 'Domain &amp; hosting tahun ke-2 dst dikenakan biaya perpanjangan tahunan.'],
    ['Kepemilikan', 'Seluruh source code &amp; aset website menjadi milik client sepenuhnya setelah pelunasan.'],
    ['Garansi', 'Garansi bug fix selama masa maintenance 3 tahun. '
     'Penambahan fitur baru di luar scope dihitung sebagai project terpisah.'],
]

terms_data = []
for label, value in terms:
    terms_data.append([
        cell(label, bold=True, color=PRIMARY, sz=9),
        cell(value, sz=9),
    ])

terms_t = Table(terms_data, colWidths=[4 * cm, doc.width - 4 * cm])
terms_t.setStyle(TableStyle([
    ('TOPPADDING', (0, 0), (-1, -1), 7),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 7),
    ('LEFTPADDING', (0, 0), (-1, -1), 10),
    ('RIGHTPADDING', (0, 0), (-1, -1), 10),
    ('VALIGN', (0, 0), (-1, -1), 'TOP'),
    ('LINEBELOW', (0, 0), (-1, -2), 0.5, BORDER),
    ('LINEBELOW', (0, -1), (-1, -1), 0.5, BORDER),
    ('LINEABOVE', (0, 0), (-1, 0), 0.5, BORDER),
    *[('BACKGROUND', (0, i), (-1, i), SECTION_BG) for i in range(0, len(terms), 2)],
]))
elements.append(terms_t)

elements.append(Spacer(1, 24))

# ================================================================
# CLOSING
# ================================================================
elements.append(thin_div())
elements.append(Spacer(1, 4))
elements.append(Paragraph(
    'Kami percaya website yang baik adalah investasi jangka panjang untuk bisnis Anda. '
    'Mari berdiskusi lebih lanjut tentang kebutuhan Anda \u2014 tanpa komitmen.',
    s_body))
elements.append(Spacer(1, 16))

# Contact card
cc = [
    [Paragraph('Siap Berdiskusi?', ParagraphStyle('', fontName='Helvetica-Bold',
               fontSize=13, leading=18, textColor=WHITE))],
    [Paragraph(
        '<b>WhatsApp:</b>  081314566100',
        ParagraphStyle('', fontName='Helvetica', fontSize=9.5, leading=15, textColor=ACCENT_LIGHT))],
]
cc_t = Table(cc, colWidths=[doc.width])
cc_t.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, -1), PRIMARY),
    ('TOPPADDING', (0, 0), (0, 0), 14),
    ('TOPPADDING', (0, 1), (0, 1), 4),
    ('BOTTOMPADDING', (0, 1), (0, 1), 16),
    ('LEFTPADDING', (0, 0), (-1, -1), 20),
    ('RIGHTPADDING', (0, 0), (-1, -1), 20),
    ('ROUNDEDCORNERS', [6, 6, 6, 6]),
]))
elements.append(cc_t)
elements.append(Spacer(1, 20))

elements.append(Paragraph('Hormat kami,', ParagraphStyle('', fontName='Helvetica', fontSize=10,
                           leading=14, textColor=TEXT_MUTED, spaceAfter=6)))
elements.append(Paragraph('Team Aniraza Agency', s_closing))
elements.append(Paragraph(
    f'<font color="{TEXT_MUTED.hexval()}">Digital Marketing &amp; Web Development Agency</font>', s_note))

# ================================================================
doc.build(elements, onFirstPage=draw_background, onLaterPages=draw_background)
print(f'PDF saved to: {output_path}')
