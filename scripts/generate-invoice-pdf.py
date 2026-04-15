from reportlab.lib.pagesizes import A4
from reportlab.lib.units import cm, mm
from reportlab.lib.colors import HexColor
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_RIGHT, TA_JUSTIFY
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
)
from reportlab.pdfgen import canvas
from datetime import datetime, timedelta
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
SUCCESS = HexColor('#2E7D32')

output_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'Invoice_Aniraza_Agency.pdf')
WIDTH, HEIGHT = A4

# ── Invoice Data ──
INVOICE_NO = 'INV-2026-001'
INVOICE_DATE = datetime.now().strftime('%d %B %Y')
DUE_DATE = (datetime.now() + timedelta(days=7)).strftime('%d %B %Y')

CLIENT_NAME = 'CV Abad Dua Satu Makmur (Seaquill)'
CLIENT_ADDRESS = ''

ITEMS = [
    ['Pembuatan Website Pro', '20+ halaman, custom design, mobile-friendly, SEO-ready', 1, 9_000_000],
]

BANK_NAME = 'Bank BCA'
BANK_ACCOUNT = '6300169447'
BANK_HOLDER = 'Roy Ivan'


def format_rupiah(amount):
    return f"Rp {amount:,.0f}".replace(',', '.')


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
    # PROFORMA INVOICE badge right
    c.setFillColor(ACCENT)
    c.setFont('Helvetica-Bold', 12)
    c.drawRightString(WIDTH - 2.5 * cm, HEIGHT - 1.6 * cm, 'INVOICE')
    # Footer bar
    c.setFillColor(PRIMARY)
    c.rect(0, 0, WIDTH, 1.5 * cm, fill=True, stroke=False)
    c.setFillColor(TEXT_MUTED)
    c.setFont('Helvetica', 7)
    c.drawCentredString(WIDTH / 2, 0.65 * cm,
                        '\u00a9 2026 Aniraza Agency  \u2022  Invoice \u2014 Lunas / Paid')
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
                          textColor=ACCENT, spaceBefore=12, spaceAfter=2)
s_title = ParagraphStyle('Title', fontName='Helvetica-Bold', fontSize=15, leading=20,
                          textColor=PRIMARY, spaceAfter=10)
s_body = ParagraphStyle('Body', fontName='Helvetica', fontSize=10, leading=16,
                         textColor=TEXT_BODY, alignment=TA_JUSTIFY, spaceAfter=6)
s_note = ParagraphStyle('Note', fontName='Helvetica-Oblique', fontSize=8.5, leading=13,
                         textColor=TEXT_MUTED, spaceAfter=4)


def cell(text, bold=False, center=False, right=False, color=None, sz=9.5):
    align = TA_CENTER if center else (TA_RIGHT if right else TA_LEFT)
    return Paragraph(text, ParagraphStyle(
        'c', fontName='Helvetica-Bold' if bold else 'Helvetica',
        fontSize=sz, leading=sz + 5,
        textColor=color or TEXT_BODY,
        alignment=align))


def gold_div():
    return HRFlowable(width="30%", thickness=1.5, color=ACCENT, spaceAfter=6, spaceBefore=6)


def thin_div():
    return HRFlowable(width="100%", thickness=0.5, color=BORDER, spaceAfter=10, spaceBefore=10)


elements = []

# ================================================================
# INVOICE INFO + CLIENT INFO (side by side)
# ================================================================
elements.append(Spacer(1, 4))

# Left: Invoice details | Right: Client details
info_left = [
    [cell('No. Invoice', bold=True, color=PRIMARY, sz=8.5),
     cell(INVOICE_NO, sz=9)],
    [cell('Tanggal', bold=True, color=PRIMARY, sz=8.5),
     cell(INVOICE_DATE, sz=9)],
    [cell('Jatuh Tempo', bold=True, color=PRIMARY, sz=8.5),
     cell(DUE_DATE, sz=9)],
]

info_left_t = Table(info_left, colWidths=[3 * cm, 4.5 * cm])
info_left_t.setStyle(TableStyle([
    ('TOPPADDING', (0, 0), (-1, -1), 4),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
    ('LEFTPADDING', (0, 0), (-1, -1), 0),
    ('RIGHTPADDING', (0, 0), (-1, -1), 4),
    ('VALIGN', (0, 0), (-1, -1), 'TOP'),
]))

# PAID badge
badge_style = ParagraphStyle('badge', fontName='Helvetica-Bold', fontSize=11,
                              leading=14, textColor=HexColor('#228B22'), alignment=TA_CENTER)
badge_inner = Table(
    [[Paragraph('PAID', badge_style)]],
    colWidths=[3.2 * cm],
    style=TableStyle([
        ('BOX', (0, 0), (-1, -1), 2, HexColor('#228B22')),
        ('TOPPADDING', (0, 0), (-1, -1), 5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
        ('LEFTPADDING', (0, 0), (-1, -1), 8),
        ('RIGHTPADDING', (0, 0), (-1, -1), 8),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('ROUNDEDCORNERS', [3, 3, 3, 3]),
    ])
)

info_right_data = [
    [cell('TAGIHAN KEPADA', bold=True, color=ACCENT, sz=8)],
    [cell(f'<b>{CLIENT_NAME}</b>', color=PRIMARY, sz=10)],
    [badge_inner],
]
if CLIENT_ADDRESS:
    info_right_data.append([cell(CLIENT_ADDRESS, sz=9)])

info_right_t = Table(info_right_data, colWidths=[doc.width - 7.5 * cm])
info_right_t.setStyle(TableStyle([
    ('TOPPADDING', (0, 0), (-1, -1), 3),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 3),
    ('LEFTPADDING', (0, 0), (-1, -1), 0),
    ('RIGHTPADDING', (0, 0), (-1, -1), 0),
    ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
]))

info_wrapper = Table([[info_left_t, info_right_t]], colWidths=[7.5 * cm, doc.width - 7.5 * cm])
info_wrapper.setStyle(TableStyle([
    ('VALIGN', (0, 0), (-1, -1), 'TOP'),
    ('LEFTPADDING', (0, 0), (-1, -1), 0),
    ('RIGHTPADDING', (0, 0), (-1, -1), 0),
]))
elements.append(info_wrapper)
elements.append(Spacer(1, 10))
elements.append(thin_div())

# ================================================================
# ITEM TABLE
# ================================================================
elements.append(Paragraph('RINCIAN LAYANAN', s_label))
elements.append(Spacer(1, 6))

# Header row
header = [
    cell('Layanan', bold=True, color=WHITE, sz=9),
    cell('Deskripsi', bold=True, color=WHITE, sz=9),
    cell('Qty', bold=True, color=WHITE, center=True, sz=9),
    cell('Harga', bold=True, color=WHITE, right=True, sz=9),
]

item_rows = [header]
subtotal = 0
for name, desc, qty, price in ITEMS:
    subtotal += qty * price
    item_rows.append([
        cell(name, bold=True, color=PRIMARY, sz=9.5),
        cell(desc, sz=8.5),
        cell(str(qty), center=True, sz=9.5),
        cell(format_rupiah(qty * price), right=True, sz=9.5),
    ])

col_w = [4.5 * cm, doc.width - 4.5 * cm - 2 * cm - 3.5 * cm, 2 * cm, 3.5 * cm]
item_t = Table(item_rows, colWidths=col_w)

style_cmds = [
    # Header
    ('BACKGROUND', (0, 0), (-1, 0), PRIMARY),
    ('TOPPADDING', (0, 0), (-1, 0), 10),
    ('BOTTOMPADDING', (0, 0), (-1, 0), 10),
    # All cells
    ('TOPPADDING', (0, 1), (-1, -1), 10),
    ('BOTTOMPADDING', (0, 1), (-1, -1), 10),
    ('LEFTPADDING', (0, 0), (-1, -1), 12),
    ('RIGHTPADDING', (0, 0), (-1, -1), 12),
    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ('LINEBELOW', (0, 1), (-1, -1), 0.5, BORDER),
]
# Alternating row bg
for i in range(1, len(item_rows)):
    if i % 2 == 1:
        style_cmds.append(('BACKGROUND', (0, i), (-1, i), SECTION_BG))

item_t.setStyle(TableStyle(style_cmds))
elements.append(item_t)
elements.append(Spacer(1, 8))

# ── Totals ──
total = subtotal

totals_data = [
    [cell('Subtotal', bold=True, color=TEXT_BODY, sz=10),
     cell(format_rupiah(subtotal), right=True, sz=10)],
    [cell('TOTAL', bold=True, color=PRIMARY, sz=12),
     cell(format_rupiah(total), bold=True, right=True, color=PRIMARY, sz=12)],
]

totals_t = Table(totals_data, colWidths=[doc.width - 4.5 * cm, 4.5 * cm])
totals_t.setStyle(TableStyle([
    ('TOPPADDING', (0, 0), (-1, -1), 6),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
    ('LEFTPADDING', (0, 0), (-1, -1), 12),
    ('RIGHTPADDING', (0, 0), (-1, -1), 12),
    ('ALIGN', (0, 0), (0, -1), 'RIGHT'),
    ('ALIGN', (1, 0), (1, -1), 'RIGHT'),
    ('LINEABOVE', (0, 1), (-1, 1), 1, PRIMARY),
    ('TOPPADDING', (0, 1), (-1, 1), 10),
    ('BOTTOMPADDING', (0, 1), (-1, 1), 10),
    ('BACKGROUND', (0, 1), (-1, 1), SECTION_BG),
]))
elements.append(totals_t)
elements.append(Spacer(1, 14))

# ================================================================
# PAYMENT INFO
# ================================================================
elements.append(Paragraph('INFORMASI PEMBAYARAN', s_label))
elements.append(Spacer(1, 4))

bank_data = [
    [Paragraph('Transfer ke rekening berikut:', ParagraphStyle(
        '', fontName='Helvetica', fontSize=9.5, leading=14, textColor=ACCENT_LIGHT))],
    [Spacer(1, 6)],
    [Table(
        [
            [cell('Bank', bold=True, color=ACCENT_LIGHT, sz=9),
             cell(BANK_NAME, color=WHITE, sz=10)],
            [cell('No. Rekening', bold=True, color=ACCENT_LIGHT, sz=9),
             cell(f'<b>{BANK_ACCOUNT}</b>', color=WHITE, sz=12)],
            [cell('Atas Nama', bold=True, color=ACCENT_LIGHT, sz=9),
             cell(f'<b>{BANK_HOLDER}</b>', color=WHITE, sz=10)],
        ],
        colWidths=[3.5 * cm, doc.width - 3.5 * cm - 40],
        style=TableStyle([
            ('TOPPADDING', (0, 0), (-1, -1), 5),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
            ('LEFTPADDING', (0, 0), (-1, -1), 0),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ])
    )],
]

bank_t = Table(bank_data, colWidths=[doc.width])
bank_t.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, -1), PRIMARY),
    ('TOPPADDING', (0, 0), (0, 0), 16),
    ('BOTTOMPADDING', (0, -1), (0, -1), 16),
    ('LEFTPADDING', (0, 0), (-1, -1), 20),
    ('RIGHTPADDING', (0, 0), (-1, -1), 20),
    ('ROUNDEDCORNERS', [6, 6, 6, 6]),
]))
elements.append(bank_t)
elements.append(Spacer(1, 10))

# ── Note ──
elements.append(Paragraph(
    '<b>Catatan:</b> Invoice ini sudah lunas. Terima kasih atas pembayaran Anda.',
    ParagraphStyle('', fontName='Helvetica', fontSize=9, leading=14,
                   textColor=TEXT_MUTED, alignment=TA_JUSTIFY)))

# ================================================================
doc.build(elements, onFirstPage=draw_background, onLaterPages=draw_background)
print(f'Invoice PDF saved to: {output_path}')
