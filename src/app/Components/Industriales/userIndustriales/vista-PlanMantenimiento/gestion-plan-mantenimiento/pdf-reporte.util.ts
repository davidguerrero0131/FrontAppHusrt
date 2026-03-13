import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const v = (val: any, fb = 'N/R') => (val != null && val !== '') ? String(val) : fb;
const fmtDate = (d: any) => {
    if (!d) return 'N/R';
    try { return new Date(d).toLocaleDateString('es-CO'); } catch { return 'N/R'; }
};

export function generarReporteMantenimientoPDF(reporte: any, equipo: any, rutina: any[] = []) {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'letter' });

    const pageW = doc.internal.pageSize.getWidth();
    const margins = { top: 10, left: 10, right: 10 };
    const W = pageW - margins.left - margins.right;
    const startX = margins.left;
    let Y = margins.top;

    const drawCell = (text: string, x: number, y: number, w: number, h: number, opts: any = {}) => {
        const { align = 'left', bold = false, fontSize = 7, bg = null } = opts;
        doc.setLineWidth(0.2);
        if (bg) {
            doc.setFillColor(bg[0] as number, bg[1] as number, bg[2] as number);
            doc.rect(x, y, w, h, 'FD');
        } else {
            doc.rect(x, y, w, h);
        }
        if (text) {
            doc.setFontSize(fontSize);
            doc.setFont('helvetica', bold ? 'bold' : 'normal');
            const padding = 1.5;
            const maxW = w - padding * 2;
            const lines = doc.splitTextToSize(text, maxW);
            const lineH = fontSize * 0.4;
            const totalH = lines.length * lineH;
            let textY = y + (h - totalH) / 2 + lineH * 0.8;
            const textX = align === 'center' ? x + w / 2 : x + padding;
            doc.text(lines, textX, textY, { align: align as any, maxWidth: maxW });
        }
    };

    // ─── HEADER ───
    const col1W = 35, col3W = 35, centerW = W - col1W - col3W;
    drawCell('CÓDIGO\nGE-F-XX', startX, Y, col1W, 13, { align: 'center', fontSize: 6 });
    drawCell('E.S.E HOSPITAL UNIVERSITARIO SAN RAFAEL DE TUNJA\nIII NIVEL DE ATENCIÓN\nREPORTE DE MANTENIMIENTO INDUSTRIAL', startX + col1W, Y, centerW, 13, { align: 'center', bold: true, fontSize: 8 });
    drawCell('VERSIÓN: 01', startX + col1W + centerW, Y, col3W, 13, { align: 'center', fontSize: 6 });
    Y += 15;

    // ─── EQUIPMENT INFO ───
    drawCell('INFORMACIÓN DEL EQUIPO', startX, Y, W, 6, { align: 'center', bold: true, fontSize: 9, bg: [220, 220, 220] });
    Y += 6;

    const half = W / 2;
    const quarter = W / 4;

    drawCell('Equipo:', startX, Y, quarter, 6, { bold: true, fontSize: 7 });
    drawCell(v(equipo?.nombres), startX + quarter, Y, half - quarter, 6, { fontSize: 7 });
    drawCell('Marca:', startX + half, Y, quarter, 6, { bold: true, fontSize: 7 });
    drawCell(v(equipo?.marca), startX + half + quarter, Y, half - quarter, 6, { fontSize: 7 });
    Y += 6;

    drawCell('Modelo:', startX, Y, quarter, 6, { bold: true, fontSize: 7 });
    drawCell(v(equipo?.modelo), startX + quarter, Y, half - quarter, 6, { fontSize: 7 });
    drawCell('Serie:', startX + half, Y, quarter, 6, { bold: true, fontSize: 7 });
    drawCell(v(equipo?.serie), startX + half + quarter, Y, half - quarter, 6, { fontSize: 7 });
    Y += 6;

    drawCell('Servicio:', startX, Y, quarter, 6, { bold: true, fontSize: 7 });
    drawCell(v(equipo?.servicioInd?.nombres), startX + quarter, Y, half - quarter, 6, { fontSize: 7 });
    drawCell('Ubicación:', startX + half, Y, quarter, 6, { bold: true, fontSize: 7 });
    drawCell(v(equipo?.ubicacionEspecifica), startX + half + quarter, Y, half - quarter, 6, { fontSize: 7 });
    Y += 8;

    // ─── REPORT DETAILS ───
    drawCell('DATOS DEL REPORTE', startX, Y, W, 6, { align: 'center', bold: true, fontSize: 9, bg: [220, 220, 220] });
    Y += 6;

    const thirdW = W / 3;
    drawCell('Fecha Inicio:', startX, Y, thirdW / 2, 6, { bold: true, fontSize: 7 });
    drawCell(fmtDate(reporte?.fechaRealizado), startX + thirdW / 2, Y, thirdW - thirdW / 2, 6, { fontSize: 7 });
    drawCell('Hora Inicio:', startX + thirdW, Y, thirdW / 2, 6, { bold: true, fontSize: 7 });
    drawCell(v(reporte?.horaInicio), startX + thirdW + thirdW / 2, Y, thirdW - thirdW / 2, 6, { fontSize: 7 });
    drawCell('Hora Total:', startX + 2 * thirdW, Y, thirdW / 2, 6, { bold: true, fontSize: 7 });
    drawCell(v(reporte?.horaTotal), startX + 2 * thirdW + thirdW / 2, Y, thirdW - thirdW / 2, 6, { fontSize: 7 });
    Y += 6;

    drawCell('Fecha Fin:', startX, Y, thirdW / 2, 6, { bold: true, fontSize: 7 });
    drawCell(fmtDate(reporte?.fechaFin), startX + thirdW / 2, Y, thirdW - thirdW / 2, 6, { fontSize: 7 });
    drawCell('Hora Fin:', startX + thirdW, Y, thirdW / 2, 6, { bold: true, fontSize: 7 });
    drawCell(v(reporte?.horaTerminacion), startX + thirdW + thirdW / 2, Y, thirdW - thirdW / 2, 6, { fontSize: 7 });
    drawCell('Calificación:', startX + 2 * thirdW, Y, thirdW / 2, 6, { bold: true, fontSize: 7 });
    drawCell(v(reporte?.calificacion), startX + 2 * thirdW + thirdW / 2, Y, thirdW - thirdW / 2, 6, { fontSize: 7 });
    Y += 6;

    drawCell('Tipo Mantenimiento:', startX, Y, quarter, 6, { bold: true, fontSize: 7 });
    drawCell(v(reporte?.tipoMantenimiento), startX + quarter, Y, half - quarter, 6, { fontSize: 7 });
    drawCell('Tipo de Falla:', startX + half, Y, quarter, 6, { bold: true, fontSize: 7 });
    drawCell(v(reporte?.tipoFalla), startX + half + quarter, Y, half - quarter, 6, { fontSize: 7 });
    Y += 8;

    // Work Done
    drawCell('TRABAJO REALIZADO:', startX, Y, quarter, 10, { bold: true, fontSize: 7 });
    drawCell(v(reporte?.trabajoRealizado), startX + quarter, Y, W - quarter, 10, { fontSize: 7 });
    Y += 10;

    // Motivo
    drawCell('MOTIVO:', startX, Y, quarter, 10, { bold: true, fontSize: 7 });
    drawCell(v(reporte?.motivo), startX + quarter, Y, W - quarter, 10, { fontSize: 7 });
    Y += 10;

    // Observations
    drawCell('OBSERVACIONES:', startX, Y, quarter, 10, { bold: true, fontSize: 7 });
    drawCell(v(reporte?.observaciones), startX + quarter, Y, W - quarter, 10, { fontSize: 7 });
    Y += 12;

    // ─── SIGNATORIES ───
    drawCell('DATOS DEL TÉCNICO Y RECIBIDO POR', startX, Y, W, 6, { align: 'center', bold: true, fontSize: 9, bg: [220, 220, 220] });
    Y += 6;

    drawCell('Realizado Por:', startX, Y, quarter, 6, { bold: true, fontSize: 7 });
    drawCell(v(reporte?.usuario?.nombreCompleto ?? reporte?.usuario?.nombre), startX + quarter, Y, half - quarter, 6, { fontSize: 7 });
    drawCell('Recibido Por:', startX + half, Y, quarter, 6, { bold: true, fontSize: 7 });
    drawCell(v(reporte?.nombreRecibio), startX + half + quarter, Y, half - quarter, 6, { fontSize: 7 });
    Y += 6;

    drawCell('C.C. Recibió:', startX, Y, quarter, 6, { bold: true, fontSize: 7 });
    drawCell(v(reporte?.cedulaRecibio), startX + quarter, Y, half - quarter, 6, { fontSize: 7 });
    Y += 14;

    // Signature lines
    const sigW = W / 2 - 10;
    drawCell('', startX + 5, Y, sigW, 0.3, {});
    drawCell('', startX + W / 2 + 5, Y, sigW, 0.3, {});
    Y += 2;
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.text('FIRMA TÉCNICO RESPONSABLE', startX + 5 + sigW / 2, Y, { align: 'center' });
    doc.text('FIRMA RECIBIDO', startX + W / 2 + 5 + sigW / 2, Y, { align: 'center' });
    Y += 10;

    // ─── PROTOCOL (if any) ───
    if (rutina && rutina.length > 0) {
        drawCell('RUTINA DE MANTENIMIENTO', startX, Y, W, 6, { align: 'center', bold: true, fontSize: 9, bg: [220, 220, 220] });
        Y += 6;
        autoTable(doc, {
            startY: Y,
            head: [['#', 'Descripción', 'Estado']],
            body: rutina.map((item: any, i: number) => [
                i + 1,
                item.protocoloPreventivo?.paso ?? `Paso ${item.protocoloPreventivoIdFk}`,
                item.cumple ?? 'N/R'
            ]),
            styles: { fontSize: 7 },
            headStyles: { fillColor: [50, 50, 50] },
            margin: { left: startX, right: margins.right },
        });
    }

    // ─── FOOTER ───
    const totalPages = (doc as any).internal.getNumberOfPages();
    for (let p = 1; p <= totalPages; p++) {
        doc.setPage(p);
        const footerY = doc.internal.pageSize.getHeight() - 8;
        doc.setFontSize(6);
        doc.setFont('helvetica', 'normal');
        doc.text(`Página ${p} de ${totalPages}`, pageW / 2, footerY, { align: 'center' });
        doc.text(`Generado: ${new Date().toLocaleString('es-CO')}`, startX, footerY);
    }

    return doc;
}
